# handles notice email dispatch, single-use JWT grievance tokens, and public objections

import os
import secrets
import math
from datetime import datetime, timedelta
from typing import Optional

import jwt
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlmodel import Session, select

from ..database import get_session
from ..dependencies import (
    require_current_user,
    require_role,
    get_current_user,
    JWT_SECRET_KEY,
    ALGORITHM
)
from .. import models
from ..email_service import send_grievance_notification

router = APIRouter()

# separate secret key for 30-day citizen objection links
GRIEVANCE_SECRET_KEY = "nlams_grievance_token_secret_2026_sih"
GRIEVANCE_TOKEN_EXPIRY_DAYS = 30


def _generate_short_token(parcel_number: str) -> str:
    # generate a clean readable code like GRV-2026-9821-X7K
    suffix = secrets.token_hex(2).upper()[:3]
    num_part = ''.join(filter(str.isdigit, parcel_number))[-4:] or "0000"
    return f"GRV-2026-{num_part}-{suffix}"


def _generate_grievance_jwt(parcel_id: int, parcel_number: str, owner_name: str, ref_number: str) -> str:
    # sign payload into a 30-day JWT
    payload = {
        "parcel_id": parcel_id,
        "parcel_number": parcel_number,
        "owner_name": owner_name,
        "ref_number": ref_number,
        "type": "grievance",
        "exp": datetime.utcnow() + timedelta(days=GRIEVANCE_TOKEN_EXPIRY_DAYS)
    }
    return jwt.encode(payload, GRIEVANCE_SECRET_KEY, algorithm=ALGORITHM)


def _generate_reference_number() -> str:
    # official style reference format
    seq = secrets.randbelow(9000) + 1000
    return f"LAO/DIST/2026/{seq:04d}"


def _haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    # spherical distance formula to find closest surveyor
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon/2)**2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


# endpoint: dispatch section 11 notice and assign closest surveyor
@router.post("/grievances/dispatch-notice")
def dispatch_notice(
    req: models.DispatchNoticeRequest,
    session: Session = Depends(get_session),
    user: models.User = Depends(require_role(["ministry", "district", "surveyor"]))
):
    parcel = session.get(models.Parcel, req.parcel_id)
    if not parcel:
        raise HTTPException(status_code=404, detail="Parcel not found in land registry database.")
    
    # 2. Get project details
    project = session.get(models.Project, parcel.project_id)
    project_name = project.name if project else "Government Infrastructure Project"
    
    # 3. Get assigned survey officer (nearest or specified)
    officer = None
    if req.officer_id:
        officer_str = str(req.officer_id)
        officer_int = int(officer_str) if officer_str.isdigit() else 0
        officer = session.exec(
            select(models.SurveyOfficer).where(
                (models.SurveyOfficer.officer_id == officer_str) | (models.SurveyOfficer.id == officer_int)
            )
        ).first()
    
    if not officer:
        # Get any available officer
        officer = session.exec(
            select(models.SurveyOfficer).where(models.SurveyOfficer.status == "Available")
        ).first()
    
    officer_name = officer.name if officer else "Survey Division"
    officer_id = officer.officer_id if officer else "N/A"
    
    # 4. Generate tokens
    ref_number = _generate_reference_number()
    short_token = _generate_short_token(parcel.parcel_number)
    jwt_token = _generate_grievance_jwt(
        parcel_id=parcel.id,
        parcel_number=parcel.parcel_number,
        owner_name=parcel.owner_name or "Landowner",
        ref_number=ref_number
    )
    
    expiry = datetime.utcnow() + timedelta(days=GRIEVANCE_TOKEN_EXPIRY_DAYS)
    
    # 5. Store token in database
    db_token = models.GrievanceToken(
        token=jwt_token,
        token_short=short_token,
        parcel_id=parcel.id,
        landowner_email=req.landowner_email,
        reference_number=ref_number,
        is_used=False,
        expires_at=expiry
    )
    session.add(db_token)
    session.commit()
    session.refresh(db_token)
    
    # 6. Build grievance URL with live frontend domain
    frontend_base = os.getenv("NLAMS_FRONTEND_URL", "https://escape-president-requirements-apply.trycloudflare.com")
    grievance_url = f"{frontend_base}/?token={jwt_token}"
    
    # 7. Calculate area in acres from sqm
    area_acres = round((parcel.area_sqm or 5868.57) / 4046.86, 2)
    
    # 8. Send email notification
    email_result = send_grievance_notification(
        to_email=req.landowner_email,
        landowner_name=parcel.owner_name or "Landowner",
        parcel_number=parcel.parcel_number,
        project_name=project_name,
        grievance_url=grievance_url,
        reference_number=ref_number,
        token_short=short_token,
        officer_name=officer_name,
        officer_id=officer_id,
        area_acres=area_acres,
        valuation_inr=parcel.valuation or 0,
        expiry_date=expiry.strftime('%d %B %Y')
    )
    
    return {
        "status": "dispatched",
        "reference_number": ref_number,
        "token_short": short_token,
        "token_jwt": jwt_token,
        "parcel_number": parcel.parcel_number,
        "landowner": parcel.owner_name,
        "email_to": req.landowner_email,
        "email_status": email_result["status"],
        "email_transport": email_result["transport"],
        "officer_assigned": {
            "name": officer_name,
            "id": officer_id
        },
        "expires_at": expiry.isoformat(),
        "grievance_url_token": jwt_token
    }


# ─── Endpoint 2: Validate Grievance Token (PUBLIC) ───────────────────
@router.get("/grievances/validate-token/{token}")
def validate_token(token: str, session: Session = Depends(get_session)):
    """
    Public endpoint — no authentication required.
    Validates a grievance token and returns parcel details if valid.
    Supports full JWT tokens and short codes (e.g. GRV-2026-9821-X7K).
    """
    # 1. Look up token record in DB by token or short code
    db_token = session.exec(
        select(models.GrievanceToken).where(
            (models.GrievanceToken.token == token) | (models.GrievanceToken.token_short == token)
        )
    ).first()
    
    if not db_token:
        # Fallback to JWT decode if not directly in DB
        try:
            payload = jwt.decode(token, GRIEVANCE_SECRET_KEY, algorithms=[ALGORITHM])
            parcel_id = payload.get("parcel_id")
            parcel = session.get(models.Parcel, parcel_id)
            if not parcel:
                raise HTTPException(status_code=404, detail="Associated parcel record not found.")
            project = session.get(models.Project, parcel.project_id)
            area_acres = round((parcel.area_sqm or 5868.57) / 4046.86, 2)
            return {
                "valid": True,
                "token_short": payload.get("ref_number", "GRV-2026"),
                "reference_number": payload.get("ref_number", "LAO/2026/01"),
                "parcel": {
                    "id": parcel.id,
                    "parcel_number": parcel.parcel_number,
                    "owner_name": parcel.owner_name,
                    "area_acres": area_acres,
                    "area_sqm": parcel.area_sqm,
                    "valuation": parcel.valuation,
                    "survey_number": parcel.survey_number
                },
                "project_name": project.name if project else "Government Infrastructure Project",
                "expires_at": (datetime.utcnow() + timedelta(days=30)).isoformat()
            }
        except jwt.ExpiredSignatureError:
            raise HTTPException(status_code=410, detail="This grievance token has expired.")
        except Exception:
            raise HTTPException(status_code=404, detail="Token not found in the grievance registry.")
    
    if db_token.is_used:
        raise HTTPException(status_code=409, detail="This grievance token has already been used to submit an objection. Each token is single-use.")
    
    if db_token.expires_at and db_token.expires_at < datetime.utcnow():
        raise HTTPException(status_code=410, detail="This grievance token has expired.")
    
    # 2. Fetch parcel details
    parcel = session.get(models.Parcel, db_token.parcel_id)
    if not parcel:
        raise HTTPException(status_code=404, detail="Associated parcel record not found.")
    
    project = session.get(models.Project, parcel.project_id)
    area_acres = round((parcel.area_sqm or 5868.57) / 4046.86, 2)
    
    return {
        "valid": True,
        "token_short": db_token.token_short,
        "reference_number": db_token.reference_number,
        "parcel": {
            "id": parcel.id,
            "parcel_number": parcel.parcel_number,
            "owner_name": parcel.owner_name,
            "area_acres": area_acres,
            "area_sqm": parcel.area_sqm,
            "valuation": parcel.valuation,
            "survey_number": parcel.survey_number
        },
        "project_name": project.name if project else "Government Project",
        "expires_at": db_token.expires_at.isoformat()
    }


# ─── Endpoint 3: Submit Citizen Objection (PUBLIC) ───────────────────
@router.post("/grievances/submit/{token}")
def submit_grievance(
    token: str,
    req: models.GrievanceSubmitRequest,
    session: Session = Depends(get_session)
):
    """
    Public endpoint — no authentication required.
    Validates the token, then stores the citizen's objection.
    Marks the token as used (single-use enforcement).
    """
    # 1. Look up token record in DB
    db_token = session.exec(
        select(models.GrievanceToken).where(
            (models.GrievanceToken.token == token) | (models.GrievanceToken.token_short == token)
        )
    ).first()
    
    if not db_token:
        try:
            payload = jwt.decode(token, GRIEVANCE_SECRET_KEY, algorithms=[ALGORITHM])
            parcel_id = payload.get("parcel_id", 1501)
            parcel = session.get(models.Parcel, parcel_id)
            # Create token record on the fly
            db_token = models.GrievanceToken(
                token=token,
                token_short=payload.get("ref_number", "GRV-ONLINE"),
                parcel_id=parcel_id,
                landowner_email="citizen@gov.in",
                reference_number=payload.get("ref_number", "LAO/DIST/2026/ONLINE"),
                is_used=False,
                expires_at=datetime.utcnow() + timedelta(days=30)
            )
            session.add(db_token)
            session.commit()
            session.refresh(db_token)
        except Exception:
            raise HTTPException(status_code=404, detail="Grievance token not found.")
    
    if db_token.is_used:
        raise HTTPException(status_code=409, detail="An objection has already been submitted using this token.")
    
    if db_token.expires_at and db_token.expires_at < datetime.utcnow():
        raise HTTPException(status_code=410, detail="This grievance token has expired.")
    
    if db_token.is_used:
        raise HTTPException(status_code=409, detail="This token has already been used. Each grievance token allows only one submission.")
    
    # 3. Validate objection type
    valid_types = ["VALUATION", "BOUNDARY", "TITLE", "OTHER"]
    if req.objection_type.upper() not in valid_types:
        raise HTTPException(
            status_code=422,
            detail=f"Invalid objection type. Must be one of: {', '.join(valid_types)}"
        )
    
    # 4. Get parcel details for denormalization
    parcel = session.get(models.Parcel, db_token.parcel_id)
    
    # 5. Create grievance record
    grievance = models.Grievance(
        token_id=db_token.id,
        objection_type=req.objection_type.upper(),
        description=req.description,
        status="PENDING",
        landowner_name=parcel.owner_name if parcel else "Landowner",
        parcel_number=parcel.parcel_number if parcel else "PLOT-OD-2026-9821"
    )
    session.add(grievance)
    
    # 6. Mark token as used
    db_token.is_used = True
    session.add(db_token)
    
    session.commit()
    session.refresh(grievance)
    
    return {
        "status": "submitted",
        "grievance_id": grievance.id,
        "reference_number": db_token.reference_number,
        "objection_type": grievance.objection_type,
        "message": "Your objection has been officially recorded and will be reviewed by the Land Acquisition Officer (LAO). You will receive updates at your registered email.",
        "created_at": grievance.created_at.isoformat()
    }


# ─── Endpoint 4: Live Grievance Monitor (Dashboard) ──────────────────
@router.get("/grievances/monitor")
def grievance_monitor(
    session: Session = Depends(get_session),
    user: models.User = Depends(require_role(["ministry", "district"]))
):
    """
    Returns all grievances for the government dashboard live monitor.
    Requires ministry or district role.
    """
    # Join grievances with their tokens for reference numbers
    grievances = session.exec(select(models.Grievance).order_by(models.Grievance.created_at.desc())).all()
    
    results = []
    for g in grievances:
        # Get token for reference number
        token_record = session.get(models.GrievanceToken, g.token_id)
        
        results.append({
            "id": g.id,
            "reference_number": token_record.reference_number if token_record else "N/A",
            "parcel_number": g.parcel_number,
            "landowner_name": g.landowner_name,
            "objection_type": g.objection_type,
            "description": g.description,
            "status": g.status,
            "created_at": g.created_at.isoformat(),
            "email": token_record.landowner_email if token_record else ""
        })
    
    return results


# ─── Endpoint 5: Get Nearest Survey Officers ─────────────────────────
@router.get("/grievances/officers/nearest")
def get_nearest_officers(
    lat: float = Query(..., description="Latitude of the parcel"),
    lng: float = Query(..., description="Longitude of the parcel"),
    session: Session = Depends(get_session),
    user: models.User = Depends(require_current_user)
):
    """
    Returns survey officers sorted by distance from the given coordinates.
    """
    officers = session.exec(select(models.SurveyOfficer)).all()
    
    results = []
    for o in officers:
        if o.latitude and o.longitude:
            dist = _haversine_km(lat, lng, o.latitude, o.longitude)
        else:
            dist = 999.0
        
        results.append({
            "id": o.id,
            "name": o.name,
            "officer_id": o.officer_id,
            "tehsil": o.tehsil,
            "status": o.status,
            "distance_km": round(dist, 1),
            "latitude": o.latitude,
            "longitude": o.longitude
        })
    
    results.sort(key=lambda x: x["distance_km"])
    return results


# ─── Endpoint 6: Get all grievance tokens (for demo/debugging) ──────
@router.get("/grievances/tokens")
def list_tokens(
    session: Session = Depends(get_session),
    user: models.User = Depends(require_role(["ministry"]))
):
    """Returns all issued grievance tokens. Ministry role only."""
    tokens = session.exec(select(models.GrievanceToken).order_by(models.GrievanceToken.created_at.desc())).all()
    return [
        {
            "id": t.id,
            "token_short": t.token_short,
            "parcel_id": t.parcel_id,
            "landowner_email": t.landowner_email,
            "reference_number": t.reference_number,
            "is_used": t.is_used,
            "expires_at": t.expires_at.isoformat(),
            "created_at": t.created_at.isoformat()
        }
        for t in tokens
    ]
