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
    return () => window.removeEventListener('navigate-tab', handleNav);
  }, []);

  // Automatically route to role-tailored landing page upon authentication
  useEffect(() => {
    if (user && user.role) {
      const defaultTab = user.role === 'ministry' ? 'dashboard' 
        : user.role === 'state' ? 'workflow' 
        : user.role === 'district' ? 'dispatch' 
        : user.role === 'surveyor' ? 'survey' 
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
