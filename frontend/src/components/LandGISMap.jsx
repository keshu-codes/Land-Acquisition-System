import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Globe, Compass, ExternalLink, Satellite, Send, Search, User, X, Maximize2, Minimize2 } from 'lucide-react';

let DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Sub-component to programmatically fly to a specific coordinate
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom, {
        duration: 1.5
      });
    }
  }, [center, zoom, map]);
  return null;
}

// Helper to associate landowners with land parcels/projects
const getLandownerForProject = (proj) => {
  if (proj.landowner) return proj.landowner;
  if (proj.state === "Odisha" || proj.id === "PRJ-005" || proj.title?.includes("Corridor") || proj.title?.includes("Odisha")) {
    return { name: "Anmol", plot: "PLOT-OD-2026-9821", area: "1.45 Acres", valuation: "₹42,50,000" };
  }
  switch (proj.state) {
    case "Maharashtra":
      return { name: "Rameshwar Patel", plot: `PLOT-MH-2026-${1000 + (proj.id ? parseInt(proj.id.replace(/\D/g, '') || '1') * 17 : 44)}`, area: "2.8 Acres", valuation: "₹65,00,000" };
    case "Tamil Nadu":
      return { name: "M. Selvakumar", plot: `PLOT-TN-2026-${2000 + (proj.id ? parseInt(proj.id.replace(/\D/g, '') || '1') * 19 : 82)}`, area: "3.2 Acres", valuation: "₹78,00,000" };
    case "Uttar Pradesh":
      return { name: "Harishankar Sharma", plot: `PLOT-UP-2026-${3000 + (proj.id ? parseInt(proj.id.replace(/\D/g, '') || '1') * 23 : 55)}`, area: "1.9 Acres", valuation: "₹48,00,000" };
    case "West Bengal":
      return { name: "Debabrata Banerjee", plot: `PLOT-WB-2026-${4000 + (proj.id ? parseInt(proj.id.replace(/\D/g, '') || '1') * 31 : 12)}`, area: "2.1 Acres", valuation: "₹52,00,000" };
    default:
      return { name: "Govind Rao", plot: `PLOT-IN-2026-${5000 + (proj.id ? parseInt(proj.id.replace(/\D/g, '') || '1') * 13 : 90)}`, area: "2.5 Acres", valuation: "₹60,00,000" };
  }
};

export default function LandGISMap({ proposals, selectedProject, setSelectedProject }) {
  const [mapCenter, setMapCenter] = useState([22.5, 78.5]); // Center of India
  const [mapZoom, setMapZoom] = useState(5);
  const [mapType, setMapType] = useState('satellite'); // 'standard' or 'satellite'
  const [searchQuery, setSearchQuery] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Exit fullscreen on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Proposal Submitted": return "#3b82f6"; // Blue
      case "GIS Verification": return "#ea580c"; // Saffron
      case "Section 11 Notification": return "#6366f1"; // Indigo
      case "Award Declared": return "#d97706"; // Amber
      case "Possession Handover": return "#10b981"; // Emerald Green
      default: return "#64748b";
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case "Proposal Submitted": return "bg-indigo-50 text-[#0f2b5c] border-indigo-200";
      case "GIS Verification": return "bg-orange-50 text-orange-700 border-orange-200";
      case "Section 11 Notification": return "bg-sky-50 text-sky-700 border-sky-200";
      case "Award Declared": return "bg-amber-50 text-amber-700 border-amber-200";
      case "Possession Handover": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      default: return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  // When selectedProject changes, center map on its coordinates
  useEffect(() => {
    if (selectedProject) {
      const coords = selectedProject.coordinates;
      if (coords && coords.length > 0) {
        // Calculate average center of the polygon
        const latAvg = coords.reduce((sum, c) => sum + c.lat, 0) / coords.length;
        const lngAvg = coords.reduce((sum, c) => sum + c.lng, 0) / coords.length;
        setMapCenter([latAvg, lngAvg]);
        setMapZoom(13);
      }
    }
  }, [selectedProject]);

  // Enrich proposals with landowner information
  const enrichedProposals = proposals.map(p => ({
    ...p,
    landownerInfo: getLandownerForProject(p)
  }));

  // Filter proposals by search query (supports Landowner name, Plot #, Project name, State, District)
  const filteredProposals = enrichedProposals.filter(p => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      (p.landownerInfo?.name && p.landownerInfo.name.toLowerCase().includes(q)) ||
      (p.landownerInfo?.plot && p.landownerInfo.plot.toLowerCase().includes(q)) ||
      (p.title && p.title.toLowerCase().includes(q)) ||
      (p.id && p.id.toLowerCase().includes(q)) ||
      (p.district && p.district.toLowerCase().includes(q)) ||
      (p.state && p.state.toLowerCase().includes(q))
    );
  });

  const containerClass = isFullscreen
    ? "fixed inset-0 z-[99999] bg-white w-screen h-screen flex flex-col lg:flex-row shadow-2xl font-sans select-none p-3 animate-fadeIn"
    : "bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col lg:flex-row h-[580px] font-sans select-none";

  return (
    <div className={containerClass}>
      
      {/* Sidebar - Projects & Landowners Registry */}
      <div className={`border-r border-slate-200 flex flex-col bg-white z-10 ${isFullscreen ? 'w-full lg:w-96 h-1/4 lg:h-full rounded-l-xl' : 'w-full lg:w-88 h-1/3 lg:h-full'}`}>
        
        {/* Header */}
        <div className="p-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="font-bold text-slate-700 text-xs flex items-center gap-1.5 uppercase tracking-wider font-serif">
            <Compass className="h-4 w-4 text-[#0f2b5c]" />
            Land Parcels GIS Registry
          </span>
          <span className="text-[10px] bg-indigo-50 border border-indigo-150 text-[#0f2b5c] font-bold px-2.5 py-0.5 rounded-full">
            {filteredProposals.length} {filteredProposals.length === 1 ? 'Plot' : 'Plots'}
          </span>
        </div>

        {/* 🔍 Landowner & Plot Search Bar */}
        <div className="p-2.5 bg-white border-b border-slate-200">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Landowner (e.g. Anmol), Plot #..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs font-bold border border-slate-250 rounded-lg py-2 pl-8.5 pr-8 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#0f2b5c]/10 focus:border-[#0f2b5c] shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-700 p-0.5 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Parcels List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-slate-50/50">
          {filteredProposals.length === 0 ? (
            <div className="text-center py-10 px-4 space-y-1">
              <User className="h-8 w-8 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-500">No matching landholder found</p>
              <p className="text-[10px] text-slate-400">Try searching "Anmol", "Rameshwar", or "PLOT-OD"</p>
            </div>
          ) : (
            filteredProposals.map((proj) => {
              const isSelected = selectedProject?.id === proj.id;
              const isAnmol = proj.landownerInfo?.name === "Anmol";
              return (
                <button
                  key={proj.id}
                  onClick={() => setSelectedProject(proj)}
                  className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-white border-[#0f2b5c] shadow-md ring-2 ring-[#0f2b5c]/15' 
                      : 'bg-white hover:bg-slate-50 border-slate-200/80 shadow-xs'
                  } ${isAnmol && !searchQuery ? 'ring-1 ring-orange-400/40 bg-orange-50/20' : ''}`}
                >
                  <div className="flex justify-between items-start gap-1">
                    <span className="text-[10px] font-bold text-slate-400 tracking-wide">{proj.id}</span>
                    <span className={`text-[8px] font-bold border px-2 py-0.5 rounded-full uppercase ${getStatusBgColor(proj.status)}`}>
                      {proj.status.replace(' Notification', '').replace(' Handover', '')}
                    </span>
                  </div>

                  {/* Landowner Tag Banner */}
                  <div className="mt-1.5 flex items-center justify-between bg-slate-50 border border-slate-200/60 rounded-md px-2 py-1">
                    <span className="text-[10.5px] font-extrabold text-[#0f2b5c] flex items-center gap-1 font-serif">
                      <User className="h-3 w-3 text-[#ea580c]" />
                      {proj.landownerInfo.name}
                    </span>
                    <span className="text-[9px] font-mono text-slate-500 font-bold">
                      {proj.landownerInfo.plot}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-800 mt-1.5 line-clamp-1">{proj.title}</h4>
                  <p className="text-[10px] text-slate-500 font-semibold mt-0.5">{proj.district}, {proj.state}</p>
                  
                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-400 font-semibold">
                    <span>Valuation: <strong className="text-emerald-700">{proj.landownerInfo.valuation}</strong></span>
                    <span>Area: <strong className="text-slate-700">{proj.landownerInfo.area}</strong></span>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Right Column: Integrated GIS Map Container */}
      <div className={`lg:col-span-8 bg-white border border-slate-300 rounded-md overflow-hidden flex flex-col relative ${isFullscreen ? '!fixed !inset-0 !z-[9999] !h-screen !w-screen !rounded-none !border-0' : 'h-[520px]'}`}>
        
        {/* Solid Top Map Control Bar */}
        <div className="bg-[#0f2b5c] text-white px-3.5 py-2 flex items-center justify-between text-xs border-b border-[#0c224a] z-10 select-none">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-[#ea580c]" />
            <span className="font-bold font-serif tracking-wide">
              Cadastral GIS Visualizer <span className="text-slate-300 text-[10px] font-sans font-normal hidden sm:inline">| National Satellite Layer</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Map Layer Switcher */}
            <button
              onClick={() => setMapType(mapType === 'satellite' ? 'standard' : 'satellite')}
              className="bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 rounded border border-white/20 text-[10.5px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>{mapType === 'satellite' ? '🗺️ Road View' : '🛰️ Satellite View'}</span>
            </button>

            {/* Maximize Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="bg-[#ea580c] hover:bg-orange-700 text-white px-2.5 py-1 rounded text-[10.5px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="h-3.5 w-3.5" />
                  <span>Exit Fullscreen (Esc)</span>
                </>
              ) : (
                <>
                  <Maximize2 className="h-3.5 w-3.5" />
                  <span>Fullscreen</span>
                </>
              )}
            </button>
          </div>
        </div>
        
        <MapContainer 
          center={mapCenter} 
          zoom={mapZoom} 
          scrollWheelZoom={true} 
          className="h-full w-full"
        >
          <ChangeView center={mapCenter} zoom={mapZoom} />
          
          {mapType === 'standard' ? (
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          ) : (
            <TileLayer
              attribution='&copy; Google Maps Hybrid'
              url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
            />
          )}

          {enrichedProposals.map((proj) => {
            const positions = proj.coordinates.map(c => [c.lat, c.lng]);
            const center = [
              proj.coordinates.reduce((sum, c) => sum + c.lat, 0) / proj.coordinates.length,
              proj.coordinates.reduce((sum, c) => sum + c.lng, 0) / proj.coordinates.length
            ];

            const isAnmol = proj.landownerInfo?.name === "Anmol";

            return (
              <React.Fragment key={proj.id}>
                {/* Polygon of the Land Parcel */}
                <Polygon
                  positions={positions}
                  pathOptions={{
                    color: isAnmol ? "#dc2626" : getStatusColor(proj.status),
                    fillColor: isAnmol ? "#ef4444" : getStatusColor(proj.status),
                    fillOpacity: isAnmol ? 0.45 : 0.35,
                    weight: isAnmol ? 3 : 2.5,
                    dashArray: proj.status === 'Proposal Submitted' ? '5, 5' : '0'
                  }}
                  eventHandlers={{
                    click: () => setSelectedProject(proj)
                  }}
                >
                  <Popup className="custom-popup">
                    <div className="p-1 max-w-xs text-slate-800">
                      <div className="flex justify-between items-center gap-2 mb-2">
                        <span className="text-[10px] bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded font-bold">{proj.id}</span>
                        <span className={`text-[8px] font-bold border px-1.5 py-0.5 rounded uppercase ${getStatusBgColor(proj.status)}`}>
                          {proj.status}
                        </span>
                      </div>

                      {/* Landowner Tag */}
                      <div className="bg-indigo-50 border border-indigo-150 rounded-lg p-2 mb-2 space-y-0.5">
                        <div className="text-[9px] text-slate-400 uppercase font-bold">Registered Landholder</div>
                        <div className="text-xs font-extrabold text-[#0f2b5c] font-serif flex items-center gap-1">
                          <User className="h-3.5 w-3.5 text-[#ea580c]" />
                          {proj.landownerInfo.name}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          Plot: <strong className="text-slate-700">{proj.landownerInfo.plot}</strong>
                        </div>
                      </div>

                      <h3 className="font-bold text-xs text-slate-800 leading-snug mb-1 font-serif">{proj.title}</h3>
                      <p className="text-[10px] text-slate-500 mb-2 font-medium">{proj.agency}</p>
                      
                      <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-2 text-[10px]">
                        <div>
                          <span className="text-slate-400 block uppercase">Area</span>
                          <strong className="text-slate-700 text-xs">{proj.landownerInfo.area}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block uppercase">Base Circle Rate</span>
                          <strong className="text-emerald-700 text-xs">{proj.landownerInfo.valuation}</strong>
                        </div>
                      </div>

                      {/* Direct Dispatch Action Button */}
                      <button
                        onClick={() => {
                          window.dispatchEvent(new CustomEvent('navigate-tab', { detail: 'dispatch' }));
                        }}
                        className="w-full mt-2.5 bg-[#0f2b5c] hover:bg-[#0c224a] text-white text-[10px] font-bold py-1.5 px-2.5 rounded-lg flex items-center justify-center gap-1.5 shadow transition-all cursor-pointer"
                      >
                        <Send className="h-3 w-3 text-[#ea580c]" />
                        Dispatch Notice to Nearest Survey Officer
                      </button>
                    </div>
                  </Popup>
                </Polygon>
                
                {/* Marker at average center */}
                <Marker 
                  position={center}
                  eventHandlers={{
                    click: () => setSelectedProject(proj)
                  }}
                />
              </React.Fragment>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
