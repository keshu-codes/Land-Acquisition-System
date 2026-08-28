import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  Shield, Wallet, CheckCircle, HelpCircle, ArrowUpRight, Lock, 
  ExternalLink, Layers, Search, RefreshCw, FileText, Check, AlertTriangle, X, Printer, Receipt
} from 'lucide-react';

export default function CompensationPortal() {
  const { 
    proposals, 
    blockchainLog, 
    walletConnected, 
    walletAddress, 
    connectWallet,
    updateCompensationPayment,
    language,
    t
  } = useContext(AppContext);

  const [selectedProjectId, setSelectedProjectId] = useState(proposals[0]?.id || "");
  const [claimAmount, setClaimAmount] = useState("");
  const [verifyFileName, setVerifyFileName] = useState("");
  const [verifyStatus, setVerifyStatus] = useState(null); // 'idle', 'verifying', 'success', 'fail'
  const [computedHash, setComputedHash] = useState("");

  // Payout Advice Receipt Modal State
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  useEffect(() => {
    if (!selectedProjectId && proposals && proposals.length > 0) {
      setSelectedProjectId(proposals[0].id);
    }
  }, [proposals, selectedProjectId]);

  const activeProj = proposals.find(p => p.id === selectedProjectId) || proposals[0];

  const handleClaim = (e) => {
    e.preventDefault();
    if (!walletConnected) {
      alert("Please connect your Web3 wallet first.");
      return;
    }
    if (!claimAmount || parseFloat(claimAmount) <= 0) {
      alert("Please enter a valid compensation amount.");
      return;
    }
    const amt = parseFloat(claimAmount);
    const maxPayable = activeProj.budgetAssessed - activeProj.budgetDisbursed;
    if (amt > maxPayable) {
      alert(`Entered amount exceeds remaining unpaid compensation (₹${maxPayable} Cr).`);
      return;
    }

    updateCompensationPayment(selectedProjectId, amt);
    
    // Open receipt modal automatically
    setReceiptData({
      id: activeProj.id,
      title: activeProj.title,
      agency: activeProj.agency,
      state: activeProj.state,
      district: activeProj.district,
      amount: amt,
      wallet: walletAddress,
      txHash: "0x" + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join(''),
      block: 105000 + Math.floor(Math.random() * 100)
    });
    setReceiptOpen(true);
    setClaimAmount("");
  };

  const openReceiptFromLog = (log) => {
    // Generate a matching receipt mapping
    setReceiptData({
      id: "PRJ-001",
      title: log.details.split("for ")[1] || "Land Payout",
      agency: "Competent Authority for Land Acquisition",
      state: "State Land Registry Node",
      district: "Treasury Division",
      amount: parseFloat(log.details.replace(/[^\d.]/g, '')) || 10.0,
      wallet: walletConnected ? walletAddress : "0xSysAdmin_Address",
      txHash: log.txHash,
      block: log.block
    });
    setReceiptOpen(true);
  };

  const simulateVerifyFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setVerifyFileName(file.name);
    setVerifyStatus("verifying");

    // Compute a mock SHA-256 hash based on filename and size
    setTimeout(() => {
      const mockHash = "0x" + Array.from({length: 64}, (_, i) => 
        ((file.name.charCodeAt(i % file.name.length) + file.size) % 16).toString(16)
      ).join('');

      setComputedHash(mockHash);
      
      // Simulating deed verification
      if (file.name.toLowerCase().includes("deed") || file.name.toLowerCase().includes("land") || Math.random() > 0.3) {
        setVerifyStatus("success");
      } else {
        setVerifyStatus("fail");
      }
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 font-sans select-none">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-[#0f2b5c] tracking-tight font-serif">{t('web3PortalTitle')}</h1>
          <p className="text-xs text-slate-500 font-semibold">{t('web3PortalSub')}</p>
        </div>

        {/* Connect Button */}
        <button
          onClick={connectWallet}
          className={`flex items-center gap-2 px-4.5 py-2.5 rounded-lg text-xs font-bold transition-all border shadow-sm cursor-pointer ${
            walletConnected 
              ? 'bg-emerald-50 border-emerald-350 text-emerald-700 hover:bg-emerald-100' 
              : 'bg-[#0f2b5c] border-[#0f2b5c] text-white hover:bg-[#0c224a]'
          }`}
        >
          <Wallet className="h-4 w-4" />
          {walletConnected 
            ? `${language === 'en' ? 'Connected' : 'कनेक्टेड'}: ${walletAddress.substring(0, 6)}...${walletAddress.substring(38)}` 
            : t('connectWallet')
          }
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Compensation disbursement & verify tool */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Compensation Disbursals Section */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-[#0f2b5c] text-sm flex items-center gap-1.5 border-b border-slate-100 pb-3 font-serif">
              <Lock className="h-4.5 w-4.5" />
              {t('payoutConsole')}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Selector */}
              <div>
                <label className="block text-[9px] uppercase font-bold text-slate-400 mb-1">{language === 'en' ? 'Select Land Acquisition Project' : 'भूमि अर्जन परियोजना चुनें'}</label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="w-full text-xs font-bold border border-slate-250 rounded-lg p-2.5 bg-slate-50 focus:outline-none cursor-pointer shadow-sm"
                >
                  {proposals.map(p => (
                    <option key={p.id} value={p.id}>{p.id} - {(p.title || "").substring(0, 35)}...</option>
                  ))}
                </select>
              </div>

              {/* Status Info */}
              {activeProj && (
                <div className="bg-slate-50 border border-slate-150 p-3 rounded-lg text-xs grid grid-cols-2 gap-2.5">
                  <div>
                    <span className="text-slate-400 block text-[8px] uppercase font-bold mb-0.5">{t('assessedBudget')}</span>
                    <strong className="text-slate-700 font-extrabold">₹{activeProj.budgetAssessed} Cr</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[8px] uppercase font-bold mb-0.5">{t('paidComp')}</span>
                    <strong className="text-emerald-700 font-extrabold">₹{activeProj.budgetDisbursed} Cr</strong>
                  </div>
                  <div className="col-span-2 border-t border-slate-200 pt-2 flex justify-between text-[11px] font-semibold">
                    <span className="text-slate-500">{t('unpaidBalance')}:</span>
                    <span className="text-slate-800 font-bold">₹{(activeProj.budgetAssessed - activeProj.budgetDisbursed).toFixed(1)} Cr</span>
                  </div>
                </div>
              )}
            </div>

            {/* Release Form */}
            {activeProj && (
              <form onSubmit={handleClaim} className="border-t border-slate-100 pt-4 space-y-4">
                <div>
                  <label className="block text-[9px] uppercase font-bold text-slate-400 mb-1">{t('releaseAmount')}</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      required
                      disabled={!walletConnected}
                      placeholder={walletConnected ? `Max: ${(activeProj.budgetAssessed - activeProj.budgetDisbursed).toFixed(1)} Cr` : "Connect wallet to authorize disbursement"}
                      value={claimAmount}
                      onChange={(e) => setClaimAmount(e.target.value)}
                      className="w-full text-xs font-semibold border border-slate-250 rounded-lg p-2.5 pr-14 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#0f2b5c]/10 focus:border-[#0f2b5c] disabled:opacity-60 shadow-sm"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">Cr INR</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!walletConnected || (activeProj.budgetAssessed - activeProj.budgetDisbursed) <= 0}
                  className="w-full bg-[#0f2b5c] text-white hover:bg-[#0c224a] disabled:bg-slate-100 disabled:text-slate-400 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                >
                  <ArrowUpRight className="h-4.5 w-4.5 text-emerald-400" />
                  {t('signRelease')}
                </button>
              </form>
            )}
          </div>

          {/* Land Deed Verification Tool */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-[#0f2b5c] text-sm flex items-center gap-1.5 border-b border-slate-100 pb-3 font-serif">
              <FileText className="h-4.5 w-4.5" />
              {t('documentRegistryTitle')}
            </h3>
            
            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              {t('documentRegistrySub')}
            </p>

            <div className="border-2 border-dashed border-slate-200 hover:border-[#0f2b5c] rounded-xl p-6 text-center transition-colors cursor-pointer relative bg-slate-50/50">
              <input 
                type="file" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={simulateVerifyFile}
              />
              <div className="space-y-1.5 flex flex-col items-center">
                <FileText className="h-8 w-8 text-slate-400" />
                <span className="text-xs font-bold text-slate-700">
                  {verifyFileName || t('dropzoneLabel')}
                </span>
                <span className="text-[9px] text-slate-400 font-semibold">{t('dropzoneSub')}</span>
              </div>
            </div>

            {/* Verification Result */}
            {verifyStatus !== null && (
              <div className="rounded-xl border border-slate-200 p-4.5 animate-fadeIn">
                {verifyStatus === "verifying" && (
                  <div className="flex items-center gap-2 text-slate-500 font-bold text-xs">
                    <RefreshCw className="h-4.5 w-4.5 animate-spin text-[#ea580c]" />
                    {t('verifyingLabel')}
                  </div>
                )}

                {verifyStatus === "success" && (
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-emerald-700 font-extrabold text-xs uppercase tracking-wide">
                      <Check className="h-4.5 w-4.5 bg-emerald-100 text-emerald-600 rounded-full p-0.5" />
                      {t('authenticityConfirmed')}
                    </div>
                    <div className="bg-slate-50 border border-slate-150 rounded p-2.5 text-[9.5px] text-slate-500 font-mono break-all leading-normal">
                      <div>File: {verifyFileName}</div>
                      <div className="mt-1">SHA-256: {computedHash}</div>
                      <div className="mt-1 text-emerald-700 font-bold uppercase">{language === 'en' ? "Ledger Registry Match Found: Block #104502" : "लेजर रजिस्ट्री मिलान पाया गया: ब्लॉक #104502"}</div>
                    </div>
                  </div>
                )}

                {verifyStatus === "fail" && (
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-rose-700 font-extrabold text-xs uppercase tracking-wide">
                      <AlertTriangle className="h-4.5 w-4.5 bg-rose-100 text-rose-600 rounded-full p-0.5" />
                      {t('verificationFailed')}
                    </div>
                    <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                      {t('verificationFailedSub')}
                    </p>
                    <div className="bg-slate-50 border border-slate-150 rounded p-2.5 text-[9.5px] text-slate-400 font-mono break-all">
                      SHA-256: {computedHash}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

        {/* Right Column - State Audit Ledger Explorer */}
        <div className="bg-white text-slate-700 rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col h-[650px]">
          <div className="border-b border-slate-200 pb-3 flex justify-between items-center bg-white">
            <h3 className="font-bold text-xs flex items-center gap-1.5 text-[#0f2b5c] uppercase tracking-wider font-serif">
              <Shield className="h-4.5 w-4.5" />
              {t('auditLedgerTitle')}
            </h3>
            <span className="text-[9px] bg-indigo-50 border border-indigo-150 text-[#0f2b5c] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
              {t('onChain')}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto mt-4 space-y-4 pr-1">
            {blockchainLog.map((log, index) => {
              const isPayout = log.action === "DISBURSE_COMPENSATION";
              return (
                <div key={index} className="border-b border-slate-150 pb-3.5 space-y-2 last:border-b-0">
                  <div className="flex justify-between items-start text-[9.5px]">
                    <span className="font-mono text-[#0f2b5c] font-bold">BLOCK #{log.block}</span>
                    <span className="text-slate-450 font-semibold">{log.timestamp}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="inline-block text-[8px] font-bold px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-700 uppercase tracking-wide">
                      {log.action}
                    </span>
                    {isPayout && (
                      <button 
                        onClick={() => openReceiptFromLog(log)}
                        className="text-[9px] text-[#0f2b5c] hover:underline flex items-center gap-0.5 font-bold cursor-pointer"
                      >
                        <Receipt className="h-3 w-3" /> {t('viewReceipt')}
                      </button>
                    )}
                  </div>
                  
                  <p className="text-xs text-slate-650 leading-relaxed font-semibold">
                    {language === 'en' ? log.details : log.details.replace('Disbursed', 'संवितरित').replace('to landowner accounts for', 'भू-स्वामियों के खाते में')}
                  </p>

                  <div className="flex justify-between items-center text-[9px] text-slate-400 font-mono pt-1">
                    <span>Signer: {log.signer}</span>
                    <span className="text-emerald-700 font-bold flex items-center gap-0.5 uppercase tracking-wide">
                      <Check className="h-3 w-3 bg-emerald-50 text-emerald-600 rounded-full p-0.5" />
                      {language === 'en' ? 'Verified' : 'सत्यापित'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-slate-200 pt-3 text-[10px] text-slate-400 flex justify-between items-center font-semibold">
            <span>{t('poweredBy')}</span>
            <ExternalLink className="h-3 w-3" />
          </div>
        </div>

      </div>

      {/* Direct Benefit Transfer (DBT) Payout Advice Receipt Modal */}
      {receiptOpen && receiptData && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[99] p-4 select-none animate-fadeIn font-sans">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-slate-350 flex flex-col">
            
            {/* Header */}
            <div className="px-5 py-3 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <span className="font-extrabold text-[#0f2b5c] text-xs uppercase tracking-wider font-serif">
                {t('treasuryReceipt')}
              </span>
              <button 
                onClick={() => setReceiptOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 hover:bg-slate-200 rounded-lg cursor-pointer"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Payout Advice Body */}
            <div className="p-6 bg-white border-b border-slate-150">
              <div className="border-2 border-slate-200 p-5 rounded-lg bg-[#FAF9F6] font-serif space-y-4 text-xs text-slate-800">
                {/* Ministry Label */}
                <div className="text-center border-b border-slate-300 pb-2">
                  <strong className="text-[10px] tracking-widest uppercase block">
                    {language === 'en' ? 'Government of India' : 'भारत सरकार'}
                  </strong>
                  <strong className="text-xs tracking-wider uppercase block mt-0.5">
                    {language === 'en' ? 'Ministry of Finance' : 'वित्त मंत्रालय'}
                  </strong>
                  <span className="text-[9px] uppercase font-sans font-bold block mt-1 text-slate-450">
                    {language === 'en' ? 'Direct Benefit Transfer (DBT) - Escrow Payout Advice' : 'प्रत्यक्ष लाभ हस्तांतरण (DBT) - एस्क्रो भुगतान सलाह'}
                  </span>
                </div>

                <div className="space-y-2 mt-4">
                  <div className="flex justify-between">
                    <span className="font-sans text-slate-500 font-bold uppercase text-[9px]">
                      {language === 'en' ? 'Receipt Date:' : 'रसीद की तिथि:'}
                    </span>
                    <span>{new Date().toLocaleDateString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-sans text-slate-500 font-bold uppercase text-[9px]">
                      {language === 'en' ? 'Payer (Escrow ID):' : 'भुगतानकर्ता (एस्क्रो आईडी):'}
                    </span>
                    <span className="font-mono">0xEscrowContract_{receiptData.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-sans text-slate-500 font-bold uppercase text-[9px]">
                      {language === 'en' ? 'Payee Address:' : 'प्राप्तकर्ता का पता:'}
                    </span>
                    <span className="font-mono">{receiptData.wallet.substring(0, 8)}...{receiptData.wallet.substring(32)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-sans text-slate-500 font-bold uppercase text-[9px]">
                      {language === 'en' ? 'Project Name:' : 'परियोजना का नाम:'}
                    </span>
                    <span className="font-sans font-semibold text-slate-700 max-w-[180px] text-right line-clamp-1">{receiptData.title}</span>
                  </div>
                  
                  <div className="border-t border-slate-300 my-3 pt-3 flex justify-between text-sm font-bold bg-indigo-50/50 p-2 rounded">
                    <span className="font-sans uppercase text-[10px] text-slate-500 mt-0.5">
                      {language === 'en' ? 'Amount Disbursed:' : 'संवितरित राशि:'}
                    </span>
                    <span className="text-[#16a34a]">₹{receiptData.amount.toFixed(2)} Cr INR</span>
                  </div>

                  <div className="flex justify-between text-[9px]">
                    <span className="font-sans text-slate-500 font-bold uppercase text-[8px]">
                      {language === 'en' ? 'Transaction Block:' : 'लेनदेन ब्लॉक:'}
                    </span>
                    <span className="font-mono">#{receiptData.block}</span>
                  </div>
                  <div className="flex flex-col text-[8.5px] font-mono break-all pt-1 text-slate-500">
                    <span>Tx Hash: {receiptData.txHash}</span>
                  </div>
                </div>

                <div className="border-t border-slate-300 pt-3 mt-4 flex items-center justify-between text-[8px] font-sans">
                  <div className="text-emerald-700 font-bold border border-emerald-350 px-2 py-1 bg-emerald-50 rounded uppercase">
                    {language === 'en' ? 'Status: Payout Settled' : 'स्थिति: भुगतान स्वीकृत'}
                  </div>
                  <div className="text-right">
                    {language === 'en' ? (
                      <>PFMS Handshake: Verified<br/>Digital Treasury Signature Locked</>
                    ) : (
                      <>PFMS हैंडशेक: सत्यापित<br/>डिजिटल कोषागार हस्ताक्षर लॉक</>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="px-5 py-3.5 bg-slate-50 rounded-b-xl flex justify-end gap-2.5">
              <button
                onClick={() => window.print()}
                className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-slate-100 cursor-pointer shadow-sm"
              >
                <Printer className="h-3.5 w-3.5" />
                {t('printReceipt')}
              </button>
              <button
                onClick={() => setReceiptOpen(false)}
                className="bg-[#0f2b5c] hover:bg-[#0c224a] text-white px-4 py-2 rounded-lg text-xs font-bold cursor-pointer shadow-sm"
              >
                {t('done')}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
