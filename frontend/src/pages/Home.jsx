import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  Landmark, MapPin, ChevronRight, FileText, 
  Users, Lock, Shield, CheckCircle, Search, ExternalLink,
  Scale, BookOpen, Building, Phone, AlertCircle, ArrowRight, Download,
  HelpCircle, ArrowUpRight, Check, Sparkles
} from 'lucide-react';

export default function Home({ setActiveTab }) {
  const { t, language, proposals, setShowLoginModal, login } = useContext(AppContext);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchedPlot, setSearchedPlot] = useState(null);
  const [activeFaq, setActiveFaq] = useState(null);

  const totalRequired = proposals.reduce((sum, p) => sum + p.areaRequired, 0);
  const totalAcquired = proposals.reduce((sum, p) => sum + p.areaAcquired, 0);
  const totalDisbursed = proposals.reduce((sum, p) => sum + p.budgetDisbursed, 0);

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

  const quickPersonaLogin = async (userRole) => {
    if (userRole === 'citizen') {
      await login('citizen', 'nlams2026');
      setActiveTab('web3');
    } else if (userRole === 'collector') {
      await login('collector', 'nlams2026');
      setActiveTab('dispatch');
    } else if (userRole === 'surveyor') {
      await login('surveyor', 'nlams2026');
      setActiveTab('survey');
    } else {
      await login('ministry', 'nlams2026');
      setActiveTab('dashboard');
    }
  };

  const faqs = [
    {
      q: language === 'en' ? "How is land compensation calculated under RFCTLARR Act 2013?" : "RFCTLARR अधिनियम 2013 के तहत मुआवजे की गणना कैसे की जाती है?",
      a: language === 'en'
        ? "Compensation is calculated as: Base Circle Rate Market Value + 100% Mandatory Solatium (Section 30) + 12% Annual Interest from Section 11 notice date + Structural/Crop valuation."
        : "मुआवजे की गणना: आधार सर्किल दर बाजार मूल्य + 100% अनिवार्य सोलेशियम (धारा 30) + 12% वार्षिक ब्याज + संरचना/फसल का मूल्यांकन।"
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
        ? "Under Section 12, authorized surveyors visit the plot and use the Mobile Cadastral GPS Node to capture live satellite boundary coordinates within ±3 meters accuracy with geotagged site photographs."
        : "धारा 12 के तहत, अधिकृत सर्वेयर मौके पर जाकर सब-3 मीटर सटीकता के साथ लाइव उपग्रह जीपीएस निर्देशांक और भू-टैग की गई तस्वीरें रिकॉर्ड करते हैं।"
    }
  ];

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans text-slate-800 select-none pb-12">
      
      {/* ── Top Hero: Easy 1-Click Search & Quick Actions ── */}
      <div className="bg-[#0f2b5c] text-white py-12 px-4 sm:px-8 border-b-4 border-[#ea580c]">
        <div className="max-w-6xl mx-auto space-y-6">
          
          <div className="text-center space-y-2">
            <span className="bg-white/10 text-amber-400 border border-white/20 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider font-serif inline-block">
              {language === 'en' ? 'Single-Window Public Land Portal' : 'एकल खिड़की सार्वजनिक भूमि पोर्टल'}
            </span>
            <h1 className="text-2xl sm:text-4xl font-bold font-serif tracking-tight">
              {language === 'en' ? 'Search Your Land Record & Compensation Status' : 'अपना भूमि रिकॉर्ड और मुआवजा स्थिति खोजें'}
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl mx-auto font-medium">
              {language === 'en' 
                ? 'No complicated steps or tutorials needed. Enter your Name, Plot Number, or Survey Number below to instantly check your official notice, valuation, and bank payment advice.'
                : 'सरल एवं त्वरित खोज। अपना नाम या प्लॉट नंबर दर्ज करें और तुरंत अपनी नोटिस, मूल्यांकन और मुआवजा स्थिति देखें।'}
            </p>
          </div>

          {/* 🔍 Easy Search Box */}
          <div className="max-w-3xl mx-auto bg-white rounded-md p-2 shadow-lg border border-slate-200">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 flex items-center gap-2 px-3 py-2 text-slate-800">
                <Search className="h-5 w-5 text-[#ea580c] flex-shrink-0" />
                <input
                  type="text"
                  placeholder={language === 'en' ? "Type Name (e.g. Anmol), Plot No. (e.g. PLOT-OD-2026-9821), or District..." : "नाम या प्लॉट नंबर दर्ज करें..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs sm:text-sm font-semibold outline-none text-slate-800 placeholder:text-slate-400"
                />
              </div>
              <button
                type="submit"
                className="bg-[#ea580c] hover:bg-orange-700 text-white px-6 py-2.5 rounded text-xs sm:text-sm font-bold font-serif transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span>{language === 'en' ? 'Track My Land' : 'खोजें'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>

          {/* Quick Demo Search Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-slate-300 text-[11px] font-medium">Try clicking an example:</span>
            <button
              onClick={() => { setSearchQuery("Anmol"); setSearchedPlot(allPlots[0]); }}
              className="bg-white/10 hover:bg-white/20 text-amber-300 px-2.5 py-1 rounded text-[11px] font-bold border border-white/20 transition-colors cursor-pointer"
            >
              📍 Anmol (PLOT-OD-2026-9821, Odisha)
            </button>
            <button
              onClick={() => { setSearchQuery("Rameshwar Patel"); setSearchedPlot(allPlots[1]); }}
              className="bg-white/10 hover:bg-white/20 text-slate-200 px-2.5 py-1 rounded text-[11px] font-bold border border-white/20 transition-colors cursor-pointer"
            >
              📍 Rameshwar Patel (PLOT-MH-2026-1044)
            </button>
            <button
              onClick={() => { setSearchQuery("Chennai"); setSearchedPlot(allPlots[2]); }}
              className="bg-white/10 hover:bg-white/20 text-slate-200 px-2.5 py-1 rounded text-[11px] font-bold border border-white/20 transition-colors cursor-pointer"
            >
              📍 Chennai Industrial Corridor
            </button>
          </div>

          {/* 🎯 Instant Search Result Card */}
          {searchedPlot && (
            <div className="max-w-3xl mx-auto mt-4 animate-fadeIn">
              {searchedPlot === "NOT_FOUND" ? (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded text-xs font-semibold flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-rose-600 flex-shrink-0" />
                  <div>
                    <strong className="block font-serif">No Record Found for "{searchQuery}"</strong>
                    <span className="text-[11px] text-rose-700">Please check your plot number or click one of the preset example buttons above.</span>
                  </div>
                </div>
              ) : (
                <div className="bg-white border-2 border-amber-400 rounded-md p-5 text-slate-800 shadow-xl space-y-4">
                  <div className="flex flex-wrap justify-between items-start border-b border-slate-200 pb-3 gap-2">
                    <div>
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded uppercase font-mono">
                        Official Land Record Verified
                      </span>
                      <h3 className="text-lg font-bold text-[#0f2b5c] font-serif mt-1">
                        {searchedPlot.name} — {searchedPlot.plot}
                      </h3>
                      <span className="text-xs text-slate-500 font-medium">{searchedPlot.project} ({searchedPlot.district})</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Award (with 100% Solatium)</span>
                      <strong className="text-xl font-bold text-emerald-700 font-serif">{searchedPlot.totalAward}</strong>
                    </div>
                  </div>

                  {/* Specification Table */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs border border-slate-200 rounded p-3 bg-slate-50">
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Area</span>
                      <strong className="text-slate-800">{searchedPlot.area}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Base Circle Rate</span>
                      <strong className="text-slate-800 font-serif">{searchedPlot.valuation}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Statutory Solatium</span>
                      <strong className="text-emerald-700 font-serif">{searchedPlot.solatium}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Current Stage</span>
                      <strong className="text-[#0f2b5c] text-[11px]">{searchedPlot.status}</strong>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2.5 pt-1">
                    <button
                      onClick={() => setActiveTab('web3')}
                      className="flex-1 bg-[#0f2b5c] hover:bg-[#0c224a] text-white px-4 py-2 rounded text-xs font-bold font-serif flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <span>💰 View Compensation & Bank DBT</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('dispatch')}
                      className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded text-xs font-bold font-serif flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <span>⚖️ File Objection / Dispute</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('dashboard')}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 px-4 py-2 rounded text-xs font-bold font-serif flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>🗺️ View on Satellite GIS</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* ── 3-Step Simple Guide ("How It Works") ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10">
        <div className="text-center space-y-1 mb-8">
          <span className="text-[10px] font-bold text-[#ea580c] uppercase tracking-wider font-serif">Easy Walkthrough</span>
          <h2 className="text-xl font-bold text-[#0f2b5c] font-serif">
            {language === 'en' ? 'How to Track & Claim Your Compensation in 3 Steps' : '3 आसान चरणों में अपनी मुआवजा स्थिति जानें'}
          </h2>
          <p className="text-xs text-slate-500 max-w-lg mx-auto">Zero technical knowledge required. The entire legal acquisition process is fully automated:</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Step 1 */}
          <div className="bg-white border border-slate-300 rounded-md p-5 space-y-3 relative">
            <div className="h-8 w-8 rounded-full bg-[#0f2b5c] text-white flex items-center justify-center font-bold text-xs font-serif">
              1
            </div>
            <h3 className="font-bold text-slate-800 text-sm font-serif">Search Your Land Parcel</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Enter your Name or Plot Survey Number in the search box above to view your officially notified boundary, circle rate, and project details.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white border border-slate-300 rounded-md p-5 space-y-3 relative">
            <div className="h-8 w-8 rounded-full bg-[#ea580c] text-white flex items-center justify-center font-bold text-xs font-serif">
              2
            </div>
            <h3 className="font-bold text-slate-800 text-sm font-serif">Inspect Section 11 Notice & Award</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Check your fair valuation including the mandatory <strong>100% Solatium</strong> bonus under Section 30 of the RFCTLARR Act 2013.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white border border-slate-300 rounded-md p-5 space-y-3 relative">
            <div className="h-8 w-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs font-serif">
              3
            </div>
            <h3 className="font-bold text-slate-800 text-sm font-serif">Receive DBT or File Objection</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              If satisfied, compensation is disbursed directly to your bank account via PFMS. If you dispute the area, click 'File Objection' within 60 days.
            </p>
          </div>

        </div>
      </div>

      {/* ── 1-Click Role Access Portal ("Who Are You?") ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-6">
        <div className="bg-white border border-slate-300 rounded-md p-6 space-y-5">
          <div className="border-b border-slate-200 pb-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-serif">Fast Access Gateways</span>
            <h2 className="text-lg font-bold text-[#0f2b5c] font-serif">
              {language === 'en' ? 'Select Your Role for 1-Click Instant Access' : '1-क्लिक त्वरित पहुंच हेतु अपना पद चुनें'}
            </h2>
            <p className="text-xs text-slate-500">Click any card below to launch the respective workspace immediately:</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Citizen Persona */}
            <div 
              onClick={() => quickPersonaLogin('citizen')}
              className="p-4 rounded border border-slate-200 hover:border-[#0f2b5c] hover:bg-slate-50 transition-all cursor-pointer space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xl">🌾</span>
                <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">Landowner</span>
              </div>
              <strong className="text-xs font-bold text-slate-800 block group-hover:text-[#0f2b5c]">Citizen / Landowner</strong>
              <p className="text-[11px] text-slate-500 leading-normal">
                Check compensation, view title deed SHA-256 hash, and monitor PFMS bank transfer advice.
              </p>
              <span className="text-[11px] font-bold text-[#ea580c] flex items-center gap-1 pt-1">
                Launch Portal <ArrowRight className="h-3 w-3" />
              </span>
            </div>

            {/* Collector Persona */}
            <div 
              onClick={() => quickPersonaLogin('collector')}
              className="p-4 rounded border border-slate-200 hover:border-[#0f2b5c] hover:bg-slate-50 transition-all cursor-pointer space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xl">🏢</span>
                <span className="text-[9px] font-bold bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded">District Collector</span>
              </div>
              <strong className="text-xs font-bold text-slate-800 block group-hover:text-[#0f2b5c]">Amitabh Choudhury (IAS)</strong>
              <p className="text-[11px] text-slate-500 leading-normal">
                Issue Section 11 notices, calculate nearest surveyor via Haversine formula, and handle hearings.
              </p>
              <span className="text-[11px] font-bold text-[#ea580c] flex items-center gap-1 pt-1">
                Launch Dispatch <ArrowRight className="h-3 w-3" />
              </span>
            </div>

            {/* Surveyor Persona */}
            <div 
              onClick={() => quickPersonaLogin('surveyor')}
              className="p-4 rounded border border-slate-200 hover:border-[#0f2b5c] hover:bg-slate-50 transition-all cursor-pointer space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xl">📍</span>
                <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">Field Officer</span>
              </div>
              <strong className="text-xs font-bold text-slate-800 block group-hover:text-[#0f2b5c]">Suresh Kumar</strong>
              <p className="text-[11px] text-slate-500 leading-normal">
                Detect real-time device GPS coordinates, inspect soil structures, and upload ground photos.
              </p>
              <span className="text-[11px] font-bold text-[#ea580c] flex items-center gap-1 pt-1">
                Launch GPS Station <ArrowRight className="h-3 w-3" />
              </span>
            </div>

            {/* Ministry Persona */}
            <div 
              onClick={() => quickPersonaLogin('ministry')}
              className="p-4 rounded border border-slate-200 hover:border-[#0f2b5c] hover:bg-slate-50 transition-all cursor-pointer space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xl">🏛️</span>
                <span className="text-[9px] font-bold bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded">Central MoRD</span>
              </div>
              <strong className="text-xs font-bold text-slate-800 block group-hover:text-[#0f2b5c]">Dr. Rajesh Verma</strong>
              <p className="text-[11px] text-slate-500 leading-normal">
                National macro-level KPIs, GIS visualizer, and live interoperability hub syncing BHOOMI & GatiShakti.
              </p>
              <span className="text-[11px] font-bold text-[#ea580c] flex items-center gap-1 pt-1">
                Launch MIS <ArrowRight className="h-3 w-3" />
              </span>
            </div>

          </div>
        </div>
      </div>

      {/* ── Frequently Asked Questions (Self-Service Helpdesk) ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-6">
        <div className="bg-white border border-slate-300 rounded-md p-6 space-y-4">
          <div className="border-b border-slate-200 pb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-serif">Need Help?</span>
            <h2 className="text-lg font-bold text-[#0f2b5c] font-serif">
              Frequently Asked Questions (Citizen Guidance)
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-slate-200 rounded overflow-hidden">
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full text-left p-3.5 bg-slate-50 hover:bg-slate-100 font-bold text-xs text-slate-800 flex justify-between items-center transition-colors cursor-pointer"
                >
                  <span className="font-serif">{faq.q}</span>
                  <span className="text-slate-400 text-sm font-mono">{activeFaq === idx ? '−' : '+'}</span>
                </button>
                {activeFaq === idx && (
                  <div className="p-3.5 bg-white text-xs text-slate-600 leading-relaxed border-t border-slate-200 font-medium">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
