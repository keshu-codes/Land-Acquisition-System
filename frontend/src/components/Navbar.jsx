import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  Shield, MapPin, Bell, User, Menu, X, Landmark, 
  FileText, Globe, Send, Compass, Phone, Sparkles, CheckCircle2, ChevronDown, Lock, Radio,
  Calculator, Layers, Scale, BookOpen
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const { 
    selectedRole, 
    setSelectedRole,
    notifications,
    language,
    setLanguage,
    t,
    user,
    logout,
    login,
    setShowLoginModal
  } = useContext(AppContext);

  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showRoleSelector, setShowRoleSelector] = useState(false);

  const roles = [
    { id: 'ministry', label: 'Ministry Secretariat', roleText: 'Central LARR Overseer', badge: 'HQ' },
    { id: 'state', label: 'State Collectorate', roleText: 'State GIS & Cadastral Ledger', badge: 'State' },
    { id: 'district', label: 'District Competent Authority', roleText: 'Gazette & Notice Dispatch', badge: 'District' },
    { id: 'surveyor', label: 'Field Surveyor Station', roleText: 'GPS Node & Boundary Verification', badge: 'Field' },
    { id: 'citizen', label: 'Landowner / Citizen', roleText: 'Compensation & Objections', badge: 'Public' },
  ];

  const handleRoleSwitch = async (roleId) => {
    setSelectedRole(roleId);
    setShowRoleSelector(false);
    await login(roleId, 'nlams2026');
    const defaultTab = roleId === 'ministry' ? 'dashboard' 
      : roleId === 'state' ? 'workflow' 
      : roleId === 'district' ? 'dispatch' 
      : roleId === 'surveyor' ? 'survey' 
      : 'home';
    setActiveTab(defaultTab);
  };

  const getRoleMenuItems = (role) => {
    return [
      { id: 'home', label: language === 'en' ? 'Portal Home' : 'मुख्य पृष्ठ', icon: Landmark },
      { id: 'dashboard', label: language === 'en' ? 'Executive Dashboard' : 'कार्यकारी डैशबोर्ड', icon: Landmark },
      { id: 'workflow', label: language === 'en' ? 'LARR Case Workflows' : 'विधिक कार्यप्रवाह', icon: FileText },
      { id: 'dispatch', label: language === 'en' ? 'Notice Dispatch' : 'नोटिस प्रेषण', icon: Send },
      { id: 'web3', label: language === 'en' ? 'Web3 Audit & DBT' : 'वेब3 ऑडिट', icon: Shield },
      { id: 'survey', label: language === 'en' ? 'Field Survey' : 'क्षेत्र सर्वेक्षण', icon: MapPin }
    ];
  };

  const currentRole = user?.role || selectedRole || 'citizen';
  const menuItems = getRoleMenuItems(currentRole);

  return (
    <header className="w-full bg-white sticky top-0 z-50 shadow-sm border-b border-slate-200 font-sans select-none">
      
      {/* ── National Tricolor Header Strip ── */}
      <div className="h-1.5 w-full flex">
        <div className="bg-[#FF9933] h-full flex-1" />
        <div className="bg-[#FFFFFF] h-full flex-1" />
        <div className="bg-[#138808] h-full flex-1" />
      </div>

      {/* ── Live Gazette & Updates Marquee Ticker ── */}
      <div className="bg-slate-900 text-slate-300 py-1.5 px-4 text-[11px] border-b border-slate-800 overflow-hidden flex items-center justify-between">
        <div className="flex items-center gap-2 flex-shrink-0 z-10 bg-slate-900 pr-3 border-r border-slate-800">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-extrabold text-[#ea580c] uppercase tracking-wider text-[10px] flex items-center gap-1 font-mono">
            <Radio className="h-3 w-3 animate-pulse" /> GAZETTE LIVE TICKER
          </span>
        </div>

        <div className="overflow-hidden whitespace-nowrap w-full ml-3">
          <div className="animate-marquee inline-flex gap-8 text-slate-300 font-medium">
            <span>📜 Section 11 Notification Published: Regional Multi-Modal Corridor Expansion (Plot #OD-9821)</span>
            <span>•</span>
            <span>🏛️ PFMS Direct Benefit Transfer (DBT) Escrow Operational for 1,420 Affected Landowners</span>
            <span>•</span>
            <span>🛰️ GIS Satellite Boundary Audit Verified with ±1 Meter Cadastral Precision</span>
            <span>•</span>
            <span>⚖️ RFCTLARR Act 2013: 100% Mandatory Solatium Disbursed Instantly via Web3 Escrow</span>
            <span>•</span>
            <span>📞 Citizen Helpline Active: 1800-11-LARR (5277)</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-[10px] text-slate-400 font-mono flex-shrink-0 pl-4 border-l border-slate-800">
          <span className="flex items-center gap-1">
            <Shield className="h-3 w-3 text-emerald-400" /> Web3 Node: Synchronized
          </span>
          <div className="flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
            <Globe className="h-3 w-3 text-amber-400" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent text-amber-300 text-[10px] font-bold focus:outline-none cursor-pointer"
            >
              <option value="en" className="bg-slate-900 text-white">🌐 English</option>
              <option value="hi" className="bg-slate-900 text-white">🌐 हिंदी (Hindi)</option>
              <option value="or" className="bg-slate-900 text-white">🌐 ଓଡ଼ିଆ (Odia)</option>
              <option value="mr" className="bg-slate-900 text-white">🌐 मराठी (Marathi)</option>
              <option value="ta" className="bg-slate-900 text-white">🌐 தமிழ் (Tamil)</option>
              <option value="bn" className="bg-slate-900 text-white">🌐 বাংলা (Bengali)</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Main High-Density Header ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex flex-wrap items-center justify-between gap-3 min-h-[4rem]">
          
          {/* Official Branding with Emblem */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveTab('home')}>
            <img 
              src="/emblem.jpg" 
              alt="Government of India Emblem" 
              className="h-12 w-auto object-contain bg-white rounded-xl p-1 border border-slate-200 shadow-md group-hover:scale-105 transition-transform flex-shrink-0" 
            />
            <div className="border-l border-slate-200 pl-3 flex flex-col justify-center">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block font-serif leading-none">
                  {t('govIndia') || 'Government of India'}
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-[9px] font-extrabold px-1.5 py-0.5 rounded font-mono">RFCTLARR 2013</span>
              </div>
              <span className="font-extrabold text-[#0f2b5c] text-base sm:text-lg tracking-tight block leading-tight font-serif mt-0.5 whitespace-nowrap">
                National Land Portal <span className="text-[#ea580c] font-black">(NLAMS)</span>
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex flex-wrap items-center gap-1">
            {menuItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-[#0f2b5c] text-white shadow-sm ring-1 ring-[#0f2b5c]' 
                      : 'text-slate-700 hover:text-[#0f2b5c] hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Tools: Regional Language Selector & Role Switcher */}
          <div className="flex items-center gap-3">
            
            {/* Regional Language Switcher Dropdown */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-slate-50 text-xs font-bold text-slate-800">
              <Globe className="h-4 w-4 text-[#C98B2E]" />
              <select
                id="regional-lang-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent font-bold text-[#12355B] focus:outline-none cursor-pointer text-xs"
              >
                <option value="en">English (EN)</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="or">ଓଡ଼ିଆ (Odia)</option>
                <option value="mr">मराठी (Marathi)</option>
                <option value="ta">தமிழ் (Tamil)</option>
                <option value="bn">বাংলা (Bengali)</option>
              </select>
            </div>
            
            {/* Active Persona Quick Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowRoleSelector(!showRoleSelector)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-300 bg-slate-50 hover:bg-white text-xs font-bold text-slate-800 shadow-xs cursor-pointer transition-all"
                title="Switch Active Persona View"
              >
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-slate-500 font-normal">Role:</span>
                <span className="text-[#0f2b5c] font-extrabold capitalize">{user?.role || selectedRole}</span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
              </button>

              {showRoleSelector && (
                <div className="absolute right-0 mt-2 w-72 bg-white text-slate-800 rounded-xl shadow-2xl py-2 z-50 border border-slate-200 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-xl">
                    <span className="text-[11px] font-extrabold text-[#0f2b5c] uppercase tracking-wider">Switch System Persona</span>
                    <span className="text-[9px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">Interactive Demo</span>
                  </div>
                  <div className="p-1 space-y-1">
                    {roles.map(r => (
                      <button
                        key={r.id}
                        onClick={() => handleRoleSwitch(r.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                          (user?.role || selectedRole) === r.id 
                            ? 'bg-[#0f2b5c] text-white font-bold' 
                            : 'hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <div>
                          <div className="font-bold">{r.label}</div>
                          <div className={`text-[10px] ${ (user?.role || selectedRole) === r.id ? 'text-slate-200' : 'text-slate-500' }`}>{r.roleText}</div>
                        </div>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold font-mono ${
                          (user?.role || selectedRole) === r.id ? 'bg-amber-400 text-slate-900' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {r.badge}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Notification Alerts Popover */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 relative cursor-pointer border border-slate-200 bg-white"
                title="System Notifications"
              >
                <Bell className="h-4 w-4" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 block h-4 w-4 rounded-full bg-[#ea580c] text-white text-[9px] font-bold text-center leading-4">
                    {notifications.length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white text-slate-800 rounded-xl shadow-2xl py-1 z-50 border border-slate-200 animate-in fade-in duration-150">
                  <div className="px-4 py-2.5 border-b border-slate-100 font-bold text-xs flex justify-between items-center text-slate-800 bg-slate-50">
                    <span>Registry System Alerts</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold font-mono">Live Sync</span>
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                    {notifications.map(n => (
                      <div key={n.id} className="px-4 py-3 hover:bg-slate-50 text-[11px] text-slate-700">
                        <div className="font-semibold text-slate-900">{n.message}</div>
                        <div className="text-[9.5px] text-slate-400 mt-1 font-mono">{n.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Officer Account / Login Modal */}
            {user ? (
              <div className="flex items-center gap-2 bg-[#0f2b5c] text-white rounded-lg px-3 py-1.5 shadow-sm">
                <div className="h-7 w-7 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center font-black text-xs">
                  {(user.username || "U").substring(0, 1).toUpperCase()}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold leading-none">{user.full_name || user.username}</span>
                  <span className="text-[9px] text-amber-300 font-bold uppercase mt-0.5">{user.role}</span>
                </div>
                <button 
                  onClick={() => {
                    logout();
                    setActiveTab('home');
                  }} 
                  className="text-slate-300 hover:text-white font-bold text-[10px] ml-1.5 cursor-pointer underline"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="bg-[#0f2b5c] hover:bg-[#0c224a] text-white px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
              >
                <User className="h-4 w-4 text-amber-400" />
                <span>Officer Sign In</span>
              </button>
            )}

          </div>

          {/* Mobile Navigation Toggle */}
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
          <div className="lg:hidden py-3 border-t border-slate-200 space-y-2 bg-slate-50 px-2 rounded-b-xl mb-2">
            <div className="px-2 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Navigation Menu</div>
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
                className={`w-full text-left px-4 py-2.5 text-xs font-bold rounded-lg flex items-center gap-3 ${
                  activeTab === item.id ? 'bg-[#0f2b5c] text-white' : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            ))}

            <div className="pt-2 border-t border-slate-200 space-y-2">
              <div className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Switch Persona</div>
              <div className="grid grid-cols-2 gap-1.5 px-2">
                {roles.map(r => (
                  <button
                    key={r.id}
                    onClick={() => { handleRoleSwitch(r.id); setMobileMenuOpen(false); }}
                    className="text-left text-[11px] p-2 rounded bg-white border border-slate-200 text-slate-800 font-bold hover:bg-slate-100"
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </header>
  );
}
