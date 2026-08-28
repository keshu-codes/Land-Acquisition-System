# National Land Acquisition & Management System (NLAMS)
## Smart India Hackathon (SIH) 2026 — Master Technical Defense Manual

---

## 1. The Big Picture: What is NLAMS & Why Was It Built?

### The Real-World Problem in India:
In India, mega infrastructure projects (Highways, High-Speed Rail Corridors, Industrial Corridors, Metro Lines) frequently face delays of **3 to 7 years** due to bottlenecks in the land acquisition lifecycle under the **RFCTLARR Act, 2013 (Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act)**.

* **Paper Notice Failures:** Landowners never receive Section 11 notices on time, causing court stays and litigation.
* **Delayed Surveyor Assignment:** No automated way to assign the closest certified land surveyor to measure plot boundaries.
* **Compensation Corruption & Middlemen:** Landowners are deprived of their fair circle rate compensation or face heavy clerical deductions.
* **Counterfeit Title Deeds & Overlaps:** Multiple claimants sell the same plot using forged registry papers.

### How NLAMS Solves This (Our Solution):
NLAMS is a **Gov-Official-Only Spatial Platform** coupled with an **External Citizen Objection Gateway** and a **Web3 Spatial Escrow Ledger**:
1. **Multi-Tier Governance:** Enforces strict Role-Based Access Control (RBAC) across Central Ministry, State GIS Officers, District Magistrates, Field Surveyors, and Landowners.
2. **Nearest Officer Proximity:** Uses the mathematical **Haversine Formula** to compute GPS distances and automatically dispatch the closest available cadastral surveyor.
3. **Single-Use Citizen Grievance:** Generates 30-day cryptographically signed JWT tokens sent via **TLS 1.3 SMTP email**, giving citizens zero access to internal dashboards.
4. **Web3 DBT Escrow:** Locks awarded compensation into a digital Smart Escrow with immutable blockchain transaction receipts and client-side SHA-256 deed validation.

---

## 2. Complete Technical Stack & Architecture

| Layer | Technology Used | Exact Role in the Project |
| :--- | :--- | :--- |
| **Frontend** | React 19, Vite 8, Tailwind CSS | Fast, responsive UI with role-tailored navigation and real-time state management. |
| **GIS Mapping** | React-Leaflet, Google Satellite Tiles | Visualizes cadastral polygons, plot boundaries, circle rates, and landowner markers on satellite maps. |
| **Backend API** | FastAPI (Python 3.14), Uvicorn | High-performance REST API with asynchronous request processing and strict Pydantic v2 schemas. |
| **Database** | SQLModel (SQLAlchemy + Pydantic), SQLite | Relational storage for Parcels, Projects, Survey Officers, Grievance Tokens, and Objections. |
| **Email Security** | Python `smtplib`, TLS 1.3 SSL, Gmail SMTP | Dispatches official government legal notices with SPF, DKIM, and DMARC alignment headers. |
| **Cryptography** | PyJWT, PBKDF2-HMAC-SHA256, Web3.js / SHA-256 | Signed 30-day tokens, hashed passwords, client-side document hashing, and spatial blockchain ledger. |

---

## 3. Deep Dive into the 7 Core Modules

### Module 1: Mandatory Government Access Gateway & 5-Tier RBAC
* Whenever the portal is opened, the system strictly prompts for official authentication.
* Sessions are never silently restored across device restarts to prevent unauthorized workstation access in government offices.
* Auto-routes to designated tiers:
  * `Dr. Rajesh Verma` (Central Ministry) ➔ **Executive Monitoring Dashboard**
  * `Priya Sundaram` (State GIS Officer) ➔ **Case Files & GIS Verification Workflow**
  * `Amitabh Choudhury (IAS)` (District Magistrate) ➔ **Survey Notice Dispatch Console**
  * `Suresh Kumar` (Field Surveyor) ➔ **Cadastral Field Survey Station**
  * `Rameshwar Patel / Anmol` (Citizen) ➔ **Web3 Compensation & Escrow Portal**

### Module 2: Executive Monitoring Dashboard & GIS Land Registry
* Aggregates live acquisition progress (e.g. 13,369 ha notified, ₹6,931 Cr disbursed).
* Features a **Real-Time Landowner Search Bar**: typing `Anmol` filters all national plots instantly, centers the satellite map on plot `PLOT-OD-2026-9821`, and opens the details popup with one-click dispatch.

### Module 3: Case Files & Multi-Tier Proposal Workflow
* Tracks land acquisition proposals through 5 statutory legal stages under the RFCTLARR Act:
  `Proposal Submitted ➔ GIS Verification ➔ Section 11 Notification ➔ Award Declared ➔ Possession Handover`.

### Module 4: Survey Notice & Nearest Officer Dispatch Engine
* When the District Magistrate selects plot `PLOT-OD-2026-9821` in Bhubaneswar (20.2961° N, 85.8245° E), the backend executes the **Haversine Formula**:
  `d = 2 * R * arcsin(sqrt(sin²(Δlat/2) + cos(lat1)*cos(lat2)*sin²(Δlon/2)))`
* Auto-detects that **Rajesh Mohapatra (SO-774)** is the closest available officer (2.2 km away).
* The Magistrate authorizes with passcode `SIH@12345`, generating a 30-day token (`GRV-2026-9821-XXX`) and dispatching a TLS 1.3 email notice.

### Module 5: Standalone Public Citizen Objection Portal
* When the citizen clicks the button in their email, they access `/?token=GRV-...`.
* Server validates the cryptographic token, displays verified plot details (1.45 Acres, ₹42.5 Lakhs), and allows submitting a *Valuation / Boundary / Title* dispute.
* Once submitted, the token is marked `is_used = True` so it can never be reused.

### Module 6: Cadastral Field Survey Node
* A mobile-responsive web station designed for field surveyors with GPS boundary capture, soil fertility categorization, structural inventory, and camera photo geotagging.

### Module 7: Web3 Spatial Ledger & Direct Benefit Transfer (DBT) Escrow
* Awarded compensation is locked in smart escrow.
* Landowner connects Web3 wallet, claims compensation directly, and receives an official **PFMS Payout Advice Receipt** with a transaction hash (`0x7d6e...`) and block number (`#104502`).
* Documents are verified on-chain via real-time client-side SHA-256 hashing.

---

## 4. Winning 3-Minute Presentation Pitch (Say This to the Judges!)

> **"Respected Judges,**
> 
> In India, mega infrastructure projects face an average delay of 4.5 years due to litigation and lack of transparency in land acquisition under the RFCTLARR Act 2013.
> 
> We present **NLAMS — The National Land Acquisition & Management System**.
> 
> NLAMS solves this through 3 core technological breakthroughs:
> 1. **Automated Geospatial Proximity:** Our Haversine spatial engine detects the nearest available cadastral officer and dispatches Section 11 notices with one click.
> 2. **Zero-Trust Citizen Security:** Landowners receive single-use cryptographic grievance tokens via TLS 1.3 encrypted emails, letting them file objections in 30 seconds without accessing sensitive internal government dashboards.
> 3. **Web3 Spatial Escrow:** We eliminate middlemen by disbursing compensation directly into verified wallets via Smart Escrow with immutable blockchain audit receipts and SHA-256 title deed validation.
> 
> Let us show you a live demonstration of a notice being dispatched to a real landowner right now..."

---

## 5. Top 10 Judge Cross-Questions & Bulletproof Answers

### Q1: How do you prevent unauthorized citizens from accessing internal government dashboards?
**Answer:** We implement a strict **Zero-Trust Tokenized Architecture**. The internal portal requires JWT bearer authentication with role-based claims (`ministry`, `state`, `district`, `surveyor`). Citizens are *never* given user accounts on the internal dashboard. Instead, when a notice is issued, we generate a **30-day cryptographically signed single-use token (JWT + short code)**. The public grievance endpoint (`/api/v1/grievances/validate-token`) only exposes that specific landowner's parcel metadata and allows exactly one submission before the token is burned (`is_used = True`).

### Q2: How is the nearest survey officer calculated? What algorithm is used?
**Answer:** We use the **Haversine Great-Circle Distance Formula** in Python. Given the centroid coordinates of the land parcel (e.g., Bhubaneswar: 20.2961° N, 85.8245° E) and the real-time GPS locations of all active survey officers in that district, our algorithm computes the spherical surface distance in kilometers:  
`distance = 2 * R * asin(sqrt(sin²(Δlat/2) + cos(lat1)*cos(lat2)*sin²(Δlon/2)))`  
The system filters for officers with `status == "Available"` and automatically selects the closest candidate (e.g. Officer Rajesh Mohapatra, 2.2 km away).

### Q3: Why did you use Web3 and Blockchain for land acquisition? Is it just a buzzword?
**Answer:** No, it solves a fundamental legal problem in India: **tamper-proof audit trails and double-selling prevention**. In traditional land registries, local database records can be silently edited or backdated by corrupt officials. In NLAMS:
1. Every statutory milestone (Ministry proposal, State GIS clearance, Section 11 Gazette, Award declaration) is signed with the official's cryptographic address and written to an immutable block ledger.
2. Compensation is held in a **Smart Contract Escrow**, releasing funds directly to the verified beneficiary upon title vesting, preventing embezzlement.
3. Title deeds are hashed with **SHA-256**, allowing instant on-chain authenticity verification.

### Q4: What happens if a citizen does not have an email or internet access?
**Answer:** NLAMS supports an **Omni-Channel Notification Pipeline**:
1. **Digital:** TLS 1.3 encrypted Email with 1-click tokenized objection link.
2. **Telecom / SMS:** Short token SMS (e.g., `GRV-2026-9821-BA5`) sent to their registered mobile number.
3. **Common Service Centres (CSC):** Village-level VLEs (Village Level Entrepreneurs) can enter the citizen's short token at any local CSC / Panchayat kiosk to submit objections on their behalf.
4. **Physical Notice Tracking:** The system auto-generates Section 11 Form-C PDF notices with official QR codes for registered postal dispatch.

### Q5: How do you ensure email deliverability and prevent phishing or spam flags?
**Answer:** We adhere to enterprise government email security protocols:
1. **TLS 1.3 Encryption:** All SMTP connections use SSL/TLS with forced minimum cipher suites.
2. **SPF (Sender Policy Framework):** Authorizes our server IP address in the domain DNS.
3. **DKIM (DomainKeys Identified Mail):** Embeds a 2048-bit RSA cryptographic signature in the email header.
4. **DMARC Alignment (p=reject):** Strict alignment ensuring spoofed emails from scammers are rejected by Gmail/Outlook.

### Q6: How does the system handle concurrent objections and prevent duplicate claims?
**Answer:** At the database level, each token record in `grievancetoken` maintains an `is_used` boolean flag. When an objection is submitted to `/api/v1/grievances/submit/{token}`, the transaction runs inside an atomic database session:
1. Checks if `db_token.is_used == True` (raises HTTP 409 Conflict if already submitted).
2. Checks if `db_token.expires_at < utcnow()` (raises HTTP 410 Gone if expired).
3. Inserts the grievance record and sets `is_used = True` within the same atomic commit.

### Q7: How does your system integrate with existing government platforms like PM GatiShakti and BHOOMI?
**Answer:** NLAMS features an **API-Based Interoperability Gateway** (as displayed on the Executive Dashboard):
* **BHOOMI / Bhulekh:** REST/SOAP endpoints fetch state cadastral RoR (Record of Rights) and circle rates.
* **Bhunaksha:** Ingests GeoJSON/Shapefile parcel boundaries.
* **PM GatiShakti NMP:** Coordinates spatial clearance across multi-modal infrastructure layers (railways, power grids, pipelines).
* **PFMS (Public Financial Management System):** Executes direct bank escrow disbursements.

### Q8: What if the survey officer alters the GPS coordinates or boundary polygon during field inspection?
**Answer:** The **Cadastral Field Survey Node** binds captured GPS coordinates to the device hardware timestamp and photo evidence. Any manual change to the polygon vertices triggers a **State GIS Boundary Clearance Review** (handled by Priya Sundaram, State GIS Officer) before the Section 11 Gazette can be published. Furthermore, the coordinate hash is written to the blockchain audit trail, preventing post-facto tampering.

### Q9: Why is password persistence disabled on website reload?
**Answer:** In government and public-sector environments, computers are often shared across shifts. Auto-restoring session credentials from `localStorage` poses a severe security risk. In NLAMS, every page reload or fresh visit forces an explicit official login, ensuring strict session auditing and zero session hijacking.

### Q10: What is the scalability and production roadmap for NLAMS?
**Answer:** 
1. **Database Migration:** Seamless transition from SQLite to enterprise PostgreSQL with PostGIS for spatial polygon intersection queries.
2. **Cloud Hosting:** Containerized Docker deployment on National Informatics Centre (NIC) MeghRaj Cloud or AWS GovCloud.
3. **Identity Federation:** Integration with DigiLocker and MeriPehchaan for Aadhaar e-KYC Single-Sign-On.
4. **Blockchain Mainnet:** Migration to Hyperledger Fabric or Polygon Proof-of-Stake for enterprise high-throughput spatial transactions.

---

## 6. Key Technical Terms & Glossary

* **RFCTLARR Act, 2013:** The Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act enacted by the Indian Parliament.
* **Section 11 Notification:** The preliminary statutory gazette notification published by the District Collector declaring the government's intent to acquire land for public purpose.
* **ULPIN:** Unique Land Parcel Identification Number — a 14-digit alphanumeric BHOOMI identifier based on longitude and latitude coordinates of the parcel.
* **Circle Rate:** The minimum government-notified threshold price per square meter / acre below which land cannot be registered in a given tehsil/district.
* **Haversine Formula:** An equation giving great-circle distances between two pairs of GPS coordinates on a sphere, used for nearest surveyor routing.
* **Direct Benefit Transfer (DBT):** Direct electronic transfer of compensation subsidies from government treasury escrow directly into the citizen's bank / wallet account.
* **PFMS:** Public Financial Management System — the central government platform for tracking treasury fund release and DBT subsidies.
* **SHA-256:** A 256-bit cryptographic hash function used to verify digital document integrity and detect unauthorized alterations.

---
*Developed for Smart India Hackathon (SIH) 2026 | National Land Acquisition & Management System (NLAMS)*
