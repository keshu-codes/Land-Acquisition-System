import React, { useState, useContext, useEffect } from 'react';
import { AppProvider, AppContext } from './context/AppContext';
import Navbar from './components/Navbar';
import IndiaGovFooter from './components/IndiaGovFooter';
import SMSSimulator from './components/SMSSimulator';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import ProposalWorkflow from './pages/ProposalWorkflow';
import CompensationPortal from './pages/CompensationPortal';
import FieldSurvey from './pages/FieldSurvey';
import SurveyDispatch from './pages/SurveyDispatch';
import CitizenObjection from './pages/CitizenObjection';
import ParcelsDirectory from './pages/ParcelsDirectory';
import CompensationCalculatorPage from './pages/CompensationCalculatorPage';
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
        : 'web3';
      setActiveTab(defaultTab);
    }
  }, [user]);

  const renderActivePage = () => {
    // Before login, ONLY the 1st interface (Home) is accessible, unless direct citizen token link is provided
    if (!user && !(grievanceToken && activeTab === 'objection')) {
      return <Home setActiveTab={setActiveTab} />;
    }

    // Role-based route containment for Citizen
    if (user && user.role === 'citizen') {
      if (['dashboard', 'dispatch', 'survey'].includes(activeTab)) {
        return <CitizenObjection token={grievanceToken} />;
      }
    }

    switch (activeTab) {
      case 'home':
        return <Home setActiveTab={setActiveTab} />;
      case 'gis':
        return <ParcelsDirectory setActiveTab={setActiveTab} />;
      case 'dashboard':
        return <Dashboard />;
      case 'workflow':
        return <ProposalWorkflow />;
      case 'calc':
        return <CompensationCalculatorPage setActiveTab={setActiveTab} />;
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
      {/* Bhunaksha AP Header & Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Main Content Area */}
      <main className="flex-1">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-96 text-slate-400 gap-2">
            <RefreshCw className="h-8 w-8 animate-spin text-[#006653]" />
            <span className="text-xs font-semibold text-slate-600">Connecting to Bhunaksha AP Registry Server...</span>
          </div>
        ) : (
          renderActivePage()
        )}
      </main>

      {/* Footer on inner pages */}
      {(user || activeTab !== 'home') && <IndiaGovFooter />}
      
      {/* SMS Alert Simulator for Notice Notifications */}
      {user && <SMSSimulator />}

      {/* Official Officer & Citizen Login Modal */}
      {showLoginModal && (
        <Login 
          initialTab={typeof showLoginModal === 'string' ? showLoginModal : 'officer'} 
          onClose={() => setShowLoginModal(false)} 
        />
      )}
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


