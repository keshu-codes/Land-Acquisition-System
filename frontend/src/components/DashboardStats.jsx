import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { AreaChart, Users, Landmark, CreditCard, Layers } from 'lucide-react';

export default function DashboardStats() {
  const { proposals, language } = useContext(AppContext);

  // Dynamic calculations based on state
  const totalRequired = proposals.reduce((sum, p) => sum + p.areaRequired, 0);
  const totalAcquired = proposals.reduce((sum, p) => sum + p.areaAcquired, 0);
  const totalAssessed = proposals.reduce((sum, p) => sum + p.budgetAssessed, 0);
  const totalDisbursed = proposals.reduce((sum, p) => sum + p.budgetDisbursed, 0);
  const totalAffected = proposals.reduce((sum, p) => sum + p.affectedFamilies, 0);
  const totalDisplaced = proposals.reduce((sum, p) => sum + p.displacedFamilies, 0);
  
  // R&R average weighted by affected families
  const averageRR = Math.round(
    proposals.reduce((sum, p) => sum + (p.rrProgress * p.affectedFamilies), 0) / 
    (totalAffected || 1)
  );

  const stats = [
    {
      label: language === 'en' ? 'Land Notified' : 'भूमि अधिसूचित',
      value: `${totalRequired.toLocaleString()} ha`,
      subText: language === 'en' ? 'Total area proposed for acquisition' : 'अधिग्रहण के लिए प्रस्तावित कुल क्षेत्र',
      icon: Layers,
      color: 'bg-indigo-50 border-indigo-150 text-[#0f2b5c]',
    },
    {
      label: language === 'en' ? 'Land Acquired' : 'भूमि अधिग्रहित',
      value: `${totalAcquired.toLocaleString()} ha`,
      subText: totalRequired 
        ? (language === 'en' ? `${Math.round((totalAcquired / totalRequired) * 100)}% possession complete` : `${Math.round((totalAcquired / totalRequired) * 100)}% कब्जा पूर्ण`)
        : '0% possession complete',
      icon: AreaChart,
      color: 'bg-emerald-50 border-emerald-150 text-emerald-700',
    },
    {
      label: language === 'en' ? 'Compensation Disbursed' : 'मुआवजा संवितरित',
      value: `₹${totalDisbursed.toLocaleString()} Cr`,
      subText: language === 'en' ? `of ₹${totalAssessed.toLocaleString()} Cr total awarded` : `कुल ₹${totalAssessed.toLocaleString()} करोड़ में से`,
      icon: CreditCard,
      color: 'bg-sky-50 border-sky-150 text-sky-700',
    },
    {
      label: language === 'en' ? 'Relocation (R&R) Rate' : 'पुनर्वास (R&R) दर',
      value: `${averageRR}%`,
      subText: language === 'en' ? `${totalDisplaced.toLocaleString()} families resettled` : `${totalDisplaced.toLocaleString()} परिवार पुनर्वासित`,
      icon: Users,
      color: 'bg-orange-50 border-orange-150 text-orange-700',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 font-sans select-none">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4 transition-all hover:shadow-md">
            <div className={`p-3 rounded-lg border ${stat.color} shadow-sm`}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-0.5">{stat.label}</span>
              <span className="text-xl font-extrabold text-slate-800 block leading-tight font-serif">{stat.value}</span>
              <span className="text-[10px] text-slate-400 font-semibold block mt-1.5">{stat.subText}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
