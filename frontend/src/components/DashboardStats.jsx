import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { AreaChart, Users, CreditCard, Layers } from 'lucide-react';

export default function DashboardStats() {
  const { proposals, language } = useContext(AppContext);

  const totalRequired = proposals.reduce((sum, p) => sum + p.areaRequired, 0);
  const totalAcquired = proposals.reduce((sum, p) => sum + p.areaAcquired, 0);
  const totalAssessed = proposals.reduce((sum, p) => sum + p.budgetAssessed, 0);
  const totalDisbursed = proposals.reduce((sum, p) => sum + p.budgetDisbursed, 0);
  const totalAffected = proposals.reduce((sum, p) => sum + p.affectedFamilies, 0);
  const totalDisplaced = proposals.reduce((sum, p) => sum + p.displacedFamilies, 0);
  
  const averageRR = Math.round(
    proposals.reduce((sum, p) => sum + (p.rrProgress * p.affectedFamilies), 0) / 
    (totalAffected || 1)
  );

  const stats = [
    {
      label: language === 'en' ? 'Land Notified' : 'भूमि अधिसूचित',
      value: `${totalRequired.toLocaleString()} ha`,
      subText: language === 'en' ? 'Total area under Section 11' : 'धारा 11 के अंतर्गत कुल क्षेत्र',
      icon: Layers,
      highlight: 'text-[#0f2b5c]'
    },
    {
      label: language === 'en' ? 'Land Handed Over' : 'भूमि हस्तांतरित',
      value: `${totalAcquired.toLocaleString()} ha`,
      subText: totalRequired 
        ? (language === 'en' ? `${Math.round((totalAcquired / totalRequired) * 100)}% possession complete` : `${Math.round((totalAcquired / totalRequired) * 100)}% कब्जा पूर्ण`)
        : '0% possession complete',
      icon: AreaChart,
      highlight: 'text-emerald-700'
    },
    {
      label: language === 'en' ? 'Compensation Disbursed' : 'मुआवजा संवितरित',
      value: `₹${totalDisbursed.toLocaleString()} Cr`,
      subText: language === 'en' ? `of ₹${totalAssessed.toLocaleString()} Cr total awarded` : `कुल ₹${totalAssessed.toLocaleString()} करोड़ में से`,
      icon: CreditCard,
      highlight: 'text-[#0f2b5c]'
    },
    {
      label: language === 'en' ? 'Resettlement (R&R) Rate' : 'पुनर्वास (R&R) दर',
      value: `${averageRR}%`,
      subText: language === 'en' ? `${totalDisplaced.toLocaleString()} families resettled` : `${totalDisplaced.toLocaleString()} परिवार पुनर्वासित`,
      icon: Users,
      highlight: 'text-orange-700'
    },
  ];

  return (
    <div className="bg-white border border-slate-300 rounded-md grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 font-sans select-none">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="p-4 sm:p-5 flex items-start justify-between gap-3">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block font-serif">
                {stat.label}
              </span>
              <strong className={`text-xl sm:text-2xl font-bold block leading-tight font-serif ${stat.highlight}`}>
                {stat.value}
              </strong>
              <span className="text-[10px] text-slate-500 font-medium block">
                {stat.subText}
              </span>
            </div>
            <div className="p-2 rounded bg-slate-100 border border-slate-200 text-slate-600 flex-shrink-0">
              <Icon className="h-4 w-4" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
