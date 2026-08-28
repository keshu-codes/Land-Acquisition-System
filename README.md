# 🏛️ National Land Acquisition & Management System (NLAMS)
### *A Unified, Web3-Audited Geospatial Land Acquisition & Dispute Resolution Portal*
> **Built for Smart India Hackathon (SIH) 2026** | Statutory Compliance under the **RFCTLARR Act, 2013**

[![SIH 2026](https://img.shields.io/badge/Smart%20India%20Hackathon-2026-orange.svg?style=for-the-badge)](https://sih.gov.in/)
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React 19](https://img.shields.io/badge/React%2019-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Python 3.14](https://img.shields.io/badge/Python%203.14-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Web3 Ledger](https://img.shields.io/badge/Web3-Spatial%20Ledger-6366f1?style=for-the-badge)](https://web3js.org/)

---

## 📌 Executive Summary & Vision

In India, national infrastructure projects (Highways, High-Speed Rail Corridors, Industrial Nodes, Metro Corridors) frequently experience delays of **3 to 7 years** due to paper notice dispatch failures, delayed cadastral surveyor deployment, court stays, and compensation disputes under the **RFCTLARR Act, 2013** *(Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act)*.

**NLAMS** solves these systemic bottlenecks through:
1. **Automated Nearest Surveyor Assignment:** Uses the **Haversine Proximity Formula** to automatically locate and assign the closest certified field officer.
2. **Zero-Trust Tokenized Citizen Objection Portal:** Landowners receive a 30-day cryptographically signed single-use token via **TLS 1.3 encrypted email**, allowing them to file disputes without accessing internal government dashboards.
3. **Web3 Spatial Escrow & Direct Benefit Transfer (DBT):** Locks compensation into smart contract escrow, releases funds directly to verified beneficiaries with **PFMS receipts**, and verifies land title deeds via client-side **SHA-256 hash matching**.
4. **5-Tier Role-Based Access Control (RBAC):** Restricts portal access across Central Ministry, State GIS Authorities, District Magistrates, Field Surveyors, and Landowners.

---

## 🏗️ System Architecture

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
│        FastAPI + SQLModel ORM + Pydantic v2 + SQLite / PostgreSQL          │
│  Routers: Auth, Parcels, Projects, Workflows, Grievances/Dispatches, Audits │
└──────────────┬───────────────────────┬───────────────────────┬──────────────┘
               │                       │                       │
               ▼                       ▼                       ▼
┌─────────────────────────┐ ┌─────────────────────┐ ┌─────────────────────────┐
│   ENTERPRISE MAILER     │ │   GEOSPATIAL ENGINE │ │    WEB3 SPATIAL LEDGER  │
│  TLS 1.3 / SMTP_SSL     │ │  Haversine Proximity│ │  SHA-256 Title Registry │
│  SPF/DKIM/DMARC Signed  │ │  Cadastral Polygons │ │  PFMS Escrow Receipts   │
└─────────────────────────┘ └─────────────────────┘ └─────────────────────────┘
```

---

## ✨ Key Features & Innovations

### 1. 🛡️ Mandatory Access Gateway & 5-Tier RBAC
* Strictly enforces authentication on every visit (sessions are never silently restored across reloads).
* Auto-routes authenticated officials to their dedicated administrative command center.

### 2. 🗺️ Cadastral Land Parcels GIS Viewer & Landowner Search
* Integrated satellite imagery with interactive parcel boundary polygons.
* **Instant Landowner Search**: Search by name (e.g., `Anmol`) to filter plots in real time, auto-focus the map, and display circle rate valuation.

### 3. 🛰️ Nearest Surveyor Haversine Geospatial Dispatch
* Calculates real-time distance between parcel coordinates and active district survey officers:
  $$\text{distance} = 2 R \arcsin\left(\sqrt{\sin^2\left(\frac{\Delta\text{lat}}{2}\right) + \cos(\text{lat}_1)\cos(\text{lat}_2)\sin^2\left(\frac{\Delta\text{lon}}{2}\right)}\right)$$
* Dispatches Section 11 notices with one-click security passcode authorization (**`SIH@12345`**).

### 4. 📝 Standalone Public Citizen Objection Gateway
* Accessible only via single-use cryptographic tokens (`/?token=GRV-2026-9821-XXX`).
* Allows citizens to file *Valuation*, *Boundary*, or *Title* disputes.
* Enforces **Single-Use Invalidation** (`is_used = True`) to prevent duplicate submissions.

### 5. 📬 Real-Time Executive Grievance Monitor Box
* Displays live citizen disputes on the **Executive Dashboard** with auto-polling every 15 seconds.
* Allows Collectors and Ministry officials to track dispute status (🔴 `PENDING`, 🟡 `UNDER_REVIEW`, 🟢 `RESOLVED`).

### 6. 📱 Cadastral Field Surveyor Operative Node
* Mobile-responsive interface designed for ground surveyors on smartphones/tablets.
* Features GPS boundary capture, soil/crop categorization, and photographic evidence geotagging.

### 7. ⛓️ Web3 Smart Escrow, PFMS Receipts & SHA-256 Deed Verification
* Direct Benefit Transfer (DBT) compensation release from smart contract escrow directly to landowner wallets.
* Generates official **PFMS Cryptographic Payment Advice Receipts** with transaction hashes and block numbers.
* Client-side **SHA-256 hash matching** to verify title deeds against on-chain records.

---

## 🛠️ Technology Stack

| Component | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 19, Vite 8, Tailwind CSS | High-performance, mobile-responsive UI |
| **GIS Mapping** | React-Leaflet, Google Satellite Tiles | Spatial boundary plotting and cadastral inspection |
| **Backend API** | FastAPI (Python 3.14), Uvicorn | Asynchronous RESTful API backend |
| **Database & ORM** | SQLModel (SQLAlchemy + Pydantic v2), SQLite | Relational schema and ORM models |
| **Security & Auth** | PyJWT, Passlib (PBKDF2), TLS 1.3 SMTP | Encrypted tokens, secure auth, legal notice mailer |
| **Blockchain / Web3**| Web3.js, Client-side SHA-256 | Spatial audit ledger, escrow DBT, deed validation |

---

## 🚀 Quickstart: Local Setup & Installation

### Prerequisites
* **Python 3.10+**
* **Node.js 18+** & **npm**
* **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/keshu-codes/Land-Acquisition-System.git
cd Land-Acquisition-System
```

### 2. Start the Backend API (Terminal 1)
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
* Interactive Swagger API docs: `http://127.0.0.1:8000/docs`

### 3. Start the Frontend Application (Terminal 2)
```bash
cd frontend
npm install
npm run dev
```
* Web Portal opens at: `http://localhost:5173`

---

## 👥 Demo Stakeholder Credentials (Password: `nlams2026`)

| Role | Username | Representative Name | Default Command View |
| :--- | :--- | :--- | :--- |
| 🏛️ **Central Ministry** | `ministry` | Dr. Rajesh Verma | **Executive Dashboard & KPIs** |
| 🗺️ **State GIS Officer** | `state` | Priya Sundaram | **Case Files & Statutory Workflow** |
| 🏢 **District Magistrate**| `collector` | Amitabh Choudhury (IAS)| **Survey Notice Dispatch Console** |
| 📍 **Field Surveyor** | `surveyor` | Suresh Kumar | **Cadastral Field Survey Node** |
| 🌾 **Citizen / Landowner** | `citizen` | Rameshwar Patel / Anmol | **Web3 Audit & Escrow Compensation** |

---

## 📂 Repository Directory Structure

```
Land-Acquisition-System/
├── backend/
│   ├── app/
│   │   ├── routers/
│   │   │   ├── auth.py             # JWT authentication & profile endpoints
│   │   │   ├── beneficiaries.py    # Compensation beneficiary management
│   │   │   ├── dashboard.py        # National KPIs & MIS analytics
│   │   │   ├── grievances.py       # Token generator, email dispatch & objection monitor
│   │   │   ├── parcels.py          # GIS parcel registry & search endpoints
│   │   │   └── projects.py         # Infrastructure project workflows
│   │   ├── database.py             # Database initialization & demo seeding
│   │   ├── dependencies.py         # JWT verification & RBAC role guards
│   │   ├── email_service.py        # TLS 1.3 SMTP email notification engine
│   │   ├── main.py                 # FastAPI application root & middleware
│   │   ├── models.py               # SQLModel table schemas
│   │   └── schemas.py              # Pydantic request/response schemas
│   ├── land_acquisition.db         # SQLite database
│   ├── land_delay_model.joblib     # ML delay prediction model
│   ├── requirements.txt            # Python dependencies
│   ├── seed_db.py                  # Database seed script
│   └── train_model.py              # ML model trainer
├── frontend/
│   ├── src/
│   │   ├── components/             # Reusable UI components (Navbar, GIS Map, Charts)
│   │   ├── context/AppContext.jsx  # Global application & auth state management
│   │   ├── pages/
│   │   │   ├── CitizenObjection.jsx# Public standalone grievance portal
│   │   │   ├── CompensationPortal.jsx # Web3 escrow & title hash verification
│   │   │   ├── Dashboard.jsx       # Executive Monitoring Dashboard
│   │   │   ├── FieldSurvey.jsx     # Mobile cadastral survey station
│   │   │   ├── Login.jsx           # Mandatory Government Access Gateway
│   │   │   ├── ProposalWorkflow.jsx# 5-stage statutory case files
│   │   │   └── SurveyDispatch.jsx  # Nearest surveyor Haversine dispatch
│   │   ├── App.jsx                 # Client router & token resolver
│   │   └── main.jsx                # Application entry point
│   ├── package.json
│   └── vite.config.js
├── NLAMS_Master_Defense_Manual.pdf # Standalone PDF Hackathon Defense Manual
├── NLAMS_Comprehensive_Defense_Guide.html # In-depth evaluation guide & Q&A
├── NLAMS_Implementation_Plan.html # Technical architecture & implementation plan
└── README.md
```

---

## 📚 Hackathon Defense & Documentation Resources

* 📕 **[NLAMS Master Defense Manual (PDF)](./NLAMS_Master_Defense_Manual.pdf)**: Complete 8-section manual containing architecture deep-dives, presentation scripts, and **20+ Judge Cross-Questions & Answers**.
* 🌐 **[Interactive Evaluation Guide (HTML)](./NLAMS_Comprehensive_Defense_Guide.html)**: Styled browser-viewable manual with 1-click print-to-PDF.
* 📑 **[Implementation Plan (HTML)](./NLAMS_Implementation_Plan.html)**: Detailed technical specification and deployment roadmap.

---

## 🤝 Team Contribution Workflow

1. **Pull latest changes:** `git pull origin main`
2. **Create feature branch:** `git checkout -b feature/your-feature-name`
3. **Commit changes:** `git commit -m "feat: description of change"`
4. **Push to branch:** `git push origin feature/your-feature-name`
5. **Create a Pull Request** on GitHub!

---

## 📄 License & Attribution
Developed for the **Smart India Hackathon (SIH) 2026** by Team NLAMS. Compliant with the statutory guidelines of the **Department of Land Resources (DoLR), Ministry of Rural Development, Government of India**.
