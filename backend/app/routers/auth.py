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
    user = session.exec(select(models.User).where(models.User.username == credentials.username)).first()
    if not user or not verify_password(credentials.password, user.hashed_password):
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
