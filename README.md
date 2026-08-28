# 🏛️ National Land Acquisition & Management System (NLAMS)
### *Smart India Hackathon (SIH) 2026*

---

## 📖 1. About the Project

The **National Land Acquisition & Management System (NLAMS)** is a unified, tamper-proof, and citizen-centric digital governance platform designed to modernize India's land acquisition lifecycle under the statutory provisions of the **RFCTLARR Act, 2013** *(Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act)*.

### The Real-World Problem:
In India, mega infrastructure projects (Highways, High-Speed Rail Corridors, Industrial Corridors, Metro Lines) frequently get delayed by **3 to 7 years** due to:
* **Paper Notice Failures:** Landowners never receive Section 11 notices on time, leading to court stays and prolonged litigation.
* **Delayed Surveyor Assignment:** No automated mechanism to identify and deploy the nearest certified land surveyor.
* **Compensation Exploitation:** Landowners face bureaucratic delays, lack of transparency in circle rates, or middleman deductions.
* **Fake Title Deeds & Boundary Disputes:** Multiple claimants sell the same plot using forged registry papers.

### The NLAMS Solution:
NLAMS solves these challenges by combining a **Government Administrative Command Portal**, an **Automated Proximity GIS Dispatch Engine**, a **Secure Single-Use Citizen Objection Gateway**, and a **Web3 Direct Benefit Transfer (DBT) Escrow Ledger**.

---

## 🛠️ 2. Technologies Used & Their Roles

| Technology | Layer | What It Does in this Project |
| :--- | :--- | :--- |
| **React 19** | Frontend UI | Powers the modern, dynamic Single-Page Application with real-time UI updates. |
| **Vite 8** | Build Tool | Provides lightning-fast compilation, bundling, and hot module replacement. |
| **Tailwind CSS** | Styling | Delivers an official, responsive Government of India design system. |
| **React-Leaflet & Google Satellite** | GIS Mapping | Renders interactive cadastral maps, boundary polygons, circle rates, and GPS markers. |
| **FastAPI (Python 3.14)** | Backend API | High-performance, asynchronous REST API handling authentication, calculations, and data flow. |
| **SQLModel (SQLAlchemy + Pydantic v2)** | Database ORM | Provides typed, validated relational models for Parcels, Projects, Surveyors, and Grievances. |
| **SQLite / PostgreSQL** | Database | Persists project files, land parcels, grievance records, and user credentials. |
| **Python `smtplib` & TLS 1.3** | Email Engine | Dispatches cryptographically signed, official legal acquisition notices directly to citizen inboxes. |
| **PyJWT & PBKDF2 (Passlib)** | Security & Auth | Issues 24-hour official session tokens and 30-day single-use grievance tokens. |
| **Web3.js & SHA-256 Hashing** | Blockchain / Web3 | Handles immutable spatial audit ledgers, DBT escrow releases, and title deed integrity verification. |

---

## ⚙️ 3. How Everything Works Internally

```
                                  ┌──────────────────────────────────────────────┐
                                  │            NLAMS System Flow                 │
                                  └──────────────────────────────────────────────┘
                                                          │
          ┌───────────────────────────────────────────────┼───────────────────────────────────────────────┐
          ▼                                               ▼                                               ▼
┌─────────────────────────────────┐             ┌─────────────────────────────────┐             ┌─────────────────────────────────┐
│     1. Administrative Flow      │             │    2. Citizen Notice & Review   │             │     3. Web3 Escrow & Payout     │
├─────────────────────────────────┤             ├─────────────────────────────────┤             ├─────────────────────────────────┤
│ • Central Ministry submits      │             │ • District Collector selects    │             │ • Section 23 Award locked in    │
│   project proposal.             │             │   plot & assigns nearest        │             │   Smart Escrow Contract.        │
│ • State GIS Officer verifies    │             │   officer via Haversine.        │             │ • Landowner connects Web3 wallet│
│   cadastral boundaries.         │             │ • TLS 1.3 email sent to citizen │             │   and claims compensation.      │
│ • Field Surveyor captures live  │             │   with single-use token link.   │             │ • Generates PFMS receipt with   │
│   GPS boundaries & soil data.   │             │ • Citizen submits objection;    │             │   block number and tx hash.     │
│ • District Collector issues     │             │   token burned immediately to   │             │ • Title deeds verified against  │
│   Section 11 Gazette notice.    │             │   prevent duplicate filings.    │             │   on-chain SHA-256 hashes.      │
└─────────────────────────────────┘             └─────────────────────────────────┘             └─────────────────────────────────┘
```

### 1. The Government Internal Pipeline:
* Officials log in through the **Mandatory Government Access Gateway** with strict Role-Based Access Control (RBAC).
* The **Central Ministry** oversees national KPIs, total land notified vs. acquired, and budget disbursements.
* The **State GIS Directorate** inspects land boundaries and ensures no overlapping acquisition claims exist.
* The **District Magistrate** uses the GIS map to auto-calculate the closest available field surveyor using GPS coordinates, verifies dispatch with passcode `SIH@12345`, and issues the formal legal notice.

### 2. The Citizen Objection Pipeline:
* The backend generates a **30-day cryptographic JWT token** (`GRV-2026-9821-XXX`) and embeds it in an official HTML notice dispatched via TLS 1.3 SMTP.
* When the landowner clicks the button in their email, they enter the **Secure Citizen Grievance Portal** (`/?token=...`).
* The system displays their specific verified parcel details (Plot Number, Area, Circle Rate Valuation).
* The citizen submits their dispute (*Valuation / Boundary / Title*).
* Upon submission, the database sets `is_used = True`, burning the token so it can never be reused, and pushes the dispute directly into the **Live Grievance Monitor** on the Executive Dashboard.

### 3. The Web3 & Compensation Pipeline:
* Compensation funds are locked in a digital **Smart Escrow Contract**.
* The landowner connects their Web3 wallet, signs the payout claim, and receives instant settlement without clerical cuts.
* The system produces a **PFMS-Compliant Payout Advice Receipt** complete with transaction hash, block number, and timestamp.
* Uploaded land deeds are hashed using client-side **SHA-256** and matched against the blockchain registry to detect forgery.

---

## 🚀 4. New Features Added in this Project

### 1. 🛡️ Mandatory Government Access Gateway & 5-Tier RBAC
* Enforces strict official sign-in every time the website is opened or refreshed (zero automatic session restore across reloads).
* 1-Click evaluation presets for all 5 administrative tiers (*Central Ministry, State GIS Officer, District Magistrate, Field Surveyor, Landowner*).

### 2. 🔍 Real-Time Landowner GIS Registry Search
* Search bar integrated directly into the Land Parcels GIS Registry.
* Typing **`Anmol`** filters all plots in real time, centers the satellite map on `PLOT-OD-2026-9821`, and highlights the boundary polygon.

### 3. 🛰️ Automated Nearest Surveyor Geospatial Dispatch (Haversine Proximity Engine)
* Uses the **Haversine formula** to calculate great-circle GPS distance between the land parcel and all active district survey officers:
  $$\text{distance} = 2 R \arcsin\left(\sqrt{\sin^2\left(\frac{\Delta\text{lat}}{2}\right) + \cos(\text{lat}_1)\cos(\text{lat}_2)\sin^2\left(\frac{\Delta\text{lon}}{2}\right)}\right)$$
* Automatically identifies and selects the closest available officer (e.g. `Rajesh Mohapatra, SO-774`, 2.2 km away).

### 4. 🔒 Passcode-Protected Notice Dispatch (`SIH@12345`)
* Prevents accidental dispatches with a dedicated Security Authorization Modal pre-set with passcode `SIH@12345`.

### 5. 📧 Live TLS 1.3 Gmail SMTP Notice Dispatch
* Dispatches authentic, cryptographically signed government HTML notices directly to landowner emails (e.g. `anmol7895303@gmail.com`) with SPF/DKIM/DMARC compliance.

### 6. 📝 Standalone Public Citizen Objection Portal
* Dedicated citizen portal accessible via single-use email token links without requiring an official login account.
* Complete role isolation: citizens have zero access to internal government dashboards.

### 7. 📬 Real-Time Executive Live Grievance Monitor Box
* Located at the bottom of the **Executive Dashboard**.
* Auto-polls every 15 seconds to display newly submitted citizen objections with live status badges (🔴 `PENDING`, 🟡 `UNDER_REVIEW`, 🟢 `RESOLVED`), parcel references, and citizen remarks.

### 8. 📱 Cadastral Field Surveyor Operative Node
* Mobile-first responsive station for on-ground surveyors to record GPS boundary coordinates, soil fertility, standing crops, and upload geotagged site photographs.

### 9. 👛 Web3 Smart Escrow & PFMS Cryptographic Receipts
* Direct Benefit Transfer (DBT) compensation release from escrow directly to the beneficiary wallet.
* Generates official printable payment advice receipts with transaction hash and block number.

### 10. 📄 On-Chain Title Deed SHA-256 Hash Verification
* Computes real-time client-side SHA-256 hashes of uploaded land deeds and survey PDFs, matching them against on-chain records to prevent duplicate sales and forged deeds.

---

## 💻 5. Quick Local Run Commands

### Backend:
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

### Frontend:
```bash
cd frontend
npm install
npm run dev
```
*Open `http://localhost:5173` to test all features.*
