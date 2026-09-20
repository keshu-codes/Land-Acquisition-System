import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import ThreeDViewer from '../components/ThreeDViewer';
import { 
  Box, 
  Upload, 
  MapPin, 
  Building2, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Eye, 
  FileText, 
  Compass, 
  ShieldCheck 
} from 'lucide-react';
import { MapContainer, TileLayer, Polygon, Marker, Popup, useMap, SVGOverlay } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet Default Marker Icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function MapRecenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 16);
    }
  }, [center, map]);
  return null;
}

function parseGeoJSONCoords(geojsonStr) {
  if (!geojsonStr) {
    return {
      center: [20.2961, 85.8245],
      polygon: [
        [20.2945, 85.8225],
        [20.2945, 85.8265],
        [20.2977, 85.8265],
        [20.2977, 85.8225],
      ]
    };
  }
  try {
    const geo = typeof geojsonStr === 'string' ? JSON.parse(geojsonStr) : geojsonStr;
    if (geo.type === 'Polygon' && geo.coordinates && geo.coordinates[0]) {
      const coords = geo.coordinates[0].map(([lon, lat]) => [lat, lon]);
      const centerLat = coords.reduce((sum, c) => sum + c[0], 0) / coords.length;
      const centerLon = coords.reduce((sum, c) => sum + c[1], 0) / coords.length;
      return { center: [centerLat, centerLon], polygon: coords };
    }
  } catch (e) {
    console.error("GeoJSON parse error", e);
  }
  return {
    center: [20.2961, 85.8245],
    polygon: [
      [20.2945, 85.8225],
      [20.2945, 85.8265],
      [20.2977, 85.8265],
      [20.2977, 85.8225],
    ]
  };
}

// Isometric 3D Building Overlay rendered directly ON the map parcel
function Building3DMapOverlay({ parcel, floors, buildingType }) {
  const pCoords = parseGeoJSONCoords(parcel.geojson_geometry);
  const lats = pCoords.polygon.map(c => c[0]);
  const lngs = pCoords.polygon.map(c => c[1]);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const latSpan = maxLat - minLat;
  const lngSpan = maxLng - minLng;

  // Extend bounds upward (north) to show building height rising from the parcel
  const heightExt = latSpan * (0.8 + floors * 0.25);
  const depthExt = lngSpan * 0.35;
  const bounds = [
    [minLat - latSpan * 0.05, minLng - lngSpan * 0.05],
    [maxLat + heightExt, maxLng + depthExt]
  ];

  // SVG coordinate system
  const vw = 200;
  const vh = 300;
  const w = 90;           // front face width
  const isoDx = 42;       // isometric depth x-offset
  const isoDy = 22;       // isometric depth y-offset
  const floorH = Math.min(28, 200 / Math.max(floors, 1));
  const totalH = floors * floorH;
  const bx = 25;          // base x
  const by = vh - 15;     // base y (bottom)

  // Build SVG paths
  const frontFace = `M${bx},${by} L${bx + w},${by} L${bx + w},${by - totalH} L${bx},${by - totalH} Z`;
  const rightFace = `M${bx + w},${by} L${bx + w + isoDx},${by - isoDy} L${bx + w + isoDx},${by - isoDy - totalH} L${bx + w},${by - totalH} Z`;
  const topFace = `M${bx},${by - totalH} L${bx + w},${by - totalH} L${bx + w + isoDx},${by - totalH - isoDy} L${bx + isoDx},${by - totalH - isoDy} Z`;

  // Shadow polygon
  const shadow = `${bx + 5},${by + 3} ${bx + w + 15},${by + 8} ${bx + w + isoDx + 15},${by + 8 - isoDy} ${bx + isoDx + 5},${by + 3 - isoDy}`;

  // Generate floor lines and windows
  const floorLines = [];
  const frontWindows = [];
  const sideWindows = [];

  for (let f = 0; f < floors; f++) {
    const fy = by - f * floorH;

    // Floor divider line (front)
    if (f > 0) {
      floorLines.push(
        <line key={`ffl-${f}`} x1={bx} y1={fy} x2={bx + w} y2={fy} stroke="#0f172a" strokeWidth="0.7" opacity="0.6" />,
        <line key={`frl-${f}`} x1={bx + w} y1={fy} x2={bx + w + isoDx} y2={fy - isoDy} stroke="#0f172a" strokeWidth="0.7" opacity="0.6" />
      );
    }

    // Front face windows (3 window columns per floor)
    const winW = (w - 16) / 3;
    for (let wc = 0; wc < 3; wc++) {
      const wx = bx + 5 + wc * (winW + 2);
      frontWindows.push(
        <rect key={`fwin-${f}-${wc}`} x={wx} y={fy - floorH + 4} width={winW - 2} height={floorH - 8}
          fill="rgba(56,189,248,0.55)" stroke="rgba(255,255,255,0.35)" strokeWidth="0.6" rx="1" />
      );
    }

    // Right side windows (2 window columns)
    const sWinW = (isoDx - 10) / 2;
    for (let sc = 0; sc < 2; sc++) {
      const sx1 = bx + w + 4 + sc * (sWinW + 2);
      const sxOff = ((sx1 - bx - w) / isoDx) * isoDy;
      sideWindows.push(
        <polygon key={`swin-${f}-${sc}`}
          points={`${sx1},${fy - 4 - sxOff} ${sx1 + sWinW - 2},${fy - 4 - sxOff - ((sWinW - 2) / isoDx) * isoDy} ${sx1 + sWinW - 2},${fy - floorH + 4 - sxOff - ((sWinW - 2) / isoDx) * isoDy} ${sx1},${fy - floorH + 4 - sxOff}`}
          fill="rgba(56,189,248,0.35)" stroke="rgba(255,255,255,0.25)" strokeWidth="0.5" />
      );
    }
  }

  // Rooftop structure
  const roofW = 30;
  const roofH2 = 12;
  const roofX = bx + (w - roofW) / 2;
  const roofY = by - totalH;
  const roofFront = `M${roofX},${roofY} L${roofX + roofW},${roofY} L${roofX + roofW},${roofY - roofH2} L${roofX},${roofY - roofH2} Z`;
  const roofRight = `M${roofX + roofW},${roofY} L${roofX + roofW + 12},${roofY - 7} L${roofX + roofW + 12},${roofY - 7 - roofH2} L${roofX + roofW},${roofY - roofH2} Z`;
  const roofTop = `M${roofX},${roofY - roofH2} L${roofX + roofW},${roofY - roofH2} L${roofX + roofW + 12},${roofY - roofH2 - 7} L${roofX + 12},${roofY - roofH2 - 7} Z`;

  return (
    <SVGOverlay bounds={bounds} attributes={{ viewBox: `0 0 ${vw} ${vh}`, style: "overflow:visible" }}>
      {/* Drop Shadow */}
      <polygon points={shadow} fill="rgba(0,0,0,0.25)" />

      {/* Front Face (medium blue) */}
      <path d={frontFace} fill="#1e40af" stroke="#0f172a" strokeWidth="1.2" />

      {/* Right Face (dark blue) */}
      <path d={rightFace} fill="#1e3a8a" stroke="#0f172a" strokeWidth="1.2" />

      {/* Top Face (light blue roof) */}
      <path d={topFace} fill="#3b82f6" stroke="#0f172a" strokeWidth="1.2" />

      {/* Floor divider lines */}
      {floorLines}

      {/* Front windows */}
      {frontWindows}

      {/* Side windows */}
      {sideWindows}

      {/* Rooftop Structure */}
      <path d={roofFront} fill="#475569" stroke="#0f172a" strokeWidth="0.8" />
      <path d={roofRight} fill="#334155" stroke="#0f172a" strokeWidth="0.8" />
      <path d={roofTop} fill="#64748b" stroke="#0f172a" strokeWidth="0.8" />

      {/* Label on the building front face */}
      <text x={bx + w / 2} y={by - totalH / 2} textAnchor="middle" fill="white" fontSize="7" fontWeight="900" opacity="0.9">
        {buildingType.split(' ')[0]}
      </text>
      <text x={bx + w / 2} y={by - totalH / 2 + 9} textAnchor="middle" fill="#38bdf8" fontSize="5.5" fontWeight="700" opacity="0.8">
        {floors} FLOORS
      </text>
    </SVGOverlay>
  );
}

const DEFAULT_PARCELS = [
  {
    id: 1501,
    parcel_number: "PLOT-OD-2026-9821",
    owner_name: "Anmol",
    survey_number: "SN-9821",
    area_sqm: 5868.57,
    valuation: 4250000.0,
    project_id: 1,
    geojson_geometry: '{"type":"Polygon","coordinates":[[[85.8225,20.2945],[85.8265,20.2945],[85.8265,20.2977],[85.8225,20.2977],[85.8225,20.2945]]]}'
  },
  {
    id: 1502,
    parcel_number: "PLOT-MH-2026-4412",
    owner_name: "Rameshwar Patel",
    survey_number: "SN-4412",
    area_sqm: 8500.0,
    valuation: 6800000.0,
    project_id: 1,
    geojson_geometry: '{"type":"Polygon","coordinates":[[[72.9000,19.2000],[72.9050,19.2000],[72.9050,19.2050],[72.9000,19.2050],[72.9000,19.2000]]]}'
  },
  {
    id: 1503,
    parcel_number: "PLOT-UP-2026-1055",
    owner_name: "Sunita Devi",
    survey_number: "SN-1055",
    area_sqm: 13760.0,
    valuation: 12500000.0,
    project_id: 1,
    geojson_geometry: '{"type":"Polygon","coordinates":[[[80.9000,26.8000],[80.9050,26.8000],[80.9050,26.8050],[80.9000,26.8050],[80.9000,26.8000]]]}'
  },
  {
    id: 1504,
    parcel_number: "PLOT-WB-2026-7830",
    owner_name: "Subhash Chandra",
    survey_number: "SN-7830",
    area_sqm: 3440.0,
    valuation: 3100000.0,
    project_id: 1,
    geojson_geometry: '{"type":"Polygon","coordinates":[[[86.3000,23.3000],[86.3050,23.3000],[86.3050,23.3050],[86.3000,23.3050],[86.3000,23.3000]]]}'
  }
];

export default function Blueprint3DPreview() {
  const { parcels: contextParcels, projects, user } = useContext(AppContext);
  const parcels = (contextParcels && contextParcels.length > 0) ? contextParcels : DEFAULT_PARCELS;
  
  // State variables
  const [selectedParcelId, setSelectedParcelId] = useState('');
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  
  const [blueprintFile, setBlueprintFile] = useState(null);
  const [blueprintPreview, setBlueprintPreview] = useState(null);
  const [blueprintTitle, setBlueprintTitle] = useState('');
  const [buildingType, setBuildingType] = useState('Commercial Complex');
  const [floors, setFloors] = useState(4);
  const [heightMeters, setHeightMeters] = useState(14.0);

  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedModel, setProcessedModel] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Pre-select first parcel if available
  useEffect(() => {
    if (parcels && parcels.length > 0 && !selectedParcelId) {
      const first = parcels[0];
      setSelectedParcelId(first.id.toString());
    }
  }, [parcels, selectedParcelId]);

  // Update selected parcel metadata
  useEffect(() => {
    if (selectedParcelId && parcels) {
      const p = parcels.find((item) => item.id.toString() === selectedParcelId.toString());
      if (p) {
        setSelectedParcel(p);
        if (projects) {
          const proj = projects.find((prj) => prj.id === p.project_id);
          setSelectedProject(proj || null);
        }
      }
    }
  }, [selectedParcelId, parcels, projects]);

  // Handle File Upload & Validation
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setErrorMessage('');
    if (!file) return;

    const allowed = ['.png', '.jpg', '.jpeg', '.pdf', '.svg'];
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    
    if (!allowed.includes(ext)) {
      setErrorMessage(`Invalid file format '${ext}'. Please upload an image blueprint (.png, .jpg, .jpeg, .svg, .pdf).`);
      setBlueprintFile(null);
      setBlueprintPreview(null);
      return;
    }

    setBlueprintFile(file);
    if (!blueprintTitle) {
      setBlueprintTitle(file.name.replace(/\.[^/.]+$/, "") + " Proposal");
    }

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => setBlueprintPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setBlueprintPreview(null);
    }
  };

  // Upload and Process Blueprint to 3D
  const handleUploadAndProcess = async (e) => {
    e.preventDefault();
    if (!selectedParcel) {
      setErrorMessage('Please select a valid land parcel from the database.');
      return;
    }
    if (!blueprintFile && !blueprintTitle) {
      setErrorMessage('Please select a blueprint file or enter a blueprint title.');
      return;
    }

    setErrorMessage('');
    setSuccessMessage('');
    setIsProcessing(true);

    try {
      const token = localStorage.getItem('nlams_token');
      const formData = new FormData();
      if (blueprintFile) {
        formData.append('file', blueprintFile);
      } else {
        // Create a dummy file blob for text proposal
        const blob = new Blob(["Blueprint Proposal Plan"], { type: 'image/png' });
        formData.append('file', blob, 'blueprint_plan.png');
      }

      formData.append('title', blueprintTitle || `${buildingType} Proposal`);
      formData.append('parcel_id', selectedParcel.id);
      formData.append('project_id', selectedParcel.project_id || 1);
      formData.append('building_type', buildingType);
      formData.append('floors', floors);
      formData.append('height_meters', heightMeters);

      // 1. Upload Blueprint
      const uploadRes = await fetch('/api/v1/blueprints/upload', {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: formData,
      });

      if (!uploadRes.ok) {
        const err = await uploadRes.json();
        throw new Error(err.detail || 'Failed to upload blueprint file');
      }

      const uploadData = await uploadRes.json();

      // 2. Process Blueprint with Blender
      const processRes = await fetch(`/api/v1/blueprints/${uploadData.id}/process`, {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });

      if (!processRes.ok) {
        const err = await processRes.json();
        throw new Error(err.detail || 'Blender 3D processing failed');
      }

      const processedData = await processRes.json();
      setProcessedModel(processedData);
      setSuccessMessage('3D Project Model successfully generated via Blender Engine!');
    } catch (err) {
      setErrorMessage(err.message || 'An error occurred during 3D model generation.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Helper to parse polygon coordinates
  const getParcelCoordinates = () => {
    if (!selectedParcel || !selectedParcel.geojson_geometry) {
      return {
        center: [20.2961, 85.8245],
        polygon: [
          [20.2945, 85.8225],
          [20.2945, 85.8265],
          [20.2977, 85.8265],
          [20.2977, 85.8225],
        ]
      };
    }

    try {
      const geo = JSON.parse(selectedParcel.geojson_geometry);
      if (geo.type === 'Polygon' && geo.coordinates && geo.coordinates[0]) {
        // Convert [lon, lat] to [lat, lon] for Leaflet
        const coords = geo.coordinates[0].map(([lon, lat]) => [lat, lon]);
        const centerLat = coords.reduce((sum, c) => sum + c[0], 0) / coords.length;
        const centerLon = coords.reduce((sum, c) => sum + c[1], 0) / coords.length;
        return { center: [centerLat, centerLon], polygon: coords };
      }
    } catch (e) {
      console.error("GeoJSON parsing error:", e);
    }

    return {
      center: [20.2961, 85.8245],
      polygon: [
        [20.2945, 85.8225],
        [20.2945, 85.8265],
        [20.2977, 85.8265],
        [20.2977, 85.8225],
      ]
    };
  };

  const mapData = getParcelCoordinates();

  return (
    <div className="min-h-screen bg-slate-100 py-6 px-4 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Title Banner */}
        <div className="bg-gradient-to-r from-[#0f2b5c] via-[#1e3a6e] to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sky-400 font-bold text-xs uppercase tracking-widest font-serif mb-1">
              <Box className="h-4 w-4" />
              <span>RFCTLARR Statutory Spatial Engine</span>
            </div>
            <h1 className="text-2xl font-extrabold font-serif tracking-tight text-white flex items-center gap-2">
              Blueprint-to-3D Project Preview
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Upload floor plans and structural blueprints to auto-render interactive 3D architectural models using 
              Blender-based 3D processing mapped directly onto verified land parcel GIS satellite coordinates.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-slate-800/80 backdrop-blur border border-slate-700 p-3 rounded-xl">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
            <div className="text-left text-xs">
              <span className="font-bold text-slate-200 block">RBAC Authorized</span>
              <span className="text-[10px] text-slate-400">Blender Native Engine Active</span>
            </div>
          </div>
        </div>

        {/* Main Grid: Control Panel + 3D/GIS Viewers */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column: Blueprint Upload & Parcel Selection (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Form Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-5">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 font-serif border-b border-slate-100 pb-3">
                <Building2 className="h-4 w-4 text-[#0f2b5c]" />
                1. Select Land Parcel & Upload Blueprint
              </h2>

              <form onSubmit={handleUploadAndProcess} className="space-y-4">
                
                {/* Parcel Dropdown */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-sky-600" />
                    Select Land Parcel from Database *
                  </label>
                  <select
                    value={selectedParcelId}
                    onChange={(e) => setSelectedParcelId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-800 text-xs font-semibold rounded-lg p-2.5 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                  >
                    {parcels && parcels.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.parcel_number} — {p.owner_name || 'Landowner'} ({roundAcres(p.area_sqm)} Acres)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Blueprint File Upload */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                    <Upload className="h-3.5 w-3.5 text-sky-600" />
                    Upload Blueprint / Floor Plan (.png, .jpg, .pdf, .svg)
                  </label>
                  <div className="border-2 border-dashed border-slate-300 hover:border-sky-500 rounded-xl p-4 text-center bg-slate-50 transition cursor-pointer relative group">
                    <input
                      type="file"
                      accept=".png,.jpg,.jpeg,.pdf,.svg"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="space-y-1">
                      <Upload className="h-6 w-6 text-slate-400 group-hover:text-sky-600 mx-auto transition" />
                      <span className="text-xs font-bold text-slate-700 block">
                        {blueprintFile ? blueprintFile.name : 'Click or Drag Blueprint Image Here'}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        Supports AutoCAD PNG, JPEG floor plans, PDF architectural drawings
                      </span>
                    </div>
                  </div>
                </div>

                {/* Blueprint Preview Thumbnail */}
                {blueprintPreview && (
                  <div className="bg-slate-900 rounded-lg p-2 border border-slate-800 text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Blueprint Image Preview</span>
                    <img src={blueprintPreview} alt="Blueprint Floor Plan" className="max-h-32 mx-auto rounded border border-slate-700 object-contain" />
                  </div>
                )}

                {/* Title Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Project Proposal Title</label>
                  <input
                    type="text"
                    value={blueprintTitle}
                    onChange={(e) => setBlueprintTitle(e.target.value)}
                    placeholder="e.g. Commercial Metro Corridor Station"
                    className="w-full bg-slate-50 border border-slate-300 text-slate-800 text-xs rounded-lg p-2 font-medium"
                  />
                </div>

                {/* Building Parameters */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Building Category</label>
                    <select
                      value={buildingType}
                      onChange={(e) => setBuildingType(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 text-slate-800 text-xs rounded-lg p-2 font-semibold"
                    >
                      <option value="Commercial Complex">Commercial Complex</option>
                      <option value="Residential Housing">Residential Housing</option>
                      <option value="Transport Terminal">Transport Terminal</option>
                      <option value="Industrial Warehouse">Industrial Warehouse</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Number of Stories</label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={floors}
                      onChange={(e) => setFloors(parseInt(e.target.value) || 1)}
                      className="w-full bg-slate-50 border border-slate-300 text-slate-800 text-xs rounded-lg p-2 font-semibold"
                    />
                  </div>
                </div>

                {/* Alert Messages */}
                {errorMessage && (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {successMessage && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-lg text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                    <span>{successMessage}</span>
                  </div>
                )}

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-[#0f2b5c] to-sky-900 hover:from-slate-900 hover:to-sky-950 text-white font-bold py-3 px-4 rounded-xl text-xs shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin text-sky-400" />
                      <span>Executing Blender 3D Mesh Engine...</span>
                    </>
                  ) : (
                    <>
                      <Box className="h-4 w-4 text-sky-400" />
                      <span>Generate 3D Project Model</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Selected Parcel Metadata Details Card */}
            {selectedParcel && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-serif flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <FileText className="h-4 w-4 text-[#0f2b5c]" />
                  Verified Land Parcel Details
                </h3>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Parcel Identifier</span>
                    <span className="font-extrabold text-[#0f2b5c] text-sm">{selectedParcel.parcel_number}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Registered Landowner</span>
                    <span className="font-bold text-slate-800 text-xs">{selectedParcel.owner_name || 'Government Vesting'}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Area</span>
                    <span className="font-bold text-slate-800 text-xs">{roundAcres(selectedParcel.area_sqm)} Acres ({selectedParcel.area_sqm} m²)</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Circle Rate Valuation</span>
                    <span className="font-bold text-emerald-700 text-xs">₹{(selectedParcel.valuation || 4250000).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: 3D Canvas + GIS Satellite Map Viewers (7 cols) */}
          <div className="lg:col-span-7 space-y-6">

            {/* Before Processing — Show default 3D preview + map stacked */}
            {!processedModel && (
              <>
                {/* 1. Interactive 3D WebGL Model Preview */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <Box className="h-5 w-5 text-sky-600" />
                      <div>
                        <h3 className="text-sm font-extrabold text-slate-900 font-serif leading-none">
                          Interactive 3D Project Model
                        </h3>
                        <span className="text-[10px] text-slate-400">Rendered via Blender 3D Native WebGL Pipeline</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 border border-slate-200 flex items-center gap-1 uppercase">
                      <Eye className="h-3 w-3" />
                      Preview Mode
                    </span>
                  </div>
                  <ThreeDViewer
                    modelUrl={null}
                    floors={floors}
                    buildingType={buildingType}
                  />
                </div>

                {/* 2. GIS Map (stacked below) */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <Compass className="h-5 w-5 text-sky-600" />
                      <div>
                        <h3 className="text-sm font-extrabold text-slate-900 font-serif leading-none">
                          GIS Spatial Parcel Boundary Overlay
                        </h3>
                        <span className="text-[10px] text-slate-400">Google Satellite + Cadastral Polygon Ledger</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200 flex items-center gap-1 uppercase font-mono">
                      GPS: {mapData.center[0].toFixed(4)}° N, {mapData.center[1].toFixed(4)}° E
                    </span>
                  </div>
                  <div className="h-72 rounded-xl overflow-hidden border border-slate-200 shadow-inner">
                    <MapContainer center={mapData.center} zoom={16} scrollWheelZoom={false} className="w-full h-full">
                      <MapRecenter center={mapData.center} />
                      <TileLayer url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}" attribution="Google Satellite" />
                      {parcels && parcels.map((p) => {
                        const isSelected = selectedParcelId && p.id.toString() === selectedParcelId.toString();
                        const pCoords = parseGeoJSONCoords(p.geojson_geometry);
                        return (
                          <React.Fragment key={p.id}>
                            <Polygon positions={pCoords.polygon} eventHandlers={{ click: () => setSelectedParcelId(p.id.toString()) }}
                              pathOptions={{ color: isSelected ? '#fbbf24' : '#38bdf8', fillColor: isSelected ? '#f59e0b' : '#0284c7', fillOpacity: isSelected ? 0.25 : 0.08, weight: isSelected ? 3 : 1.5 }} />
                            <Marker position={pCoords.center}>
                              <Popup>
                                <div className="text-xs space-y-1">
                                  <strong className="text-[#0f2b5c] block font-bold">{p.parcel_number}</strong>
                                  <div>Owner: {p.owner_name || 'Landowner'}</div>
                                  <div>Area: {(p.area_sqm / 4046.86).toFixed(2)} Acres</div>
                                  <button type="button" onClick={() => setSelectedParcelId(p.id.toString())} className="mt-1 bg-sky-600 text-white font-bold px-2 py-0.5 rounded text-[10px]">Select this Parcel</button>
                                </div>
                              </Popup>
                            </Marker>
                          </React.Fragment>
                        );
                      })}
                    </MapContainer>
                  </div>
                </div>
              </>
            )}

            {/* AFTER Processing — Side-by-side 3D Model + GIS Map with Building Overlay */}
            {processedModel && (
              <>
                {/* Success Banner */}
                <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-xl p-4 shadow-lg flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 shrink-0" />
                  <div>
                    <h3 className="font-extrabold text-sm">3D Model Generated & Projected On Map</h3>
                    <p className="text-[11px] text-emerald-100">
                      Isometric 3D structural model rendered directly over land parcel <strong>{selectedParcel?.parcel_number}</strong> on the GIS satellite view.
                    </p>
                  </div>
                  <span className="ml-auto text-[10px] bg-white/20 backdrop-blur px-3 py-1 rounded-full font-bold uppercase">
                    🏗️ {buildingType} • {floors} Floors
                  </span>
                </div>

                {/* Side-by-Side Grid: 3D Model (left) + GIS Map with 3D Building (right) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                  {/* LEFT: Interactive 3D Model Viewer */}
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 space-y-2">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                      <Box className="h-4 w-4 text-sky-600" />
                      <h3 className="text-xs font-extrabold text-slate-900 font-serif">3D Architectural Model</h3>
                      <span className="ml-auto text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase flex items-center gap-1">
                        <CheckCircle2 className="h-2.5 w-2.5" /> Live WebGL
                      </span>
                    </div>
                    <ThreeDViewer
                      modelUrl={processedModel.model_3d_url}
                      floors={floors}
                      buildingType={buildingType}
                    />
                  </div>

                  {/* RIGHT: GIS Satellite Map with 3D Building Rendered ON Parcel */}
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 space-y-2">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                      <Compass className="h-4 w-4 text-sky-600" />
                      <h3 className="text-xs font-extrabold text-slate-900 font-serif">3D Building on GIS Satellite Map</h3>
                      <span className="ml-auto text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 uppercase font-mono">
                        🏗️ In-Situ 3D Mesh
                      </span>
                    </div>
                    <div className="h-[420px] rounded-xl overflow-hidden border border-slate-200 shadow-inner">
                      <MapContainer center={mapData.center} zoom={17} scrollWheelZoom={true} className="w-full h-full">
                        <MapRecenter center={mapData.center} />
                        <TileLayer url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}" attribution="Google Satellite" />

                        {/* All parcel boundaries with transparent fill */}
                        {parcels && parcels.map((p) => {
                          const isSelected = selectedParcelId && p.id.toString() === selectedParcelId.toString();
                          const pCoords = parseGeoJSONCoords(p.geojson_geometry);
                          return (
                            <React.Fragment key={p.id}>
                              <Polygon positions={pCoords.polygon}
                                pathOptions={{
                                  color: isSelected ? '#f59e0b' : '#38bdf8',
                                  fillColor: isSelected ? '#fbbf24' : '#0284c7',
                                  fillOpacity: isSelected ? 0.12 : 0.05,
                                  weight: isSelected ? 3 : 1.5,
                                  dashArray: isSelected ? '' : '5 4'
                                }}
                              />
                            </React.Fragment>
                          );
                        })}

                        {/* ACTUAL 3D ISOMETRIC BUILDING RENDERED ON THE PARCEL */}
                        {selectedParcel && (
                          <Building3DMapOverlay
                            parcel={selectedParcel}
                            floors={floors}
                            buildingType={buildingType}
                          />
                        )}

                        {/* Interactive Popup Pin */}
                        {selectedParcel && (
                          <Marker position={mapData.center}>
                            <Popup>
                              <div className="text-xs space-y-1.5 min-w-[180px]">
                                <strong className="text-[#0f2b5c] block font-extrabold text-sm">🏗️ 3D {buildingType} (In-Situ)</strong>
                                <div className="bg-slate-50 p-2 rounded border text-[11px] space-y-0.5">
                                  <div><strong>Parcel:</strong> {selectedParcel.parcel_number}</div>
                                  <div><strong>Owner:</strong> {selectedParcel.owner_name}</div>
                                  <div><strong>Area:</strong> {(selectedParcel.area_sqm / 4046.86).toFixed(2)} Acres</div>
                                  <div><strong>Height:</strong> {floors} Floors (~{(floors * 3.5).toFixed(1)}m)</div>
                                </div>
                                <div className="text-[10px] text-emerald-700 font-bold">✅ 3D Model Positioned on Parcel</div>
                              </div>
                            </Popup>
                          </Marker>
                        )}
                      </MapContainer>
                    </div>
                  </div>
                </div>

                {/* Bottom: Parcel Details Summary Bar */}
                {selectedParcel && (
                  <div className="bg-gradient-to-r from-[#0f2b5c] to-sky-900 text-white rounded-xl p-4 shadow-lg">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
                      <div>
                        <div className="text-[10px] uppercase text-sky-300 font-bold">Parcel ID</div>
                        <div className="text-sm font-extrabold">{selectedParcel.parcel_number}</div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase text-sky-300 font-bold">Landowner</div>
                        <div className="text-sm font-extrabold">{selectedParcel.owner_name}</div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase text-sky-300 font-bold">Total Area</div>
                        <div className="text-sm font-extrabold">{(selectedParcel.area_sqm / 4046.86).toFixed(2)} Acres</div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase text-sky-300 font-bold">Building Type</div>
                        <div className="text-sm font-extrabold">{buildingType}</div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase text-sky-300 font-bold">Coordinates</div>
                        <div className="text-sm font-extrabold">{mapData.center[0].toFixed(4)}°N, {mapData.center[1].toFixed(4)}°E</div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}

// Helper calculation
function roundAcres(sqm) {
  if (!sqm) return '1.45';
  return (sqm / 4046.86).toFixed(2);
}
