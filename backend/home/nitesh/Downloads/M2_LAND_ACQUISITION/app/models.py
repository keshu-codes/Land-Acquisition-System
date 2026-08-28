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


# ─── Survey Officer Model ────────────────────────────────────────────
class SurveyOfficerBase(SQLModel):
    name: str = Field(max_length=255)
    officer_id: str = Field(unique=True, max_length=50)
    tehsil: Optional[str] = Field(default=None, max_length=255)
    latitude: Optional[float] = Field(default=None)
    longitude: Optional[float] = Field(default=None)
    status: str = Field(default="Available", max_length=50)  # Available, On Duty, Unavailable

class SurveyOfficer(SurveyOfficerBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

class SurveyOfficerRead(SurveyOfficerBase):
    id: int


# ─── Grievance Token Model ───────────────────────────────────────────
class GrievanceTokenBase(SQLModel):
    token: str = Field(unique=True, max_length=500)
    token_short: str = Field(max_length=50)  # Human-readable e.g. GRV-2026-9821-X7K
    parcel_id: int = Field(foreign_key="parcel.id")
    landowner_email: str = Field(max_length=255)
    reference_number: str = Field(max_length=100)  # LAO/DIST/2026/0894
    is_used: bool = Field(default=False)
    expires_at: datetime

class GrievanceToken(GrievanceTokenBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class GrievanceTokenRead(GrievanceTokenBase):
    id: int
    created_at: datetime


# ─── Citizen Grievance / Objection Model ─────────────────────────────
class GrievanceBase(SQLModel):
    token_id: int = Field(foreign_key="grievancetoken.id")
    objection_type: str = Field(max_length=50)  # VALUATION, BOUNDARY, TITLE, OTHER
    description: str = Field(max_length=2000)
    status: str = Field(default="PENDING", max_length=50)  # PENDING, UNDER_REVIEW, RESOLVED, REJECTED
    landowner_name: Optional[str] = Field(default=None, max_length=255)
    parcel_number: Optional[str] = Field(default=None, max_length=50)

class Grievance(GrievanceBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class GrievanceRead(GrievanceBase):
    id: int
    created_at: datetime


from typing import Optional, List, Union

# ─── Request Schemas ─────────────────────────────────────────────────
class DispatchNoticeRequest(SQLModel):
    parcel_id: int
    landowner_email: str
    officer_id: Optional[Union[str, int]] = None  # Survey officer to assign
    passcode: Optional[str] = None

class GrievanceSubmitRequest(SQLModel):
    objection_type: str  # VALUATION, BOUNDARY, TITLE, OTHER
    description: str

