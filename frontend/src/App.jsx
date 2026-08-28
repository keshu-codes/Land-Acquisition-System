import React, { useState, useContext } from 'react';
import { AppProvider, AppContext } from './context/AppContext';
import Navbar from './components/Navbar';
import SMSSimulator from './components/SMSSimulator';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import ProposalWorkflow from './pages/ProposalWorkflow';
import CompensationPortal from './pages/CompensationPortal';
import FieldSurvey from './pages/FieldSurvey';
import Login from './pages/Login';
import { AlertTriangle, RefreshCw } from 'lucide-react';

function AppContent() {
  const [activeTab, setActiveTab] = useState('home');
  const { backendError, isLoading, refreshData, showLoginModal, setShowLoginModal } = useContext(AppContext);

  if (backendError) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6 text-center select-none font-sans">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
          <div className="bg-rose-950/40 border border-rose-500/25 h-12 w-12 rounded-full flex items-center justify-center mx-auto text-rose-400 animate-pulse">
            <AlertTriangle className="h-6 w-6" />
          </div>
          
          <div className="space-y-1.5">
            <h2 className="text-base font-bold text-white tracking-tight">Database Connection Offline</h2>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              NLAMS is currently configured to read only from the live national registry. The portal cannot load without a live backend connection.
            </p>
          </div>

          <div className="bg-slate-950/80 rounded-lg p-3 text-[10px] text-rose-400 text-left font-mono break-all border border-slate-800">
            <strong>Error Details:</strong> {backendError}
          </div>

          <button
            onClick={() => refreshData()}
            className="w-full bg-sky-600 hover:bg-sky-500 text-white py-2.5 rounded-lg text-xs font-bold shadow flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Reconnect to Database Server
          </button>
        </div>
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
