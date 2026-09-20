import React, { useContext, useState, useMemo } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  Search, Filter, MapPin, Download, ExternalLink, ShieldAlert, 
  CheckCircle, Clock, AlertCircle, FileText, ChevronLeft, ChevronRight,
  Database, Scale, Eye, Layers, CheckCircle2, ArrowRight
} from 'lucide-react';

export default function ParcelsDirectory({ setActiveTab }) {
  const { parcels, selectedParcelId, setSelectedParcelId, addNotification } = useContext(AppContext);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('All States');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Extract unique states
  const states = useMemo(() => {
    if (!parcels) return ['All States'];
    const s = Array.from(new Set(parcels.map(p => p.state).filter(Boolean))).sort();
    return ['All States', ...s];
  }, [parcels]);

  // Filtered parcels
  const filteredParcels = useMemo(() => {
    if (!parcels) return [];
    return parcels.filter(p => {
      const term = searchTerm.toLowerCase();
      const matchesSearch = 
        (p.parcel_number || '').toLowerCase().includes(term) ||
        (p.owner_name || '').toLowerCase().includes(term) ||
        (p.survey_number || '').toLowerCase().includes(term) ||
        (p.district || '').toLowerCase().includes(term) ||
        (p.state || '').toLowerCase().includes(term) ||
        (p.associated_project || '').toLowerCase().includes(term);

      const matchesState = selectedState === 'All States' || p.state === selectedState;
      
      let matchesStatus = true;
      if (selectedStatus === 'Disbursed') {
        matchesStatus = (p.compensation_status || '').includes('Disbursed');
      } else if (selectedStatus === 'Escrow') {
        matchesStatus = (p.compensation_status || '').includes('Escrow');
      } else if (selectedStatus === 'Escalated') {
        matchesStatus = p.escalated_to_collector === true;
      } else if (selectedStatus === 'Hearing') {
        matchesStatus = (p.compensation_status || '').includes('Section 15');
      }

      return matchesSearch && matchesState && matchesStatus;
    });
  }, [parcels, searchTerm, selectedState, selectedStatus]);

  // Pagination
  const totalPages = Math.ceil(filteredParcels.length / itemsPerPage) || 1;
  const paginatedParcels = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredParcels.slice(start, start + itemsPerPage);
  }, [filteredParcels, currentPage]);

  const handleOpenRoR = (parcelId) => {
    setSelectedParcelId(parcelId.toString());
    if (setActiveTab) {
      setActiveTab('citizen_portal');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleExportCSV = () => {
    if (!filteredParcels.length) return;
    const headers = ["ULPIN", "Owner", "Survey_No", "State", "District", "Area_Acres", "Soil_Type", "Valuation_INR", "Status", "PFMS_UTR"];
    const rows = filteredParcels.map(p => [
      p.parcel_number,
      `"${p.owner_name}"`,
      `"${p.survey_number}"`,
      `"${p.state}"`,
      `"${p.district}"`,
      p.area_acres,
      `"${p.soil_type}"`,
      p.valuation,
      `"${p.compensation_status}"`,
      `"${p.payment_record?.utr_number || ''}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `NLAMS_Parcels_Registry_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addNotification("Downloaded land parcels directory CSV.", "success");
  };

  // Metrics
  const totalValuation = parcels ? parcels.reduce((sum, p) => sum + (p.valuation || 0), 0) : 0;
  const disbursedCount = parcels ? parcels.filter(p => (p.compensation_status || '').includes('Disbursed')).length : 0;
  const escalatedCount = parcels ? parcels.filter(p => p.escalated_to_collector).length : 0;

  return (
    <div className="bg-[#FAFAF7] min-h-screen pb-16 font-sans">
      
      {/* 1. Header Banner */}
      <div className="bg-[#156734] text-white py-8 px-4 sm:px-8 border-b-2 border-[#E59819] shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
              <Database className="h-4 w-4" />
              <span>National Land Acquisition Cadastral Registry</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-sans tracking-tight">
              Verified Land Parcels Master Register (50 Records)
            </h1>
            <p className="text-xs sm:text-sm text-white/90 mt-1 max-w-2xl">
              Centralized gazetted register of 50 geo-referenced agricultural, residential, and commercial land parcels acquired for national infrastructure under RFCTLARR Act 2013.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleExportCSV}
              className="bg-white text-[#156734] hover:bg-emerald-50 px-4 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 shadow-sm transition cursor-pointer"
            >
              <Download className="h-4 w-4" />
              <span>Export CSV Register</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Top Metric Counters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 -mt-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          
          <div className="hover-pop card-interactive bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs cursor-pointer">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Parcels</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-slate-800 font-mono">{parcels ? parcels.length : 50}</span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">21 States</span>
            </div>
          </div>

          <div className="hover-pop card-interactive bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs cursor-pointer">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Assessed Value</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-slate-800 font-mono">₹{(totalValuation / 10000000).toFixed(1)} Cr</span>
              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">Govt Approved</span>
            </div>
          </div>

          <div className="hover-pop card-interactive bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs cursor-pointer">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">PFMS DBT Disbursed</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-emerald-700 font-mono">{disbursedCount}</span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">Direct to Bank</span>
            </div>
          </div>

          <div className="hover-pop card-interactive bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs cursor-pointer">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Sec 38 Escalations</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-rose-600 font-mono">{escalatedCount}</span>
              <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded">Collector Review</span>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Search & Filters Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-6">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by ULPIN, Owner, Survey No, District..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="hover-pop w-full pl-9 pr-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#156734] focus:ring-1 focus:ring-[#156734] shadow-2xs"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
            
            {/* State Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-500">State:</span>
              <select
                value={selectedState}
                onChange={(e) => { setSelectedState(e.target.value); setCurrentPage(1); }}
                className="hover-pop bg-slate-50 border border-slate-300 text-slate-800 text-xs font-bold rounded-xl px-2.5 py-2 outline-none cursor-pointer shadow-2xs"
              >
                {states.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-500">Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
                className="hover-pop bg-slate-50 border border-slate-300 text-slate-800 text-xs font-bold rounded-xl px-2.5 py-2 outline-none cursor-pointer shadow-2xs"
              >
                <option value="All Statuses">All Statuses</option>
                <option value="Disbursed">PFMS Disbursed</option>
                <option value="Escrow">Treasury Escrow Locked</option>
                <option value="Escalated">Section 38 Escalated</option>
                <option value="Hearing">Section 15 Hearing</option>
              </select>
            </div>

            {/* Total matched count badge */}
            <span className="hover-pop text-[11px] font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
              Showing {filteredParcels.length} of {parcels ? parcels.length : 50}
            </span>

          </div>

        </div>
      </div>

      {/* 4. Main Data Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-6">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#156734] text-white text-[11px]">
                  <th className="p-3.5 border-r border-emerald-700">Parcel ULPIN</th>
                  <th className="p-3.5 border-r border-emerald-700">Landowner Titleholder</th>
                  <th className="p-3.5 border-r border-emerald-700">Location (State / Dist)</th>
                  <th className="p-3.5 border-r border-emerald-700">Associated Public Project</th>
                  <th className="p-3.5 border-r border-emerald-700">Extent (Acres / sqm)</th>
                  <th className="p-3.5 border-r border-emerald-700">Soil & Fertility</th>
                  <th className="p-3.5 border-r border-emerald-700">Total Compensation</th>
                  <th className="p-3.5 border-r border-emerald-700">Status & PFMS UTR</th>
                  <th className="p-3.5 text-center">Statutory RoR Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {paginatedParcels.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="p-10 text-center text-slate-500 font-bold">
                      No matching parcels found for your search query or filter.
                    </td>
                  </tr>
                ) : (
                  paginatedParcels.map((p, idx) => {
                    const isDisbursed = (p.compensation_status || '').includes('Disbursed');
                    const isEscalated = p.escalated_to_collector;
                    const isHearing = (p.compensation_status || '').includes('Section 15');

                    return (
                      <tr 
                        key={p.id || idx} 
                        className={`hover-pop transition-all cursor-pointer ${idx % 2 === 1 ? 'bg-slate-50/50' : 'bg-white'} hover:bg-emerald-50/60`}
                      >
                        {/* ULPIN */}
                        <td className="p-3.5 font-mono font-black text-[#156734] border-r border-slate-200 whitespace-nowrap">
                          {p.parcel_number}
                          <span className="block text-[10px] font-normal text-slate-400">{p.survey_number}</span>
                        </td>

                        {/* Owner */}
                        <td className="p-3.5 font-bold text-slate-800 border-r border-slate-200 whitespace-nowrap">
                          {p.owner_name}
                          <span className="block text-[10px] font-mono text-slate-500 font-normal">
                            Aadhaar: {p.aadhaar_ref || 'XXXX-XXXX-4412'}
                          </span>
                        </td>

                        {/* Location */}
                        <td className="p-3.5 text-slate-700 border-r border-slate-200 whitespace-nowrap">
                          <span className="font-bold text-slate-800">{p.district}</span>
                          <span className="block text-[10px] text-slate-500">{p.state}</span>
                        </td>

                        {/* Project */}
                        <td className="p-3.5 text-slate-700 border-r border-slate-200 max-w-xs">
                          <span className="font-semibold line-clamp-1">{p.associated_project || 'National Infrastructure'}</span>
                        </td>

                        {/* Area */}
                        <td className="p-3.5 font-mono text-slate-800 border-r border-slate-200 whitespace-nowrap">
                          <strong className="text-slate-900">{p.area_acres || (p.area_sqm / 4046.86).toFixed(2)}</strong> Acres
                          <span className="block text-[10px] text-slate-500">{(p.area_sqm || 0).toLocaleString()} m²</span>
                        </td>

                        {/* Soil */}
                        <td className="p-3.5 text-slate-700 border-r border-slate-200 max-w-xs">
                          <span className="font-medium text-[11px] block line-clamp-1">{p.soil_type || 'Alluvial'}</span>
                          <span className="text-[10px] text-emerald-700 font-semibold">{p.irrigation_source ? '✓ Irrigated' : 'Rainfed'}</span>
                        </td>

                        {/* Valuation */}
                        <td className="p-3.5 font-mono font-extrabold text-slate-900 border-r border-slate-200 whitespace-nowrap">
                          ₹{(p.valuation || 0).toLocaleString('en-IN')}
                          <span className="block text-[10px] text-slate-500 font-normal">
                            (Base + 100% Solatium)
                          </span>
                        </td>

                        {/* Status */}
                        <td className="p-3.5 border-r border-slate-200 whitespace-nowrap">
                          {isEscalated ? (
                            <span className="bg-rose-100 border border-rose-300 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 w-fit">
                              <ShieldAlert className="h-3 w-3 text-rose-600" />
                              Sec 38 Escalated
                            </span>
                          ) : isDisbursed ? (
                            <div className="space-y-0.5">
                              <span className="bg-emerald-100 border border-emerald-300 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 w-fit">
                                <CheckCircle className="h-3 w-3 text-emerald-600" />
                                PFMS Disbursed
                              </span>
                              <span className="block text-[9px] font-mono text-slate-500">
                                {p.payment_record?.utr_number || 'PFMS-RBI-202608'}
                              </span>
                            </div>
                          ) : isHearing ? (
                            <span className="bg-amber-100 border border-amber-300 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded w-fit">
                              Sec 15 Hearing
                            </span>
                          ) : (
                            <span className="bg-blue-100 border border-blue-300 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded w-fit">
                              Escrow Locked
                            </span>
                          )}
                        </td>

                        {/* Action */}
                        <td className="p-3.5 text-center whitespace-nowrap">
                          <button
                            onClick={() => handleOpenRoR(p.id)}
                            className="btn-pop bg-[#156734] hover:bg-[#0E4B24] text-white font-extrabold text-[11px] px-3.5 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-2xs mx-auto"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span>View RoR</span>
                          </button>
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-semibold">
              Page {currentPage} of {totalPages} ({filteredParcels.length} total entries)
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="btn-pop p-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              
              {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`btn-pop h-7 w-7 text-xs font-bold rounded-lg cursor-pointer ${
                      currentPage === pageNum ? 'bg-[#156734] text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="btn-pop p-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
