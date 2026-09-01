import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { AreaChart, Users, CreditCard, Layers } from 'lucide-react';

export default function DashboardStats() {
  const { proposals, language } = useContext(AppContext);

  const safeProposals = proposals || [];
  const totalRequired = safeProposals.reduce((sum, p) => sum + p.areaRequired, 0);
  const totalAcquired = safeProposals.reduce((sum, p) => sum + p.areaAcquired, 0);
  const totalAssessed = safeProposals.reduce((sum, p) => sum + p.budgetAssessed, 0);
  const totalDisbursed = safeProposals.reduce((sum, p) => sum + p.budgetDisbursed, 0);
  const totalAffected = safeProposals.reduce((sum, p) => sum + p.affectedFamilies, 0);
  const totalDisplaced = safeProposals.reduce((sum, p) => sum + p.displacedFamilies, 0);
  
  const averageRR = Math.round(
    safeProposals.reduce((sum, p) => sum + (p.rrProgress * p.affectedFamilies), 0) / 
    (totalAffected || 1)
  );

  const stats = [
    {
      label: language === 'en' ? 'Land Notified' : 'भूमि अधिसूचित',
      value: `${totalRequired.toLocaleString()} ha`,
      subText: language === 'en' ? 'Total area under Section 11' : 'धारा 11 के अंतर्गत कुल क्षेत्र',
      icon: Layers,
      color: 'text-[#12355B]'
    },
    {
      label: language === 'en' ? 'Land Handed Over' : 'भूमि हस्तांतरित',
      value: `${totalAcquired.toLocaleString()} ha`,
      subText: totalRequired 
        ? (language === 'en' ? `${Math.round((totalAcquired / totalRequired) * 100)}% possession complete` : `${Math.round((totalAcquired / totalRequired) * 100)}% कब्जा पूर्ण`)
        : '0% possession complete',
      icon: AreaChart,
      color: 'text-[#2F6B4F]'
    },
    {
      label: language === 'en' ? 'Compensation Disbursed' : 'मुआवजा संवितरित',
      value: `₹${totalDisbursed.toLocaleString()} Cr`,
      subText: language === 'en' ? `of ₹${totalAssessed.toLocaleString()} Cr awarded` : `कुल ₹${totalAssessed.toLocaleString()} करोड़ में से`,
      icon: CreditCard,
      color: 'text-[#7A5C3E]'
    },
    {
      label: language === 'en' ? 'Resettlement (R&R) Rate' : 'पुनर्वास (R&R) दर',
      value: `${averageRR}%`,
      subText: language === 'en' ? `${totalDisplaced.toLocaleString()} families resettled` : `${totalDisplaced.toLocaleString()} परिवार पुनर्वासित`,
      icon: Users,
      color: 'text-[#C98B2E]'
    },
  ];

  return (
    <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="space-y-1.5 p-3 rounded-2xl bg-[#FAF9F6] border border-stone-200">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block font-serif">
                  {stat.label}
                </span>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <strong className={`text-2xl font-black block font-mono ${stat.color}`}>
                {stat.value}
              </strong>
              <span className="text-[11px] text-slate-500 font-medium block">
                {stat.subText}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
