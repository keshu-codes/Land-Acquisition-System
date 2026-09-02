import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  Search, ArrowRight, CheckCircle2, FileText, Phone, Download, 
  MapPin, Shield, Gavel, Landmark, Compass, CreditCard, Megaphone, Globe, User, 
  ArrowUpRight, ListCheck, CheckCircle, XCircle, Clock, ChevronUp, Layers, Building, Eye
} from 'lucide-react';

export default function Home({ setActiveTab }) {
  const { language, setLanguage, user, selectedRole, setSelectedRole, login, setShowLoginModal } = useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedPlot, setSearchedPlot] = useState(null);

  const samplePlots = [
    {
      name: "Rameshwar Patel",
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
      name: "Anmol",
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-10 font-sans text-slate-800 bg-[#FAFAF7] pb-12">
      
      {/* ── 1. OFFICIAL TOP EMBLEM & MINISTERIAL HEADER (IMAGE 1 EXACT) ── */}
      <div className="bg-white border-b border-slate-200 py-4 px-4 sm:px-8 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Left Dignitary */}
          <div className="flex items-center gap-3">
            <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-emerald-700 shadow-sm flex-shrink-0 bg-slate-100">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/c/c0/Narendra_Modi_official_portrait_July_2024.jpg" 
                alt="Hon'ble Prime Minister" 
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = '/emblem.jpg'; }}
              />
            </div>
            <div className="text-left hidden sm:block">
              <strong className="block text-xs font-extrabold text-[#12355B]">Shri Narendra Modi</strong>
              <span className="text-[10px] text-slate-500 font-semibold block">Hon'ble Prime Minister of India</span>
            </div>
          </div>

          {/* Center Official Portal Title */}
          <div className="text-center space-y-1">
            <div className="flex items-center justify-center gap-2">
              <img src="/emblem.jpg" alt="Emblem of India" className="h-12 w-auto object-contain bg-white rounded p-0.5" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-[#D97706] tracking-tight font-serif">
                  BHUNAKSHA - NLAMS
                </h1>
                <span className="text-[11px] font-extrabold text-[#12355B] uppercase tracking-wider block font-serif">
                  SURVEY, SETTLEMENTS AND LAND RECORDS
                </span>
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest block">
                  GOVERNMENT OF INDIA
                </span>
              </div>
            </div>
          </div>

          {/* Right Dignitary */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <strong className="block text-xs font-extrabold text-[#12355B]">Shri Nitin Gadkari</strong>
              <span className="text-[10px] text-slate-500 font-semibold block">Hon'ble Minister for Road Transport & Highways</span>
            </div>
            <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-emerald-700 shadow-sm flex-shrink-0 bg-slate-100">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Nitin_Gadkari_%28cropped%29.jpg/330px-Nitin_Gadkari_%28cropped%29.jpg" 
                alt="Hon'ble Minister" 
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = '/emblem.jpg'; }}
              />
            </div>
          </div>

        </div>
      </div>

      {/* ── 2. DARK GREEN NAV BAR WITH LOGIN BUTTONS ── */}
      <div className="bg-[#1B5E20] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-2.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-xs font-bold">
            <button onClick={() => setActiveTab('home')} className="flex items-center gap-1.5 hover:text-amber-300 transition-colors cursor-pointer">
              <Landmark className="h-4 w-4" />
              <span>Home</span>
            </button>
            <button onClick={() => setActiveTab('dashboard')} className="flex items-center gap-1.5 hover:text-amber-300 transition-colors cursor-pointer">
              <Layers className="h-4 w-4" />
              <span>Dashboard</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowLoginModal(true)}
              className="bg-white hover:bg-slate-100 text-[#1B5E20] px-4 py-1.5 rounded-lg text-xs font-extrabold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <User className="h-3.5 w-3.5" />
              <span>Citizen Login</span>
            </button>
            <button 
              onClick={() => setShowLoginModal(true)}
              className="bg-[#FBC02D] hover:bg-amber-400 text-slate-900 px-4 py-1.5 rounded-lg text-xs font-extrabold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Shield className="h-3.5 w-3.5 text-slate-900" />
              <span>Officer Login</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── 3. HERO BANNER WITH AERIAL CADASTRAL OVERLAY ── */}
      <div className="relative max-w-7xl mx-auto rounded-3xl overflow-hidden shadow-2xl min-h-[420px] flex items-center p-8 sm:p-12 border border-slate-300">
        <img 
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1600&auto=format&fit=crop" 
          alt="Aerial view of green agricultural land" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>

        {/* Cadastral Polygon SVG Overlay Effect */}
        <div className="absolute right-12 top-12 bottom-12 w-1/2 hidden md:flex items-center justify-center opacity-80 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 400 300">
            <polygon points="100,50 300,80 350,220 80,240" fill="rgba(255,255,255,0.15)" stroke="#FFFFFF" strokeWidth="3" strokeDasharray="6 4" />
            <circle cx="100" cy="50" r="10" fill="#2563EB" stroke="#FFFFFF" strokeWidth="3" />
            <circle cx="300" cy="80" r="10" fill="#2563EB" stroke="#FFFFFF" strokeWidth="3" />
            <circle cx="350" cy="220" r="10" fill="#2563EB" stroke="#FFFFFF" strokeWidth="3" />
            <circle cx="80" cy="240" r="10" fill="#2563EB" stroke="#FFFFFF" strokeWidth="3" />
          </svg>
        </div>

        <div className="relative z-10 space-y-4 max-w-2xl text-white">
          <h2 className="text-3xl sm:text-5xl font-black font-serif tracking-tight leading-tight">
            BHUNAKSHA - NLAMS
          </h2>
          <p className="text-lg sm:text-xl font-bold text-amber-300">
            Survey, Settlements and Land Records
          </p>
          <span className="text-xs text-slate-300 font-semibold block uppercase tracking-wider">
            Government of India • National Infrastructure Registry
          </span>

          {/* Quick Search Input */}
          <form onSubmit={handleSearch} className="pt-4 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Enter Plot Number, Survey ID, or Landowner Name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white text-slate-900 text-xs font-bold pl-10 pr-4 py-3 rounded-xl focus:outline-none shadow-md"
              />
            </div>
            <button 
              type="submit"
              className="bg-[#FBC02D] hover:bg-amber-400 text-slate-900 text-xs font-extrabold px-6 py-3 rounded-xl transition-all shadow-md cursor-pointer whitespace-nowrap"
            >
              Search Land Record
            </button>
          </form>

          {/* Search Result Box */}
          {searchedPlot && (
            <div className="mt-4 p-4 bg-white text-slate-800 rounded-2xl shadow-xl space-y-2 border border-amber-300 text-xs animate-fadeIn">
              {searchedPlot === "NOT_FOUND" ? (
                <div className="text-rose-600 font-bold">No record found. Please verify Plot/Survey ID.</div>
              ) : (
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <div>
                    <strong className="text-[#12355B] text-sm block">{searchedPlot.name} — {searchedPlot.plot}</strong>
                    <span className="text-slate-500">{searchedPlot.project} • {searchedPlot.totalAward}</span>
                  </div>
                  <button 
                    onClick={() => setActiveTab('citizen-dashboard')}
                    className="bg-[#12355B] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <span>Inspect Record</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── 4. DASHBOARD METRIC CARDS SECTION (IMAGE 2 EXACT) ── */}
      <div className="max-w-7xl mx-auto space-y-6 px-4 sm:px-8">
        
        <div className="flex items-center justify-between border-b border-slate-300 pb-3">
          <h2 className="text-2xl font-black text-[#12355B] font-serif">
            Dashboard Summary
          </h2>
          <span className="text-[11px] text-slate-500 font-mono">
            Last updated on: 29/08/2026, 05:49:47 pm
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* PURPLE CARD: ONLINE SUBDIVISION */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden space-y-3">
            <div className="bg-[#6B46C1] text-white font-extrabold px-5 py-3 text-center text-sm font-serif">
              Online Subdivision / Sec 11 Proposals
            </div>

            <div className="p-4 space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                <span className="flex items-center gap-2 font-bold text-slate-700">
                  <ListCheck className="h-4 w-4 text-[#6B46C1]" /> Total Proposals
                </span>
                <strong className="font-mono text-sm text-[#6B46C1]">5,94,003</strong>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-emerald-50 text-emerald-900 rounded-xl">
                <span className="flex items-center gap-2 font-bold">
                  <CheckCircle className="h-4 w-4 text-emerald-600" /> Approved Gazette
                </span>
                <strong className="font-mono text-sm text-emerald-700">4,96,023</strong>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-rose-50 text-rose-900 rounded-xl">
                <span className="flex items-center gap-2 font-bold">
                  <XCircle className="h-4 w-4 text-rose-600" /> Rejected / Closed
                </span>
                <strong className="font-mono text-sm text-rose-700">88,564</strong>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-amber-50 text-amber-900 rounded-xl">
                <span className="flex items-center gap-2 font-bold">
                  <Clock className="h-4 w-4 text-amber-600" /> Pending Scrutiny
                </span>
                <strong className="font-mono text-sm text-amber-700">9,179</strong>
              </div>
            </div>
          </div>

          {/* PINK CARD: JOINT LPMS SUBDIVISION */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden space-y-3">
            <div className="bg-[#EC4899] text-white font-extrabold px-5 py-3 text-center text-sm font-serif">
              Joint LPMs Subdivision / Cadastral Survey
            </div>

            <div className="p-4 space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                <span className="flex items-center gap-2 font-bold text-slate-700">
                  <ListCheck className="h-4 w-4 text-[#EC4899]" /> Total Parcls
                </span>
                <strong className="font-mono text-sm text-[#EC4899]">3,51,020</strong>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-emerald-50 text-emerald-900 rounded-xl">
                <span className="flex items-center gap-2 font-bold">
                  <CheckCircle className="h-4 w-4 text-emerald-600" /> Approved Coordinates
                </span>
                <strong className="font-mono text-sm text-emerald-700">2,83,048</strong>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-rose-50 text-rose-900 rounded-xl">
                <span className="flex items-center gap-2 font-bold">
                  <XCircle className="h-4 w-4 text-rose-600" /> Rejected Bounds
                </span>
                <strong className="font-mono text-sm text-rose-700">63,817</strong>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-amber-50 text-amber-900 rounded-xl">
                <span className="flex items-center gap-2 font-bold">
                  <Clock className="h-4 w-4 text-amber-600" /> Pending GPS Nodes
                </span>
                <strong className="font-mono text-sm text-amber-700">3,932</strong>
              </div>
            </div>
          </div>

          {/* TEAL CARD: ERROR CORRECTION */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden space-y-3">
            <div className="bg-[#0D9488] text-white font-extrabold px-5 py-3 text-center text-sm font-serif">
              Error Correction / Citizen Objections
            </div>

            <div className="p-4 space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                <span className="flex items-center gap-2 font-bold text-slate-700">
                  <ListCheck className="h-4 w-4 text-[#0D9488]" /> Total Objections
                </span>
                <strong className="font-mono text-sm text-[#0D9488]">5,208</strong>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-emerald-50 text-emerald-900 rounded-xl">
                <span className="flex items-center gap-2 font-bold">
                  <CheckCircle className="h-4 w-4 text-emerald-600" /> Resolved Hearings
                </span>
                <strong className="font-mono text-sm text-emerald-700">4,089</strong>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-rose-50 text-rose-900 rounded-xl">
                <span className="flex items-center gap-2 font-bold">
                  <XCircle className="h-4 w-4 text-rose-600" /> Rejected Petitions
                </span>
                <strong className="font-mono text-sm text-rose-700">276</strong>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-amber-50 text-amber-900 rounded-xl">
                <span className="flex items-center gap-2 font-bold">
                  <Clock className="h-4 w-4 text-amber-600" /> Pending Review
                </span>
                <strong className="font-mono text-sm text-amber-700">852</strong>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── 5. ABOUT US & COLORED HEXAGON PILLARS (IMAGE 2 EXACT) ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6 pt-4">
        
        <div className="border-b-2 border-emerald-600 pb-2">
          <h2 className="text-2xl font-black text-[#1B5E20] font-serif">
            About Us
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-6 space-y-3 text-xs text-slate-600 leading-relaxed font-medium">
            <p>
              The <strong>Bhunaksha NLAMS</strong> platform is a state-of-the-art cadastral mapping and land acquisition management software designed by the National Informatics Centre (NIC) and Central Ministry. The primary purpose of Bhunaksha NLAMS is to facilitate the creation and accessibility of land maps for the public and reduce property-related fraud.
            </p>
            <p>
              The platform seamlessly integrates with existing land record systems, PM GatiShakti NMP, and Public Financial Management System (PFMS) portals to enhance transparent access to land records, 100% Solatium awards, and digitized cadastral maps.
            </p>
          </div>

          {/* 5 COLORED HEXAGON PILLARS */}
          <div className="lg:col-span-6 flex flex-wrap items-center justify-center gap-3">
            
            {/* Orange Hexagon */}
            <div className="w-28 h-28 bg-[#EA580C] text-white p-3 rounded-2xl flex flex-col items-center justify-center text-center shadow-md space-y-1">
              <FileText className="h-6 w-6" />
              <span className="text-[10px] font-extrabold leading-tight">Record of Rights</span>
            </div>

            {/* Grey Hexagon */}
            <div className="w-28 h-28 bg-[#374151] text-white p-3 rounded-2xl flex flex-col items-center justify-center text-center shadow-md space-y-1">
              <Globe className="h-6 w-6" />
              <span className="text-[10px] font-extrabold leading-tight">Web Based Modules</span>
            </div>

            {/* Blue Hexagon */}
            <div className="w-28 h-28 bg-[#2563EB] text-white p-3 rounded-2xl flex flex-col items-center justify-center text-center shadow-md space-y-1">
              <MapPin className="h-6 w-6" />
              <span className="text-[10px] font-extrabold leading-tight">Cadastral Mapping Tools</span>
            </div>

            {/* Green Hexagon */}
            <div className="w-28 h-28 bg-[#16A34A] text-white p-3 rounded-2xl flex flex-col items-center justify-center text-center shadow-md space-y-1">
              <Compass className="h-6 w-6" />
              <span className="text-[10px] font-extrabold leading-tight">Geo-referenced Spatial Data</span>
            </div>

            {/* Teal Hexagon */}
            <div className="w-28 h-28 bg-[#0D9488] text-white p-3 rounded-2xl flex flex-col items-center justify-center text-center shadow-md space-y-1">
              <User className="h-6 w-6" />
              <span className="text-[10px] font-extrabold leading-tight">User Friendly Software</span>
            </div>

          </div>

        </div>
      </div>

      {/* FLOATING SCROLL TO TOP BUTTON */}
      <button 
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 bg-[#FBC02D] hover:bg-amber-400 text-slate-900 p-3 rounded-full shadow-2xl transition-all cursor-pointer z-50 font-bold border border-amber-300"
        title="Scroll to top"
      >
        <ChevronUp className="h-6 w-6" />
      </button>

    </div>
  );
}
