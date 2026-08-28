from datetime import datetime
from typing import Optional, List

from sqlmodel import Field, SQLModel, Relationship

class ProjectBase(SQLModel):
    name: str = Field(index=True, max_length=255)
    ministry: Optional[str] = Field(default=None, max_length=255)
    sector: Optional[str] = Field(default=None, max_length=100)
    total_area: Optional[float] = Field(default=None, gt=0)
    budget: Optional[float] = Field(default=None, gt=0)
    state: Optional[str] = Field(default=None, max_length=100)
    district: Optional[str] = Field(default=None, max_length=100)
    status: Optional[str] = Field(default=None, max_length=100)

class Project(ProjectBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    parcels: List["Parcel"] = Relationship(back_populates="project")
    notifications: List["Notification"] = Relationship(back_populates="project")

class ProjectRead(ProjectBase):
    id: int
    created_at: datetime

class ParcelBase(SQLModel):
    parcel_number: str = Field(..., max_length=50)
    owner_name: Optional[str] = Field(default=None, max_length=255)
    survey_number: Optional[str] = Field(default=None, max_length=100)
    area_sqm: Optional[float] = Field(default=None, gt=0)
    valuation: Optional[float] = Field(default=None, gt=0)
    compensation_status: Optional[str] = Field(default=None, max_length=100)
    geojson_geometry: Optional[str] = Field(default=None)  # store as JSON string

class Parcel(ParcelBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    project_id: int = Field(foreign_key="project.id")
    project: Project = Relationship(back_populates="parcels")
    beneficiaries: List["Beneficiary"] = Relationship(back_populates="parcel")

class ParcelRead(ParcelBase):
    id: int
    project_id: int

class NotificationBase(SQLModel):
    section_type: str = Field(..., description="One of: Sec 4, Sec 11, Sec 19", max_length=50)
    issue_date: datetime = Field(default_factory=datetime.utcnow)
    status: Optional[str] = Field(default=None, max_length=100)

class Notification(NotificationBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    project_id: int = Field(foreign_key="project.id")
    project: Project = Relationship(back_populates="notifications")

class NotificationRead(NotificationBase):
    id: int
    project_id: int

class BeneficiaryBase(SQLModel):
    family_head: Optional[str] = Field(default=None, max_length=255)
    affected_members: Optional[int] = Field(default=None, ge=0)
    compensation_assessed: Optional[float] = Field(default=None, ge=0)
    compensation_paid: Optional[float] = Field(default=None, ge=0)
    rr_status: Optional[str] = Field(default=None, max_length=100)

class Beneficiary(BeneficiaryBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    parcel_id: int = Field(foreign_key="parcel.id")
    parcel: Parcel = Relationship(back_populates="beneficiaries")

class BeneficiaryRead(BeneficiaryBase):
    id: int
    parcel_id: int

class UserBase(SQLModel):
    username: str = Field(index=True, unique=True, max_length=50)
    full_name: str = Field(max_length=255)
    role: str = Field(max_length=50)  # ministry, state, district, surveyor, citizen
    department: Optional[str] = Field(default=None, max_length=255)

class User(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_password: str = Field(max_length=255)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class UserRead(UserBase):
    id: int
    created_at: datetime

class UserLogin(SQLModel):
    username: str
    password: str

class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"
    user: UserRead

