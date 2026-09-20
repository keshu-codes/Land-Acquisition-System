import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  Users, MapPin, Shield, FileText, CheckCircle2, AlertCircle, 
  Download, ExternalLink, ArrowRight, Clock, HelpCircle, 
  Send, DollarSign, Scale, Layers, Printer, ChevronRight,
  Fingerprint, Sparkles, AlertTriangle, Check, RefreshCw,
  Building2, Phone, Award, ShieldCheck, Map, FileCheck
} from 'lucide-react';
import { MapContainer, TileLayer, Polygon, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

export default function CitizenDashboard({ setActiveTab }) {
  const { 
    user,
    parcels, 
    selectedParcelId,
    setSelectedParcelId,
    language, 
    t,
    submitObjection,
    performBiometricVerification,
    confirmPossession,
    sendPostPaymentReminder,
    triggerSMS,
    addNotification
  } = useContext(AppContext);

  const [activeSubTab, setActiveSubTab] = useState('valuation');

  // Objection Form State
  const [objectionCategory, setObjectionCategory] = useState("Compensation Undervaluation / Inadequate Rate");
  const [objectionReason, setObjectionReason] = useState("");
  const [objectionEvidence, setObjectionEvidence] = useState("Khordha_CircleRate_Evidence_2026.pdf");
  const [activeObjectionToken, setActiveObjectionToken] = useState(null);

  // Jan Seva Kendra Biometric State
  const [isScanningBiometric, setIsScanningBiometric] = useState(false);
  const [biometricCompleted, setBiometricCompleted] = useState(false);
  const [operatorCenterCode, setOperatorCenterCode] = useState("CSC-OD-KHORDHA-12");
  const [operatorName, setOperatorName] = useState("Rakesh Mohapatra (CSC VLE)");
  const [verificationSlip, setVerificationSlip] = useState(null);

  // Digital e-Sign State
  const [isSigningDigital, setIsSigningDigital] = useState(false);
  const [digitalSignSuccess, setDigitalSignSuccess] = useState(false);

  // Find currently active parcel
  const activeParcel = (parcels && parcels.find(p => p.id.toString() === selectedParcelId.toString())) || parcels[0] || {
    id: 1501,
    parcel_number: "PLOT-OD-2026-9821",
    owner_name: "Anmol",
    owner_mobile: "9876543210",
    survey_number: "SN-9821 / Khasra 442",
    village: "Chandaka Revenue Circle",
    tehsil: "Bhubaneswar",
    district: "Khordha",
    state: "Odisha",
    associated_project: "Bhubaneswar-Cuttack Metro Corridor Package 1",
    area_sqm: 5868.57,
    area_acres: 1.45,
    area_hectares: 0.587,
    market_rate_sqm: 362.09,
    market_rate_acre: 1465517.0,
    govt_rate_sqm: 724.18,
    govt_rate_acre: 2931034.0,
    soil_type: "Alluvial Irrigated (Double Crop - Class I)",
    soil_fertility: "Grade A (High Organic Carbon 0.82%, Available N: 312 kg/ha, pH: 6.8)",
    irrigation_source: "Mahanadi Perennial Canal & Certified Solar Borewell",
    valuation: 4250000.0,
    compensation_status: "Disbursed to Landowner Account",
    confirmation_status: "pending",
    reminder_attempts: []
  };

  // Safe coordinates for Leaflet polygon
  const parcelCoordinates = [
    [20.2945, 85.8225],
    [20.2945, 85.8265],
    [20.2977, 85.8265],
    [20.2977, 85.8225]
  ];

  // Submit Objection Handler (Requirement 3)
  const handleObjectionSubmit = (e) => {
    e.preventDefault();
    if (!objectionReason.trim()) return;
    const token = submitObjection(activeParcel.id, objectionCategory, objectionReason, objectionEvidence);
    setActiveObjectionToken(token);
    setObjectionReason("");
  };

  // Perform Biometric Verification at Jan Seva Kendra (Requirement 4)
  const handleTriggerBiometric = () => {
    setIsScanningBiometric(true);
    setTimeout(() => {
      setIsScanningBiometric(false);
      setBiometricCompleted(true);
      const result = performBiometricVerification(activeParcel.id, operatorName, operatorCenterCode);
      setVerificationSlip(result);
    }, 2000);
  };

  // Digital e-Sign Handler (Requirement 4)
  const handleDigitalSign = () => {
    setIsSigningDigital(true);
    setTimeout(() => {
      setIsSigningDigital(false);
      setDigitalSignSuccess(true);
      addNotification("Aadhaar e-Sign verified and document digitally certified.", "success");
      triggerSMS("UIDAI-ESIGN", "Aadhaar e-Sign authenticated successfully for NLAMS document verification.");
    }, 1500);
  };

  // Confirm Possession Handover (Requirement 6)
  const handleConfirmPossession = () => {
    confirmPossession(activeParcel.id);
  };

  // Trigger Reminder Simulation (Requirement 6)
  const handleSendReminderNotice = () => {
    sendPostPaymentReminder(activeParcel.id);
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] text-[#1E293B] font-sans pb-16 select-none">
      
      {/* 1. Official Breadcrumb Strip */}
      <div className="bg-white border-b border-slate-200 py-2 px-4 sm:px-8 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-slate-500 font-medium">
          <div className="flex items-center gap-2">
            <button onClick={() => setActiveTab('home')} className="hover:text-[#156734] hover:underline cursor-pointer">
              {t('home')}
            </button>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <span className="text-slate-700 font-semibold">{t('citizenPortalHeading')}</span>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <span className="text-[#156734] font-bold font-mono">{activeParcel.parcel_number}</span>
          </div>

          {/* Parcel Switcher for Multiple Land Holdings */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500 font-bold hidden sm:inline">Select Land Parcel:</span>
            <select
              value={selectedParcelId}
              onChange={(e) => setSelectedParcelId(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-800 text-xs font-bold rounded-md px-2.5 py-1 outline-none cursor-pointer"
            >
              {parcels.map(p => (
                <option key={p.id} value={p.id}>
                  {p.parcel_number} ({p.owner_name} - {p.district})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 2. Official Portal Header Plaque */}
      <div className="bg-[#156734] text-white py-6 px-4 sm:px-8 border-b-2 border-[#E59819] shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
              <ShieldCheck className="h-4 w-4" />
              <span>{t('portalSubtitle')}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black font-sans tracking-tight">
              {t('valuationOverview')}
            </h1>
            <p className="text-xs text-white/90 mt-0.5">
              Single-window statutory verification under the Right to Fair Compensation and Transparency in Land Acquisition (RFCTLARR) Act, 2013.
            </p>
          </div>

          <div className="bg-[#0E4B24] border border-emerald-700 px-4 py-2.5 rounded-xl text-xs space-y-0.5 shrink-0 shadow-inner">
            <div className="text-emerald-200 text-[10px] uppercase font-extrabold">Registered Titleholder</div>
            <div className="font-extrabold text-white text-sm">{activeParcel.owner_name}</div>
            <div className="text-[11px] text-amber-300 font-mono font-bold">ULPIN: {activeParcel.parcel_number}</div>
          </div>
        </div>
      </div>

      {/* 3. Sub-Navigation Tabs */}
      <div className="bg-white border-b border-slate-300 sticky top-12 z-20 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex space-x-1 overflow-x-auto">
          {[
            { id: 'valuation', label: '1. Land Valuation & Soil Details', icon: MapPin },
            { id: 'objection', label: '2. Dispute & Objection Tribunal', icon: Scale },
            { id: 'verification', label: '3. Digital & Jan Seva Kendra Verification', icon: Fingerprint },
            { id: 'post_payment', label: '4. Post-Payment Confirmation & Escalation', icon: AlertTriangle },
            { id: 'receipt', label: '5. Official Payment & Receipt Record', icon: FileText },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-bold transition whitespace-nowrap cursor-pointer border-b-2 ${
                  isActive 
                    ? 'border-[#156734] text-[#156734] bg-emerald-50/50' 
                    : 'border-transparent text-slate-600 hover:text-[#156734] hover:bg-slate-50'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-[#156734]' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Main Body Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 space-y-6">

        {/* ========================================================================= */}
        {/* SUBTAB 1: Land Valuation & Soil Particulars (Requirement 3)               */}
        {/* ========================================================================= */}
        {activeSubTab === 'valuation' && (
          <div className="space-y-6">
            
            {/* Top Quick Status & Objection Prompt Banner */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <Scale className="h-5 w-5" />
                </div>
                <div>
                  <strong className="text-xs sm:text-sm text-slate-800 font-bold block">
                    {t('disputeNotice')}
                  </strong>
                  <span className="text-[11px] text-slate-600">
                    Disagreement with base rates, soil classification, or crop solatium can be filed for District Magistrate hearing.
                  </span>
                </div>
              </div>

              <button
                onClick={() => setActiveSubTab('objection')}
                className="bg-[#EA580C] hover:bg-[#C2410C] text-white px-4 py-2 rounded-lg text-xs font-extrabold transition cursor-pointer shrink-0 flex items-center gap-2 shadow-xs"
              >
                <span>{t('fileObjection')}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Main Valuation & Soil Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left 8 Cols: Detailed Land Valuation & Soil Table */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* 1. Cadastral Valuation Card */}
                <div className="bg-white border border-slate-300 rounded-xl p-5 shadow-xs space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                    <div>
                      <h2 className="text-sm font-bold text-[#156734] uppercase tracking-wide">
                        {t('valuationOverview')}
                      </h2>
                      <span className="text-[11px] text-slate-500">
                        Certified by District Revenue Collectorate & Sub-Registrar
                      </span>
                    </div>

                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${
                      activeParcel.compensation_status && activeParcel.compensation_status.includes('Disbursed')
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : 'bg-amber-100 text-amber-800 border-amber-300'
                    }`}>
                      {activeParcel.compensation_status}
                    </span>
                  </div>

                  <div className="border border-slate-200 overflow-x-auto rounded-lg">
                    <table className="w-full text-xs text-left border-collapse">
                      <tbody className="divide-y divide-slate-200">
                        
                        {/* Market Rate per Unit (Req 3) */}
                        <tr className="bg-slate-50/70">
                          <td className="p-3 font-bold text-slate-700 w-2/5 border-r border-slate-200">
                            {t('marketPricePerUnit')}
                          </td>
                          <td className="p-3 font-bold text-slate-900">
                            ₹{activeParcel.market_rate_sqm?.toFixed(2)} / m² 
                            <span className="text-slate-500 font-normal ml-2">
                              (₹{(activeParcel.market_rate_acre / 100000).toFixed(2)} Lakhs / Acre)
                            </span>
                          </td>
                        </tr>

                        {/* Government Compensation Offered per Unit (Req 3) */}
                        <tr className="bg-emerald-50/50">
                          <td className="p-3 font-bold text-emerald-900 border-r border-slate-200">
                            {t('govtCompensationPerUnit')}
                          </td>
                          <td className="p-3 font-extrabold text-emerald-800 text-sm">
                            ₹{activeParcel.govt_rate_sqm?.toFixed(2)} / m² 
                            <span className="text-emerald-700 font-bold ml-2">
                              (₹{(activeParcel.govt_rate_acre / 100000).toFixed(2)} Lakhs / Acre)
                            </span>
                            <span className="text-[10px] text-emerald-600 block font-normal mt-0.5">
                              * Includes 100% Solatium + First Schedule Multiplier under LARR 2013
                            </span>
                          </td>
                        </tr>

                        {/* Total Land Area (Req 3) */}
                        <tr>
                          <td className="p-3 font-bold text-slate-700 border-r border-slate-200">
                            {t('totalLandArea')}
                          </td>
                          <td className="p-3 font-extrabold text-slate-800">
                            {activeParcel.area_acres} Acres 
                            <span className="text-slate-500 font-normal ml-2">
                              ({activeParcel.area_hectares} Hectares / {activeParcel.area_sqm} m²)
                            </span>
                          </td>
                        </tr>

                        {/* Soil Type (Req 3) */}
                        <tr className="bg-slate-50/70">
                          <td className="p-3 font-bold text-slate-700 border-r border-slate-200">
                            {t('soilType')}
                          </td>
                          <td className="p-3 font-bold text-slate-800">
                            {activeParcel.soil_type}
                          </td>
                        </tr>

                        {/* Soil Fertility Details (Req 3) */}
                        <tr>
                          <td className="p-3 font-bold text-slate-700 border-r border-slate-200">
                            {t('soilFertility')}
                          </td>
                          <td className="p-3 text-slate-700">
                            <span className="font-bold text-[#156734] block">{activeParcel.soil_fertility}</span>
                            <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">
                              Soil Health Card Registry: {activeParcel.soil_health_card_no || 'SHC-2026-CERTIFIED'}
                            </span>
                          </td>
                        </tr>

                        {/* Irrigation Facility */}
                        <tr className="bg-slate-50/70">
                          <td className="p-3 font-bold text-slate-700 border-r border-slate-200">
                            {t('irrigationStatus')}
                          </td>
                          <td className="p-3 text-slate-800 font-medium">
                            {activeParcel.irrigation_source}
                          </td>
                        </tr>

                        {/* Location Details (Req 3) */}
                        <tr>
                          <td className="p-3 font-bold text-slate-700 border-r border-slate-200">
                            {t('landParcelLocation')}
                          </td>
                          <td className="p-3 text-slate-800">
                            <strong className="block text-[#156734]">{activeParcel.village}, {activeParcel.tehsil}</strong>
                            <span className="text-slate-600 font-medium">District: {activeParcel.district}, State: {activeParcel.state}</span>
                            <span className="text-slate-500 font-mono text-[11px] block mt-0.5">Khasra/Survey: {activeParcel.survey_number}</span>
                          </td>
                        </tr>

                        {/* Total Statutory Compensation */}
                        <tr className="bg-emerald-50">
                          <td className="p-3 font-black text-slate-800 border-r border-slate-200">
                            Total Compensation Package
                          </td>
                          <td className="p-3 font-black text-emerald-800 text-base">
                            ₹{(activeParcel.valuation || 0).toLocaleString('en-IN')}
                            <span className="text-[10px] text-slate-500 font-normal block">
                              (Base ₹{((activeParcel.valuation || 0)/2).toLocaleString('en-IN')} + 100% Solatium ₹{((activeParcel.valuation || 0)/2).toLocaleString('en-IN')})
                            </span>
                          </td>
                        </tr>

                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-[11px] text-slate-500">
                      Certified by: District Land Acquisition Officer, {activeParcel.district}
                    </span>
                    <button
                      onClick={() => window.print()}
                      className="border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Printer className="h-3.5 w-3.5" />
                      <span>Print RoR Verification Statement</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* Right 4 Cols: Cadastral Map Visualizer & Soil Score Card */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Cadastral GIS Map */}
                <div className="bg-white border border-slate-300 rounded-xl p-4 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-[#156734] uppercase tracking-wide flex items-center gap-1.5">
                      <Map className="h-4 w-4" /> Cadastral GIS Boundary
                    </h3>
                    <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold">
                      Geo-Fenced
                    </span>
                  </div>

                  <div className="h-56 w-full rounded-lg overflow-hidden border border-slate-200 z-10 relative">
                    <MapContainer
                      center={[20.2955, 85.8245]}
                      zoom={15}
                      scrollWheelZoom={false}
                      className="h-full w-full"
                    >
                      <TileLayer
                        attribution="&copy; OpenStreetMap"
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <Polygon
                        positions={parcelCoordinates}
                        pathOptions={{ color: '#156734', fillColor: '#22c55e', fillOpacity: 0.35, weight: 3 }}
                      >
                        <Popup>
                          <div className="text-xs font-sans">
                            <strong className="block text-[#156734]">{activeParcel.parcel_number}</strong>
                            <span>Owner: {activeParcel.owner_name}</span><br />
                            <span>Area: {activeParcel.area_acres} Acres</span>
                          </div>
                        </Popup>
                      </Polygon>
                    </MapContainer>
                  </div>

                  <div className="text-[10px] text-slate-500 leading-tight">
                    Geo-coordinates verified via Differential GPS (DGPS) and drone photogrammetry.
                  </div>
                </div>

                {/* Soil Health Card Scorecard (Req 3) */}
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                    <Sparkles className="h-4 w-4 text-emerald-700" />
                    <span>Soil Health & Fertility Parameters</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between border-b border-emerald-200/60 pb-1">
                      <span className="text-slate-600">Organic Carbon (OC)</span>
                      <strong className="text-emerald-800">0.82% (High Fertility)</strong>
                    </div>
                    <div className="flex justify-between border-b border-emerald-200/60 pb-1">
                      <span className="text-slate-600">Available Nitrogen</span>
                      <strong className="text-slate-800">312 kg/ha (Medium)</strong>
                    </div>
                    <div className="flex justify-between border-b border-emerald-200/60 pb-1">
                      <span className="text-slate-600">Soil Reaction (pH)</span>
                      <strong className="text-slate-800">6.8 (Neutral Ideal)</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Cropping Intensity</span>
                      <strong className="text-emerald-800">Double Crop Irrigated</strong>
                    </div>
                  </div>

                  <span className="text-[10px] text-emerald-700 block mt-2">
                    ✓ Validated against State Department of Agriculture Soil Laboratory Records.
                  </span>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* SUBTAB 2: Dispute & Objection Tribunal (Requirement 3)                    */}
        {/* ========================================================================= */}
        {activeSubTab === 'objection' && (
          <div className="max-w-4xl mx-auto space-y-6">
            
            <div className="bg-white border border-slate-300 rounded-xl p-6 shadow-xs space-y-4">
              <div className="border-b border-slate-200 pb-3">
                <h2 className="text-base font-extrabold text-[#156734] font-sans flex items-center gap-2">
                  <Scale className="h-5 w-5" />
                  <span>Land Acquisition Dispute & Objection Tribunal (Section 15)</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Landowners may submit formal statutory objections regarding compensation undervaluation, soil fertility misclassification, or area boundary discrepancies directly to the District Collector.
                </p>
              </div>

              {/* Active Token Confirmation Banner */}
              {activeObjectionToken && (
                <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-4 rounded-xl space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    <strong className="text-sm">Objection Registered with District Land Acquisition Collector!</strong>
                  </div>
                  <div className="text-xs space-y-1 pl-7">
                    <p>Official Case Tracking Token: <strong className="font-mono text-emerald-800 text-sm">{activeObjectionToken}</strong></p>
                    <p>Scheduled Hearing Date: <strong>18-Sep-2026 at 11:00 AM</strong> at the Office of the District Magistrate.</p>
                    <p className="text-[11px] text-emerald-700">An official SMS notice has been dispatched to {activeParcel.owner_mobile}.</p>
                  </div>
                </div>
              )}

              {/* Objection Form */}
              <form onSubmit={handleObjectionSubmit} className="space-y-4">
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('objectionCategory')} *
                  </label>
                  <select
                    value={objectionCategory}
                    onChange={(e) => setObjectionCategory(e.target.value)}
                    className="w-full text-xs font-bold border border-slate-300 rounded-lg p-2.5 bg-slate-50 outline-none focus:border-[#156734]"
                  >
                    <option value="Compensation Undervaluation / Inadequate Rate">Compensation Undervaluation / Inadequate Rate</option>
                    <option value="Incorrect Soil Grading / Fertility Classification">Incorrect Soil Grading / Fertility Classification</option>
                    <option value="Discrepancy in Cadastral Boundary / Area Extent">Discrepancy in Cadastral Boundary / Area Extent</option>
                    <option value="Omission of Standing Crops, Trees or Structures">Omission of Standing Crops, Trees or Structures</option>
                    <option value="Rehabilitation and Resettlement (R&R) Rights">Rehabilitation and Resettlement (R&R) Rights</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('objectionReason')} *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={objectionReason}
                    onChange={(e) => setObjectionReason(e.target.value)}
                    placeholder="Enter detailed grounds for dispute, referencing circle rate records, soil test reports, or boundary survey discrepancies..."
                    className="w-full text-xs font-medium border border-slate-300 rounded-lg p-3 bg-slate-50 outline-none focus:border-[#156734]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('attachEvidence')}
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={objectionEvidence}
                      onChange={(e) => setObjectionEvidence(e.target.value)}
                      className="flex-1 text-xs font-mono border border-slate-300 rounded-lg p-2.5 bg-slate-50"
                    />
                    <button
                      type="button"
                      onClick={() => addNotification("Supporting document attached: " + objectionEvidence, "info")}
                      className="bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold px-3 py-2.5 rounded-lg cursor-pointer"
                    >
                      Attach Proof
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Supported formats: PDF, PNG, JPG of sale deeds, circle rate gazettes, or soil certificates.
                  </span>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="bg-[#156734] hover:bg-[#0E4B24] text-white font-extrabold px-6 py-3 rounded-xl text-xs flex items-center gap-2 shadow-sm cursor-pointer transition"
                  >
                    <Send className="h-4 w-4" />
                    <span>{t('submitObjectionBtn')}</span>
                  </button>
                </div>

              </form>

            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* SUBTAB 3: Digital & Jan Seva Kendra Verification (Requirement 4)          */}
        {/* ========================================================================= */}
        {activeSubTab === 'verification' && (
          <div className="space-y-6">
            
            <div className="bg-white border border-slate-300 rounded-xl p-6 shadow-xs space-y-3">
              <h2 className="text-base font-extrabold text-[#156734] font-sans">
                {t('verificationTitle')}
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t('verificationSub')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Option A: Digital Online Review & e-Sign */}
              <div className="bg-white border border-slate-300 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded">
                      Mode A • Online Digital
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">Aadhaar e-Sign</span>
                  </div>

                  <h3 className="text-sm font-extrabold text-slate-850">
                    {t('digitalMode')}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Review the official acquisition notification documents online and provide digital verification using your Aadhaar-linked OTP or DSC token.
                  </p>

                  <div className="space-y-2 border border-slate-200 rounded-lg p-3 bg-slate-50 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-700">Section 11 Preliminary Gazette</span>
                      <span className="text-emerald-700 font-bold">✓ Certified</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-700">Section 19 Declaration</span>
                      <span className="text-emerald-700 font-bold">✓ Published</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-700">Section 30 Award Valuation Statement</span>
                      <span className="text-emerald-700 font-bold">✓ Locked</span>
                    </div>
                  </div>
                </div>

                <div>
                  {digitalSignSuccess ? (
                    <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-3 rounded-xl text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span>Digitally Signed via Aadhaar e-Sign (Hash: 0x7f18a9...b4)</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleDigitalSign}
                      disabled={isSigningDigital}
                      className="w-full bg-blue-700 hover:bg-blue-800 text-white font-extrabold py-3 rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isSigningDigital ? <RefreshCw className="h-4 w-4 animate-spin" /> : <FileCheck className="h-4 w-4" />}
                      <span>{t('signOnlineBtn')}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Option B: Jan Seva Kendra (CSC) Physical Verification */}
              <div className="bg-white border border-slate-300 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-[#156734] bg-emerald-100 px-2.5 py-0.5 rounded">
                      Mode B • Physical Center
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 font-bold">Jan Seva Kendra / CSC</span>
                  </div>

                  <h3 className="text-sm font-extrabold text-slate-850">
                    {t('janSevaMode')}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {t('janSevaDesc')}
                  </p>

                  <div className="bg-emerald-50/60 border border-emerald-200 rounded-lg p-3 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Assigned CSC Center:</span>
                      <strong className="text-slate-800">{operatorCenterCode}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Certified VLE Operator:</span>
                      <strong className="text-[#156734]">{operatorName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Assistance Provided:</span>
                      <strong className="text-slate-800">Biometric Scan & Objection Help</strong>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Biometric Thumb Impression Simulator */}
                  <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`h-12 w-12 rounded-xl flex items-center justify-center transition-all ${
                        isScanningBiometric 
                          ? 'bg-amber-100 text-amber-600 animate-pulse' 
                          : biometricCompleted 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-white border border-slate-300 text-slate-600'
                      }`}>
                        <Fingerprint className="h-7 w-7" />
                      </div>
                      <div>
                        <strong className="text-xs font-bold text-slate-800 block">
                          {biometricCompleted ? "Biometric Impression Verified" : "Biometric Thumb Scanner"}
                        </strong>
                        <span className="text-[10px] text-slate-500">
                          {biometricCompleted ? "UIDAI Biometric Hash Logged" : "Place thumb on optical sensor"}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleTriggerBiometric}
                      disabled={isScanningBiometric || biometricCompleted}
                      className={`px-3 py-2 rounded-lg text-xs font-extrabold cursor-pointer transition ${
                        biometricCompleted 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-[#156734] hover:bg-[#0E4B24] text-white'
                      }`}
                    >
                      {isScanningBiometric ? "Scanning..." : biometricCompleted ? "✓ Verified" : "Scan Thumb"}
                    </button>
                  </div>

                  {/* Print Slip Button */}
                  {biometricCompleted && (
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="w-full bg-[#E59819] hover:bg-[#CA8A04] text-slate-900 font-extrabold py-3 rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Printer className="h-4 w-4" />
                      <span>{t('printVerificationSlip')}</span>
                    </button>
                  )}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* SUBTAB 4: Post-Payment Confirmation & Escalation (Requirement 6)           */}
        {/* ========================================================================= */}
        {activeSubTab === 'post_payment' && (
          <div className="space-y-6">
            
            <div className="bg-white border border-slate-300 rounded-xl p-6 shadow-xs space-y-3">
              <h2 className="text-base font-extrabold text-[#156734] font-sans">
                {t('postPaymentTitle')}
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t('postPaymentDesc')}
              </p>
            </div>

            {/* Critical Escalation Alert if 3 Attempts reached */}
            {activeParcel.escalated_to_collector && (
              <div className="bg-rose-50 border-2 border-rose-400 text-rose-900 p-5 rounded-2xl space-y-3 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <AlertTriangle className="h-6 w-6 text-rose-600 shrink-0" />
                  <strong className="text-sm font-extrabold uppercase">
                    {t('escalatedWarning')}
                  </strong>
                </div>
                <div className="text-xs space-y-1 pl-8 text-rose-800 leading-relaxed">
                  <p>Case Reference: <strong className="font-mono">{activeParcel.escalation_details?.case_no || 'ESC-LARR-2026-0441'}</strong></p>
                  <p>Authority: <strong>{activeParcel.escalation_details?.authority || 'Office of District Collector'}</strong></p>
                  <p>Statutory Clause: <em>{activeParcel.escalation_details?.statutory_clause || 'Section 38 RFCTLARR Act 2013 (Deemed Summary Possession)'}</em></p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Left 7 Cols: Confirmation Action & Status */}
              <div className="md:col-span-7 bg-white border border-slate-300 rounded-2xl p-6 space-y-4 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h3 className="text-xs font-bold text-[#156734] uppercase tracking-wide">
                    Possession Handover Certificate Status
                  </h3>
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded uppercase ${
                    activeParcel.confirmation_status === 'confirmed' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {activeParcel.confirmation_status === 'confirmed' ? "Confirmed" : "Pending Confirmation"}
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-2">
                  <p>
                    Following the release of compensation amount of <strong>₹{(activeParcel.valuation || 0).toLocaleString('en-IN')}</strong> to your Aadhaar-linked account, statutory Form-V confirmation is required to finalize the transfer of title.
                  </p>
                </div>

                <div className="pt-2">
                  {activeParcel.confirmation_status === 'confirmed' ? (
                    <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-xl text-xs space-y-1">
                      <strong className="flex items-center gap-1.5 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        <span>{t('possessionConfirmed')}</span>
                      </strong>
                      <span className="text-[11px] font-mono text-emerald-700 block">
                        Vesting Certificate: {activeParcel.vesting_certificate || 'VEST-LARR-2026-9012'}
                      </span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleConfirmPossession}
                      className="w-full bg-[#156734] hover:bg-[#0E4B24] text-white font-extrabold py-3 rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Check className="h-4 w-4" />
                      <span>{t('confirmPossessionBtn')}</span>
                    </button>
                  )}
                </div>

                {/* Reminder Simulator Button */}
                <div className="pt-4 border-t border-slate-200">
                  <span className="text-[11px] font-bold text-slate-500 block mb-2">
                    Evaluation & Audit Testing Control:
                  </span>
                  <button
                    type="button"
                    onClick={handleSendReminderNotice}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-2"
                  >
                    <Send className="h-3.5 w-3.5 text-amber-600" />
                    <span>Simulate Sending Unconfirmed Reminder (Attempts 1 → 3)</span>
                  </button>
                </div>
              </div>

              {/* Right 5 Cols: Documented 3-Attempt History */}
              <div className="md:col-span-5 bg-slate-50 border border-slate-300 rounded-2xl p-5 space-y-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    {t('reminderStatus')}
                  </h3>
                  <span className="text-[10px] font-mono text-slate-500">
                    Max: 3 Documented Attempts
                  </span>
                </div>

                <div className="space-y-3">
                  {[1, 2, 3].map(attemptNum => {
                    const existingAttempt = activeParcel.reminder_attempts && activeParcel.reminder_attempts.find(a => a.attempt === attemptNum);
                    const isDispatched = !!existingAttempt;

                    return (
                      <div 
                        key={attemptNum}
                        className={`p-3 rounded-xl border text-xs transition ${
                          isDispatched 
                            ? 'bg-white border-amber-300 shadow-2xs' 
                            : 'bg-slate-100/60 border-slate-200 opacity-60'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <strong className="text-slate-800">
                            {attemptNum === 1 ? t('attempt1') : attemptNum === 2 ? t('attempt2') : t('attempt3')}
                          </strong>
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                            isDispatched ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-600'
                          }`}>
                            {isDispatched ? "Dispatched" : "Pending"}
                          </span>
                        </div>
                        {isDispatched && (
                          <div className="text-[10px] text-slate-500 mt-1">
                            <span>Sent: {existingAttempt.date}</span> • <span className="text-emerald-700 font-medium">{existingAttempt.status}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="text-[10px] text-slate-400 italic">
                  * If no response is recorded after 3 attempts, case automatically escalates to District Collector.
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* SUBTAB 5: Payment & Receipt Management (Requirement 7)                    */}
        {/* ========================================================================= */}
        {activeSubTab === 'receipt' && (
          <div className="max-w-3xl mx-auto space-y-6">
            
            {/* Formal Certificate Wrapper for Printing */}
            <div className="bg-white border-2 border-slate-300 rounded-2xl p-8 shadow-md space-y-6 print:border-none print:shadow-none">
              
              {/* Receipt Header with Government Crest Branding */}
              <div className="text-center space-y-1 border-b-2 border-[#156734] pb-4">
                <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#156734]">
                  GOVERNMENT OF INDIA • PUBLIC FINANCIAL MANAGEMENT SYSTEM (PFMS)
                </div>
                <h2 className="text-xl font-black text-slate-900 font-serif">
                  Official Compensation Disbursement Certificate
                </h2>
                <div className="text-xs text-slate-600 font-semibold">
                  Statutory Receipt under Right to Fair Compensation Act (LARR 2013)
                </div>
              </div>

              {/* Receipt Particulars Table */}
              <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
                <table className="w-full border-collapse">
                  <tbody className="divide-y divide-slate-200">
                    <tr className="bg-slate-50">
                      <td className="p-3 font-bold text-slate-600 w-1/3 border-r border-slate-200">
                        {t('utrNumber')}
                      </td>
                      <td className="p-3 font-mono font-extrabold text-[#156734]">
                        {activeParcel.payment_record?.utr_number || 'PFMS-RBI-20260829-9812401'}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-600 border-r border-slate-200">
                        {t('paymentDate')}
                      </td>
                      <td className="p-3 font-bold text-slate-800">
                        {activeParcel.payment_record?.payment_date || '29-Aug-2026'}
                      </td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="p-3 font-bold text-slate-600 border-r border-slate-200">
                        Landowner Beneficiary Name
                      </td>
                      <td className="p-3 font-bold text-slate-900">
                        {activeParcel.owner_name}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-600 border-r border-slate-200">
                        {t('escrowAccount')}
                      </td>
                      <td className="p-3 font-medium text-slate-800">
                        {activeParcel.payment_record?.bank_account || 'State Bank of India (A/C: *******4491, Aadhaar-Linked)'}
                      </td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="p-3 font-bold text-slate-600 border-r border-slate-200">
                        Acquired Land Parcel (ULPIN)
                      </td>
                      <td className="p-3 font-mono font-bold text-[#156734]">
                        {activeParcel.parcel_number} ({activeParcel.survey_number})
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-600 border-r border-slate-200">
                        {t('baseCompensation')}
                      </td>
                      <td className="p-3 font-mono text-slate-800">
                        ₹{((activeParcel.valuation || 0) / 2).toLocaleString('en-IN')}
                      </td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="p-3 font-bold text-slate-600 border-r border-slate-200">
                        {t('solatiumAmount')}
                      </td>
                      <td className="p-3 font-mono text-slate-800">
                        ₹{((activeParcel.valuation || 0) / 2).toLocaleString('en-IN')}
                      </td>
                    </tr>
                    <tr className="bg-emerald-50 text-sm">
                      <td className="p-3 font-black text-emerald-950 border-r border-emerald-200">
                        {t('totalPaid')}
                      </td>
                      <td className="p-3 font-black text-emerald-800 text-base">
                        ₹{(activeParcel.valuation || 0).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Official Stamp Signatures Footer */}
              <div className="flex justify-between items-end pt-4 border-t border-slate-200 text-[11px] text-slate-500">
                <div>
                  <span className="block font-bold text-slate-700">Competent Authority / Collector</span>
                  <span>District Land Acquisition Unit, {activeParcel.district}</span>
                </div>
                <div className="text-right">
                  <span className="block font-bold text-emerald-700">✓ Digitally Signed & Authenticated</span>
                  <span className="font-mono text-[9px]">Hash: 0x9b4a1c7e...3d20</span>
                </div>
              </div>

              {/* Print Action */}
              <div className="pt-2 flex justify-end print:hidden">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="bg-[#156734] hover:bg-[#0E4B24] text-white font-extrabold px-5 py-2.5 rounded-xl text-xs transition cursor-pointer flex items-center gap-2 shadow-sm"
                >
                  <Printer className="h-4 w-4" />
                  <span>{t('printReceiptBtn')}</span>
                </button>
              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}
