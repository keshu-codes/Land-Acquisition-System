import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import LandGISMap from '../components/LandGISMap';
import { 
  Landmark, MapPin, ChevronRight, FileText, 
  Users, Lock, Shield, CheckCircle, Search, ExternalLink,
  Scale, BookOpen, Building, Phone, AlertCircle, ArrowRight, Download,
  HelpCircle, ArrowUpRight, Check, Sparkles, Calculator, Layers, Radio,
  Clock, ShieldCheck, HeartHandshake, FileCheck2, Coins, Eye, CheckCircle2
} from 'lucide-react';

export default function Home({ setActiveTab }) {
  const { t, language, proposals, setShowLoginModal, login } = useContext(AppContext);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchedPlot, setSearchedPlot] = useState(null);
  const [activeFaq, setActiveFaq] = useState(0);

  // Interactive Compensation Calculator state
  const [calcArea, setCalcArea] = useState(1.5); // Acres
  const [calcCircleRate, setCalcCircleRate] = useState(500); // ₹ per sq ft
  const [calcLandType, setCalcLandType] = useState('semi-urban'); // urban, semi-urban, rural

  // Calculation logic under RFCTLARR Act 2013
  const landAreaSqFt = calcArea * 43560;
  const rawMarketValue = landAreaSqFt * calcCircleRate;
  const landMultiplier = calcLandType === 'rural' ? 2.0 : calcLandType === 'semi-urban' ? 1.5 : 1.0;
  const adjustedMarketValue = rawMarketValue * landMultiplier;
  const solatium100 = adjustedMarketValue; // 100% mandatory solatium under Sec 30
  const interest12 = adjustedMarketValue * 0.12; // 12% annual interest
  const totalCalculatedAward = adjustedMarketValue + solatium100 + interest12;

  // Sample parcel database for instant search
  const allPlots = [
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
      officer: "Suresh Kumar (Station #04)",
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
      officer: "Station Officer #02",
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
      officer: "Station Officer #01",
      tabTarget: "dashboard"
    }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const q = searchQuery.toLowerCase().trim();
    const found = allPlots.find(p => 
      p.name.toLowerCase().includes(q) || 
      p.plot.toLowerCase().includes(q) || 
      p.survey.toLowerCase().includes(q) ||
      p.project.toLowerCase().includes(q) ||
      p.district.toLowerCase().includes(q)
    );
    setSearchedPlot(found || "NOT_FOUND");
  };

  const faqs = [
    {
      q: language === 'en' ? "How is land compensation calculated under RFCTLARR Act 2013?" : "RFCTLARR अधिनियम 2013 के तहत मुआवजे की गणना कैसे की जाती है?",
      a: language === 'en'
        ? "Compensation is calculated as: (Base Market Value × Multiplier Factor 1.0x to 2.0x) + 100% Mandatory Solatium (Section 30) + 12% Annual Interest from Section 11 notice date + Structural/Crop valuation."
        : "मुआवजे की गणना: (आधार बाजार मूल्य × गुणक 1.0x से 2.0x) + 100% अनिवार्य सोलेशियम (धारा 30) + 12% वार्षिक ब्याज + संरचना/फसल का मूल्यांकन।"
    },
    {
      q: language === 'en' ? "How do I file an objection if my land area or valuation is incorrect?" : "यदि मेरी भूमि का क्षेत्रफल या मूल्यांकन गलत है तो मैं आपत्ति कैसे दर्ज करूँ?",
      a: language === 'en'
        ? "Within 60 days of Section 11 notice publication, click 'File Objection / Dispute' on your land record or use the secure single-use email token to submit your objection directly to the District Collector."
        : "धारा 11 अधिसूचना के 60 दिनों के भीतर, अपने भूमि रिकॉर्ड पर 'आपत्ति दर्ज करें' पर क्लिक करें या सीधे जिला मजिस्ट्रेट को आपत्ति प्रस्तुत करें।"
    },
    {
      q: language === 'en' ? "How do field surveyors verify GPS coordinates on ground?" : "फील्ड सर्वेयर जमीन पर जीपीएस निर्देशांक कैसे सत्यापित करते हैं?",
      a: language === 'en'
        ? "Under Section 12, authorized surveyors visit the plot and use the Mobile Cadastral GPS Node to capture live satellite boundary coordinates within ±1 meter accuracy with geotagged site photographs."
        : "धारा 12 के तहत, अधिकृत सर्वेयर मौके पर जाकर sub-1m सटीकता के साथ लाइव उपग्रह जीपीएस निर्देशांक और भू-टैग की गई तस्वीरें रिकॉर्ड करते हैं।"
    },
    {
      q: language === 'en' ? "What makes Web3 Escrow different from traditional compensation disbursement?" : "वेब3 एस्क्रो पारंपरिक मुआवजा वितरण से अलग कैसे है?",
      a: language === 'en'
        ? "Web3 Smart Escrow locks approved compensation funds directly on-chain and triggers immediate direct bank transfer (DBT) via PFMS as soon as Section 19 declaration is verified, eliminating middlemen delays and corruption."
        : "वेब3 स्मार्ट एस्क्रो स्वीकृत धन को ब्लॉकचेन पर सुरक्षित रखता है और सत्यापन के तुरंत बाद बिना किसी बिचौलिए के पीएफएमएस के जरिए सीधे बैंक खाते में भुगतान जारी करता है।"
    }
  ];

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans text-slate-800 select-none pb-16">
      
      {/* ── Top Hero Banner: Humanized Command Center & Instant Land Search ── */}
      <section className="hero-gradient text-white py-16 px-4 sm:px-8 border-b-4 border-[#ea580c] relative overflow-hidden">
        {/* Decorative Grid Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="max-w-6xl mx-auto space-y-8 relative z-10">
          
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 bg-white/10 text-amber-300 border border-white/20 text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider font-mono">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              {language === 'en' ? 'Official National Portal • RFCTLARR Act 2013 Compliant' : 'आधिकारिक राष्ट्रीय पोर्टल • RFCTLARR अधिनियम 2013'}
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold font-heading tracking-tight leading-tight max-w-4xl mx-auto">
              {language === 'en' 
                ? 'Transparent Land Acquisition, Instant 100% Solatium & Web3 Escrow' 
                : 'पारदर्शी भूमि अर्जन, त्वरित 100% सोलेशियम एवं वेब3 एस्क्रो'}
            </h1>
            <p className="text-slate-200 text-sm sm:text-base max-w-2xl mx-auto font-medium">
              {language === 'en' 
                ? 'Single-window public portal for landowners, district collectors, and field surveyors. Search your plot number, inspect live GIS boundary coordinates, and track direct bank compensation payout.'
                : 'भूमि स्वामियों, जिला अधिकारियों और सर्वेक्षकों के लिए एकल-खिड़की पोर्टल। अपना प्लॉट नंबर खोजें और सीधा बैंक मुआवजा ट्रैक करें।'}
            </p>
          </div>

          {/* 🔍 Easy Search Box */}
          <div className="max-w-3xl mx-auto bg-white/95 backdrop-blur-md rounded-2xl p-2.5 shadow-2xl border border-white/30">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 flex items-center gap-2.5 px-4 py-2 text-slate-800">
                <Search className="h-5 w-5 text-[#ea580c] flex-shrink-0" />
                <input
                  type="text"
                  placeholder={language === 'en' ? "Search Name (e.g. Anmol), Plot No. (PLOT-OD-2026-9821), or District..." : "नाम या प्लॉट नंबर दर्ज करें..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs sm:text-sm font-semibold outline-none text-slate-800 placeholder:text-slate-400"
                />
              </div>
              <button
                type="submit"
                className="bg-[#ea580c] hover:bg-orange-700 text-white px-7 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg hover:shadow-orange-500/20"
              >
                <span>{language === 'en' ? 'Track My Land' : 'खोजें'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>

          {/* Quick Search Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-slate-300 text-xs font-semibold">Try sample records:</span>
            <button
              onClick={() => { setSearchQuery("Anmol"); setSearchedPlot(allPlots[0]); }}
              className="bg-white/10 hover:bg-white/20 text-amber-300 px-3 py-1 rounded-full text-xs font-bold border border-white/20 transition-all cursor-pointer flex items-center gap-1"
            >
              📍 Anmol (PLOT-OD-2026-9821, Odisha)
            </button>
            <button
              onClick={() => { setSearchQuery("Rameshwar Patel"); setSearchedPlot(allPlots[1]); }}
              className="bg-white/10 hover:bg-white/20 text-slate-200 px-3 py-1 rounded-full text-xs font-bold border border-white/20 transition-all cursor-pointer flex items-center gap-1"
            >
              📍 Rameshwar Patel (PLOT-MH-1044)
            </button>
            <button
              onClick={() => { setSearchQuery("Chennai"); setSearchedPlot(allPlots[2]); }}
              className="bg-white/10 hover:bg-white/20 text-slate-200 px-3 py-1 rounded-full text-xs font-bold border border-white/20 transition-all cursor-pointer flex items-center gap-1"
            >
              📍 Chennai Industrial Link Corridor
            </button>
          </div>

          {/* 🎯 Instant Search Result Card */}
          {searchedPlot && (
            <div className="max-w-3xl mx-auto mt-4 animate-in fade-in duration-200">
              {searchedPlot === "NOT_FOUND" ? (
                <div className="bg-rose-500/10 backdrop-blur-md border border-rose-400/30 text-rose-200 p-4 rounded-xl text-xs font-semibold flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-rose-400 flex-shrink-0" />
                  <div>
                    <strong className="block text-white font-heading">No Record Found for "{searchQuery}"</strong>
                    <span className="text-xs text-rose-200">Please verify your plot survey number or click one of the sample buttons above.</span>
                  </div>
                </div>
              ) : (
                <div className="bg-white border-2 border-amber-400 rounded-2xl p-6 text-slate-800 shadow-2xl space-y-4 text-left">
                  <div className="flex flex-wrap justify-between items-start border-b border-slate-200 pb-3 gap-2">
                    <div>
                      <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-md uppercase font-mono tracking-wider">
                        {searchedPlot.status}
                      </span>
                      <h3 className="text-lg font-extrabold text-[#0f2b5c] mt-1 font-heading">{searchedPlot.project}</h3>
                      <p className="text-xs text-slate-500 font-medium">Landowner: <strong className="text-slate-800">{searchedPlot.name}</strong> • District: {searchedPlot.district}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">Calculated Net Award</span>
                      <span className="text-xl font-extrabold text-emerald-600 font-mono">{searchedPlot.totalAward}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-500 block">Plot Survey No</span>
                      <strong className="font-mono text-slate-800">{searchedPlot.plot}</strong>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-500 block">Acquisition Area</span>
                      <strong className="text-slate-800">{searchedPlot.area}</strong>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-500 block">Base Valuation</span>
                      <strong className="text-slate-800">{searchedPlot.valuation}</strong>
                    </div>
                    <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                      <span className="text-[10px] text-amber-800 font-bold block">100% Solatium (Sec 30)</span>
                      <strong className="text-amber-900">{searchedPlot.solatium}</strong>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => setActiveTab(searchedPlot.tabTarget)}
                      className="bg-[#0f2b5c] hover:bg-[#0c224a] text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <span>View Full Case Details</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Key Metrics Counters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 max-w-5xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/15 text-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono block">1,420</span>
              <span className="text-[11px] text-slate-300 font-medium">Cadastral Plots Ledgered</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/15 text-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono block">₹452.8 Cr</span>
              <span className="text-[11px] text-slate-300 font-medium">Escrow Disbursed via PFMS</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/15 text-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono block">100%</span>
              <span className="text-[11px] text-slate-300 font-medium">Solatium Act Compliance</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/15 text-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-sky-400 font-mono block">&lt; 14 Days</span>
              <span className="text-[11px] text-slate-300 font-medium">Avg Objection Disposal</span>
            </div>
          </div>

        </div>
      </section>

      {/* ── Main Content Container ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        
        {/* ── Section 1: Interactive RFCTLARR 2013 Compensation Calculator ── */}
        <section className="gov-card p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2 py-0.5 rounded font-mono uppercase">Interactive Tool</span>
                <span className="text-xs text-slate-500 font-bold">RFCTLARR Act 2013 Schedule I</span>
              </div>
              <h2 className="text-2xl font-extrabold text-[#0f2b5c] font-heading mt-1">
                Land Compensation & Solatium Calculator
              </h2>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                Calculate legal land valuation, market multiplier, mandatory 100% solatium (Section 30), and interest under RFCTLARR.
              </p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-amber-500/10 border border-amber-300 flex items-center justify-center text-amber-600 flex-shrink-0">
              <Calculator className="h-6 w-6" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Input Controls */}
            <div className="lg:col-span-6 space-y-5 bg-slate-50 p-5 rounded-xl border border-slate-200">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 flex justify-between">
                  <span>Land Area (Acres)</span>
                  <span className="font-mono text-[#ea580c] font-bold">{calcArea} Acres</span>
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="10"
                  step="0.1"
                  value={calcArea}
                  onChange={(e) => setCalcArea(parseFloat(e.target.value))}
                  className="w-full accent-[#ea580c] cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 flex justify-between">
                  <span>Base Circle Rate (₹ per sq. ft)</span>
                  <span className="font-mono text-[#0f2b5c] font-bold">₹{calcCircleRate.toLocaleString('en-IN')}/sq ft</span>
                </label>
                <input
                  type="range"
                  min="100"
                  max="5000"
                  step="50"
                  value={calcCircleRate}
                  onChange={(e) => setCalcCircleRate(parseInt(e.target.value))}
                  className="w-full accent-[#0f2b5c] cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">Land Classification & Location Multiplier</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setCalcLandType('urban')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border cursor-pointer transition-all ${
                      calcLandType === 'urban' ? 'bg-[#0f2b5c] text-white border-[#0f2b5c]' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    Urban (1.0x)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalcLandType('semi-urban')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border cursor-pointer transition-all ${
                      calcLandType === 'semi-urban' ? 'bg-[#0f2b5c] text-white border-[#0f2b5c]' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    Semi-Urban (1.5x)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalcLandType('rural')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border cursor-pointer transition-all ${
                      calcLandType === 'rural' ? 'bg-[#0f2b5c] text-white border-[#0f2b5c]' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    Rural (2.0x)
                  </button>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 bg-white p-3 rounded-lg border border-slate-200 leading-relaxed">
                ℹ️ <strong>Legal Rule:</strong> Section 30 of RFCTLARR Act 2013 mandates an additional <strong>100% Solatium</strong> on top of total market value to compensate for compulsory acquisition.
              </div>
            </div>

            {/* Calculated Results Display */}
            <div className="lg:col-span-6 space-y-4 bg-gradient-to-br from-[#0f2b5c] to-[#1e3a8a] text-white p-6 rounded-xl shadow-xl">
              <div className="border-b border-white/15 pb-3">
                <span className="text-[10px] text-amber-400 font-mono font-bold uppercase tracking-wider block">Estimated Total Award Payable</span>
                <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono block mt-1">
                  ₹{(totalCalculatedAward / 100000).toFixed(2)} Lakhs
                </span>
                <span className="text-[11px] text-slate-300">Total payable directly into Landowner PFMS Escrow Bank Account.</span>
              </div>

              <div className="space-y-2 text-xs divide-y divide-white/10">
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-300">Base Circle Valuation:</span>
                  <span className="font-mono font-bold">₹{(rawMarketValue / 100000).toFixed(2)} L</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-300">Adjusted Market Value ({landMultiplier}x multiplier):</span>
                  <span className="font-mono font-bold">₹{(adjustedMarketValue / 100000).toFixed(2)} L</span>
                </div>
                <div className="flex justify-between py-1.5 text-amber-300">
                  <span className="font-semibold">+ Mandatory 100% Solatium (Sec 30):</span>
                  <span className="font-mono font-bold">₹{(solatium100 / 100000).toFixed(2)} L</span>
                </div>
                <div className="flex justify-between py-1.5 text-emerald-300">
                  <span className="font-semibold">+ 12% Interest Compensation (Sec 30):</span>
                  <span className="font-mono font-bold">₹{(interest12 / 100000).toFixed(2)} L</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setActiveTab('web3')}
                  className="w-full bg-[#ea580c] hover:bg-orange-700 text-white font-bold py-2.5 rounded-lg text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Coins className="h-4 w-4" />
                  <span>Verify Web3 Smart Contract Escrow Lock</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 2: GIS Satellite Spatial Map Preview ── */}
        <section className="gov-card p-6 sm:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <span className="text-[10px] font-extrabold bg-sky-100 text-sky-800 px-2 py-0.5 rounded font-mono uppercase">GIS Satellite Spatial Ledger</span>
              <h2 className="text-2xl font-extrabold text-[#0f2b5c] font-heading mt-1">Live Cadastral Boundary & Parcel Explorer</h2>
              <p className="text-xs text-slate-500 font-medium">Sub-meter accuracy GIS plot boundary mapping integrated with state land revenue registers.</p>
            </div>
            <button
              onClick={() => setActiveTab('dashboard')}
              className="bg-[#0f2b5c] text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 self-start md:self-auto cursor-pointer hover:bg-[#0c224a] transition-all"
            >
              <Layers className="h-4 w-4 text-amber-400" />
              <span>Open Full GIS Spatial Workstation</span>
            </button>
          </div>

          <div className="h-96 rounded-xl overflow-hidden border border-slate-200 relative shadow-inner">
            <LandGISMap selectedProject={proposals[0]} />
          </div>
        </section>

        {/* ── Section 3: 5-Stage Legal Acquisition Journey ── */}
        <section className="space-y-6">
          <div className="text-center space-y-1">
            <span className="text-[10px] font-extrabold bg-[#0f2b5c] text-amber-400 px-3 py-1 rounded-full uppercase tracking-wider font-mono">RFCTLARR Statutory Process</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f2b5c] font-heading">Transparent 5-Stage Land Acquisition Workflow</h2>
            <p className="text-xs text-slate-500 font-medium max-w-xl mx-auto">Every stage of land acquisition strictly follows legal notifications to ensure complete transparency for landowners.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              {
                step: "01",
                title: "Social Impact (SIA)",
                act: "Section 4 & 7",
                desc: "Public SIA study conducted with mandatory Gram Sabha approval and environmental assessment.",
                badge: "Approved",
                color: "border-sky-500 bg-sky-50/50 text-sky-800"
              },
              {
                step: "02",
                title: "Preliminary Gazette",
                act: "Section 11 (1)",
                desc: "Official Gazette published in local news & SMS alerts sent to registered land parcel owners.",
                badge: "Public Notice",
                color: "border-indigo-500 bg-indigo-50/50 text-indigo-800"
              },
              {
                step: "03",
                title: "Objections Hearing",
                act: "Section 15 (1)",
                desc: "60-day legal window for landowners to submit boundary disputes or valuation objections.",
                badge: "Active Hearing",
                color: "border-amber-500 bg-amber-50/50 text-amber-800"
              },
              {
                step: "04",
                title: "Final Declaration",
                act: "Section 19 (1)",
                desc: "Final acquisition notice & compensation award declared by the District Collector.",
                badge: "Award Declared",
                color: "border-emerald-500 bg-emerald-50/50 text-emerald-800"
              },
              {
                step: "05",
                title: "Web3 DBT Escrow",
                act: "Section 30",
                desc: "Instant 100% Solatium & Market Value transferred directly into landowner's bank account.",
                badge: "Disbursed",
                color: "border-orange-500 bg-orange-50/50 text-orange-800"
              }
            ].map((item, idx) => (
              <div key={idx} className={`gov-card p-5 border-t-4 ${item.color} space-y-2 flex flex-col justify-between`}>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-extrabold font-mono text-[#0f2b5c] opacity-40">{item.step}</span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-white border border-slate-200 uppercase font-mono">{item.badge}</span>
                  </div>
                  <h3 className="font-extrabold text-sm text-[#0f2b5c] font-heading">{item.title}</h3>
                  <span className="text-[10px] font-bold text-[#ea580c] block font-mono">{item.act}</span>
                  <p className="text-[11px] text-slate-600 font-medium leading-normal">{item.desc}</p>
                </div>
                <button
                  onClick={() => setActiveTab('workflow')}
                  className="mt-3 text-[10px] font-bold text-[#0f2b5c] hover:text-[#ea580c] flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>Inspect Gazette Rule</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section 4: Public Downloads & Official Forms Hub ── */}
        <section className="gov-card p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono uppercase">Official Downloads</span>
              <h2 className="text-2xl font-extrabold text-[#0f2b5c] font-heading mt-1">Gazette Notifications & Public Claim Forms</h2>
              <p className="text-xs text-slate-500 font-medium">Download official gazette templates, objection petition forms, and RFCTLARR statutory manuals.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3 hover:border-slate-300 transition-all">
              <FileText className="h-8 w-8 text-[#0f2b5c] flex-shrink-0 mt-1" />
              <div className="space-y-1">
                <h4 className="font-bold text-xs text-slate-900 font-heading">Section 11 (1) Gazette Template</h4>
                <p className="text-[11px] text-slate-500 font-medium">Standard official gazette publication format for preliminary notification.</p>
                <a 
                  href="#download"
                  onClick={(e) => { e.preventDefault(); alert("Downloading official Gazette Section 11 Template PDF..."); }}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#ea580c] hover:underline pt-1 cursor-pointer"
                >
                  <Download className="h-3 w-3" /> Download PDF (1.2 MB)
                </a>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3 hover:border-slate-300 transition-all">
              <FileCheck2 className="h-8 w-8 text-emerald-600 flex-shrink-0 mt-1" />
              <div className="space-y-1">
                <h4 className="font-bold text-xs text-slate-900 font-heading">Form K - Solatium Claim Sheet</h4>
                <p className="text-[11px] text-slate-500 font-medium">Official claim submission form for 100% Solatium & structural valuation.</p>
                <a 
                  href="#download"
                  onClick={(e) => { e.preventDefault(); alert("Downloading Form K Solatium Sheet PDF..."); }}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#ea580c] hover:underline pt-1 cursor-pointer"
                >
                  <Download className="h-3 w-3" /> Download PDF (850 KB)
                </a>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3 hover:border-slate-300 transition-all">
              <BookOpen className="h-8 w-8 text-amber-600 flex-shrink-0 mt-1" />
              <div className="space-y-1">
                <h4 className="font-bold text-xs text-slate-900 font-heading">RFCTLARR Act 2013 Citizen Handbook</h4>
                <p className="text-[11px] text-slate-500 font-medium">Comprehensive legal guide on landowner rights, SIA, and R&R entitlement.</p>
                <a 
                  href="#download"
                  onClick={(e) => { e.preventDefault(); alert("Downloading RFCTLARR Handbook PDF..."); }}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#ea580c] hover:underline pt-1 cursor-pointer"
                >
                  <Download className="h-3 w-3" /> Download PDF (4.5 MB)
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 5: Legal & Citizen FAQ Accordion ── */}
        <section className="gov-card p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-[10px] font-extrabold bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-mono uppercase">Frequently Asked Questions</span>
            <h2 className="text-2xl font-extrabold text-[#0f2b5c] font-heading mt-1">Landowner Help & Legal Rights</h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full text-left p-4 bg-slate-50 hover:bg-slate-100 flex justify-between items-center text-xs sm:text-sm font-bold text-[#0f2b5c] transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <span className="text-base text-slate-500 font-mono">{activeFaq === idx ? '−' : '+'}</span>
                </button>
                {activeFaq === idx && (
                  <div className="p-4 bg-white text-xs text-slate-600 font-medium border-t border-slate-200 leading-relaxed animate-in fade-in duration-150">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
