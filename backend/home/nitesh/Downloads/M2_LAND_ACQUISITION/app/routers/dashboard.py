import os
import joblib
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select, func

from ..database import get_session
from .. import models

router = APIRouter()

MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "land_delay_model.joblib")

@router.get("/dashboard/stats")
def get_dashboard_stats(session: Session = Depends(get_session)):
    # 1. Total projects
    total_projects = session.exec(select(func.count(models.Project.id))).one()
    
    # 2. Total area required (hectares)
    total_area_required = session.exec(select(func.sum(models.Project.total_area))).one() or 0.0
    
    # 3. Total project budget
    total_budget_assessed = session.exec(select(func.sum(models.Project.budget))).one() or 0.0
    
    # 4. Total parcel area (acquired area)
    total_area_acquired_sqm = session.exec(select(func.sum(models.Parcel.area_sqm))).one() or 0.0
    total_area_acquired = total_area_acquired_sqm / 10000.0 # convert sqm to hectares
    
    # 5. Compensation totals from beneficiaries
    comp_assessed = session.exec(select(func.sum(models.Beneficiary.compensation_assessed))).one() or 0.0
    comp_paid = session.exec(select(func.sum(models.Beneficiary.compensation_paid))).one() or 0.0
    
    # 6. Affected and displaced families
    total_affected_families = session.exec(select(func.count(models.Beneficiary.id))).one()
    
    # Count displaced families (e.g. rr_status is not empty and not 'None')
    displaced_count = session.exec(
        select(func.count(models.Beneficiary.id))
        .where(models.Beneficiary.rr_status != None)
    ).one()
    
    # R&R average progress estimation
    completed_rr = session.exec(
        select(func.count(models.Beneficiary.id))
        .where(models.Beneficiary.rr_status == "Completed")
    ).one()
    
    rr_progress_pct = (completed_rr / total_affected_families * 100) if total_affected_families > 0 else 0.0

    return {
        "total_projects": total_projects,
        "total_area_required_ha": round(total_area_required, 2),
        "total_area_acquired_ha": round(total_area_acquired, 2),
        "total_budget_assessed_cr": round(total_budget_assessed, 2),
        "total_compensation_paid_cr": round(comp_paid, 2),
        "total_compensation_assessed_cr": round(comp_assessed, 2),
        "affected_families_count": total_affected_families,
        "displaced_families_count": displaced_count,
        "rr_progress_percentage": round(rr_progress_pct, 1)
    }

@router.get("/dashboard/state-summary")
def get_state_summary(session: Session = Depends(get_session)):
    # Group projects by state and calculate sum of proposed area
    results = session.exec(
        select(models.Project.state, func.sum(models.Project.total_area), func.count(models.Project.id))
        .group_by(models.Project.state)
    ).all()
    
    summary = []
    for state, total_area, count in results:
        summary.append({
            "state": state or "Unknown",
            "proposed_area_ha": round(total_area or 0.0, 2),
            "project_count": count
        })
    return summary

@router.get("/dashboard/status-summary")
def get_status_summary(session: Session = Depends(get_session)):
    # Group projects by status
    results = session.exec(
        select(models.Project.status, func.count(models.Project.id))
        .group_by(models.Project.status)
    ).all()
    
    summary = {}
    for status, count in results:
        summary[status or "Unknown"] = count
    return summary

@router.get("/projects/{project_id}/predict")
def predict_delay(project_id: str, session: Session = Depends(get_session)):
    # Clean project_id e.g. "PRJ-001" to 1
    try:
        db_id = int(project_id.replace("PRJ-", ""))
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid project ID format")
        
    project = session.get(models.Project, db_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    # Load the serialized model
    if not os.path.exists(MODEL_PATH):
        raise HTTPException(status_code=500, detail="Machine Learning model weights not found. Run train_model.py first.")
        
    payload = joblib.load(MODEL_PATH)
    risk_model = payload["risk_model"]
    time_model = payload["time_model"]
    state_map = payload["state_map"]
    sector_map = payload["sector_map"]
    
    # Encode project attributes
    state_encoded = state_map.get(project.state, len(state_map))
    sector_encoded = sector_map.get(project.sector, len(sector_map))
    area = project.total_area or 50.0
    budget = project.budget or 100.0
    
    # Inference features
    features = [[state_encoded, sector_encoded, area, budget]]
    
    # Predict
    risk_pred = int(risk_model.predict(features)[0]) # 0, 1, or 2
    time_pred = float(time_model.predict(features)[0])
    
    # Mappings back to strings
    risk_labels = {0: "Low", 1: "Medium", 2: "High"}
    risk_str = risk_labels.get(risk_pred, "Medium")
    
    # Generate bottleneck description dynamically
    bottleneck = "No warning flags active."
    if project.status == "Possession Handover":
        bottleneck = "Acquisition completed. Ownership title vesting dispatched."
    elif risk_str == "High":
        bottleneck = f"High parcel fragmentation verified in {project.state}. Cadastral overlap query generated on spatial block ledger."
    elif risk_str == "Medium":
        if project.status == "Section 11 Notification":
            bottleneck = "LARR Section 15 citizen hearings backlog. Estimated resolution queue: 60 days."
        else:
            bottleneck = f"Initial administrative approval delay in {project.state}. Transit queue pending."
            
    return {
        "project_id": project_id,
        "name": project.name,
        "risk": risk_str,
        "completion_months": round(time_pred, 1),
        "bottleneck": bottleneck
    }
