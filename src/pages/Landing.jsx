import React, { useState } from 'react';
import { NavLink, useOutletContext, useNavigate } from 'react-router-dom';
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
  AlertTriangle,
  BookOpen,
  Newspaper,
  Lightbulb,
  X,
  Bot
} from 'lucide-react';

export default function LandingPage() {
  const { lang, user } = useOutletContext() || { lang: 'en', user: null };
  const navigate = useNavigate();
  const [selectedArticle, setSelectedArticle] = useState(null);

  const handleAction = (destination) => {
    if (user) {
      navigate(destination);
    } else {
      navigate('/auth');
    }
  };

  // Educational articles & News
  const educationalNews = [
    {
      id: 1,
      badge: "RBI Alert • UPI Safety",
      title: "The 'Refund Collect Request' Scam: How to Spot It",
      summary: "Fraudsters pose as customer support and send payment collect requests disguised as cashback.",
      readTime: "2 min read",
      icon: "🚨",
      details: "NPCI & RBI strictly clarify that your UPI PIN is only required when money is LEAVING your account. You NEVER need to scan a QR code or enter a PIN to receive refunds, cashback, or prizes. If a screen asks for your PIN, money is being debited."
    },
    {
      id: 2,
      badge: "Investing 101 • Gen-Z",
      title: "Liquid Funds vs 2.7% Bank Accounts for Stipends",
      summary: "Where to park your unspent stipend cash to earn 6.8% safely with instant 1-day withdrawal.",
      readTime: "3 min read",
      icon: "📈",
      details: "Instead of leaving your stipend in a regular savings account earning 2.5–3%, young earners can use Overnight & Liquid mutual funds. They invest in sovereign government bonds, carry negligible risk, and earn ~6.5–7% while letting you withdraw directly to UPI when needed."
    },
    {
      id: 3,
      badge: "AutoPay Hack • Savings",
      title: "The 'Day 5 Rule' to Beat Auto-Debit Traps",
      summary: "How forgotten ₹99 & ₹199 free trial mandates quietly cost young Indians over ₹4,200 each year.",
      readTime: "2 min read",
      icon: "💡",
      details: "When signing up for free trials (streaming, fitness, productivity apps), apps mandate an UPI e-mandate. Rule of thumb: Cancel the mandate in your UPI app immediately on Day 1 or Day 5. You retain the full trial duration, but prevent unwanted automatic deductions."
    },
    {
      id: 4,
      badge: "Wealth Compound • Future",
      title: "Why Starting a ₹500 SIP at Age 20 Beats ₹2,500 at 30",
      summary: "The mathematical proof that time in the market beats timing the market.",
      readTime: "3 min read",
      icon: "🌱",
      details: "A 20-year-old investing just ₹1,000/month at 12% annual return builds over ₹35 Lakhs by age 50. If you delay until age 30, you must invest triple the amount (₹3,000/month) just to achieve the same balance. Time is your greatest asset."
    }
  ];

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
      saveTitle: "AI COPILOT",
      saveSubtitle: "1-on-1 FinTech Money Assistant",
      saveDesc: "Ask personalized questions on saving stipends, detecting UPI scams, and planning purchases with instant AI intelligence.",
      eduHeading: "Financial Smarts & Security News",
      eduSub: "Essential financial literacy, RBI payment alerts, and micro-investing rules curated for young earners.",
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
      pillarsHeading: "डिजिटल पैसे को सुरक्षित और संगठित रखने के साधन",
      shieldTitle: "शील्ड (SHIELD)",
      shieldSubtitle: "3 सेकंड के भीतर प्री-ट्रांजैक्शन स्कैम डिटेक्शन",
      shieldDesc: "UPI पिन दर्ज करने से पहले फर्जी कलेक्ट रिक्वेस्ट और संदिग्ध QR कोड को तुरंत पहचान कर रोकता है।",
      spendTitle: "स्पेंड (SPEND)",
      spendSubtitle: "अनियमित आय और स्टाइपेंड का सटीक हिसाब",
      spendDesc: "महीने की 1 तारीख के पारंपरिक नियम छोड़ें। जब स्टाइपेंड आए तब से खर्च और बचत का हिसाब रखें।",
      saveTitle: "सेव (SAVE)",
      saveSubtitle: "भूले हुए ₹99 ऑटो-पे मैन्डेट्स की रिकवरी",
      saveDesc: "ट्रायल समाप्त होने के बाद कटने वाले सब्सक्रिप्शन रद्द करें और अपने नए लैपटॉप या फोन के लिए बचत करें।",
      eduHeading: "वित्तीय ज्ञान और सुरक्षा समाचार",
      eduSub: "RBI के महत्वपूर्ण दिशा-निर्देश, सुरक्षित निवेश और युवा पीढ़ी के लिए उपयोगी टिप्स।",
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
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-stone-800 text-xs sm:text-sm font-semibold mb-6 shadow-sm">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>{text.badge}</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-stone-900 tracking-tight leading-[1.1] mb-5">
          {text.heroHeading}
        </h1>

        <p className="text-base sm:text-xl text-stone-600 font-medium max-w-2xl mx-auto leading-relaxed mb-8">
          {text.heroSubheading}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full max-w-md mx-auto mb-10">
          <button
            type="button"
            onClick={() => handleAction('/dashboard')}
            className="w-full sm:w-auto min-h-[52px] px-7 py-3.5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-stone-900/15 cursor-pointer active:scale-[0.98]"
          >
            <span>{user ? (lang === 'hi' ? 'डैशबोर्ड खोलें' : 'Open Dashboard') : text.ctaPrimary}</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </button>

          <button
            type="button"
            onClick={() => handleAction('/shield')}
            className="w-full sm:w-auto min-h-[52px] px-6 py-3.5 rounded-2xl bg-white hover:bg-stone-100 text-stone-900 font-bold text-base border-2 border-stone-300 flex items-center justify-center gap-2 shadow-sm cursor-pointer"
          >
            <Shield className="w-4 h-4 text-stone-700" />
            <span>{user ? (lang === 'hi' ? 'स्कैम शील्ड खोलें' : 'Open Scam Shield') : (lang === 'hi' ? 'सुरक्षा शुरू करें' : 'Sign Up to Explore')}</span>
          </button>
        </div>

        {/* Live Metrics */}
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

      {/* 2. THE THREE PILLARS */}
      <section className="mb-16">
        <div className="text-center max-w-xl mx-auto mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            {text.pillarsHeading}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <button
            type="button"
            onClick={() => handleAction('/shield')}
            className="group bg-white rounded-3xl p-6 border-2 border-stone-200 hover:border-stone-900 shadow-sm hover:shadow-md transition-all flex flex-col justify-between text-left cursor-pointer"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="inline-block px-2.5 py-0.5 rounded bg-stone-100 text-stone-800 font-mono text-xs font-bold uppercase tracking-wider mb-2">
                {text.shieldTitle}
              </span>
              <h3 className="text-lg font-bold text-stone-900 mb-1.5">{text.shieldSubtitle}</h3>
              <p className="text-sm text-stone-600 leading-relaxed font-medium">{text.shieldDesc}</p>
            </div>
            <div className="mt-5 pt-3.5 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-stone-900">
              <span>{user ? 'Open Scam Scanner' : 'Sign Up to Test Scanner'}</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleAction('/spend')}
            className="group bg-white rounded-3xl p-6 border-2 border-stone-200 hover:border-stone-900 shadow-sm hover:shadow-md transition-all flex flex-col justify-between text-left cursor-pointer"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Wallet className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="inline-block px-2.5 py-0.5 rounded bg-stone-100 text-stone-800 font-mono text-xs font-bold uppercase tracking-wider mb-2">
                {text.spendTitle}
              </span>
              <h3 className="text-lg font-bold text-stone-900 mb-1.5">{text.spendSubtitle}</h3>
              <p className="text-sm text-stone-600 leading-relaxed font-medium">{text.spendDesc}</p>
            </div>
            <div className="mt-5 pt-3.5 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-stone-900">
              <span>{user ? 'View Payout Cycles' : 'Sign Up for Cashflow Tracker'}</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleAction('/chat')}
            className="group bg-white rounded-3xl p-6 border-2 border-stone-200 hover:border-stone-900 shadow-sm hover:shadow-md transition-all flex flex-col justify-between text-left cursor-pointer"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Bot className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="inline-block px-2.5 py-0.5 rounded bg-stone-100 text-stone-800 font-mono text-xs font-bold uppercase tracking-wider mb-2">
                {text.saveTitle}
              </span>
              <h3 className="text-lg font-bold text-stone-900 mb-1.5">{text.saveSubtitle}</h3>
              <p className="text-sm text-stone-600 leading-relaxed font-medium">{text.saveDesc}</p>
            </div>
            <div className="mt-5 pt-3.5 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-stone-900">
              <span>{user ? 'Open AI Copilot' : 'Sign Up for AI Copilot'}</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
      </section>

      {/* 3. EDUCATIONAL NEWS & INVESTING SMARTS */}
      <section className="mb-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-700 mb-1">
              <BookOpen className="w-4 h-4" />
              <span>Kavach Academy & RBI Bulletins</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              {text.eduHeading}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 max-w-sm">
            {text.eduSub}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {educationalNews.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedArticle(item)}
              className="bg-white p-5 rounded-3xl border-2 border-stone-200 hover:border-stone-400 shadow-sm transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-stone-600 uppercase tracking-wider bg-stone-100 px-2.5 py-0.5 rounded-md border border-stone-200">
                    {item.badge}
                  </span>
                  <span className="text-xl">{item.icon}</span>
                </div>
                <h3 className="text-base font-bold text-stone-900 mb-1.5 leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed font-medium">
                  {item.summary}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500 font-bold">
                <span>{item.readTime}</span>
                <span className="text-stone-900 underline flex items-center gap-1">
                  Read Rule <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. READY CTA CARD */}
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
            onClick={() => handleAction('/dashboard')}
            className="w-full sm:w-auto min-h-[50px] px-8 py-3 rounded-xl bg-white text-stone-900 hover:bg-stone-100 font-black text-base shadow-md cursor-pointer active:scale-[0.98]"
          >
            {user ? (lang === 'hi' ? 'डैशबोर्ड खोलें' : 'Go to Dashboard') : text.ctaPrimary}
          </button>
        </div>
      </section>

      {/* 5. IMPACT FOOTER STATISTIC */}
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

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl border-2 border-stone-300 shadow-2xl p-6 sm:p-7 text-stone-900">
            <button
              type="button"
              onClick={() => setSelectedArticle(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-left space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{selectedArticle.icon}</span>
                <span className="text-xs font-bold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-md border border-amber-200">
                  {selectedArticle.badge}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-stone-900 leading-tight">
                {selectedArticle.title}
              </h2>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs sm:text-sm text-stone-700 leading-relaxed space-y-2">
                <p className="font-semibold text-stone-900">{selectedArticle.summary}</p>
                <hr className="border-stone-200" />
                <p>{selectedArticle.details}</p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-stone-500 font-medium">Verified by Kavach Security Desk</span>
                <button
                  type="button"
                  onClick={() => setSelectedArticle(null)}
                  className="min-h-[44px] px-5 py-2 rounded-xl bg-stone-900 text-white font-bold text-xs cursor-pointer"
                >
                  Close Rule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
