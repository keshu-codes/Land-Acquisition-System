import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  Building, FileText, CheckCircle2, AlertCircle, Clock, 
  Download, ExternalLink, ArrowRight, ShieldCheck, Briefcase, 
  Send, Layers, Search, MapPin, ChevronRight, Printer
} from 'lucide-react';

export default function AgencyDashboard({ setActiveTab }) {
  const { proposals, language, triggerSMS } = useContext(AppContext);

  const [activeSubTab, setActiveSubTab] = useState('tenders');
  const [selectedTenderId, setSelectedTenderId] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [bidSubmitted, setBidSubmitted] = useState(false);

  // Agency Demo Profile
  const agencyProfile = {
    company_name: "Larsen & Toubro Infrastructure Projects Ltd.",
    registration_id: "CORP-NHAI-EPC-2026-9812",
    pan_gstin: "27AAACL1234F1Z8",
    ministry_accreditation: "Class-1 Super-Special Highway Concessionaire",
    active_bids: 3,
    awarded_projects: 4,
    esg_compliance_score: "94.8 / 100",
    authorized_signatory: "Rajeshwar Singhania (VP Infrastructure)"
  };

  // Available Tenders (CPPP / GeM Format)
  const tenders = [
    {
      id: "NIT/NHAI/2026/001",
      title: "Delhi-Mumbai Greenfield Expressway Package IV — Civil Earthworks & Corridor Development",
      state: "Maharashtra / Gujarat",
      area_required: "1,250 Ha (340 Plots)",
      estimated_budget: "₹1,450.00 Cr",
      emd_amount: "₹14.50 Cr",
      closing_date: "15-Oct-2026 17:00 IST",
      status: "Open for Technical Bidding",
      eligibility: "Class-1 Concessionaire (Net Worth > ₹500 Cr)"
    },
    {
      id: "NIT/MORTH/2026/002",
      title: "Bhubaneswar Multi-Modal Logistics Park & Terminal Concession Allotment",
      state: "Odisha",
      area_required: "450 Ha (112 Plots)",
      estimated_budget: "₹620.00 Cr",
      emd_amount: "₹6.20 Cr",
      closing_date: "28-Oct-2026 17:00 IST",
      status: "Section 11 Gazette Released",
      eligibility: "Multi-Modal Freight & Terminal Operators"
    },
    {
      id: "NIT/DFCCIL/2026/003",
      title: "Eastern Dedicated Freight Corridor Phase-2 Land Development & Track Laying",
      state: "Uttar Pradesh / Bihar",
      area_required: "890 Ha (275 Plots)",
      estimated_budget: "₹980.00 Cr",
      emd_amount: "₹9.80 Cr",
      closing_date: "05-Nov-2026 17:00 IST",
      status: "Open for Pre-Qualification",
      eligibility: "Railway & Heavy Earthworks Concessionaires"
    }
  ];

  const handleApplyTender = (e) => {
    e.preventDefault();
    setBidSubmitted(true);
    triggerSMS(
      "Govt-E-Procure",
      `Technical Concession Bid submitted by ${agencyProfile.company_name} for Tender #${selectedTenderId}. Token: BID-CPPP-${Date.now().toString().slice(-6)}`
    );
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] text-[#1E293B] font-sans pb-16">
      
      {/* 1. Official Breadcrumb Strip */}
      <div className="bg-white border-b border-slate-200 py-2 px-4 sm:px-8 text-xs">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-slate-500 font-medium">
          <button onClick={() => setActiveTab('home')} className="hover:text-[#1B365D] hover:underline cursor-pointer">Home</button>
          <ChevronRight className="h-3 w-3 text-slate-400" />
          <span className="text-slate-700 font-semibold">Central e-Procurement Portal (CPPP)</span>
          <ChevronRight className="h-3 w-3 text-slate-400" />
          <span className="text-[#1B365D] font-bold">Land Allotment & Infrastructure Tenders</span>
        </div>
      </div>

      {/* 2. Header Plaque */}
      <div className="bg-[#1B365D] text-white py-6 px-4 sm:px-8 border-b-2 border-[#EA580C]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
              <span>National Highways Authority of India • Central Public Procurement Portal</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-serif">
              Greenfield Corridor Tenders & Concession Allotments
            </h1>
            <p className="text-xs text-slate-300 mt-0.5">
              Notice Inviting Tender (NIT) repository, spatial GIS corridor overlays, statutory environmental clearances, and e-Bidding submissions.
            </p>
          </div>

          <div className="bg-[#0F233D] border border-slate-600 px-4 py-2.5 rounded text-xs space-y-0.5">
            <div className="text-slate-400 text-[10px] uppercase font-bold">Registered Concessionaire</div>
            <div className="font-bold text-white text-sm">{agencyProfile.company_name}</div>
            <div className="text-[11px] text-amber-300 font-mono">Reg ID: {agencyProfile.registration_id}</div>
          </div>
        </div>
      </div>

      {/* 3. Sub-Navigation Tabs */}
      <div className="bg-white border-b border-slate-300 sticky top-20 z-20 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex space-x-1 overflow-x-auto">
          {[
            { id: 'tenders', label: 'Active Tenders (NIT)', icon: Briefcase },
            { id: 'applications', label: 'Submit Technical Bid', icon: Clock },
            { id: 'profile', label: 'Concessionaire Credentials', icon: Building },
            { id: 'documents', label: 'Environmental Clearances & NOCs', icon: FileText }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-bold transition whitespace-nowrap cursor-pointer border-b-2 ${
                  isActive 
                    ? 'border-[#1B365D] text-[#1B365D] bg-slate-50' 
                    : 'border-transparent text-slate-600 hover:text-[#1B365D] hover:bg-slate-50'
                }`}
              >
                <Icon className="h-4 w-4 text-[#1B365D]" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Main Body Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 space-y-6">

        {/* SUBTAB 1: Active Tenders */}
        {activeSubTab === 'tenders' && (
          <div className="space-y-6">
            
            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs select-none">
              <div className="bg-white p-3.5 rounded border border-slate-300 shadow-2xs">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Active NIT Tenders</span>
                <span className="text-lg font-bold text-slate-900 font-serif mt-0.5">18 Published</span>
              </div>
              <div className="bg-white p-3.5 rounded border border-slate-300 shadow-2xs">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Total Land Extent</span>
                <span className="text-lg font-bold text-emerald-800 font-serif mt-0.5">14,250 Hectares</span>
              </div>
              <div className="bg-white p-3.5 rounded border border-slate-300 shadow-2xs">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Total Concession Value</span>
                <span className="text-lg font-bold text-[#1B365D] font-serif mt-0.5">₹18,400 Cr</span>
              </div>
              <div className="bg-white p-3.5 rounded border border-slate-300 shadow-2xs">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Agency Eligibility</span>
                <span className="text-lg font-bold text-emerald-700 font-serif mt-0.5">Class-1 Verified</span>
              </div>
            </div>

            {/* CPPP Tender Table */}
            <div className="bg-white border border-slate-300 rounded shadow-xs p-5 space-y-4">
              <div className="border-b border-slate-200 pb-3 flex justify-between items-center">
                <div>
                  <h2 className="text-sm font-bold text-[#1B365D] uppercase tracking-wide font-serif">
                    Notice Inviting Tenders (NIT) — Greenfield Corridor Development
                  </h2>
                  <span className="text-[11px] text-slate-500">Ministry of Road Transport & Highways / NHAI Infrastructure Concession Portal</span>
                </div>
              </div>

              <div className="border border-slate-300 overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-[#1B365D] text-white text-[11px]">
                      <th className="p-3 border-r border-slate-600">Tender Reference No.</th>
                      <th className="p-3 border-r border-slate-600">Work Description & State</th>
                      <th className="p-3 border-r border-slate-600">Estimated Value / EMD</th>
                      <th className="p-3 border-r border-slate-600">Closing Date</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {tenders.map((tender, idx) => (
                      <tr key={tender.id} className={idx % 2 === 1 ? "bg-slate-50" : ""}>
                        <td className="p-3 font-mono font-bold text-[#1B365D] border-r border-slate-200 align-top">
                          {tender.id}
                          <span className="block text-[10px] text-slate-500 font-sans mt-0.5">{tender.area_required}</span>
                        </td>
                        <td className="p-3 border-r border-slate-200 align-top">
                          <strong className="text-slate-900 block">{tender.title}</strong>
                          <span className="text-slate-500 text-[11px] block mt-0.5">State: {tender.state} • Eligibility: {tender.eligibility}</span>
                        </td>
                        <td className="p-3 border-r border-slate-200 align-top">
                          <strong className="font-mono text-slate-900 block">{tender.estimated_budget}</strong>
                          <span className="text-slate-500 text-[11px] block font-mono">EMD: {tender.emd_amount}</span>
                        </td>
                        <td className="p-3 border-r border-slate-200 align-top font-mono text-rose-700 font-semibold">
                          {tender.closing_date}
                        </td>
                        <td className="p-3 text-right align-top">
                          <button
                            onClick={() => {
                              setSelectedTenderId(tender.id);
                              setActiveSubTab('applications');
                            }}
                            className="bg-[#1B365D] hover:bg-[#0F233D] text-white font-bold px-3 py-1.5 rounded text-xs transition cursor-pointer"
                          >
                            Bid Now →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* SUBTAB 2: Submit Bid Form */}
        {activeSubTab === 'applications' && (
          <div className="bg-white border border-slate-300 rounded shadow-xs p-6 space-y-6 max-w-3xl">
            <div className="border-b border-slate-200 pb-3">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block font-serif">CENTRAL e-PROCUREMENT FORM • BID SUBMISSION</span>
              <h2 className="text-base font-bold text-[#1B365D] font-serif">
                Submission of Sealed Technical & Financial Proposal
              </h2>
            </div>

            {bidSubmitted ? (
              <div className="bg-emerald-50 border border-emerald-300 p-6 rounded text-center space-y-2">
                <CheckCircle2 className="h-8 w-8 text-emerald-700 mx-auto" />
                <h3 className="text-sm font-bold text-emerald-900">Proposal Submitted Successfully!</h3>
                <p className="text-xs text-slate-700">
                  Acknowledgement Receipt: <strong className="font-mono text-[#1B365D] bg-white px-2 py-0.5 rounded border">CPPP-BID-{Date.now().toString().slice(-6)}</strong>
                </p>
                <p className="text-[11px] text-slate-500">Tender evaluation committee will publish pre-qualification results on the Gazette portal.</p>
                <div className="pt-2">
                  <button 
                    onClick={() => setBidSubmitted(false)}
                    className="bg-[#1B365D] text-white font-bold px-4 py-1.5 rounded text-xs"
                  >
                    Return to Tender List
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleApplyTender} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target NIT Tender Reference *</label>
                  <select 
                    value={selectedTenderId || "NIT/NHAI/2026/001"}
                    onChange={(e) => setSelectedTenderId(e.target.value)}
                    className="w-full bg-white border border-slate-300 text-slate-800 text-xs rounded p-2 font-semibold outline-none focus:border-[#1B365D]"
                  >
                    {tenders.map(t => (
                      <option key={t.id} value={t.id}>{t.id} — {t.title}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Applying Concessionaire *</label>
                    <input 
                      type="text" 
                      disabled 
                      value={agencyProfile.company_name} 
                      className="w-full bg-slate-100 border border-slate-300 text-slate-700 text-xs rounded p-2 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Ministry Registration ID *</label>
                    <input 
                      type="text" 
                      disabled 
                      value={agencyProfile.registration_id} 
                      className="w-full bg-slate-100 border border-slate-300 text-slate-700 text-xs rounded p-2 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Financial Quotation (INR in Crores) *</label>
                    <input 
                      type="number" 
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      placeholder="e.g. 1420.50"
                      className="w-full bg-white border border-slate-300 text-slate-800 text-xs rounded p-2 font-medium outline-none focus:border-[#1B365D]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Proposed Execution Schedule (Months) *</label>
                    <input 
                      type="number" 
                      defaultValue={24}
                      className="w-full bg-white border border-slate-300 text-slate-800 text-xs rounded p-2 font-medium outline-none focus:border-[#1B365D]"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="bg-[#1B365D] hover:bg-[#0F233D] text-white font-bold py-2.5 px-5 rounded text-xs transition cursor-pointer flex items-center gap-2"
                >
                  <Send className="h-3.5 w-3.5 text-amber-300" />
                  <span>Submit Sealed Tender to Ministry Committee</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* SUBTAB 3: Credentials */}
        {activeSubTab === 'profile' && (
          <div className="bg-white border border-slate-300 rounded shadow-xs p-6 space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-base font-bold text-[#1B365D] font-serif">
                Concessionaire Accreditation & Verification Dossier
              </h2>
            </div>

            <div className="border border-slate-200 overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="p-2.5 font-bold text-slate-600 bg-slate-50 w-1/3">Corporate Legal Name</td>
                    <td className="p-2.5 font-bold text-slate-900">{agencyProfile.company_name}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-slate-600 bg-slate-50">Ministry Registration ID</td>
                    <td className="p-2.5 font-mono font-bold text-[#1B365D]">{agencyProfile.registration_id}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-slate-600 bg-slate-50">Corporate Tax ID / GSTIN</td>
                    <td className="p-2.5 font-mono text-slate-800">{agencyProfile.pan_gstin}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-slate-600 bg-slate-50">Accreditation Tier</td>
                    <td className="p-2.5 font-bold text-emerald-800">{agencyProfile.ministry_accreditation}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUBTAB 4: Documents */}
        {activeSubTab === 'documents' && (
          <div className="bg-white border border-slate-300 rounded shadow-xs p-6 space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-base font-bold text-[#1B365D] font-serif">
                Statutory Environmental Clearances & Ministry NOCs
              </h2>
            </div>

            <div className="border border-slate-300 overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-[#1B365D] text-white text-[11px]">
                    <th className="p-3 border-r border-slate-600">Clearance Certificate</th>
                    <th className="p-3 border-r border-slate-600">Issuing Authority</th>
                    <th className="p-3 border-r border-slate-600">Approval Date</th>
                    <th className="p-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {[
                    { title: "Ministry of Environment Forest Clearance (Stage-1)", auth: "MoEFCC / Regional Office", date: "10-Jan-2026" },
                    { title: "Central Groundwater Board NOC & Hydrogeology Audit", auth: "CGWB Ministry of Jal Shakti", date: "18-Jan-2026" },
                    { title: "State Pollution Control Board Consent to Establish (CTE)", auth: "State SPCB", date: "02-Feb-2026" },
                    { title: "Archaeological Survey of India (ASI) Antiquity Clearance", auth: "ASI Cultural Directorate", date: "22-Feb-2026" }
                  ].map((doc, idx) => (
                    <tr key={idx} className={idx % 2 === 1 ? "bg-slate-50" : ""}>
                      <td className="p-3 font-bold text-slate-800 border-r border-slate-200">{doc.title}</td>
                      <td className="p-3 text-slate-600 border-r border-slate-200">{doc.auth}</td>
                      <td className="p-3 text-slate-600 border-r border-slate-200">{doc.date}</td>
                      <td className="p-3 text-right font-bold text-emerald-800">✓ Verified</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
