import React, { useState, useContext, useEffect } from 'react';
import { AppProvider, AppContext } from './context/AppContext';
import Navbar from './components/Navbar';
import SMSSimulator from './components/SMSSimulator';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import ProposalWorkflow from './pages/ProposalWorkflow';
import CompensationPortal from './pages/CompensationPortal';
import FieldSurvey from './pages/FieldSurvey';
import SurveyDispatch from './pages/SurveyDispatch';
import CitizenObjection from './pages/CitizenObjection';
import Login from './pages/Login';
import { AlertTriangle, RefreshCw } from 'lucide-react';

function AppContent() {
  const [activeTab, setActiveTab] = useState('home');
  const [grievanceToken, setGrievanceToken] = useState(null);
  const { user, backendError, isLoading, refreshData, showLoginModal, setShowLoginModal } = useContext(AppContext);

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
    return () => window.removeEventListener('navigate-tab', handleNav);
  }, []);

  // Automatically route to role-tailored landing page upon authentication
  useEffect(() => {
    if (user && user.role) {
      const defaultTab = user.role === 'ministry' ? 'dashboard' 
        : user.role === 'state' ? 'workflow' 
        : user.role === 'district' ? 'dispatch' 
        : user.role === 'surveyor' ? 'survey' 
        : 'web3';
      setActiveTab(defaultTab);
    }
  }, [user]);

  // Mandatory Login Gate (Unless accessing public grievance link with token)
  if (!user && !grievanceToken) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col font-sans select-none">
        <header className="bg-white border-b border-slate-200 shadow-sm">
          <div className="h-1 w-full flex">
            <div className="bg-[#FF9933] h-full flex-1" />
            <div className="bg-[#FFFFFF] h-full flex-1" />
            <div className="bg-[#138808] h-full flex-1" />
          </div>
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-slate-50 border border-slate-300 flex items-center justify-center text-slate-800 shadow-inner">
                <span className="font-serif font-bold text-sm text-[#0f2b5c]">IND</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block font-serif">Government of India</span>
                <span className="font-extrabold text-[#0f2b5c] text-sm tracking-wide block leading-none font-serif mt-0.5">
                  National Land Acquisition & Management System (NLAMS)
                </span>
              </div>
            </div>
            <span className="text-[10px] bg-orange-50 border border-orange-200 text-orange-700 font-bold px-3 py-1 rounded-full uppercase">
              Official Access Gateway
            </span>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-4">
          <Login isInline={true} />
        </main>

        <footer className="bg-slate-900 border-t border-slate-800 text-slate-500 py-4 text-center text-xs">
          <p className="font-semibold text-slate-400">National Land Acquisition & Management System (NLAMS) — SIH 2026</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Strict Role-Based Access Control enforced for Central, State, and District administrative tiers.</p>
        </footer>
      </div>
    );
  }

  const renderActivePage = () => {
    switch (activeTab) {
      case 'home':
        return <Home setActiveTab={setActiveTab} />;
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
      case 'objection':
        return <CitizenObjection token={grievanceToken} />;
      default:
        return <Home setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Main Content Area */}
      <main className="flex-1">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-96 text-slate-400 gap-2">
            <RefreshCw className="h-8 w-8 animate-spin text-sky-500" />
            <span className="text-xs font-semibold">Synchronizing with registry server...</span>
          </div>
        ) : (
          renderActivePage()
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-500 py-6 text-center text-xs">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-semibold text-slate-400">National Land Acquisition & Management System (NLAMS) - Prototype</p>
          <p className="mt-1">Developed for Smart India Hackathon (SIH) 2026. Powered by Web3, GIS Spatial Ledger, and Automated Workflows.</p>
        </div>
      </footer>
      <SMSSimulator />
      {showLoginModal && <Login onClose={() => setShowLoginModal(false)} />}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
