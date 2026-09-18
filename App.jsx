import React, { useState } from 'react';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Search,
  CheckCircle2,
  Lock,
  Wallet,
  Coins
} from 'lucide-react';

export default function KavachLandingPage() {
  // Functional language toggle: English or Hindi
  const [lang, setLang] = useState('en');

  // Interactive scanner state
  const [inputText, setInputText] = useState('');
  const [scanState, setScanState] = useState('idle'); // 'idle' | 'scanning' | 'danger' | 'safe'
  const [inputError, setInputError] = useState(false);

  // Exact target scam phrase required by specification
  const TARGET_SCAM = "Urgent: Claim your ₹4,999 refund here";

  const t = {
    en: {
      badge: "Built for India's Digital Generation",
      heroHeading: "Save. Spend. Stay safe.",
      heroSubheading: "A money copilot for India’s first digital-payment generation.",
      placeholder: "Paste or drop anything you were asked to pay",
      scanBtn: "Scan for Fraud",
      scanningHeading: "Analyzing payment request...",
      scanningSub: "Cross-checking VPA collect patterns, fake refund triggers & sender trust scores.",
      dangerTitle: "Fraud Alert: Payment Trap Detected",
      dangerBadge: "CRITICAL ALERT",
      dangerBody: "This is a collect request. Approving it takes money from you. Refunds are never collect requests.",
      dangerExplanation: "Someone sent an UPI collect request disguised as a cashback or refund link. If you enter your UPI PIN, ₹4,999 will leave your bank account immediately.",
      resetBtn: "Reset",
      demoPrompt: "Try a real-life scam test:",
      safeTitle: "Looks safe for now",
      safeBody: "No recognized malicious collect request pattern found. Always verify the recipient's name on your bank screen before entering your UPI PIN.",
      pillarsBadge: "Three Pillars of Protection",
      pillarsHeading: "Smart banking habits, without the banking jargon.",
      shieldTitle: "SHIELD",
      shieldDesc: "Pre-transaction scam checks in under 3 seconds.",
      shieldExample: "e.g. OLX fake buyers sending QR codes to 'receive' money.",
      spendTitle: "SPEND",
      spendDesc: "Tracks your irregular income and stipends, not just standard 30-day salaries.",
      spendExample: "e.g. College internship stipends, freelance payouts & gigs.",
      saveTitle: "SAVE",
      saveDesc: "Finds forgotten ₹99 AutoPay mandates and turns them into savings goals.",
      saveExample: "e.g. That subscription you forgot after the 7-day free trial.",
      footerStatText: "₹805 crore was lost to UPI fraud up to November of FY26. Kavach stops the tap before the money leaves.",
      footerGuarantee: "Zero UPI PIN access • 100% On-device privacy • NPCI UPI ecosystem aware"
    },
    hi: {
      badge: "भारत के युवाओं के लिए समर्पित",
      heroHeading: "बचत। खर्च। पूर्ण सुरक्षा।",
      heroSubheading: "भारत की पहली डिजिटल-पेमेंट पीढ़ी का भरोसेमंद मनी को-पायलट।",
      placeholder: "भुगतान का कोई भी संदेश या लिंक यहाँ पेस्ट करें",
      scanBtn: "फ्रॉड स्कैन करें",
      scanningHeading: "भुगतान संदेश की जांच हो रही है...",
      scanningSub: "VPA कलेक्ट पैटर्न और फर्जी रिफंड ट्रिगर्स की त्वरित पहचान की जा रही है।",
      dangerTitle: "सावधान: वित्तीय धोखाधड़ी का प्रयास",
      dangerBadge: "गंभीर चेतावनी",
      dangerBody: "यह एक कलेक्ट रिक्वेस्ट है। इसे मंज़ूर करने पर आपके खाते से पैसे कटेंगे। रिफंड कभी भी कलेक्ट रिक्वेस्ट नहीं होते।",
      dangerExplanation: "यह संदेश रिफंड के नाम पर आपके पैसे काटने की कोशिश कर रहा है। यदि आप UPI पिन डालेंगे तो ₹4,999 आपके खाते से कट जाएंगे।",
      resetBtn: "रीसेट करें",
      demoPrompt: "डेमो फ्रॉड संदेश आज़माएं:",
      safeTitle: "संदेश सुरक्षित प्रतीत होता है",
      safeBody: "कोई संदिग्ध कलेक्ट रिक्वेस्ट नहीं मिली। फिर भी UPI पिन दर्ज करने से पहले प्राप्तकर्ता का नाम अवश्य जांचें।",
      pillarsBadge: "सुरक्षा के तीन आधार",
      pillarsHeading: "बिना किसी बैंक की जटिलता के सरल और सुरक्षित अनुभव।",
      shieldTitle: "शील्ड (SHIELD)",
      shieldDesc: "3 सेकंड के भीतर प्री-ट्रांजैक्शन स्कैम डिटेक्शन और सुरक्षा अलर्ट।",
      shieldExample: "उदा. OLX या सोशल मीडिया पर पैसे भेजने के नाम पर भेजे गए फर्जी QR कोड।",
      spendTitle: "स्पेंड (SPEND)",
      spendDesc: "केवल मासिक वेतन ही नहीं, आपकी अनियमित आय और इंटर्नशिप स्टाइपेंड का भी सटीक हिसाब।",
      spendExample: "उदा. इंटर्नशिप स्टाइपेंड, फ्रीलांस कमाई और कॉलेज प्रोजेक्ट्स।",
      saveTitle: "सेव (SAVE)",
      saveDesc: "भूले हुए ₹99 ऑटो-पे मैन्डेट्स को खोजकर उन्हें आपके बचत लक्ष्यों में बदलता है।",
      saveExample: "उदा. अनचाहे ₹99 वाले OTT या ऐप सब्सक्रिप्शन जो आप भूल चुके हैं।",
      footerStatText: "₹805 crore was lost to UPI fraud up to November of FY26. Kavach stops the tap before the money leaves.",
      footerGuarantee: "कोई UPI पिन स्टोर नहीं • 100% सुरक्षित और व्यक्तिगत"
    }
  };

  const text = t[lang];

  const handleScan = (e) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) {
      setInputError(true);
      return;
    }
    setInputError(false);
    setScanState('scanning');

    // 2-second loading animation
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

  return (
    <div className="min-h-screen bg-[#fbfbf9] text-stone-900 flex flex-col justify-between selection:bg-amber-200 font-sans">
      
      {/* Warm ambient background lights */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[42rem] h-[22rem] bg-gradient-to-b from-amber-100/60 via-orange-50/40 to-transparent blur-3xl rounded-full" />
        <div className="absolute top-72 -left-20 w-80 h-80 bg-emerald-100/30 blur-3xl rounded-full" />
        <div className="absolute top-96 -right-20 w-80 h-80 bg-blue-100/30 blur-3xl rounded-full" />
      </div>

      {/* 1. GLOBAL HEADER */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[#fbfbf9]/90 border-b border-stone-200/80 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-stone-900 text-amber-400 flex items-center justify-center shadow-md shadow-stone-900/10">
              <Shield className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-stone-900 flex items-center gap-1.5">
                Kavach
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
              </span>
              <span className="text-xs font-semibold text-stone-700 tracking-wide -mt-1 hidden sm:inline-block">
                Your UPI Copilot
              </span>
            </div>
          </div>

          {/* Functional English / Hindi Toggle Switch */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-stone-100 p-1 rounded-full border border-stone-300 shadow-inner">
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`min-h-[48px] min-w-[76px] px-4 text-sm font-semibold rounded-full transition-all duration-200 flex items-center justify-center cursor-pointer ${
                  lang === 'en'
                    ? 'bg-stone-900 text-white shadow-sm'
                    : 'text-stone-700 hover:text-stone-900'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLang('hi')}
                className={`min-h-[48px] min-w-[76px] px-4 text-sm font-semibold rounded-full transition-all duration-200 flex items-center justify-center cursor-pointer ${
                  lang === 'hi'
                    ? 'bg-stone-900 text-white shadow-sm'
                    : 'text-stone-700 hover:text-stone-900'
                }`}
              >
                हिन्दी
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN HERO & CONTENT */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-20">
        
        {/* 2. THE HERO SECTION */}
        <section className="text-center flex flex-col items-center max-w-3xl mx-auto mb-20 sm:mb-28">
          
          {/* Human badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-stone-800 text-sm font-semibold mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            <span>{text.badge}</span>
            <span className="text-stone-600 hidden sm:inline">•</span>
            <span className="text-stone-700 font-normal hidden sm:inline">Crafted for everyday UPI life</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold text-stone-900 tracking-tight leading-[1.1] mb-5">
            {text.heroHeading}
          </h1>

          <p className="text-lg sm:text-xl text-stone-700 font-medium max-w-2xl mx-auto leading-relaxed mb-8">
            {text.heroSubheading}
          </p>

          {/* Conversational prompt */}
          <p className="text-stone-600 text-sm sm:text-base font-medium mb-8">
            Got a weird WhatsApp refund link or suspicious QR? Check it before you approve 👇
          </p>

          {/* Interactive Core Scanner */}
          <div className="w-full max-w-2xl">
            
            {scanState === 'idle' && (
              <div className="space-y-4">
                <form
                  onSubmit={handleScan}
                  className="bg-white p-2.5 sm:p-3 rounded-2xl border-2 border-stone-300 shadow-xl shadow-stone-200/60 focus-within:border-stone-900 focus-within:ring-4 focus-within:ring-stone-200 transition-all flex flex-col sm:flex-row items-stretch gap-2.5"
                >
                  <div className="relative flex-1 flex items-center">
                    <div className="absolute left-4 text-stone-400 pointer-events-none hidden sm:block">
                      <Search className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => {
                        setInputText(e.target.value);
                        if (inputError) setInputError(false);
                      }}
                      placeholder={text.placeholder}
                      className="w-full min-h-[56px] text-base sm:text-lg bg-stone-50 text-stone-900 placeholder-stone-400 rounded-xl px-4 sm:pl-12 sm:pr-4 py-3 outline-none border border-stone-200 focus:bg-white focus:border-stone-400 transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    className="min-h-[56px] px-6 sm:px-7 py-3 rounded-xl font-bold text-base sm:text-lg text-white bg-stone-900 hover:bg-stone-800 active:scale-[0.98] transition-all duration-150 shadow-md flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                  >
                    <ShieldAlert className="w-5 h-5 text-amber-400" />
                    <span>{text.scanBtn}</span>
                  </button>
                </form>

                {inputError && (
                  <p className="text-rose-600 text-sm font-semibold text-left px-2">
                    Please paste or type the message to scan.
                  </p>
                )}

                {/* Convenient 1-click test button */}
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-sm text-stone-600">
                  <span className="text-stone-700 font-medium">{text.demoPrompt}</span>
                  <button
                    type="button"
                    onClick={handleApplyDemoSample}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-900 font-mono text-xs sm:text-sm transition-colors cursor-pointer text-left font-semibold"
                    title="Click to paste exact test case"
                  >
                    <span>&quot;{TARGET_SCAM}&quot;</span>
                    <span className="text-emerald-700 font-bold font-sans">↵ Paste</span>
                  </button>
                </div>
              </div>
            )}

            {/* SCANNING STATE: Sleek 2-second loading spinner */}
            {scanState === 'scanning' && (
              <div className="w-full bg-white border-2 border-stone-300 rounded-2xl p-8 sm:p-11 flex flex-col items-center justify-center text-center shadow-lg">
                <div className="relative mb-5">
                  <div className="w-16 h-16 rounded-full border-4 border-stone-200 border-t-stone-900 animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center text-stone-900">
                    <Shield className="w-6 h-6" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-stone-900 mb-1.5">
                  {text.scanningHeading}
                </h3>
                <p className="text-stone-500 text-sm max-w-md">
                  {text.scanningSub}
                </p>

                <div className="w-44 h-1.5 bg-stone-100 rounded-full mt-6 overflow-hidden">
                  <div className="h-full bg-stone-900 animate-pulse" />
                </div>
              </div>
            )}

            {/* DANGER STATE: High-contrast RED Danger Card */}
            {scanState === 'danger' && (
              <div className="w-full bg-[#b91c1c] text-white border-2 border-red-700 rounded-2xl p-6 sm:p-8 text-left shadow-2xl shadow-red-900/30">
                
                {/* Top Alert Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-red-500/50">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-white text-red-700 flex items-center justify-center shrink-0 shadow-md">
                      <AlertTriangle className="w-6 h-6 stroke-[2.4]" />
                    </div>
                    <div>
                      <span className="inline-block px-2.5 py-0.5 rounded bg-black/30 text-white text-xs font-black tracking-wider uppercase mb-0.5">
                        {text.dangerBadge}
                      </span>
                      <h2 className="text-2xl font-black tracking-tight text-white">
                        {text.dangerTitle}
                      </h2>
                    </div>
                  </div>

                  <span className="self-start sm:self-center px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider">
                    Phishing Pattern Matched
                  </span>
                </div>

                {/* Exact Danger Body Requirement */}
                <div className="my-5 bg-black/25 rounded-xl p-5 border border-red-400/40">
                  <p className="text-lg sm:text-xl font-bold leading-snug text-white">
                    &ldquo;{text.dangerBody}&rdquo;
                  </p>
                  <p className="text-sm text-red-100 mt-2 font-medium">
                    {text.dangerExplanation}
                  </p>
                </div>

                <div className="mb-6 px-3.5 py-2 rounded-lg bg-black/20 text-xs font-mono text-red-100 truncate">
                  Scanned input: &quot;{inputText}&quot;
                </div>

                {/* Actions & Reset */}
                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between pt-2">
                  <div className="text-xs text-red-100 flex items-center gap-1.5 font-medium">
                    <Lock className="w-4 h-4" />
                    <span>Kavach keeps your money safe before you click</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="min-h-[48px] px-6 py-2.5 rounded-xl font-bold text-base bg-white text-red-700 hover:bg-stone-100 active:scale-[0.98] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4 stroke-[2.2]" />
                    <span>{text.resetBtn}</span>
                  </button>
                </div>
              </div>
            )}

            {/* SAFE / NEUTRAL STATE */}
            {scanState === 'safe' && (
              <div className="w-full bg-white border-2 border-emerald-300 rounded-2xl p-6 sm:p-8 text-stone-900 text-left shadow-lg">
                <div className="flex items-start gap-3.5 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6 stroke-[2.2]" />
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
                    className="min-h-[48px] px-5 py-2 rounded-xl font-semibold text-sm bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
                  >
                    <RotateCcw className="w-4 h-4 stroke-[2.2]" />
                    <span>{text.resetBtn}</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        </section>

        {/* 3. THE THREE PILLARS (FEATURES SECTION) */}
        <section className="mb-24">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full mb-2.5 inline-block">
              {text.pillarsBadge}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
              {text.pillarsHeading}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* PILLAR 1: SHIELD */}
            <div className="bg-white rounded-2xl p-7 border-2 border-stone-200 shadow-sm hover:shadow-md hover:border-stone-300 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-5">
                  <ShieldCheck className="w-7 h-7 stroke-[2.2]" />
                </div>
                <div className="inline-block px-2.5 py-0.5 rounded bg-stone-100 text-stone-800 font-mono text-xs font-bold tracking-wider mb-2">
                  {text.shieldTitle}
                </div>
                <h3 className="text-lg font-bold text-stone-900 mb-2">Instant Threat Block</h3>
                <p className="text-base text-stone-700 leading-relaxed font-medium">
                  &ldquo;{text.shieldDesc}&rdquo;
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-stone-100 text-xs text-stone-700 font-medium">
                {text.shieldExample}
              </div>
            </div>

            {/* PILLAR 2: SPEND */}
            <div className="bg-white rounded-2xl p-7 border-2 border-stone-200 shadow-sm hover:shadow-md hover:border-stone-300 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center mb-5">
                  <Wallet className="w-7 h-7 stroke-[2.2]" />
                </div>
                <div className="inline-block px-2.5 py-0.5 rounded bg-stone-100 text-stone-800 font-mono text-xs font-bold tracking-wider mb-2">
                  {text.spendTitle}
                </div>
                <h3 className="text-lg font-bold text-stone-900 mb-2">Real-World Incomes</h3>
                <p className="text-base text-stone-700 leading-relaxed font-medium">
                  &ldquo;{text.spendDesc}&rdquo;
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-stone-100 text-xs text-stone-700 font-medium">
                {text.spendExample}
              </div>
            </div>

            {/* PILLAR 3: SAVE */}
            <div className="bg-white rounded-2xl p-7 border-2 border-stone-200 shadow-sm hover:shadow-md hover:border-stone-300 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-5">
                  <Coins className="w-7 h-7 stroke-[2.2]" />
                </div>
                <div className="inline-block px-2.5 py-0.5 rounded bg-stone-100 text-stone-800 font-mono text-xs font-bold tracking-wider mb-2">
                  {text.saveTitle}
                </div>
                <h3 className="text-lg font-bold text-stone-900 mb-2">Passive Money Leaks</h3>
                <p className="text-base text-stone-700 leading-relaxed font-medium">
                  &ldquo;{text.saveDesc}&rdquo;
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-stone-100 text-xs text-stone-700 font-medium">
                {text.saveExample}
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* 4. IMPACT FOOTER (Dark, serious background as strictly specified) */}
      <footer className="w-full bg-[#121214] text-stone-100 pt-16 pb-12 mt-auto border-t border-stone-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          
          {/* Stat text */}
          <div className="max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-800 text-red-300 text-xs font-bold uppercase tracking-wider mb-4">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              Official UPI Security Notice
            </div>
            
            <p className="text-2xl sm:text-3xl font-black text-white leading-snug tracking-tight">
              &ldquo;{text.footerStatText}&rdquo;
            </p>
          </div>

          {/* Security & trust notes */}
          <div className="pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-stone-400">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-stone-800 text-amber-400 flex items-center justify-center text-xs">
                <Shield className="w-4 h-4" />
              </span>
              <span className="font-bold text-stone-200">Kavach</span>
              <span>— India’s UPI Copilot</span>
            </div>

            <div className="text-xs text-stone-400 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>{text.footerGuarantee}</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
