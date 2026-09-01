import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import LandGISMap from '../components/LandGISMap';
import { Layers, MapPin, Search, Compass, ShieldCheck, Download, ArrowRight } from 'lucide-react';

export default function GISExplorerPage({ setActiveTab }) {
  const { proposals } = useContext(AppContext);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 font-sans select-none">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-sky-100 text-sky-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded font-mono uppercase">GIS Spatial Ledger</span>
            <span className="text-xs text-slate-500 font-bold">Sub-Meter Satellite Precision</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f2b5c] font-heading mt-1">
            Cadastral Boundary & Spatial Explorer
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Interactive map workspace displaying state cadastral overlays, acquisition corridor risk buffers, and live GPS survey station nodes.
          </p>
        </div>
      </div>

      {/* Main Full-Height GIS Map Container */}
      <div className="gov-card p-4 space-y-4">
        <div className="h-[550px] rounded-xl overflow-hidden border border-slate-200 relative shadow-inner">
          <LandGISMap selectedProject={proposals[0]} />
        </div>
      </div>

      {/* Spatial Metadata Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="gov-card p-4 space-y-1">
          <span className="text-[10px] text-slate-400 font-mono uppercase block">Active Satellite Layer</span>
          <strong className="text-xs font-extrabold text-[#0f2b5c]">ISRO Bhuvan / High-Res Optical</strong>
          <p className="text-[11px] text-slate-500 font-medium">Synced with State Revenue Land Records for plot boundary verification.</p>
        </div>

        <div className="gov-card p-4 space-y-1">
          <span className="text-[10px] text-slate-400 font-mono uppercase block">Cadastral Precision</span>
          <strong className="text-xs font-extrabold text-emerald-600">Sub-1 Meter GPS Accuracy</strong>
          <p className="text-[11px] text-slate-500 font-medium">Field surveyors record live geotagged lat/long coordinates under Section 12.</p>
        </div>

        <div className="gov-card p-4 space-y-1">
          <span className="text-[10px] text-slate-400 font-mono uppercase block">Web3 Hash Verification</span>
          <strong className="text-xs font-extrabold text-indigo-600 font-mono">0x9f82...a410 (Immutable)</strong>
          <p className="text-[11px] text-slate-500 font-medium">Spatial polygon boundaries are cryptographically hashed onto the blockchain.</p>
        </div>
      </div>

    </div>
  );
}
