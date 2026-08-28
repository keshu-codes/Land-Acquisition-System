import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import DashboardStats from '../components/DashboardStats';
import LandGISMap from '../components/LandGISMap';
import AnalyticsCharts from '../components/AnalyticsCharts';
import { 
  Search, Filter, Layers, Users, TrendingUp, AlertCircle, 
  FileCheck, CheckCircle, Download, Wifi, Database, Activity, Compass, RefreshCw
} from 'lucide-react';

export default function Dashboard() {
  const { proposals, addNotification, language, t, apiBase } = useContext(AppContext);
  const [selectedProject, setSelectedProject] = useState(proposals[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStateFilter, setSelectedStateFilter] = useState("All States");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("All Statuses");

  // ML inference states
  const [mlPrediction, setMlPrediction] = useState(null);
  const [mlLoading, setMlLoading] = useState(false);

  const states = [language === 'en' ? "All States" : "सभी राज्य", ...new Set(proposals.map(p => p.state))];
  const statuses = [language === 'en' ? "All Statuses" : "सभी स्थितियाँ", ...new Set(proposals.map(p => p.status))];

  // Filtering logic
  const filteredProposals = proposals.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesState = selectedStateFilter === "All States" || selectedStateFilter === "सभी राज्य" || p.state === selectedStateFilter;
    const matchesStatus = selectedStatusFilter === "All Statuses" || selectedStatusFilter === "सभी स्थितियाँ" || p.status === selectedStatusFilter;
    return matchesSearch && matchesState && matchesStatus;
  });

  // Keep selected project updated if it's filtered out
  const activeSelectedProject = filteredProposals.find(p => p.id === selectedProject?.id) || filteredProposals[0] || selectedProject;

  // Fetch ML predictions from backend endpoint
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
        return <span className="bg-indigo-50 text-[#0f2b5c] text-[10px] font-bold px-2.5 py-1 rounded-full border border-indigo-200 uppercase">{language === 'en' ? 'Proposal Submitted' : 'प्रस्ताव जमा किया गया'}</span>;
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

  // Real Export MIS CSV Report function
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

  // Static Fallbacks if API is offline
  const getPredictiveRiskBadge = (status, state) => {
    let risk = language === 'en' ? "Low" : "कम";
    let color = "bg-emerald-50 text-emerald-700 border-emerald-200";
    
    if (status === "Proposal Submitted") {
      risk = language === 'en' ? "Medium" : "मध्यम";
      color = "bg-orange-50 text-orange-700 border-orange-200";
    } else if (status === "GIS Verification") {
      if (state === "Maharashtra" || state === "Uttar Pradesh") {
        risk = language === 'en' ? "High" : "उच्च";
        color = "bg-rose-50 text-rose-700 border-rose-200";
      } else {
        risk = language === 'en' ? "Medium" : "मध्यम";
        color = "bg-orange-50 text-orange-700 border-orange-200";
      }
    } else if (status === "Section 11 Notification") {
      risk = language === 'en' ? "Medium" : "मध्यम";
      color = "bg-orange-50 text-orange-700 border-orange-200";
    } else if (status === "Possession Handover") {
      risk = language === 'en' ? "Minimal" : "न्यूनतम";
      color = "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
    
    return <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase ${color}`}>{risk}</span>;
  };

  const getPredictedCompletion = (status) => {
    switch (status) {
      case "Proposal Submitted": return language === 'en' ? "14 - 18 Months (Oct 2027)" : "14 - 18 महीने (अक्टूबर 2027)";
      case "GIS Verification": return language === 'en' ? "11 - 14 Months (July 2027)" : "11 - 14 महीने (जुलाई 2027)";
      case "Section 11 Notification": return language === 'en' ? "7 - 10 Months (April 2027)" : "7 - 10 महीने (अप्रैल 2027)";
      case "Award Declared": return language === 'en' ? "3 - 5 Months (Jan 2027)" : "3 - 5 महीने (जनवरी 2027)";
      case "Possession Handover": return language === 'en' ? "Completed (Title Dispatched)" : "पूर्ण (विलेख प्रेषित)";
      default: return language === 'en' ? "Unavailable" : "अनुपलब्ध";
    }
  };

  const getPredictedBottleneck = (status, state) => {
    switch (status) {
      case "Proposal Submitted":
        return language === 'en' 
          ? "Initial agency approval queue. Expected transit to State GIS Node: 45 days." 
          : "प्रारंभिक एजेंसी अनुमोदन कतार। राज्य जीआईएस नोड पारगमन समय: 45 दिन।";
      case "GIS Verification":
        return language === 'en' 
          ? `High parcel fragmentation in ${state || 'Maharashtra'}. Cadastral polygon overlap query generated.`
          : `${state || 'महाराष्ट्र'} में उच्च भूमि पार्सल विखंडन। ओवरलैप प्रश्न उत्पन्न।`;
      case "Section 11 Notification":
        return language === 'en' 
          ? "LARR Section 15 citizen hearings backlog. Estimated resolution: 90 days."
          : "LARR धारा 15 नागरिक सुनवाई बैकलॉग। अनुमानित समाधान: 90 दिन।";
      case "Award Declared":
        return language === 'en' 
          ? "Arbitrator escrow payment signing queue. Initial payouts verified."
          : "मध्यस्थ एस्क्रो भुगतान हस्ताक्षर कतार। प्रारंभिक संवितरण सत्यापित।";
      case "Possession Handover":
        return language === 'en' ? "Fully handed over. No bottleneck flags." : "पूरी तरह से सौंप दिया गया। कोई बाधा नहीं।";
      default:
        return language === 'en' ? "No warnings active." : "कोई चेतावनी सक्रिय नहीं।";
    }
  };

  const renderMLBadge = (riskValue) => {
    let color = "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (riskValue === "High") {
      color = "bg-rose-50 text-rose-700 border-rose-200";
    } else if (riskValue === "Medium") {
      color = "bg-orange-50 text-orange-700 border-orange-200";
    }
    const label = language === 'en' ? riskValue : (riskValue === 'High' ? 'उच्च' : (riskValue === 'Medium' ? 'मध्यम' : 'कम'));
    return <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase ${color}`}>{label}</span>;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 font-sans">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-[#0f2b5c] tracking-tight font-serif">{t('monitoringDashboard')}</h1>
          <p className="text-xs text-slate-500 font-semibold">{t('monitoringSub')}</p>
        </div>
        
        {/* Filters & Export */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={exportMISReport}
            className="flex items-center gap-1.5 bg-[#0f2b5c] hover:bg-[#0c224a] text-white px-4 py-2 rounded-lg text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            {t('exportReport')}
          </button>

          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white border border-slate-200 text-slate-705 text-xs rounded-lg pl-9 pr-4 py-2 w-48 focus:outline-none focus:ring-2 focus:ring-[#0f2b5c]/10 focus:border-[#0f2b5c] font-bold transition-all shadow-sm"
            />
          </div>

          <div className="flex items-center bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 gap-1.5 shadow-sm">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={selectedStateFilter}
              onChange={(e) => setSelectedStateFilter(e.target.value)}
              className="bg-transparent text-slate-705 text-xs font-bold focus:outline-none border-none cursor-pointer"
            >
              {states.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="flex items-center bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 gap-1.5 shadow-sm">
            <Layers className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="bg-transparent text-slate-705 text-xs font-bold focus:outline-none border-none cursor-pointer"
            >
              {statuses.map(s => <option key={s} value={s}>{s.replace('Notification', 'Notified')}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <DashboardStats />

      {/* Interoperability API Integration status */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3 border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-1.5">
            <Activity className="h-4 w-4 text-emerald-600 animate-pulse" />
            <span className="font-bold text-slate-700 text-xs tracking-wider uppercase font-serif">{t('apiHubTitle')}</span>
          </div>
          <span className="text-[9px] text-slate-450 font-bold bg-slate-50 border border-slate-200 px-2.5 py-0.5 rounded">{t('protocolLabel')}</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2.5 border-r border-slate-150 last:border-0 pr-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 flex-shrink-0 animate-ping" />
            <div>
              <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">BHOOMI (State Records)</span>
              <span className="text-[10px] text-slate-655 font-bold">{t('bhoomiStatus').replace('BHOOMI (State Records): ', '')}</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5 border-r border-slate-150 last:border-0 pr-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 flex-shrink-0" />
            <div>
              <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Bhunaksha (Cadastral GIS)</span>
              <span className="text-[10px] text-slate-655 font-bold">{t('bhunakshaStatus').replace('Bhunaksha (Cadastral GIS): ', '')}</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5 border-r border-slate-150 last:border-0 pr-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 flex-shrink-0" />
            <div>
              <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">PM GatiShakti NMP</span>
              <span className="text-[10px] text-slate-655 font-bold">{t('gatiStatus').replace('PM GatiShakti NMP: ', '')}</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5 last:border-0 pr-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 flex-shrink-0" />
            <div>
              <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">PFMS (Escrow Payments)</span>
              <span className="text-[10px] text-slate-655 font-bold">{t('pfmsStatus').replace('PFMS (Escrow Payments): ', '')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* GIS Mapping Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Map Column */}
        <div className="xl:col-span-2 space-y-2">
          <div className="flex justify-between items-center px-1">
            <h3 className="font-bold text-[#0f2b5c] text-xs uppercase tracking-wider flex items-center gap-1.5 font-serif">
              <Compass className="h-4.5 w-4.5" />
              {t('gisVisualizer')}
            </h3>
            <span className="text-[10px] text-slate-400 font-bold">{t('gisSub')}</span>
          </div>
          <LandGISMap 
            proposals={filteredProposals} 
            selectedProject={activeSelectedProject} 
            setSelectedProject={setSelectedProject} 
          />
        </div>

        {/* Selected Project Details Pane */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div className="pr-1">
                <span className="text-[9px] font-bold text-slate-400 tracking-wider block">{activeSelectedProject?.id}</span>
                <h3 className="font-bold text-slate-800 text-sm leading-snug mt-0.5 font-serif">{activeSelectedProject?.title}</h3>
                <span className="text-[10px] text-[#0f2b5c] font-bold block mt-1">{activeSelectedProject?.agency}</span>
              </div>
              {activeSelectedProject && getStatusBadge(activeSelectedProject.status)}
            </div>

            {activeSelectedProject ? (
              <div className="mt-4 space-y-3.5">
                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block text-[8px] uppercase font-bold tracking-wider mb-0.5">{t('reqArea')}</span>
                    <strong className="text-slate-700 text-xs font-extrabold">{activeSelectedProject.areaRequired} ha</strong>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block text-[8px] uppercase font-bold tracking-wider mb-0.5">{t('acqProgress')}</span>
                    <strong className="text-emerald-700 text-xs font-extrabold">{activeSelectedProject.areaAcquired} ha</strong>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block text-[8px] uppercase font-bold tracking-wider mb-0.5">{t('assessedBudget')}</span>
                    <strong className="text-slate-700 text-xs font-extrabold">₹{activeSelectedProject.budgetAssessed} Cr</strong>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block text-[8px] uppercase font-bold tracking-wider mb-0.5">{t('paidComp')}</span>
                    <strong className="text-slate-700 text-xs font-extrabold">₹{activeSelectedProject.budgetDisbursed} Cr</strong>
                  </div>
                </div>

                {/* Families Affected */}
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-slate-450" />
                    <div>
                      <span className="text-slate-700 font-bold text-xs block">{t('affectedFamilies')}</span>
                      <span className="text-[9px] text-slate-400 font-bold">{t('affectedFamiliesSub')}</span>
                    </div>
                  </div>
                  <span className="font-extrabold text-slate-800 text-xs">{activeSelectedProject.affectedFamilies}</span>
                </div>

                {/* Rehabilitation & Resettlement Progress */}
                <div className="border border-slate-200 rounded-lg p-3 space-y-2 bg-slate-50/20">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-700 font-bold flex items-center gap-1.5 font-serif">
                      <TrendingUp className="h-3.5 w-3.5 text-orange-600" />
                      {t('rrProgressTitle')}
                    </span>
                    <strong className="text-orange-700">{activeSelectedProject.rrProgress}%</strong>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5">
                    <div 
                      className="bg-orange-500 h-1.5 rounded-full transition-all duration-500" 
                      style={{ width: `${activeSelectedProject.rrProgress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase">
                    <span>{t('displacedLabel')}: {activeSelectedProject.displacedFamilies}</span>
                    <span>{t('rrStatusLabel')}: {activeSelectedProject.rrProgress === 100 ? (language === 'en' ? "Completed" : "पूर्ण") : (language === 'en' ? "In Progress" : "प्रगति पर")}</span>
                  </div>
                </div>

                {/* Stage Timeline Overview */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2.5">
                  <h4 className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">{t('timelineHistory')}</h4>
                  <div className="space-y-1.5">
                    {activeSelectedProject.timeline.map((step, idx) => (
                      <div key={idx} className="flex justify-between items-center text-[10.5px]">
                        <span className="flex items-center gap-1.5 font-bold text-slate-655">
                          {step.completed ? (
                            <CheckCircle className="h-3 w-3 text-emerald-600" />
                          ) : (
                            <div className="h-3 w-3 rounded-full border border-slate-300" />
                          )}
                          {language === 'en' ? step.title : t(step.title)}
                        </span>
                        <span className="text-[9.5px] font-mono text-slate-400">{step.completed ? (step.date || 'Active') : 'Pending'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-slate-400 text-xs font-bold">
                {language === 'en' ? "No project selected." : "कोई परियोजना चयनित नहीं।"}
              </div>
            )}
          </div>

          {/* AI Predictive Risk Card - Real Machine Learning Inference */}
          {activeSelectedProject && (
            <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-[#0f2b5c] uppercase tracking-wider flex items-center gap-1 font-serif">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {t('riskIndex')}
                </span>
                {mlLoading ? (
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded border uppercase bg-slate-50 text-slate-400 border-slate-200 flex items-center gap-1">
                    <RefreshCw className="h-2.5 w-2.5 animate-spin" /> ML...
                  </span>
                ) : (
                  mlPrediction ? renderMLBadge(mlPrediction.risk) : getPredictiveRiskBadge(activeSelectedProject.status, activeSelectedProject.state)
                )}
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-[10.5px] space-y-2 font-semibold text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-400">{t('delayRisk')}:</span>
                  <span className="font-bold text-slate-800 uppercase tracking-wider">
                    {mlLoading ? (
                      <span className="text-slate-400">Loading...</span>
                    ) : (
                      mlPrediction 
                        ? (language === 'en' ? `${mlPrediction.risk} Delay Risk` : `${mlPrediction.risk === 'High' ? 'उच्च' : (mlPrediction.risk === 'Medium' ? 'मध्यम' : 'कम')} जोखिम`)
                        : (activeSelectedProject.status === "Possession Handover" ? (language === 'en' ? "None" : "कोई नहीं") : (language === 'en' ? "Medium Risk" : "मध्यम जोखिम"))
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{t('estCompletion')}:</span>
                  <span className="font-mono font-bold text-[#0f2b5c]">
                    {mlLoading ? (
                      "..."
                    ) : (
                      mlPrediction 
                        ? (mlPrediction.completion_months === 0 ? (language === 'en' ? 'Completed' : 'पूर्ण') : `${mlPrediction.completion_months} ${language === 'en' ? 'Months' : 'महीने'}`)
                        : getPredictedCompletion(activeSelectedProject.status)
                    )}
                  </span>
                </div>
                <div className="border-t border-slate-150 pt-2 text-[10px] text-slate-500 leading-normal">
                  <span className="block text-[8px] uppercase font-bold text-slate-400 mb-0.5">{t('primaryBottleneck')}</span>
                  {mlLoading ? (
                    "Analyzing spatial latency..."
                  ) : (
                    mlPrediction ? mlPrediction.bottleneck : getPredictedBottleneck(activeSelectedProject.status, activeSelectedProject.state)
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Analytics Recharts panel */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <div className="border-b border-slate-150 pb-3">
          <h3 className="font-bold text-[#0f2b5c] text-sm flex items-center gap-1.5 font-serif">
            <TrendingUp className="h-4.5 w-4.5" />
            {t('nationalAnalytics')}
          </h3>
        </div>
        <AnalyticsCharts proposals={proposals} />
      </div>

    </div>
  );
}
