import os
from fpdf import FPDF

class NLAMSPDF(FPDF):
    def header(self):
        if self.page_no() > 1:
            self.set_font('Helvetica', 'I', 8)
            self.set_text_color(100, 110, 120)
            self.cell(0, 10, 'NLAMS - Smart India Hackathon 2026 Project Report', border=0, new_x="LMARGIN", new_y="NEXT", align='R')
            self.ln(5)

    def footer(self):
        self.set_y(-15)
        self.set_font('Helvetica', 'I', 8)
        self.set_text_color(150, 150, 150)
        self.cell(0, 10, f'Page {self.page_no()}', 0, 0, 'C')

    def add_section_header(self, text):
        self.set_font('Helvetica', 'B', 14)
        self.set_text_color(15, 35, 80) # Ashoka Navy Blue
        self.cell(0, 10, text, new_x="LMARGIN", new_y="NEXT")
        self.ln(2)

    def add_subsection_header(self, text):
        self.set_font('Helvetica', 'B', 11)
        self.set_text_color(30, 41, 59) # Slate 800
        self.cell(0, 8, text, new_x="LMARGIN", new_y="NEXT")
        self.ln(1)

    def add_body_text(self, text):
        self.set_font('Helvetica', '', 10)
        self.set_text_color(71, 85, 105) # Slate 600
        self.multi_cell(0, 6, text)
        self.ln(4)

    def add_bullet_point(self, title, text):
        self.set_font('Helvetica', 'B', 10)
        self.set_text_color(51, 65, 85) # Slate 700
        self.write(6, f"  -  {title}: ")
        self.set_font('Helvetica', '', 10)
        self.set_text_color(71, 85, 105)
        self.write(6, f"{text}\n")
        self.ln(2)

# Create PDF instance
pdf = NLAMSPDF()
pdf.set_margins(15, 20, 15)
pdf.add_page()

# --- COVER PAGE ---
pdf.ln(20)
# Title
pdf.set_font('Helvetica', 'B', 24)
pdf.set_text_color(15, 23, 42) # Slate 900
pdf.multi_cell(0, 12, "National Land Acquisition &\nManagement System (NLAMS)", align='C')
pdf.ln(8)

# Subtitle
pdf.set_font('Helvetica', 'B', 14)
pdf.set_text_color(234, 88, 12) # Saffron
pdf.cell(0, 8, "Smart India Hackathon (SIH) 2026", new_x="LMARGIN", new_y="NEXT", align='C')
pdf.ln(5)

pdf.set_font('Helvetica', '', 11)
pdf.set_text_color(100, 116, 139)
pdf.cell(0, 6, "Web3 & GIS Enabled End-to-End Monitoring Portal Report", new_x="LMARGIN", new_y="NEXT", align='C')
pdf.ln(40)

# Cover Meta Box
pdf.set_fill_color(248, 250, 252) # Slate 50
pdf.rect(20, 130, 170, 50, 'F')
pdf.set_xy(25, 135)
pdf.set_font('Helvetica', 'B', 11)
pdf.set_text_color(30, 41, 59)
pdf.cell(0, 6, "PROJECT METADATA", new_x="LMARGIN", new_y="NEXT")
pdf.ln(3)

pdf.set_font('Helvetica', '', 9)
pdf.set_text_color(71, 85, 105)
pdf.set_x(25)
pdf.cell(50, 5, "Problem Statement:")
pdf.set_font('Helvetica', 'B', 9)
pdf.cell(0, 5, "Real-Time National Land Acquisition & Management System", new_x="LMARGIN", new_y="NEXT")

pdf.set_font('Helvetica', '', 9)
pdf.set_x(25)
pdf.cell(50, 5, "Focus Areas:")
pdf.set_font('Helvetica', 'B', 9)
pdf.cell(0, 5, "Web3 Blockchain, GIS Parcel Mapping, LARR Workflow Router", new_x="LMARGIN", new_y="NEXT")

pdf.set_font('Helvetica', '', 9)
pdf.set_x(25)
pdf.cell(50, 5, "Prototype Version:")
pdf.set_font('Helvetica', 'B', 9)
pdf.cell(0, 5, "v2.0 (Modernized Government Light Theme Portal)", new_x="LMARGIN", new_y="NEXT")

pdf.set_font('Helvetica', '', 9)
pdf.set_x(25)
pdf.cell(50, 5, "Compiled Date:")
pdf.set_font('Helvetica', 'B', 9)
pdf.cell(0, 5, "August 2026", new_x="LMARGIN", new_y="NEXT")

# --- SECOND PAGE ---
pdf.add_page()

pdf.add_section_header("1. Overall Website Layout & Page Features")
pdf.add_body_text("The NLAMS system translates the LARR (Land Acquisition Act, 2013) guidelines into a unified digital pipeline. The pages serve the following purposes:")

pdf.add_subsection_header("Home / Landing Portal")
pdf.add_body_text("Styled as an official national entry portal, featuring a tricolor header band, a hero overview of the LARR roadmap, and animated highlights of the system's operational pillars.")

pdf.add_subsection_header("Executive Analytics & Monitoring (Dashboard)")
pdf.add_body_text("Designed for central and state decision-makers. Features:")
pdf.add_bullet_point("Dynamic KPIs", "Tracks total notified vs acquired land area, compensation disbursement ratios, and average resettlement rates.")
pdf.add_bullet_point("GIS Visualizer", "Renders land parcel coordinates as interactive map polygons. Colors update dynamically based on stage.")
pdf.add_bullet_point("Mitigation Risk Index", "Provides risk alerts, completion forecasts, and bottleneck analysis based on regional parcel fragmentation and current step latency.")
pdf.add_bullet_point("MIS Export", "An active button compiling project metrics into a downloadable CSV spreadsheet on the fly.")

pdf.add_subsection_header("Proposals & Automated Workflows")
pdf.add_body_text("The operational pipeline. Central ministries can register new proposals. State, district, and surveyor profiles can switch roles in the header and verify/approve subsequent milestones. Completed stages feature printable gazette document buttons.")

pdf.add_subsection_header("Web3 Trust & Compensation Portal")
pdf.add_body_text("The decentralised backend simulation. Integrates a mock Metamask connection to disburse escrow funds. Logs every action (payouts, titles, geo-fences) in a state audit block ledger. Includes a digital deed upload widget that computes file SHA-256 hashes to verify authenticity.")

pdf.add_subsection_header("Field Surveyor Node")
pdf.add_body_text("Mobile-responsive field interface. Simulates GPS sensor triangulation to capture boundary points. Records valuation attributes (soil fertility, structure types) and uploads site photos.")

# --- THIRD PAGE ---
pdf.add_page()

pdf.add_section_header("2. Role-Based Access Control (RBAC) & Simulations")
pdf.add_body_text("The NLAMS system features role-based access control to reflect the multiple authorities involved in land acquisition. Switching user profiles in the portal alters the available actions:")

pdf.add_subsection_header("Central Ministry (ministry)")
pdf.add_body_text("Has super-admin capabilities to register new land acquisition proposals, view national statistics, and sign off on any workflow stage for ease of demonstration.")

pdf.add_subsection_header("State Government (state)")
pdf.add_body_text("Responsible for Stage 2: GIS Verification. When a proposal is submitted, only the State Government profile can verify boundary coordinates and record spatial alignment hashes on the ledger.")

pdf.add_subsection_header("District Authority / Collector (district)")
pdf.add_body_text("Responsible for Stage 3 (Section 11 Notification) and Stage 4 (Award Declaration). Collector actions publish legal intent and lock valuation budgets in the escrow smart contracts.")

pdf.add_subsection_header("Field Surveyor (surveyor)")
pdf.add_body_text("Granted access to the Field Surveyor Node to trigger mobile-responsive GPS sensor detections, classify soil quality, inspect unbuilt plots, and sign off on Stage 5: Possession Handover.")

pdf.add_subsection_header("Citizen / Land Owner (citizen)")
pdf.add_body_text("View-only access for workflows. Permitted to connect a crypto wallet in the Compensation Portal to claim payments directly from the escrow account, keeping transactions completely transparent.")

# --- FOURTH PAGE ---
pdf.add_page()

pdf.add_section_header("3. Tech Stack Breakdown")
pdf.add_body_text("The application is developed using standard industry-level technologies suited for fast hot-reloading and polished UI output under pressure:")
pdf.add_bullet_point("Frontend Framework", "React.js built on Vite (Vite 8, React 19) for immediate loading times and HMR (Hot Module Replacement).")
pdf.add_bullet_point("Styling Stack", "Tailwind CSS v4 for fully custom responsive components, clean government-themed color palettes, and layouts.")
pdf.add_bullet_point("GIS Map Rendering", "React Leaflet & Leaflet.js utilizing OpenStreetMap tile layers to draw and render coordinate boundaries (polygons).")
pdf.add_bullet_point("MIS Visual Charts", "Recharts package using SVG elements for responsive financial and progress bar graphs.")
pdf.add_bullet_point("Icons", "Lucide React icons for clean, minimalistic government and technical emblems.")
pdf.add_bullet_point("Web3 Simulation", "Context-based mock ledger engine simulating SHA-256 hashes, transaction block creation, and crypto signatures.")

pdf.add_section_header("4. Path to Production: Making the Project Real")
pdf.add_body_text("To elevate this frontend prototype into a production-grade system for the final hackathon round, the following back-end integrations are required:")

pdf.add_subsection_header("A. Smart Contract Deployments (Web3)")
pdf.add_body_text("Replace the mockup ledger with actual Solidity Smart Contracts deployed to an Ethereum Layer 2 (e.g. Arbitrum, Optimism) or Polygon. Use contracts to tokenize land titles as Soulbound NFTs (non-transferable title deeds) and lock compensation in Escrow wallets that auto-release on PFMS verification.")

pdf.add_subsection_header("B. Real API Integrations")
pdf.add_body_text("Connect actual government databases to feed data into the portal:")
pdf.add_bullet_point("BHOOMI / State Registries", "Connect REST APIs to fetch official land ownership details, preventing double-selling disputes.")
pdf.add_bullet_point("BhuNaksha", "Import XML/GeoJSON cadastral maps to verify physical land shapes on the map.")
pdf.add_bullet_point("PFMS Gateway", "Integrate the Public Financial Management System to trigger real-time bank transfers.")

pdf.add_subsection_header("C. Geospatial Database")
pdf.add_body_text("Use a database like PostgreSQL with the PostGIS extension. This allows you to run spatial SQL queries (e.g. detect if highway path intersects with protected forest reserves or existing private buildings).")

pdf.add_subsection_header("D. Official Authentication")
pdf.add_body_text("Implement Single Sign-On (SSO) using India's Digilocker or Aadhaar API, verifying the identities of surveyors, district magistrates, and farmers.")

# Save PDF to disk
output_path = os.path.join("c:\\Users\\win11\\Downloads\\sih", "NLAMS_Project_Documentation.pdf")
pdf.output(output_path)
print(f"PDF successfully generated at: {output_path}")
