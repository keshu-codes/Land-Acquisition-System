import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import DashboardStats from '../components/DashboardStats';
import LandGISMap from '../components/LandGISMap';
import AnalyticsCharts from '../components/AnalyticsCharts';
import { 
  Search, Filter, Layers, Users, TrendingUp, AlertCircle, 
  FileCheck, CheckCircle, Download, Wifi, Database, Activity, Compass, RefreshCw,
  MessageSquareWarning, ShieldAlert, Send, MapPin, BarChart3, Scale
} from 'lucide-react';

export default function Dashboard() {
  const { proposals, addNotification, language, t, apiBase, user, authHeader } = useContext(AppContext);
  const [selectedProject, setSelectedProject] = useState(proposals[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStateFilter, setSelectedStateFilter] = useState("All States");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("All Statuses");

  // Dashboard Sub-Tab View ('gis', 'analytics', 'grievances')
  const [activeSubTab, setActiveSubTab] = useState('gis');

  // ML inference states
  const [mlPrediction, setMlPrediction] = useState(null);
  const [mlLoading, setMlLoading] = useState(false);

  // Live Grievance Monitor state
  const [grievances, setGrievances] = useState([]);
  const [grievanceLoading, setGrievanceLoading] = useState(false);

  const fetchGrievances = async () => {
    if (!user || (user.role !== 'ministry' && user.role !== 'district')) return;
    try {
      setGrievanceLoading(true);
      const res = await fetch(`${apiBase}/grievances/monitor`, {
        headers: authHeader()
      });
      if (res.ok) {
        const data = await res.json();
        setGrievances(data);
      }
    } catch (err) {
      console.error("Grievance fetch error:", err);
    } finally {
      setGrievanceLoading(false);
    }
  };

  useEffect(() => {
    fetchGrievances();
    const interval = setInterval(fetchGrievances, 15000);
    return () => clearInterval(interval);
  }, [user]);

  const safeProposals = proposals || [];
  const states = [language === 'en' ? "All States" : "सभी राज्य", ...new Set(safeProposals.map(p => p.state))];
  const statuses = [language === 'en' ? "All Statuses" : "सभी स्थितियाँ", ...new Set(safeProposals.map(p => p.status))];

  const filteredProposals = safeProposals.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesState = selectedStateFilter === "All States" || selectedStateFilter === "सभी राज्य" || p.state === selectedStateFilter;
    const matchesStatus = selectedStatusFilter === "All Statuses" || selectedStatusFilter === "सभी स्थितियाँ" || p.status === selectedStatusFilter;
    return matchesSearch && matchesState && matchesStatus;
  });

  const activeSelectedProject = filteredProposals.find(p => p.id === selectedProject?.id) || filteredProposals[0] || selectedProject;

  useEffect(() => {
    if (!activeSelectedProject) return;

    const fetchMLPrediction = async () => {
      setMlLoading(true);
      try {
        const res = await fetch(`${apiBase}/projects/${activeSelectedProject.id}/predict`);
        if (res.ok) {
          const data = await res.json();
          setMlPrediction(data);
        } else {
          setMlPrediction(null);
        }
      } catch (err) {
        console.error("Failed to query API for ML predictions:", err);
        setMlPrediction(null);
      } finally {
        setMlLoading(false);
      }
    };

    fetchMLPrediction();
  }, [activeSelectedProject, apiBase]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Proposal Submitted":
        return <span className="bg-indigo-50 text-[#0f2b5c] text-[10px] font-bold px-2.5 py-1 rounded-full border border-indigo-200 uppercase">{language === 'en' ? 'Proposal Submitted' : 'प्रस्ताव जमा'}</span>;
      case "GIS Verification":
        return <span className="bg-orange-50 text-orange-700 text-[10px] font-bold px-2.5 py-1 rounded-full border border-orange-200 uppercase">{language === 'en' ? 'GIS Verification' : 'जीआईएस सत्यापन'}</span>;
      case "Section 11 Notification":
        return <span className="bg-sky-50 text-sky-700 text-[10px] font-bold px-2.5 py-1 rounded-full border border-sky-200 uppercase">{language === 'en' ? 'Sec 11 Notified' : 'धारा 11 अधिसूचित'}</span>;
      case "Award Declared":
        return <span className="bg-amber-50 text-amber-700 text-[10px] font-bold px-2.5 py-1 rounded-full border border-amber-250 uppercase">{language === 'en' ? 'Award Declared' : 'पुरस्कार घोषित'}</span>;
      case "Possession Handover":
        return <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-250 uppercase">{language === 'en' ? 'Possession Complete' : 'कब्जा पूर्ण'}</span>;
      default:
        return <span className="bg-slate-50 text-slate-700 text-[10px] font-bold px-2.5 py-1 rounded-full border border-slate-200 uppercase">{status}</span>;
    }
  };

  const exportMISReport = () => {
    const headers = "Project ID,Title,Agency,State,District,Required Area (ha),Acquired Area (ha),Budget Assessed (Cr),Budget Disbursed (Cr),Affected Families,Displaced Families,R&R Progress (%),Status\n";
    const rows = proposals.map(p => 
      `"${p.id}","${p.title}","${p.agency}","${p.state}","${p.district}",${p.areaRequired},${p.areaAcquired},${p.budgetAssessed},${p.budgetDisbursed},${p.affectedFamilies},${p.displacedFamilies},${p.rrProgress},"${p.status}"`
    ).join("\n");
    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(headers + rows);
    
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", `NLAMS_MIS_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    addNotification("MIS CSV Executive report compiled and downloaded.", "success");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans select-none">
      
      {/* ── Header Title & Actions ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-[#0f2b5c] tracking-tight font-serif">
            {t('monitoringDashboard')}
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {t('monitoringSub')}
          </p>
        </div>
        
        {/* Filters & Export */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={exportMISReport}
            className="flex items-center gap-1.5 bg-[#0f2b5c] hover:bg-[#0c224a] text-white px-4 py-2 rounded-lg text-xs font-bold shadow-xs transition-all cursor-pointer font-serif"
          >
            <Download className="h-3.5 w-3.5" />
            {t('exportReport')}
          </button>

          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white border border-slate-200 text-slate-800 text-xs rounded-lg pl-9 pr-3 py-2 w-44 focus:outline-none focus:border-[#0f2b5c] font-semibold transition-all shadow-xs"
            />
          </div>

          <div className="flex items-center bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 gap-1.5 shadow-xs">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={selectedStateFilter}
              onChange={(e) => setSelectedStateFilter(e.target.value)}
              className="bg-transparent text-slate-800 text-xs font-bold focus:outline-none border-none cursor-pointer"
            >
              {states.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* ── Top Executive Metric Banner ── */}
      <DashboardStats />

      {/* ── Spacious Workspace Navigation Tabs ── */}
      <div className="flex items-center space-x-2 border-b border-slate-200 text-xs font-bold">
        <button
          onClick={() => setActiveSubTab('gis')}
          className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition-all cursor-pointer font-serif ${
            activeSubTab === 'gis' 
              ? 'border-[#0f2b5c] text-[#0f2b5c] bg-slate-50 font-extrabold' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Compass className="h-4 w-4 text-[#ea580c]" />
          <span>{language === 'en' ? 'Cadastral GIS Visualizer & Dossier' : 'भूकर जीआईएस और डोजियर'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition-all cursor-pointer font-serif ${
            activeSubTab === 'analytics' 
              ? 'border-[#0f2b5c] text-[#0f2b5c] bg-slate-50 font-extrabold' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BarChart3 className="h-4 w-4 text-emerald-700" />
          <span>{language === 'en' ? 'Registry Analytics & Interoperability' : 'रजिस्ट्री विश्लेषण'}</span>
        </button>

        {user && (user.role === 'ministry' || user.role === 'district') && (
          <button
            onClick={() => setActiveSubTab('grievances')}
            className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition-all cursor-pointer font-serif ${
              activeSubTab === 'grievances' 
                ? 'border-[#0f2b5c] text-[#0f2b5c] bg-slate-50 font-extrabold' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldAlert className="h-4 w-4 text-rose-600" />
            <span>{language === 'en' ? 'Citizen Grievances & Objections' : 'नागरिक आपत्तियां'}</span>
            {grievances.filter(g => g.status === 'PENDING').length > 0 && (
              <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
            )}
          </button>
        )}
      </div>

      {/* ── Sub-Tab 1: GIS Visualizer & Selected Project Dossier ── */}
      {activeSubTab === 'gis' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 animate-fadeIn">
          
          {/* GIS Map Panel (Left 2 cols) */}
          <div className="xl:col-span-2 space-y-2">
            <LandGISMap 
              proposals={filteredProposals} 
              selectedProject={activeSelectedProject} 
              setSelectedProject={setSelectedProject} 
            />
          </div>

          {/* Selected Project Dossier (Right col) */}
          <div className="bg-white border border-slate-300 rounded-md p-5 space-y-4 flex flex-col justify-between select-none">
            <div>
              <div className="flex justify-between items-start border-b border-slate-200 pb-3">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200">
                      {activeSelectedProject?.id}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      {activeSelectedProject?.state}
                    </span>
                  </div>
                  <h3 className="font-bold text-[#0f2b5c] text-sm leading-snug font-serif">{activeSelectedProject?.title}</h3>
                  <span className="text-[11px] text-slate-600 font-medium block mt-0.5">{activeSelectedProject?.agency}</span>
                </div>
                <div>{activeSelectedProject && getStatusBadge(activeSelectedProject.status)}</div>
              </div>

              {activeSelectedProject ? (
                <div className="mt-3 space-y-3">
                  <div className="border border-slate-200 rounded text-xs divide-y divide-slate-200">
                    <div className="flex justify-between p-2 bg-slate-50/70">
                      <span className="text-slate-500 font-medium">{t('reqArea')}</span>
                      <strong className="text-slate-800 font-serif">{activeSelectedProject.areaRequired} ha</strong>
                    </div>
                    <div className="flex justify-between p-2">
                      <span className="text-slate-500 font-medium">{t('acqProgress')}</span>
                      <strong className="text-emerald-700 font-serif font-bold">{activeSelectedProject.areaAcquired} ha</strong>
                    </div>
                    <div className="flex justify-between p-2 bg-slate-50/70">
                      <span className="text-slate-500 font-medium">{t('assessedBudget')}</span>
                      <strong className="text-slate-800 font-serif">₹{activeSelectedProject.budgetAssessed} Cr</strong>
                    </div>
                    <div className="flex justify-between p-2">
                      <span className="text-slate-500 font-medium">{t('paidComp')}</span>
                      <strong className="text-[#0f2b5c] font-serif font-bold">₹{activeSelectedProject.budgetDisbursed} Cr</strong>
                    </div>
                    <div className="flex justify-between p-2 bg-slate-50/70">
                      <span className="text-slate-500 font-medium">{t('affectedFamilies')}</span>
                      <span className="text-slate-700 font-bold">{activeSelectedProject.affectedFamilies} Families</span>
                    </div>
                    <div className="flex justify-between p-2">
                      <span className="text-slate-500 font-medium">{t('rrProgressTitle')}</span>
                      <span className="text-orange-700 font-bold">{activeSelectedProject.rrProgress}% Resettled</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent('navigate-tab', { detail: 'dispatch' }));
                    }}
                    className="w-full mt-2 bg-[#0f2b5c] hover:bg-[#0c224a] text-white py-2.5 px-3 rounded text-xs font-bold font-serif flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Send className="h-3.5 w-3.5 text-[#ea580c]" />
                    <span>Issue Section 11 Survey Notice</span>
                  </button>
                </div>
              ) : (
                <div className="py-8 text-center text-slate-400 text-xs font-bold">
                  No project selected.
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* ── Sub-Tab 2: Interoperability Hub & Analytics ── */}
      {activeSubTab === 'analytics' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Interoperability API Status */}
          <div className="bg-white border border-slate-300 rounded-md p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Activity className="h-4.5 w-4.5 text-emerald-600" />
                <h3 className="font-bold text-[#0f2b5c] text-sm font-serif">
                  {t('apiHubTitle')}
                </h3>
              </div>
              <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded border border-slate-200">
                RESTful JSON API Handshake
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">BHOOMI (State Records)</span>
                <strong className="text-emerald-700 font-bold block">{t('bhoomiStatus').replace('BHOOMI (State Records): ', '')}</strong>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Bhunaksha (Cadastral GIS)</span>
                <strong className="text-emerald-700 font-bold block">{t('bhunakshaStatus').replace('Bhunaksha (Cadastral GIS): ', '')}</strong>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">PM GatiShakti NMP</span>
                <strong className="text-emerald-700 font-bold block">{t('gatiStatus').replace('PM GatiShakti NMP: ', '')}</strong>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">PFMS (Escrow Payments)</span>
                <strong className="text-emerald-700 font-bold block">{t('pfmsStatus').replace('PFMS (Escrow Payments): ', '')}</strong>
              </div>
            </div>
          </div>

          {/* Recharts Analytics Component */}
          <div className="bg-white border border-slate-300 rounded-md p-5">
            <h3 className="font-bold text-[#0f2b5c] text-sm font-serif border-b border-slate-200 pb-3 mb-4">
              National Infrastructure Corridor Acquisition Metrics
            </h3>
            <AnalyticsCharts proposals={proposals} />
          </div>

        </div>
      )}

      {/* ── Sub-Tab 3: Citizen Grievances & Objections ── */}
      {activeSubTab === 'grievances' && user && (user.role === 'ministry' || user.role === 'district') && (
        <div className="bg-white border border-slate-300 rounded-md overflow-hidden animate-fadeIn select-none">
          <div className="bg-slate-50 px-5 py-4 border-b border-slate-200 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-[#0f2b5c] text-sm font-serif">
                Live Citizen Grievance & Dispute Register
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Official citizen objection submissions filed under Section 15 of RFCTLARR Act 2013
              </p>
            </div>
            <button
              onClick={fetchGrievances}
              disabled={grievanceLoading}
              className="px-3 py-1.5 rounded border border-slate-300 bg-white text-slate-700 hover:text-[#0f2b5c] text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${grievanceLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          <div className="p-5">
            {grievances.length === 0 ? (
              <div className="text-center py-12 space-y-2">
                <MessageSquareWarning className="h-10 w-10 text-slate-300 mx-auto" />
                <p className="text-xs font-bold text-slate-500 font-serif">
                  No citizen objections active in the current queue.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {grievances.map((g, idx) => (
                  <div key={g.id || idx} className="border border-slate-250 rounded-md p-4 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#0f2b5c] font-serif">{g.reference_number}</span>
                          <span className="text-[9.5px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                            {g.objection_type}
                          </span>
                          <span className="text-[9.5px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                            {g.status}
                          </span>
                        </div>
                        <div className="text-xs text-slate-600 font-medium">
                          Plot: <strong className="text-slate-800">{g.parcel_number}</strong> • Landowner: <strong className="text-slate-800">{g.landowner_name}</strong>
                        </div>
                        <p className="text-xs text-slate-700 mt-1.5 leading-relaxed">{g.description}</p>
                      </div>
                      <div className="text-right text-[10px] font-mono text-slate-400 flex-shrink-0">
                        {g.created_at ? new Date(g.created_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : ''}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
