import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  Landmark, MapPin, ChevronRight, FileText, 
  Users, Lock, Shield, CheckCircle, Search, ExternalLink,
  Scale, BookOpen, Building, Phone, AlertCircle, ArrowRight, Download
} from 'lucide-react';

export default function Home({ setActiveTab }) {
  const { t, language, proposals, setShowLoginModal } = useContext(AppContext);

  const totalRequired = proposals.reduce((sum, p) => sum + p.areaRequired, 0);
  const totalAcquired = proposals.reduce((sum, p) => sum + p.areaAcquired, 0);
  const totalDisbursed = proposals.reduce((sum, p) => sum + p.budgetDisbursed, 0);

  const coreServices = [
    {
      id: 'dashboard',
      title: language === 'en' ? 'National Land MIS Dashboard' : 'राष्ट्रीय भूमि एमआईएस डैशबोर्ड',
      desc: language === 'en' ? 'Real-time project tracking, state possession status, and macro analytics.' : 'वास्तविक समय परियोजना ट्रैकिंग और राज्यवार विश्लेषण।',
      icon: Landmark,
      badge: 'MoRD Central'
    },
    {
      id: 'workflow',
      title: language === 'en' ? 'RFCTLARR Statutory Cases' : 'विधिक भूमि अर्जन मामले',
      desc: language === 'en' ? 'Sequential lifecycle from Section 4 SIA to Section 23 Award Declarations.' : 'धारा 4 से धारा 23 पंचाट घोषणा तक क्रमिक कानूनी प्रक्रिया।',
      icon: Scale,
      badge: 'Statutory 2013'
    },
    {
      id: 'dispatch',
      title: language === 'en' ? 'Section 11 Notice Dispatch' : 'धारा 11 नोटिस प्रेषण',
      desc: language === 'en' ? 'Haversine surveyor assignment and cryptographic 30-day tokenized links.' : 'निकटतम सर्वेयर चयन और सुरक्षित नागरिक नोटिस प्रेषण।',
      icon: FileText,
      badge: 'District Magistrate'
    },
    {
      id: 'web3',
      title: language === 'en' ? 'Direct Benefit Transfer (DBT)' : 'प्रत्यक्ष लाभ हस्तांतरण (DBT)',
      desc: language === 'en' ? 'Smart contract escrow disbursement with 100% Solatium calculation.' : '100% सोलेशियम गणना सहित बैंक खातों में प्रत्यक्ष मुआवजा।',
      icon: Shield,
      badge: 'PFMS Handshake'
    },
    {
      id: 'survey',
      title: language === 'en' ? 'Mobile Cadastral GPS Node' : 'मोबाइल भूकर जीपीएस नोड',
      desc: language === 'en' ? 'Field officer tablet station for sub-3m boundary geo-fencing.' : 'फील्ड अधिकारियों हेतु ऑन-साइट सैटेलाइट जीपीएस सीमा निर्धारण।',
      icon: MapPin,
      badge: 'Section 12 Field'
    },
    {
      id: 'workflow',
      title: language === 'en' ? 'Gazette Publication Archive' : 'राजपत्र प्रकाशन अभिलेखागार',
      desc: language === 'en' ? 'Official Gazette notifications and 60-day public hearing registers.' : 'आधिकारिक राजपत्र अधिसूचनाएं और जनसुनवाई रजिस्टर।',
      icon: BookOpen,
      badge: 'Public Records'
    }
  ];

  const quickStats = [
    { label: language === 'en' ? 'Total Notified Land' : 'कुल अधिसूचित भूमि', value: `${totalRequired.toLocaleString()} ha` },
    { label: language === 'en' ? 'Possession Completed' : 'कब्जा पूर्ण', value: `${totalAcquired.toLocaleString()} ha` },
    { label: language === 'en' ? 'Compensation Released' : 'मुआवजा जारी', value: `₹${totalDisbursed.toLocaleString()} Cr` },
    { label: language === 'en' ? 'Interoperable Registries' : 'संबद्ध रजिस्ट्रियां', value: 'BHOOMI • PFMS' }
  ];

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans text-slate-800 select-none">
      
      {/* ── Official Ministry Hero Banner ── */}
      <div className="bg-white border-b border-slate-300 py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 bg-slate-100 border border-slate-300 px-3 py-1 rounded text-xs font-bold text-[#0f2b5c] font-serif">
              <span className="w-2 h-2 rounded-full bg-[#ea580c]" />
              {language === 'en' ? 'Digital India Land Records Modernization Mission' : 'डिजिटल इंडिया भूमि अभिलेख आधुनिकीकरण मिशन'}
            </div>

            <h1 className="text-2xl sm:text-4xl font-bold text-[#0f2b5c] font-serif tracking-tight leading-tight">
              {language === 'en' 
                ? 'Unified National Land Acquisition & Management Information System' 
                : 'एकीकृत राष्ट्रीय भूमि अधिग्रहण एवं प्रबंधन सूचना प्रणाली'}
            </h1>

            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-3xl">
              {language === 'en'
                ? 'A single-window national digital infrastructure enforcing the Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act, 2013 (RFCTLARR). Direct integration with BHOOMI, Bhunaksha, PM GatiShakti NMP, and PFMS.'
                : 'भूमि अधिग्रहण, पुनर्वास और पुनर्व्यवस्थापन में उचित मुआवजा और पारदर्शिता का अधिकार अधिनियम, 2013 (RFCTLARR) के प्रभावी क्रियान्वयन हेतु एकल खिड़की राष्ट्रीय डिजिटल पोर्टल।'}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setActiveTab('dashboard')}
                className="bg-[#0f2b5c] hover:bg-[#0c224a] text-white px-5 py-2.5 rounded text-xs font-bold font-serif flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <span>{language === 'en' ? 'Launch National MIS Dashboard' : 'राष्ट्रीय एमआईएस डैशबोर्ड'}</span>
                <ChevronRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => setShowLoginModal(true)}
                className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 px-5 py-2.5 rounded text-xs font-bold font-serif transition-colors cursor-pointer"
              >
                {language === 'en' ? 'Official Stakeholder Login' : 'अधिकारी / नागरिक लॉगिन'}
              </button>
            </div>
          </div>

          {/* Right: National Portal At-A-Glance Card */}
          <div className="lg:col-span-4 bg-[#0f2b5c] text-white p-5 rounded-md border-t-4 border-[#ea580c] shadow-sm space-y-4">
            <div className="border-b border-white/20 pb-2">
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block font-serif">National Overview</span>
              <h3 className="text-sm font-bold font-serif">Acquisition Status (FY 2026-27)</h3>
            </div>

            <div className="space-y-2.5 divide-y divide-white/10 text-xs">
              {quickStats.map((stat, idx) => (
                <div key={idx} className="flex justify-between items-center pt-2">
                  <span className="text-slate-300 text-[11px]">{stat.label}</span>
                  <strong className="text-white font-serif font-bold">{stat.value}</strong>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-white/20 text-[10px] text-slate-300 flex items-center justify-between">
              <span>Security: SHA-256 JWT Signed</span>
              <span className="text-emerald-400 font-bold">100% Compliant</span>
            </div>
          </div>

        </div>
      </div>

      {/* ── Core Government Services Grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-6">
        <div>
          <span className="text-[10px] font-bold text-[#ea580c] uppercase tracking-wider block font-serif">Official Services</span>
          <h2 className="text-xl font-bold text-[#0f2b5c] font-serif">
            {language === 'en' ? 'Integrated Land Acquisition Service Modules' : 'एकीकृत भूमि अधिग्रहण सेवा मॉड्यूल'}
          </h2>
          <p className="text-xs text-slate-500 font-medium">Select an authorized module to access statutory workflows, cadastral GIS data, or dispute resolution:</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {coreServices.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <div
                key={idx}
                onClick={() => setActiveTab(srv.id)}
                className="bg-white border border-slate-300 p-5 rounded-md hover:border-[#0f2b5c] hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="h-9 w-9 rounded bg-slate-100 border border-slate-200 text-[#0f2b5c] flex items-center justify-center group-hover:bg-[#0f2b5c] group-hover:text-white transition-colors">
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <span className="text-[9.5px] font-bold font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                      {srv.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-800 text-sm font-serif group-hover:text-[#0f2b5c] transition-colors">
                      {srv.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-normal leading-relaxed mt-1">
                      {srv.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-150 mt-4 flex items-center justify-between text-xs font-bold text-[#0f2b5c] group-hover:text-[#ea580c]">
                  <span>Access Module</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── National Projects Master Ledger (Tabular View) ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pb-12">
        <div className="bg-white border border-slate-300 rounded-md overflow-hidden">
          
          <div className="bg-[#0f2b5c] text-white px-5 py-3.5 flex flex-wrap justify-between items-center gap-3">
            <div>
              <h3 className="font-bold text-sm font-serif">Active Notified Projects (RFCTLARR Act)</h3>
              <p className="text-[10.5px] text-slate-300">National Master Registry of notified public infrastructure corridors</p>
            </div>
            <button
              onClick={() => setActiveTab('dashboard')}
              className="bg-[#ea580c] hover:bg-orange-700 text-white px-3 py-1 rounded text-xs font-bold font-serif flex items-center gap-1 cursor-pointer"
            >
              <span>View Full GIS Map</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 font-serif text-[11px] font-bold">
                  <th className="p-3">Project ID</th>
                  <th className="p-3">Infrastructure Project Title</th>
                  <th className="p-3">Acquiring Agency</th>
                  <th className="p-3">State</th>
                  <th className="p-3">Notified Area</th>
                  <th className="p-3">Possession (ha)</th>
                  <th className="p-3">Budget Awarded</th>
                  <th className="p-3">Statutory Stage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {proposals.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-mono font-bold text-[#0f2b5c]">{p.id}</td>
                    <td className="p-3 font-bold text-slate-800">{p.title}</td>
                    <td className="p-3 text-slate-600">{p.agency}</td>
                    <td className="p-3 text-slate-600">{p.state}</td>
                    <td className="p-3 font-serif">{p.areaRequired} ha</td>
                    <td className="p-3 font-serif font-bold text-emerald-700">{p.areaAcquired} ha</td>
                    <td className="p-3 font-serif">₹{p.budgetAssessed} Cr</td>
                    <td className="p-3">
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>

      {/* ── Official Government Footer ── */}
      <footer className="bg-[#0b1d3a] text-white border-t-4 border-[#ea580c] pt-10 pb-6 px-4 sm:px-8 text-xs font-sans">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-white/10">
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Landmark className="h-5 w-5 text-amber-400" />
              <span className="font-bold text-sm font-serif">NLAMS Portal</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Designed, developed and hosted by the <strong>National Informatics Centre (NIC)</strong> for the Department of Land Resources, Ministry of Rural Development, Government of India.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold font-serif text-amber-400 text-xs uppercase tracking-wider">Statutory Acts & Guidelines</h4>
            <ul className="space-y-1.5 text-slate-300 text-[11px]">
              <li>• RFCTLARR Act, 2013</li>
              <li>• Section 11 Preliminary Notification</li>
              <li>• Section 19 Declaration of Acquisition</li>
              <li>• Section 30 Solatium Mandate (100%)</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold font-serif text-amber-400 text-xs uppercase tracking-wider">Interoperable National Portals</h4>
            <ul className="space-y-1.5 text-slate-300 text-[11px]">
              <li>• PM GatiShakti National Master Plan</li>
              <li>• Digital India Land Records (DILRMP)</li>
              <li>• BHOOMI State Land Records</li>
              <li>• Public Financial Management System (PFMS)</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold font-serif text-amber-400 text-xs uppercase tracking-wider">Helpdesk & Support</h4>
            <p className="text-slate-300 text-[11px]">Toll-Free Helpline: <strong>1800-11-2026</strong></p>
            <p className="text-slate-400 text-[10.5px]">Email: support-nlams@nic.in</p>
            <p className="text-slate-400 text-[10.5px]">Krishi Bhawan, Dr. Rajendra Prasad Road, New Delhi - 110001</p>
          </div>

        </div>

        <div className="max-w-7xl mx-auto pt-6 flex flex-wrap justify-between items-center text-[10.5px] text-slate-400 gap-3">
          <div>
            © 2026 Department of Land Resources, Government of India. All Rights Reserved.
          </div>
          <div className="flex gap-4">
            <span>Website Policies</span>
            <span>Terms of Use</span>
            <span>Accessibility Statement</span>
            <span>STQC Certified</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
