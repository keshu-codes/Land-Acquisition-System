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

  // Public landing page is Home.jsx, or Objection page if ?token= exists
  const renderActivePage = () => {
    if (grievanceToken || activeTab === 'objection') {
      return <CitizenObjection token={grievanceToken} />;
    }
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
