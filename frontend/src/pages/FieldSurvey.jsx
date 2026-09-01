import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  Compass, MapPin, Camera, CheckCircle, Smartphone, Map, 
  Upload, Layers, AlertCircle, RefreshCw, Key
} from 'lucide-react';

export default function FieldSurvey() {
  const { proposals, updateFieldSurvey, language, t, user, setShowLoginModal } = useContext(AppContext);
  const [selectedProjectId, setSelectedProjectId] = useState(proposals[0]?.id || "");
  const [gpsCoords, setGpsCoords] = useState(null); // { lat, lng }
  const [soilType, setSoilType] = useState("Alluvial");
  const [landStructures, setLandStructures] = useState("None");
  const [surveyNotes, setSurveyNotes] = useState("");
  const [isCapturingGPS, setIsCapturingGPS] = useState(false);
  const [photoSelected, setPhotoSelected] = useState(false);
  const [submittedStatus, setSubmittedStatus] = useState(false);

  useEffect(() => {
    if (!selectedProjectId && proposals && proposals.length > 0) {
      setSelectedProjectId(proposals[0].id);
    }
  }, [proposals, selectedProjectId]);

  const activeProj = proposals.find(p => p.id === selectedProjectId) || proposals[0];

  const detectLocation = () => {
    setIsCapturingGPS(true);

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGpsCoords({
            lat: parseFloat(position.coords.latitude.toFixed(6)),
            lng: parseFloat(position.coords.longitude.toFixed(6)),
            accuracy: Math.round(position.coords.accuracy) || 3
          });
          setIsCapturingGPS(false);
        },
        (error) => {
          console.warn("Browser GPS permission denied or timeout, using simulated parcel anchor:", error);
          // Fallback to active project coordinates or NIST Berhampur anchor
          const baseLat = activeProj?.coordinates?.[0]?.lat || 19.1843;
          const baseLng = activeProj?.coordinates?.[0]?.lng || 84.8524;
          
          setTimeout(() => {
            setGpsCoords({
              lat: parseFloat((baseLat + (Math.random() - 0.5) * 0.003).toFixed(6)),
              lng: parseFloat((baseLng + (Math.random() - 0.5) * 0.003).toFixed(6)),
              accuracy: Math.floor(Math.random() * 4) + 2
            });
            setIsCapturingGPS(false);
          }, 800);
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
      );
    } else {
      const baseLat = activeProj?.coordinates?.[0]?.lat || 19.1843;
      const baseLng = activeProj?.coordinates?.[0]?.lng || 84.8524;
      setTimeout(() => {
        setGpsCoords({
          lat: parseFloat((baseLat + (Math.random() - 0.5) * 0.003).toFixed(6)),
          lng: parseFloat((baseLng + (Math.random() - 0.5) * 0.003).toFixed(6)),
          accuracy: 3
        });
        setIsCapturingGPS(false);
      }, 1000);
    }
  };

  const handleSurveySubmit = (e) => {
    e.preventDefault();
    if (!gpsCoords) {
      alert("Please capture GPS Coordinates first to geo-tag the land.");
      return;
    }

    const detailsStr = `Soil: ${soilType}, Structures: ${landStructures}, Notes: ${surveyNotes || 'None'}`;
    updateFieldSurvey(selectedProjectId, `${gpsCoords.lat}, ${gpsCoords.lng}`, detailsStr);

    setSubmittedStatus(true);
    setTimeout(() => {
      setSubmittedStatus(false);
      setGpsCoords(null);
      setSurveyNotes("");
      setLandStructures("None");
      setPhotoSelected(false);
    }, 3000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 font-sans select-none">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-xl md:text-2xl font-extrabold text-[#0f2b5c] tracking-tight font-serif">{t('fieldSurveyTitle')}</h1>
        <p className="text-xs text-slate-500 font-semibold">{t('fieldSurveySub')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Intro/Instructions Column */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
            <h3 className="font-bold text-[#0f2b5c] text-xs flex items-center gap-1.5 border-b border-slate-100 pb-2.5 uppercase tracking-wider font-serif">
              <Compass className="h-4.5 w-4.5" />
              {t('guidelinesTitle')}
            </h3>
            
            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              {t('guidelinesSub')}
            </p>

            <ul className="text-xs text-slate-500 space-y-2.5 pt-2 font-bold">
              <li className="flex gap-2">
                <span className="bg-indigo-50 border border-indigo-150 text-[#0f2b5c] h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0">1</span>
                <span>{t('step1')}</span>
              </li>
              <li className="flex gap-2">
                <span className="bg-indigo-50 border border-indigo-150 text-[#0f2b5c] h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0">2</span>
                <span>{t('step2')}</span>
              </li>
              <li className="flex gap-2">
                <span className="bg-indigo-50 border border-indigo-150 text-[#0f2b5c] h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0">3</span>
                <span>{t('step3')}</span>
              </li>
            </ul>
          </div>

          {/* Interactive Responsive Phone Mode Preview */}
          <div className="bg-indigo-50/20 border border-indigo-150 text-slate-800 rounded-xl p-4 shadow-sm hidden lg:block">
            <h4 className="font-bold text-xs text-[#0f2b5c] flex items-center gap-1.5 uppercase tracking-wider mb-2.5 font-serif">
              <Smartphone className="h-4 w-4" />
              {t('mobilePreview')}
            </h4>
            <p className="text-[11px] text-slate-550 leading-relaxed font-semibold">
              {t('mobilePreviewSub')}
            </p>
          </div>
        </div>

        {/* Survey Form - Mobile Optimised Card */}
        <div className="lg:col-span-8">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="bg-slate-50 px-5 py-4 border-b border-slate-200 flex justify-between items-center">
              <span className="font-bold text-slate-700 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="h-4.5 w-4.5 text-[#0f2b5c]" />
                {t('verificationForm')}
              </span>
              <span className="text-[10px] bg-orange-50 border border-orange-200 text-orange-700 font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {t('stationActive')}
              </span>
            </div>

            {submittedStatus ? (
              <div className="p-8 text-center space-y-3 animate-fadeIn">
                <CheckCircle className="h-12 w-12 text-emerald-600 mx-auto" />
                <h3 className="font-bold text-slate-800 text-base">{t('surveySuccess')}</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto font-semibold">
                  {t('surveySuccessSub')}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSurveySubmit} className="p-5 space-y-4">
                
                {/* Project Selection */}
                <div>
                  <label className="block text-[9px] uppercase font-bold text-slate-400 mb-1">{t('targetProject')}</label>
                  <select
                    value={selectedProjectId}
                    onChange={(e) => {
                      setSelectedProjectId(e.target.value);
                      setGpsCoords(null);
                    }}
                    className="w-full text-xs font-bold border border-slate-250 rounded-lg p-2.5 bg-slate-50 focus:outline-none cursor-pointer shadow-sm"
                  >
                    {proposals.map(p => (
                      <option key={p.id} value={p.id}>{p.id} - {(p.title || "").substring(0, 45)}...</option>
                    ))}
                  </select>
                </div>

                {/* GPS Capture Widget */}
                <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-750 flex items-center gap-1.5 font-serif uppercase tracking-wider">
                      <MapPin className="h-4 w-4 text-[#0f2b5c]" />
                      {t('geoTracker')}
                    </span>
                    <button
                      type="button"
                      onClick={detectLocation}
                      disabled={isCapturingGPS}
                      className="bg-[#0f2b5c] hover:bg-[#0c224a] text-white disabled:bg-slate-200 disabled:text-slate-450 px-3.5 py-2 rounded text-[11px] font-bold shadow-sm transition-all flex items-center gap-1 cursor-pointer"
                    >
                      {isCapturingGPS ? (
                        <>
                          <RefreshCw className="h-3 w-3 animate-spin" />
                          {t('calibratingGPS')}
                        </>
                      ) : (
                        <>{t('detectGPS')}</>
                      )}
                    </button>
                  </div>

                  {gpsCoords ? (
                    <div className="grid grid-cols-3 gap-2 text-xs bg-white border border-slate-200 p-2.5 rounded-lg animate-fadeIn font-mono">
                      <div>
                        <span className="text-[9px] text-slate-400 block font-bold uppercase">Latitude</span>
                        <strong className="text-slate-700">{gpsCoords.lat}° N</strong>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 block font-bold uppercase">Longitude</span>
                        <strong className="text-slate-700">{gpsCoords.lng}° E</strong>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 block font-bold uppercase">GPS Margin</span>
                        <strong className="text-emerald-700">± {gpsCoords.accuracy}m</strong>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-amber-50 border border-amber-100 text-amber-800 p-3.5 rounded-lg flex items-start gap-2.5 text-xs font-semibold">
                      <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                      <p>
                        {t('noGPS')}
                      </p>
                    </div>
                  )}
                </div>

                {/* Valuation Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] uppercase font-bold text-slate-400 mb-1">{t('soilClass')}</label>
                    <select
                      value={soilType}
                      onChange={(e) => setSoilType(e.target.value)}
                      className="w-full text-xs font-bold border border-slate-250 rounded-lg p-2.5 bg-slate-50 focus:outline-none cursor-pointer shadow-sm"
                    >
                      <option value="Alluvial">{language === 'en' ? 'Alluvial (Highly Fertile)' : 'जलोढ़ मिट्टी (अत्यंत उपजाऊ)'}</option>
                      <option value="Black Cotton">{language === 'en' ? 'Black Cotton (Medium Fertile)' : 'काली कपास मिट्टी (मध्यम उपजाऊ)'}</option>
                      <option value="Red/Laterite">{language === 'en' ? 'Red / Laterite (Low Fertile)' : 'लाल / लेटेराइट मिट्टी (कम उपजाऊ)'}</option>
                      <option value="Barren/Rocky">{language === 'en' ? 'Barren / Rocky / Waste' : 'बंजर / पथरीली / बंजर भूमि'}</option>
                      <option value="Urban Industrial">{language === 'en' ? 'Urban / Developed / Commercial' : 'शहरी / विकसित / व्यावसायिक'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase font-bold text-slate-400 mb-1">{t('existingStructures')}</label>
                    <select
                      value={landStructures}
                      onChange={(e) => setLandStructures(e.target.value)}
                      className="w-full text-xs font-bold border border-slate-250 rounded-lg p-2.5 bg-slate-50 focus:outline-none cursor-pointer shadow-sm"
                    >
                      <option value="None">{language === 'en' ? 'None (Unbuilt Plot)' : 'कोई नहीं (बिना बना प्लॉट)'}</option>
                      <option value="Residential Kutcha">{language === 'en' ? 'Residential Kutcha Houses' : 'आवासीय कच्चा मकान'}</option>
                      <option value="Residential Pucca">{language === 'en' ? 'Residential Pucca Buildings' : 'आवासीय पक्का भवन'}</option>
                      <option value="Tube Well / Pump House">{language === 'en' ? 'Tube Well / Pump Irrigation House' : 'ट्यूबवेल / पंप सिंचाई घर'}</option>
                      <option value="Commercial Factory">{language === 'en' ? 'Commercial / Factory Sheds' : 'वाणिज्यिक / फैक्टरी शेड'}</option>
                    </select>
                  </div>
                </div>

                {/* Site Photo Upload */}
                <div>
                  <label className="block text-[9px] uppercase font-bold text-slate-400 mb-1">{t('photoUpload')}</label>
                  <div className="border border-slate-200 bg-slate-50/50 rounded-lg p-4 flex flex-col sm:flex-row items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setPhotoSelected(true)}
                      className="bg-white border border-slate-250 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Camera className="h-4 w-4 text-slate-400" />
                      {t('captureCamera')}
                    </button>
                    
                    <span className="text-xs text-slate-400 font-bold">
                      {photoSelected ? (
                        <strong className="text-emerald-700 flex items-center gap-1 font-bold">
                          <CheckCircle className="h-4 w-4" />
                          IMG_SURVEY_3910.jpg {t('attached')}
                        </strong>
                      ) : (
                        t('noPhoto')
                      )}
                    </span>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-[9px] uppercase font-bold text-slate-400 mb-1">{t('fieldNotes')}</label>
                  <textarea
                    rows="3"
                    placeholder={t('notesPlaceholder')}
                    value={surveyNotes}
                    onChange={(e) => setSurveyNotes(e.target.value)}
                    className="w-full text-xs font-semibold border border-slate-250 rounded-lg p-2.5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#0f2b5c]/10 focus:border-[#0f2b5c] shadow-sm"
                  />
                </div>

                {/* Submit button */}
                {!user ? (
                  <button
                    type="button"
                    onClick={() => setShowLoginModal(true)}
                    className="w-full bg-[#ea580c] text-white hover:bg-[#c2410c] py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                  >
                    <Key className="h-4 w-4" />
                    Login to Submit Field Survey
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="w-full bg-[#0f2b5c] text-white hover:bg-[#0c224a] py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                  >
                    <Upload className="h-4 w-4 text-emerald-400" />
                    {t('submitSurvey')}
                  </button>
                )}

              </form>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
