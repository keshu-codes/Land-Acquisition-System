import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  Search, ArrowRight, Sparkles, CheckCircle2, AlertCircle, FileText, Phone, Download, 
  MapPin, Shield, Gavel, Landmark, Compass, CreditCard, Megaphone, Globe, User, ArrowUpRight
} from 'lucide-react';

export default function Home({ setActiveTab }) {
  const { language, setLanguage, user, selectedRole, setSelectedRole, login } = useContext(AppContext);
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

  const handleRoleClick = async (roleId, targetTab) => {
    setSelectedRole(roleId);
    await login(roleId, 'nlams2026');
    setActiveTab(targetTab);
  };

  return (
    <div className="space-y-10 font-sans text-slate-800">
      
      {/* ── STITCH HERO SECTION ── */}
      <section className="relative bg-[#0F172A] text-white rounded-3xl p-8 sm:p-12 flex flex-col items-center text-center shadow-2xl overflow-hidden min-h-[500px] justify-center border border-slate-700/50">
        <div className="absolute inset-0 z-0">
          <img 
            alt="Aerial view of highway construction" 
            className="w-full h-full object-cover object-center opacity-40 mix-blend-overlay" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrg45tD5zB0mFufvQxyPx7g6mN_U-GGnEvL1G80vZM7Fzk7FTeIvyQZhr4wAaxlLHVtpA7NfVepZQf3fjyuIXCkgQJyO2U0QtI3Xh-tDkEXN3BM9wQXWwUmOM9PHv3x6J2nky0a9CnvRSFdFI7jjKlFSlPM8z0zmlY6Ouq6X5K0qhUqLqCb-omrh5KMVlz4h8yGv3xxl6DCsbVXlBuNR_Wp7nZoul0zNedk269A45WubraL1opPE9F"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/70 to-transparent"></div>
        </div>

        <div className="z-10 w-full max-w-4xl flex flex-col gap-5 items-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-400/50 text-amber-300 font-mono text-[11px] uppercase tracking-wider bg-black/40 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            Single-Window Public Land Portal • RFCTLARR Act 2013
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight drop-shadow-md leading-tight">
            Search Your Land Record & Compensation Status
          </h1>

          <p className="text-sm sm:text-base text-slate-200/90 max-w-2xl leading-relaxed">
            No complicated steps or tutorials needed. Enter your Name, Plot Number, or Survey Number below to instantly check your official notice, valuation, and bank payment advice.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="w-full mt-4 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 p-2 sm:p-3 flex flex-col md:flex-row gap-2 transition-transform duration-300">
            <div className="flex-grow flex items-center px-3 bg-transparent">
              <Search className="h-5 w-5 text-slate-400 flex-shrink-0" />
              <input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border-none focus:outline-none focus:ring-0 text-xs sm:text-sm font-semibold text-slate-800 bg-transparent ml-3 py-3" 
                placeholder="Type Name (e.g. Anmol), Plot No. (e.g. PLOT-OD-2026-9821), or District..." 
                type="text"
              />
            </div>
            <button 
              type="submit"
              className="bg-[#ea580c] text-white px-8 py-3.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#c2410c] transition-all whitespace-nowrap shadow-lg hover:shadow-xl cursor-pointer"
            >
              <span>Track My Land</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Sample Plot Tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-2 text-white/90 text-xs">
            <span className="text-slate-300 font-medium">Try clicking an example:</span>
            <button 
              type="button"
              onClick={() => { setSearchQuery("Anmol"); setSearchedPlot(samplePlots[0]); }}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20 flex items-center gap-1.5 transition-colors cursor-pointer text-amber-300 font-medium"
            >
              <MapPin className="h-3.5 w-3.5 text-rose-400" />
              Anmol (PLOT-OD-2026-9821, Odisha)
            </button>
            <button 
              type="button"
              onClick={() => { setSearchQuery("Rameshwar Patel"); setSearchedPlot(samplePlots[1]); }}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20 flex items-center gap-1.5 transition-colors cursor-pointer text-sky-300 font-medium"
            >
              <MapPin className="h-3.5 w-3.5 text-sky-400" />
              Rameshwar Patel (PLOT-MH-2026-1044)
            </button>
          </div>

          {/* Instant Result Display */}
          {searchedPlot && (
            <div className="w-full text-left mt-4 animate-in fade-in duration-200">
              {searchedPlot === "NOT_FOUND" ? (
                <div className="p-4 bg-rose-900/80 border border-rose-500/50 text-rose-100 rounded-2xl text-xs font-semibold flex items-center gap-3 backdrop-blur-md">
                  <AlertCircle className="h-5 w-5 text-rose-400 flex-shrink-0" />
                  <span>No land parcel matching "{searchQuery}". Please click one of the sample buttons above.</span>
                </div>
              ) : (
                <div className="p-5 bg-white text-slate-800 border-2 border-amber-400 rounded-2xl shadow-2xl space-y-3">
                  <div className="flex justify-between items-start border-b border-slate-200 pb-3">
                    <div>
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono uppercase">{searchedPlot.status}</span>
                      <h3 className="font-extrabold text-sm text-[#002366] mt-1">{searchedPlot.project}</h3>
                      <p className="text-xs text-slate-500">{searchedPlot.district}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block font-semibold">Total Award</span>
                      <span className="text-base font-mono font-extrabold text-emerald-600">{searchedPlot.totalAward}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div><span className="text-slate-400 block text-[10px]">Landowner</span> <strong>{searchedPlot.name}</strong></div>
                    <div><span className="text-slate-400 block text-[10px]">Survey Plot</span> <strong className="font-mono text-[#2563eb]">{searchedPlot.plot}</strong></div>
                    <div><span className="text-slate-400 block text-[10px]">Base Circle Rate</span> <strong>{searchedPlot.valuation}</strong></div>
                    <div><span className="text-slate-400 block text-[10px]">Mandatory Solatium</span> <strong className="text-amber-700">{searchedPlot.solatium}</strong></div>
                  </div>
                  <div className="pt-2 flex justify-end">
                    <button 
                      onClick={() => setActiveTab(searchedPlot.tabTarget)}
                      className="bg-[#2563eb] hover:bg-blue-700 text-white text-xs px-4 py-2 rounded-xl font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <span>View Full Case File & DBT Status</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </section>

      {/* ── STITCH 3-STEP WALKTHROUGH ── */}
      <section className="flex flex-col items-center text-center py-6">
        <h3 className="text-xs font-bold text-[#ea580c] tracking-widest uppercase mb-1 font-mono">Easy Walkthrough</h3>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] mb-2">How to Track & Claim Your Compensation in 3 Steps</h2>
        <p className="text-xs sm:text-sm text-slate-500 mb-8 max-w-2xl">Zero technical knowledge required. The entire legal acquisition process is fully automated:</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          
          {/* Step 1 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs text-left flex flex-col gap-4 hover:shadow-lg transition-shadow">
            <div className="w-10 h-10 rounded-full bg-[#0F172A] text-white flex items-center justify-center font-bold text-base shadow-md">1</div>
            <h4 className="font-extrabold text-base text-slate-900">Search Your Land Parcel</h4>
            <p className="text-xs text-slate-600 leading-relaxed flex-grow">Enter your Name or Plot Survey Number in the search box above to view your officially notified boundary, circle rate, and project details.</p>
          </div>

          {/* Step 2 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs text-left flex flex-col gap-4 hover:shadow-lg transition-shadow">
            <div className="w-10 h-10 rounded-full bg-[#ea580c] text-white flex items-center justify-center font-bold text-base shadow-md">2</div>
            <h4 className="font-extrabold text-base text-slate-900">Inspect Section 11 Notice & Award</h4>
            <p className="text-xs text-slate-600 leading-relaxed flex-grow">Check your fair valuation including the mandatory <strong className="text-slate-900">100% Solatium</strong> bonus under Section 30 of the RFCTLARR Act 2013.</p>
          </div>

          {/* Step 3 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs text-left flex flex-col gap-4 hover:shadow-lg transition-shadow">
            <div className="w-10 h-10 rounded-full bg-[#16a34a] text-white flex items-center justify-center font-bold text-base shadow-md">3</div>
            <h4 className="font-extrabold text-base text-slate-900">Receive DBT or File Objection</h4>
            <p className="text-xs text-slate-600 leading-relaxed flex-grow">If satisfied, compensation is disbursed directly to your bank account via PFMS. If you dispute the area, click 'File Objection' within 60 days.</p>
          </div>

        </div>
      </section>

      {/* ── COMMUNITY IMPACT SECTION ── */}
      <section className="w-full rounded-2xl overflow-hidden relative shadow-md bg-white border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          <div className="p-8 sm:p-10 flex flex-col justify-center gap-4">
            <h3 className="text-xs font-bold text-emerald-700 tracking-widest uppercase font-mono">Community Impact</h3>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">Empowering Communities Together</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              See how the National Land Portal is bringing transparency to citizens across the nation. Through accessible processes and timely direct benefit transfers, communities are finding a clear voice in local infrastructure development.
            </p>
            <button 
              onClick={() => setActiveTab('journey')}
              className="inline-flex items-center gap-2 text-[#2563eb] font-bold text-xs hover:underline mt-2 w-fit cursor-pointer"
            >
              <span>Read Legal Guide & Gazette Details</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <div className="h-64 md:h-full relative min-h-[280px]">
            <img 
              alt="Community engagement" 
              className="w-full h-full object-cover absolute inset-0" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPJzWDUkQpJxvxgkxPlMXlSx72FTW4kjJnNUqhuV_bYe3lE0m_C0eKLDwBEkjdetAvPuEeLtoC7OfusOy-gK0r6MjjXQ1R-j1GhufMJ9V3ivMWkkmudMdDsfjMNOwwqdKa9x4wBAwxRNJAVaByZpIFVWEKlqvVm4Ra2367wJDnkdCYABXtkicJkgetf99haAQ72LeFwLzlValPLA5N70c7wVB-zj93q4A46AwwE2i8gviivRgIAWcQ"
            />
          </div>
        </div>
      </section>

      {/* ── BENTO GRID: FAST ACCESS GATEWAYS & ANNOUNCEMENTS ── */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full mb-8">
        
        {/* Gateways (2 Cols) */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div>
            <h3 className="text-xs font-bold text-slate-500 tracking-widest uppercase font-mono">Fast Access Gateways</h3>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] mt-1">Select Your Role for 1-Click Access</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Citizen Gateway */}
            <div 
              onClick={() => handleRoleClick('citizen', 'home')}
              className="flex flex-col justify-between p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group space-y-4"
            >
              <div className="flex justify-between items-start">
                <div className="p-3 rounded-xl bg-blue-50 text-[#2563eb] group-hover:bg-[#2563eb] group-hover:text-white transition-colors">
                  <Landmark className="h-6 w-6" />
                </div>
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold">Public</span>
              </div>
              <div>
                <h4 className="font-extrabold text-base text-slate-900">Citizen / Land Owner</h4>
                <p className="text-xs text-slate-500 mt-1">View notices, track compensation, file grievances.</p>
              </div>
            </div>

            {/* Survey Officer Gateway */}
            <div 
              onClick={() => handleRoleClick('surveyor', 'survey')}
              className="flex flex-col justify-between p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group space-y-4"
            >
              <div className="flex justify-between items-start">
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                  <MapPin className="h-6 w-6" />
                </div>
                <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold font-mono">Field Station</span>
              </div>
              <div>
                <h4 className="font-extrabold text-base text-slate-900">Field Survey Officer</h4>
                <p className="text-xs text-slate-500 mt-1">GPS satellite node, verify plot boundaries.</p>
              </div>
            </div>

            {/* Legal & Admin Gateway */}
            <div 
              onClick={() => handleRoleClick('ministry', 'workflow')}
              className="flex flex-col justify-between p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group space-y-4"
            >
              <div className="flex justify-between items-start">
                <div className="p-3 rounded-xl bg-amber-50 text-[#ea580c] group-hover:bg-[#ea580c] group-hover:text-white transition-colors">
                  <Gavel className="h-6 w-6" />
                </div>
                <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold font-mono">HQ Admin</span>
              </div>
              <div>
                <h4 className="font-extrabold text-base text-slate-900">Legal & Admin Secretariat</h4>
                <p className="text-xs text-slate-500 mt-1">Review objections, process awards, generate reports.</p>
              </div>
            </div>

            {/* Financial Disbursal (PFMS) */}
            <div 
              onClick={() => handleRoleClick('ministry', 'web3')}
              className="flex flex-col justify-between p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group space-y-4"
            >
              <div className="flex justify-between items-start">
                <div className="p-3 rounded-xl bg-purple-50 text-purple-700 group-hover:bg-purple-700 group-hover:text-white transition-colors">
                  <CreditCard className="h-6 w-6" />
                </div>
                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-bold font-mono">DBT Escrow</span>
              </div>
              <div>
                <h4 className="font-extrabold text-base text-slate-900">Financial Disbursal</h4>
                <p className="text-xs text-slate-500 mt-1">Process DBT payments, reconcile bank accounts.</p>
              </div>
            </div>

          </div>
        </div>

        {/* Announcements Feed (1 Col) */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs flex flex-col overflow-hidden h-fit">
          <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#ea580c]" />
              Important Announcements
            </h3>
            <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">LIVE FEED</span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            <div className="p-4 space-y-1 hover:bg-slate-50 transition-colors">
              <span className="inline-block px-2 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-bold">New Gazette</span>
              <p className="font-semibold text-slate-800">Notification for Land Acquisition in District Palghar (NH-48 expansion) released.</p>
              <span className="text-[10px] text-slate-400 font-mono block">01-Sep-2026</span>
            </div>

            <div className="p-4 space-y-1 hover:bg-slate-50 transition-colors">
              <span className="inline-block px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">Statutory Update</span>
              <p className="font-semibold text-slate-800">Updated guidelines for calculating 100% Solatium under Section 30 published.</p>
              <span className="text-[10px] text-slate-400 font-mono block">28-Aug-2026</span>
            </div>

            <div className="p-4 space-y-1 hover:bg-slate-50 transition-colors">
              <span className="inline-block px-2 py-0.5 rounded bg-sky-100 text-sky-800 text-[10px] font-bold">Web3 Escrow</span>
              <p className="font-semibold text-slate-800">PFMS Direct Benefit Transfer (DBT) Escrow operational for 1,420 affected landowners.</p>
              <span className="text-[10px] text-slate-400 font-mono block">20-Aug-2026</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
            <button 
              onClick={() => setActiveTab('journey')}
              className="text-xs font-bold text-[#2563eb] hover:underline cursor-pointer"
            >
              View All Gazette Publications →
            </button>
          </div>
        </div>

      </section>

    </div>
  );
}
