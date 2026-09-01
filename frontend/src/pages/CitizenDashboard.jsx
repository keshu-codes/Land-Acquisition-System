import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  Landmark, MapPin, CheckCircle, FileText, AlertTriangle, ShieldCheck, 
  CreditCard, ExternalLink, ArrowUpRight, Scale, Clock, Download, Eye
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
    village: "Chandaka Revenue Circle",
    area: "1.45 Acres (Semi-Urban Agricultural)",
    baseMarketValuation: "₹42,50,000",
    solatiumBonus: "₹42,50,000 (100% Solatium Sec 30)",
    totalGovtAward: "₹85,00,000",
    paymentStatus: "PFMS Bank Transfer Escrow Approved",
    acquisitionStatus: "Section 11 (1) Gazette Published",
    verificationStatus: "Verified by District Revenue Authority",
    transactionId: "TXN-2026-PFMS-982104",
    blockchainHash: "0x8f7a...9821d"
  };

  const handleObjectionSubmit = (e) => {
    e.preventDefault();
    if (!objectionDesc.trim()) return;
    setObjectionSubmitted(true);
    setTimeout(() => {
      setShowObjectionModal(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 font-sans text-slate-800">
      
      {/* ── Header Banner ── */}
      <div className="bg-[#12355B] text-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-700 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-amber-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 font-mono text-[11px] uppercase tracking-wider">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            Verified Citizen / Landowner Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Welcome, {citizenLand.ownerName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Track your land parcel acquisition milestone, statutory 100% Solatium payout award, bank payment advice, or submit an objection petition under Section 15.
          </p>
        </div>
      </div>

      {/* ── KEY LAND & COMPENSATION CARDS ── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <div className="bg-[#FAFAF7] border border-[#E8E1D5] p-5 rounded-xl shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Land Area</span>
          <span className="text-lg font-extrabold text-[#12355B] font-mono block">{citizenLand.area}</span>
          <span className="text-[10px] text-slate-400 block">Khata: {citizenLand.khataNo}</span>
        </div>

        <div className="bg-[#FAFAF7] border border-[#E8E1D5] p-5 rounded-xl shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Base Circle Rate Valuation</span>
          <span className="text-lg font-extrabold text-[#7A5C3E] font-mono block">{citizenLand.baseMarketValuation}</span>
          <span className="text-[10px] text-slate-400 block">Assessed Revenue Rate</span>
        </div>

        <div className="bg-[#FAFAF7] border border-[#E8E1D5] p-5 rounded-xl shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-[#2F6B4F] uppercase tracking-wider block">100% Mandatory Solatium</span>
          <span className="text-lg font-extrabold text-[#2F6B4F] font-mono block">{citizenLand.solatiumBonus}</span>
          <span className="text-[10px] text-emerald-600 font-bold block">RFCTLARR Act 2013 Sec 30</span>
        </div>

        <div className="bg-[#12355B] text-white p-5 rounded-xl shadow-2xs space-y-1 border border-slate-700">
          <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block">Total Govt Award</span>
          <span className="text-xl font-extrabold text-amber-400 font-mono block">{citizenLand.totalGovtAward}</span>
          <span className="text-[10px] text-emerald-300 font-medium block">✓ Bank Transfer Ready</span>
        </div>

      </div>

      {/* ── MAIN LAND DOSSIER & ACTIONS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (8 Cols): Land Details & Documents */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="bg-white border border-[#E2E8F0] p-6 rounded-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h2 className="text-base font-extrabold text-[#12355B] flex items-center gap-2">
                <Landmark className="h-5 w-5 text-[#2F6B4F]" />
                Official Land Parcel Dossier
              </h2>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full font-mono uppercase">
                {citizenLand.verificationStatus}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-[#FAFAF7] rounded-xl border border-[#E8E1D5]">
                <span className="text-slate-500 block text-[10px]">Plot Survey Number</span>
                <strong className="font-mono text-[#12355B] text-sm">{citizenLand.plotNo}</strong>
              </div>

              <div className="p-3 bg-[#FAFAF7] rounded-xl border border-[#E8E1D5]">
                <span className="text-slate-500 block text-[10px]">District & Location</span>
                <strong className="text-slate-800 text-sm">{citizenLand.district}</strong>
              </div>

              <div className="p-3 bg-[#FAFAF7] rounded-xl border border-[#E8E1D5]">
                <span className="text-slate-500 block text-[10px]">Acquisition Status</span>
                <strong className="text-[#2F6B4F] text-sm">{citizenLand.acquisitionStatus}</strong>
              </div>

              <div className="p-3 bg-[#FAFAF7] rounded-xl border border-[#E8E1D5]">
                <span className="text-slate-500 block text-[10px]">PFMS Bank Transaction Ref</span>
                <strong className="font-mono text-slate-800 text-xs">{citizenLand.transactionId}</strong>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-3">
              <button 
                onClick={() => setActiveTab('calc')}
                className="bg-[#2F6B4F] hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer transition-colors flex items-center gap-1.5"
              >
                <CreditCard className="h-4 w-4" />
                <span>Calculate Solatium Breakdown</span>
              </button>

              <button 
                onClick={() => setShowObjectionModal(true)}
                className="bg-[#C98B2E] hover:bg-amber-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer transition-colors flex items-center gap-1.5"
              >
                <Scale className="h-4 w-4" />
                <span>Submit Objection / Dispute</span>
              </button>

              <button 
                onClick={() => setActiveTab('gis')}
                className="bg-slate-100 hover:bg-slate-200 text-[#12355B] text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer transition-colors flex items-center gap-1.5"
              >
                <MapPin className="h-4 w-4 text-[#2F6B4F]" />
                <span>View GIS Boundary Map</span>
              </button>
            </div>
          </div>

          {/* Official Documents List */}
          <div className="bg-white border border-[#E2E8F0] p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-extrabold text-[#12355B] flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#7A5C3E]" />
              Verified Land & Gazette Documents
            </h3>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-[#FAFAF7] border border-[#E8E1D5] rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-[#12355B]" />
                  <div>
                    <strong className="block text-slate-800">Section 11 (1) Gazette Publication Order</strong>
                    <span className="text-[10px] text-slate-400">PDF • Official Notification • Govt Gazette</span>
                  </div>
                </div>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded text-[10px]">Verified</span>
              </div>

              <div className="p-3 bg-[#FAFAF7] border border-[#E8E1D5] rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-[#2F6B4F]" />
                  <div>
                    <strong className="block text-slate-800">Form K Award Statement & Bank Advice</strong>
                    <span className="text-[10px] text-slate-400">PDF • PFMS DBT Escrow Ready</span>
                  </div>
                </div>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded text-[10px]">Disbursed</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column (4 Cols): Status Timeline & Help */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-white border border-[#E2E8F0] p-5 rounded-2xl space-y-4">
            <h3 className="text-xs font-bold text-[#12355B] uppercase tracking-wider font-mono">Acquisition Milestone Timeline</h3>

            <div className="space-y-4 relative pl-4 border-l-2 border-[#E8E1D5] text-xs">
              
              <div className="relative">
                <div className="absolute -left-[21px] top-0 h-3 w-3 rounded-full bg-emerald-600 ring-4 ring-white" />
                <strong className="block text-slate-900">Section 4 SIA Report Submitted</strong>
                <span className="text-[10px] text-slate-400 font-mono">Completed • 12-May-2026</span>
              </div>

              <div className="relative">
                <div className="absolute -left-[21px] top-0 h-3 w-3 rounded-full bg-emerald-600 ring-4 ring-white" />
                <strong className="block text-slate-900">Section 11 Gazette Published</strong>
                <span className="text-[10px] text-slate-400 font-mono">Completed • 01-Jul-2026</span>
              </div>

              <div className="relative">
                <div className="absolute -left-[21px] top-0 h-3 w-3 rounded-full bg-amber-500 ring-4 ring-white animate-pulse" />
                <strong className="block text-amber-900 font-extrabold">Section 23 Award Declaration</strong>
                <span className="text-[10px] text-amber-700 font-mono font-bold">In Progress • 100% Solatium Calculated</span>
              </div>

              <div className="relative opacity-60">
                <div className="absolute -left-[21px] top-0 h-3 w-3 rounded-full bg-slate-300 ring-4 ring-white" />
                <strong className="block text-slate-600">Possession Handover & R&R</strong>
                <span className="text-[10px] text-slate-400 font-mono">Upcoming</span>
              </div>

            </div>
          </div>

          <div className="bg-[#12355B] text-white p-5 rounded-2xl space-y-2 border border-slate-700">
            <span className="text-amber-400 text-xs font-bold block">District Competent Authority Help:</span>
            <p className="text-xs text-slate-200 leading-relaxed">
              If you have any questions regarding your land survey coordinates or bank account linkage, call the District Helpline:
            </p>
            <div className="text-lg font-mono font-bold text-white pt-1">1800-11-LARR (5277)</div>
          </div>

        </div>

      </div>

      {/* ── SUBMIT OBJECTION MODAL ── */}
      {showObjectionModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4 border border-slate-300">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="text-base font-extrabold text-[#12355B] flex items-center gap-2">
                <Scale className="h-5 w-5 text-[#C98B2E]" />
                Section 15 Land Objection Petition
              </h3>
              <button onClick={() => setShowObjectionModal(false)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>

            {objectionSubmitted ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-emerald-600 flex-shrink-0" />
                <div>
                  <strong>Objection Petition Submitted Successfully!</strong>
                  <p className="text-[11px] text-emerald-700 mt-0.5">Reference ID: OBJ-2026-9821. Competent Revenue Officer assigned.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleObjectionSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Objection Category *</label>
                  <select 
                    value={objectionType}
                    onChange={(e) => setObjectionType(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 font-semibold focus:outline-none focus:border-[#12355B]"
                  >
                    <option value="VALUATION">Dispute Base Market Circle Rate Valuation</option>
                    <option value="BOUNDARY">Dispute GIS Boundary / Area Survey Coordinates</option>
                    <option value="TITLE">Dispute Land Title Ownership / Inheritance Claim</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Objection Details & Grounds *</label>
                  <textarea 
                    rows={4}
                    required
                    placeholder="Provide specific details regarding your dispute (min 20 characters)..."
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
                    Submit Official Petition
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
