import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  Shield, MapPin, Bell, User, Menu, X, Landmark, 
  FileText, Globe, Send, Compass, Phone, Volume2, Search, ExternalLink
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const { 
    selectedRole, 
    notifications,
    language,
    setLanguage,
    t,
    user,
    logout,
    setShowLoginModal
  } = useContext(AppContext);

  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [fontSize, setFontSize] = useState('normal'); // 'small', 'normal', 'large'

  const getRoleMenuItems = (role) => {
    switch (role) {
      case 'ministry':
        return [
          { id: 'dashboard', label: language === 'en' ? 'Executive Dashboard' : 'कार्यकारी डैशबोर्ड', icon: Landmark },
          { id: 'workflow', label: language === 'en' ? 'LARR Case Workflows' : 'विधिक कार्यप्रवाह', icon: FileText },
          { id: 'dispatch', label: language === 'en' ? 'Notice Dispatch' : 'नोटिस प्रेषण', icon: Send },
          { id: 'web3', label: language === 'en' ? 'Web3 Audit & DBT' : 'वेब3 ऑडिट और डीबीटी', icon: Shield },
          { id: 'survey', label: language === 'en' ? 'Field Surveyor Node' : 'फील्ड सर्वेक्षण नोड', icon: MapPin }
        ];
      case 'state':
        return [
          { id: 'workflow', label: language === 'en' ? 'State GIS Verification' : 'राज्य जीआईएस सत्यापन', icon: Compass },
          { id: 'dashboard', label: language === 'en' ? 'State Land Ledger' : 'राज्य भूमि बहीखाता', icon: Landmark },
          { id: 'survey', label: language === 'en' ? 'Cadastral Surveys' : 'भूकर सर्वेक्षण', icon: MapPin }
        ];
      case 'district':
        return [
          { id: 'dispatch', label: language === 'en' ? 'Survey Notice Dispatch' : 'सर्वे नोटिस प्रेषण', icon: Send },
          { id: 'workflow', label: language === 'en' ? 'Gazette & Awards (LARR)' : 'राजपत्र और पंचाट', icon: FileText },
          { id: 'dashboard', label: language === 'en' ? 'District Dashboard' : 'जिला डैशबोर्ड', icon: Landmark },
          { id: 'web3', label: language === 'en' ? 'Compensation Escrow' : 'मुआवजा एस्क्रो', icon: Shield }
        ];
      case 'surveyor':
        return [
          { id: 'survey', label: language === 'en' ? 'Cadastral Field Survey' : 'भूकर क्षेत्र सर्वेक्षण', icon: MapPin },
          { id: 'dispatch', label: language === 'en' ? 'Assigned Survey Queue' : 'आवंटित सर्वे कतार', icon: Send },
          { id: 'workflow', label: language === 'en' ? 'Possession Handover' : 'कब्जा सौंपना', icon: FileText }
        ];
      case 'citizen':
        return [
          { id: 'web3', label: language === 'en' ? 'Compensation Claims' : 'मुआवजा दावे', icon: Shield },
          { id: 'workflow', label: language === 'en' ? 'Acquisition Status' : 'अर्जन स्थिति', icon: FileText }
        ];
      default:
        return [
          { id: 'dashboard', label: language === 'en' ? 'Executive Dashboard' : 'कार्यकारी डैशबोर्ड', icon: Landmark },
          { id: 'workflow', label: language === 'en' ? 'LARR Case Workflows' : 'विधिक कार्यप्रवाह', icon: FileText },
          { id: 'dispatch', label: language === 'en' ? 'Notice Dispatch' : 'नोटिस प्रेषण', icon: Send },
          { id: 'web3', label: language === 'en' ? 'Web3 Audit & DBT' : 'वेब3 ऑडिट और डीबीटी', icon: Shield }
        ];
    }
  };

  const menuItems = getRoleMenuItems(user?.role || selectedRole);

  return (
    <header className="w-full select-none font-sans border-b border-slate-300">
      
      {/* ── Tier 1: National Tricolor & Accessibility Strip ── */}
      <div className="h-1 w-full flex">
        <div className="bg-[#FF9933] h-full flex-1" />
        <div className="bg-[#FFFFFF] h-full flex-1" />
        <div className="bg-[#138808] h-full flex-1" />
      </div>

      <div className="bg-[#f1f5f9] text-slate-700 text-[11px] px-4 sm:px-8 py-1 flex flex-wrap justify-between items-center border-b border-slate-250 font-medium">
        <div className="flex items-center gap-3">
          <span className="font-bold text-[#0f2b5c] font-serif">
            {language === 'en' ? 'GOVERNMENT OF INDIA' : 'भारत सरकार'}
          </span>
          <span className="text-slate-400">|</span>
          <span className="hidden sm:inline text-slate-600">
            {language === 'en' ? 'Ministry of Rural Development • Department of Land Resources' : 'ग्रामीण विकास मंत्रालय • भूमि संसाधन विभाग'}
          </span>
        </div>

        <div className="flex items-center gap-3 text-[10.5px]">
          {/* Accessibility Font Size Controls */}
          <div className="hidden md:flex items-center gap-1 border-r border-slate-300 pr-3">
            <span className="text-slate-400 text-[10px]">Font:</span>
            <button onClick={() => setFontSize('small')} className="px-1 py-0.5 rounded hover:bg-slate-200 text-xs font-bold">A-</button>
            <button onClick={() => setFontSize('normal')} className="px-1 py-0.5 rounded hover:bg-slate-200 text-xs font-bold">A</button>
            <button onClick={() => setFontSize('large')} className="px-1 py-0.5 rounded hover:bg-slate-200 text-xs font-bold">A+</button>
          </div>

          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="flex items-center gap-1 text-[#0f2b5c] hover:text-[#ea580c] font-bold cursor-pointer"
          >
            <Globe className="h-3.5 w-3.5 text-[#ea580c]" />
            <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
          </button>

          {/* User Status / Login */}
          <div className="border-l border-slate-300 pl-3">
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-slate-700 font-bold">{user.full_name}</span>
                <span className="text-[9px] bg-[#0f2b5c] text-white px-1.5 py-0.5 rounded font-bold uppercase">{user.role}</span>
                <button onClick={logout} className="text-rose-600 hover:underline font-bold text-[10px] ml-1">Logout</button>
              </div>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="bg-[#0f2b5c] hover:bg-[#0c224a] text-white px-2.5 py-0.5 rounded text-[10.5px] font-bold flex items-center gap-1 cursor-pointer shadow-xs"
              >
                <User className="h-3 w-3" />
                <span>Officer Login</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Tier 2: Official Government Branding Header ── */}
      <div className="bg-white py-3.5 px-4 sm:px-8 border-b border-slate-200 flex flex-wrap justify-between items-center gap-4">
        
        {/* Left: Ashoka Emblem + Dual Language Title */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
          {/* Official Emblem Badge */}
          <div className="h-12 w-12 rounded bg-[#0f2b5c] border border-[#0c224a] flex items-center justify-center text-amber-400 shadow-xs flex-shrink-0">
            <Landmark className="h-6 w-6 stroke-[1.8]" />
          </div>

          <div className="border-l-2 border-[#ea580c] pl-3">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-serif leading-tight">
              {language === 'en' ? 'DEPARTMENT OF LAND RESOURCES • MoRD' : 'भूमि संसाधन विभाग • ग्रामीण विकास मंत्रालय'}
            </span>
            <h1 className="text-base sm:text-lg font-bold text-[#0f2b5c] font-serif tracking-tight leading-tight mt-0.5">
              National Land Acquisition & Management System
            </h1>
            <span className="text-[10.5px] text-[#ea580c] font-bold tracking-wide block font-serif">
              राष्ट्रीय भूमि अधिग्रहण एवं प्रबंधन पोर्टल (NLAMS)
            </span>
          </div>
        </div>

        {/* Right: National Digital India & Support Information */}
        <div className="hidden lg:flex items-center gap-5 text-right">
          <div className="border-r border-slate-200 pr-5">
            <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Statutory Authority</span>
            <span className="text-xs font-bold text-slate-800 font-serif">RFCTLARR Act, 2013</span>
            <span className="text-[9.5px] text-emerald-700 font-bold block">Section 11, 19 & 23 Engine</span>
          </div>

          <div className="border-r border-slate-200 pr-5">
            <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">National Helpdesk</span>
            <span className="text-xs font-bold text-[#0f2b5c] font-serif flex items-center justify-end gap-1">
              <Phone className="h-3 w-3 text-[#ea580c]" />
              1800-11-2026
            </span>
            <span className="text-[9.5px] text-slate-500 font-medium block">Toll-Free (9:00 AM - 6:00 PM)</span>
          </div>

          <div className="h-10 px-3 py-1 bg-slate-50 border border-slate-200 rounded flex items-center justify-center text-xs font-bold text-[#0f2b5c] font-serif">
            🇮🇳 Digital India Node
          </div>
        </div>
      </div>

      {/* ── Tier 3: Royal Navy Primary Navigation Bar ── */}
      <nav className="bg-[#0f2b5c] text-white px-4 sm:px-8 border-b-2 border-[#ea580c] shadow-xs">
        <div className="flex items-center justify-between">
          
          {/* Main Desktop Links */}
          <div className="hidden md:flex items-center space-x-1 py-1">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3.5 py-2 text-xs font-bold transition-colors cursor-pointer border-b-2 ${
                activeTab === 'home'
                  ? 'bg-[#0c224a] text-amber-400 border-amber-400'
                  : 'text-slate-200 hover:text-white hover:bg-white/10 border-transparent'
              }`}
            >
              {language === 'en' ? 'Home' : 'मुख्य पृष्ठ'}
            </button>

            {menuItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold transition-colors cursor-pointer border-b-2 ${
                    isActive
                      ? 'bg-[#0c224a] text-amber-400 border-amber-400 font-serif'
                      : 'text-slate-200 hover:text-white hover:bg-white/10 border-transparent'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Action: Notifications & Live Alerts */}
          <div className="hidden md:flex items-center gap-2 py-1">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-1.5 rounded text-slate-200 hover:text-white hover:bg-white/10 relative cursor-pointer"
                title="Gazette Alerts"
              >
                <Bell className="h-4 w-4" />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-[#ea580c] ring-2 ring-[#0f2b5c]" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white text-slate-800 rounded shadow-lg py-1 z-50 border border-slate-300">
                  <div className="px-3.5 py-2 border-b border-slate-200 font-bold text-xs flex justify-between items-center text-slate-800 bg-slate-50 font-serif">
                    <span>Official Gazette & Registry Alerts</span>
                    <span className="text-[9px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-700">Live</span>
                  </div>
                  <div className="max-h-60 overflow-y-auto divide-y divide-slate-100">
                    {notifications.map(n => (
                      <div key={n.id} className="p-3 hover:bg-slate-50 text-[11px] text-slate-600">
                        <div className="font-semibold text-slate-800">{n.message}</div>
                        <div className="text-[9px] text-slate-400 mt-1 font-mono">{n.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden py-2.5 flex items-center justify-between w-full">
            <span className="text-xs font-bold text-amber-400 font-serif">NLAMS Official Menu</span>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-white hover:bg-white/10 rounded"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-2 border-t border-white/10 space-y-1">
            <button
              onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 text-xs font-bold text-white hover:bg-white/10"
            >
              {language === 'en' ? 'Home' : 'मुख्य पृष्ठ'}
            </button>
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 text-xs font-bold text-white hover:bg-white/10 flex items-center gap-2"
              >
                <item.icon className="h-3.5 w-3.5" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* ── Tier 4: Live Official Gazette & Notification Ticker ── */}
      <div className="bg-[#fffbeb] border-b border-amber-200 px-4 sm:px-8 py-1.5 flex items-center gap-3 text-xs text-slate-800">
        <span className="bg-[#ea580c] text-white px-2 py-0.5 rounded text-[9.5px] font-bold uppercase tracking-wider flex-shrink-0 font-serif">
          Gazette Bulletin
        </span>
        <div className="overflow-hidden whitespace-nowrap text-[11px] font-medium text-slate-700">
          <span className="inline-block animate-marquee">
            • <strong>Section 11 (1) Notice Published</strong>: Regional Multi-Modal Corridor Expansion (Khordha, Odisha - PLOT-OD-2026-9821)
            &nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;
            • <strong>Cadastral GIS Verification Cleared</strong>: Purulia Renewable Corridor (West Bengal)
            &nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;
            • <strong>PFMS Compensation DBT Handshake Active</strong>: 100% Solatium disbursed under Section 30 RFCTLARR Act 2013
          </span>
        </div>
      </div>

    </header>
  );
}
