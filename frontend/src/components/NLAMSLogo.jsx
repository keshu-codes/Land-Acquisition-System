import React from 'react';

export default function NLAMSLogo({ className = "h-10 w-10" }) {
  return (
    <div className={`inline-flex items-center justify-center bg-gradient-to-br from-[#12355B] to-[#1E40AF] p-1.5 rounded-xl border border-amber-400/50 shadow-md flex-shrink-0 ${className}`}>
      <svg className="w-full h-full text-amber-400" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Shield Outer Outline */}
        <path d="M20 4L34 9V19C34 27.5 28 34.5 20 37C12 34.5 6 27.5 6 19V9L20 4Z" fill="url(#shieldGrad)" stroke="#F59E0B" strokeWidth="2" />
        {/* Cadastral Polygon Grid Lines */}
        <path d="M12 14L20 18L28 14" stroke="#6EE7B7" strokeWidth="1.5" strokeDasharray="2 2" />
        <path d="M20 18V28" stroke="#6EE7B7" strokeWidth="1.5" strokeDasharray="2 2" />
        <path d="M15 22L25 22" stroke="#6EE7B7" strokeWidth="1.5" strokeDasharray="2 2" />
        {/* Central Golden GIS Pin */}
        <circle cx="20" cy="18" r="4" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="1.5" />
        <circle cx="20" cy="18" r="1.5" fill="#12355B" />
        <defs>
          <linearGradient id="shieldGrad" x1="6" y1="4" x2="34" y2="37" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1E3A8A" />
            <stop offset="1" stopColor="#0F172A" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
