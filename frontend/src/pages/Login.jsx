import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  Shield, Key, User, Building2, Compass, Landmark, Lock, AlertCircle, ArrowRight, RefreshCw, X
} from 'lucide-react';

export default function Login({ onClose, isInline = false, onLoginSuccess, initialTab = "officer" }) {
  const { login } = useContext(AppContext);

  const [activeLoginTab, setActiveLoginTab] = useState(initialTab || "officer"); // "officer" or "citizen"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Keep activeLoginTab in sync if initialTab changes
  React.useEffect(() => {
    if (initialTab) setActiveLoginTab(initialTab);
  }, [initialTab]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setErrorMsg("Please enter both username/ID and password.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    const success = await login(username, password);
    setIsSubmitting(false);
    if (success) {
      if (onLoginSuccess) onLoginSuccess(username);
      if (onClose) onClose();
    } else {
      setErrorMsg("Invalid credentials. Please verify your credentials or use the 1-Click Evaluation Presets.");
    }
  };

  const quickLoginPreset = async (presetUser, presetPass) => {
    setUsername(presetUser);
    setPassword(presetPass);
    setIsSubmitting(true);
    setErrorMsg("");

    const success = await login(presetUser, presetPass);
    setIsSubmitting(false);
    if (success) {
      if (onLoginSuccess) onLoginSuccess(presetUser);
      if (onClose) onClose();
    }
  };

  const authorityAccounts = [
    {
      level: 'Central Level',
      role: 'Central Ministry (NHAI/MoRTH)',
      user: 'ministry',
      pass: 'nlams2026',
      name: 'Ministry Planning Node',
      dept: 'Central Infrastructure Approvals & Budget',
      color: 'border-indigo-200 hover:border-indigo-600 bg-indigo-50/50',
      badge: 'bg-indigo-100 text-indigo-800',
      icon: Landmark,
      note: 'Central Level Approval'
    },
    {
      level: 'State Level',
      role: 'State GIS Directorate',
      user: 'state',
      pass: 'nlams2026',
      name: 'State GIS Verification Node',
      dept: 'Remote Sensing & Cadastral BhuNaksha',
      color: 'border-amber-200 hover:border-amber-600 bg-amber-50/50',
      badge: 'bg-amber-100 text-amber-800',
      icon: Compass,
      note: 'State Level GIS Audit'
    },
    {
      level: 'District Level',
      role: 'District Collector / Magistrate',
      user: 'collector',
      pass: 'nlams2026',
      name: 'District Magistrate Node',
      dept: 'District Gazette Notice & Award Issuance',
      color: 'border-emerald-200 hover:border-[#1b5e20] bg-emerald-50/50',
      badge: 'bg-emerald-100 text-[#1b5e20]',
      icon: Building2,
      note: 'District Level Approval'
    },
    {
      level: 'Field Level',
      role: 'Cadastral Field Surveyor',
      user: 'surveyor',
      pass: 'nlams2026',
      name: 'Field Survey Station',
      dept: 'GPS Geo-Tagging & Possession Handover',
      color: 'border-teal-200 hover:border-teal-600 bg-teal-50/50',
      badge: 'bg-teal-100 text-teal-800',
      icon: Shield,
      note: 'Field Level Possession'
    }
  ];

  const citizenAccounts = [
    {
      level: 'Public Citizen',
      role: 'Citizen & Landowner',
      user: 'citizen',
      pass: 'nlams2026',
      name: 'Rameshwar Patel / Anmol',
      dept: 'Registered Landholder (PLOT-OD-2026-9821)',
      color: 'border-orange-200 hover:border-[#ea580c] bg-orange-50/50',
      badge: 'bg-orange-100 text-orange-800',
      icon: User,
      note: 'Objections & Escrow DBT'
    }
  ];

  const displayedPresets = activeLoginTab === 'citizen' ? citizenAccounts : authorityAccounts;

  const wrapperClass = isInline 
    ? "w-full max-w-4xl mx-auto my-6 select-none animate-fadeIn font-sans"
    : "fixed inset-0 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center z-[100] p-4 select-none animate-fadeIn font-sans";

  return (
    <div className={wrapperClass}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full border border-slate-300 overflow-hidden flex flex-col md:flex-row max-h-[92vh]">
        
        {/* Left Section - Quick 1-Click Evaluation Presets */}
        <div className="w-full md:w-1/2 bg-slate-50 border-r border-slate-200 p-6 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold text-[#1b5e20] uppercase tracking-wider bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-200">
                NLAMS Presets
              </span>
              <span className="text-[10px] text-slate-400 font-semibold">1-Click Fast Login</span>
            </div>

            <h3 className="font-extrabold text-slate-800 text-base font-serif mb-1">
              Select Stakeholder Role
            </h3>
            <p className="text-xs text-slate-500 font-medium mb-3 leading-relaxed">
              Click any of the pre-configured profiles below to authenticate instantly:
            </p>

            <div className="space-y-2">
              {displayedPresets.map((acc) => {
                const Icon = acc.icon;
                return (
                  <button
                    key={acc.user}
                    onClick={() => quickLoginPreset(acc.user, acc.pass)}
                    disabled={isSubmitting}
                    className={`hover-pop w-full text-left p-2.5 rounded-xl border flex items-center justify-between cursor-pointer ${acc.color} group shadow-2xs`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-white border border-slate-200 shadow-xs group-hover:scale-110 transition-transform">
                        <Icon className="h-4 w-4 text-[#1b5e20]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-xs font-bold text-slate-800">{acc.name}</strong>
                          <span className={`text-[8px] font-extrabold px-1.5 py-0.2 rounded uppercase ${acc.badge}`}>
                            {acc.level || acc.role.split(' ')[0]}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-semibold block">{acc.dept}</span>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                      {acc.note}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 text-[10px] text-slate-500 flex justify-between items-center">
            <span>Default Password: <strong className="text-slate-700 font-mono">nlams2026</strong></span>
            <span>Collector Pass: <strong className="text-[#1b5e20] font-mono">SIH@12345</strong></span>
          </div>
        </div>

        {/* Right Section - Official Login Form with Citizen/Officer Tabs */}
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-between relative bg-white overflow-y-auto">
          {onClose && (
            <button
              onClick={onClose}
              className="btn-pop absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          )}

          <div>
            {/* Header Branding */}
            <div className="mb-4">
              <h2 className="text-2xl font-black text-amber-500 font-serif leading-none">
                NLAMS
              </h2>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mt-0.5">
                Survey, Settlements and Land Records
              </span>
            </div>

            {/* Login Tabs */}
            <div className="flex border-b border-slate-200 mb-4 gap-1">
              <button
                type="button"
                onClick={() => setActiveLoginTab("officer")}
                className={`btn-pop flex-1 py-2 text-xs font-bold text-center border-b-2 cursor-pointer flex items-center justify-center gap-1.5 rounded-t-lg ${
                  activeLoginTab === "officer" 
                    ? "border-[#1b5e20] text-[#1b5e20] bg-emerald-50/70" 
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <Building2 className="h-3.5 w-3.5" />
                <span>Officer / Department</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveLoginTab("citizen")}
                className={`btn-pop flex-1 py-2 text-xs font-bold text-center border-b-2 cursor-pointer flex items-center justify-center gap-1.5 rounded-t-lg ${
                  activeLoginTab === "citizen" 
                    ? "border-[#ea580c] text-[#ea580c] bg-orange-50/70" 
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <User className="h-3.5 w-3.5" />
                <span>Citizen / Landowner</span>
              </button>
            </div>

            <p className="text-xs text-slate-500 font-medium mb-4">
              {activeLoginTab === "officer" 
                ? "Enter your official user ID and password to access the acquisition workbench."
                : "Enter your registered citizen credentials or select the 1-Click Citizen preset."
              }
            </p>

            {errorMsg && (
              <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[10px] uppercase font-extrabold text-slate-500 mb-1">
                  {activeLoginTab === "officer" ? "Official User ID *" : "Citizen Username / Landholder ID *"}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder={activeLoginTab === "officer" ? "e.g. collector, ministry, state, surveyor" : "e.g. citizen"}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="hover-pop w-full text-xs font-bold border border-slate-300 rounded-xl p-2.5 pl-9 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1b5e20]/20 focus:border-[#1b5e20] shadow-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-extrabold text-slate-500 mb-1">Password *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="Enter password (default: nlams2026)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="hover-pop w-full text-xs font-bold border border-slate-300 rounded-xl p-2.5 pl-9 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1b5e20]/20 focus:border-[#1b5e20] shadow-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`btn-pop w-full text-white py-3 rounded-xl text-xs font-extrabold shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 ${
                  activeLoginTab === "officer" 
                    ? "bg-[#1b5e20] hover:bg-[#144a19]" 
                    : "bg-[#ea580c] hover:bg-[#c2410c]"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin text-amber-300" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <Key className="h-4 w-4" />
                    <span>{activeLoginTab === "officer" ? "Sign In as Officer" : "Sign In to Citizen Portal"}</span>
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400 font-semibold">
            <span>NLAMS Portal Authentication</span>
            <span>TLS 1.3 Verified</span>
          </div>
        </div>

      </div>
    </div>
  );
}


