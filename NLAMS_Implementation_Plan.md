# National Land Acquisition & Management System (NLAMS)
## Smart India Hackathon (SIH) 2026 — Technical Implementation & Architecture Plan

---

## 1. Executive Summary & Vision

The **National Land Acquisition & Management System (NLAMS)** is a unified, tamper-proof, and citizen-centric digital platform designed to modernize India's statutory land acquisition lifecycle under the **RFCTLARR Act, 2013 (Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act)**.

### Core Objectives:
1. **Multi-Tier Administrative Governance**: Role-Based Access Control (RBAC) across 5 administrative tiers (Central Ministry, State GIS Authorities, District Collectors/Magistrates, Field Surveyors, and Landowners).
2. **Automated Nearest Surveyor Dispatch**: Haversine geospatial proximity engine to assign cadastral field officers and issue Section 11 notices.
3. **Secure Citizen Objection Workflow**: 30-day single-use cryptographic tokens dispatched via TLS 1.3 encrypted emails (SPF, DKIM, DMARC compliant) without exposing internal dashboards to the public.
4. **Web3 Spatial Ledger & DBT Escrow**: On-chain audit trail of all statutory approvals, SHA-256 title deed integrity checks, and direct escrow payouts to landowners.

---

## 2. System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND LAYER                                 │
│  React 19 + Vite 8 + Tailwind CSS + Lucide Icons + React-Leaflet GIS Maps   │
│  (Role-Tailored Views: Executive Dashboard, Workflow, Dispatch, Survey)    │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ RESTful JSON APIs (JWT Bearer Auth)
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                               BACKEND LAYER                                 │
│      FastAPI (Python 3.14) + SQLModel ORM + Pydantic v2 + SQLite/Postgres    │
│  Routers: Auth, Parcels, Projects, Workflows, Grievances/Dispatches, Audits │
└──────────────┬───────────────────────┬───────────────────────┬──────────────┘
               │                       │                       │
               ▼                       ▼                       ▼
┌─────────────────────────┐ ┌─────────────────────┐ ┌─────────────────────────┐
│   ENTERPRISE MAILER     │ │   GEOSPATIAL ENGINE │ │    WEB3 SPATIAL LEDGER  │
│  TLS 1.3 / SMTP_SSL     │ │  Haversine Distance │ │  SHA-256 Title Registry │
│  SPF/DKIM/DMARC Signed  │ │  Polygon GIS Overlay│ │  PFMS Escrow Receipts   │
└─────────────────────────┘ └─────────────────────┘ └─────────────────────────┘
```

---

## 3. Administrative Hierarchy & Role-Based Access Control (RBAC)

| Administrative Level | Representative Persona | Primary Responsibilities | Default Landing Tab |
| :--- | :--- | :--- | :--- |
| **Level 1: Central Ministry** | Dr. Rajesh Verma | National KPI monitoring, inter-state corridor proposals, budget disbursements | `Executive Dashboard` |
| **Level 2: State GIS Authority** | Priya Sundaram | Cadastral boundary validation, overlapping parcel checks, state clearance | `Case Files & Workflows` |
| **Level 3: District Magistrate** | Amitabh Choudhury (IAS) | Section 11 Gazette issuance, nearest surveyor dispatch, award declaration | `Survey & Notice Dispatch` |
| **Level 4: Field Surveyor** | Suresh Kumar | Mobile GPS boundary geotagging, soil & structure verification, photo evidence | `Cadastral Field Survey Node` |
| **Level 5: Citizen / Landowner** | Anmol / Rameshwar Patel | Tokenized objection filing, compensation claims, escrow payout receipts | `Web3 Audit & Compensation` |

---

## 4. Key Technical Workflows

### 4.1 Notice Dispatch & Nearest Officer Assignment
1. District Magistrate selects parcel (`PLOT-OD-2026-9821`).
2. System executes Haversine distance calculations across all registered survey officers in the district.
3. Selects nearest available officer (e.g., `Rajesh Mohapatra, SO-774`, 2.2 km away).
4. Magistrate verifies action using the security passcode (**`SIH@12345`**).
5. Generates 30-day single-use JWT grievance token (`GRV-2026-9821-XXX`).
6. Dispatches official HTML email with embedded single-use grievance link via TLS 1.3 SMTP.

### 4.2 Citizen Objection Life Cycle
1. Landowner clicks **`[ 📝 File Your Objection / Grievance ]`** in their email.
2. System validates cryptographic token on the public endpoint `/api/v1/grievances/validate-token/{token}`.
3. Landowner views verified plot details and submits a formal dispute (*Valuation*, *Boundary*, *Title*, or *Other*).
4. System records the grievance in the database and **marks the single-use token as used** to prevent duplicate submissions.
5. The objection appears in real-time on the **Live Grievance Monitor** on the Executive Dashboard.

### 4.3 Web3 Direct Escrow Compensation & Title Verification
1. Once compensation is awarded under Section 23, funds are allocated to the project escrow.
2. Landowner connects Web3 Wallet (`0x...`).
3. Landowner claims compensation amount; system generates an immutable block transaction and official **PFMS-Compliant Payout Advice Receipt**.
4. Title deeds and survey maps are hashed via client-side SHA-256 and matched against the on-chain registry.

---

## 5. Security & Cryptographic Specifications

* **Authentication**: Password hashing with `PBKDF2-HMAC-SHA256` via `passlib`, signed JWT session tokens with 24-hour expiration.
* **Mandatory Gateway Gate**: Every browser visit enforces fresh authentication; sessions are never silently restored across device restarts.
* **Single-Use Tokens**: HMAC-SHA256 signed grievance tokens stored with boolean single-use flags and UTC expiration timestamps.
* **Transport Encryption**: TLS 1.3 SSL encrypted transport for all SMTP mail dispatches with SPF/DKIM/DMARC headers.

---

## 6. How to Run Locally

### Backend Setup:
```powershell
cd backend\home\nitesh\Downloads\M2_LAND_ACQUISITION
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

### Frontend Setup:
```powershell
cd frontend
npm run dev -- --host 127.0.0.1 --port 5173
```

### Cloudflare Public Sharing (Optional):
```powershell
# In terminal 1 (Frontend Tunnel)
npx cloudflared tunnel --url http://127.0.0.1:5173

# In terminal 2 (Backend Tunnel)
npx cloudflared tunnel --url http://127.0.0.1:8000
```

---

## 7. SIH 2026 Future Roadmap

1. **National Interoperability**: Direct integration with State Land Record APIs (BHOOMI Karnataka, Bhulekh UP/Odisha, Dharani Telangana).
2. **DigiLocker & MeriPehchaan**: Official Aadhaar-based Single Sign-On (SSO) for seamless citizen authentication.
3. **Drone / LiDAR Survey Integration**: Ingesting high-density point-cloud files directly into the Cadastral Survey Node.
4. **Polygon Intersection Algorithms**: Automated overlap detection using Turf.js and PostGIS spatial queries.

---
*Developed for Smart India Hackathon (SIH) 2026 | National Land Acquisition & Management System (NLAMS)*
