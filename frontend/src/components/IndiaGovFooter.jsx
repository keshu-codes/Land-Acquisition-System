import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function IndiaGovFooter() {
  const policyLinks = [
    { label: "About NLAMS", href: "#" },
    { label: "Survey & Settlements", href: "#" },
    { label: "Terms of Use", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Copyright Policy", href: "#" },
    { label: "Accessibility Statement", href: "#" },
    { label: "Contact Us", href: "#" },
  ];

  return (
    <footer className="bg-[#1b5e20] text-emerald-100 font-sans text-xs border-t-2 border-emerald-700">
      
      {/* Tier 1: Policy Links Bar */}
      <div className="border-b border-emerald-700/60 py-3 px-4 sm:px-8 bg-[#144a19]">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center items-center gap-x-5 gap-y-2 text-[11px] font-medium text-emerald-100">
          {policyLinks.map((link, idx) => (
            <React.Fragment key={idx}>
              <a 
                href={link.href} 
                className="hover:text-amber-300 transition hover-pop inline-block"
              >
                {link.label}
              </a>
              {idx < policyLinks.length - 1 && (
                <span className="text-emerald-500 hidden sm:inline">|</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Tier 2: Clean Footer Info */}
      <div className="py-6 px-4 sm:px-8 text-center space-y-1 text-xs">
        <p className="font-extrabold text-white text-sm font-serif">
          NLAMS — National Land Acquisition & Management System
        </p>
        <p className="text-[11px] text-emerald-200">
          Survey, Settlements and Land Records • Digital Governance Portal
        </p>
        <p className="text-[10px] text-emerald-300/70 pt-2">
          © 2026 NLAMS. All Rights Reserved.
        </p>
      </div>

    </footer>
  );
}


