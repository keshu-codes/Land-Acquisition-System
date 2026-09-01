import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  Shield, MapPin, Bell, User, Menu, X, Landmark, 
  FileText, Globe, Send, Compass, Phone
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

  const getRoleMenuItems = (role) => {
    switch (role) {
      case 'ministry':
        return [
          { id: 'home', label: language === 'en' ? 'Home' : 'मुख्य पृष्ठ', icon: Landmark },
          { id: 'dashboard', label: language === 'en' ? 'Executive Dashboard' : 'कार्यकारी डैशबोर्ड', icon: Landmark },
          { id: 'workflow', label: language === 'en' ? 'LARR Case Workflows' : 'विधिक कार्यप्रवाह', icon: FileText },
          { id: 'dispatch', label: language === 'en' ? 'Notice Dispatch' : 'नोटिस प्रेषण', icon: Send },
          { id: 'web3', label: language === 'en' ? 'Web3 Audit & DBT' : 'वेब3 ऑडिट और डीबीटी', icon: Shield },
          { id: 'survey', label: language === 'en' ? 'Field Survey' : 'क्षेत्र सर्वेक्षण', icon: MapPin }
        ];
      case 'state':
        return [
          { id: 'home', label: language === 'en' ? 'Home' : 'मुख्य पृष्ठ', icon: Landmark },
          { id: 'workflow', label: language === 'en' ? 'State GIS Verification' : 'राज्य जीआईएस सत्यापन', icon: Compass },
          { id: 'dashboard', label: language === 'en' ? 'State Land Ledger' : 'राज्य भूमि बहीखाता', icon: Landmark },
          { id: 'survey', label: language === 'en' ? 'Cadastral Surveys' : 'भूकर सर्वेक्षण', icon: MapPin }
        ];
      case 'district':
        return [
          { id: 'home', label: language === 'en' ? 'Home' : 'मुख्य पृष्ठ', icon: Landmark },
          { id: 'dispatch', label: language === 'en' ? 'Notice Dispatch' : 'नोटिस प्रेषण', icon: Send },
          { id: 'workflow', label: language === 'en' ? 'Gazette & Awards' : 'राजपत्र और पंचाट', icon: FileText },
          { id: 'dashboard', label: language === 'en' ? 'District Dashboard' : 'जिला डैशबोर्ड', icon: Landmark },
          { id: 'web3', label: language === 'en' ? 'Compensation Escrow' : 'मुआवजा एस्क्रो', icon: Shield }
        ];
      case 'surveyor':
        return [
          { id: 'home', label: language === 'en' ? 'Home' : 'मुख्य पृष्ठ', icon: Landmark },
          { id: 'survey', label: language === 'en' ? 'Field Survey Station' : 'क्षेत्र सर्वेक्षण नोड', icon: MapPin },
          { id: 'dispatch', label: language === 'en' ? 'Assigned Queue' : 'आवंटित कतार', icon: Send }
        ];
      case 'citizen':
        return [
          { id: 'home', label: language === 'en' ? 'Home' : 'मुख्य पृष्ठ', icon: Landmark },
          { id: 'web3', label: language === 'en' ? 'Compensation Claims' : 'मुआवजा दावे', icon: Shield },
          { id: 'workflow', label: language === 'en' ? 'Acquisition Status' : 'अर्जन स्थिति', icon: FileText }
        ];
      default:
        return [
          { id: 'home', label: language === 'en' ? 'Home' : 'मुख्य पृष्ठ', icon: Landmark },
          { id: 'dashboard', label: language === 'en' ? 'Executive Dashboard' : 'कार्यकारी डैशबोर्ड', icon: Landmark },
          { id: 'workflow', label: language === 'en' ? 'Case Workflows' : 'विधिक कार्यप्रवाह', icon: FileText },
          { id: 'dispatch', label: language === 'en' ? 'Notice Dispatch' : 'नोटिस प्रेषण', icon: Send },
          { id: 'web3', label: language === 'en' ? 'Web3 Audit & DBT' : 'वेब3 ऑडिट', icon: Shield }
        ];
    }
  };

  const menuItems = getRoleMenuItems(user?.role || selectedRole);

  return (
    <header className="w-full bg-white sticky top-0 z-50 shadow-xs border-b border-slate-200 font-sans select-none">
      
      {/* ── National Tricolor Line ── */}
      <div className="h-1 w-full flex">
        <div className="bg-[#FF9933] h-full flex-1" />
        <div className="bg-[#FFFFFF] h-full flex-1" />
        <div className="bg-[#138808] h-full flex-1" />
      </div>

      {/* ── Main Streamlined Navbar ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Left: Official Branding */}
          <div className="flex items-center gap-3 cursor-pointer flex-shrink-0" onClick={() => setActiveTab('home')}>
            <div className="h-10 w-10 rounded-lg bg-[#0f2b5c] flex items-center justify-center text-amber-400 shadow-xs flex-shrink-0">
              <Landmark className="h-5 w-5 stroke-[1.8]" />
            </div>
            <div className="border-l border-slate-250 pl-3 flex flex-col justify-center">
              <span className="text-[9.5px] text-slate-500 font-bold uppercase tracking-wider block font-serif leading-none">
                {language === 'en' ? 'Government of India • MoRD' : 'भारत सरकार • ग्रामीण विकास मंत्रालय'}
              </span>
              <span className="font-extrabold text-[#0f2b5c] text-sm tracking-tight block leading-tight font-serif mt-1 whitespace-nowrap">
                National Land Portal <span className="text-[#ea580c] font-black">(NLAMS)</span>
              </span>
            </div>
          </div>

          {/* Center: Spacious Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1.5 ml-6">
            {menuItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-[#0f2b5c] text-white shadow-xs' 
                      : 'text-slate-700 hover:text-[#0f2b5c] hover:bg-slate-100'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right: Language, Notifications & User Account */}
          <div className="hidden sm:flex items-center gap-3">
            
            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              <Globe className="h-3.5 w-3.5 text-[#ea580c]" />
              <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>

            {/* Notification Alerts */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 relative cursor-pointer border border-slate-200"
                title="Alerts"
              >
                <Bell className="h-4 w-4" />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-[#ea580c]" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white text-slate-800 rounded-lg shadow-xl py-1 z-50 border border-slate-200">
                  <div className="px-4 py-2.5 border-b border-slate-150 font-bold text-xs flex justify-between items-center text-slate-700 bg-slate-50">
                    <span>Registry System Alerts</span>
                    <span className="text-[9.5px] bg-slate-200 px-2 py-0.5 rounded text-slate-600">Active</span>
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                    {notifications.map(n => (
                      <div key={n.id} className="px-4 py-3 hover:bg-slate-50 text-[11px] text-slate-600">
                        <div className="font-semibold text-slate-800">{n.message}</div>
                        <div className="text-[9px] text-slate-400 mt-1 font-mono">{n.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Account / Login */}
            {user ? (
              <div className="flex items-center gap-2 bg-slate-100 border border-slate-250 rounded-lg px-3 py-1.5">
                <div className="h-6 w-6 rounded-full bg-[#0f2b5c] text-white flex items-center justify-center font-bold text-xs">
                  {(user.username || "U").substring(0, 1).toUpperCase()}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-800 leading-none">{user.full_name}</span>
                  <span className="text-[9px] text-slate-500 font-bold uppercase mt-0.5">{user.role}</span>
                </div>
                <button 
                  onClick={() => {
                    logout();
                    setActiveTab('home');
                  }} 
                  className="text-rose-600 hover:underline font-bold text-[10px] ml-1 cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="bg-[#0f2b5c] hover:bg-[#0c224a] text-white px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
              >
                <User className="h-4 w-4" />
                <span>Officer Login</span>
              </button>
            )}

          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-slate-200 space-y-1.5">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
                className={`w-full text-left px-4 py-2.5 text-xs font-bold rounded-lg flex items-center gap-2 ${
                  activeTab === item.id ? 'bg-[#0f2b5c] text-white' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            ))}
            <div className="pt-2 border-t border-slate-200 flex justify-between items-center px-4">
              <button
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className="text-xs font-bold text-[#0f2b5c]"
              >
                {language === 'en' ? 'Switch to हिन्दी' : 'Switch to English'}
              </button>
              {!user && (
                <button
                  onClick={() => { setShowLoginModal(true); setMobileMenuOpen(false); }}
                  className="bg-[#0f2b5c] text-white px-3 py-1.5 rounded text-xs font-bold"
                >
                  Officer Login
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </header>
  );
}
