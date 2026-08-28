import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Globe, Compass, ExternalLink, Satellite } from 'lucide-react';

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

export default function LandGISMap({ proposals, selectedProject, setSelectedProject }) {
  const [mapCenter, setMapCenter] = useState([22.5, 78.5]); // Center of India
  const [mapZoom, setMapZoom] = useState(5);
  const [mapType, setMapType] = useState('satellite'); // 'standard' or 'satellite'

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

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col lg:flex-row h-[550px] font-sans select-none">
      
      {/* Sidebar - Projects List */}
      <div className="w-full lg:w-80 border-r border-slate-200 flex flex-col h-1/3 lg:h-full bg-white z-10">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="font-bold text-slate-700 text-xs flex items-center gap-1.5 uppercase tracking-wider">
            <Compass className="h-4 w-4 text-[#0f2b5c]" />
            Land Parcels GIS Registry
          </span>
          <span className="text-[10px] bg-indigo-50 border border-indigo-150 text-[#0f2b5c] font-bold px-2.5 py-0.5 rounded-full">
            {proposals.length} Total
          </span>
        </div>
        <div className="flex-1 overflow-y-auto p-2.5 space-y-2 bg-slate-50/50">
          {proposals.map((proj) => (
            <button
              key={proj.id}
              onClick={() => setSelectedProject(proj)}
              className={`w-full text-left p-3 rounded-xl border transition-all ${
                selectedProject?.id === proj.id 
                  ? 'bg-white border-[#0f2b5c] shadow-md ring-1 ring-[#0f2b5c]/10' 
                  : 'bg-white hover:bg-slate-50 border-slate-200/80 shadow-sm'
              }`}
            >
              <div className="flex justify-between items-start gap-1">
                <span className="text-[10px] font-bold text-slate-400 tracking-wide">{proj.id}</span>
                <span className={`text-[8px] font-bold border px-2 py-0.5 rounded-full uppercase ${getStatusBgColor(proj.status)}`}>
                  {proj.status.replace(' Notification', '').replace(' Handover', '')}
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-800 mt-1.5 line-clamp-1">{proj.title}</h4>
              <p className="text-[10px] text-slate-500 font-semibold mt-0.5">{proj.district}, {proj.state}</p>
              
              <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-slate-100 text-[10px] text-slate-400">
                <span>Req: <strong className="text-slate-600">{proj.areaRequired} ha</strong></span>
                <span>Acq: <strong className="text-emerald-700">{proj.areaAcquired} ha</strong></span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Map View */}
      <div className="flex-1 relative h-2/3 lg:h-full z-0">
        <div className="absolute top-3 right-3 z-[40] flex gap-2">
          {/* Map Layer Switcher */}
          <button
            onClick={() => setMapType(mapType === 'satellite' ? 'standard' : 'satellite')}
            className="bg-white/95 border border-slate-250 hover:bg-slate-50 text-slate-850 px-3.5 py-1.5 rounded-lg shadow-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 backdrop-blur-sm cursor-pointer transition-all"
          >
            <Globe className="h-3.5 w-3.5 text-[#ea580c]" />
            <span>{mapType === 'satellite' ? '🗺️ Map View' : '🛰️ Satellite View'}</span>
          </button>
          
          <div className="bg-white/95 border border-slate-200 text-slate-850 px-3.5 py-1.5 rounded-lg shadow-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 backdrop-blur-sm">
            <Compass className="h-3.5 w-3.5 text-[#0f2b5c]" />
            Interactive GIS Portal
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

          {proposals.map((proj) => {
            const positions = proj.coordinates.map(c => [c.lat, c.lng]);
            const center = [
              proj.coordinates.reduce((sum, c) => sum + c.lat, 0) / proj.coordinates.length,
              proj.coordinates.reduce((sum, c) => sum + c.lng, 0) / proj.coordinates.length
            ];

            return (
              <React.Fragment key={proj.id}>
                {/* Polygon of the Land Parcel */}
                <Polygon
                  positions={positions}
                  pathOptions={{
                    color: getStatusColor(proj.status),
                    fillColor: getStatusColor(proj.status),
                    fillOpacity: 0.35,
                    weight: 2.5,
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
                      <h3 className="font-bold text-xs text-slate-800 leading-snug mb-1 font-serif">{proj.title}</h3>
                      <p className="text-[10px] text-slate-500 mb-2 font-medium">{proj.agency}</p>
                      
                      <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-2 text-[10px]">
                        <div>
                          <span className="text-slate-400 block uppercase">Area Required</span>
                          <strong className="text-slate-700 text-xs">{proj.areaRequired} ha</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block uppercase">Acquired Status</span>
                          <strong className="text-emerald-700 text-xs">{proj.areaAcquired} ha</strong>
                        </div>
                        <div className="col-span-2">
                          <span className="text-slate-400 block uppercase">Compensation Released</span>
                          <strong className="text-[#0f2b5c] text-xs">₹{proj.budgetDisbursed} Cr / ₹{proj.budgetAssessed} Cr</strong>
                        </div>
                      </div>
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
