import os
from sqlmodel import SQLModel, create_engine, Session, select
from . import models

# Determine database URL; fallback to SQLite if not provided via env
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./land_acquisition.db")

# Create engine with appropriate connect args for SQLite
engine = create_engine(
    DATABASE_URL,
    echo=False,
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
)

def seed_demo_users(session: Session):
    from .dependencies import get_password_hash
    
    default_password_hash = get_password_hash("nlams2026")
    
    demo_users_data = [
        {"username": "ministry", "full_name": "Dr. Rajesh Verma", "role": "ministry", "department": "Ministry of Road Transport & Highways"},
        {"username": "state", "full_name": "Priya Sundaram", "role": "state", "department": "State GIS & Remote Sensing Directorate"},
        {"username": "collector", "full_name": "Amitabh Choudhury (IAS)", "role": "district", "department": "Office of District Magistrate & LAC"},
        {"username": "surveyor", "full_name": "Suresh Kumar", "role": "surveyor", "department": "Cadastral Field Survey Station #04"},
        {"username": "citizen", "full_name": "Rameshwar Patel", "role": "citizen", "department": "Registered Landholder Portal"}
    ]
    
    for data in demo_users_data:
        user = session.exec(select(models.User).where(models.User.username == data["username"])).first()
        if user:
            user.hashed_password = default_password_hash
            user.full_name = data["full_name"]
            user.role = data["role"]
            user.department = data["department"]
            session.add(user)
        else:
            new_user = models.User(
                username=data["username"],
                full_name=data["full_name"],
                role=data["role"],
                department=data["department"],
                hashed_password=default_password_hash
            )
            session.add(new_user)
            
    session.commit()
    print("Demo user accounts successfully synchronized in database.")

def seed_demo_scenario(session: Session):
    """Seed the mock demo scenario: Anmol's parcel + Rajesh Mohapatra survey officer."""
    import json
    
    # ── 1. Survey Officers ──
    officers_data = [
        {
            "name": "Rajesh Mohapatra", "officer_id": "SO-774",
            "tehsil": "Central Zone Survey Unit",
            "latitude": 20.3105, "longitude": 85.8390, "status": "Available"
        },
        {
            "name": "Sunita Devi", "officer_id": "SO-812",
            "tehsil": "Northern Cadastral Division",
            "latitude": 20.3450, "longitude": 85.8100, "status": "On Duty"
        },
        {
            "name": "Vikram Singh", "officer_id": "SO-655",
            "tehsil": "Southern Block Survey Office",
            "latitude": 20.2500, "longitude": 85.8700, "status": "Available"
        }
    ]
    
    for od in officers_data:
        existing = session.exec(
            select(models.SurveyOfficer).where(models.SurveyOfficer.officer_id == od["officer_id"])
        ).first()
        if not existing:
            session.add(models.SurveyOfficer(**od))
    
    session.commit()
    
    # ── 2. Ensure an Odisha project exists for the demo parcel ──
    demo_project = session.exec(
        select(models.Project).where(models.Project.state == "Odisha")
    ).first()
    
    if not demo_project:
        demo_project = models.Project(
            name="Regional Multi-Modal Corridor Expansion",
            ministry="Ministry of Road Transport & Highways",
            sector="Infrastructure",
            total_area=85.0,
            budget=420.0,
            state="Odisha",
            district="Khordha",
            status="Section 11 Notification"
        )
        session.add(demo_project)
        session.commit()
        session.refresh(demo_project)
    
    # ── 3. Anmol's demo parcel ──
    existing_parcel = session.exec(
        select(models.Parcel).where(models.Parcel.parcel_number == "PLOT-OD-2026-9821")
    ).first()
    
    if not existing_parcel:
        # GeoJSON polygon around [20.2961, 85.8245]
        parcel_geojson = json.dumps({
            "type": "Polygon",
            "coordinates": [[[85.8225, 20.2945], [85.8265, 20.2945], [85.8265, 20.2977], [85.8225, 20.2977], [85.8225, 20.2945]]]
        })
        
        demo_parcel = models.Parcel(
            parcel_number="PLOT-OD-2026-9821",
            owner_name="Anmol",
            survey_number="SN-9821",
            area_sqm=5868.57,  # 1.45 acres
            valuation=4250000.0,
            compensation_status="Pending Assessment",
            geojson_geometry=parcel_geojson,
            project_id=demo_project.id
        )
        session.add(demo_parcel)
        session.commit()
        session.refresh(demo_parcel)
        
        # ── 4. Beneficiary record for Anmol ──
        demo_beneficiary = models.Beneficiary(
            family_head="Anmol",
            affected_members=4,
            compensation_assessed=4250000.0,
            compensation_paid=0.0,
            rr_status="Pending",
            parcel_id=demo_parcel.id
        )
        session.add(demo_beneficiary)
        session.commit()
    
    print("Demo scenario data (Anmol parcel + Survey officers) synchronized.")


def init_db():
    """Create all tables and seed demo users."""
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        seed_demo_users(session)
        seed_demo_scenario(session)

# Dependency for fastapi routes
def get_session():
    with Session(engine) as session:
        yield session
