import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  Shield, Key, User, Building2, Compass, Landmark, Lock, CheckCircle, 
  AlertCircle, ArrowRight, RefreshCw, X, Smartphone, MessageSquareCheck, UserCheck
} from 'lucide-react';

export default function Login({ onClose, isInline = false, onLoginSuccess }) {
  const { login, language, t, setShowLoginModal } = useContext(AppContext);

  // Dual Login Mode: 'authority' vs 'citizen'
  const [loginMode, setLoginMode] = useState('authority');

  // Authority Login State
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Citizen Mobile OTP Registration State
  const [mobileNo, setMobileNo] = useState("9876543210");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpError, setOtpError] = useState("");
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

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
      setShowLoginModal(false);
      if (onLoginSuccess) onLoginSuccess(username);
      if (onClose) onClose();
    } else {
      setErrorMsg("Invalid username or password. Please check your credentials.");
    }
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (mobileNo.length < 10) {
      setOtpError("Please enter a valid 10-digit mobile number.");
      return;
    }
    setOtpError("");
    setOtpSent(true);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 4) {
      setOtpError("Please enter the 6-digit OTP code sent to your mobile.");
      return;
    }

    setIsVerifyingOtp(true);
    setOtpError("");

    // Simulate OTP verification and log in as Citizen
    const success = await login('citizen', 'nlams2026');
    setIsVerifyingOtp(false);

    if (success) {
      setShowLoginModal(false);
      if (onLoginSuccess) onLoginSuccess('citizen');
      if (onClose) onClose();
    } else {
      setOtpError("Verification failed. Please try again.");
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
      setShowLoginModal(false);
      if (onLoginSuccess) onLoginSuccess(presetUser);
      if (onClose) onClose();
    }
  };

  const authorityAccounts = [
    {
      role: 'Central Ministry',
      user: 'ministry',
      pass: 'nlams2026',
      name: 'Dr. Rajesh Verma',
      dept: 'Ministry of Road Transport & Highways',
      color: 'border-[#12355B] bg-slate-50',
      badge: 'bg-[#12355B] text-white',
      icon: Landmark
    },
    {
      role: 'State GIS Officer',
      user: 'state',
      pass: 'nlams2026',
      name: 'Priya Sundaram',
      dept: 'State Remote Sensing Centre',
      color: 'border-emerald-600 bg-emerald-50/50',
      badge: 'bg-[#2F6B4F] text-white',
      icon: Compass
    },
    {
      role: 'District Magistrate',
      user: 'collector',
      pass: 'nlams2026',
      name: 'Amitabh Choudhury (IAS)',
      dept: 'Office of District Magistrate',
      color: 'border-sky-600 bg-sky-50/50',
      badge: 'bg-sky-700 text-white',
      icon: Building2
    },
    {
      role: 'Field Surveyor',
      user: 'surveyor',
      pass: 'nlams2026',
      name: 'Suresh Kumar',
      dept: 'Cadastral Survey Station #04',
      color: 'border-amber-600 bg-amber-50/50',
      badge: 'bg-[#C98B2E] text-white',
      icon: Shield
    }
  ];

  const wrapperClass = isInline 
    ? "w-full max-w-4xl mx-auto my-4 select-none animate-fadeIn font-sans"
    : "fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center z-[100] p-4 select-none animate-fadeIn font-sans";

  return (
    <div className={wrapperClass}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full border border-slate-300 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* ── DUAL LOGIN SELECTION TAB BAR ── */}
        <div className="bg-[#12355B] text-white p-3 sm:p-4 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-2">
            <img src="/emblem.jpg" alt="Emblem of India" className="h-8 w-auto object-contain bg-white rounded p-0.5" />
            <span className="font-extrabold text-sm sm:text-base font-serif">
              NLAMS Dual Portal Login
            </span>
          </div>

          <div className="flex bg-slate-900/60 p-1 rounded-xl border border-slate-700">
            <button
              type="button"
              onClick={() => setLoginMode('authority')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                loginMode === 'authority' 
                  ? 'bg-white text-[#12355B] shadow-sm' 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Landmark className="h-3.5 w-3.5" />
              <span>Authority Login</span>
            </button>

            <button
              type="button"
              onClick={() => setLoginMode('citizen')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                loginMode === 'citizen' 
                  ? 'bg-[#2F6B4F] text-white shadow-sm' 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Smartphone className="h-3.5 w-3.5" />
              <span>Citizen / Landowner</span>
            </button>
          </div>

          {!isInline && onClose && (
            <button onClick={onClose} className="text-slate-400 hover:text-white font-bold p-1">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* ── MODE 1: AUTHORITY LOGIN CONTENT ── */}
        {loginMode === 'authority' && (
          <div className="flex flex-col md:flex-row flex-1 overflow-y-auto">
            
            {/* Left Column: Official Presets */}
            <div className="w-full md:w-1/2 bg-slate-50 border-r border-slate-200 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-extrabold text-[#12355B] uppercase tracking-wider bg-blue-100 px-2.5 py-1 rounded-full border border-blue-200">
                    Government Officers & Cadre
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">1-Click Fast Login</span>
                </div>

                <h3 className="font-extrabold text-[#12355B] text-base font-serif mb-1">
                  Select Authority Department
                </h3>
                <p className="text-xs text-slate-500 font-semibold mb-4 leading-relaxed">
                  Authenticate with pre-configured official credentials for Ministry, State Collectorate, or Survey Station:
                </p>

                <div className="space-y-2.5">
                  {authorityAccounts.map((acc) => {
                    const Icon = acc.icon;
                    return (
                      <div 
                        key={acc.user}
                        onClick={() => quickLoginPreset(acc.user, acc.pass)}
                        className={`p-3 rounded-xl border ${acc.color} transition-all cursor-pointer flex items-center justify-between group hover:shadow-md`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-white shadow-xs border border-slate-200">
                            <Icon className="h-4 w-4 text-[#12355B]" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-xs text-slate-900">{acc.role}</span>
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${acc.badge}`}>{acc.user}</span>
                            </div>
                            <span className="text-[10px] text-slate-500 font-medium block">{acc.name} • {acc.dept}</span>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-[#12355B] group-hover:translate-x-1 transition-all" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Authority Password Sign-In Form */}
            <div className="w-full md:w-1/2 p-6 flex flex-col justify-between bg-white">
              <div>
                <div className="mb-4">
                  <h2 className="text-lg font-extrabold text-[#12355B] font-serif mb-1">
                    Official Authority Sign In
                  </h2>
                  <p className="text-xs text-slate-500 font-semibold">
                    Enter assigned government portal credentials to obtain an authorized JWT session token.
                  </p>
                </div>

                {errorMsg && (
                  <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 flex-shrink-0 text-rose-600" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase font-extrabold text-slate-500 mb-1">Government ID / Username *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. ministry or collector"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full text-xs font-bold border border-slate-300 rounded-xl p-2.5 pl-9 bg-slate-50 focus:outline-none focus:border-[#12355B]"
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
                        className="w-full text-xs font-bold border border-slate-300 rounded-xl p-2.5 pl-9 bg-slate-50 focus:outline-none focus:border-[#12355B]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#12355B] hover:bg-[#0b1f42] text-white py-3 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <RefreshCw className="h-4 w-4 animate-spin text-white" />
                    ) : (
                      <>
                        <Key className="h-4 w-4" />
                        <span>Authenticate Authority Session</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

          </div>
        )}

        {/* ── MODE 2: CITIZEN MOBILE OTP LOGIN & REGISTRATION ── */}
        {loginMode === 'citizen' && (
          <div className="p-6 sm:p-8 flex flex-col md:flex-row gap-8 items-center bg-white flex-1 overflow-y-auto">
            
            <div className="w-full md:w-1/2 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-[#2F6B4F] font-mono text-[11px] font-bold">
                <UserCheck className="h-3.5 w-3.5" />
                Landowner Registration & Verification
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#12355B] font-serif">
                Citizen Mobile Number Sign-In
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Registered landowners can log in using their Aadhaar-linked mobile number to inspect land survey numbers, estimated market circle rates, statutory 100% Solatium awards (Sec 30), and PFMS direct benefit payments.
              </p>

              <div className="p-4 bg-[#FAFAF7] border border-[#E8E1D5] rounded-2xl text-xs space-y-2">
                <strong className="block text-[#7A5C3E]">Why Register via Mobile OTP?</strong>
                <ul className="space-y-1 text-slate-600 list-disc pl-4 text-[11px]">
                  <li>Instant access to Form K Award Statements & Gazette Notices</li>
                  <li>Direct Benefit Transfer (DBT) payment verification</li>
                  <li>Submit Section 15 land objection petitions online</li>
                </ul>
              </div>
            </div>

            <div className="w-full md:w-1/2 bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-4">
              
              {otpError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-rose-600 flex-shrink-0" />
                  <span>{otpError}</span>
                </div>
              )}

              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-[11px] font-extrabold text-slate-700 mb-1">Enter 10-Digit Registered Mobile Number *</label>
                    <div className="relative">
                      <Smartphone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="tel"
                        maxLength={10}
                        required
                        placeholder="e.g. 9876543210"
                        value={mobileNo}
                        onChange={(e) => setMobileNo(e.target.value)}
                        className="w-full font-mono text-sm font-bold border border-slate-300 rounded-xl p-2.5 pl-9 bg-white focus:outline-none focus:border-[#2F6B4F]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#2F6B4F] hover:bg-emerald-800 text-white py-3 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageSquareCheck className="h-4 w-4" />
                    <span>Send Verification OTP</span>
                  </button>

                  <div className="text-center pt-2">
                    <span className="text-[11px] text-slate-400">Demo Landowner Preset: </span>
                    <button 
                      type="button" 
                      onClick={() => quickLoginPreset('citizen', 'nlams2026')}
                      className="text-[#2F6B4F] font-bold underline cursor-pointer hover:text-emerald-900"
                    >
                      Login as Rameshwar Patel (1-Click)
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                    <span>OTP sent to +91 {mobileNo}. Demo OTP code is <strong>789530</strong>.</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold text-slate-700 mb-1">Enter 6-Digit Verification OTP *</label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      placeholder="e.g. 789530"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="w-full font-mono text-center text-lg font-bold border border-slate-300 rounded-xl p-2 bg-white focus:outline-none focus:border-[#2F6B4F] tracking-widest"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isVerifyingOtp}
                    className="w-full bg-[#2F6B4F] hover:bg-emerald-800 text-white py-3 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isVerifyingOtp ? (
                      <RefreshCw className="h-4 w-4 animate-spin text-white" />
                    ) : (
                      <>
                        <Shield className="h-4 w-4" />
                        <span>Verify OTP & Access Citizen Dashboard</span>
                      </>
                    )}
                  </button>

                  <div className="text-center">
                    <button 
                      type="button" 
                      onClick={() => setOtpSent(false)}
                      className="text-xs text-slate-500 underline cursor-pointer"
                    >
                      Change Mobile Number
                    </button>
                  </div>
                </form>
              )}

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
