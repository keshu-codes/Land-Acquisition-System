from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from ..database import get_session
from ..dependencies import verify_api_key
from .. import models, schemas

router = APIRouter()

@router.post("/beneficiaries", response_model=schemas.BeneficiaryRead, status_code=status.HTTP_201_CREATED)
def create_beneficiary(
    beneficiary: schemas.BeneficiaryCreate, 
    session: Session = Depends(get_session),
    _auth: str = Depends(verify_api_key)
):
    parcel = session.get(models.Parcel, beneficiary.parcel_id)
    if not parcel:
        raise HTTPException(status_code=404, detail="Associated parcel not found")
    db_beneficiary = models.Beneficiary.from_orm(beneficiary)
    session.add(db_beneficiary)
    session.commit()
    session.refresh(db_beneficiary)
    return db_beneficiary

@router.get("/beneficiaries", response_model=list[schemas.BeneficiaryRead])
def read_beneficiaries(skip: int = 0, limit: int = 100, session: Session = Depends(get_session)):
    beneficiaries = session.exec(select(models.Beneficiary).offset(skip).limit(limit)).all()
    return beneficiaries

@router.get("/beneficiaries/{beneficiary_id}", response_model=schemas.BeneficiaryRead)
def read_beneficiary(beneficiary_id: int, session: Session = Depends(get_session)):
    beneficiary = session.get(models.Beneficiary, beneficiary_id)
    if not beneficiary:
        raise HTTPException(status_code=404, detail="Beneficiary not found")
    return beneficiary

@router.put("/beneficiaries/{beneficiary_id}", response_model=schemas.BeneficiaryRead)
def update_beneficiary(
    beneficiary_id: int, 
    beneficiary_update: schemas.BeneficiaryCreate, 
    session: Session = Depends(get_session),
    _auth: str = Depends(verify_api_key)
):
    beneficiary = session.get(models.Beneficiary, beneficiary_id)
    if not beneficiary:
        raise HTTPException(status_code=404, detail="Beneficiary not found")
    beneficiary_data = beneficiary_update.dict(exclude_unset=True)
    for key, value in beneficiary_data.items():
        setattr(beneficiary, key, value)
    session.add(beneficiary)
    session.commit()
    session.refresh(beneficiary)
    return beneficiary

@router.delete("/beneficiaries/{beneficiary_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_beneficiary(
    beneficiary_id: int, 
    session: Session = Depends(get_session),
    _auth: str = Depends(verify_api_key)
):
    beneficiary = session.get(models.Beneficiary, beneficiary_id)
    if not beneficiary:
        raise HTTPException(status_code=404, detail="Beneficiary not found")
    session.delete(beneficiary)
    session.commit()
    return
