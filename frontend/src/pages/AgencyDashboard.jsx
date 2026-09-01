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
    <div className="space-y-6 font-sans text-slate-800">
      
      {/* ── Header Banner ── */}
      <div className="bg-[#12355B] text-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-700 relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-900/60 border border-amber-500/40 text-amber-300 font-mono text-[11px] uppercase tracking-wider">
            <Building2 className="h-3.5 w-3.5 text-amber-400" />
            Registered Agency & Requesting Body Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {agencyProfile.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Centralized workspace for requesting authorities, infrastructure developers, and registered agencies to submit land acquisition proposals, bid for project tenders, and inspect cadastral possession status.
          </p>
        </div>
      </div>

      {/* ── METRICS SUMMARY ── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <div className="bg-[#FAFAF7] border border-[#E8E1D5] p-5 rounded-xl shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Organization Registration ID</span>
          <span className="text-base font-extrabold text-[#12355B] font-mono block">{agencyProfile.regId}</span>
          <span className="text-[10px] text-emerald-700 font-bold block">✓ MoRTH Authorized</span>
        </div>

        <div className="bg-[#FAFAF7] border border-[#E8E1D5] p-5 rounded-xl shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Allocated Acquisition Area</span>
          <span className="text-base font-extrabold text-[#7A5C3E] font-mono block">{agencyProfile.allocatedLandHa}</span>
          <span className="text-[10px] text-slate-400 block">Under Section 11 Gazette</span>
        </div>

        <div className="bg-[#FAFAF7] border border-[#E8E1D5] p-5 rounded-xl shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Active Bids & Proposals</span>
          <span className="text-base font-extrabold text-[#2F6B4F] font-mono block">{agencyProfile.activeBids} Projects</span>
          <span className="text-[10px] text-slate-400 block">Technical Review Pending</span>
        </div>

        <div className="bg-[#FAFAF7] border border-[#E8E1D5] p-5 rounded-xl shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Estimated Allocation</span>
          <span className="text-base font-extrabold text-amber-700 font-mono block">{agencyProfile.totalProjectBudget}</span>
          <span className="text-[10px] text-slate-400 block">Central LARR Fund</span>
        </div>

      </div>

      {/* ── MAIN TENDERS & PROPOSALS TABLE ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (8 Cols): Available Tenders & Projects */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="bg-white border border-[#E2E8F0] p-6 rounded-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h2 className="text-base font-extrabold text-[#12355B] flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-[#C98B2E]" />
                Eligible Development Projects & Tenders
              </h2>
              <span className="text-[10px] font-mono bg-blue-50 text-[#12355B] px-2.5 py-1 rounded font-bold uppercase">
                Active Auctions
              </span>
            </div>

            <div className="space-y-3">
              {availableTenders.map((tender) => (
                <div key={tender.id} className="p-4 bg-[#FAFAF7] border border-[#E8E1D5] rounded-xl space-y-3 hover:border-slate-400 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">{tender.id}</span>
                      <h3 className="font-extrabold text-sm text-[#12355B] mt-1">{tender.title}</h3>
                      <span className="text-xs text-slate-500">{tender.district}</span>
                    </div>
                    <span className="text-xs font-mono font-extrabold text-emerald-700">{tender.estBudget}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs border-t border-slate-200/60 pt-2">
                    <div><span className="text-slate-400 text-[10px] block">Land Required:</span> <strong>{tender.areaRequired}</strong></div>
                    <div><span className="text-slate-400 text-[10px] block">Bid Deadline:</span> <strong className="font-mono">{tender.deadline}</strong></div>
                    <div><span className="text-slate-400 text-[10px] block">Status:</span> <strong className="text-indigo-700">{tender.status}</strong></div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button 
                      onClick={() => setAppliedProject(tender.id)}
                      className="bg-[#12355B] hover:bg-[#0b1f42] text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer transition-colors flex items-center gap-1"
                    >
                      <span>{appliedProject === tender.id ? "Application Submitted ✓" : "Apply / Submit Proposal"}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (4 Cols): Verification & Documents */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-white border border-[#E2E8F0] p-5 rounded-2xl space-y-4">
            <h3 className="text-xs font-bold text-[#12355B] uppercase tracking-wider font-mono">Agency Authorization Status</h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 flex items-center gap-2 font-semibold">
                <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                <span>GSTIN & MoRTH Registration Verified</span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 space-y-1">
                <span className="text-slate-400 block text-[10px]">Authorized Representative</span>
                <strong className="block text-slate-900">Dr. Rajesh Verma (Executive Director)</strong>
                <span className="text-[10px] text-slate-500 font-mono block">Contact: +91 11 2345 6789</span>
              </div>
            </div>
          </div>

          <div className="bg-[#FAFAF7] border border-[#E8E1D5] p-5 rounded-2xl space-y-3 text-xs">
            <h3 className="font-extrabold text-[#12355B] flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#7A5C3E]" />
              Submitted Organization Documents
            </h3>
            <div className="space-y-2">
              <div className="p-2.5 bg-white border border-slate-200 rounded-lg flex items-center justify-between">
                <span>Corporate Incorporation Deed</span>
                <span className="text-emerald-700 font-bold text-[10px]">Verified</span>
              </div>
              <div className="p-2.5 bg-white border border-slate-200 rounded-lg flex items-center justify-between">
                <span>Central Highway Clearance Certificate</span>
                <span className="text-emerald-700 font-bold text-[10px]">Verified</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
