import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Wallet, Shield, MapPin, Bell, User, Menu, X, Landmark, FileText, Globe, Send, Compass } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const { 
    selectedRole, 
    setSelectedRole, 
    walletConnected, 
    walletAddress, 
    connectWallet,
    notifications,
    language,
    setLanguage,
    t,
    user,
    logout,
    setShowLoginModal
  } = useContext(AppContext);

  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const roles = [
    { value: 'ministry', label: language === 'en' ? 'Central Ministry Node' : 'केंद्रीय मंत्रालय नोड', desc: language === 'en' ? 'National planning, proposal submissions & approvals' : 'राष्ट्रीय योजना, प्रस्ताव प्रस्तुत करना और अनुमोदन' },
    { value: 'state', label: language === 'en' ? 'State Government Node' : 'राज्य सरकार नोड', desc: language === 'en' ? 'State-level GIS verification and spatial audits' : 'राज्य स्तरीय जीआईएस सत्यापन और स्थानिक ऑडिट' },
    { value: 'district', label: language === 'en' ? 'District Collector Node' : 'जिला कलेक्टर नोड', desc: language === 'en' ? 'Section 11 Notifications & Award Declarations' : 'धारा 11 अधिसूचनाएं और पुरस्कार घोषणाएं' },
    { value: 'surveyor', label: language === 'en' ? 'Field Surveyor Node' : 'फील्ड सर्वेयर नोड', desc: language === 'en' ? 'Ground-level GPS tracking & valuation reports' : 'जमीनी स्तर पर जीपीएस ट्रैकिंग और मूल्यांकन रिपोर्ट' },
    { value: 'citizen', label: language === 'en' ? 'Citizen / Land Owner Portal' : 'नागरिक / भूमि मालिक पोर्टल', desc: language === 'en' ? 'Deed verification & compensation escrow claims' : 'विलेख सत्यापन और मुआवजा एस्क्रो दावे' }
  ];

  const currentRoleObj = roles.find(r => r.value === selectedRole);

  const getRoleMenuItems = (role) => {
    switch (role) {
      case 'ministry':
        return [
          { id: 'dashboard', label: t('executiveDashboard'), icon: Landmark },
          { id: 'workflow', label: t('workflows'), icon: FileText },
          { id: 'dispatch', label: language === 'en' ? 'Survey Dispatch' : 'सर्वे प्रेषण', icon: Send },
          { id: 'web3', label: t('web3Audit'), icon: Shield },
          { id: 'survey', label: t('surveyorNode'), icon: MapPin }
        ];
      case 'state':
        return [
          { id: 'workflow', label: language === 'en' ? 'State GIS Verification' : 'राज्य जीआईएस सत्यापन', icon: Compass },
          { id: 'dashboard', label: t('executiveDashboard'), icon: Landmark },
          { id: 'survey', label: t('surveyorNode'), icon: MapPin }
        ];
      case 'district':
        return [
          { id: 'dispatch', label: language === 'en' ? 'Survey Notice Dispatch' : 'सर्वे नोटिस प्रेषण', icon: Send },
          { id: 'workflow', label: language === 'en' ? 'Gazette & Awards (LARR)' : 'राजपत्र और पंचाट (LARR)', icon: FileText },
          { id: 'dashboard', label: t('executiveDashboard'), icon: Landmark },
          { id: 'web3', label: t('web3Audit'), icon: Shield }
        ];
      case 'surveyor':
        return [
          { id: 'survey', label: language === 'en' ? 'Cadastral Field Survey' : 'भूकर क्षेत्र सर्वेक्षण', icon: MapPin },
          { id: 'dispatch', label: language === 'en' ? 'Assigned Survey Queue' : 'आवंटित सर्वे कतार', icon: Send },
          { id: 'workflow', label: language === 'en' ? 'Possession Handover' : 'कब्जा सौंपना', icon: FileText }
        ];
      case 'citizen':
        return [
          { id: 'web3', label: language === 'en' ? 'Compensation & Escrow Claims' : 'मुआवजा और एस्क्रो दावे', icon: Shield },
          { id: 'workflow', label: language === 'en' ? 'Acquisition Case Status' : 'भूमि अर्जन केस स्थिति', icon: FileText }
        ];
      default:
        return [
          { id: 'dashboard', label: t('executiveDashboard'), icon: Landmark },
          { id: 'workflow', label: t('workflows'), icon: FileText }
        ];
    }
  };

  const tabTooltips = {
    dashboard: {
      title: language === 'en' ? 'Executive Monitoring Dashboard' : 'कार्यकारी निगरानी डैशबोर्ड',
      desc: language === 'en' 
        ? 'National macro-level KPIs, real-time conversion rates, and live interoperability hub syncing BHOOMI, Bhunaksha, PM GatiShakti & PFMS.' 
        : 'राष्ट्रीय स्तर के प्रमुख संकेतक, वास्तविक समय रूपांतरण दरें और भूमि, भू-नक्शा, गति-शक्ति और पीएफएमएस इंटरऑपरेबिलिटी हब।',
      tag: language === 'en' ? 'Statutory Sections 4 & 11 Oversight' : 'धारा 4 एवं 11 की निगरानी'
    },
    workflow: {
      title: language === 'en' ? 'Statutory LARR Workflow Engine' : 'एलएआरआर विधिक कार्यप्रवाह इंजन',
      desc: language === 'en'
        ? 'Enforces sequential RFCTLARR Act milestones: Proposal formulation, State GIS validation, Gazette Notifications, Public Hearings, and Award finalization.'
        : 'धारा 11 अधिसूचना, आपत्तियां, जनसुनवाई और धारा 23 पंचाट घोषणा के क्रमिक कानूनी चरणों का प्रबंधन।',
      tag: language === 'en' ? 'RFCTLARR Act 2013 Compliance' : 'भूमि अधिग्रहण अधिनियम 2013 अनुपालन'
    },
    dispatch: {
      title: language === 'en' ? 'Notice Dispatch & Haversine Locator' : 'नोटिस प्रेषण एवं निकटतम सर्वेयर चयन',
      desc: language === 'en'
        ? 'Computes nearest certified surveyor via Haversine distance formula, validates 2FA credentials (SIH@12345), and issues 30-day TLS 1.3 tokenized notices.'
        : 'हैवरसाइन सूत्र द्वारा निकटतम सर्वेयर का चयन, 2FA प्रमाणीकरण और 30-दिवसीय सुरक्षित टोकनयुक्त नोटिस प्रेषण।',
      tag: language === 'en' ? 'Section 11 Notice • GIS Proximity' : 'धारा 11 नोटिस • जीआईएस निकटता'
    },
    web3: {
      title: language === 'en' ? 'Web3 Escrow Audit & Direct Benefit Transfer' : 'वेब3 एस्क्रो ऑडिट और प्रत्यक्ष लाभ हस्तांतरण',
      desc: language === 'en'
        ? 'Smart contract escrow disbursement to landowner bank accounts, SHA-256 title deed hashing, on-chain immutable audit logs, and PFMS payment advice slips.'
        : 'स्मार्ट अनुबंध एस्क्रो भुगतान, विलेख का एसएचए-256 हैशिंग और पीएफएमएस सत्यापन रसीदें।',
      tag: language === 'en' ? 'Section 23/31 Solatium • Cryptographic Escrow' : 'धारा 23/31 सोलेशियम • सुरक्षित एस्क्रो'
    },
    survey: {
      title: language === 'en' ? 'Cadastral Mobile Survey Node' : 'भूकर मोबाइल सर्वेक्षण नोड',
      desc: language === 'en'
        ? 'Tablet-ready terminal for field officers: capture high-accuracy GPS polygon boundaries, upload geotagged site inspection photos, and log soil fertility profiles.'
        : 'फील्ड अधिकारियों हेतु जीपीएस सीमा निर्धारण, भू-टैग की गई तस्वीरें और मृदा उर्वरता रिपोर्ट।',
      tag: language === 'en' ? 'Section 12 Field Inspection • Real-time GPS' : 'धारा 12 स्थल निरीक्षण • जीपीएस जीयो-फेंसिंग'
    }
  };

  const menuItems = getRoleMenuItems(user?.role || selectedRole);

  return (
    <header className="bg-white sticky top-0 z-50 border-b border-slate-200 shadow-sm font-sans select-none">
      {/* Saffron, White, Green Tricolor Ribbon */}
      <div className="h-1 w-full flex">
        <div className="bg-[#FF9933] h-full flex-1" />
        <div className="bg-[#FFFFFF] h-full flex-1" />
        <div className="bg-[#138808] h-full flex-1" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Official Emblem & Branding */}
          <div className="flex items-center gap-3 cursor-pointer flex-shrink-0" onClick={() => setActiveTab('home')}>
            <div className="h-10 w-10 rounded-full bg-slate-50 border border-slate-300 flex items-center justify-center text-slate-800 shadow-inner flex-shrink-0">
              <Landmark className="h-5 w-5 stroke-[1.5] text-[#0f2b5c]" />
            </div>
            <div className="border-l border-slate-300 pl-3 flex flex-col justify-center">
              <span className="text-[9.5px] text-slate-500 font-bold uppercase tracking-wider block font-serif leading-none">
                {t('govIndia')}
              </span>
              <span className="font-extrabold text-[#0f2b5c] text-[13.5px] tracking-tight block leading-tight font-serif mt-1 whitespace-nowrap">
                National Land Portal <span className="text-[#ea580c] font-black">(NLAMS)</span>
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links with Rich Hover Info Tooltips */}
          <div className="hidden xl:flex space-x-1.5 ml-8">
            {menuItems.map(item => {
              const Icon = item.icon;
              const tooltip = tabTooltips[item.id];
              return (
                <div key={item.id} className="relative group">
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-bold transition-all cursor-pointer ${
                      activeTab === item.id 
                        ? 'bg-[#0f2b5c] text-white shadow-sm' 
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </button>

                  {/* Rich Government Information Hover Tooltip */}
                  {tooltip && (
                    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-72 p-3 bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none z-50 transform group-hover:translate-y-0 translate-y-1">
                      {/* Top Pointer Arrow */}
                      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900 border-t border-l border-slate-700 rotate-45"></div>
                      
                      <div className="relative z-10 space-y-1">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                          <span className="text-[11px] font-bold text-amber-400 font-serif leading-tight">
                            {tooltip.title}
                          </span>
                        </div>
                        <p className="text-[10.5px] text-slate-300 font-normal leading-relaxed">
                          {tooltip.desc}
                        </p>
                        <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[9px] text-slate-400 font-mono">
                          <span className="text-emerald-400 font-semibold">{tooltip.tag}</span>
                          <span className="text-slate-500">Official Portal Info</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Action Items */}
          <div className="hidden lg:flex items-center gap-3.5">
            
            {/* Language Switcher Button */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="px-3 py-2 rounded-lg border border-slate-250 text-xs font-bold text-[#0f2b5c] hover:bg-slate-50 cursor-pointer flex items-center gap-1 shadow-sm bg-white"
            >
              <Globe className="h-3.5 w-3.5 text-[#ea580c]" />
              <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>



            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 focus:outline-none relative border border-slate-200 cursor-pointer"
              >
                <Bell className="h-4.5 w-4.5" />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-[#ea580c] ring-2 ring-white" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white text-slate-800 rounded-xl shadow-xl py-1 z-50 border border-slate-200">
                  <div className="px-4 py-2.5 border-b border-slate-150 font-bold text-xs flex justify-between items-center text-slate-700">
                    <span>Registry System Alerts</span>
                    <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-normal">Active feed</span>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map(n => (
                      <div key={n.id} className="px-4 py-3 border-b border-slate-100 hover:bg-slate-50 text-[11px] text-slate-600 transition-colors">
                        <div className="font-semibold text-slate-700">{n.message}</div>
                        <div className="text-[9px] text-slate-400 mt-1">{n.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Authenticated User / Stakeholder Profile Badge */}
            <div className="relative">
              {user ? (
                <div className="flex items-center gap-2">
                  <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-[#0f2b5c] text-white flex items-center justify-center font-bold text-xs uppercase">
                      {(user?.username || "US").substring(0, 2)}
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-extrabold text-slate-800 font-serif leading-none">{user.full_name}</span>
                        <span className="text-[8px] font-extrabold bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded uppercase font-sans">
                          {user.role}
                        </span>
                      </div>
                      <span className="text-[9px] text-slate-400 font-semibold line-clamp-1 max-w-[140px] mt-0.5">{user.department}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowLoginModal(true)}
                    title="Switch Account / Login"
                    className="p-2 text-slate-500 hover:text-[#0f2b5c] hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold transition-all cursor-pointer"
                  >
                    <User className="h-4 w-4" />
                  </button>

                  <button
                    onClick={logout}
                    title="Sign Out"
                    className="px-2.5 py-2 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg text-xs font-bold transition-all cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="flex items-center gap-1.5 bg-[#ea580c] hover:bg-[#c2410c] text-white px-3.5 py-2 rounded-lg text-xs font-bold shadow transition-all cursor-pointer"
                >
                  <User className="h-4 w-4" />
                  <span>Official Login / Demo Profiles</span>
                </button>
              )}
            </div>

            {/* Connect Wallet Button */}
            <button
              onClick={connectWallet}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold tracking-wide transition-all border cursor-pointer ${
                walletConnected 
                  ? 'bg-emerald-50 border-emerald-350 text-emerald-700 hover:bg-emerald-100' 
                  : 'bg-[#0f2b5c] border-[#0f2b5c] text-white hover:bg-[#0c224a] shadow-sm'
              }`}
            >
              <Wallet className="h-4 w-4" />
              {walletConnected 
                ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(38)}` 
                : t('connectWallet')
              }
            </button>

          </div>

          {/* Mobile menu button */}
          <div className="xl:hidden flex items-center gap-3">
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="px-2 py-1.5 rounded border border-slate-250 text-[10px] font-bold text-[#0f2b5c] cursor-pointer"
            >
              {language === 'en' ? 'हिन्दी' : 'EN'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 focus:outline-none border border-slate-200 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white px-3 pt-2 pb-4 space-y-1 border-t border-slate-200 shadow-inner">
          {menuItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-3 rounded-lg text-xs font-bold cursor-pointer ${
                  activeTab === item.id 
                    ? 'bg-[#0f2b5c] text-white' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
