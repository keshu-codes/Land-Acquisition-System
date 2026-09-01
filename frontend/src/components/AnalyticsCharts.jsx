import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

export default function AnalyticsCharts({ proposals }) {
  const safeProposals = proposals || [];
  // Chart 1: Compensation Assessed vs Disbursed
  const compensationData = safeProposals.map(p => ({
    name: p.id,
    title: p.title,
    'Assessed (Cr)': p.budgetAssessed,
    'Paid (Cr)': p.budgetDisbursed,
  }));

  // Chart 2: State-wise Land Acquisition Summary
  const stateSummary = safeProposals.reduce((acc, p) => {
    if (!acc[p.state]) {
      acc[p.state] = { state: p.state, proposed: 0, acquired: 0 };
    }
    acc[p.state].proposed += p.areaRequired;
    acc[p.state].acquired += p.areaAcquired;
    return acc;
  }, {});
  const stateData = Object.values(stateSummary);

  // Chart 3: Projects by Status (Pie Chart)
  const statusCounts = proposals.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {});
  const statusData = Object.keys(statusCounts).map(status => ({
    name: status,
    value: statusCounts[status]
  }));

  const STATUS_COLORS = {
    "Proposal Submitted": "#0f2b5c",       // Ashoka Blue
    "GIS Verification": "#ea580c",         // Saffron
    "Section 11 Notification": "#6366f1",   // Indigo
    "Award Declared": "#d97706",            // Saffron/Amber
    "Possession Handover": "#16a34a",       // Emerald Green
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Chart 1: Budget Analysis */}
      <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm">
        <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
          Financial Audit: Compensation Assessed vs Paid
        </h4>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={compensationData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} stroke="#cbd5e1" />
              <YAxis tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} unit=" Cr" stroke="#cbd5e1" />
              <Tooltip 
                contentStyle={{ fontSize: '11px', borderRadius: '8px', border: '1px solid #cbd5e1', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }} 
                formatter={(value) => [`₹${value} Cr`]}
              />
              <Legend wrapperStyle={{ fontSize: '11px', marginTop: '10px' }} />
              <Bar dataKey="Assessed (Cr)" fill="#0f2b5c" radius={[3, 3, 0, 0]} />
              <Bar dataKey="Paid (Cr)" fill="#16a34a" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: State-wise land acquisition */}
      <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm">
        <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
          Spatial Analysis: Land Proposed vs Acquired by State
        </h4>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={stateData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="state" tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} stroke="#cbd5e1" />
              <YAxis tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} unit=" ha" stroke="#cbd5e1" />
              <Tooltip 
                contentStyle={{ fontSize: '11px', borderRadius: '8px', border: '1px solid #cbd5e1', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}
                formatter={(value) => [`${value} hectares`]}
              />
              <Legend wrapperStyle={{ fontSize: '11px', marginTop: '10px' }} />
              <Bar dataKey="proposed" name="Notified (ha)" fill="#94a3b8" radius={[3, 3, 0, 0]} />
              <Bar dataKey="acquired" name="Acquired (ha)" fill="#16a34a" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 3: Status breakdown (Pie Chart) */}
      <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm lg:col-span-2">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider mb-1">
              Process Lifecycle Distribution
            </h4>
            <p className="text-[10px] text-slate-400 font-medium">Total distribution of land acquisition proposals across workflow stages</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-5">
              {statusData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2.5">
                  <span 
                    className="h-3 w-3 rounded-full flex-shrink-0" 
                    style={{ backgroundColor: STATUS_COLORS[entry.name] || '#ccc' }}
                  />
                  <span className="text-xs text-slate-600 font-semibold">
                    {entry.name}: <strong className="text-slate-800">{entry.value} ({proposals.length ? Math.round((entry.value / proposals.length) * 100) : 0}%)</strong>
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="h-56 w-56 flex-shrink-0 flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || '#64748b'} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center metric mock */}
            <div className="absolute flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active</span>
              <span className="text-xl font-bold text-slate-850">{proposals.length} Cases</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
