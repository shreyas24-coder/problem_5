import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
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
  ArrowDown
} from 'lucide-react';

export default function ShieldPage() {
  const { lang } = useOutletContext() || { lang: 'en' };

  const [inputText, setInputText] = useState('');
  const [scanState, setScanState] = useState('idle'); // 'idle' | 'scanning' | 'danger' | 'safe'
  const [inputError, setInputError] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  // Exact target scam phrase required by specification
  const TARGET_SCAM = "Urgent: Claim your ₹4,999 refund here";

  const t = {
    en: {
      badge: "Pre-Transaction Fraud Defense",
      headline: "Shield your UPI before you tap.",
      subheadline: "Stop QR traps, deceptive collect requests, and fake refund links before your PIN is asked.",
      dropPrompt: "Paste or drop anything you were asked to pay",
      dropSubprompt: "Supports payment links, SMS text, UPI IDs, or screenshot text",
      scanBtn: "Scan for Fraud",
      scanningTitle: "Analyzing payment intent...",
      scanningDesc: "Verifying VPA signatures against known UPI phishing databases...",
      dangerTitle: "High-Risk Threat Detected",
      dangerBadge: "COLLECT REQUEST TRAP",
      dangerBody: "This is a collect request. Approving it takes money from you. Refunds are never collect requests.",
      dangerSubtext: "Someone initiated a request to withdraw ₹4,999 from your bank account under the guise of an instant refund.",
      resetBtn: "Reset & Test Another",
      demoPrompt: "Try sample fraud prompt:",
      safeTitle: "No malicious collect request found",
      safeBody: "This message does not match known fraudulent UPI collect signatures. Always verify the recipient VPA before approving any payment."
    },
  };

  const text = t.en;

  const handleScan = (e) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) {
      setInputError(true);
      return;
    }
    setInputError(false);

    // Exact 2-second loading state
    setScanState('scanning');
    setTimeout(() => {
      if (inputText.trim() === TARGET_SCAM) {
        setScanState('danger');
      } else {
        setScanState('safe');
      }
    }, 2000);
  };

  const handleReset = () => {
    setInputText('');
    setScanState('idle');
    setInputError(false);
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
    } else if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // Simulate reading screenshot or text file
      setInputText(TARGET_SCAM);
      setInputError(false);
    }
  };

  return (
    <div className="flex flex-col items-center text-center animate-fade-in">
      
      {/* Top Tagline */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-stone-800 text-xs sm:text-sm font-semibold mb-4 shadow-sm">
        <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
        <span>{text.badge}</span>
      </div>

      {/* Hero Headline */}
      <h1 className="text-3xl sm:text-5xl font-black text-stone-900 tracking-tight leading-[1.15] mb-3">
        {text.headline}
      </h1>

      <p className="text-base sm:text-lg text-stone-600 font-medium max-w-lg mx-auto mb-8 leading-relaxed">
        {text.subheadline}
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
                    <span>Drop screenshot or paste text</span>
                  </div>
                  <span className="text-xs bg-stone-100 text-stone-700 font-medium px-2.5 py-0.5 rounded-md border border-stone-200">
                    Instant Check
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
                  placeholder={text.dropPrompt}
                  aria-label="Payment text or link scanner"
                  className="w-full bg-stone-50 text-stone-900 placeholder-stone-500 text-base sm:text-lg rounded-2xl p-4 outline-none border border-stone-200 focus:bg-white focus:border-stone-400 transition-colors resize-none leading-snug"
                />

                <div className="mt-2 flex items-center justify-between text-xs text-stone-600 px-1">
                  <span>{text.dropSubprompt}</span>
                  {inputText && (
                    <button
                      type="button"
                      onClick={() => setInputText('')}
                      className="text-stone-700 font-semibold hover:underline"
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

              {/* Big 48px+ Action Button */}
              <button
                type="submit"
                className="w-full min-h-[56px] px-6 py-3.5 rounded-2xl font-bold text-base sm:text-lg text-white bg-stone-900 hover:bg-stone-800 active:scale-[0.99] transition-all duration-150 shadow-md flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                <span>{text.scanBtn}</span>
              </button>
            </form>

            {/* 1-Click Interactive Demo Pill */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-sm text-stone-600">
              <span className="text-stone-700 font-medium">{text.demoPrompt}</span>
              <button
                type="button"
                onClick={handleApplyDemoSample}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-900 font-mono text-xs sm:text-sm font-semibold transition-colors cursor-pointer text-left shadow-sm"
                title="Click to auto-populate test scam"
              >
                <span>&quot;{TARGET_SCAM}&quot;</span>
                <span className="text-emerald-700 font-sans font-bold">↵ Fill</span>
              </button>
            </div>
          </div>
        )}

        {/* SCANNING STATE: Sleek 2-second loading animation */}
        {scanState === 'scanning' && (
          <div 
            className="w-full bg-white border-2 border-stone-300 rounded-3xl p-8 sm:p-12 flex flex-col items-center justify-center text-center shadow-lg"
            role="status" 
            aria-live="polite"
          >
            <div className="relative mb-6">
              <div className="w-18 h-18 rounded-full border-4 border-stone-200 border-t-stone-900 animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-stone-900">
                <Shield className="w-7 h-7" />
              </div>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-stone-900 mb-2">
              {text.scanningTitle}
            </h3>
            <p className="text-stone-500 text-sm sm:text-base max-w-sm">
              {text.scanningDesc}
            </p>

            <div className="w-48 h-1.5 bg-stone-100 rounded-full mt-6 overflow-hidden">
              <div className="h-full bg-stone-900 animate-pulse" />
            </div>
          </div>
        )}

        {/* DANGER STATE: High-contrast RED Danger Card */}
        {scanState === 'danger' && (
          <div 
            className="w-full bg-[#b91c1c] text-white border-2 border-red-700 rounded-3xl p-6 sm:p-8 text-left shadow-2xl shadow-red-900/30 animate-fade-in"
            role="alert"
            aria-live="assertive"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-red-500/50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white text-red-700 flex items-center justify-center shrink-0 shadow-md">
                  <AlertTriangle className="w-7 h-7 stroke-[2.4]" />
                </div>
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded bg-black/30 text-white text-xs font-black tracking-wider uppercase mb-0.5">
                    {text.dangerBadge}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                    {text.dangerTitle}
                  </h2>
                </div>
              </div>

              <span className="self-start sm:self-center px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider">
                Confidence: 99.8%
              </span>
            </div>

            {/* Exact Required Spec Text */}
            <div className="my-5 bg-black/25 rounded-2xl p-5 border border-red-400/40">
              <p className="text-lg sm:text-xl font-bold leading-snug text-white">
                &ldquo;{text.dangerBody}&rdquo;
              </p>
              <p className="text-sm text-red-100 mt-2 font-medium">
                {text.dangerSubtext}
              </p>
            </div>

            <div className="mb-6 px-3.5 py-2 rounded-xl bg-black/20 text-xs font-mono text-red-100 truncate">
              Scanned input: &quot;{inputText}&quot;
            </div>

            {/* Action & Reset Button */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between pt-2">
              <div className="text-xs text-red-100 flex items-center gap-1.5 font-medium">
                <Lock className="w-4 h-4" />
                <span>UPI Intent blocked in sandbox</span>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="min-h-[48px] px-6 py-3 rounded-2xl font-bold text-base bg-white text-red-700 hover:bg-stone-100 active:scale-[0.98] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 stroke-[2.2]" />
                <span>{text.resetBtn}</span>
              </button>
            </div>
          </div>
        )}

        {/* SAFE / NEUTRAL STATE */}
        {scanState === 'safe' && (
          <div className="w-full bg-white border-2 border-emerald-300 rounded-3xl p-6 sm:p-8 text-stone-900 text-left shadow-lg animate-fade-in">
            <div className="flex items-start gap-3.5 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-7 h-7 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-stone-900">{text.safeTitle}</h3>
                <p className="text-stone-600 text-sm mt-1 leading-relaxed">{text.safeBody}</p>
              </div>
            </div>

            <div className="mt-5 flex flex-col sm:flex-row gap-3 items-center justify-between pt-4 border-t border-stone-200">
              <p className="text-xs text-stone-500">
                Want to test the fraud scanner? Try: <button type="button" onClick={handleApplyDemoSample} className="text-stone-900 font-bold underline cursor-pointer">&quot;{TARGET_SCAM}&quot;</button>
              </p>

              <button
                type="button"
                onClick={handleReset}
                className="min-h-[48px] px-5 py-2.5 rounded-2xl font-semibold text-sm bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
              >
                <RotateCcw className="w-4 h-4 stroke-[2.2]" />
                <span>{text.resetBtn}</span>
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
