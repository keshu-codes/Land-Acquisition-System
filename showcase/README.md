# 🏛️ NLAMS Phase 1 Showcase & Initial Evaluation Kit

Welcome to the **Phase 1 Initial Showcase** for the **National Land Acquisition & Management System (NLAMS)**.

This folder is designed specifically for **Mentor Round 1 (Problem Validation)** and **Mentor Round 2 (Architecture & Initial Design)** during the opening hours of the hackathon.

---

## 🚀 How to Open the Interactive Showcase Portal

Simply double-click or open **`showcase/index.html`** in any web browser (Chrome, Edge, Firefox, Brave):

```bash
# Or open from terminal:
start showcase/index.html
```

---

## 🎯 What to Show Mentors During Phase 1 (Initial Level)

Mentors during Round 1 and Round 2 do **NOT** expect a finished final app on minute one. They evaluate:
1. **Problem Clarity**: Understanding the statutory bottlenecks under the **RFCTLARR Act, 2013** (3–7 year court delays, paper notice failures).
2. **System Architecture**: High-level decoupled architecture connecting React 19, FastAPI, Leaflet GIS, and Web3 Smart Escrow.
3. **Database Relational Design (ER Models)**: Relational tables for `LandParcels`, `SurveyOfficers`, `GrievanceTokens`, and `Beneficiaries`.
4. **UI Wireframe Scaffolding**: Initial interface designs for the 5 RBAC roles and the Haversine Nearest Surveyor formula.

---

## 📂 Contents of this Showcase Kit

| File / Section | Purpose |
| :--- | :--- |
| **`showcase/index.html`** | Standalone interactive web portal with 5 tabs (*Problem, Architecture, Wireframes, ER Models, Mentor Q&A*). |
| **`showcase/README.md`** | This quick-start guide and talking points for Phase 1. |
| **`NLAMS_Master_Defense_Manual.pdf`** | Standalone 8-section manual with all statutory details and 20+ judge Q&As. |

---

## 🎤 1-Minute Phase 1 Pitch Script for Mentors

> *"Good morning Sir/Ma'am! For Phase 1, our project tackles India's #1 infrastructure bottleneck — Land Acquisition Delays under the **RFCTLARR Act, 2013**.*  
> 
> *Currently, mega projects like Highways and Dedicated Freight Corridors face 3 to 7 years of court stays because physical Section 11 notices fail to reach landowners and surveyor deployment is done manually.*  
> 
> *Our solution, **NLAMS**, provides:*  
> *1. **Automated Proximity GIS Dispatch**: Uses the Haversine trigonometric formula to auto-assign the closest certified field surveyor.*  
> *2. **Zero-Trust Tokenized Citizen Portal**: Dispatches 30-day single-use cryptographic JWT links via TLS 1.3 email so rural citizens can file objections without needing complex logins.*  
> *3. **Web3 Direct Benefit Transfer (DBT)**: Locks compensation into smart contract escrow with verifiable PFMS payment advice receipts and SHA-256 title deed hashing.*  
> 
> *Here are our system architecture, relational database schemas, and initial interface wireframes!"*
