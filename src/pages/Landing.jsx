import React from 'react';
import { NavLink, useOutletContext } from 'react-router-dom';
import {
  Shield,
  Wallet,
  Coins,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Sparkles,
  Smartphone,
  ChevronRight,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

export default function LandingPage({ onOpenSignUp }) {
  const { lang } = useOutletContext() || { lang: 'en' };

  const t = {
    en: {
      badge: "India's #1 Digital Money Copilot",
      heroHeading: "Save. Spend. Stay safe.",
      heroSubheading: "A money copilot built for India’s first digital-payment generation. Pre-transaction fraud checks, irregular stipend budgeting, and ₹99 leak detection.",
      ctaPrimary: "Sign Up for Free",
      ctaSecondary: "Try Scam Shield Live",
      statUsers: "48,000+",
      statUsersLabel: "Digital Indians Protected",
      statChecked: "₹18.4 Cr",
      statCheckedLabel: "Transactions Scanned",
      statLeaks: "3.2x",
      statLeaksLabel: "Faster Savings Goals",
      pillarsHeading: "Everything you need to master your digital money",
      shieldTitle: "SHIELD",
      shieldSubtitle: "Pre-transaction scam checks in under 3 seconds",
      shieldDesc: "Heuristic engine catches deceptive UPI collect requests, fake cashback QR codes, and phishing links before PIN entry.",
      spendTitle: "SPEND",
      spendSubtitle: "Tracks your irregular income and stipends",
      spendDesc: "Forget standard 30-day calendar salaries. Budget your money from the exact day your stipend or freelance gig lands.",
      saveTitle: "SAVE",
      saveSubtitle: "Finds forgotten ₹99 AutoPay mandates",
      saveDesc: "Audit passive subscription leaks from expired trials and turn them into goals like your next laptop.",
      footerStatText: "₹805 crore was lost to UPI fraud up to November of FY26. Kavach stops the tap before the money leaves.",
      readyHeading: "Ready to take control of your digital money?",
      readySub: "Join thousands of students and young professionals who never worry before tapping UPI."
    },
    hi: {
      badge: "भारत का पहला डिजिटल मनी को-पायलट",
      heroHeading: "बचत। खर्च। पूर्ण सुरक्षा।",
      heroSubheading: "भारत की पहली डिजिटल-पेमेंट पीढ़ी के लिए विशेष रूप से निर्मित। लेन-देन से पहले फ्रॉड जांच, अनियमित स्टाइपेंड बजटिंग और ₹99 ऑटो-पे लीक्स की रिकवरी।",
      ctaPrimary: "निःशुल्क साइन अप करें",
      ctaSecondary: "स्कैम शील्ड डेमो देखें",
      statUsers: "48,000+",
      statUsersLabel: "सुरक्षित भारतीय युवा",
      statChecked: "₹18.4 करोड़",
      statCheckedLabel: "स्कैन किए गए भुगतान",
      statLeaks: "3.2 गुना",
      statLeaksLabel: "तेज़ बचत गति",
      pillarsHeading: "आपके डिजिटल पैसे को सुरक्षित और संगठित रखने के तीन स्तंभ",
      shieldTitle: "शील्ड (SHIELD)",
      shieldSubtitle: "3 सेकंड के भीतर प्री-ट्रांजैक्शन स्कैम डिटेक्शन",
      shieldDesc: "UPI पिन दर्ज करने से पहले फर्जी कलेक्ट रिक्वेस्ट और संदिग्ध QR कोड को तुरंत पहचान कर रोकता है।",
      spendTitle: "स्पेंड (SPEND)",
      spendSubtitle: "अनियमित आय और स्टाइपेंड का सटीक हिसाब",
      spendDesc: "महीने की 1 तारीख के पारंपरिक नियम छोड़ें। जब स्टाइपेंड या फ्रीलांस पेमेंट आए, तब से खर्च प्लान करें।",
      saveTitle: "सेव (SAVE)",
      saveSubtitle: "भूले हुए ₹99 ऑटो-पे मैन्डेट्स की रिकवरी",
      saveDesc: "ट्रायल समाप्त होने के बाद कटने वाले सब्सक्रिप्शन रद्द करें और अपने नए लैपटॉप या फोन के लिए बचत करें।",
      footerStatText: "₹805 crore was lost to UPI fraud up to November of FY26. Kavach stops the tap before the money leaves.",
      readyHeading: "क्या आप अपने डिजिटल पैसे पर नियंत्रण पाने के लिए तैयार हैं?",
      readySub: "हजारों युवा भारतीयों से जुड़ें जो बिना किसी चिंता के सुरक्षित UPI भुगतान करते हैं।"
    }
  };

  const text = t[lang] || t.en;

  return (
    <div className="flex flex-col animate-fade-in text-left">
      
      {/* 1. HERO SECTION */}
      <section className="text-center flex flex-col items-center max-w-3xl mx-auto pt-2 sm:pt-6 mb-16 sm:mb-20">
        
        {/* Top Tagline Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-stone-800 text-xs sm:text-sm font-semibold mb-6 shadow-sm">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>{text.badge}</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-4xl sm:text-6xl font-black text-stone-900 tracking-tight leading-[1.1] mb-5">
          {text.heroHeading}
        </h1>

        <p className="text-base sm:text-xl text-stone-600 font-medium max-w-2xl mx-auto leading-relaxed mb-8">
          {text.heroSubheading}
        </p>

        {/* Dual CTAs: Sign Up & Live Demo */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full max-w-md mx-auto mb-10">
          <button
            type="button"
            onClick={onOpenSignUp}
            className="w-full sm:w-auto min-h-[52px] px-7 py-3.5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-stone-900/15 cursor-pointer transition-all active:scale-[0.98]"
          >
            <span>{text.ctaPrimary}</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </button>

          <NavLink
            to="/shield"
            className="w-full sm:w-auto min-h-[52px] px-6 py-3.5 rounded-2xl bg-white hover:bg-stone-100 text-stone-900 font-bold text-base border-2 border-stone-300 flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <Shield className="w-4 h-4 text-stone-700" />
            <span>{text.ctaSecondary}</span>
          </NavLink>
        </div>

        {/* Key Metrics Strip */}
        <div className="w-full grid grid-cols-3 gap-2 sm:gap-4 p-4 rounded-3xl bg-white border-2 border-stone-200 shadow-sm text-center">
          <div className="p-2">
            <span className="text-xl sm:text-2xl font-black text-stone-900 block">{text.statUsers}</span>
            <span className="text-[11px] sm:text-xs text-stone-500 font-medium">{text.statUsersLabel}</span>
          </div>
          <div className="p-2 border-x border-stone-200">
            <span className="text-xl sm:text-2xl font-black text-emerald-700 block">{text.statChecked}</span>
            <span className="text-[11px] sm:text-xs text-stone-500 font-medium">{text.statCheckedLabel}</span>
          </div>
          <div className="p-2">
            <span className="text-xl sm:text-2xl font-black text-amber-700 block">{text.statLeaks}</span>
            <span className="text-[11px] sm:text-xs text-stone-500 font-medium">{text.statLeaksLabel}</span>
          </div>
        </div>
      </section>

      {/* 2. THE THREE PILLARS SHOWCASE */}
      <section className="mb-16">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            {text.pillarsHeading}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* PILLAR 1: SHIELD */}
          <NavLink
            to="/shield"
            className="group bg-white rounded-3xl p-6 border-2 border-stone-200 hover:border-stone-900 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="inline-block px-2.5 py-0.5 rounded bg-stone-100 text-stone-800 font-mono text-xs font-bold uppercase tracking-wider mb-2">
                {text.shieldTitle}
              </span>
              <h3 className="text-lg font-bold text-stone-900 mb-1.5">
                {text.shieldSubtitle}
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed font-medium">
                {text.shieldDesc}
              </p>
            </div>
            <div className="mt-5 pt-3.5 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-stone-900">
              <span>Try Scam Scanner</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </NavLink>

          {/* PILLAR 2: SPEND */}
          <NavLink
            to="/spend"
            className="group bg-white rounded-3xl p-6 border-2 border-stone-200 hover:border-stone-900 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Wallet className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="inline-block px-2.5 py-0.5 rounded bg-stone-100 text-stone-800 font-mono text-xs font-bold uppercase tracking-wider mb-2">
                {text.spendTitle}
              </span>
              <h3 className="text-lg font-bold text-stone-900 mb-1.5">
                {text.spendSubtitle}
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed font-medium">
                {text.spendDesc}
              </p>
            </div>
            <div className="mt-5 pt-3.5 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-stone-900">
              <span>View Payout Cycles</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </NavLink>

          {/* PILLAR 3: SAVE */}
          <NavLink
            to="/save"
            className="group bg-white rounded-3xl p-6 border-2 border-stone-200 hover:border-stone-900 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Coins className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="inline-block px-2.5 py-0.5 rounded bg-stone-100 text-stone-800 font-mono text-xs font-bold uppercase tracking-wider mb-2">
                {text.saveTitle}
              </span>
              <h3 className="text-lg font-bold text-stone-900 mb-1.5">
                {text.saveSubtitle}
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed font-medium">
                {text.saveDesc}
              </p>
            </div>
            <div className="mt-5 pt-3.5 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-stone-900">
              <span>Audit AutoPay Mandates</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </NavLink>

        </div>
      </section>

      {/* 3. READY CTA CARD */}
      <section className="bg-stone-900 text-white rounded-3xl p-7 sm:p-9 text-center mb-12 shadow-xl">
        <div className="max-w-md mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-stone-900 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-black mb-2">
            {text.readyHeading}
          </h3>
          <p className="text-stone-300 text-xs sm:text-sm font-medium mb-6">
            {text.readySub}
          </p>
          <button
            type="button"
            onClick={onOpenSignUp}
            className="w-full sm:w-auto min-h-[50px] px-8 py-3 rounded-xl bg-white text-stone-900 hover:bg-stone-100 font-black text-base shadow-md cursor-pointer transition-all active:scale-[0.98]"
          >
            {text.ctaPrimary}
          </button>
        </div>
      </section>

      {/* 4. IMPACT FOOTER STATISTIC */}
      <footer className="w-full bg-[#121214] text-white rounded-3xl p-7 text-center border border-stone-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-800 text-red-300 text-xs font-bold uppercase tracking-wider mb-3">
          <span className="w-2 h-2 rounded-full bg-red-500"></span>
          Official UPI Security Notice
        </div>
        <p className="text-lg sm:text-xl font-black text-white leading-snug tracking-tight max-w-xl mx-auto mb-4">
          &ldquo;{text.footerStatText}&rdquo;
        </p>
        <div className="text-xs text-stone-400 flex items-center justify-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          <span>Non-custodial • 100% On-device privacy • Zero UPI PIN access</span>
        </div>
      </footer>

    </div>
  );
}
