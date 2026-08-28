import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  Shield, Landmark, MapPin, ChevronRight, Cpu, 
  Users, Lock, FileCheck, HelpCircle, ArrowRight
} from 'lucide-react';

export default function Home({ setActiveTab }) {
  const { t, language } = useContext(AppContext);
  
  const pillars = [
    {
      title: language === 'en' ? "Immutable Audits (Web3)" : "अपरिवर्तनीय ऑडिट (वेब3)",
      desc: language === 'en' 
        ? "Registers acquisition approvals and payment disbursements on a secure, public blockchain ledger to ensure 100% data integrity." 
        : "100% डेटा अखंडता सुनिश्चित करने के लिए एक सुरक्षित, सार्वजनिक ब्लॉकचेन बहीखाता पर अर्जन अनुमोदन और भुगतान संवितरण दर्ज करता है।",
      icon: Shield,
      color: "text-emerald-700 bg-emerald-50 border-emerald-200/50"
    },
    {
      title: language === 'en' ? "GIS Parcel Boundaries" : "जीआईएस पार्सल सीमाएं",
      desc: language === 'en'
        ? "Triangulates absolute coordinate polygons directly with drone and satellite visual maps, avoiding physical verification delays."
        : "भौतिक सत्यापन में देरी से बचते हुए, ड्रोन और सैटेलाइट विजुअल मैप्स के साथ सीधे पूर्ण निर्देशांक बहुभुजों को जोड़ता है।",
      icon: MapPin,
      color: "text-[#0f2b5c] bg-indigo-50 border-indigo-200/50"
    },
    {
      title: language === 'en' ? "Dynamic Valuation Engine" : "डायनेमिक मूल्यांकन इंजन",
      desc: language === 'en'
        ? "Calculates land assets, standing crop multipliers, and structural compensations dynamically using automated state registry links."
        : "स्वचालित राज्य रजिस्ट्री लिंक का उपयोग करके भूमि संपत्ति, खड़ी फसल गुणक और संरचनात्मक मुआवजे की गणना गतिशील रूप से करता है।",
      icon: Cpu,
      color: "text-orange-700 bg-orange-50 border-orange-200/50"
    },
    {
      title: language === 'en' ? "R&R Resettlement Logs" : "आर एंड आर पुनर्वास लॉग",
      desc: language === 'en'
        ? "Monitors and traces affected family rehabilitations, job assignments, and displacement assistance to ensure legal compliance."
        : "कानूनी अनुपालन सुनिश्चित करने के लिए प्रभावित परिवार के पुनर्वास, नौकरी के असाइनमेंट और विस्थापन सहायता की निगरानी और पता लगाता है।",
      icon: Users,
      color: "text-sky-700 bg-sky-50 border-sky-200/50"
    }
  ];

  const workflowSteps = [
    { 
      title: language === 'en' ? "Project Proposal Submitted" : "परियोजना प्रस्ताव प्रस्तुत किया गया", 
      desc: language === 'en' 
        ? "Project acquisition intent filed and database records created." 
        : "परियोजना अर्जन का इरादा दर्ज किया गया और डेटाबेस रिकॉर्ड बनाए गए।" 
    },
    { 
      title: language === 'en' ? "GIS & Boundary Verification" : "जीआईएस और सीमा सत्यापन", 
      desc: language === 'en'
        ? "State Land Registry node verifies parcel boundaries and checks overlap with existing forest land."
        : "राज्य भूमि रजिस्ट्री नोड पार्सल सीमाओं का सत्यापन करता है और मौजूदा वन भूमि के साथ ओवरलैप की जांच करता है।"
    },
    { 
      title: language === 'en' ? "Section 11 Gazette Notice" : "धारा 11 राजपत्र सूचना", 
      desc: language === 'en'
        ? "District Collector publishes Gazette notification. Citizen feedback hearings open for 60 days."
        : "जिला कलेक्टर राजपत्र अधिसूचना प्रकाशित करते हैं। नागरिक प्रतिक्रिया सुनवाई 60 दिनों के लिए खुली है।"
    },
    { 
      title: language === 'en' ? "Valuation & Award Finalization" : "मूल्यांकन और पुरस्कार का निर्धारण", 
      desc: language === 'en'
        ? "Valuation of crops, structures, and land is finalized. Saffron-tier escrow accounts are initialized."
        : "फसलों, संरचनाओं और भूमि का मूल्यांकन अंतिम रूप दिया जाता है। एस्क्रो खाते शुरू किए जाते हैं।"
    },
    { 
      title: language === 'en' ? "Possession & R&R Handover" : "कब्जा और आर एंड आर हैंडओवर", 
      desc: language === 'en'
        ? "Field surveyors verify site clearance, families relocate under R&R programs, and titles transfer on-chain."
        : "फील्ड सर्वेयर साइट क्लीयरेंस को सत्यापित करते हैं, परिवार आर एंड आर कार्यक्रमों के तहत स्थानांतरित होते हैं, और विलेख का हस्तांतरण होता है।"
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      
      {/* Hero Section with Official Government Grid Pattern */}
      <div className="bg-white border-b border-slate-200 py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ 
          backgroundImage: 'radial-gradient(#0f2b5c 1.5px, transparent 1.5px)', 
          backgroundSize: '24px 24px' 
        }} />
        
        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full text-[10px] font-bold text-slate-650 uppercase tracking-wide">
            <Landmark className="h-3.5 w-3.5 text-[#0f2b5c]" />
            {t('ministryDirective')}
          </div>
          
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#0f2b5c] max-w-4xl mx-auto leading-tight font-serif tracking-tight">
            {t('homeTitle')}
          </h1>
          
          <p className="text-slate-600 text-xs md:text-sm max-w-2xl mx-auto font-bold leading-relaxed">
            {t('homeSub')}
          </p>

          <div className="flex justify-center gap-3.5 pt-4">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="bg-[#0f2b5c] hover:bg-[#0c224a] text-white px-6 py-2.5 rounded-lg text-xs font-bold shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {t('enterPortal')}
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => setActiveTab('workflow')}
              className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 px-6 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm"
            >
              {t('trackCases')}
            </button>
          </div>
        </div>
      </div>

      {/* Overview Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-2 mb-12">
          <span className="text-[10px] text-orange-600 bg-orange-50 border border-orange-200/50 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
            {language === 'en' ? "Operational Pillars" : "परिचालन स्तंभ"}
          </span>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight font-serif">{t('pillarsTitle')}</h2>
          <p className="text-xs text-slate-500 font-bold max-w-md mx-auto leading-normal">
            {t('pillarsSub')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div key={idx} className="bg-white border border-slate-200 p-5.5 rounded-xl shadow-sm space-y-3.5 hover:shadow-md transition-shadow">
                <div className={`p-2.5 rounded-lg border w-fit ${pillar.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-[#0f2b5c] text-sm font-serif">{pillar.title}</h3>
                <p className="text-xs text-slate-550 leading-relaxed font-semibold">{pillar.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Standardized Legal Workflows */}
      <div className="bg-white border-t border-b border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="space-y-4">
              <span className="text-[10px] text-green-700 bg-green-50 border border-green-200/50 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                {language === 'en' ? "LARR ACT 2013" : "एलएआरआर अधिनियम 2013"}
              </span>
              <h2 className="text-2xl font-bold text-[#0f2b5c] tracking-tight font-serif">
                {t('flowTitle')}
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                {t('flowSub')}
              </p>
              <div className="text-[10px] text-slate-400 font-bold flex items-center gap-1.5 bg-slate-50 p-2.5 rounded-lg border border-slate-200 w-fit">
                <HelpCircle className="h-4.5 w-4.5 text-[#0f2b5c]" />
                {t('flowNote')}
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              {workflowSteps.map((step, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="h-8.5 w-8.5 rounded-full bg-[#0f2b5c]/10 text-[#0f2b5c] flex items-center justify-center font-bold text-xs border border-[#0f2b5c]/25">
                      {idx + 1}
                    </div>
                    {idx < 4 && <div className="w-0.5 h-12 bg-slate-200" />}
                  </div>
                  <div className="space-y-1 pt-0.5">
                    <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wide">{step.title}</h4>
                    <p className="text-xs text-slate-500 leading-normal font-semibold max-w-lg">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
