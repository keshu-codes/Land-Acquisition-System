import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  Building2, Compass, Shield, User, ArrowRight, Layers, 
  CheckCircle, FileText, Lock, Sparkles, MapPin, Activity, 
  Send, Database, ExternalLink, HelpCircle, ChevronRight
} from 'lucide-react';

export default function Home({ setActiveTab }) {
  const { setShowLoginModal, proposals, language, t, user } = useContext(AppContext);

  const navigateTo = (tab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const rolePortals = [
    {
      title: language === 'en' ? 'Central Ministry & Collector' : 'केंद्रीय मंत्रालय और जिला मजिस्ट्रेट',
      role: 'Ministry & Collector Node',
      desc: language === 'en' 
        ? 'Register new infrastructure projects, issue Section 11 gazette notices, and declare compensation awards.' 
        : 'नई अवसंरचना परियोजनाएं पंजीकृत करें, धारा 11 राजपत्र नोटिस जारी करें और मुआवजा पंचाट घोषित करें।',
      icon: Building2,
      badge: 'LARR Authority',
      color: 'border-indigo-200 hover:border-indigo-500 bg-indigo-50/40',
      iconBg: 'bg-indigo-600 text-white',
      tab: 'workflow'
    },
    {
      title: language === 'en' ? 'State GIS Directorate' : 'राज्य जीआईएस निदेशालय',
      role: 'Remote Sensing Node',
      desc: language === 'en' 
        ? 'Audit spatial cadastral boundaries, cross-reference state BhuNaksha polygons, and prevent land overlaps.' 
        : 'स्थानिक कैडस्ट्राल सीमाओं का ऑडिट करें, राज्य भू-नक्शा बहुभुज का मिलान करें और ओवरलैप रोकें।',
      icon: Compass,
      badge: 'BhuNaksha GIS',
      color: 'border-amber-200 hover:border-amber-500 bg-amber-50/40',
      iconBg: 'bg-amber-600 text-white',
      tab: 'dashboard'
    },
    {
      title: language === 'en' ? 'Field Cadastral Surveyor' : 'फील्ड कैडस्ट्राल सर्वेयर',
      role: 'Ground Verification Station',
      desc: language === 'en' 
        ? 'Execute on-ground GPS geo-tagging, log soil classification, and capture site photos with margin of accuracy.' 
        : 'ऑन-ग्राउंड जीपीएस जियो-टैगिंग करें, मिट्टी वर्गीकरण लॉग करें और सटीकता के साथ साइट फोटो कैप्चर करें।',
      icon: MapPin,
      badge: 'GPS Mobile Unit',
      color: 'border-teal-200 hover:border-teal-500 bg-teal-50/40',
      iconBg: 'bg-teal-600 text-white',
      tab: 'survey'
    },
    {
      title: language === 'en' ? 'Citizen & Landowner' : 'नागरिक और भूमि स्वामी',
      role: 'Public Citizen Portal',
      desc: language === 'en' 
        ? 'Track transparent DBT escrow disbursements, verify land valuation, and submit single-use objection petitions.' 
        : 'पारदर्शी डीबीटी एस्क्रो संवितरण ट्रैक करें, भूमि मूल्यांकन सत्यापित करें और आपत्ति दर्ज करें।',
      icon: User,
      badge: 'Web3 DBT Escrow',
      color: 'border-orange-200 hover:border-[#ea580c] bg-orange-50/40',
      iconBg: 'bg-[#ea580c] text-white',
      tab: 'web3'
    },
  ];

  const workflowSteps = [
    {
      num: "01",
      title: language === 'en' ? 'Proposal Filing' : 'प्रस्ताव पंजीकरण',
      sub: language === 'en' ? 'Agencies register land requisition with required extent & budget' : 'मांग एजेंसी आवश्यक क्षेत्र और बजट के साथ प्रस्ताव दर्ज करती है'
    },
    {
      num: "02",
      title: language === 'en' ? 'Spatial GIS Audit' : 'स्थानिक जीआईएस ऑडिट',
      sub: language === 'en' ? 'Cadastral polygons verified against BhuNaksha & PM GatiShakti' : 'भू-नक्शा और गतिशक्ति डेटाबेस के साथ बहुभुज सीमाओं का सत्यापन'
    },
    {
      num: "03",
      title: language === 'en' ? 'Section 11 Gazette' : 'धारा 11 राजपत्र',
      sub: language === 'en' ? 'Official Gazette notification published; citizen objection window opens' : 'आधिकारिक राजपत्र अधिसूचना जारी; नागरिक आपत्ति सुनवाई अवधि खुली'
    },
    {
      num: "04",
      title: language === 'en' ? 'Award & Escrow DBT' : 'पंचाट और डीबीटी',
      sub: language === 'en' ? 'Market value + 100% solatium calculated; funds released via PFMS' : 'बाजार मूल्य + 100% सॉलेशियम गणना; एस्क्रो फंड सीधे खातों में'
    },
    {
      num: "05",
      title: language === 'en' ? 'Title Vesting Deed' : 'स्वामित्व निहितीकरण',
      sub: language === 'en' ? 'Physical possession taken and cryptographic title deed vested' : 'भौतिक कब्जा पूरा और क्रिप्टोग्राफिक स्वामित्व विलेख जारी'
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800">
      
      {/* ── 1. The Iconic 1st Interface: Green Land with "NLAMS" & Two Login Buttons ── */}
      <section className="relative text-white overflow-hidden py-16 sm:py-24 px-4 sm:px-8 border-b-4 border-amber-400">
        
        {/* Scenic Green Land Background with Rich Atmospheric Tint */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-700 transform scale-105"
          style={{ 
            backgroundImage: "url('/raw_landscape.png?v=3')",
            filter: "brightness(0.9) contrast(1.05)"
          }}
        />
        
        {/* Balanced Vignette Overlay so the Green Land Photo is Vibrant and Distinct */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />

        {/* Subtle geometric background grid */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1.5px,transparent_1.5px)] [background-size:28px_28px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 text-center space-y-6">
          
          {/* Top Statutory National Header */}
          <div className="inline-flex items-center gap-2.5 bg-emerald-950/85 border border-emerald-400/50 text-amber-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-lg">
            <span className="text-white font-serif font-bold">🇮🇳 भारत सरकार</span>
            <span className="text-emerald-400/60">•</span>
            <span className="text-emerald-100 font-semibold">Government of India</span>
            <span className="text-emerald-400/60">•</span>
            <span className="text-amber-300 font-mono">RFCTLARR Act 2013</span>
          </div>

          {/* Prominent NLAMS Title Above the Green Land */}
          <div>
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-widest font-serif text-amber-300 drop-shadow-[0_6px_20px_rgba(0,0,0,0.9)] hover:scale-102 transition-transform duration-300 inline-block">
              NLAMS
            </h1>
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-wide mt-2 font-serif drop-shadow-md">
              National Land Acquisition & Management System
            </h2>
            <p className="text-emerald-100/95 text-xs sm:text-base max-w-3xl mx-auto mt-3 font-medium leading-relaxed drop-shadow">
              Unified digital infrastructure uniting Central Ministries, State GIS Cadastres, District Collectors, Survey Officers, and Citizens for transparent, dispute-free land acquisition and automated Web3 DBT compensation.
            </p>
          </div>

          {/* TWO PRIMARY LOGIN BUTTONS: Citizen Login & Authority Login */}
          {!user ? (
            <div className="pt-6 max-w-2xl mx-auto space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                {/* 1. Citizen Login Button */}
                <button
                  onClick={() => setShowLoginModal('citizen')}
                  className="btn-pop bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#c2410c] hover:from-[#f97316] hover:to-[#ea580c] text-white p-5 rounded-2xl shadow-2xl flex items-center gap-4 cursor-pointer transition-all border-2 border-orange-300/50 group text-left transform hover:-translate-y-1 ring-2 ring-orange-500/20"
                >
                  <div className="p-3 bg-white/20 rounded-xl group-hover:scale-110 transition-transform shadow-inner">
                    <User className="h-7 w-7 text-amber-100" />
                  </div>
                  <div>
                    <div className="text-lg font-black tracking-wide flex items-center gap-1.5">
                      <span>Citizen Login</span>
                      <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                    <div className="text-xs text-orange-100 font-medium mt-0.5">
                      Submit Objections & Track DBT Claims
                    </div>
                  </div>
                </button>

                {/* 2. Authority Login Button */}
                <button
                  onClick={() => setShowLoginModal('officer')}
                  className="btn-pop bg-gradient-to-r from-[#1b5e20] via-[#2e7d32] to-[#0d3b13] hover:from-[#2e7d32] hover:to-[#1b5e20] text-white p-5 rounded-2xl shadow-2xl flex items-center gap-4 cursor-pointer transition-all border-2 border-emerald-400/60 group text-left transform hover:-translate-y-1 ring-2 ring-amber-300/30"
                >
                  <div className="p-3 bg-white/20 rounded-xl group-hover:scale-110 transition-transform shadow-inner">
                    <Shield className="h-7 w-7 text-amber-300" />
                  </div>
                  <div>
                    <div className="text-lg font-black tracking-wide flex items-center gap-1.5">
                      <span>Authority Login</span>
                      <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                    <div className="text-xs text-emerald-100 font-medium mt-0.5">
                      Central, State & District Levels
                    </div>
                  </div>
                </button>

              </div>

              {/* Statutory Access Security Notice */}
              <div className="bg-black/40 border border-emerald-500/30 p-3 rounded-xl text-[11px] text-emerald-200 font-semibold backdrop-blur-xs flex items-center justify-center gap-2">
                <Lock className="h-3.5 w-3.5 text-amber-300 flex-shrink-0" />
                <span>Protected features active after login. Citizens can submit objections; Authorities approve their designated administrative level.</span>
              </div>
            </div>
          ) : (
            /* Logged In User Status Card */
            <div className="pt-4 max-w-xl mx-auto">
              <div className="bg-white/95 text-slate-900 p-5 rounded-2xl shadow-2xl border border-white/50 backdrop-blur-md flex items-center justify-between">
                <div className="text-left">
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Authenticated Session Active
                  </span>
                  <h3 className="font-extrabold text-base font-serif text-slate-900 mt-1">
                    {user.full_name || user.username}
                  </h3>
                  <p className="text-xs font-bold text-slate-500">
                    {user.role === 'ministry' ? 'Central Authority (Central Level)' : user.role === 'state' ? 'State Authority (State GIS Level)' : user.role === 'district' ? 'District Authority (Collector Level)' : user.role === 'surveyor' ? 'Field Authority (Survey Station Level)' : 'Citizen Landholder Portal'}
                  </p>
                </div>
                
                <button
                  onClick={() => navigateTo(
                    user.role === 'citizen' ? 'objection' 
                    : user.role === 'ministry' ? 'dashboard' 
                    : user.role === 'state' ? 'workflow' 
                    : user.role === 'district' ? 'dispatch' 
                    : 'survey'
                  )}
                  className="btn-pop bg-emerald-700 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-black shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Open My Workbench</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

        </div>

      </section>

      {/* ── 2. Stakeholder Portals (Interactive Hover Pop Cards) ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            Role-Based Workbench Access
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0f2b5c] font-serif mt-2">
            Select Your Administrative & Citizen Portal
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Each dashboard is tailored with real-time permissions, spatial mapping, and statutory decision support tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {rolePortals.map((portal, idx) => {
            const Icon = portal.icon;
            return (
              <div
                key={idx}
                onClick={() => navigateTo(portal.tab)}
                className={`card-interactive p-5 rounded-2xl border bg-white shadow-xs flex flex-col justify-between cursor-pointer group ${portal.color}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2.5 rounded-xl ${portal.iconBg} shadow-xs group-hover:scale-110 transition-transform`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[9px] font-extrabold uppercase tracking-wider bg-white border border-slate-200 px-2 py-0.5 rounded-full text-slate-600">
                      {portal.badge}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-sm text-slate-900 font-serif group-hover:text-[#0f2b5c] transition-colors">
                    {portal.title}
                  </h3>
                  <span className="text-[10px] font-bold text-slate-400 block mb-2 uppercase">
                    {portal.role}
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {portal.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-150 flex items-center justify-between text-xs font-bold text-[#0f2b5c] group-hover:text-amber-600">
                  <span>Enter Module</span>
                  <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 3. 5-Stage Automated LARR Pipeline Visualizer ── */}
      <section className="bg-white border-y border-slate-200 py-12 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#ea580c] bg-orange-50 border border-orange-200 px-3 py-1 rounded-full">
                Statutory Compliance
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0f2b5c] font-serif mt-2">
                5-Stage Land Acquisition Lifecycle
              </h2>
            </div>

            <button
              onClick={() => navigateTo('workflow')}
              className="btn-pop bg-[#0f2b5c] hover:bg-[#0c224a] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <span>View Live Case Files</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {workflowSteps.map((step, idx) => (
              <div 
                key={idx}
                onClick={() => navigateTo('workflow')}
                className="hover-pop bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-300 p-4 rounded-xl shadow-xs transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <span className="text-2xl font-black text-[#0f2b5c]/30 font-mono block mb-1">
                    {step.num}
                  </span>
                  <h4 className="font-bold text-xs text-slate-800 font-serif mb-1">
                    {step.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-normal font-medium">
                    {step.sub}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-emerald-700 font-bold">
                  <span>Explore Step</span>
                  <ChevronRight className="h-3 w-3" />
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── 4. Key Interactive Capabilities Grid ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Cadastral GIS & Overlap Detection */}
          <div 
            onClick={() => navigateTo('gis')}
            className="card-interactive bg-white p-6 rounded-2xl border border-slate-200 shadow-xs cursor-pointer group space-y-3"
          >
            <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0f2b5c] group-hover:scale-110 transition-transform">
              <Layers className="h-5 w-5" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900 font-serif">
              Cadastral GIS & 50 Master Parcels
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Explore 50 geo-referenced land parcels with unique ULPIN numbers, boundary polygon coordinates, soil ratings, and owner records.
            </p>
            <div className="text-xs font-bold text-blue-700 flex items-center gap-1">
              <span>Inspect Parcels Directory</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Card 2: Notice Dispatch & SMS Simulator */}
          <div 
            onClick={() => navigateTo('dispatch')}
            className="card-interactive bg-white p-6 rounded-2xl border border-slate-200 shadow-xs cursor-pointer group space-y-3"
          >
            <div className="h-10 w-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#ea580c] group-hover:scale-110 transition-transform">
              <Send className="h-5 w-5" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900 font-serif">
              Officer Notice Dispatcher
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Assign nearest field officers via Euclidean distance, issue formal Section 11 notices with single-use security tokens over TLS 1.3 SMTP.
            </p>
            <div className="text-xs font-bold text-[#ea580c] flex items-center gap-1">
              <span>Dispatch Formal Notice</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Card 3: Transparent Web3 DBT Escrow */}
          <div 
            onClick={() => navigateTo('web3')}
            className="card-interactive bg-white p-6 rounded-2xl border border-slate-200 shadow-xs cursor-pointer group space-y-3"
          >
            <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 group-hover:scale-110 transition-transform">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900 font-serif">
              Web3 Escrow & SHA-256 Ledger
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Simulate Direct Benefit Transfer (DBT) compensation disbursements, verify cryptographic deed hashes, and inspect tamper-proof block ledgers.
            </p>
            <div className="text-xs font-bold text-emerald-700 flex items-center gap-1">
              <span>View Escrow Ledger</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>

        </div>
      </section>

      {/* ── 5. Official Government Verified Portals ── */}
      <section className="bg-slate-100 py-6 px-4 sm:px-8 border-t border-slate-200">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-slate-600">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-emerald-600" />
            <span>Authenticated National Land Management Platform • SIH 2026</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-blue-700 font-semibold">
            <button
              onClick={() => setShowLoginModal(true)}
              className="hover:underline hover:text-blue-900 cursor-pointer"
            >
              https://nlams.gov.in/portal
            </button>
            <button
              onClick={() => navigateTo('dashboard')}
              className="hover:underline hover:text-blue-900 cursor-pointer"
            >
              https://landrecords.gov.in/registry
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}



