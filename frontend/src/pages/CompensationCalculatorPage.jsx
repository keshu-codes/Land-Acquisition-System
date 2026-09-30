import React, { useState } from 'react';
import { Calculator, Coins, ShieldCheck, ArrowRight, Info, Scale, CheckCircle2, FileText } from 'lucide-react';

export default function CompensationCalculatorPage({ setActiveTab }) {
  const [calcArea, setCalcArea] = useState(2.0); // Acres
  const [calcCircleRate, setCalcCircleRate] = useState(800); // ₹ per sq ft
  const [calcLandType, setCalcLandType] = useState('semi-urban'); // urban, semi-urban, rural
  const [treeValuation, setTreeValuation] = useState(150000); // ₹ trees/crops
  const [structureValuation, setStructureValuation] = useState(500000); // ₹ structure

  // Calculation logic under RFCTLARR Act 2013 Schedule I & Section 30
  const landAreaSqFt = calcArea * 43560;
  const rawMarketValue = landAreaSqFt * calcCircleRate;
  const landMultiplier = calcLandType === 'rural' ? 2.0 : calcLandType === 'semi-urban' ? 1.5 : 1.0;
  const adjustedMarketValue = rawMarketValue * landMultiplier;
  const solatium100 = adjustedMarketValue; // 100% solatium under Sec 30
  const interest12 = adjustedMarketValue * 0.12; // 12% interest from Sec 11 date
  const totalAssetsValuation = treeValuation + structureValuation;
  const totalCalculatedAward = adjustedMarketValue + solatium100 + interest12 + totalAssetsValuation;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans select-none">
      
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2">
          <span className="bg-amber-100 text-amber-800 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider font-mono">
            RFCTLARR Statutory Calculator Tool
          </span>
          <span className="text-xs text-slate-500 font-bold">Section 30 & First Schedule Compliant</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0f2b5c] font-heading mt-2">
          Land Compensation & Solatium Calculator
        </h1>
        <p className="text-sm text-slate-600 font-medium mt-1 max-w-3xl">
          An easy-to-use legal calculator designed for landowners to determine fair market value, location multiplier (1.0x to 2.0x), mandatory 100% Solatium (Section 30), and statutory interest under the Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act, 2013.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Interactive Controls */}
        <div className="lg:col-span-7 gov-card p-6 sm:p-8 space-y-6">
          
          <h2 className="text-lg font-bold text-[#0f2b5c] border-b border-slate-150 pb-3 flex items-center gap-2 font-heading">
            <Calculator className="h-5 w-5 text-[#ea580c]" />
            Step 1: Enter Land & Parcel Particulars
          </h2>

          {/* Land Area Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs sm:text-sm font-bold">
              <label className="text-slate-700">Land Area to be Acquired:</label>
              <span className="font-mono text-[#ea580c] bg-orange-50 px-3 py-1 rounded-md border border-orange-200 text-sm">
                {calcArea} Acres ({(calcArea * 43560).toLocaleString()} sq. ft)
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="20"
              step="0.1"
              value={calcArea}
              onChange={(e) => setCalcArea(parseFloat(e.target.value))}
              className="w-full accent-[#ea580c] cursor-pointer h-2 bg-slate-200 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0.1 Acre</span>
              <span>10 Acres</span>
              <span>20 Acres</span>
            </div>
          </div>

          {/* Circle Rate Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs sm:text-sm font-bold">
              <label className="text-slate-700">Base Circle Rate / Registry Rate:</label>
              <span className="font-mono text-[#0f2b5c] bg-indigo-50 px-3 py-1 rounded-md border border-indigo-200 text-sm">
                ₹{calcCircleRate.toLocaleString('en-IN')} per sq. ft
              </span>
            </div>
            <input
              type="range"
              min="100"
              max="10000"
              step="100"
              value={calcCircleRate}
              onChange={(e) => setCalcCircleRate(parseInt(e.target.value))}
              className="w-full accent-[#0f2b5c] cursor-pointer h-2 bg-slate-200 rounded-lg"
            />
          </div>

          {/* Land Location Multiplier Buttons */}
          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-bold text-slate-700 block">
              Land Location Category (Multiplier Factor):
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setCalcLandType('urban')}
                className={`p-3 rounded-xl text-xs font-bold border cursor-pointer transition-all text-center space-y-1 ${
                  calcLandType === 'urban' 
                    ? 'bg-[#0f2b5c] text-white border-[#0f2b5c] shadow-md ring-2 ring-[#0f2b5c]' 
                    : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                <div className="font-heading font-extrabold text-sm">Urban Zone</div>
                <div className={`text-[10px] ${calcLandType === 'urban' ? 'text-slate-200' : 'text-slate-500'}`}>Multiplier: 1.0x</div>
              </button>

              <button
                type="button"
                onClick={() => setCalcLandType('semi-urban')}
                className={`p-3 rounded-xl text-xs font-bold border cursor-pointer transition-all text-center space-y-1 ${
                  calcLandType === 'semi-urban' 
                    ? 'bg-[#0f2b5c] text-white border-[#0f2b5c] shadow-md ring-2 ring-[#0f2b5c]' 
                    : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                <div className="font-heading font-extrabold text-sm">Semi-Urban</div>
                <div className={`text-[10px] ${calcLandType === 'semi-urban' ? 'text-slate-200' : 'text-slate-500'}`}>Multiplier: 1.5x</div>
              </button>

              <button
                type="button"
                onClick={() => setCalcLandType('rural')}
                className={`p-3 rounded-xl text-xs font-bold border cursor-pointer transition-all text-center space-y-1 ${
                  calcLandType === 'rural' 
                    ? 'bg-[#0f2b5c] text-white border-[#0f2b5c] shadow-md ring-2 ring-[#0f2b5c]' 
                    : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                <div className="font-heading font-extrabold text-sm">Rural / Agri</div>
                <div className={`text-[10px] ${calcLandType === 'rural' ? 'text-slate-200' : 'text-slate-500'}`}>Multiplier: 2.0x</div>
              </button>
            </div>
          </div>

          {/* Trees & Structures Valuation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-150">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Tree / Crop Valuation (₹):</label>
              <input
                type="number"
                value={treeValuation}
                onChange={(e) => setTreeValuation(parseInt(e.target.value) || 0)}
                className="w-full text-xs font-bold p-2.5 rounded-lg border border-slate-300 outline-none focus:border-[#0f2b5c]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Building / Structure Valuation (₹):</label>
              <input
                type="number"
                value={structureValuation}
                onChange={(e) => setStructureValuation(parseInt(e.target.value) || 0)}
                className="w-full text-xs font-bold p-2.5 rounded-lg border border-slate-300 outline-none focus:border-[#0f2b5c]"
              />
            </div>
          </div>

        </div>

        {/* Right Column: Clear Award Break-down */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-gradient-to-br from-[#0f2b5c] to-[#1e3a8a] text-white p-6 sm:p-8 rounded-2xl shadow-2xl space-y-6 border border-slate-700">
            <div>
              <span className="text-[11px] font-mono text-amber-400 font-bold uppercase tracking-wider block">
                Total Statutory Compensation Award
              </span>
              <span className="text-4xl sm:text-5xl font-extrabold text-white font-mono block mt-2">
                ₹{(totalCalculatedAward / 100000).toFixed(2)} Lakhs
              </span>
              <span className="text-xs text-slate-300 font-medium block mt-1">
                (₹{totalCalculatedAward.toLocaleString('en-IN')})
              </span>
            </div>

            {/* Detailed Line Items */}
            <div className="space-y-3 text-xs divide-y divide-white/10 pt-2">
              <div className="flex justify-between py-1.5">
                <span className="text-slate-300">Raw Circle Market Value:</span>
                <span className="font-mono font-bold text-white">₹{(rawMarketValue / 100000).toFixed(2)} L</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-300">Location Value ({landMultiplier}x multiplier):</span>
                <span className="font-mono font-bold text-white">₹{(adjustedMarketValue / 100000).toFixed(2)} L</span>
              </div>
              <div className="flex justify-between py-1.5 text-amber-300">
                <span className="font-extrabold">+ 100% Solatium (Section 30):</span>
                <span className="font-mono font-extrabold">₹{(solatium100 / 100000).toFixed(2)} L</span>
              </div>
              <div className="flex justify-between py-1.5 text-emerald-300">
                <span className="font-extrabold">+ 12% Annual Interest (Section 30):</span>
                <span className="font-mono font-extrabold">₹{(interest12 / 100000).toFixed(2)} L</span>
              </div>
              <div className="flex justify-between py-1.5 text-sky-300">
                <span className="font-extrabold">+ Structural & Crop Assets:</span>
                <span className="font-mono font-extrabold">₹{(totalAssetsValuation / 100000).toFixed(2)} L</span>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('web3')}
              className="w-full bg-[#ea580c] hover:bg-orange-700 text-white font-bold py-3 rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-orange-500/20"
            >
              <Coins className="h-4 w-4 text-white" />
              <span>Verify Web3 Smart Contract Escrow Payout</span>
            </button>
          </div>

          <div className="gov-card p-5 space-y-3">
            <h3 className="text-xs font-bold text-[#0f2b5c] uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Scale className="h-4 w-4 text-[#ea580c]" /> Legal Solatium Guarantee
            </h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Under RFCTLARR Act 2013, the District Competent Authority cannot deduct or reduce mandatory 100% solatium. All calculations are locked into Web3 smart contracts to guarantee complete payment transparency.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
