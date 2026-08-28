import os
from datetime import datetime, timedelta
from typing import Optional, List
import jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status, Security
from fastapi.security import APIKeyHeader, OAuth2PasswordBearer
from sqlmodel import Session, select

from .database import get_session
from . import models

API_KEY_NAME = "X-NLAMS-API-Key"
api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=False)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)

# Security Constants
SIH_SECRET_KEY = "sih_nlams_secret_2026"
JWT_SECRET_KEY = "sih_nlams_jwt_secret_key_2026_hackathon"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_api_key(api_key: str = Security(api_key_header)):
    """Validates the incoming header for database write authorization."""
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Database write access denied. Header X-NLAMS-API-Key is missing."
        )
    if api_key != SIH_SECRET_KEY:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Security Alert: Invalid API key credentials submitted."
        )
    return api_key

def get_current_user(
    token: Optional[str] = Depends(oauth2_scheme),
    session: Session = Depends(get_session)
) -> Optional[models.User]:
    if not token:
        return None
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            return None
    except jwt.PyJWTError:
        return None
    
    user = session.exec(select(models.User).where(models.User.username == username)).first()
    return user

def require_current_user(
    user: Optional[models.User] = Depends(get_current_user)
) -> models.User:
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Please log in to access this resource.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

def require_role(allowed_roles: List[str]):
    def role_checker(user: models.User = Depends(require_current_user)):
        if user.role not in allowed_roles and user.role != "ministry":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Role Access Restricted: Action requires one of role(s) [{', '.join(allowed_roles)}]. Your role is '{user.role}'."
            )
        return user
    return role_checker
