import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import NLAMSLogo from '../components/NLAMSLogo';
import { 
  Landmark, MapPin, CheckCircle, FileText, ShieldCheck, 
  CreditCard, Scale, Clock, Sprout, Fingerprint, FileCheck, Building, 
  Printer, ArrowUpRight, Check, AlertCircle
} from 'lucide-react';

export default function CitizenDashboard({ setActiveTab }) {
  const { user, t } = useContext(AppContext);
  const [showObjectionModal, setShowObjectionModal] = useState(false);
  const [objectionSubmitted, setObjectionSubmitted] = useState(false);
  const [objectionType, setObjectionType] = useState('VALUATION');
  const [objectionDesc, setObjectionDesc] = useState('');

  // Digital & Physical Verification Modal State
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyStep, setVerifyStep] = useState(1);
  const [authMethod, setAuthMethod] = useState('esign');
  const [biometricScanning, setBiometricScanning] = useState(false);
  const [verifiedDocHash, setVerifiedDocHash] = useState(null);

  const citizenLand = {
    ownerName: user?.full_name || "Rameshwar Patel (Landowner)",
    plotNo: "PLOT-OD-2026-9821",
    khataNo: "Khordha / 9821 / 2026",
    surveyNo: "SN-9821",
    district: "Khordha District, Odisha",
    village: "Chandaka Revenue Circle, Tehsil Jatni",
    coordinates: "20.2961° N, 85.8245° E",
    
    // Land Area & Unit Valuations
    totalAreaAcres: "1.45 Acres",
    totalAreaSqM: "5,867.9 sq.meters",
    marketRatePerUnit: "₹29,31,034 / Acre",
    govtCompensationPerUnit: "₹58,62,068 / Acre",
    
    // Total Financial Award Breakdown
    baseMarketValuation: "₹42,50,000",
    solatiumBonus: "₹42,50,000",
    totalGovtAward: "₹85,00,000",
    
    // Soil & Fertility Attributes
    soilType: "Alluvial Black Cotton Soil",
    fertilityRating: "8.8 / 10 (High Fertility Rating)",
    irrigationStatus: "Double-Crop Perennial Irrigated Land",
    topography: "Class-1 Semi-Urban Agricultural Terrain",
    
    // Status & References
    paymentStatus: "PFMS Bank Transfer Escrow Approved",
    acquisitionStatus: "Section 11 (1) Gazette Notice Published",
    verificationStatus: "Verified by District Revenue Collectorate",
    transactionId: "TXN-2026-PFMS-982104",
    blockchainHash: "0x8f7a9821d4c2"
  };

  const handleObjectionSubmit = (e) => {
    e.preventDefault();
    if (!objectionDesc.trim()) return;
    setObjectionSubmitted(true);
    setTimeout(() => {
      setShowObjectionModal(false);
    }, 2200);
  };

  const handleBiometricAuth = () => {
    setBiometricScanning(true);
    setTimeout(() => {
      setBiometricScanning(false);
      setVerifiedDocHash("0x" + Math.random().toString(16).substring(2, 10) + "8821");
      setVerifyStep(3);
    }, 2000);
  };

  const handleESignAuth = () => {
    setVerifiedDocHash("0x" + Math.random().toString(16).substring(2, 10) + "9821");
    setVerifyStep(3);
  };

  return (
    <div className="max-w-4xl mx-auto py-4 sm:py-8 space-y-8 font-sans text-slate-800">
      
      {/* ── 1. UNCLUTTERED HERO HEADER CARD ── */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        
        {/* Top Government Strip */}
        <div className="bg-[#12355B] text-white px-6 sm:px-8 py-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <NLAMSLogo className="h-9 w-9" />
            <div>
              <span className="text-[10px] text-amber-300 font-bold uppercase tracking-widest block font-serif">
                Land Record & Compensation Statement
              </span>
              <h1 className="text-lg sm:text-xl font-extrabold text-white">
                {citizenLand.ownerName}
              </h1>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 font-mono text-[11px] font-bold">
            <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
            <span>Escrow Bank Transfer Approved</span>
          </div>
        </div>

        {/* Spacious Hero Figures */}
        <div className="p-6 sm:p-8 bg-[#FAF9F6] border-b border-stone-200 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
          
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">{t('totalArea') || 'Total Land Area'}</span>
            <span className="text-3xl font-black text-[#12355B] font-mono block">{citizenLand.totalAreaAcres}</span>
            <span className="text-xs text-slate-500 block">{citizenLand.totalAreaSqM}</span>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">{t('marketRate') || 'Est. Market Rate / Unit'}</span>
            <span className="text-xl font-extrabold text-[#7A5C3E] font-mono block">{citizenLand.marketRatePerUnit}</span>
            <span className="text-xs text-slate-500 block">District Collectorate Rate</span>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-bold text-[#2F6B4F] uppercase tracking-wider block">{t('totalPayable') || 'Total Award Payable'}</span>
            <span className="text-3xl font-black text-[#2F6B4F] font-mono block">{citizenLand.totalGovtAward}</span>
            <span className="text-xs text-emerald-700 font-bold block">Includes 100% Solatium (Sec 30)</span>
          </div>

        </div>

        {/* Quick Action Navigation Bar */}
        <div className="p-4 sm:p-6 bg-white flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => { setShowVerifyModal(true); setVerifyStep(1); }}
              className="bg-[#12355B] hover:bg-[#0b1f42] text-white text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer transition-all shadow-xs flex items-center gap-2"
            >
              <Fingerprint className="h-4 w-4 text-amber-400" />
              <span>{t('verificationTitle') || 'Digital E-Sign / Biometric Verification'}</span>
            </button>

            <button 
              onClick={() => setShowObjectionModal(true)}
              className="bg-[#C98B2E] hover:bg-amber-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer transition-all shadow-xs flex items-center gap-2"
            >
              <Scale className="h-4 w-4" />
              <span>{t('objectionTitle') || 'Submit Objection / Disagreement Petition'}</span>
            </button>
          </div>

          <button 
            onClick={() => setActiveTab('gis')}
            className="text-xs font-bold text-[#12355B] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <MapPin className="h-4 w-4 text-[#2F6B4F]" />
            <span>View Cadastral Map Coordinates</span>
          </button>
        </div>

      </div>

      {/* ── 2. UNCLUTTERED SOIL FERTILITY & LAND ATTRIBUTES DOSSIER ── */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-xs">
        
        <div className="flex items-center justify-between border-b border-stone-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-[#2F6B4F] border border-emerald-200">
              <Sprout className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#12355B]">
                Soil Classification & Fertility Assessment
              </h2>
              <p className="text-xs text-slate-500">Official agricultural revenue classification details</p>
            </div>
          </div>

          <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-3 py-1 rounded-full font-mono">
            Rating: 8.8 / 10
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Soil Classification</span>
            <strong className="text-sm font-semibold text-slate-900 block">{citizenLand.soilType}</strong>
            <p className="text-[11px] text-slate-500">High water-retention capacity; suitable for high-density agricultural yield.</p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Irrigation & Crop Capability</span>
            <strong className="text-sm font-semibold text-slate-900 block">{citizenLand.irrigationStatus}</strong>
            <p className="text-[11px] text-slate-500">Assessed multiplier: 2.0x for multi-crop perennial irrigated land.</p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Terrain & Topography</span>
            <strong className="text-sm font-semibold text-slate-900 block">{citizenLand.topography}</strong>
            <p className="text-[11px] text-slate-500">Flat elevation gradient with direct highway access road connection.</p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Govt Award Rate Offered / Unit</span>
            <strong className="text-sm font-extrabold text-[#2F6B4F] font-mono block">{citizenLand.govtCompensationPerUnit}</strong>
            <p className="text-[11px] text-slate-500">Includes mandatory 100% Solatium under RFCTLARR Act 2013 Sec 30.</p>
          </div>

        </div>

      </div>

      {/* ── 3. PARCEL IDENTIFICATION & REVENUE LOCATION ── */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-xs">
        
        <div className="flex items-center justify-between border-b border-stone-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-[#12355B] border border-blue-200">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#12355B]">
                Land Parcel & Revenue Record Identification
              </h2>
              <p className="text-xs text-slate-500">Registered khata ledger and survey boundary details</p>
            </div>
          </div>

          <span className="text-xs font-mono font-bold text-[#12355B]">
            {citizenLand.plotNo}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Khata & Survey Number</span>
            <strong className="text-sm font-mono text-slate-900 block">{citizenLand.khataNo} ({citizenLand.surveyNo})</strong>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Revenue Circle & Location</span>
            <strong className="text-sm text-slate-900 block">{citizenLand.village}, {citizenLand.district}</strong>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">GIS Geo-Coordinates</span>
            <strong className="text-sm font-mono text-[#2F6B4F] block">{citizenLand.coordinates}</strong>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Acquisition Milestone</span>
            <strong className="text-sm text-[#2F6B4F] block">{citizenLand.acquisitionStatus}</strong>
          </div>

        </div>

      </div>

      {/* ── 4. PHYSICAL JAN SEVA KENDRA ASSISTANCE KIOSK ── */}
      <div className="bg-[#FAF9F6] rounded-3xl border border-stone-300 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-[#12355B] text-white flex-shrink-0">
            <Building className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-extrabold text-[#12355B]">
              Physical Assistance at Jan Seva Kendra (CSC)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
              Need in-person support? Visit <strong>CSC Centre #8821 (Jatni Circle, 1.8 km away)</strong> for biometric thumb authentication, assisted objection filing, and certified document printouts.
            </p>
          </div>
        </div>

        <button 
          onClick={() => { setShowVerifyModal(true); setVerifyStep(1); }}
          className="bg-[#12355B] hover:bg-[#0b1f42] text-white text-xs font-bold px-5 py-3 rounded-xl cursor-pointer whitespace-nowrap shadow-xs flex-shrink-0"
        >
          Jan Seva Kendra Kiosk Mode
        </button>
      </div>

      {/* ── 5. DIGITAL VERIFICATION MODAL ── */}
      {showVerifyModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center z-[100] p-4 font-sans text-slate-800">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 border border-slate-300">
            
            <div className="flex justify-between items-center border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-[#2F6B4F]" />
                <h3 className="text-base font-extrabold text-[#12355B]">
                  Digital & Physical Land Verification
                </h3>
              </div>
              <button onClick={() => setShowVerifyModal(false)} className="text-slate-400 hover:text-slate-700 font-bold text-sm">✕</button>
            </div>

            {/* STEP 1: REVIEW DOCUMENT ONLINE */}
            {verifyStep === 1 && (
              <div className="space-y-5 text-xs">
                <div className="p-4 bg-[#FAF9F6] border border-stone-300 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center border-b border-stone-200 pb-2">
                    <strong className="text-[#12355B] text-sm font-serif">Form K Statutory Award & Possession Document</strong>
                    <span className="bg-blue-100 text-[#12355B] text-[10px] font-mono px-2 py-0.5 rounded font-bold">Sec 23 Award</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-slate-600 text-[11px] pt-1">
                    <div>Landowner: <strong>{citizenLand.ownerName}</strong></div>
                    <div>Plot Survey: <strong>{citizenLand.plotNo}</strong></div>
                    <div>Total Area: <strong>{citizenLand.totalAreaAcres}</strong></div>
                    <div>Govt Compensation: <strong>{citizenLand.totalGovtAward}</strong></div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button 
                    onClick={() => setShowVerifyModal(false)}
                    className="px-4 py-2.5 rounded-xl text-slate-600 bg-slate-100 font-bold hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => setVerifyStep(2)}
                    className="px-5 py-2.5 rounded-xl text-white bg-[#12355B] hover:bg-[#0b1f42] font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Proceed to Verification Authentication</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: CHOOSE E-SIGN VS BIOMETRIC THUMB AUTH */}
            {verifyStep === 2 && (
              <div className="space-y-5 text-xs">
                <p className="text-slate-600 font-medium">Select your preferred verification method below. If unable to provide a digital signature, use biometric thumb authentication:</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div 
                    onClick={() => setAuthMethod('esign')}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      authMethod === 'esign' ? 'border-[#12355B] bg-blue-50/50' : 'border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2 text-[#12355B] font-bold mb-1">
                      <FileCheck className="h-4 w-4" />
                      <span>Option A: Aadhaar E-Sign</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Provide digital signature via Aadhaar OTP link.</p>
                  </div>

                  <div 
                    onClick={() => setAuthMethod('biometric')}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      authMethod === 'biometric' ? 'border-[#2F6B4F] bg-emerald-50/50' : 'border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2 text-[#2F6B4F] font-bold mb-1">
                      <Fingerprint className="h-4 w-4" />
                      <span>Option B: Biometric Thumb Scan</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Use thumb scanner for assisted Jan Seva Kendra verification.</p>
                  </div>
                </div>

                {authMethod === 'biometric' ? (
                  <div className="pt-2">
                    <button 
                      onClick={handleBiometricAuth}
                      disabled={biometricScanning}
                      className="w-full bg-[#2F6B4F] hover:bg-emerald-800 text-white py-3 rounded-xl font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Fingerprint className={`h-4 w-4 ${biometricScanning ? 'animate-pulse text-amber-300' : ''}`} />
                      <span>{biometricScanning ? "Scanning Thumbprint Sensor..." : "Execute Biometric Thumb Authentication"}</span>
                    </button>
                  </div>
                ) : (
                  <div className="pt-2">
                    <button 
                      onClick={handleESignAuth}
                      className="w-full bg-[#12355B] hover:bg-[#0b1f42] text-white py-3 rounded-xl font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <FileCheck className="h-4 w-4 text-amber-400" />
                      <span>Generate Aadhaar E-Signature Certificate</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* STEP 3: VERIFIED & PRINTABLE HARD COPY + DIGITAL AUDIT HASH */}
            {verifyStep === 3 && (
              <div className="space-y-5 text-xs">
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 font-bold text-emerald-800 text-sm">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    <span>Land Document Successfully Verified & Certified!</span>
                  </div>
                  <p className="text-[11px] text-emerald-700">
                    A digital copy has been securely stored in the system audit registry. A printable hard copy is ready for distribution.
                  </p>
                </div>

                <div className="p-3.5 bg-[#FAF9F6] border border-stone-300 rounded-xl space-y-1">
                  <span className="text-slate-400 block text-[10px]">Secure SHA-256 System Audit Hash</span>
                  <span className="font-mono text-xs text-[#12355B] font-bold block">{verifiedDocHash}</span>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button 
                    onClick={() => window.print()}
                    className="px-4 py-2.5 rounded-xl text-[#12355B] bg-slate-100 hover:bg-slate-200 font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="h-4 w-4" />
                    <span>Print Certified Hard Copy</span>
                  </button>
                  <button 
                    onClick={() => setShowVerifyModal(false)}
                    className="px-5 py-2.5 rounded-xl text-white bg-[#12355B] hover:bg-[#0b1f42] font-bold shadow-xs cursor-pointer"
                  >
                    Done & Close
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ── 6. SECTION 15 OBJECTION MODAL ── */}
      {showObjectionModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center z-[100] p-4 font-sans text-slate-800">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-5 border border-slate-300">
            
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="text-base font-extrabold text-[#12355B] flex items-center gap-2">
                <Scale className="h-5 w-5 text-[#C98B2E]" />
                Section 15 Land Acquisition Objection Petition
              </h3>
              <button onClick={() => setShowObjectionModal(false)} className="text-slate-400 hover:text-slate-700 font-bold text-sm">✕</button>
            </div>

            {objectionSubmitted ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-emerald-600 flex-shrink-0" />
                <div>
                  <strong>Objection Petition Submitted Successfully!</strong>
                  <p className="text-[11px] text-emerald-700 mt-0.5">Reference ID: OBJ-2026-9821. Assigned to District Revenue Officer for statutory hearing.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleObjectionSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Grounds of Objection / Disagreement *</label>
                  <select 
                    value={objectionType}
                    onChange={(e) => setObjectionType(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-xl bg-slate-50 font-semibold focus:outline-none focus:border-[#12355B]"
                  >
                    <option value="VALUATION">Dispute Market Price / Unit Rate Offered</option>
                    <option value="BOUNDARY">Dispute Total Land Area or GIS Coordinates</option>
                    <option value="SOIL_CROPS">Dispute Soil Fertility Rating / Tree & Crop Damages</option>
                    <option value="TITLE">Dispute Ownership Title / Inheritance Claim</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Detailed Reasons for Objection *</label>
                  <textarea 
                    rows={4}
                    required
                    placeholder="Provide specific details regarding your dispute (e.g., market rate in adjacent survey numbers, soil fertility evidence, etc.)..."
                    value={objectionDesc}
                    onChange={(e) => setObjectionDesc(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-xl bg-slate-50 font-semibold focus:outline-none focus:border-[#12355B]"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
                  <button 
                    type="button"
                    onClick={() => setShowObjectionModal(false)}
                    className="px-4 py-2.5 rounded-xl text-slate-600 bg-slate-100 font-bold hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-5 py-2.5 rounded-xl text-white bg-[#C98B2E] hover:bg-amber-700 font-bold shadow-xs cursor-pointer"
                  >
                    Submit Statutory Objection
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
