import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  Home as HomeIcon, LayoutDashboard, User, Lock, LogOut, Menu, X, 
  Layers, MapPin, Send, Compass, Shield, Globe, Sparkles, Scale, Calculator
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const { 
    user, 
    logout, 
    setShowLoginModal,
    language,
    setLanguage,
    t
  } = useContext(AppContext);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Role-specific navigation items: after login only permitted features are available
  const getNavItems = () => {
    if (!user) {
      return []; // No protected features available before login
    }

    const calcLabel = language === 'hi' ? 'सॉलेशियम कैलकुलेटर'
      : language === 'or' ? 'ସୋଲାସିୟମ କାଲକୁଲେଟର'
      : language === 'mr' ? 'सोलेशियम कॅल्क्युलेटर'
      : language === 'ta' ? 'சோலேடியம் கால்குலேட்டர்'
      : language === 'bn' ? 'সোলেশিয়াম ক্যালকুলেটর'
      : 'Solatium Calculator';

    const role = user.role;
    if (role === 'citizen') {
      return [
        { id: 'calc', label: calcLabel, icon: Scale },
        { id: 'objection', label: language === 'en' ? 'Submit Objection' : 'आपत्ति दर्ज करें', icon: Shield },
        { id: 'web3', label: language === 'en' ? 'My Compensation & DBT' : 'मुआवजा एवं डीबीटी', icon: Sparkles },
        { id: 'gis', label: language === 'en' ? 'Land Parcels Search' : 'भूमि पार्सल खोजें', icon: Layers },
      ];
    } else if (role === 'ministry') {
      return [
        { id: 'dashboard', label: language === 'en' ? 'National MIS Dashboard' : 'राष्ट्रीय एमआईएस डैशबोर्ड', icon: LayoutDashboard },
        { id: 'calc', label: calcLabel, icon: Scale },
        { id: 'workflow', label: language === 'en' ? 'Central Workflows' : 'केंद्रीय कार्यप्रवाह', icon: Shield },
        { id: 'gis', label: language === 'en' ? 'Cadastral Registry' : 'कैडस्ट्राल रजिस्टर', icon: Layers },
        { id: 'web3', label: language === 'en' ? 'Web3 Audit & DBT' : 'वेब3 ऑडिट एवं डीबीटी', icon: Sparkles },
      ];
    } else if (role === 'state') {
      return [
        { id: 'workflow', label: language === 'en' ? 'Spatial GIS Audits' : 'स्थानिक जीआईएस ऑडिट', icon: Shield },
        { id: 'calc', label: calcLabel, icon: Scale },
        { id: 'gis', label: language === 'en' ? 'BhuNaksha Cadastre' : 'भू-नक्शा कैडस्ट्रे', icon: Layers },
        { id: 'dashboard', label: language === 'en' ? 'State MIS Overview' : 'राज्य एमआईएस', icon: LayoutDashboard },
        { id: 'web3', label: language === 'en' ? 'Web3 Audit & DBT' : 'वेब3 ऑडिट एवं डीबीटी', icon: Sparkles },
      ];
    } else if (role === 'district') {
      return [
        { id: 'calc', label: calcLabel, icon: Scale },
        { id: 'workflow', label: language === 'en' ? 'District Gazette & Awards' : 'जिला राजपत्र एवं पंचाट', icon: Shield },
        { id: 'dispatch', label: language === 'en' ? 'Notice Dispatch' : 'नोटिस प्रेषण', icon: Send },
        { id: 'objection', label: language === 'en' ? 'Grievance Review' : 'नागरिक आपत्ति समीक्षा', icon: Shield },
        { id: 'gis', label: language === 'en' ? 'District Parcels' : 'जिला पार्सल', icon: Layers },
        { id: 'web3', label: language === 'en' ? 'Web3 Audit & DBT' : 'वेब3 ऑडिट एवं डीबीटी', icon: Sparkles },
      ];
    } else if (role === 'surveyor') {
      return [
        { id: 'survey', label: language === 'en' ? 'Field Station' : 'फील्ड स्टेशन', icon: Compass },
        { id: 'calc', label: calcLabel, icon: Scale },
        { id: 'workflow', label: language === 'en' ? 'Possession Handover' : 'कब्जा सौंपना', icon: Shield },
        { id: 'gis', label: language === 'en' ? 'Survey Parcels' : 'सर्वेक्षण पार्सल', icon: Layers },
      ];
    }

    return [
      { id: 'calc', label: calcLabel, icon: Scale },
      { id: 'gis', label: language === 'en' ? 'Parcels Registry' : 'भूमि पार्सल रजिस्टर', icon: Layers },
      { id: 'dashboard', label: language === 'en' ? 'MIS Dashboard' : 'एमआईएस डैशबोर्ड', icon: LayoutDashboard },
    ];
  };

  const navItems = getNavItems();

  const getRoleLabel = (role) => {
    switch (role) {
      case 'ministry': return 'Central Authority';
      case 'state': return 'State Authority';
      case 'district': return 'District Authority';
      case 'surveyor': return 'Field Surveyor';
      case 'citizen': return 'Citizen Landowner';
      default: return role;
    }
  };

  return (
    <header className="bg-white select-none font-sans sticky top-0 z-50 shadow-xs border-b border-slate-200">
      
      {/* 1. Top Govt Tier Banner */}
      <div className="bg-[#0f2415] text-emerald-200 text-[11px] py-1.5 px-4 sm:px-8 border-b border-emerald-900/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <span className="text-amber-400 font-serif">🇮🇳 {t('govIndia')}</span>
            <span className="text-emerald-400/60 hidden sm:inline">•</span>
            <span className="hidden sm:inline text-emerald-100/90">{t('ministryDept')}</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Node Badge */}
            <div className="hidden md:flex items-center gap-1.5 text-[10px] bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 px-2 py-0.5 rounded-full font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Registry Node Online</span>
            </div>

            {/* 6-Regional Language Selector Dropdown */}
            <div className="flex items-center gap-1.5 text-[11px] font-bold bg-emerald-950/80 text-amber-300 border border-emerald-700/80 px-2.5 py-0.5 rounded-md shadow-xs">
              <Globe className="h-3.5 w-3.5 text-amber-400 flex-shrink-0" />
              <select
                id="regional-lang-header-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-amber-300 font-bold focus:outline-none cursor-pointer text-[11px] py-0.5 border-none outline-none"
                title="Select Official Language"
              >
                <option value="en" className="bg-[#0f2415] text-white">English (EN)</option>
                <option value="hi" className="bg-[#0f2415] text-white">हिंदी (Hindi)</option>
                <option value="or" className="bg-[#0f2415] text-white">ଓଡ଼ିଆ (Odia)</option>
                <option value="mr" className="bg-[#0f2415] text-white">मराठी (Marathi)</option>
                <option value="ta" className="bg-[#0f2415] text-white">தமிழ் (Tamil)</option>
                <option value="bn" className="bg-[#0f2415] text-white">বাংলা (Bengali)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <nav className="bg-[#1b5e20] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            
            {/* Left Brand Identity */}
            <div 
              onClick={() => { setActiveTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="flex items-center gap-3 cursor-pointer group py-1"
            >
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl font-black text-amber-300 tracking-wider font-serif group-hover:scale-105 transition-transform duration-200">
                    NLAMS
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-900/80 text-emerald-200 border border-emerald-700/60 px-1.5 py-0.5 rounded">
                    LARR 2013
                  </span>
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-emerald-100 tracking-wide line-clamp-1">
                  National Land Acquisition & Management System
                </span>
              </div>
            </div>

            {/* Middle Nav Links with delightful hover pop */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`btn-pop px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isActive 
                        ? 'bg-[#144a19] text-amber-300 shadow-inner border border-emerald-600/80 font-extrabold ring-1 ring-amber-300/30' 
                        : 'text-emerald-100 hover:bg-[#23702a] hover:text-white hover:shadow-md'
                    }`}
                  >
                    <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-amber-300' : 'text-emerald-300'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Right Stakeholder Actions */}
            <div className="hidden sm:flex items-center gap-2">
              {user ? (
                <div className="flex items-center gap-2">
                  <div className="hover-pop bg-[#144a19] text-emerald-100 border border-emerald-600/60 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-2 shadow-xs">
                    <User className="h-3.5 w-3.5 text-amber-300" />
                    <span>{user.full_name || user.username}</span>
                    <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.5 rounded uppercase">
                      {getRoleLabel(user.role)}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="btn-pop bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition cursor-pointer shadow-sm"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>{t('logout')}</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowLoginModal('citizen')}
                    className="btn-pop bg-orange-600 hover:bg-orange-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <User className="h-3.5 w-3.5 text-orange-200" />
                    <span>{t('citizenLogin')}</span>
                  </button>

                  <button
                    onClick={() => setShowLoginModal('officer')}
                    className="btn-pop bg-amber-400 hover:bg-amber-300 text-slate-950 px-3.5 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Shield className="h-3.5 w-3.5 text-slate-900" />
                    <span>{t('authorityLogin')}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu trigger */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="btn-pop p-1.5 text-emerald-100 hover:text-white rounded-lg hover:bg-emerald-800"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#144a19] px-4 py-3 space-y-1.5 border-t border-emerald-700/80 text-xs animate-fadeIn">
            <div className="grid grid-cols-2 gap-1.5 mb-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => { 
                    setActiveTab(item.id); 
                    setMobileMenuOpen(false); 
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`btn-pop w-full text-left p-2 rounded-lg font-bold flex items-center gap-2 cursor-pointer ${
                    isActive ? 'bg-[#1b5e20] text-amber-300 border border-emerald-600' : 'text-emerald-100 hover:bg-[#23702a]'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

          {!user ? (
            <div className="pt-2 border-t border-emerald-800 flex gap-2">
              <button
                onClick={() => { setShowLoginModal('citizen'); setMobileMenuOpen(false); }}
                className="btn-pop flex-1 bg-orange-600 text-white py-2 rounded-lg font-bold text-center"
              >
                {t('citizenLogin')}
              </button>
              <button
                onClick={() => { setShowLoginModal('officer'); setMobileMenuOpen(false); }}
                className="btn-pop flex-1 bg-amber-400 text-slate-950 py-2 rounded-lg font-black text-center"
              >
                {t('authorityLogin')}
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-emerald-800 flex items-center justify-between">
              <span className="text-emerald-200 font-bold">{user.full_name || user.username} ({getRoleLabel(user.role)})</span>
              <button
                onClick={() => { logout(); setMobileMenuOpen(false); }}
                className="btn-pop bg-rose-600 text-white px-3 py-1 rounded font-bold"
              >
                {t('logout')}
              </button>
            </div>
          )}
          </div>
        )}
      </nav>

    </header>
  );
}

