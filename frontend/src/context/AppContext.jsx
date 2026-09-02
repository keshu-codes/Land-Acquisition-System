import React, { createContext, useState, useEffect } from 'react';
import { translations } from './Translation';

export const AppContext = createContext();

const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://land-acquisition-system.onrender.com/api/v1";

// Helper coordinates map to give projects visual boundaries on the map based on their state/district
const getFallbackCoordinates = (state, id) => {
  const seed = id % 5;
  switch (state) {
    case "Maharashtra":
      return [
        { lat: 19.2 + (seed * 0.05), lng: 72.9 + (seed * 0.05) },
        { lat: 19.25 + (seed * 0.05), lng: 73.0 + (seed * 0.05) },
        { lat: 19.27 + (seed * 0.05), lng: 73.05 + (seed * 0.05) },
        { lat: 19.22 + (seed * 0.05), lng: 72.92 + (seed * 0.05) }
      ];
    case "West Bengal":
      return [
        { lat: 23.3 + (seed * 0.05), lng: 86.3 + (seed * 0.05) },
        { lat: 23.35 + (seed * 0.05), lng: 86.4 + (seed * 0.05) },
        { lat: 23.38 + (seed * 0.05), lng: 86.42 + (seed * 0.05) },
        { lat: 23.32 + (seed * 0.05), lng: 86.32 + (seed * 0.05) }
      ];
    case "Madhya Pradesh":
      return [
        { lat: 24.5 + (seed * 0.05), lng: 81.3 + (seed * 0.05) },
        { lat: 24.55 + (seed * 0.05), lng: 81.4 + (seed * 0.05) },
        { lat: 24.58 + (seed * 0.05), lng: 81.42 + (seed * 0.05) },
        { lat: 24.52 + (seed * 0.05), lng: 81.32 + (seed * 0.05) }
      ];
    case "Odisha":
      return [
        { lat: 20.2 + (seed * 0.05), lng: 85.8 + (seed * 0.05) },
        { lat: 20.25 + (seed * 0.05), lng: 85.9 + (seed * 0.05) },
        { lat: 20.28 + (seed * 0.05), lng: 85.92 + (seed * 0.05) },
        { lat: 20.22 + (seed * 0.05), lng: 85.82 + (seed * 0.05) }
      ];
    case "Uttar Pradesh":
      return [
        { lat: 26.8 + (seed * 0.05), lng: 80.9 + (seed * 0.05) },
        { lat: 26.85 + (seed * 0.05), lng: 81.0 + (seed * 0.05) },
        { lat: 26.88 + (seed * 0.05), lng: 81.05 + (seed * 0.05) },
        { lat: 26.82 + (seed * 0.05), lng: 80.92 + (seed * 0.05) }
      ];
    case "Tamil Nadu":
      return [
        { lat: 12.9 + (seed * 0.05), lng: 80.1 + (seed * 0.05) },
        { lat: 12.95 + (seed * 0.05), lng: 80.2 + (seed * 0.05) },
        { lat: 12.98 + (seed * 0.05), lng: 80.25 + (seed * 0.05) },
        { lat: 12.92 + (seed * 0.05), lng: 80.12 + (seed * 0.05) }
      ];
    default:
      return [
        { lat: 22.9734, lng: 78.6569 },
        { lat: 22.9834, lng: 78.6669 },
        { lat: 22.9934, lng: 78.6769 },
        { lat: 22.9634, lng: 78.6469 }
      ];
  }
};

const generateTimeline = (currentStatus, dbDate) => {
  const dateStr = dbDate || new Date().toISOString().split('T')[0];
  const stages = [
    { stage: "Proposal Submitted", desc: "Project acquisition intent filed and database records created.", date: dateStr, role: "Central Ministry" },
    { stage: "GIS Verification", desc: "State Land Registry node verifies parcel boundaries and checks overlap.", date: "", role: "State Government" },
    { stage: "Section 11 Notification", desc: "District Collector publishes Gazette notification. Citizen disputes open.", date: "", role: "District Collector" },
    { stage: "Award Declared", desc: "Valuation of land and structures locked. DBT Escrow is populated.", date: "", role: "District Collector" },
    { stage: "Possession Handover", desc: "Surveyor registers site clearance. Title deeds Vesting Certificate released.", date: "", role: "Field Surveyor" }
  ];

  const statusIndex = stages.findIndex(s => s.stage === currentStatus);
  return stages.map((s, idx) => ({
    ...s,
    status: idx <= statusIndex ? "completed" : "pending",
    completed: idx <= statusIndex,
    title: s.stage,
    date: idx <= statusIndex ? (s.date || dateStr) : ""
  }));
};

export const AppContextProvider = ({ children }) => {
  const [proposals, setProposals] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    total_area_required: 0.0,
    total_area_acquired: 0.0,
    total_budget_assessed: 0.0,
    total_budget_disbursed: 0.0,
    acquisition_progress: 0.0
  });

  const [blockchainLog, setBlockchainLog] = useState([
    { block: 104502, txHash: "0x3a2d5f8b9e1c4a0f7d6e8b2c5a1d4f0e9b8c7a6e", timestamp: "2026-08-25 14:32:10", action: "GIS_VERIFICATION", details: "GIS boundary mapping confirmed for Mumbai Highway Package.", signer: "0xStateSurveyor_MH", verified: true },
    { block: 104501, txHash: "0x7d6e8b2c5a1d4f0e9b8c7a6e3a2d5f8b9e1c4a0f", timestamp: "2026-08-25 11:15:45", action: "SUBMIT_PROPOSAL", details: "Central Ministry registered Delhi-Mumbai Expressway.", signer: "0xMinistrySuperAdmin", verified: true }
  ]);

  const [selectedRole, setSelectedRole] = useState(() => {
    try {
      const saved = localStorage.getItem('nlams_user');
      return saved ? JSON.parse(saved).role : "citizen";
    } catch {
      return "citizen";
    }
  });
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [backendError, setBackendError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Authentication State — Enforce Mandatory Official Sign-In on every visit
  const [currentUser, setCurrentUser] = useState(null);
  const [authToken, setAuthToken] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginModalMode, setLoginModalMode] = useState('authority');

  const openLoginModal = (mode = 'authority') => {
    setLoginModalMode(mode);
    setShowLoginModal(true);
  };

  // Synchronize selectedRole with logged-in user role
  useEffect(() => {
    if (currentUser && currentUser.role) {
      setSelectedRole(currentUser.role);
    } else {
      setSelectedRole("citizen");
    }
  }, [currentUser]);

  const authHeader = () => {
    const headers = { 'X-NLAMS-API-Key': 'sih_nlams_secret_2026' };
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    return headers;
  };

  const login = async (username, password) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!res.ok) return false;

      const data = await res.json();
      const token = data.access_token;
      const user = data.user;

      localStorage.setItem('nlams_token', token);
      localStorage.setItem('nlams_user', JSON.stringify(user));

      setAuthToken(token);
      setCurrentUser(user);
      setSelectedRole(user.role);
      setShowLoginModal(false);

      addNotification(`Authenticated successfully as ${user.full_name} (${user.role.toUpperCase()})`, 'success');

      // Auto-route to tailored dashboard for the user's administrative level
      const defaultTab = user.role === 'ministry' ? 'dashboard' 
        : user.role === 'state' ? 'workflow' 
        : user.role === 'district' ? 'dispatch' 
        : user.role === 'surveyor' ? 'survey' 
        : 'web3';
      
      window.dispatchEvent(new CustomEvent('navigate-tab', { detail: defaultTab }));
      return true;
    } catch (e) {
      console.error("Login error:", e);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('nlams_token');
    localStorage.removeItem('nlams_user');
    setAuthToken("");
    setCurrentUser(null);
    setSelectedRole("ministry");
    addNotification("Logged out from system session.", "info");
    window.dispatchEvent(new CustomEvent('navigate-tab', { detail: 'home' }));
  };

  // Feature A: Multi-Lingual Support
  const [language, setLanguage] = useState('en');
  const t = (key) => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  // Feature B: SMS Notification Alert Simulator State
  const [activeSMS, setActiveSMS] = useState(null);
  const triggerSMS = (sender, message) => {
    setActiveSMS({
      id: Date.now(),
      sender,
      message,
      time: "Now"
    });
    // Auto hide after 9 seconds
    setTimeout(() => {
      setActiveSMS(null);
    }, 9000);
  };

  // Connect Web3 Wallet
  const connectWallet = () => {
    if (walletConnected) {
      setWalletConnected(false);
      setWalletAddress("");
      addNotification("Wallet disconnected.", "info");
    } else {
      setWalletConnected(true);
      const randAddr = "0x" + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join('');
      setWalletAddress(randAddr);
      addNotification("Web3 Wallet connected: " + randAddr.substring(0, 6) + "..." + randAddr.substring(38), "success");
    }
  };

  const addNotification = (message, type = "info") => {
    setNotifications(prev => [
      { id: Date.now(), message, type, time: "Just now" },
      ...prev.slice(0, 9)
    ]);
  };

  const logBlockchainTx = (action, details) => {
    const nextBlock = 105000 + Math.floor(Math.random() * 100);
    const randTx = "0x" + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('');
    const signer = walletConnected ? walletAddress.substring(0, 6) + "..." + walletAddress.substring(36) : "0xSysAdmin..." + Math.floor(Math.random()*9000+1000);
    
    const newTx = {
      block: nextBlock,
      txHash: randTx,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      action,
      details,
      signer,
      verified: true
    };
    setBlockchainLog(prev => [newTx, ...prev]);
  };

  // Fetch all projects and stats from the FastAPI server
  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch Projects
      const projRes = await fetch(`${API_BASE}/projects`);
      if (!projRes.ok) throw new Error("Failed to fetch projects");
      const dbProjects = await projRes.json();

      // Map backend schema to frontend expectation
      const mappedProposals = dbProjects.map(p => {
        // Calculate dynamic properties for demo purposes
        const budgetAssessed = p.budget || 100.0;
        const budgetDisbursed = p.status === "Possession Handover" 
          ? budgetAssessed 
          : (p.status === "Award Declared" ? budgetAssessed * 0.1 : 0.0);
        
        const areaRequired = p.total_area || 50.0;
        const areaAcquired = p.status === "Possession Handover" ? areaRequired : 0.0;
        
        const affectedFamilies = p.id * 15;
        const displacedFamilies = p.status === "Possession Handover" ? p.id * 5 : 0;
        const rrProgress = p.status === "Possession Handover" ? 100 : (p.status === "Award Declared" ? 25 : 0);

        const dbDate = p.created_at ? p.created_at.split('T')[0] : "";

        return {
          id: `PRJ-${String(p.id).padStart(3, '0')}`,
          title: p.name,
          agency: p.ministry || "National Highways Authority of India (NHAI)",
          state: p.state || "Maharashtra",
          district: p.district || "Default District",
          areaRequired,
          areaAcquired,
          budgetAssessed,
          budgetDisbursed,
          affectedFamilies,
          displacedFamilies,
          rrProgress,
          status: p.status || "Proposal Submitted",
          possessionStatus: p.status === "Possession Handover" ? "Completed" : "In Progress",
          coordinates: getFallbackCoordinates(p.state, p.id),
          timeline: generateTimeline(p.status || "Proposal Submitted", dbDate)
        };
      });

      setProposals(mappedProposals);

      // 2. Fetch Dashboard Statistics
      const statsRes = await fetch(`${API_BASE}/dashboard/stats`);
      if (statsRes.ok) {
        const stats = await statsRes.json();
        setDashboardStats(stats);
      }

      setBackendError(null);
    } catch (err) {
      console.error("Database connection failure:", err);
      setBackendError("Connection Refused. Ensure your FastAPI server is active on port 8000.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // API Call: Register New Proposal
  const createProposal = async (newProposal) => {
    try {
      const response = await fetch(`${API_BASE}/projects`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-NLAMS-API-Key': 'sih_nlams_secret_2026'
        },
        body: JSON.stringify({
          name: newProposal.title,
          ministry: newProposal.agency,
          sector: "Infrastructure",
          total_area: newProposal.areaRequired,
          budget: newProposal.budgetAssessed,
          state: newProposal.state,
          district: newProposal.district,
          status: "Proposal Submitted"
        })
      });

      if (!response.ok) throw new Error("Could not save proposal");
      
      addNotification(`New project registered successfully in SQLite database.`, "success");
      logBlockchainTx("SUBMIT_PROPOSAL", `Proposal registered on-chain for ${newProposal.title}`);
      
      // Trigger SMS Notification
      triggerSMS(
        "Govt-NLAMS",
        `ALERT: New land proposal registered for ${newProposal.title}. Area required: ${newProposal.areaRequired} Ha. Initiating state GIS routing verification.`
      );

      // Refresh
      await fetchAllData();
    } catch (err) {
      setBackendError("Database operation failed. Ensure the server is online.");
    }
  };

  // API Call: Update Proposal Status
  const advanceWorkflow = async (id, stageIndex, executorName) => {
    const dbId = parseInt(id.replace("PRJ-", ""));
    const stages = [
      "Proposal Submitted",
      "GIS Verification",
      "Section 11 Notification",
      "Award Declared",
      "Possession Handover"
    ];
    const newStatus = stages[stageIndex];
    
    // Get existing project detail
    const original = proposals.find(p => p.id === id);
    if (!original) return;

    try {
      const response = await fetch(`${API_BASE}/projects/${dbId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'X-NLAMS-API-Key': 'sih_nlams_secret_2026'
        },
        body: JSON.stringify({
          name: original.title,
          ministry: original.agency,
          sector: "Infrastructure",
          total_area: original.areaRequired,
          budget: original.budgetAssessed,
          state: original.state,
          district: original.district,
          status: newStatus
        })
      });

      if (!response.ok) throw new Error("Failed to update status");
      
      addNotification(`Project ${id} transitioned to stage: ${newStatus}`, "success");
      logBlockchainTx(newStatus.toUpperCase().replace(" ", "_"), `Status updated on-chain for ${id}`);
      
      // Trigger SMS alerts based on LARR milestones
      let smsMsg = "";
      if (newStatus === "GIS Verification") {
        smsMsg = `ALERT: GIS boundaries verified and locked for project ${id} (${original.title}). No spatial overlaps detected.`;
      } else if (newStatus === "Section 11 Notification") {
        smsMsg = `ALERT: Gazette Notice (Section 11) published for project ${id}. Citizen feedback hearings open in ${original.district} district office.`;
      } else if (newStatus === "Award Declared") {
        smsMsg = `ALERT: Land valuation finalized for project ${id}. Escrow fund of ₹${original.budgetAssessed} Cr initialized. Check DBT claims.`;
      } else if (newStatus === "Possession Handover") {
        smsMsg = `ALERT: Possession handover complete for ${id}. Title deeds Vesting Certificate released and registered on blockchain node.`;
      }
      
      if (smsMsg) {
        triggerSMS("Govt-LARR", smsMsg);
      }

      // Refresh
      await fetchAllData();
    } catch (err) {
      setBackendError("Database operation failed. Ensure the server is online.");
    }
  };

  // Local state update for compensation claims (can be extended to back-end later)
  const updateCompensationPayment = (id, amount) => {
    setProposals(prev => prev.map(p => {
      if (p.id !== id) return p;
      const updatedDisbursed = Math.min(p.budgetAssessed, p.budgetDisbursed + amount);
      
      addNotification(`Compensation payment of ₹${amount} Cr processed for ${p.id}`, "success");
      logBlockchainTx("DISBURSE_COMPENSATION", `Disbursed ₹${amount} Cr to landowner accounts for ${p.id}.`);

      // Trigger SMS Alert
      triggerSMS(
        "PFMS-Treasury",
        `ALERT: Direct Benefit Transfer (DBT) Escrow release of ₹${amount} Cr approved for landowner accounts associated with project ${id}.`
      );

      return {
        ...p,
        budgetDisbursed: updatedDisbursed
      };
    }));
  };

  const updateFieldSurvey = (id, locationStr, surveyDetails) => {
    addNotification(`Field survey submitted for ${id} in ${locationStr}`, "info");
    logBlockchainTx("FIELD_SURVEY_RECORD", `Field GPS verification logged for ${id}`);
    
    // Trigger SMS Alert
    triggerSMS(
      "Govt-Surveyor",
      `ALERT: GPS survey submission received for project ${id}. Geo-tagged boundary coordinates logged: ${locationStr}.`
    );
  };

  return (
    <AppContext.Provider value={{
      proposals,
      dashboardStats,
      blockchainLog,
      selectedRole,
      setSelectedRole,
      walletConnected,
      walletAddress,
      connectWallet,
      notifications,
      backendError,
      isLoading,
      createProposal,
      advanceWorkflow,
      updateCompensationPayment,
      updateFieldSurvey,
      refreshData: fetchAllData,
      language,
      setLanguage,
      t,
      activeSMS,
      setActiveSMS,
      triggerSMS,
      apiBase: API_BASE,
      user: currentUser,
      token: authToken,
      login,
      logout,
      showLoginModal,
      setShowLoginModal,
      loginModalMode,
      setLoginModalMode,
      openLoginModal,
      authHeader,
      addNotification,
      logBlockchainTx
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const AppProvider = AppContextProvider;
