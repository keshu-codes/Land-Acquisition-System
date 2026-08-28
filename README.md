# 🏛️ National Land Acquisition & Management System (NLAMS)
### Smart India Hackathon (SIH) 2026

An enterprise digital land acquisition portal featuring **5-Tier Role-Based Access Control (RBAC)**, **Automated Nearest Surveyor Haversine Dispatch**, **TLS 1.3 Tokenized Citizen Grievance Portal**, and **Web3 Spatial Escrow Ledger** under India's **RFCTLARR Act, 2013**.

---

## 🚀 Quickstart: How to Run on Any Computer

### 1. Clone the Repository
```bash
git clone https://github.com/keshu-codes/Land-Acquisition-System.git
cd Land-Acquisition-System
```

### 2. Run Backend (Terminal 1)
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
*Backend API docs available at: `http://127.0.0.1:8000/docs`*

### 3. Run Frontend (Terminal 2)
```bash
cd frontend
npm install
npm run dev
```
*Frontend UI opens at: `http://localhost:5173`*

---

## 👥 1-Click Demo Profiles (Password: `nlams2026`)

| Role | Username | Representative Name | Primary Function |
| :--- | :--- | :--- | :--- |
| **Central Ministry** | `ministry` | Dr. Rajesh Verma | National KPI Monitoring & Mega Corridor Approval |
| **State GIS Authority** | `state` | Priya Sundaram | Cadastral Boundary & Overlap Verification |
| **District Magistrate** | `collector` | Amitabh Choudhury (IAS) | Nearest Surveyor Dispatch & Section 11 Notice |
| **Field Surveyor** | `surveyor` | Suresh Kumar | Mobile GPS Geotagging & Crop/Soil Inspection |
| **Citizen / Landowner** | `citizen` | Rameshwar Patel / Anmol | Tokenized Objections & Web3 Escrow Claim |

---

## 🛠️ How Collaborators Can Make Changes & Push

### Step A: Pull Latest Changes First
```bash
git pull origin main
```

### Step B: Create a New Feature Branch
```bash
git checkout -b feature/your-feature-name
```

### Step C: Make Code Edits
* **Frontend changes**: edit files in `frontend/src/`
* **Backend changes**: edit files in `backend/app/`

### Step D: Commit & Push Your Changes
```bash
git add .
git commit -m "feat: description of changes"
git push origin feature/your-feature-name
```
*Then open a Pull Request on GitHub to merge into `main`!*
