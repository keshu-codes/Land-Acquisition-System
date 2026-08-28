import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { MessageSquare, ShieldCheck, X, Volume2 } from 'lucide-react';

export default function SMSSimulator() {
  const { activeSMS, setActiveSMS } = useContext(AppContext);

  if (!activeSMS) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[999] max-w-sm w-full animate-slideIn select-none font-sans">
      <div className="bg-white border border-slate-250 rounded-2xl shadow-2xl overflow-hidden border-t-4 border-[#0f2b5c]">
        {/* Header bar */}
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <div className="bg-[#0f2b5c]/10 text-[#0f2b5c] p-1.5 rounded-lg">
              <MessageSquare className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Mobile Alert System</span>
              <div className="flex items-center gap-1">
                <strong className="text-xs font-bold text-slate-800">{activeSMS.sender}</strong>
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 fill-emerald-50" />
                <span className="text-[9px] bg-emerald-50 text-emerald-700 px-1 py-0.2 rounded font-bold uppercase tracking-wide">VERIFIED</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Volume2 className="h-3.5 w-3.5 text-slate-400 animate-pulse" />
            <button 
              onClick={() => setActiveSMS(null)}
              className="text-slate-400 hover:text-slate-700 p-0.5 hover:bg-slate-200 rounded cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* SMS Text Bubble */}
        <div className="p-4 bg-[#FAF9F6] border-b border-slate-100">
          <div className="bg-white border border-slate-200 rounded-xl p-3.5 relative">
            <div className="absolute -left-2 top-3 w-3 h-3 bg-white border-l border-b border-slate-200 rotate-45" />
            <p className="text-xs text-slate-700 leading-relaxed font-semibold">
              {activeSMS.message}
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-slate-50 flex justify-between items-center text-[9px] text-slate-400 font-bold uppercase">
          <span>Carrier: National Gateway</span>
          <span>{activeSMS.time}</span>
        </div>
      </div>
    </div>
  );
}
