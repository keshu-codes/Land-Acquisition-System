from datetime import datetime
from typing import Optional, List

from sqlmodel import Field

from .models import ProjectBase, ParcelBase, NotificationBase, BeneficiaryBase

# Project Schemas
class ProjectCreate(ProjectBase):
    """Schema for creating a new Project (no id, timestamps auto-generated)."""
    pass

class ProjectRead(ProjectBase):
    id: int
    created_at: datetime
    # Optionally include related objects count
    parcels_count: Optional[int] = None
    notifications_count: Optional[int] = None

# Parcel Schemas
class ParcelCreate(ParcelBase):
    project_id: int

class ParcelRead(ParcelBase):
    id: int
    project_id: int

# Notification Schemas
class NotificationCreate(NotificationBase):
    project_id: int

class NotificationRead(NotificationBase):
    id: int
    project_id: int

# Beneficiary Schemas
class BeneficiaryCreate(BeneficiaryBase):
    parcel_id: int

class BeneficiaryRead(BeneficiaryBase):
    id: int
    parcel_id: int
