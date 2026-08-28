from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from ..database import get_session
from ..dependencies import verify_api_key
from .. import models, schemas

router = APIRouter()

@router.post("/parcels", response_model=schemas.ParcelRead, status_code=status.HTTP_201_CREATED)
def create_parcel(
    parcel: schemas.ParcelCreate, 
    session: Session = Depends(get_session),
    _auth: str = Depends(verify_api_key)
):
    project = session.get(models.Project, parcel.project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Associated project not found")
    db_parcel = models.Parcel.from_orm(parcel)
    session.add(db_parcel)
    session.commit()
    session.refresh(db_parcel)
    return db_parcel

@router.get("/parcels", response_model=list[schemas.ParcelRead])
def read_parcels(skip: int = 0, limit: int = 100, session: Session = Depends(get_session)):
    parcels = session.exec(select(models.Parcel).offset(skip).limit(limit)).all()
    return parcels

@router.get("/parcels/{parcel_id}", response_model=schemas.ParcelRead)
def read_parcel(parcel_id: int, session: Session = Depends(get_session)):
    parcel = session.get(models.Parcel, parcel_id)
    if not parcel:
        raise HTTPException(status_code=404, detail="Parcel not found")
    return parcel

@router.put("/parcels/{parcel_id}", response_model=schemas.ParcelRead)
def update_parcel(
    parcel_id: int, 
    parcel_update: schemas.ParcelCreate, 
    session: Session = Depends(get_session),
    _auth: str = Depends(verify_api_key)
):
    parcel = session.get(models.Parcel, parcel_id)
    if not parcel:
        raise HTTPException(status_code=404, detail="Parcel not found")
    parcel_data = parcel_update.dict(exclude_unset=True)
    for key, value in parcel_data.items():
        setattr(parcel, key, value)
    session.add(parcel)
    session.commit()
    session.refresh(parcel)
    return parcel

@router.delete("/parcels/{parcel_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_parcel(
    parcel_id: int, 
    session: Session = Depends(get_session),
    _auth: str = Depends(verify_api_key)
):
    parcel = session.get(models.Parcel, parcel_id)
    if not parcel:
        raise HTTPException(status_code=404, detail="Parcel not found")
    session.delete(parcel)
    session.commit()
    return
