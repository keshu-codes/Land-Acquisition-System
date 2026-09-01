import React, { useState, useContext, useEffect } from 'react';
import { AppProvider, AppContext } from './context/AppContext';
import SidebarLayout from './components/SidebarLayout';
import SMSSimulator from './components/SMSSimulator';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import ProposalWorkflow from './pages/ProposalWorkflow';
import CompensationPortal from './pages/CompensationPortal';
import FieldSurvey from './pages/FieldSurvey';
import SurveyDispatch from './pages/SurveyDispatch';
import CitizenObjection from './pages/CitizenObjection';
import CompensationCalculatorPage from './pages/CompensationCalculatorPage';
import GISExplorerPage from './pages/GISExplorerPage';
import LegalJourneyPage from './pages/LegalJourneyPage';
import CitizenDashboard from './pages/CitizenDashboard';
import AgencyDashboard from './pages/AgencyDashboard';
import Login from './pages/Login';
import { RefreshCw } from 'lucide-react';

function AppContent() {
  const [activeTab, setActiveTab] = useState('home');
  const [grievanceToken, setGrievanceToken] = useState(null);
  const { user, isLoading, showLoginModal, setShowLoginModal } = useContext(AppContext);

  // Detect ?token= in URL for public grievance access and custom navigation events
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      setGrievanceToken(token);
      setActiveTab('objection');
    }

    const handleNav = (e) => {
      if (e.detail) {
        setActiveTab(e.detail);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    window.addEventListener('navigate-tab', handleNav);
    
    // Show login page immediately when user first opens the website
    const savedUser = localStorage.getItem('nlams_user');
    if (!savedUser && !token) {
      setShowLoginModal(true);
    }

    return () => window.removeEventListener('navigate-tab', handleNav);
  }, []);

  // Automatically route to role-tailored landing page upon authentication
  useEffect(() => {
    if (user && user.role) {
      const defaultTab = user.role === 'ministry' ? 'dashboard' 
        : user.role === 'state' ? 'workflow' 
        : user.role === 'district' ? 'dispatch' 
        : user.role === 'surveyor' ? 'survey' 
        : user.role === 'citizen' ? 'citizen-dashboard'
        : user.role === 'agency' ? 'agency-dashboard'
        : 'home';
      setActiveTab(defaultTab);
    }
  }, [user]);

  const renderActivePage = () => {
    if (grievanceToken || activeTab === 'objection') {
      return <CitizenObjection token={grievanceToken} />;
    }
    switch (activeTab) {
      case 'home':
        return <Home setActiveTab={setActiveTab} />;
      case 'citizen-dashboard':
        return <CitizenDashboard setActiveTab={setActiveTab} />;
      case 'agency-dashboard':
        return <AgencyDashboard setActiveTab={setActiveTab} />;
      case 'calc':
        return <CompensationCalculatorPage setActiveTab={setActiveTab} />;
      case 'gis':
        return <GISExplorerPage setActiveTab={setActiveTab} />;
      case 'journey':
        return <LegalJourneyPage setActiveTab={setActiveTab} />;
      case 'dashboard':
        return <Dashboard />;
      case 'workflow':
        return <ProposalWorkflow />;
      case 'web3':
        return <CompensationPortal />;
      case 'survey':
        return <FieldSurvey />;
      case 'dispatch':
        return <SurveyDispatch />;
      default:
        return <Home setActiveTab={setActiveTab} />;
    }
  };

  // ── Unauthenticated Visitors: Render ONLY the Official Government Login Portal ──
  if (!user && !grievanceToken) {
    return (
      <div className="min-h-screen bg-[#FAFAF7] flex flex-col justify-between font-sans text-slate-800">
        {/* Top Government Banner */}
        <header className="bg-[#12355B] text-white py-3 px-6 shadow-md border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/emblem.jpg" alt="Emblem of India" className="h-10 w-auto object-contain bg-white rounded-lg p-1 shadow-sm" />
            <div>
              <span className="text-[10px] text-amber-300 font-bold uppercase tracking-widest block font-serif leading-none">
                Government of India • Ministry of Rural Development
              </span>
              <h1 className="font-extrabold text-white text-base tracking-tight leading-tight mt-0.5">
                NLAMS — National Land Acquisition & Management System
              </h1>
            </div>
          </div>
          <span className="hidden sm:inline-flex bg-emerald-900/80 text-emerald-300 text-[10px] font-mono font-extrabold px-3 py-1 rounded-full border border-emerald-500/40">
            🔒 Secure Official Gateway
          </span>
        </header>

        {/* Centered Login Portal Card */}
        <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
          <Login isInline={true} />
        </main>

        {/* Footer */}
        <footer className="bg-slate-900 text-slate-400 py-3 px-6 text-center text-xs border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <span>© 2026 National Land Acquisition & Management System (NLAMS) • Government of India</span>
          <span className="font-mono text-[11px] text-amber-400">TLS 1.3 Encrypted • NIC Protected Node</span>
        </footer>
      </div>
    );
  }

  return (
    <SidebarLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-96 text-slate-400 gap-2">
          <RefreshCw className="h-8 w-8 animate-spin text-[#ea580c]" />
          <span className="text-xs font-semibold">Synchronizing with registry server...</span>
        </div>
      ) : (
        renderActivePage()
      )}
      <SMSSimulator />
      {showLoginModal && <Login onClose={() => setShowLoginModal(false)} />}
    </SidebarLayout>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
