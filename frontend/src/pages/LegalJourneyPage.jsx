import React, { useState } from 'react';
import { FileText, Download, CheckCircle2, ArrowRight, ShieldCheck, Scale, FileCheck2, BookOpen, AlertCircle } from 'lucide-react';

export default function LegalJourneyPage({ setActiveTab }) {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    {
      step: 1,
      title: "Social Impact Assessment (SIA)",
      act: "Section 4 & Section 7",
      time: "Within 6 Months",
      summary: "Comprehensive social impact study conducted by an independent agency to evaluate affected families, livelihood impact, and mandatory Gram Sabha consent.",
      details: [
        "Public hearing conducted in affected villages with 30 days prior notice.",
        "Mandatory 70% consent required for PPP projects & 80% for private projects.",
        "SIA report published in local language on public notice boards."
      ]
    },
    {
      step: 2,
      title: "Preliminary Gazette Notification",
      act: "Section 11 (1)",
      time: "Mandatory Gazette Publication",
      summary: "Official notification published in the State Gazette and two local newspapers specifying plot survey numbers, boundaries, and acquisition purpose.",
      details: [
        "Land transaction and title transfers locked upon Section 11 notice publication.",
        "SMS alerts sent directly to registered mobile numbers of land parcel owners.",
        "Surveyors authorized under Section 12 to enter plot for demarcation."
      ]
    },
    {
      step: 3,
      title: "Objections & Public Hearing",
      act: "Section 15 (1)",
      time: "60 Days Legal Window",
      summary: "Landowners have an absolute statutory right to file objections regarding land area, circle rate valuation, or boundary disputes before the Collector.",
      details: [
        "Objections can be submitted online via single-use email token or in person.",
        "District Collector conducts personal hearing and issues written order within 30 days.",
        "Full transparent tracking of objection status."
      ]
    },
    {
      step: 4,
      title: "Final Declaration & Land Award",
      act: "Section 19 (1) & Section 23",
      time: "Within 12 Months of Sec 11",
      summary: "Final declaration published after SIA approval and disposal of objections. District Collector issues formal land compensation award.",
      details: [
        "Base market value calculated using highest registry transactions in last 3 years.",
        "Mandatory 100% Solatium (Section 30) added to total market value.",
        "12% per annum interest calculated from date of Section 11 notice."
      ]
    },
    {
      step: 5,
      title: "Web3 Smart Escrow Disbursement",
      act: "Section 30 & PFMS DBT",
      time: "Immediate Bank Transfer",
      summary: "Approved compensation award is transferred directly into the landowner's bank account via PFMS and Web3 Smart Escrow with zero middlemen.",
      details: [
        "Direct Bank Transfer (DBT) triggered instantly upon Section 19 verification.",
        "Possession handover recorded on-chain only after 100% funds reach landowner.",
        "Immutable digital receipt generated for legal records."
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 font-sans select-none">
      
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2">
          <span className="bg-indigo-100 text-indigo-800 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider font-mono">
            RFCTLARR Statutory Guide
          </span>
          <span className="text-xs text-slate-500 font-bold">Rights of Landowners</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0f2b5c] font-heading mt-2">
          5-Stage Legal Acquisition Journey
        </h1>
        <p className="text-sm text-slate-600 font-medium mt-1 max-w-3xl">
          Learn how land acquisition is legally conducted step-by-step under RFCTLARR Act 2013, ensuring complete transparency, fair valuation, and 100% solatium protection for every citizen.
        </p>
      </div>

      {/* Interactive Step Navigator */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {steps.map((s) => (
          <button
            key={s.step}
            onClick={() => setActiveStep(s.step)}
            className={`p-4 rounded-xl text-left border cursor-pointer transition-all space-y-2 ${
              activeStep === s.step
                ? 'bg-[#0f2b5c] text-white border-[#0f2b5c] shadow-lg ring-2 ring-[#0f2b5c]'
                : 'bg-white text-slate-700 border-slate-250 hover:bg-slate-50'
            }`}
          >
            <div className="flex justify-between items-center">
              <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                activeStep === s.step ? 'bg-amber-400 text-slate-900' : 'bg-slate-100 text-slate-600'
              }`}>
                Step 0{s.step}
              </span>
              {activeStep === s.step && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
            </div>
            <h3 className="font-extrabold text-xs leading-snug font-heading">{s.title}</h3>
            <span className={`text-[10px] font-mono block ${activeStep === s.step ? 'text-amber-300' : 'text-slate-500'}`}>
              {s.act}
            </span>
          </button>
        ))}
      </div>

      {/* Selected Step Detailed View */}
      {(() => {
        const cur = steps.find(s => s.step === activeStep);
        return (
          <div className="gov-card p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-wrap justify-between items-start border-b border-slate-200 pb-4 gap-2">
              <div>
                <span className="text-xs font-mono font-bold text-[#ea580c] uppercase tracking-wider block">
                  Statutory Mandate: {cur.act}
                </span>
                <h2 className="text-2xl font-extrabold text-[#0f2b5c] font-heading mt-1">{cur.title}</h2>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-3 py-1 rounded-md font-mono">
                {cur.time}
              </span>
            </div>

            <p className="text-sm text-slate-700 font-medium leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
              {cur.summary}
            </p>

            <div className="space-y-3">
              <h3 className="text-xs font-extrabold text-[#0f2b5c] uppercase tracking-wider font-mono">
                Key Legal Requirements & Citizen Entitlements:
              </h3>
              <div className="space-y-2">
                {cur.details.map((d, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs text-slate-700 font-medium">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{d}</span>
                  </div>
                ))}
              </div>
            </div>

            {activeStep === 3 && (
              <div className="pt-2">
                <button
                  onClick={() => setActiveTab('objection')}
                  className="bg-[#ea580c] hover:bg-orange-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <span>File Section 15 Objection / Dispute Now</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        );
      })()}

      {/* Gazette & Public Forms Download Hub */}
      <div className="gov-card p-6 sm:p-8 space-y-6">
        <div className="border-b border-slate-200 pb-4">
          <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono uppercase">Official Downloads</span>
          <h2 className="text-2xl font-extrabold text-[#0f2b5c] font-heading mt-1">Gazette Templates & Forms Hub</h2>
          <p className="text-xs text-slate-500 font-medium">Download statutory notification formats and claim sheets directly.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3">
            <FileText className="h-8 w-8 text-[#0f2b5c] flex-shrink-0 mt-1" />
            <div className="space-y-1">
              <h4 className="font-bold text-xs text-slate-900 font-heading">Section 11 (1) Gazette Format</h4>
              <p className="text-[11px] text-slate-500 font-medium">Official preliminary notice format.</p>
              <button 
                onClick={() => alert("Downloading Section 11 Gazette PDF...")}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#ea580c] hover:underline pt-1 cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" /> Download PDF (1.2 MB)
              </button>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3">
            <FileCheck2 className="h-8 w-8 text-emerald-600 flex-shrink-0 mt-1" />
            <div className="space-y-1">
              <h4 className="font-bold text-xs text-slate-900 font-heading">Form K - Solatium Sheet</h4>
              <p className="text-[11px] text-slate-500 font-medium">Official 100% Solatium claim form.</p>
              <button 
                onClick={() => alert("Downloading Form K Sheet PDF...")}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#ea580c] hover:underline pt-1 cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" /> Download PDF (850 KB)
              </button>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3">
            <BookOpen className="h-8 w-8 text-amber-600 flex-shrink-0 mt-1" />
            <div className="space-y-1">
              <h4 className="font-bold text-xs text-slate-900 font-heading">RFCTLARR 2013 Handbook</h4>
              <p className="text-[11px] text-slate-500 font-medium">Complete legal handbook for citizens.</p>
              <button 
                onClick={() => alert("Downloading Legal Handbook PDF...")}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#ea580c] hover:underline pt-1 cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" /> Download PDF (4.5 MB)
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
