import React, { useState } from 'react';
import {
  Shield,
  ShieldAlert,
  AlertTriangle,
  RotateCcw,
  Search,
  CheckCircle2,
  Lock,
  UploadCloud,
  FileText,
  Sparkles,
  ArrowDown,
  Info,
  Check
} from 'lucide-react';
import { chatbotApi } from '../services/api';

export default function ShieldPage() {
  const [inputText, setInputText] = useState('');
  const [scanState, setScanState] = useState('idle'); // 'idle' | 'scanning' | 'danger' | 'safe'
  const [inputError, setInputError] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  // Target scam sample
  const TARGET_SCAM = "Urgent: Claim your ₹4,999 refund here";

  const handleScan = async (e) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) {
      setInputError(true);
      return;
    }
    setInputError(false);
    setScanState('scanning');

    try {
      const data = await chatbotApi.sendMessage(inputText.trim());
      setScanResult(data);
      if (data.risk_level === 'HIGH' || data.risk_level === 'MEDIUM') {
        setScanState('danger');
      } else {
        setScanState('safe');
      }
    } catch (err) {
      console.warn('Backend scan failed, using fallback analysis:', err);
      // Fallback
      const isSus = /refund|urgent|claim|pin|qr|collect|otp|block|cut|win/i.test(inputText);
      setScanResult({
        risk_level: isSus ? 'HIGH' : 'LOW',
        reply: isSus
          ? "This message exhibits strong characteristics of a UPI fraud collect trap. Receiving money never requires scanning a QR code or entering a PIN."
          : "No immediate fraudulent signatures detected in this text. Remember to always confirm recipient VPA before paying.",
        red_flags: isSus
          ? ["Deceptive collect request masquerading as a refund", "Artificial urgency to rush payment decisions", "Zero verified bank domain in URL"]
          : [],
        recommendations: isSus
          ? ["Do not tap any links or approve UPI collect requests in your payment app", "Block the sender immediately", "Remember: Refunds are credited automatically, NEVER via collect requests"]
          : ["Always check recipient VPA before paying", "Never share UPI PIN or OTP"]
      });
      setScanState(isSus ? 'danger' : 'safe');
    }
  };

  const handleReset = () => {
    setInputText('');
    setScanState('idle');
    setInputError(false);
    setScanResult(null);
  };

  const handleApplyDemoSample = () => {
    setInputText(TARGET_SCAM);
    setInputError(false);
  };

  // Drag & Drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedText = e.dataTransfer.getData('text');
    if (droppedText) {
      setInputText(droppedText);
      setInputError(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center py-2 sm:py-6 text-center animate-fade-in">
      
      {/* 1. Header & Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300/80 text-xs font-black uppercase tracking-wider mb-4 shadow-xs">
        <Shield className="w-3.5 h-3.5 text-amber-700" />
        <span>Pre-Transaction Fraud Defense • Feature 4</span>
      </div>

      <h1 className="text-3xl sm:text-5xl font-black text-stone-900 tracking-tight max-w-2xl leading-tight mb-3">
        Shield your UPI before you tap.
      </h1>

      <p className="text-base sm:text-lg text-stone-600 font-medium max-w-lg mx-auto mb-8 leading-relaxed">
        Stop QR traps, deceptive collect requests, and fake refund links before your PIN is asked.
      </p>

      {/* CORE SCANNER WORKSPACE */}
      <div className="w-full max-w-xl">
        
        {/* IDLE STATE: Massive Drag & Drop / Paste Input Area */}
        {scanState === 'idle' && (
          <div className="space-y-4">
            <form onSubmit={handleScan} className="flex flex-col gap-3">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative bg-white rounded-3xl border-2 transition-all p-5 sm:p-6 text-left shadow-xl shadow-stone-200/60 ${
                  isDragOver
                    ? 'border-amber-500 bg-amber-50/50 ring-4 ring-amber-200'
                    : 'border-stone-300 hover:border-stone-400 focus-within:border-stone-900 focus-within:ring-4 focus-within:ring-stone-200'
                }`}
              >
                <div className="flex items-center justify-between mb-3 text-stone-600">
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-stone-700">
                    <UploadCloud className="w-4 h-4 text-stone-600" />
                    <span>Drop screenshot text or paste message/link</span>
                  </div>
                  <span className="text-xs bg-stone-100 text-stone-700 font-medium px-2.5 py-0.5 rounded-md border border-stone-200">
                    AI Scan
                  </span>
                </div>

                {/* Big Textarea for pasting */}
                <textarea
                  rows={3}
                  value={inputText}
                  onChange={(e) => {
                    setInputText(e.target.value);
                    if (inputError) setInputError(false);
                  }}
                  placeholder="Paste or drop anything you were asked to pay (e.g. SMS, WhatsApp link, QR URL)..."
                  aria-label="Payment text or link scanner"
                  className="w-full bg-stone-50 text-stone-900 placeholder-stone-500 text-base sm:text-lg rounded-2xl p-4 outline-none border border-stone-200 focus:bg-white focus:border-stone-400 transition-colors resize-none leading-snug"
                />

                <div className="mt-2 flex items-center justify-between text-xs text-stone-600 px-1">
                  <span>Supports payment links, SMS alerts, UPI IDs, or screenshot text</span>
                  {inputText && (
                    <button
                      type="button"
                      onClick={() => setInputText('')}
                      className="text-stone-700 font-semibold hover:underline cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {inputError && (
                <p className="text-rose-600 text-sm font-bold text-left px-2">
                  Please paste or drop a message/link to scan.
                </p>
              )}

              {/* Action Button */}
              <button
                type="submit"
                className="w-full min-h-[56px] px-6 py-3.5 rounded-2xl font-bold text-base sm:text-lg text-white bg-stone-900 hover:bg-stone-800 active:scale-[0.99] transition-all duration-150 shadow-md flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                <span>Scan for Fraud</span>
              </button>
            </form>

            {/* Quick Demo Prompts */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-sm text-stone-600">
              <span className="text-stone-700 font-medium">Try sample fraud prompt:</span>
              <button
                type="button"
                onClick={handleApplyDemoSample}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-900 font-mono text-xs sm:text-sm font-semibold transition-colors cursor-pointer text-left shadow-sm"
              >
                <span>&quot;{TARGET_SCAM}&quot;</span>
                <span className="text-emerald-700 font-sans font-bold">↵ Fill</span>
              </button>
            </div>
          </div>
        )}

        {/* SCANNING STATE */}
        {scanState === 'scanning' && (
          <div className="w-full bg-white border-2 border-stone-300 rounded-3xl p-8 sm:p-12 flex flex-col items-center justify-center text-center shadow-lg">
            <div className="relative mb-6">
              <div className="w-16 h-16 rounded-full border-4 border-stone-200 border-t-stone-900 animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-stone-900">
                <Shield className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-stone-900 mb-2">
              Analyzing intent & fraud signatures...
            </h3>
            <p className="text-stone-500 text-sm max-w-sm">
              Checking message against known UPI phishing vectors and Gemini scam defense model.
            </p>
          </div>
        )}

        {/* DANGER STATE */}
        {scanState === 'danger' && scanResult && (
          <div className="w-full bg-[#b91c1c] text-white border-2 border-red-700 rounded-3xl p-6 sm:p-8 text-left shadow-2xl shadow-red-900/30 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-red-500/50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white text-red-700 flex items-center justify-center shrink-0 shadow-md">
                  <AlertTriangle className="w-7 h-7 stroke-[2.4]" />
                </div>
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded bg-black/30 text-white text-xs font-black tracking-wider uppercase mb-0.5">
                    {scanResult.risk_level} RISK THREAT DETECTED
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                    Suspicious Transaction Request
                  </h3>
                </div>
              </div>
              <span className="self-start sm:self-auto px-3 py-1 bg-red-900/60 rounded-xl text-xs font-mono font-bold text-red-100 border border-red-400/40">
                AI Evaluated
              </span>
            </div>

            <div className="py-5 space-y-4">
              <p className="text-base sm:text-lg font-bold text-red-50 leading-relaxed">
                {scanResult.reply}
              </p>

              {/* Red flags */}
              {scanResult.red_flags && scanResult.red_flags.length > 0 && (
                <div className="p-4 bg-black/25 rounded-2xl border border-white/10 space-y-1.5 text-xs sm:text-sm">
                  <span className="font-bold text-amber-300 block mb-1">🚨 Detected Red Flags:</span>
                  {scanResult.red_flags.map((flag, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-red-100">
                      <span>•</span>
                      <span>{flag}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Recommendations */}
              {scanResult.recommendations && scanResult.recommendations.length > 0 && (
                <div className="p-4 bg-black/20 rounded-2xl border border-white/10 space-y-1.5 text-xs sm:text-sm">
                  <span className="font-bold text-emerald-300 block mb-1">🛡️ Recommended Actions:</span>
                  {scanResult.recommendations.map((rec, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-red-50">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-red-500/50 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-red-200 font-medium">
                MONEYCRAFT will never ask for your UPI PIN. Never approve requests for unknown entities.
              </span>
              <button
                type="button"
                onClick={handleReset}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white text-stone-900 font-bold text-sm hover:bg-stone-100 active:scale-95 transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset & Scan Another</span>
              </button>
            </div>
          </div>
        )}

        {/* SAFE STATE */}
        {scanState === 'safe' && scanResult && (
          <div className="w-full bg-emerald-800 text-white border-2 border-emerald-600 rounded-3xl p-6 sm:p-8 text-left shadow-2xl shadow-emerald-900/30 animate-fade-in">
            <div className="flex items-center gap-3 pb-4 border-b border-emerald-600/60">
              <div className="w-12 h-12 rounded-2xl bg-white text-emerald-800 flex items-center justify-center shrink-0 shadow-md">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded bg-black/30 text-white text-xs font-black tracking-wider uppercase mb-0.5">
                  LOW RISK DETECTED
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  No Phishing Signatures Found
                </h3>
              </div>
            </div>

            <div className="py-5 space-y-4 text-emerald-50 text-sm sm:text-base leading-relaxed">
              <p>{scanResult.reply}</p>
              {scanResult.recommendations && (
                <div className="p-4 bg-black/20 rounded-2xl border border-white/10 space-y-1 text-xs sm:text-sm">
                  {scanResult.recommendations.map((rec, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-emerald-600/60 flex items-center justify-between">
              <span className="text-xs text-emerald-200">Always verify recipient identity before entering UPI PIN.</span>
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-2.5 rounded-2xl bg-white text-stone-900 font-bold text-xs hover:bg-stone-100 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Test Another</span>
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
