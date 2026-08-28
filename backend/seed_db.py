import os
import sys
import json
import random
from datetime import datetime

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import engine, init_db
from app.models import Project, Parcel, Beneficiary, Notification
from sqlmodel import Session, select

# Data Lists
indian_names = [
    "Rajesh Kumar", "Amit Singh", "Suresh Patel", "Ramesh Sharma", "Vijay Yadav",
    "Sanjay Gupta", "Sunil Verma", "Anil Mishra", "Manoj Joshi", "Dinesh Choudhary",
    "Pramod Naik", "Sandeep Kulkarni", "Pradeep Deshmukh", "Rajendra Patil", "Satish Reddy",
    "Ravi Teja", "Krishna Murthy", "Venkatesh Rao", "Ramachandran Nair", "Srinivasan Iyer",
    "Kalyan Banerjee", "Subhash Bose", "Ashok Sen", "Dilip Roy", "Narendra Modi",
    "Sunita Devi", "Anita Kumari", "Rekha Sharma", "Pooja Gupta", "Geeta Patel"
]

state_districts = {
    "Maharashtra": ["Thane", "Pune", "Nashik", "Nagpur", "Aurangabad"],
    "Uttar Pradesh": ["Gautam Buddha Nagar", "Lucknow", "Varanasi", "Kanpur", "Agra"],
    "West Bengal": ["Purulia", "Bankura", "Birbhum", "Hooghly", "Midnapore"],
    "Tamil Nadu": ["Kanchipuram", "Coimbatore", "Madurai", "Salem", "Vellore"],
    "Madhya Pradesh": ["Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain"],
    "Odisha": ["Khurda", "Cuttack", "Ganjam", "Balasore", "Sambalpur"]
}

state_base_coords = {
    "Maharashtra": (19.2, 72.9),
    "West Bengal": (23.3, 86.3),
    "Madhya Pradesh": (24.5, 81.3),
    "Odisha": (20.2, 85.8),
    "Uttar Pradesh": (26.8, 80.9),
    "Tamil Nadu": (12.9, 80.1)
}

ministries = [
    "National Highways Authority of India (NHAI)",
    "Dedicated Freight Corridor Corporation (DFCCIL)",
    "Indian Railways",
    "Rewa Ultra Mega Solar Limited (RUMSL)",
    "Greater Noida Authority (GNIDA)",
    "Ministry of New and Renewable Energy (MNRE)"
]

statuses = [
    "Proposal Submitted",
    "GIS Verification",
    "Section 11 Notification",
    "Award Declared",
    "Possession Handover"
]

project_names = [
    "Delhi-Mumbai Expressway Corridor",
    "Golden Quadrilateral Expansion Phase II",
    "Rewa Solar Power Park Phase 3",
    "Dedicated East-West Freight Link",
    "Chennai Industrial Port Corridor",
    "Kanchipuram Highway Widening Scheme",
    "Purulia Wind Farm Development Grid",
    "Sambalpur Green Energy Transmission",
    "Indore Metro Rail Corridor Line 2",
    "Varanasi Bypass Bypass Expansion"
]

def generate_geometry(lat, lng, idx):
    # Generates a offset polygon around state coordinates
    offset_lat = (idx % 8) * 0.02
    offset_lng = (idx % 6) * 0.02
    return json.dumps([
        {"lat": lat + offset_lat, "lng": lng + offset_lng},
        {"lat": lat + offset_lat + 0.008, "lng": lng + offset_lng},
        {"lat": lat + offset_lat + 0.008, "lng": lng + offset_lng + 0.008},
        {"lat": lat + offset_lat, "lng": lng + offset_lng + 0.008}
    ])

def seed():
    print("Initializing database tables...")
    init_db()

    with Session(engine) as session:
        # Check if already seeded to avoid duplication
        existing_count = session.exec(select(Project)).all()
        if len(existing_count) > 5:
            print("Database already contains seeded records. Aborting to avoid duplicates.")
            return

        print("Generating projects (40 items)...")
        projects_list = []
        for i in range(40):
            state = random.choice(list(state_districts.keys()))
            district = random.choice(state_districts[state])
            base_name = random.choice(project_names)
            proj_name = f"{base_name} [Section {i+1}]"
            
            status = random.choice(statuses)
            budget = round(random.uniform(150.0, 950.0), 2)
            total_area = round(random.uniform(80.0, 600.0), 2)
            
            proj = Project(
                name=proj_name,
                ministry=random.choice(ministries),
                sector=random.choice(["Transport", "Energy", "Infrastructure"]),
                total_area=total_area,
                budget=budget,
                state=state,
                district=district,
                status=status
            )
            session.add(proj)
            projects_list.append(proj)

        session.commit()
        for p in projects_list:
            session.refresh(p)

        print("Generating land parcels (1500 items)...")
        parcels_list = []
        for i in range(1500):
            project = random.choice(projects_list)
            base_lat, base_lng = state_base_coords.get(project.state, (22.5, 78.5))
            
            p_num = f"PRC-{project.state[:2].upper()}-{i+1:04d}"
            survey_num = f"SRV-{random.randint(100, 999)}/{random.choice(['A','B','C'])}"
            area = round(random.uniform(1000.0, 25000.0), 1)
            val = round((area / 10000.0) * random.uniform(0.5, 1.8), 2) # valuation based on size
            
            comp_status = "Assessed"
            if project.status == "Possession Handover":
                comp_status = "Disbursed"
            elif project.status == "Award Declared":
                comp_status = "Escrow Released"

            parcel = Parcel(
                parcel_number=p_num,
                owner_name=random.choice(indian_names),
                survey_number=survey_num,
                area_sqm=area,
                valuation=val,
                compensation_status=comp_status,
                geojson_geometry=generate_geometry(base_lat, base_lng, i),
                project_id=project.id
            )
            session.add(parcel)
            parcels_list.append(parcel)

            if i % 300 == 0:
                session.commit() # intermediate commits for speed

        session.commit()
        for prc in parcels_list[::15]: # refresh a subset or just refresh on query later
            try:
                session.refresh(prc)
            except Exception:
                pass

        print("Generating beneficiaries & R&R records (960 items)...")
        # Fetch parcel IDs directly from DB to avoid memory refresh locks
        parcels_ids = [p.id for p in session.exec(select(Parcel)).all()]
        
        for i in range(960):
            p_id = random.choice(parcels_ids)
            # Find parcel valuation
            parcel = session.get(Parcel, p_id)
            if not parcel:
                continue

            comp_assessed = round(parcel.valuation * 1.25, 2)
            comp_paid = 0.0
            
            # Match project status for payments
            project = session.get(Project, parcel.project_id)
            if project:
                if project.status == "Possession Handover":
                    comp_paid = comp_assessed
                elif project.status == "Award Declared":
                    comp_paid = round(comp_assessed * 0.1, 2)

            rr_status = "Pending"
            if project and project.status == "Possession Handover":
                rr_status = "Completed"
            elif project and project.status in ["Award Declared", "Section 11 Notification"]:
                rr_status = "In Progress"

            beneficiary = Beneficiary(
                family_head=parcel.owner_name,
                affected_members=random.randint(2, 7),
                compensation_assessed=comp_assessed,
                compensation_paid=comp_paid,
                rr_status=rr_status,
                parcel_id=p_id
            )
            session.add(beneficiary)

            if i % 200 == 0:
                session.commit()

        session.commit()
        print("Database successfully seeded with 2,500 total data records!")

if __name__ == "__main__":
    seed()
