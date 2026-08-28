from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from ..database import get_session
from ..dependencies import verify_api_key
from .. import models, schemas

router = APIRouter()

@router.post("/projects", response_model=schemas.ProjectRead, status_code=status.HTTP_201_CREATED)
def create_project(
    project: schemas.ProjectCreate, 
    session: Session = Depends(get_session),
    _auth: str = Depends(verify_api_key)
):
    db_project = models.Project.from_orm(project)
    session.add(db_project)
    session.commit()
    session.refresh(db_project)
    return db_project

@router.get("/projects", response_model=list[schemas.ProjectRead])
def read_projects(skip: int = 0, limit: int = 100, session: Session = Depends(get_session)):
    projects = session.exec(select(models.Project).offset(skip).limit(limit)).all()
    return projects

@router.get("/projects/{project_id}", response_model=schemas.ProjectRead)
def read_project(project_id: int, session: Session = Depends(get_session)):
    project = session.get(models.Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.put("/projects/{project_id}", response_model=schemas.ProjectRead)
def update_project(
    project_id: int, 
    project_update: schemas.ProjectCreate, 
    session: Session = Depends(get_session),
    _auth: str = Depends(verify_api_key)
):
    project = session.get(models.Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    project_data = project_update.dict(exclude_unset=True)
    for key, value in project_data.items():
        setattr(project, key, value)
    session.add(project)
    session.commit()
    session.refresh(project)
    return project

@router.delete("/projects/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(
    project_id: int, 
    session: Session = Depends(get_session),
    _auth: str = Depends(verify_api_key)
):
    project = session.get(models.Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    session.delete(project)
    session.commit()
    return

@router.get("/projects/{project_id}/summary")
def project_summary(project_id: int, session: Session = Depends(get_session)):
    project = session.get(models.Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    parcel_count = session.exec(select(models.Parcel).where(models.Parcel.project_id == project_id)).count()
    beneficiary_count = (
        session.exec(
            select(models.Beneficiary).where(models.Beneficiary.parcel_id.in_(select(models.Parcel.id).where(models.Parcel.project_id == project_id)))
        ).count()
    )
    return {
        "project_id": project_id,
        "name": project.name,
        "parcel_count": parcel_count,
        "beneficiary_count": beneficiary_count,
    }
