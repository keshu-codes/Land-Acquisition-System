import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  FileText, Plus, ArrowRight, CheckCircle, ShieldAlert, AlertCircle, Map, 
  Award, Key, Sparkles, Building2, Globe, File, Eye, Printer, X
} from 'lucide-react';

export default function ProposalWorkflow() {
  const { 
    proposals, 
    selectedRole, 
    createProposal, 
    advanceWorkflow,
    walletConnected,
    language,
    t,
    user,
    setShowLoginModal
  } = useContext(AppContext);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newAgency, setNewAgency] = useState("National Highways Authority of India (NHAI)");
  const [newState, setNewState] = useState("Uttar Pradesh");
  const [newDistrict, setNewDistrict] = useState("");
  const [newArea, setNewArea] = useState("");
  const [newBudget, setNewBudget] = useState("");
  const [newAffected, setNewAffected] = useState("");
  const [newDisplaced, setNewDisplaced] = useState("");

  // Gazette/Document Modal States
  const [gazetteOpen, setGazetteOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  const submitForm = (e) => {
    e.preventDefault();
    if (!newTitle || !newDistrict || !newArea || !newBudget || !newAffected) {
      alert("Please fill all mandatory fields.");
      return;
    }
    
    createProposal({
      title: newTitle,
      agency: newAgency,
      state: newState,
      district: newDistrict,
      areaRequired: parseFloat(newArea),
      budgetAssessed: parseFloat(newBudget),
      affectedFamilies: parseInt(newAffected),
      displacedFamilies: parseInt(newDisplaced || 0),
    });

    // Reset Form
    setNewTitle("");
    setNewDistrict("");
    setNewArea("");
    setNewBudget("");
    setNewAffected("");
    setNewDisplaced("");
    setShowAddForm(false);
  };

  const getNextStageInfo = (status) => {
    switch (status) {
      case "Proposal Submitted":
        return { 
          index: 1, 
          label: language === 'en' ? "Verify GIS Boundaries" : "जीआईएस सीमाओं को सत्यापित करें", 
          roleRequired: "state", 
          executor: language === 'en' ? "State GIS Department" : "राज्य जीआईएस विभाग" 
        };
      case "GIS Verification":
        return { 
          index: 2, 
          label: language === 'en' ? "Issue Section 11 Notification" : "धारा 11 अधिसूचना जारी करें", 
          roleRequired: "district", 
          executor: language === 'en' ? "District Magistrate" : "जिला मजिस्ट्रेट" 
        };
      case "Section 11 Notification":
        return { 
          index: 3, 
          label: language === 'en' ? "Declare Compensation Award" : "मुआवजा पंचाट घोषित करें", 
          roleRequired: "district", 
          executor: language === 'en' ? "Land Acquisition Officer" : "भूमि अर्जन अधिकारी" 
        };
      case "Award Declared":
        return { 
          index: 4, 
          label: language === 'en' ? "Complete Possession Handover" : "कब्जा सौंपना पूरा करें", 
          roleRequired: "surveyor", 
          executor: language === 'en' ? "Field Surveyor" : "फील्ड सर्वेयर" 
        };
      case "Possession Handover":
        return null; // Fully complete
      default:
        return null;
    }
  };

  const openDocument = (proj, stageName) => {
    let docTitle = "";
    let content = null;

    const formattedDate = new Date().toLocaleDateString('en-IN', {
      day: '2-digit', month: 'long', year: 'numeric'
    });

    if (stageName === "Proposal Submitted") {
      docTitle = language === 'en' ? "Form 1: Project Acquisition Request" : "प्रारूप 1: भूमि अर्जन मांग पत्र";
      content = (
        <div className="space-y-4 font-serif text-slate-800 text-xs leading-relaxed">
          <div className="text-center font-bold text-sm tracking-wide uppercase border-b border-slate-350 pb-2">
            {language === 'en' ? (
              <>
                FORM I<br/>
                [See Rule 3(1)]<br/>
                REQUISITION FOR LAND ACQUISITION
              </>
            ) : (
              <>
                प्रपत्र I<br/>
                [नियम 3(1) देखें]<br/>
                भूमि अर्जन के लिए मांग पत्र
              </>
            )}
          </div>
          <div className="space-y-2 mt-4">
            <p><strong>{language === 'en' ? "From" : "प्रेषक"}:</strong> {proj.agency}</p>
            <p><strong>{language === 'en' ? "To" : "सेवा में"}:</strong> {language === 'en' ? "Land Acquisition Collector / District Magistrate" : "भूमि अर्जन कलेक्टर / जिला मजिस्ट्रेट"}, {proj.district}, {proj.state}</p>
            <p className="indent-8 mt-2">
              {language === 'en' ? (
                <>It is requested that the land specified in the schedule hereto be acquired for the public purpose of building: <strong>{proj.title}</strong>.</>
              ) : (
                <>अनुरोध है कि इसके साथ अनुसूची में निर्दिष्ट भूमि को निम्नलिखित सार्वजनिक हित निर्माण के लिए अधिग्रहित किया जाए: <strong>{proj.title}</strong>।</>
              )}
            </p>
            <table className="w-full border-collapse border border-slate-400 mt-4 text-[10px]">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-400 p-2">{language === 'en' ? "Item" : "विवरण"}</th>
                  <th className="border border-slate-400 p-2">{language === 'en' ? "Details" : "मूल्य"}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-400 p-2 font-semibold">{language === 'en' ? "State / District" : "राज्य / जिला"}</td>
                  <td className="border border-slate-400 p-2">{proj.state} / {proj.district}</td>
                </tr>
                <tr>
                  <td className="border border-slate-400 p-2 font-semibold">{language === 'en' ? "Total Area Required" : "कुल आवश्यक क्षेत्र"}</td>
                  <td className="border border-slate-400 p-2">{proj.areaRequired} Hectares / हेक्टेयर</td>
                </tr>
                <tr>
                  <td className="border border-slate-400 p-2 font-semibold">{language === 'en' ? "Estimated Budget" : "अनुमानित बजट"}</td>
                  <td className="border border-slate-400 p-2">₹{proj.budgetAssessed} Crore / करोड़</td>
                </tr>
                <tr>
                  <td className="border border-slate-400 p-2 font-semibold">{language === 'en' ? "Affected Families" : "प्रभावित परिवार"}</td>
                  <td className="border border-slate-400 p-2">{proj.affectedFamilies} Families / परिवार</td>
                </tr>
              </tbody>
            </table>
            <div className="pt-6 text-right font-semibold">
              {language === 'en' ? "For" : "कृते"}: {proj.agency}<br/>
              <span className="text-[10px] text-slate-450 font-normal">
                {language === 'en' ? "Digitally Signed & Synced via National Portal" : "डिजिटल रूप से हस्ताक्षरित एवं राष्ट्रीय पोर्टल पर सिंक किया गया"}
              </span>
            </div>
          </div>
        </div>
      );
    } else if (stageName === "GIS Verification") {
      docTitle = language === 'en' ? "Certificate of Spatial Boundary Audit" : "स्थानिक सीमा लेखापरीक्षा प्रमाणपत्र";
      content = (
        <div className="space-y-4 font-serif text-slate-800 text-xs leading-relaxed">
          <div className="text-center font-bold text-sm tracking-wide uppercase border-b border-slate-350 pb-2">
            {language === 'en' ? (
              <>
                STATE REMOTE SENSING APPLICATION CENTRE<br/>
                <span className="text-xs">GEOSPATIAL AUDIT DIVISION</span>
              </>
            ) : (
              <>
                राज्य सुदूर संवेदन अनुप्रयोग केंद्र<br/>
                <span className="text-xs">भू-स्थानिक लेखापरीक्षा प्रभाग</span>
              </>
            )}
          </div>
          <div className="space-y-3 mt-4">
            <p><strong>{language === 'en' ? "Project Code" : "परियोजना कोड"}:</strong> {proj.id}</p>
            <p><strong>{language === 'en' ? "Project Name" : "परियोजना का नाम"}:</strong> {proj.title}</p>
            <p><strong>{language === 'en' ? "Verification Status" : "सत्यापन स्थिति"}:</strong> <span className="text-emerald-700 font-extrabold uppercase">{language === 'en' ? "APPROVED" : "स्वीकृत"}</span></p>
            <p className="indent-8 mt-2">
              {language === 'en' ? (
                <>This is to certify that the digital coordinates submitted for the land acquisition boundaries have been cross-checked with the state cadastral database (<strong>BhuNaksha</strong>). No spatial boundary overlaps or registry disputes were detected in the designated parcels.</>
              ) : (
                <>यह प्रमाणित किया जाता है कि भूमि अर्जन सीमाओं के लिए प्रस्तुत डिजिटल निर्देशांक की राज्य कैडस्ट्राल डेटाबेस (<strong>भू-नक्शा</strong>) के साथ क्रॉस-चेक किया गया है। निर्दिष्ट पार्सल में कोई स्थानिक ओवरलैप या सीमा विवाद नहीं पाया गया।</>
              )}
            </p>
            <div className="bg-slate-50 border border-slate-200 p-3 rounded font-mono text-[9px] text-slate-500">
              <strong>Ledger Entry Block:</strong> 105241<br/>
              <strong>Boundary Geofence Hash (SHA-256):</strong> 8a5d3f20e48bbd912f2c8d20e48bbd912f2c8d20e48bbd912f2c8d
            </div>
            <div className="pt-6 text-right font-semibold">
              {language === 'en' ? "Director of Space Applications" : "निदेशक, अंतरिक्ष अनुप्रयोग केंद्र"}<br/>
              {language === 'en' ? "State GIS Authority Node" : "राज्य जीआईएस प्राधिकरण नोड"}
            </div>
          </div>
        </div>
      );
    } else if (stageName === "Section 11 Notification") {
      docTitle = language === 'en' ? "The Gazette of India: Official Notification" : "भारत का राजपत्र: आधिकारिक अधिसूचना";
      content = (
        <div className="space-y-4 text-slate-800 leading-normal font-serif text-[11px] p-2">
          {/* Gazette Header */}
          <div className="text-center border-b-4 border-double border-slate-900 pb-3">
            <span className="text-lg font-bold block leading-none font-serif tracking-wider">भारत का राजपत्र</span>
            <span className="text-xl font-extrabold block leading-none font-serif tracking-wide mt-1">The Gazette of India</span>
            <div className="flex justify-between text-[9px] font-sans font-bold border-t border-slate-300 mt-2 pt-1 uppercase">
              <span>असाधारण / EXTRAORDINARY</span>
              <span>भाग II — खण्ड 3 — उप-खण्ड (ii)</span>
              <span>प्राधिकार से प्रकाशित</span>
            </div>
            <div className="text-[9px] font-sans font-bold border-t border-slate-300 py-0.5 uppercase">
              PUBLISHED BY AUTHORITY
            </div>
            <div className="border-t border-slate-350 text-[9px] font-sans py-1 font-semibold">
              नई दिल्ली, {formattedDate} / NEW DELHI, {formattedDate}
            </div>
          </div>

          {/* Ministry / Notification Content */}
          <div className="text-center font-bold text-xs uppercase space-y-1 mt-4">
            <div>सड़क परिवहन और राजमार्ग मंत्रालय</div>
            <div>MINISTRY OF ROAD TRANSPORT & HIGHWAYS</div>
            <div className="text-[10px] font-normal lowercase font-serif mt-1">अधिसूचना / NOTIFICATION</div>
            <div className="text-[10px] font-normal lowercase font-serif">नई दिल्ली, {formattedDate}</div>
          </div>

          <div className="space-y-3 mt-4 text-justify leading-relaxed">
            <p>
              <strong>S.O. {proj.id.replace('PRJ-', '')} .—</strong> Whereas it appears to the Central Government that the land specified in the Schedule hereto is required for a public purpose, namely, for building, maintenance, management, and operation of <strong>{proj.title}</strong> in the state of <strong>{proj.state}</strong>.
            </p>
            <p>
              Now, therefore, in exercise of the powers conferred by Section 11 of the Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act, 2013, the Central Government hereby declares its intention to acquire the said land.
            </p>
            <p>
              Any person interested in the land may, within sixty days from the date of publication of this notification, object to the use of land, details of which are recorded securely in the national GIS land registry archive.
            </p>

            <div className="border-t border-slate-300 pt-3 mt-4">
              <h5 className="font-bold text-center text-xs uppercase mb-2">अनुसूची / THE SCHEDULE</h5>
              <p className="text-[10px] text-center">
                District: {proj.district} | State: {proj.state} | Total Extent: {proj.areaRequired} Hectares
              </p>
            </div>
          </div>

          <div className="pt-8 flex justify-between items-end font-sans">
            <div className="text-[9px] text-emerald-700 font-bold border border-emerald-350 p-2 bg-emerald-50 rounded uppercase">
              ✔ {language === 'en' ? "SEAL OF INTEGRITY" : "सत्यनिष्ठा की मुहर"}<br/>
              {language === 'en' ? "HASH SECURED ON-CHAIN" : "हैश ब्लॉकचेन पर सुरक्षित"}
            </div>
            <div className="text-right text-[10px] font-bold">
              By Order of the President,<br/>
              Collector & District Magistrate
            </div>
          </div>
        </div>
      );
    } else if (stageName === "Award Declared") {
      docTitle = language === 'en' ? "Land Compensation Award Decree" : "भूमि मुआवजा पंचाट डिक्री";
      content = (
        <div className="space-y-4 font-serif text-slate-800 text-xs leading-relaxed">
          <div className="text-center font-bold text-sm tracking-wide uppercase border-b border-slate-350 pb-2">
            {language === 'en' ? (
              <>
                OFFICE OF THE LAND ACQUISITION COLLECTOR<br/>
                <span className="text-xs">DISTRICT: {proj.district}, STATE: {proj.state}</span>
              </>
            ) : (
              <>
                भूमि अर्जन कलेक्टर का कार्यालय<br/>
                <span className="text-xs">जिला: {proj.district}, राज्य: {proj.state}</span>
              </>
            )}
          </div>
          <div className="space-y-2 mt-4">
            <p><strong>{language === 'en' ? "Reference Case ID" : "केस संदर्भ आईडी"}:</strong> LAC-{proj.id}</p>
            <p><strong>{language === 'en' ? "Award Declaration Date" : "पंचाट घोषणा की तिथि"}:</strong> {formattedDate}</p>
            <p className="indent-8 mt-2">
              {language === 'en' ? (
                <>In accordance with Section 23 of the LARR Act, 2013, the Collector has assessed the valuation of land parcels required for <strong>{proj.title}</strong>. The compensation award is hereby declared as follows:</>
              ) : (
                <>LARR अधिनियम, 2013 की धारा 23 के अनुसार, कलेक्टर ने <strong>{proj.title}</strong> के लिए आवश्यक भूमि पार्सल के मूल्य का आकलन किया है। मुआवजा पंचाट निम्नानुसार घोषित किया जाता है:</>
              )}
            </p>
            <table className="w-full border-collapse border border-slate-400 mt-4 text-[10px]">
              <tbody>
                <tr>
                  <td className="border border-slate-400 p-2 font-semibold bg-slate-50">{language === 'en' ? "Market Value of Land" : "भूमि का बाजार मूल्य"}</td>
                  <td className="border border-slate-400 p-2">₹{Math.round(proj.budgetAssessed * 0.4)} Crore / करोड़</td>
                </tr>
                <tr>
                  <td className="border border-slate-400 p-2 font-semibold bg-slate-50">{language === 'en' ? "Solatium (100% of Market Value)" : "सॉलेशियम (बाजार मूल्य का 100%)"}</td>
                  <td className="border border-slate-400 p-2">₹{Math.round(proj.budgetAssessed * 0.4)} Crore / करोड़</td>
                </tr>
                <tr>
                  <td className="border border-slate-400 p-2 font-semibold bg-slate-50">{language === 'en' ? "Assets / Crops / Building Value" : "परिसंपत्ति / फसल / भवन मूल्य"}</td>
                  <td className="border border-slate-400 p-2">₹{Math.round(proj.budgetAssessed * 0.2)} Crore / करोड़</td>
                </tr>
                <tr className="bg-indigo-50 font-bold">
                  <td className="border border-slate-400 p-2">{language === 'en' ? "Total Compensation Package" : "कुल मुआवजा पैकेज"}</td>
                  <td className="border border-slate-400 p-2">₹{proj.budgetAssessed} Crore / करोड़</td>
                </tr>
              </tbody>
            </table>
            <p className="text-[10px] mt-2">
              Note: The initial 10% escrow fund allocation (₹{proj.budgetDisbursed} Cr) has been initialized and secured in the smart escrow wallet.
            </p>
            <div className="pt-6 text-right font-semibold">
              Collector & District Magistrate<br/>
              LARR Competent Authority
            </div>
          </div>
        </div>
      );
    } else if (stageName === "Possession Handover") {
      docTitle = language === 'en' ? "Certificate of Title Vesting" : "स्वामित्व निहितीकरण प्रमाणपत्र";
      content = (
        <div className="space-y-4 font-serif text-slate-800 text-xs leading-relaxed">
          <div className="text-center font-bold text-sm tracking-wide uppercase border-b border-slate-350 pb-2">
            {language === 'en' ? (
              <>
                MINISTRY OF ROAD TRANSPORT & HIGHWAYS<br/>
                <span className="text-xs">NATIONAL INFRASTRUCTURE LAND REGISTRY</span>
              </>
            ) : (
              <>
                सड़क परिवहन और राजमार्ग मंत्रालय<br/>
                <span className="text-xs">राष्ट्रीय बुनियादी ढांचा भूमि रजिस्ट्री</span>
              </>
            )}
          </div>
          <div className="space-y-3 mt-4">
            <p><strong>{language === 'en' ? "Title Reference" : "स्वामित्व संदर्भ"}:</strong> TR-{proj.id}</p>
            <p><strong>{language === 'en' ? "Title Transfer Date" : "स्वामित्व हस्तांतरण तिथि"}:</strong> {formattedDate}</p>
            <p className="indent-8 mt-2">
              {language === 'en' ? (
                <>It is hereby certified that the land parcels measuring <strong>{proj.areaRequired} Hectares</strong> located in district <strong>{proj.district}</strong>, state of <strong>{proj.state}</strong> have been fully acquired, and absolute possession has been taken under Section 38 of the LARR Act, 2013.</>
              ) : (
                <>यह प्रमाणित किया जाता है कि जिला <strong>{proj.district}</strong>, राज्य <strong>{proj.state}</strong> में स्थित <strong>{proj.areaRequired} हेक्टेयर</strong> भूमि पार्सल को पूरी तरह से अधिग्रहित कर लिया गया है, और कब्जा प्राप्त किया गया है।</>
              )}
            </p>
            <p>
              The title deed, spatial coordinate Geofence, and associated records are hereby transferred and vested in the requesting agency: <strong>{proj.agency}</strong>.
            </p>
            <div className="bg-slate-50 border border-slate-200 p-3 rounded font-mono text-[9px] text-slate-500">
              <strong>On-Chain Deed Seal:</strong> TitleVested_SBF_NHAI_9921<br/>
              <strong>Block height:</strong> 105259
            </div>
            <div className="pt-6 text-right font-semibold">
              Authorized Signatory<br/>
              Central Land Acquisition Authority
            </div>
          </div>
        </div>
      );
    }

    setSelectedDoc({ title: docTitle, content, projectName: proj.title });
    setGazetteOpen(true);
  };

  const agencies = [
    "National Highways Authority of India (NHAI)",
    "Dedicated Freight Corridor Corporation (DFCCIL)",
    "Indian Railways",
    "Rewa Ultra Mega Solar Limited (RUMSL)",
    "Greater Noida Authority (GNIDA)",
    "Ministry of New and Renewable Energy (MNRE)"
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 font-sans select-none">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-[#0f2b5c] tracking-tight font-serif">{language === 'en' ? 'Land Acquisition Proposals' : 'भूमि अर्जन प्रस्ताव'}</h1>
          <p className="text-xs text-slate-500 font-semibold">{language === 'en' ? 'Automated Stakeholder Workflow Routing & Status Verification' : 'स्वचालित हितधारक कार्यप्रवाह मार्गनिर्देशन और स्थिति सत्यापन'}</p>
        </div>
        
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 bg-[#0f2b5c] hover:bg-[#0c224a] text-white px-4 py-2 rounded-lg text-xs font-bold shadow transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          {showAddForm ? t('hideForm') : t('newAcquisition')}
        </button>
      </div>

      {/* New Proposal Form */}
      {showAddForm && (
        <form onSubmit={submitForm} className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm space-y-4 max-w-3xl animate-fadeIn">
          <h3 className="font-bold text-[#0f2b5c] text-sm flex items-center gap-1.5 font-serif">
            <FileText className="h-4.5 w-4.5" />
            {t('createCase')}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-[9px] uppercase font-bold text-slate-400 mb-1">{t('proposalTitleLabel')}</label>
              <input
                type="text"
                required
                placeholder="e.g. NH-2 Extension Four Laning Project (Package A)"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full text-xs font-semibold border border-slate-250 rounded-lg p-2.5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#0f2b5c]/10 focus:border-[#0f2b5c] shadow-sm"
              />
            </div>

            <div>
              <label className="block text-[9px] uppercase font-bold text-slate-400 mb-1">{t('requestingAgency')}</label>
              <select
                value={newAgency}
                onChange={(e) => setNewAgency(e.target.value)}
                className="w-full text-xs font-bold border border-slate-250 rounded-lg p-2.5 bg-slate-50 focus:outline-none cursor-pointer shadow-sm"
              >
                {agencies.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-[9px] uppercase font-bold text-slate-400 mb-1">{t('targetState')}</label>
              <select
                value={newState}
                onChange={(e) => setNewState(e.target.value)}
                className="w-full text-xs font-bold border border-slate-250 rounded-lg p-2.5 bg-slate-50 focus:outline-none cursor-pointer shadow-sm"
              >
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="West Bengal">West Bengal</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
                <option value="Odisha">Odisha</option>
              </select>
            </div>

            <div>
              <label className="block text-[9px] uppercase font-bold text-slate-400 mb-1">{t('targetDistrict')}</label>
              <input
                type="text"
                required
                placeholder="e.g. Gautam Buddha Nagar"
                value={newDistrict}
                onChange={(e) => setNewDistrict(e.target.value)}
                className="w-full text-xs font-semibold border border-slate-250 rounded-lg p-2.5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#0f2b5c]/10 focus:border-[#0f2b5c] shadow-sm"
              />
            </div>

            <div>
              <label className="block text-[9px] uppercase font-bold text-slate-400 mb-1">{t('landRequiredHa')}</label>
              <input
                type="number"
                required
                min="1"
                placeholder="e.g. 250"
                value={newArea}
                onChange={(e) => setNewArea(e.target.value)}
                className="w-full text-xs font-semibold border border-slate-250 rounded-lg p-2.5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#0f2b5c]/10 focus:border-[#0f2b5c] shadow-sm"
              />
            </div>

            <div>
              <label className="block text-[9px] uppercase font-bold text-slate-400 mb-1">{t('estBudgetCr')}</label>
              <input
                type="number"
                required
                min="1"
                placeholder="e.g. 480"
                value={newBudget}
                onChange={(e) => setNewBudget(e.target.value)}
                className="w-full text-xs font-semibold border border-slate-250 rounded-lg p-2.5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#0f2b5c]/10 focus:border-[#0f2b5c] shadow-sm"
              />
            </div>

            <div>
              <label className="block text-[9px] uppercase font-bold text-slate-400 mb-1">{t('affectedFamiliesCount')}</label>
              <input
                type="number"
                required
                min="0"
                placeholder="e.g. 230"
                value={newAffected}
                onChange={(e) => setNewAffected(e.target.value)}
                className="w-full text-xs font-semibold border border-slate-250 rounded-lg p-2.5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#0f2b5c]/10 focus:border-[#0f2b5c] shadow-sm"
              />
            </div>

            <div>
              <label className="block text-[9px] uppercase font-bold text-slate-400 mb-1">{t('displacedRR')}</label>
              <input
                type="number"
                min="0"
                placeholder="e.g. 45"
                value={newDisplaced}
                onChange={(e) => setNewDisplaced(e.target.value)}
                className="w-full text-xs font-semibold border border-slate-250 rounded-lg p-2.5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#0f2b5c]/10 focus:border-[#0f2b5c] shadow-sm"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2.5 border-t border-slate-100 pt-4 mt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="bg-slate-100 text-slate-655 hover:bg-slate-200 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className="bg-[#0f2b5c] hover:bg-[#0c224a] text-white px-4 py-2 rounded-lg text-xs font-bold shadow flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Building2 className="h-4 w-4" />
              {t('registerProposal')}
            </button>
          </div>
        </form>
      )}

      {/* Role Notice Card */}
      <div className="bg-indigo-50/20 border border-indigo-150 p-4 rounded-xl shadow-sm flex items-start gap-4 text-slate-800">
        <Sparkles className="h-6 w-6 text-[#ea580c] flex-shrink-0 mt-0.5 animate-pulse" />
        <div className="flex-1">
          <div className="font-bold text-xs text-[#0f2b5c] uppercase tracking-wider">{t('simulationNotice')}</div>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed font-semibold">
            {language === 'en' 
              ? `Land acquisition involves multiple governing departments. To test the workflow routing, you can switch your user profile in the Navbar. Currently, you are acting as ` 
              : `भूमि अर्जन में कई सरकारी विभाग शामिल होते हैं। कार्यप्रवाह मार्ग का परीक्षण करने के लिए, आप नेविगेशन बार में अपना प्रोफ़ाइल बदल सकते हैं। वर्तमान में, आप इस रूप में कार्य कर रहे हैं: `}
            <strong className="text-[#ea580c] uppercase">{selectedRole}</strong>.
          </p>
        </div>
      </div>

      {/* Proposals list & Workflows */}
      <div className="space-y-4">
        {proposals.map((proj) => {
          const next = getNextStageInfo(proj.status);
          const isEligibleRole = next && (selectedRole === next.roleRequired || selectedRole === 'ministry');

          return (
            <div key={proj.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 hover:shadow-md transition-all">
              
              {/* Proposal Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-3.5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-[#0f2b5c] bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full">{proj.id}</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{proj.agency}</span>
                  </div>
                  <h3 className="font-bold text-slate-850 text-base mt-2 font-serif">{proj.title}</h3>
                  <div className="text-xs text-slate-500 font-semibold mt-1">
                    {language === 'en' ? 'Locality' : 'स्थान'}: <span className="text-slate-700 font-bold">{proj.district}, {proj.state}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{t('currentStage')}</span>
                  <span className="bg-slate-100 text-slate-800 border border-slate-200 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    {language === 'en' ? proj.status : t(proj.status)}
                  </span>
                </div>
              </div>

              {/* Progress Flow Graphic with Gazette Action Overlays */}
              <div className="grid grid-cols-5 gap-2 pt-2 text-center text-[10px] font-bold">
                {proj.timeline.map((step, idx) => {
                  const isCompleted = step.status === "completed";
                  const isActive = proj.status === step.stage;

                  return (
                    <div key={idx} className="relative flex flex-col items-center">
                      
                      {/* Document Viewer Icon overlays for completed steps */}
                      {isCompleted && (
                        <button 
                          onClick={() => openDocument(proj, step.stage)}
                          title={`View ${step.stage} Document`}
                          className="absolute -top-3 right-[calc(50%-18px)] bg-white border border-slate-250 p-1 rounded-full shadow hover:bg-slate-50 text-[#0f2b5c] z-20 cursor-pointer"
                        >
                          <Eye className="h-3 w-3" />
                        </button>
                      )}

                      <div className={`h-8 w-8 rounded-full border-2 flex items-center justify-center mb-1.5 z-10 font-bold text-xs ${
                        isCompleted 
                          ? 'bg-emerald-50 border-emerald-600 text-emerald-600' 
                          : isActive 
                            ? 'bg-[#0f2b5c] border-[#0f2b5c] text-white shadow' 
                            : 'bg-white border-slate-200 text-slate-350'
                      }`}>
                        {idx + 1}
                      </div>
                      
                      <span className={`block font-bold line-clamp-1 max-w-[90px] ${
                        isCompleted ? 'text-emerald-700' : isActive ? 'text-[#0f2b5c] font-extrabold' : 'text-slate-400'
                      }`}>
                        {language === 'en' ? step.stage.replace(' Notification', '').replace(' Handover', '') : t(step.stage).replace(' अधिसूचना', '').replace(' सौंपना', '')}
                      </span>
                      
                      {step.date && (
                        <span className="text-[8px] text-slate-400 font-semibold block mt-0.5">{step.date}</span>
                      )}

                      {/* Connector Line */}
                      {idx < proj.timeline.length - 1 && (
                        <div className={`absolute top-4 left-[calc(50%+16px)] w-[calc(100%-32px)] h-0.5 -z-0 ${
                          proj.timeline[idx + 1].status === "completed" 
                            ? 'bg-emerald-500' 
                            : 'bg-slate-100'
                        }`} />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Action area */}
              {next ? (
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-50 border border-slate-200/50 p-4 rounded-xl gap-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-bold text-slate-700 text-xs flex items-center gap-1.5">
                        {t('nextMilestone')}: {next.label}
                      </div>
                      <p className="text-[11px] text-slate-550 mt-0.5 font-semibold leading-relaxed">
                        {t('pendingVerification')} <strong className="text-slate-700 uppercase">{next.roleRequired === 'state' ? (language === 'en' ? 'State' : 'राज्य') : (language === 'en' ? 'Collector' : 'कलेक्टर')}</strong> ({next.executor}).
                      </p>
                    </div>
                  </div>

                  <div className="w-full sm:w-auto flex items-center justify-end gap-2.5">
                    {!user ? (
                      <button
                        onClick={() => setShowLoginModal(true)}
                        className="w-full sm:w-auto bg-[#ea580c] hover:bg-[#c2410c] text-white px-4 py-2.5 rounded-lg text-xs font-bold shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Key className="h-3.5 w-3.5" />
                        Login to Verify & Sign
                      </button>
                    ) : isEligibleRole ? (
                      <button
                        onClick={() => advanceWorkflow(proj.id, next.index, `${user.full_name} (${selectedRole.toUpperCase()})`)}
                        className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white px-4.5 py-2.5 rounded-lg text-xs font-bold shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        {t('verifySign')}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    ) : (
                      <div className="text-[10px] text-slate-400 bg-slate-100 border border-slate-200 px-3 py-2.5 rounded-lg font-bold flex items-center gap-1.5 shadow-inner">
                        <ShieldAlert className="h-3.5 w-3.5 text-slate-400" />
                        {t('roleRestricted')}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-emerald-50 border border-emerald-150 text-emerald-800 p-4 rounded-xl flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                  <div className="text-xs font-bold leading-relaxed">
                    <strong className="font-extrabold">{t('cycleCompleted')}</strong> {t('cycleCompletedSub')} {proj.agency}. 
                    <button 
                      onClick={() => openDocument(proj, "Possession Handover")}
                      className="text-emerald-700 hover:underline inline-flex items-center gap-1 ml-2 font-bold cursor-pointer font-serif"
                    >
                      <File className="h-3.5 w-3.5" />
                      {t('viewTitleDeed')}
                    </button>
                  </div>
                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* Gazette of India / Gazette Document Viewer Modal */}
      {gazetteOpen && selectedDoc && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[99] p-4 select-none animate-fadeIn font-sans">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-350 flex flex-col max-h-[85vh]">
            
            {/* Modal Header */}
            <div className="px-5 py-3 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <span className="font-extrabold text-[#0f2b5c] text-xs uppercase tracking-wider font-serif">
                {t('nationalDocRegistry')}
              </span>
              <button 
                onClick={() => setGazetteOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 hover:bg-slate-200 rounded-lg cursor-pointer"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Document Content Pane (Serif styled) */}
            <div className="flex-1 overflow-y-auto p-8 bg-white border-b border-slate-150">
              <div className="bg-[#FAF9F6] border border-slate-300 p-8 shadow-sm rounded max-w-xl mx-auto min-h-[400px]">
                {selectedDoc.content}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="px-5 py-3.5 bg-slate-50 rounded-b-xl flex justify-between items-center">
              <span className="text-[10px] text-slate-400 font-bold italic">
                Hash: SHA-256 Verified Ledger Record
              </span>
              <div className="flex gap-2.5">
                <button
                  onClick={() => window.print()}
                  className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-slate-100 cursor-pointer shadow-sm"
                >
                  <Printer className="h-3.5 w-3.5" />
                  {t('printDoc')}
                </button>
                <button
                  onClick={() => setGazetteOpen(false)}
                  className="bg-[#0f2b5c] hover:bg-[#0c224a] text-white px-4 py-2 rounded-lg text-xs font-bold cursor-pointer shadow-sm"
                >
                  {t('closeDoc')}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
