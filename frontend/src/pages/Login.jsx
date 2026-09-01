import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  Shield, Key, User, Building2, Compass, Landmark, Lock, CheckCircle, AlertCircle, ArrowRight, RefreshCw, X
} from 'lucide-react';

export default function Login({ onClose, isInline = false, onLoginSuccess }) {
  const { login, language, t } = useContext(AppContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setErrorMsg("Please enter both username and password.");
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
      setErrorMsg("Invalid username or password. Please check your credentials.");
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

  const demoAccounts = [
    {
      role: 'Central Ministry',
      user: 'ministry',
      pass: 'nlams2026',
      name: 'Dr. Rajesh Verma',
      dept: 'Ministry of Road Transport & Highways',
      color: 'border-indigo-200 hover:border-indigo-600 bg-indigo-50/50',
      badge: 'bg-indigo-100 text-indigo-800',
      icon: Landmark
    },
    {
      role: 'State GIS Officer',
      user: 'state',
      pass: 'nlams2026',
      name: 'Priya Sundaram',
      dept: 'State Remote Sensing Centre',
      color: 'border-orange-200 hover:border-orange-600 bg-orange-50/50',
      badge: 'bg-orange-100 text-orange-800',
      icon: Compass
    },
    {
      role: 'District Magistrate',
      user: 'collector',
      pass: 'nlams2026',
      name: 'Amitabh Choudhury (IAS)',
      dept: 'Office of District Magistrate',
      color: 'border-sky-200 hover:border-sky-600 bg-sky-50/50',
      badge: 'bg-sky-100 text-sky-800',
      icon: Building2
    },
    {
      role: 'Field Surveyor',
      user: 'surveyor',
      pass: 'nlams2026',
      name: 'Suresh Kumar',
      dept: 'Cadastral Survey Station #04',
      color: 'border-emerald-200 hover:border-emerald-600 bg-emerald-50/50',
      badge: 'bg-emerald-100 text-emerald-800',
      icon: Shield
    },
    {
      role: 'Citizen / Landowner',
      user: 'citizen',
      pass: 'nlams2026',
      name: 'Rameshwar Patel',
      dept: 'Registered Landholder Portal',
      color: 'border-slate-200 hover:border-slate-600 bg-slate-50/50',
      badge: 'bg-slate-200 text-slate-800',
      icon: User
    }
  ];

  const wrapperClass = isInline 
    ? "w-full max-w-4xl mx-auto my-6 select-none animate-fadeIn font-sans"
    : "fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center z-[100] p-4 select-none animate-fadeIn font-sans";

  return (
    <div className={wrapperClass}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full border border-slate-300 overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        
        {/* Left Section - Quick Demo Login Cards */}
        <div className="w-full md:w-1/2 bg-slate-50 border-r border-slate-200 p-6 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold text-[#ea580c] uppercase tracking-wider bg-orange-100 px-2.5 py-1 rounded-full border border-orange-200">
                Hackathon Evaluator Preset
              </span>
              <span className="text-[10px] text-slate-400 font-semibold">1-Click Fast Login</span>
            </div>

            <h3 className="font-extrabold text-[#0f2b5c] text-base font-serif mb-1">
              Select Stakeholder Demo Profile
            </h3>
            <p className="text-xs text-slate-500 font-semibold mb-4 leading-relaxed">
              Click any of the pre-configured official accounts below to authenticate instantly with JWT bearer authorization:
            </p>

            <div className="space-y-2.5">
              {demoAccounts.map((acc) => {
                const Icon = acc.icon;
                return (
                  <button
                    key={acc.user}
                    onClick={() => quickLoginPreset(acc.user, acc.pass)}
                    disabled={isSubmitting}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${acc.color}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-sm">
                        <Icon className="h-4 w-4 text-[#0f2b5c]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-xs font-bold text-slate-800">{acc.name}</strong>
                          <span className={`text-[8px] font-extrabold px-2 py-0.5 rounded-full uppercase ${acc.badge}`}>
                            {acc.role}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">{acc.dept}</span>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-slate-700" />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 text-[10px] text-slate-400 font-mono">
            Default Password: <span className="font-bold text-slate-600">nlams2026</span>
          </div>
        </div>

        {/* Right Section - Manual Login Form */}
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-between relative bg-white">
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 hover:bg-slate-100 rounded-lg cursor-pointer transition-all"
            >
              <X className="h-5 w-5" />
            </button>
          )}

          <div>
            <div className="flex items-center gap-2 mb-2">
              <img src="/emblem.jpg" alt="Government of India Emblem" className="h-9 w-auto object-contain bg-white rounded-lg p-0.5 border border-slate-200 shadow-sm" />
              <span className="text-xs font-extrabold text-[#0f2b5c] uppercase tracking-wider font-serif">
                NLAMS Portal Authentication
              </span>
            </div>

            <h2 className="text-xl font-extrabold text-slate-850 font-serif mb-1">
              Official User Sign In
            </h2>
            <p className="text-xs text-slate-500 font-semibold mb-6">
              Enter your assigned government portal credentials to obtain an authorized JWT session token.
            </p>

            {errorMsg && (
              <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-extrabold text-slate-500 mb-1">Username / ID *</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. collector or ministry"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full text-xs font-bold border border-slate-250 rounded-xl p-2.5 pl-9 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#0f2b5c]/10 focus:border-[#0f2b5c] shadow-sm"
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
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-xs font-bold border border-slate-250 rounded-xl p-2.5 pl-9 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#0f2b5c]/10 focus:border-[#0f2b5c] shadow-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#0f2b5c] hover:bg-[#0c224a] text-white py-3 rounded-xl text-xs font-extrabold shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin text-orange-400" />
                    Verifying Credentials...
                  </>
                ) : (
                  <>
                    <Key className="h-4 w-4" />
                    Authenticate & Generate Token
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400 font-semibold">
            <span>Security: SHA-256 JWT Signed</span>
            <span>SIH 2026 Protected Node</span>
          </div>
        </div>

      </div>
    </div>
  );
}
