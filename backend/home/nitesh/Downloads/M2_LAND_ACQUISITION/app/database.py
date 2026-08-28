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

def init_db():
    """Create all tables and seed demo users."""
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        seed_demo_users(session)

# Dependency for fastapi routes
def get_session():
    with Session(engine) as session:
        yield session
