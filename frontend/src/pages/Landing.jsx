import React, { useState, useEffect } from 'react';
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
  Target,
  Bot
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { educationApi } from '../services/api';

export default function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    educationApi.getArticles()
      .then((data) => {
        if (data && data.length > 0) {
          setArticles(data.map((a) => ({
            id: a.id,
            badge: a.category || "Financial Literacy",
            title: a.title,
            summary: a.summary,
            readTime: `${a.read_time_minutes || 3} min read`,
            icon: "📚",
            details: a.content
          })));
        }
      })
      .catch((err) => console.warn('Articles fetch error:', err));
  }, []);

  const handleAction = (destination) => {
    if (user) {
      navigate(destination);
    } else {
      navigate('/auth');
    }
  };

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
  };

  const text = t.en;

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
            <span>{user ? 'Open Dashboard' : text.ctaPrimary}</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </button>

          <button
            type="button"
            onClick={() => handleAction('/shield')}
            className="w-full sm:w-auto min-h-[52px] px-6 py-3.5 rounded-2xl bg-white hover:bg-stone-100 text-stone-900 font-bold text-base border-2 border-stone-300 flex items-center justify-center gap-2 shadow-sm cursor-pointer"
          >
            <Shield className="w-4 h-4 text-stone-700" />
            <span>{user ? 'Open Scam Shield' : 'Sign Up to Explore'}</span>
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
            onClick={() => handleAction('/goals')}
            className="group bg-white rounded-3xl p-6 border-2 border-stone-200 hover:border-stone-900 shadow-sm hover:shadow-md transition-all flex flex-col justify-between text-left cursor-pointer"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Target className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="inline-block px-2.5 py-0.5 rounded bg-stone-100 text-stone-800 font-mono text-xs font-bold uppercase tracking-wider mb-2">
                GOALS
              </span>
              <h3 className="text-lg font-bold text-stone-900 mb-1.5">Personal Savings Goals</h3>
              <p className="text-sm text-stone-600 leading-relaxed font-medium">Plan and fund major purchases like laptops or trips with flexible deposits—no EMI debt.</p>
            </div>
            <div className="mt-5 pt-3.5 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-stone-900">
              <span>{user ? 'Open Goals Planner' : 'Sign Up to Set Goals'}</span>
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
          {articles.map((item) => (
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
            {user ? 'Go to Dashboard' : text.ctaPrimary}
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
