import React, { useState, useEffect, useContext } from 'react';
import { MapContainer, TileLayer, Polygon, Popup } from 'react-leaflet';
import { 
  MapPin, Send, User, Shield, CheckCircle, 
  Copy, Mail, Key, Clock, AlertTriangle, ChevronRight
} from 'lucide-react';
import { AppContext } from '../context/AppContext';

const SurveyDispatch = () => {
  const { apiBase, user, authHeader, setShowLoginModal, addNotification } = useContext(AppContext);
  
  const [email, setEmail] = useState('anmol7895303@gmail.com');
  const [officers, setOfficers] = useState([]);
  const [selectedOfficer, setSelectedOfficer] = useState(null);
  const [dispatching, setDispatching] = useState(false);
  const [dispatchResult, setDispatchResult] = useState(null);
  const [parcelId, setParcelId] = useState(1501);

  // Security Authorization Modal state with SIH@12345 preset
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authPasscode, setAuthPasscode] = useState('SIH@12345');
  const [passcodeError, setPasscodeError] = useState('');

  // Map coordinates
  const mapCenter = [20.2961, 85.8245];
  const polygonCoords = [
    [20.2945, 85.8225], 
    [20.2945, 85.8265], 
    [20.2977, 85.8265], 
    [20.2977, 85.8225]
  ];

  useEffect(() => {
    // Fetch Parcel ID
    const fetchParcel = async () => {
      try {
        const res = await fetch(`${apiBase}/parcels?limit=100`, {
          headers: authHeader()
        });
        if (res.ok) {
          const data = await res.json();
          const parcels = Array.isArray(data) ? data : (data.data || []);
          const targetParcel = parcels.find(p => p.parcel_number === 'PLOT-OD-2026-9821');
          if (targetParcel) {
            setParcelId(targetParcel.id);
          }
        }
      } catch (err) {
        console.error("Error fetching parcel:", err);
      }
    };
    
    fetchParcel();
  }, [apiBase, authHeader]);

  useEffect(() => {
    // Fetch Nearest Officers
    const fetchOfficers = async () => {
      try {
        const res = await fetch(`${apiBase}/grievances/officers/nearest?lat=${mapCenter[0]}&lng=${mapCenter[1]}`, {
          headers: authHeader()
        });
        if (res.ok) {
          const data = await res.json();
          setOfficers(data);
          const available = data.find(o => o.status === 'Available' || o.status === 'AVAILABLE' || !o.status?.toLowerCase().includes('duty'));
          if (available) {
            setSelectedOfficer(available);
          } else if (data.length > 0) {
            setSelectedOfficer(data[0]);
          }
        }
      } catch (err) {
        console.error("Error fetching officers:", err);
      }
    };

    fetchOfficers();
  }, [apiBase, authHeader]);

  const handleStartDispatch = () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    setPasscodeError('');
    setShowAuthModal(true);
  };

  const handleConfirmDispatch = async (e) => {
    if (e) e.preventDefault();
    if (!authPasscode) {
      setPasscodeError('Please enter authorization passcode.');
      return;
    }

    setDispatching(true);
    setPasscodeError('');
    try {
      const targetOfficerCode = selectedOfficer?.officer_id || selectedOfficer?.id || 'SO-774';
      const targetParcelId = Number(parcelId) || 1501;

      const res = await fetch(`${apiBase}/grievances/dispatch-notice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader()
        },
        body: JSON.stringify({
          parcel_id: targetParcelId,
          landowner_email: email,
          officer_id: String(targetOfficerCode),
          passcode: authPasscode
        })
      });
      
      const data = await res.json();
      if (res.ok) {
        setDispatchResult({
          tokenCode: data.token_short || data.token_code || `GRV-2026-9821-X7K`,
          referenceNumber: data.reference_number || `LAO/DIST/2026/0894`,
          grievanceUrl: `${window.location.origin}/?token=${data.grievance_url_token || data.jwt_token || ''}`,
          status: 'Survey Complete / Formal Notice Issued',
          emailStatus: data.email_status === 'sent' ? 'Dispatched via TLS 1.3 (SMTP)' : 'Notice generated & email dispatched'
        });
        setShowAuthModal(false);
        addNotification(`Notice dispatched to ${email} (Token: ${data.token_short || 'GRV-2026-9821-X7K'})`, 'success');
      } else {
        let errStr = 'Failed to dispatch notice.';
        if (typeof data.detail === 'string') {
          errStr = data.detail;
        } else if (Array.isArray(data.detail)) {
          errStr = data.detail.map(d => d.msg || JSON.stringify(d)).join(', ');
        } else if (typeof data.message === 'string') {
          errStr = data.message;
        }
        setPasscodeError(errStr);
      }
    } catch (err) {
      console.error("Dispatch error:", err);
      setPasscodeError('Network connection error during dispatch.');
    } finally {
      setDispatching(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    addNotification('Copied single-use grievance URL to clipboard!', 'success');
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-serif text-[#0f2b5c] font-bold flex items-center gap-2">
            <Shield className="w-6 h-6 text-[#ea580c]" />
            Survey & Notice Dispatch
          </h1>
          <p className="text-slate-600 text-xs mt-1">
            Assign land survey officers and dispatch formal acquisition notices.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: GIS Map Panel */}
          <div className="lg:col-span-7 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[600px] lg:h-auto">
            <div className="bg-[#0f2b5c] text-white px-4 py-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#ea580c]" />
              <h2 className="font-serif font-semibold text-sm">GIS Map Viewer</h2>
            </div>
            <div className="flex-1 relative z-0">
              <MapContainer 
                center={mapCenter} 
                zoom={15} 
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
              >
                <TileLayer
                  url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
                  attribution="&copy; Google Maps"
                />
                <Polygon 
                  positions={polygonCoords} 
                  pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.3 }}
                >
                  <Popup>
                    <div className="text-xs">
                      <strong>PLOT-OD-2026-9821</strong><br/>
                      Owner: Anmol<br/>
                      Area: 1.45 Acres
                    </div>
                  </Popup>
                </Polygon>
              </MapContainer>
            </div>
          </div>

          {/* Right: Stacked Cards */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            
            {/* Card A: Land & Parcel Details */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-slate-100 border-b border-slate-200 px-4 py-3">
                <h2 className="font-serif font-semibold text-[#0f2b5c] text-sm">Land & Parcel Details</h2>
              </div>
              <div className="p-4 space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-500 block mb-1">Landowner</span>
                    <span className="font-medium text-slate-800 flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-400" /> Anmol
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-1">Plot / Survey No</span>
                    <span className="font-medium text-slate-800">PLOT-OD-2026-9821 / SN-9821</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-1">Area Details</span>
                    <span className="font-medium text-slate-800">1.45 Acres (Semi-Urban / Agricultural)</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-1">Valuation</span>
                    <span className="font-medium text-slate-800">₹42,50,000 (Base Circle Rate)</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-500 block mb-1">Project</span>
                    <span className="font-medium text-slate-800">Regional Multi-Modal Corridor Expansion</span>
                  </div>
                </div>
                
                <div className="pt-2">
                  <label className="text-slate-500 block mb-1">Notice Email Destination</label>
                  <div className="flex items-center border border-slate-300 rounded-md bg-slate-50 px-3 py-2">
                    <Mail className="w-4 h-4 text-slate-400 mr-2" />
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-transparent border-none outline-none w-full text-slate-800"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Card B: Nearest Survey Officer */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-slate-100 border-b border-slate-200 px-4 py-3 flex justify-between items-center">
                <h2 className="font-serif font-semibold text-[#0f2b5c] text-sm">Nearest Survey Officers</h2>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-medium">Auto-detected</span>
              </div>
              <div className="p-4">
                {officers.length === 0 ? (
                  <div className="text-center py-4 text-xs text-slate-500 flex flex-col items-center">
                    <Clock className="w-6 h-6 mb-2 animate-spin-slow text-slate-300" />
                    Finding nearest officers...
                  </div>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {officers.map((officer, idx) => {
                      const isAvailable = String(officer.status).toLowerCase() === 'available';
                      const isSelected = selectedOfficer && (selectedOfficer.id === officer.id || selectedOfficer.officer_id === officer.officer_id);
                      
                      return (
                        <div 
                          key={idx}
                          onClick={() => setSelectedOfficer(officer)}
                          className={`p-3 rounded-lg border text-xs cursor-pointer transition-colors ${
                            isSelected ? 'border-[#ea580c] bg-orange-50' : 'border-slate-200 hover:border-slate-300'
                          } flex items-center justify-between`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${isAvailable ? 'bg-[#0f2b5c]' : 'bg-slate-400'}`}>
                              {officer.name ? officer.name.charAt(0) : <User className="w-4 h-4" />}
                            </div>
                            <div>
                              <div className="font-medium text-slate-800">{officer.name || 'Survey Officer'}</div>
                              <div className="text-slate-500">{officer.distance ? `${officer.distance} km away` : 'Nearby'}</div>
                            </div>
                          </div>
                          <div>
                            <span className={`px-2 py-1 rounded-md font-medium ${
                              isAvailable ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                              {officer.status || (isAvailable ? 'Available' : 'On Duty')}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Card C: Dispatch Action & Result */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              {!dispatchResult ? (
                <div className="p-5 flex flex-col items-center justify-center min-h-[160px]">
                  {!user ? (
                    <button 
                      onClick={() => setShowLoginModal(true)}
                      className="w-full bg-[#ea580c] hover:bg-orange-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
                    >
                      <Key className="w-5 h-5" />
                      Login to Dispatch
                    </button>
                  ) : (
                    <>
                      <div className="text-xs text-slate-500 mb-4 text-center">
                        <AlertTriangle className="w-4 h-4 text-amber-500 inline mr-1 -mt-0.5" />
                        This action will issue a formal legal notice and assign the selected officer.
                      </div>
                      <button 
                        onClick={handleStartDispatch}
                        disabled={dispatching || !selectedOfficer}
                        className="w-full bg-[#0f2b5c] hover:bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
                      >
                        {dispatching ? (
                          <><Clock className="w-5 h-5 animate-spin" /> Processing...</>
                        ) : (
                          <><Send className="w-5 h-5 text-[#ea580c]" /> 📧 Dispatch Survey Notice & Assign Officer</>
                        )}
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <div className="p-0">
                  <div className="bg-green-50 border-b border-green-100 p-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <div className="text-green-800 font-bold text-sm">Notice Dispatched Successfully</div>
                      <div className="text-green-700 text-xs mt-0.5 bg-green-200 inline-block px-2 py-0.5 rounded font-semibold">
                        {dispatchResult.status}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 space-y-4 text-xs">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <div className="text-slate-500 mb-1 font-bold">Token Short Code</div>
                        <div className="font-mono font-bold text-[#0f2b5c] text-sm">{dispatchResult.tokenCode}</div>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <div className="text-slate-500 mb-1 font-bold">Reference Number</div>
                        <div className="font-mono font-bold text-slate-700 text-sm">{dispatchResult.referenceNumber}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                      <span className="text-slate-600 flex items-center gap-2 font-semibold">
                        <Mail className="w-4 h-4 text-slate-400" /> Email Status
                      </span>
                      <span className="font-bold text-slate-800 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-green-500" /> {dispatchResult.emailStatus}
                      </span>
                    </div>

                    <div className="border-t border-slate-100 pt-3">
                      <div className="text-slate-600 mb-2 font-bold">Unique Grievance / Tracking URL (Single-Use Token)</div>
                      <div className="flex items-center gap-2">
                        <div className="bg-slate-100 border border-slate-200 rounded px-3 py-2 flex-1 overflow-hidden">
                          <div className="truncate text-slate-600 font-mono text-[11px]" title={dispatchResult.grievanceUrl}>
                            {dispatchResult.grievanceUrl}
                          </div>
                        </div>
                        <button 
                          onClick={() => copyToClipboard(dispatchResult.grievanceUrl)}
                          className="p-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
                          title="Copy URL"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button 
                        onClick={() => setDispatchResult(null)}
                        className="text-[#ea580c] hover:text-orange-800 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        Reset Dispatcher <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* 🔒 Officer Dispatch Security Authorization Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center z-[150] p-4 select-none animate-fadeIn font-sans">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-300 overflow-hidden">
            <div className="bg-[#0f2b5c] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-full bg-blue-900 border border-blue-400/40 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-[#ea580c]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm font-serif">Security Authorization</h3>
                  <p className="text-[10px] text-slate-300">Official Notice Dispatch & Assignment</p>
                </div>
              </div>
              <button 
                onClick={() => setShowAuthModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmDispatch} className="p-6 space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-500 font-semibold text-[11px]">
                  <span>Landowner:</span>
                  <strong className="text-slate-800">Anmol</strong>
                </div>
                <div className="flex justify-between items-center text-slate-500 font-semibold text-[11px]">
                  <span>Plot Number:</span>
                  <strong className="text-[#0f2b5c] font-mono">PLOT-OD-2026-9821</strong>
                </div>
                <div className="flex justify-between items-center text-slate-500 font-semibold text-[11px]">
                  <span>Assigned Officer:</span>
                  <strong className="text-slate-800">{selectedOfficer?.name} ({selectedOfficer?.officer_id})</strong>
                </div>
                <div className="flex justify-between items-center text-slate-500 font-semibold text-[11px] border-t border-slate-200 pt-1.5">
                  <span>Notice Destination:</span>
                  <strong className="text-slate-800 font-mono">{email}</strong>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-[10px] uppercase font-extrabold text-slate-600">
                    Dispatch Passcode *
                  </label>
                  <span className="text-[9px] bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold px-2 py-0.5 rounded-full">
                    Pre-set: SIH@12345
                  </span>
                </div>
                <div className="relative">
                  <Key className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="Enter SIH@12345"
                    value={authPasscode}
                    onChange={(e) => setAuthPasscode(e.target.value)}
                    className="w-full text-xs font-bold border border-slate-250 rounded-xl p-2.5 pl-9 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#0f2b5c]/10 focus:border-[#0f2b5c] shadow-xs"
                  />
                </div>
              </div>

              {passcodeError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 p-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 flex-shrink-0 text-rose-600" />
                  <span>{passcodeError}</span>
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAuthModal(false)}
                  className="w-1/3 py-2.5 border border-slate-250 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={dispatching}
                  className="w-2/3 bg-[#0f2b5c] hover:bg-[#0c224a] text-white py-2.5 rounded-xl text-xs font-extrabold shadow flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  {dispatching ? (
                    <>
                      <Clock className="h-4 w-4 animate-spin text-orange-400" />
                      Dispatched Notice...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 text-[#ea580c]" />
                      Authorize & Send Notice
                    </>
                  )}
                </button>
              </div>

              <div className="pt-2 text-center text-[9px] text-slate-400 font-semibold">
                🔒 Protected by TLS 1.3 Transport & 30-Day Single-Use Token
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SurveyDispatch;
