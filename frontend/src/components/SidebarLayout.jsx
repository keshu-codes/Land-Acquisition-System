import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import NLAMSLogo from './NLAMSLogo';
import { 
  Landmark, Search, Bell, User, Globe, Radio, Shield, 
  Calculator, Layers, BookOpen, Scale, FileText, Send, Compass, MapPin, 
  ChevronRight, Menu, X, ChevronDown, Sparkles, HelpCircle, Phone, ArrowRight, CheckCircle2,
  UserCheck, Building2
} from 'lucide-react';

export default function SidebarLayout({ activeTab, setActiveTab, children }) {
  const { 
    user, 
    selectedRole, 
    setSelectedRole, 
    notifications, 
    language, 
    setLanguage, 
    logout, 
    login, 
    setShowLoginModal 
  } = useContext(AppContext);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const [topSearchQuery, setTopSearchQuery] = useState("");
  const [topSearchResult, setTopSearchResult] = useState(null);

  const roles = [
    { id: 'citizen', label: 'Landowner / Citizen', desc: 'Check Plot & Solatium', badge: 'Public' },
    { id: 'agency', label: 'Registered Agency / Developer', desc: 'Auctions & Tenders', badge: 'Partner' },
    { id: 'ministry', label: 'Ministry Secretariat', desc: 'Central LARR Overseer', badge: 'HQ' },
    { id: 'state', label: 'State Collectorate', desc: 'GIS & Cadastral Ledger', badge: 'State' },
    { id: 'district', label: 'District Competent Authority', desc: 'Gazette & Notice Dispatch', badge: 'District' },
    { id: 'surveyor', label: 'Field Surveyor Station', desc: 'GPS & Boundary Node', badge: 'Field' }
  ];

  const handleRoleSwitch = async (roleId) => {
    setSelectedRole(roleId);
    setShowRoleSelector(false);
    await login(roleId, 'nlams2026');
    const defaultTab = roleId === 'ministry' ? 'dashboard' 
      : roleId === 'state' ? 'workflow' 
      : roleId === 'district' ? 'dispatch' 
      : roleId === 'surveyor' ? 'survey' 
      : roleId === 'citizen' ? 'citizen-dashboard'
      : roleId === 'agency' ? 'agency-dashboard'
      : 'home';
    setActiveTab(defaultTab);
  };

  const getNavigationItems = (role) => {
    return [
      { id: 'home', label: 'Portal Overview', icon: Landmark },
      { id: 'citizen-dashboard', label: 'Citizen Land Dashboard', icon: UserCheck, badge: 'Landowner' },
      { id: 'agency-dashboard', label: 'Agency Tenders & Bids', icon: Building2, badge: 'Partner' },
      { id: 'dashboard', label: 'Authority Command Centre', icon: Landmark, badge: 'Analytics' },
      { id: 'workflow', label: 'LARR Case Workflows', icon: FileText },
      { id: 'dispatch', label: 'Notice Dispatch', icon: Send },
      { id: 'web3', label: 'Web3 Audit & DBT', icon: Shield },
      { id: 'survey', label: 'Field Survey Station', icon: MapPin },
      { id: 'calc', label: 'Solatium Calculator', icon: Calculator },
      { id: 'gis', label: 'GIS Satellite Explorer', icon: Layers }
    ];
  };

  const navItems = getNavigationItems(user?.role || selectedRole);

  const samplePlots = [
    { name: "Anmol", plot: "PLOT-OD-2026-9821", district: "Khordha, Odisha", totalAward: "₹85,00,000", status: "Sec 11 Notice Published", target: "dispatch" },
    { name: "Rameshwar Patel", plot: "PLOT-MH-2026-1044", district: "Nagpur / Sambalpur", totalAward: "₹1,30,00,000", status: "Possession Handover Complete", target: "web3" },
    { name: "Chennai Corridor", plot: "PLOT-TN-2026-2082", district: "Kanchipuram, TN", totalAward: "₹1,56,00,000", status: "Award Declared", target: "dashboard" }
  ];

  const handleTopSearch = (e) => {
    e.preventDefault();
    if (!topSearchQuery.trim()) return;
    const q = topSearchQuery.toLowerCase().trim();
    const found = samplePlots.find(p => p.name.toLowerCase().includes(q) || p.plot.toLowerCase().includes(q) || p.district.toLowerCase().includes(q));
    setTopSearchResult(found || "NOT_FOUND");
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex font-sans text-slate-800 select-none">
      
      {/* ── PERSISTENT LEFT COMMAND SIDEBAR ── */}
      <aside className={`bg-[#002366] text-white flex flex-col justify-between transition-all duration-300 z-40 fixed lg:static inset-y-0 left-0 ${
        sidebarOpen ? 'w-64' : 'w-20'
      } ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        
        <div className="space-y-4">
          
          {/* Top Brand Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
              <NLAMSLogo className="h-9 w-9" />
              {sidebarOpen && (
                <div>
                  <span className="text-[9px] font-bold text-amber-300 uppercase tracking-widest block font-serif leading-none">
                    Government of India
                  </span>
                  <h1 className="font-extrabold text-white text-sm font-heading leading-tight mt-0.5">
                    NLAMS
                  </h1>
                </div>
              )}
            </div>
            
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:block text-slate-300 hover:text-white p-1 rounded-md cursor-pointer"
            >
              <ChevronRight className={`h-4 w-4 transition-transform ${sidebarOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Active Role Selector Card */}
          {sidebarOpen ? (
            <div className="px-3">
              <div className="bg-white/10 rounded-xl p-2.5 border border-white/15 space-y-1.5">
                <div className="flex justify-between items-center text-[10px] text-slate-300">
                  <span className="font-mono uppercase">System Persona:</span>
                  <span className="bg-amber-400 text-slate-950 font-bold px-1.5 py-0.5 rounded text-[9px]">
                    {roles.find(r => r.id === (user?.role || selectedRole))?.badge || 'Public'}
                  </span>
                </div>
                <button
                  onClick={() => setShowRoleSelector(!showRoleSelector)}
                  className="w-full text-left bg-white/10 hover:bg-white/20 p-2 rounded-lg text-xs font-bold text-white flex justify-between items-center transition-colors cursor-pointer"
                >
                  <span className="capitalize truncate">{user?.role || selectedRole} Mode</span>
                  <ChevronDown className="h-3.5 w-3.5 text-amber-400" />
                </button>

                {showRoleSelector && (
                  <div className="pt-2 border-t border-white/10 space-y-1">
                    {roles.map(r => (
                      <button
                        key={r.id}
                        onClick={() => handleRoleSwitch(r.id)}
                        className={`w-full text-left p-1.5 rounded text-[11px] flex justify-between items-center transition-colors cursor-pointer ${
                          (user?.role || selectedRole) === r.id ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-200 hover:bg-white/10'
                        }`}
                      >
                        <span>{r.label}</span>
                        <span className="text-[9px] opacity-75 font-mono">{r.badge}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <button
                onClick={() => setShowRoleSelector(!showRoleSelector)}
                className="h-9 w-9 rounded-xl bg-white/10 text-amber-400 flex items-center justify-center font-bold text-xs"
                title="Switch Persona"
              >
                {(user?.role || selectedRole || 'P').substring(0, 1).toUpperCase()}
              </button>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="px-3 space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setMobileSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-white text-[#002366] shadow-md font-extrabold' 
                      : 'text-slate-200 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className={`h-4 w-4 flex-shrink-0 ${isActive ? 'text-[#ea580c]' : 'text-slate-300'}`} />
                  {sidebarOpen && <span className="truncate">{item.label}</span>}
                  {sidebarOpen && item.highlight && (
                    <span className="ml-auto bg-[#ea580c] text-white text-[9px] font-bold px-1.5 py-0.5 rounded font-mono">
                      Tool
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

        </div>

        {/* Sidebar Bottom Utilities */}
        <div className="p-3 border-t border-white/10 space-y-2">
          {sidebarOpen && (
            <div className="bg-white/5 p-2.5 rounded-xl text-[11px] text-slate-300 space-y-1 border border-white/10">
              <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                <Phone className="h-3 w-3" /> Helpline: 1800-11-LARR
              </div>
              <div className="text-[10px] text-slate-400">Toll-free citizen support</div>
            </div>
          )}

          <button
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="w-full bg-white/10 hover:bg-white/20 text-white p-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <Globe className="h-3.5 w-3.5 text-amber-400" />
            {sidebarOpen && <span>{language === 'en' ? 'हिन्दी (Hindi)' : 'English'}</span>}
          </button>
        </div>

      </aside>

      {/* ── MAIN WORKSPACE CONTENT AREA (RIGHT SIDE) ── */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Workspace Header & Marquee Bar */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
          
          {/* Gazette Marquee Ticker */}
          <div className="bg-slate-900 text-slate-300 py-1.5 px-4 text-[11px] border-b border-slate-800 overflow-hidden flex items-center justify-between">
            <div className="flex items-center gap-2 flex-shrink-0 z-10 bg-slate-900 pr-3 border-r border-slate-800">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-extrabold text-[#ea580c] uppercase tracking-wider text-[10px] flex items-center gap-1 font-mono">
                <Radio className="h-3 w-3 animate-pulse" /> GAZETTE TICKER
              </span>
            </div>

            <div className="overflow-hidden whitespace-nowrap w-full ml-3">
              <div className="animate-marquee inline-flex gap-8 text-slate-300 font-medium">
                <span>📜 Section 11 Notice Published: Regional Multi-Modal Corridor Expansion (Plot #OD-9821)</span>
                <span>•</span>
                <span>🏛️ PFMS Direct Benefit Transfer (DBT) Escrow Active for 1,420 Landowners</span>
                <span>•</span>
                <span>🛰️ Sub-Meter Satellite Cadastral Precision Verified</span>
              </div>
            </div>
          </div>

          {/* Top Control Bar */}
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
            
            {/* Mobile Sidebar Toggle */}
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
            >
              {mobileSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* Instant Search Bar in Header */}
            <div className="flex-1 max-w-xl relative">
              <form onSubmit={handleTopSearch} className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                <Search className="h-4 w-4 text-[#ea580c]" />
                <input
                  type="text"
                  placeholder="Quick lookup name (Anmol), plot survey no, or district..."
                  value={topSearchQuery}
                  onChange={(e) => setTopSearchQuery(e.target.value)}
                  className="w-full text-xs font-semibold outline-none bg-transparent text-slate-800 placeholder:text-slate-400"
                />
              </form>

              {/* Quick Search Popover Result */}
              {topSearchResult && (
                <div className="absolute top-12 left-0 right-0 bg-white border-2 border-amber-400 rounded-xl p-4 shadow-2xl z-50 animate-in fade-in duration-150">
                  {topSearchResult === "NOT_FOUND" ? (
                    <div className="text-xs text-rose-600 font-bold">No land parcel record found for "{topSearchQuery}".</div>
                  ) : (
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between items-start">
                        <strong className="font-extrabold text-[#002366] text-sm">{topSearchResult.name}</strong>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono font-bold">{topSearchResult.status}</span>
                      </div>
                      <div className="text-slate-600 font-medium">District: {topSearchResult.district} • Award: <strong className="text-emerald-700 font-mono">{topSearchResult.totalAward}</strong></div>
                      <button
                        onClick={() => { setActiveTab(topSearchResult.target); setTopSearchResult(null); }}
                        className="bg-[#002366] text-white px-3 py-1 rounded text-[11px] font-bold mt-1"
                      >
                        Open Case Particulars →
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Notifications & Account */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 relative border border-slate-200 cursor-pointer"
                >
                  <Bell className="h-4 w-4" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-[#ea580c] text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white text-slate-800 rounded-xl shadow-2xl py-2 z-50 border border-slate-200">
                    <div className="px-4 py-2 border-b border-slate-150 font-bold text-xs text-[#002366]">System Registry Alerts</div>
                    <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                      {notifications.map(n => (
                        <div key={n.id} className="p-3 text-[11px] hover:bg-slate-50">
                          <div className="font-semibold text-slate-800">{n.message}</div>
                          <div className="text-[9.5px] text-slate-400 mt-1 font-mono">{n.time}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {user ? (
                <div className="flex items-center gap-2 bg-[#002366] text-white px-3 py-1.5 rounded-xl shadow-xs">
                  <div className="h-6 w-6 rounded-full bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center justify-center">
                    {(user.username || "U").substring(0, 1).toUpperCase()}
                  </div>
                  <span className="text-xs font-bold leading-none hidden sm:inline">{user.full_name || user.username}</span>
                  <button onClick={() => logout()} className="text-slate-300 hover:text-white text-[10px] underline ml-1 cursor-pointer font-bold">
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="bg-[#002366] hover:bg-[#00174a] text-white px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <User className="h-3.5 w-3.5 text-amber-400" />
                  <span>Officer Sign In</span>
                </button>
              )}
            </div>

          </div>
        </header>

        {/* Dynamic Page View Rendering */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>

      </div>

    </div>
  );
}
