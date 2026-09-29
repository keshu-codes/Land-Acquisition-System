from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from ..database import get_session
from .. import models
from ..dependencies import (
    verify_password, 
    create_access_token, 
    get_current_user,
    require_current_user
)

router = APIRouter()

@router.post("/auth/login", response_model=models.Token)
def login(credentials: models.UserLogin, session: Session = Depends(get_session)):
    raw_username = (credentials.username or "").strip().lower()
    # Check if username is an email like collector@khordha.gov.in
    clean_username = raw_username.split("@")[0] if "@" in raw_username else raw_username

    user = session.exec(
        select(models.User).where(
            (models.User.username == credentials.username) | 
            (models.User.username == raw_username) | 
            (models.User.username == clean_username)
        )
    ).first()

    valid_demo_passwords = {"nlams2026", "SIH@12345", "collector123", "admin", "password", "citizen123", "surveyor123"}
    is_demo_pass = credentials.password in valid_demo_passwords

    # If user doesn't exist yet, auto-provision known demo roles
    if not user and clean_username in {"ministry", "state", "collector", "surveyor", "citizen", "admin"}:
        from ..dependencies import get_password_hash
        role_map = {
            "ministry": ("Dr. Rajesh Verma", "ministry", "Ministry of Road Transport & Highways"),
            "state": ("Priya Sundaram", "state", "State GIS & Remote Sensing Directorate"),
            "collector": ("Amitabh Choudhury (IAS)", "district", "Office of District Magistrate & LAC"),
            "surveyor": ("Suresh Kumar", "surveyor", "Cadastral Field Survey Station #04"),
            "citizen": ("Rameshwar Patel", "citizen", "Registered Landholder Portal"),
            "admin": ("System Administrator", "ministry", "Central Infrastructure Secretariat")
        }
        name, role, dept = role_map[clean_username]
        user = models.User(
            username=clean_username,
            full_name=name,
            role=role,
            department=dept,
            hashed_password=get_password_hash("nlams2026")
        )
        session.add(user)
        session.commit()
        session.refresh(user)

    is_valid_pass = False
    if user:
        if verify_password(credentials.password, user.hashed_password) or is_demo_pass:
            is_valid_pass = True

    if not user or not is_valid_pass:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password. Please verify credentials.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": user.username, "role": user.role})
    return models.Token(
        access_token=access_token,
        token_type="bearer",
        user=models.UserRead.model_validate(user)
    )

@router.get("/auth/me", response_model=models.UserRead)
def get_me(user: models.User = Depends(require_current_user)):
    return user
