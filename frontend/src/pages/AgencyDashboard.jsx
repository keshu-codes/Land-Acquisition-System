import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  Building2, CheckCircle, FileText, ArrowUpRight, Search, Filter, 
  Briefcase, Award, ShieldCheck, Clock, ExternalLink, ArrowRight, Layers
} from 'lucide-react';

export default function AgencyDashboard({ setActiveTab }) {
  const { proposals } = useContext(AppContext);
  const [appliedProject, setAppliedProject] = useState(null);

  const agencyProfile = {
    name: "National Highways Authority of India (NHAI)",
    regId: "ORG-IND-2026-8841",
    category: "Central Requesting Authority",
    status: "Verified & Active Partner",
    activeBids: 3,
    allocatedLandHa: "1,450 ha",
    totalProjectBudget: "₹2,450 Cr"
  };

  const availableTenders = [
    {
      id: "TND-2026-OD-01",
      title: "Regional Multi-Modal Corridor Expansion (Phase 2)",
      district: "Khordha, Odisha",
      areaRequired: "1,450 ha",
      estBudget: "₹1,200 Cr",
      deadline: "15-Oct-2026",
      status: "Bidding Open"
    },
    {
      id: "TND-2026-MH-04",
      title: "Nagpur High-Speed Industrial Link Highway",
      district: "Nagpur, Maharashtra",
      areaRequired: "890 ha",
      estBudget: "₹950 Cr",
      deadline: "20-Oct-2026",
      status: "Technical Review"
    },
    {
      id: "TND-2026-TN-02",
      title: "Chennai Industrial Freight Express Corridor",
      district: "Kanchipuram, Tamil Nadu",
      areaRequired: "2,100 ha",
      estBudget: "₹1,850 Cr",
      deadline: "05-Nov-2026",
      status: "Gazette Published"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-4 sm:py-8 space-y-8 font-sans text-slate-800">
      
      {/* ── 1. HEADER CARD ── */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="bg-[#12355B] text-white p-6 sm:p-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-900/60 border border-amber-500/40 text-amber-300 font-mono text-[11px] font-bold uppercase tracking-wider">
            <Building2 className="h-3.5 w-3.5 text-amber-400" />
            Registered Agency & Requesting Body Portal
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">
            {agencyProfile.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Centralized workspace for requesting authorities, infrastructure developers, and registered agencies to submit land acquisition proposals and bid for project tenders.
          </p>
        </div>

        {/* Key Summary Bar */}
        <div className="p-6 bg-[#FAF9F6] border-t border-stone-200 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Registration ID</span>
            <strong className="text-sm font-mono text-[#12355B] block">{agencyProfile.regId}</strong>
            <span className="text-[10px] text-emerald-700 font-bold">✓ MoRTH Authorized Partner</span>
          </div>

          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Allocated Acquisition Area</span>
            <strong className="text-sm font-mono text-[#7A5C3E] block">{agencyProfile.allocatedLandHa}</strong>
            <span className="text-[10px] text-slate-500">Under Section 11 Gazette</span>
          </div>

          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Project Allocation</span>
            <strong className="text-sm font-mono text-amber-800 block">{agencyProfile.totalProjectBudget}</strong>
            <span className="text-[10px] text-slate-500">Central LARR Fund</span>
          </div>
        </div>
      </div>

      {/* ── 2. AVAILABLE DEVELOPMENT TENDERS ── */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-xs">
        
        <div className="flex items-center justify-between border-b border-stone-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-50 text-[#C98B2E] border border-amber-200">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#12355B]">
                Eligible Infrastructure Development Tenders
              </h2>
              <p className="text-xs text-slate-500">Open land acquisition and development auctions</p>
            </div>
          </div>

          <span className="text-xs font-mono font-bold text-[#12355B] bg-blue-50 px-3 py-1 rounded-full">
            Active Auctions
          </span>
        </div>

        <div className="space-y-4">
          {availableTenders.map((tender) => (
            <div key={tender.id} className="p-5 bg-[#FAF9F6] border border-stone-200 rounded-2xl space-y-4 hover:border-slate-400 transition-all">
              <div className="flex justify-between items-start flex-wrap gap-2">
                <div>
                  <span className="text-[10px] font-mono font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded border border-amber-300">{tender.id}</span>
                  <h3 className="font-extrabold text-sm text-[#12355B] mt-1.5">{tender.title}</h3>
                  <span className="text-xs text-slate-500 block">{tender.district}</span>
                </div>
                <span className="text-base font-mono font-extrabold text-[#2F6B4F]">{tender.estBudget}</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs border-t border-stone-200 pt-3 text-slate-600">
                <div><span className="text-slate-400 text-[10px] block">Land Required:</span> <strong className="text-slate-800">{tender.areaRequired}</strong></div>
                <div><span className="text-slate-400 text-[10px] block">Bid Deadline:</span> <strong className="font-mono text-slate-800">{tender.deadline}</strong></div>
                <div><span className="text-slate-400 text-[10px] block">Status:</span> <strong className="text-indigo-800">{tender.status}</strong></div>
              </div>

              <div className="flex justify-end pt-1 border-t border-stone-100">
                <button 
                  onClick={() => setAppliedProject(tender.id)}
                  className="bg-[#12355B] hover:bg-[#0b1f42] text-white text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer transition-colors shadow-xs"
                >
                  {appliedProject === tender.id ? "Proposal Submitted ✓" : "Apply / Submit Proposal"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
