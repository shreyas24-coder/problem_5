import React, { useState } from 'react';
import { useOutletContext, NavLink } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Coins,
  ShieldCheck,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  BarChart3,
  CreditCard,
  Target,
  HelpCircle
} from 'lucide-react';

export default function DashboardPage() {
  const { lang, user, onOpenSignUp } = useOutletContext() || { lang: 'en' };
  const [activeRange, setActiveRange] = useState('cycle'); // 'cycle' | 'week' | 'month'

  // Weekly spending bars data (Mon - Sun)
  const weeklyData = [
    { day: 'Mon', amount: 320, height: '40%' },
    { day: 'Tue', amount: 580, height: '65%' },
    { day: 'Wed', amount: 210, height: '28%' },
    { day: 'Thu', amount: 840, height: '92%', peak: true },
    { day: 'Fri', amount: 460, height: '52%' },
    { day: 'Sat', amount: 690, height: '78%' },
    { day: 'Sun', amount: 310, height: '38%' }
  ];

  // Category breakdown data
  const categories = [
    { name: 'Food & Dining', percent: 42, amount: '₹1,436', color: 'bg-amber-500', barWidth: '42%' },
    { name: 'Commute & Travel', percent: 24, amount: '₹820', color: 'bg-blue-500', barWidth: '24%' },
    { name: 'Subscriptions & Leaks', percent: 18, amount: '₹615', color: 'bg-rose-500', barWidth: '18%' },
    { name: 'Personal Savings Pot', percent: 16, amount: '₹550', color: 'bg-emerald-500', barWidth: '16%' }
  ];

  const t = {
    en: {
      welcome: user ? `Welcome back, ${user.name.split(' ')[0]} 👋` : "Welcome to Kavach Copilot 👋",
      subtitle: "Here's your live digital money pulse, spending burn rate, and savings growth.",
      inflowCard: "Current Inflow",
      inflowSub: "Stipend (RazorpayX)",
      spentCard: "Total Spent",
      spentSub: "Across 14 UPI taps",
      savedCard: "Total Saved",
      savedSub: "AutoPay + pots",
      safeBurnCard: "Safe Daily Burn",
      safeBurnSub: "24 days remaining",
      chartTitle: "Spending Pulse (Weekly)",
      chartSub: "Average spend: ₹487/day. Thursday had high Swiggy group order.",
      breakdownTitle: "Category Allocation",
      breakdownSub: "Where your stipend has gone this payout cycle.",
      savingsVelocity: "Savings Goal Pace",
      laptopGoal: "₹15,000 Laptop Goal",
      laptopGoalPace: "64% achieved • Ahead by 8 days",
      quickActions: "Quick Actions",
      testShield: "Test Scam Shield",
      trackGoal: "Manage Goals",
      dailyQuiz: "Daily Quiz"
    },
    hi: {
      welcome: user ? `वापसी पर स्वागत है, ${user.name.split(' ')[0]} 👋` : "कवच को-पायलट में आपका स्वागत है 👋",
      subtitle: "यहाँ आपका लाइव डिजिटल खर्च, दैनिक बजट और बचत की ताज़ा स्थिति है।",
      inflowCard: "कुल आय (Inflow)",
      inflowSub: "स्टाइपेंड (RazorpayX)",
      spentCard: "कुल खर्च (Spent)",
      spentSub: "14 UPI पेमेंट्स",
      savedCard: "कुल बचत (Saved)",
      savedSub: "ऑटो-पे + गोल फंड",
      safeBurnCard: "सुरक्षित दैनिक खर्च",
      safeBurnSub: "साइकिल में 24 दिन शेष",
      chartTitle: "साप्ताहिक खर्च विश्लेषण (Weekly Pulse)",
      chartSub: "औसत खर्च: ₹487/दिन। गुरुवार को सर्वाधिक खर्च हुआ।",
      breakdownTitle: "कैटेगरी अनुसार खर्च",
      breakdownSub: "इस पेआउट साइकिल में आपके पैसे कहाँ गए।",
      savingsVelocity: "बचत लक्ष्य की गति",
      laptopGoal: "₹15,000 लैपटॉप फंड",
      laptopGoalPace: "64% पूर्ण • 8 दिन आगे",
      quickActions: "त्वरित विकल्प",
      testShield: "स्कैम शील्ड जाँचें",
      trackGoal: "लक्ष्य प्रबंधित करें",
      dailyQuiz: "दैनिक क्विज़"
    }
  };

  const text = t[lang] || t.en;

  return (
    <div className="flex flex-col animate-fade-in text-left space-y-6">
      
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-stone-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            {text.welcome}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-medium mt-0.5">
            {text.subtitle}
          </p>
        </div>

        {/* Range Selector */}
        <div className="flex items-center bg-stone-100 p-1 rounded-full border border-stone-300 self-start sm:self-auto text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveRange('cycle')}
            className={`px-3 py-1.5 rounded-full transition-all ${
              activeRange === 'cycle' ? 'bg-stone-900 text-white shadow-sm' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            This Cycle
          </button>
          <button
            type="button"
            onClick={() => setActiveRange('week')}
            className={`px-3 py-1.5 rounded-full transition-all ${
              activeRange === 'week' ? 'bg-stone-900 text-white shadow-sm' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Weekly
          </button>
        </div>
      </div>

      {/* 2. Top Metric Cards (4 Grid) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Inflow */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border-2 border-stone-200 shadow-sm">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">{text.inflowCard}</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <span className="text-xl sm:text-2xl font-black text-stone-900 block">₹12,000</span>
          <span className="text-[11px] text-emerald-700 font-bold mt-0.5 block">{text.inflowSub}</span>
        </div>

        {/* Spent */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border-2 border-stone-200 shadow-sm">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">{text.spentCard}</span>
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <span className="text-xl sm:text-2xl font-black text-stone-900 block">₹3,421</span>
          <span className="text-[11px] text-stone-500 font-medium mt-0.5 block">{text.spentSub}</span>
        </div>

        {/* Saved */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border-2 border-stone-200 shadow-sm">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">{text.savedCard}</span>
            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <span className="text-xl sm:text-2xl font-black text-stone-900 block">₹2,100</span>
          <span className="text-[11px] text-amber-700 font-bold mt-0.5 block">{text.savedSub}</span>
        </div>

        {/* Daily Safe Burn */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border-2 border-stone-200 shadow-sm">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">{text.safeBurnCard}</span>
            <div className="w-7 h-7 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-600" />
            </div>
          </div>
          <span className="text-xl sm:text-2xl font-black text-emerald-700 block">₹475/day</span>
          <span className="text-[11px] text-stone-500 font-medium mt-0.5 block">{text.safeBurnSub}</span>
        </div>
      </div>

      {/* 3. Interactive Bar Chart: Weekly Spending Pulse */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border-2 border-stone-300 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-stone-700" />
              <h2 className="text-lg font-black text-stone-900">{text.chartTitle}</h2>
            </div>
            <p className="text-xs text-stone-500 font-medium mt-0.5">{text.chartSub}</p>
          </div>
          <span className="hidden sm:inline-block text-xs bg-stone-100 font-bold px-2.5 py-1 rounded-lg text-stone-700 border border-stone-200">
            Peak: Thu (₹840)
          </span>
        </div>

        {/* Bar Graph Visual Container */}
        <div className="h-44 w-full flex items-end justify-between gap-2 pt-6 pb-2 border-b border-stone-100">
          {weeklyData.map((d) => (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
              <span className="text-[10px] font-bold text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity">
                ₹{d.amount}
              </span>
              <div
                className={`w-full max-w-[36px] rounded-t-xl transition-all duration-300 ${
                  d.peak
                    ? 'bg-amber-500 group-hover:bg-amber-600 shadow-sm shadow-amber-200'
                    : 'bg-stone-900 group-hover:bg-stone-700'
                }`}
                style={{ height: d.height }}
              />
              <span className="text-xs font-bold text-stone-600 mt-1">{d.day}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-stone-500 font-medium mt-3 pt-1">
          <span>Weekly Total: ₹3,420</span>
          <span className="text-emerald-700 font-bold">Within Stipend Budget ✓</span>
        </div>
      </div>

      {/* 4. Two Columns: Category Allocation & Savings Pace */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Category Breakdown */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border-2 border-stone-300 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <PieChart className="w-5 h-5 text-stone-700" />
              <h3 className="text-lg font-black text-stone-900">{text.breakdownTitle}</h3>
            </div>
            <p className="text-xs text-stone-500 font-medium mb-4">{text.breakdownSub}</p>

            <div className="space-y-3.5">
              {categories.map((cat) => (
                <div key={cat.name}>
                  <div className="flex items-center justify-between text-xs font-bold text-stone-800 mb-1">
                    <span>{cat.name}</span>
                    <span>{cat.amount} ({cat.percent}%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden border border-stone-200">
                    <div className={`h-full ${cat.color} rounded-full`} style={{ width: cat.barWidth }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span>Primary Expense: Swiggy / Zepto</span>
            <NavLink to="/spend" className="text-stone-900 font-bold underline">
              View Log ➔
            </NavLink>
          </div>
        </div>

        {/* Goal Pace & Velocity */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border-2 border-stone-300 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-700" />
                <h3 className="text-lg font-black text-stone-900">{text.savingsVelocity}</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-black text-xs">
                On Track
              </span>
            </div>
            <p className="text-xs text-stone-500 font-medium mb-4">{text.laptopGoalPace}</p>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 mb-4">
              <div className="flex items-center justify-between text-sm font-bold text-stone-900 mb-2">
                <span>{text.laptopGoal}</span>
                <span className="text-emerald-700 font-black">₹9,600 / ₹15,000</span>
              </div>
              <div className="w-full h-3 bg-stone-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" style={{ width: '64%' }} />
              </div>
              <div className="flex items-center justify-between text-[11px] text-stone-500 mt-2 font-medium">
                <span>Auto-saved ₹298 from cancelled AutoPay</span>
                <span>Target: Dec 2026</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Tip: Depositing ₹350 more this week reaches your goal 5 days earlier!</span>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
            <NavLink to="/goals" className="text-stone-900 font-bold underline">
              Customize All Goals ➔
            </NavLink>
          </div>
        </div>

      </div>

      {/* 5. Quick Shortcut Strip */}
      <div className="p-4 rounded-3xl bg-stone-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-400 text-stone-900 flex items-center justify-center font-bold">
            🛡️
          </div>
          <div>
            <h4 className="text-sm font-bold">Need to verify a payment link?</h4>
            <p className="text-xs text-stone-400">Scan before entering your UPI PIN</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <NavLink
            to="/shield"
            className="min-h-[44px] px-4 py-2 rounded-xl bg-white text-stone-900 text-xs font-bold flex items-center justify-center gap-1 shadow-sm"
          >
            <span>Scan Fraud</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </NavLink>
          <NavLink
            to="/quiz"
            className="min-h-[44px] px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-bold flex items-center justify-center gap-1"
          >
            <span>Daily Quiz</span>
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
          </NavLink>
        </div>
      </div>

    </div>
  );
}
