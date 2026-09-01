import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  Landmark, MapPin, CheckCircle, FileText, AlertTriangle, ShieldCheck, 
  CreditCard, ExternalLink, ArrowUpRight, Scale, Clock, Download, Sprout
} from 'lucide-react';

export default function CitizenDashboard({ setActiveTab }) {
  const { user } = useContext(AppContext);
  const [showObjectionModal, setShowObjectionModal] = useState(false);
  const [objectionSubmitted, setObjectionSubmitted] = useState(false);
  const [objectionType, setObjectionType] = useState('VALUATION');
  const [objectionDesc, setObjectionDesc] = useState('');

  const citizenLand = {
    ownerName: user?.full_name || "Anmol (Landowner)",
    plotNo: "PLOT-OD-2026-9821",
    khataNo: "Khordha / 9821 / 2026",
    surveyNo: "SN-9821",
    district: "Khordha, Odisha",
    village: "Chandaka Revenue Circle, Tehsil Jatni",
    coordinates: "20.2961° N, 85.8245° E",
    
    // Land Area & Unit Valuations
    totalAreaAcres: "1.45 Acres",
    totalAreaSqM: "5,867.9 sq.m",
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
    acquisitionStatus: "Section 11 (1) Gazette Published",
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

  return (
    <div className="space-y-6 font-sans text-slate-800">
      
      {/* ── Header Banner ── */}
      <div className="bg-[#12355B] text-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-700 relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 font-mono text-[11px] uppercase tracking-wider">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            Verified Citizen & Landowner Personal Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Land Dossier: {citizenLand.ownerName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Inspect your land parcel area, per-unit circle rate, statutory 100% Solatium payout (RFCTLARR Sec 30), soil fertility rating, or submit an objection petition under Section 15.
          </p>
        </div>
      </div>

      {/* ── 1. EASILY SCANABLE LAND AREA & UNIT VALUATION CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card A: Total Land Area (Easily Scanable) */}
        <div className="bg-[#FAFAF7] border-2 border-[#12355B] p-5 rounded-2xl shadow-sm space-y-1">
          <span className="text-[11px] font-extrabold text-[#12355B] uppercase tracking-wider block">Total Land Area</span>
          <span className="text-2xl font-black text-[#12355B] font-mono block">{citizenLand.totalAreaAcres}</span>
          <span className="text-[10px] text-slate-500 font-semibold block">{citizenLand.totalAreaSqM}</span>
        </div>

        {/* Card B: Market Price Per Unit */}
        <div className="bg-[#FAFAF7] border border-[#E8E1D5] p-5 rounded-2xl shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Est. Market Rate / Unit</span>
          <span className="text-lg font-extrabold text-[#7A5C3E] font-mono block">{citizenLand.marketRatePerUnit}</span>
          <span className="text-[10px] text-slate-400 block">District Registrar Circle Rate</span>
        </div>

        {/* Card C: Govt Compensation Per Unit */}
        <div className="bg-[#FAFAF7] border border-[#E8E1D5] p-5 rounded-2xl shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-[#2F6B4F] uppercase tracking-wider block">Govt Award Offered / Unit</span>
          <span className="text-lg font-extrabold text-[#2F6B4F] font-mono block">{citizenLand.govtCompensationPerUnit}</span>
          <span className="text-[10px] text-emerald-700 font-bold block">Includes 100% Solatium (Sec 30)</span>
        </div>

        {/* Card D: Total Government Award */}
        <div className="bg-[#12355B] text-white p-5 rounded-2xl shadow-sm border border-slate-700 space-y-1">
          <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block">Total Award Payable</span>
          <span className="text-2xl font-black text-amber-400 font-mono block">{citizenLand.totalGovtAward}</span>
          <span className="text-[10px] text-emerald-300 font-medium block">✓ Bank Transfer Escrow Approved</span>
        </div>

      </div>

      {/* ── 2. SOIL FERTILITY & DETAILED VALUATION DOSSIER ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (8 Cols): Land Details, Soil Attributes, and Status */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Soil Type & Fertility Details Card */}
          <div className="bg-white border border-[#E2E8F0] p-6 rounded-2xl space-y-4 shadow-2xs">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h2 className="text-base font-extrabold text-[#12355B] flex items-center gap-2">
                <Sprout className="h-5 w-5 text-[#2F6B4F]" />
                Soil Classification & Fertility Assessment
              </h2>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2.5 py-1 rounded-full font-mono uppercase">
                High Yield Soil
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-[#FAFAF7] rounded-xl border border-[#E8E1D5]">
                <span className="text-slate-500 block text-[10px] font-bold uppercase tracking-wider">Soil Classification</span>
                <strong className="text-[#12355B] text-sm block mt-0.5">{citizenLand.soilType}</strong>
              </div>

              <div className="p-3.5 bg-[#FAFAF7] rounded-xl border border-[#E8E1D5]">
                <span className="text-slate-500 block text-[10px] font-bold uppercase tracking-wider">Fertility Index</span>
                <strong className="text-[#2F6B4F] text-sm block mt-0.5">{citizenLand.fertilityRating}</strong>
              </div>

              <div className="p-3.5 bg-[#FAFAF7] rounded-xl border border-[#E8E1D5]">
                <span className="text-slate-500 block text-[10px] font-bold uppercase tracking-wider">Irrigation & Cultivation</span>
                <strong className="text-slate-800 text-sm block mt-0.5">{citizenLand.irrigationStatus}</strong>
              </div>

              <div className="p-3.5 bg-[#FAFAF7] rounded-xl border border-[#E8E1D5]">
                <span className="text-slate-500 block text-[10px] font-bold uppercase tracking-wider">Terrain Topography</span>
                <strong className="text-slate-800 text-sm block mt-0.5">{citizenLand.topography}</strong>
              </div>
            </div>
          </div>

          {/* Land Parcel & Location Dossier */}
          <div className="bg-white border border-[#E2E8F0] p-6 rounded-2xl space-y-4 shadow-2xs">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h2 className="text-base font-extrabold text-[#12355B] flex items-center gap-2">
                <MapPin className="h-5 w-5 text-[#C98B2E]" />
                Land Parcel & Revenue Location Information
              </h2>
              <span className="text-[10px] bg-blue-50 text-[#12355B] font-extrabold px-2.5 py-1 rounded font-mono uppercase">
                {citizenLand.verificationStatus}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-[#FAFAF7] rounded-xl border border-[#E8E1D5]">
                <span className="text-slate-500 block text-[10px]">Plot Survey Number</span>
                <strong className="font-mono text-[#12355B] text-sm">{citizenLand.plotNo} ({citizenLand.surveyNo})</strong>
              </div>

              <div className="p-3.5 bg-[#FAFAF7] rounded-xl border border-[#E8E1D5]">
                <span className="text-slate-500 block text-[10px]">Khata Ledger Number</span>
                <strong className="font-mono text-slate-800 text-sm">{citizenLand.khataNo}</strong>
              </div>

              <div className="p-3.5 bg-[#FAFAF7] rounded-xl border border-[#E8E1D5]">
                <span className="text-slate-500 block text-[10px]">Revenue Circle & Village</span>
                <strong className="text-slate-800 text-sm">{citizenLand.village}</strong>
              </div>

              <div className="p-3.5 bg-[#FAFAF7] rounded-xl border border-[#E8E1D5]">
                <span className="text-slate-500 block text-[10px]">GIS Geo-Coordinates</span>
                <strong className="font-mono text-[#2F6B4F] text-xs">{citizenLand.coordinates}</strong>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-3">
              <button 
                onClick={() => setShowObjectionModal(true)}
                className="bg-[#C98B2E] hover:bg-amber-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer transition-all shadow-sm flex items-center gap-2"
              >
                <Scale className="h-4 w-4" />
                <span>Submit Objection / Disagreement Petition</span>
              </button>

              <button 
                onClick={() => setActiveTab('gis')}
                className="bg-slate-100 hover:bg-slate-200 text-[#12355B] text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer transition-colors flex items-center gap-1.5"
              >
                <MapPin className="h-4 w-4 text-[#2F6B4F]" />
                <span>View Cadastral Map Boundary</span>
              </button>
            </div>
          </div>

        </div>

        {/* Right Column (4 Cols): Compensation Status & Documents */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Compensation Status Card */}
          <div className="bg-white border border-[#E2E8F0] p-5 rounded-2xl space-y-4 shadow-2xs">
            <h3 className="text-xs font-bold text-[#12355B] uppercase tracking-wider font-mono">Compensation & Direct Payout Status</h3>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 space-y-1 font-semibold">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                  <span>Escrow Bank Transfer Approved</span>
                </div>
                <p className="text-[11px] text-emerald-700 font-mono pt-1">PFMS Advice: {citizenLand.transactionId}</p>
              </div>

              <div className="p-3 bg-[#FAFAF7] border border-[#E8E1D5] rounded-xl space-y-1">
                <span className="text-slate-400 block text-[10px]">Blockchain Verification Hash</span>
                <span className="font-mono text-[11px] text-[#12355B] font-bold block">{citizenLand.blockchainHash}</span>
              </div>
            </div>
          </div>

          {/* Official Land Documents */}
          <div className="bg-white border border-[#E2E8F0] p-5 rounded-2xl space-y-3 shadow-2xs text-xs">
            <h3 className="font-extrabold text-[#12355B] flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#7A5C3E]" />
              Official Gazette Orders & Award Statements
            </h3>
            <div className="space-y-2">
              <div className="p-3 bg-[#FAFAF7] border border-[#E8E1D5] rounded-xl flex items-center justify-between">
                <div>
                  <strong className="block text-slate-800">Sec 11 Gazette Order</strong>
                  <span className="text-[10px] text-slate-400">PDF • Official Notice</span>
                </div>
                <span className="text-emerald-700 font-extrabold text-[10px]">Verified</span>
              </div>

              <div className="p-3 bg-[#FAFAF7] border border-[#E8E1D5] rounded-xl flex items-center justify-between">
                <div>
                  <strong className="block text-slate-800">Form K Award Statement</strong>
                  <span className="text-[10px] text-slate-400">PDF • Bank Advice</span>
                </div>
                <span className="text-emerald-700 font-extrabold text-[10px]">Disbursed</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* ── 3. INTERACTIVE SECTION 15 OBJECTION SUBMISSION MODAL ── */}
      {showObjectionModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4 border border-slate-300">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="text-base font-extrabold text-[#12355B] flex items-center gap-2">
                <Scale className="h-5 w-5 text-[#C98B2E]" />
                Section 15 Land Acquisition Objection Petition
              </h3>
              <button onClick={() => setShowObjectionModal(false)} className="text-slate-400 hover:text-slate-700 font-bold text-sm">✕</button>
            </div>

            {objectionSubmitted ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-3">
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
                    className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 font-semibold focus:outline-none focus:border-[#12355B]"
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
                    className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 font-semibold focus:outline-none focus:border-[#12355B]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button 
                    type="button"
                    onClick={() => setShowObjectionModal(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 font-bold hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-5 py-2 rounded-xl text-white bg-[#C98B2E] hover:bg-amber-700 font-bold shadow-md cursor-pointer"
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
