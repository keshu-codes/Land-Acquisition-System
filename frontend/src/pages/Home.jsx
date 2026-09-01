import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  Search, Calculator, Layers, BookOpen, Scale, ArrowRight, 
  Sparkles, CheckCircle2, AlertCircle, FileText, Phone, Download, Radio, ShieldCheck
} from 'lucide-react';

export default function Home({ setActiveTab }) {
  const { language } = useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedPlot, setSearchedPlot] = useState(null);

  const samplePlots = [
    {
      name: "Anmol",
      plot: "PLOT-OD-2026-9821",
      survey: "SN-9821",
      project: "Regional Multi-Modal Corridor Expansion",
      district: "Khordha, Odisha",
      area: "1.45 Acres (Semi-Urban)",
      valuation: "₹42,50,000",
      solatium: "₹42,50,000 (100% Solatium)",
      totalAward: "₹85,00,000",
      status: "Section 11 (1) Notice Published",
      tabTarget: "dispatch"
    },
    {
      name: "Rameshwar Patel",
      plot: "PLOT-MH-2026-1044",
      survey: "SN-1044",
      project: "Indore Metro Rail Corridor Line 2",
      district: "Sambalpur / Nagpur",
      area: "2.8 Acres (Agricultural)",
      valuation: "₹65,00,000",
      solatium: "₹65,00,000 (100% Solatium)",
      totalAward: "₹1,30,00,000",
      status: "Possession Handover Complete",
      tabTarget: "web3"
    },
    {
      name: "M. Selvakumar",
      plot: "PLOT-TN-2026-2082",
      survey: "SN-2082",
      project: "Chennai Industrial Link Corridor",
      district: "Kanchipuram, Tamil Nadu",
      area: "3.2 Acres (Commercial)",
      valuation: "₹78,00,000",
      solatium: "₹78,00,000 (100% Solatium)",
      totalAward: "₹1,56,00,000",
      status: "Award Declared (PFMS Ready)",
      tabTarget: "dashboard"
    }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const q = searchQuery.toLowerCase().trim();
    const found = samplePlots.find(p => 
      p.name.toLowerCase().includes(q) || 
      p.plot.toLowerCase().includes(q) || 
      p.project.toLowerCase().includes(q) || 
      p.district.toLowerCase().includes(q)
    );
    setSearchedPlot(found || "NOT_FOUND");
  };

  return (
    <div className="space-y-8 font-sans select-none">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#002366] to-[#1e3a8a] text-white p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-700">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/10 text-amber-300 border border-white/20 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider font-mono">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            RFCTLARR Act 2013 Statutory Portal
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-heading tracking-tight">
            National Land Acquisition System
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
            Welcome to the unified public land acquisition workspace. Easily track your plot notice, calculate 100% Solatium payouts, or inspect cadastral maps.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button
            onClick={() => setActiveTab('calc')}
            className="bg-[#ea580c] hover:bg-orange-700 text-white px-5 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <Calculator className="h-4 w-4" />
            <span>Open Compensation Calculator</span>
          </button>
        </div>
      </div>

      {/* 2-COLUMN WORKSPACE LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Main Search & Core Gateway Tools (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main Search Panel */}
          <div className="gov-card p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="text-base font-extrabold text-[#002366] font-heading flex items-center gap-2">
                <Search className="h-5 w-5 text-[#ea580c]" />
                Single-Window Land Parcel Search
              </h2>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded font-mono">Instant Search</span>
            </div>

            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Type Name (e.g. Anmol), Plot Survey No (PLOT-OD-2026-9821), or District..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 text-xs font-semibold p-3 rounded-xl border border-slate-300 outline-none focus:border-[#002366] bg-slate-50"
              />
              <button
                type="submit"
                className="bg-[#002366] hover:bg-[#00174a] text-white px-6 py-3 rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Search Record</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
              <span className="text-slate-400 font-medium text-[11px]">Quick Samples:</span>
              <button
                type="button"
                onClick={() => { setSearchQuery("Anmol"); setSearchedPlot(samplePlots[0]); }}
                className="bg-slate-100 hover:bg-slate-200 text-[#002366] px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors cursor-pointer"
              >
                📍 Anmol (Odisha)
              </button>
              <button
                type="button"
                onClick={() => { setSearchQuery("Rameshwar Patel"); setSearchedPlot(samplePlots[1]); }}
                className="bg-slate-100 hover:bg-slate-200 text-[#002366] px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors cursor-pointer"
              >
                📍 Rameshwar Patel (MH)
              </button>
            </div>

            {/* Instant Result Box */}
            {searchedPlot && (
              <div className="mt-4 animate-in fade-in duration-150">
                {searchedPlot === "NOT_FOUND" ? (
                  <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-rose-600 flex-shrink-0" />
                    <span>No plot record found for "{searchQuery}". Please click a sample button above.</span>
                  </div>
                ) : (
                  <div className="p-5 bg-slate-50 border-2 border-amber-400 rounded-xl space-y-3">
                    <div className="flex justify-between items-start border-b border-slate-200 pb-2">
                      <div>
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono uppercase">{searchedPlot.status}</span>
                        <h3 className="font-extrabold text-sm text-[#002366] mt-1 font-heading">{searchedPlot.project}</h3>
                      </div>
                      <span className="text-base font-mono font-extrabold text-emerald-600">{searchedPlot.totalAward}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div><span className="text-slate-500">Landowner:</span> <strong>{searchedPlot.name}</strong></div>
                      <div><span className="text-slate-500">Survey No:</span> <strong className="font-mono">{searchedPlot.plot}</strong></div>
                      <div><span className="text-slate-500">Valuation:</span> <strong>{searchedPlot.valuation}</strong></div>
                      <div><span className="text-slate-500">100% Solatium:</span> <strong className="text-amber-800">{searchedPlot.solatium}</strong></div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 4 Gateway Action Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div 
              onClick={() => setActiveTab('calc')}
              className="gov-card p-5 cursor-pointer space-y-2 hover:-translate-y-1 transition-all border-t-4 border-amber-500 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="h-10 w-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Calculator className="h-5 w-5" />
                </div>
                <h3 className="font-extrabold text-sm text-[#002366] font-heading">Solatium Calculator</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">Calculate 100% Solatium & statutory interest under RFCTLARR Act 2013.</p>
              </div>
              <span className="text-xs font-bold text-amber-700 flex items-center gap-1 pt-2">Open Tool →</span>
            </div>

            <div 
              onClick={() => setActiveTab('gis')}
              className="gov-card p-5 cursor-pointer space-y-2 hover:-translate-y-1 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="h-10 w-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                  <Layers className="h-5 w-5" />
                </div>
                <h3 className="font-extrabold text-sm text-[#002366] font-heading">GIS Satellite Explorer</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">Inspect sub-meter cadastral boundaries and ISRO satellite overlays.</p>
              </div>
              <span className="text-xs font-bold text-sky-700 flex items-center gap-1 pt-2">View Map →</span>
            </div>

            <div 
              onClick={() => setActiveTab('journey')}
              className="gov-card p-5 cursor-pointer space-y-2 hover:-translate-y-1 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="h-10 w-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <BookOpen className="h-5 w-5" />
                </div>
                <h3 className="font-extrabold text-sm text-[#002366] font-heading">Legal Guide & Gazette</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">Learn 5-step acquisition rights and download statutory PDF forms.</p>
              </div>
              <span className="text-xs font-bold text-indigo-700 flex items-center gap-1 pt-2">Read Guide →</span>
            </div>

            <div 
              onClick={() => setActiveTab('objection')}
              className="gov-card p-5 cursor-pointer space-y-2 hover:-translate-y-1 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="h-10 w-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                  <Scale className="h-5 w-5" />
                </div>
                <h3 className="font-extrabold text-sm text-[#002366] font-heading">File Objection / Dispute</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">Submit boundary or valuation dispute petitions directly online.</p>
              </div>
              <span className="text-xs font-bold text-rose-700 flex items-center gap-1 pt-2">File Petition →</span>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: Live Activity Ticker & Help Cards (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Key Metrics Summary */}
          <div className="gov-card p-5 space-y-4">
            <h3 className="text-xs font-extrabold text-[#002366] uppercase tracking-wider font-mono">Registry Key Metrics</h3>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xl font-mono font-extrabold text-[#002366] block">1,420</span>
                <span className="text-[10px] text-slate-500 font-bold block mt-0.5">Parcels Tracked</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xl font-mono font-extrabold text-emerald-600 block">₹452 Cr</span>
                <span className="text-[10px] text-slate-500 font-bold block mt-0.5">DBT Disbursed</span>
              </div>
            </div>
          </div>

          {/* Citizen Help & Toll Free Support */}
          <div className="gov-card p-5 space-y-3 bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
              <Phone className="h-4 w-4" />
              <span>Citizen Helpline Support</span>
            </div>
            <div className="text-2xl font-extrabold font-mono text-white">1800-11-LARR</div>
            <p className="text-xs text-slate-300 font-medium leading-relaxed">
              Call toll-free for assistance with Section 11 gazette notices, Form K claim submissions, or PFMS bank transfers.
            </p>
          </div>

          {/* Gazette Notifications Notice Board */}
          <div className="gov-card p-5 space-y-3">
            <h3 className="text-xs font-extrabold text-[#002366] uppercase tracking-wider font-mono flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-[#ea580c]" /> Latest Gazette Publications
            </h3>
            <div className="space-y-2 text-xs divide-y divide-slate-100">
              <div className="pt-2 space-y-0.5">
                <span className="text-[10px] font-mono text-slate-400 block">01-Sep-2026</span>
                <strong className="text-slate-800 block">Section 11 (1) Notice Published</strong>
                <span className="text-[11px] text-slate-500 block">Regional Corridor Expansion (#OD-9821)</span>
              </div>
              <div className="pt-2 space-y-0.5">
                <span className="text-[10px] font-mono text-slate-400 block">28-Aug-2026</span>
                <strong className="text-slate-800 block">PFMS Escrow Disbursement Live</strong>
                <span className="text-[11px] text-slate-500 block">Chennai Link Corridor (1,420 Landowners)</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
