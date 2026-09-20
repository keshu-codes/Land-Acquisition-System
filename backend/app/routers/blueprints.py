"""
Blueprint & 3D Model API Router
Handles blueprint uploads, parcel association, Blender 3D processing, and file serving.
"""

import os
import uuid
import shutil
from typing import List, Optional
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from fastapi.responses import FileResponse
from sqlmodel import Session, select

from ..database import get_session
from ..dependencies import require_current_user, require_role
from .. import models
from ..blender_processor import process_blueprint_to_3d

router = APIRouter()

# Storage Directories
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
BLUEPRINT_DIR = os.path.join(BASE_DIR, "storage", "blueprints")
MODEL_3D_DIR = os.path.join(BASE_DIR, "storage", "models_3d")

os.makedirs(BLUEPRINT_DIR, exist_ok=True)
os.makedirs(MODEL_3D_DIR, exist_ok=True)

ALLOWED_EXTENSIONS = {".png", ".jpg", ".jpeg", ".pdf", ".svg"}


@router.post("/blueprints/upload", response_model=models.Blueprint3DRead, status_code=status.HTTP_201_CREATED)
async def upload_blueprint(
    file: UploadFile = File(...),
    title: str = Form(...),
    parcel_id: int = Form(...),
    project_id: int = Form(...),
    building_type: str = Form("Commercial Complex"),
    floors: int = Form(3),
    height_meters: float = Form(12.0),
    session: Session = Depends(get_session),
    user: models.User = Depends(require_role(["ministry", "state", "district", "surveyor"]))
):
    """Uploads a blueprint file and creates a Blueprint3D DB entry."""
    # 1. Validate parcel & project
    parcel = session.get(models.Parcel, parcel_id)
    if not parcel:
        raise HTTPException(status_code=404, detail="Selected land parcel not found in registry.")
    
    project = session.get(models.Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Selected infrastructure project not found.")
        
    # 2. Validate file extension
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format '{ext}'. Allowed extensions are: {', '.join(ALLOWED_EXTENSIONS)}"
        )
        
    # 3. Save uploaded file securely
    unique_prefix = uuid.uuid4().hex[:8]
    safe_filename = f"blueprint_{parcel_id}_{unique_prefix}{ext}"
    saved_path = os.path.join(BLUEPRINT_DIR, safe_filename)
    
    with open(saved_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    blueprint_url = f"/api/v1/blueprints/files/blueprint/{safe_filename}"
    
    # 4. Create DB record
    db_blueprint = models.Blueprint3D(
        title=title,
        parcel_id=parcel_id,
        project_id=project_id,
        building_type=building_type,
        floors=floors,
        height_meters=height_meters,
        blueprint_filename=safe_filename,
        blueprint_url=blueprint_url,
        status="PENDING",
        rendering_engine="Blender 3D Native / Wavefront Engine"
    )
    session.add(db_blueprint)
    session.commit()
    session.refresh(db_blueprint)
    return db_blueprint


@router.post("/blueprints/{blueprint_id}/process", response_model=models.Blueprint3DRead)
def process_blueprint(
    blueprint_id: int,
    session: Session = Depends(get_session),
    user: models.User = Depends(require_role(["ministry", "state", "district", "surveyor"]))
):
    """Triggers Blender 3D processing to generate a 3D Wavefront OBJ model."""
    blueprint = session.get(models.Blueprint3D, blueprint_id)
    if not blueprint:
        raise HTTPException(status_code=404, detail="Blueprint record not found.")
        
    blueprint_path = os.path.join(BLUEPRINT_DIR, blueprint.blueprint_filename)
    model_filename = f"model_3d_{blueprint.id}_{uuid.uuid4().hex[:6]}.obj"
    model_path = os.path.join(MODEL_3D_DIR, model_filename)
    
    blueprint.status = "PROCESSING"
    session.add(blueprint)
    session.commit()
    
    try:
        res = process_blueprint_to_3d(
            blueprint_path=blueprint_path,
            output_obj_path=model_path,
            floors=blueprint.floors,
            building_type=blueprint.building_type
        )
        
        blueprint.model_3d_filename = model_filename
        blueprint.model_3d_url = f"/api/v1/blueprints/files/model_3d/{model_filename}"
        blueprint.status = "COMPLETED"
        blueprint.rendering_engine = res.get("engine", "Blender 3D Native Engine")
        
        session.add(blueprint)
        session.commit()
        session.refresh(blueprint)
        return blueprint
    except Exception as e:
        blueprint.status = "FAILED"
        session.add(blueprint)
        session.commit()
        raise HTTPException(status_code=500, detail=f"3D Generation failed: {str(e)}")


@router.get("/blueprints/parcel/{parcel_id}", response_model=List[models.Blueprint3DRead])
def get_blueprints_for_parcel(parcel_id: int, session: Session = Depends(get_session)):
    """Retrieves all 3D blueprints for a given land parcel."""
    blueprints = session.exec(
        select(models.Blueprint3D)
        .where(models.Blueprint3D.parcel_id == parcel_id)
        .order_by(models.Blueprint3D.created_at.desc())
    ).all()
    return blueprints


@router.get("/blueprints", response_model=List[models.Blueprint3DRead])
def list_all_blueprints(session: Session = Depends(get_session)):
    """Retrieves list of all uploaded blueprints."""
    blueprints = session.exec(
        select(models.Blueprint3D).order_by(models.Blueprint3D.created_at.desc())
    ).all()
    return blueprints


@router.get("/blueprints/files/{file_type}/{filename}")
def serve_blueprint_file(file_type: str, filename: str):
    """Serves uploaded blueprint images and generated 3D OBJ model files securely."""
    if file_type == "blueprint":
        file_path = os.path.join(BLUEPRINT_DIR, filename)
    elif file_type == "model_3d":
        file_path = os.path.join(MODEL_3D_DIR, filename)
    else:
        raise HTTPException(status_code=400, detail="Invalid file type category.")
        
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found on server storage.")
        
    media_type = "text/plain"
    if filename.endswith(".png"):
        media_type = "image/png"
    elif filename.endswith((".jpg", ".jpeg")):
        media_type = "image/jpeg"
    elif filename.endswith(".pdf"):
        media_type = "application/pdf"
    elif filename.endswith(".obj"):
        media_type = "text/plain"
        
    return FileResponse(file_path, media_type=media_type)
