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
    { name: 'Subscriptions & Bills', percent: 18, amount: '₹615', color: 'bg-rose-500', barWidth: '18%' },
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
      savedSub: "Smart micro-savings + pots",
      safeBurnCard: "Safe Daily Burn",
      safeBurnSub: "24 days remaining",
      chartTitle: "Spending Pulse (Weekly Bar Graph)",
      chartSub: "Average spend: ₹487/day. Thursday had high Swiggy group order split.",
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
  };

  const text = t.en;

  return (
    <div className="w-full space-y-8 animate-fade-in text-left">
      
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-stone-900 tracking-tight">
            {text.welcome}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-medium mt-1">
            {text.subtitle}
          </p>
        </div>

        {/* Range Selector */}
        <div className="flex items-center bg-stone-100 p-1.5 rounded-2xl border border-stone-300 self-start sm:self-auto text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveRange('cycle')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeRange === 'cycle' ? 'bg-stone-900 text-white shadow-sm' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            This Cycle
          </button>
          <button
            type="button"
            onClick={() => setActiveRange('week')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeRange === 'week' ? 'bg-stone-900 text-white shadow-sm' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Weekly Pulse
          </button>
        </div>
      </div>

      {/* 2. Top Metric Cards (4 Grid - Spacious on Laptops) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Inflow */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border-2 border-stone-200 shadow-sm hover:border-stone-400 transition-colors">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">{text.inflowCard}</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-stone-900 block">₹12,000</span>
          <span className="text-xs text-emerald-700 font-bold mt-1 block">{text.inflowSub}</span>
        </div>

        {/* Spent */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border-2 border-stone-200 shadow-sm hover:border-stone-400 transition-colors">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">{text.spentCard}</span>
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-stone-900 block">₹3,421</span>
          <span className="text-xs text-stone-500 font-medium mt-1 block">{text.spentSub}</span>
        </div>

        {/* Saved */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border-2 border-stone-200 shadow-sm hover:border-stone-400 transition-colors">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">{text.savedCard}</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-stone-900 block">₹2,100</span>
          <span className="text-xs text-amber-700 font-bold mt-1 block">{text.savedSub}</span>
        </div>

        {/* Daily Safe Burn */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border-2 border-stone-200 shadow-sm hover:border-stone-400 transition-colors">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">{text.safeBurnCard}</span>
            <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-600" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-emerald-700 block">₹475/day</span>
          <span className="text-xs text-stone-500 font-medium mt-1 block">{text.safeBurnSub}</span>
        </div>
      </div>

      {/* 3. Interactive Bar Chart: Weekly Spending Pulse */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-stone-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-stone-700" />
              </div>
              <h2 className="text-xl font-black text-stone-900">{text.chartTitle}</h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-500 font-medium mt-1">{text.chartSub}</p>
          </div>
          <span className="inline-block text-xs bg-amber-50 font-bold px-3 py-1.5 rounded-xl text-amber-900 border border-amber-200 self-start sm:self-auto">
            Peak Spending: Thu (₹840)
          </span>
        </div>

        {/* Bar Graph Visual Container */}
        <div className="h-56 w-full flex items-end justify-between gap-3 sm:gap-6 pt-8 pb-3 border-b border-stone-100">
          {weeklyData.map((d) => (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
              <span className="text-xs font-bold text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity">
                ₹{d.amount}
              </span>
              <div
                className={`w-full max-w-[52px] rounded-t-2xl transition-all duration-300 ${
                  d.peak
                    ? 'bg-amber-500 group-hover:bg-amber-600 shadow-sm shadow-amber-200'
                    : 'bg-stone-900 group-hover:bg-stone-700'
                }`}
                style={{ height: d.height }}
              />
              <span className="text-xs sm:text-sm font-bold text-stone-600 mt-1">{d.day}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs sm:text-sm text-stone-500 font-medium mt-4 pt-1">
          <span>Weekly Total: <strong className="text-stone-900 font-black">₹3,420</strong></span>
          <span className="text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">Within Stipend Budget ✓</span>
        </div>
      </div>

      {/* 4. Two Columns: Category Allocation & Savings Pace */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Category Breakdown */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border-2 border-stone-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center">
                <PieChart className="w-4 h-4 text-stone-700" />
              </div>
              <h3 className="text-lg font-black text-stone-900">{text.breakdownTitle}</h3>
            </div>
            <p className="text-xs text-stone-500 font-medium mb-5">{text.breakdownSub}</p>

            <div className="space-y-4">
              {categories.map((cat) => (
                <div key={cat.name}>
                  <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-stone-800 mb-1.5">
                    <span>{cat.name}</span>
                    <span>{cat.amount} ({cat.percent}%)</span>
                  </div>
                  <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden border border-stone-200">
                    <div className={`h-full ${cat.color} rounded-full`} style={{ width: cat.barWidth }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span>Primary Outflow: Swiggy / Zepto</span>
            <NavLink to="/spend" className="text-stone-900 font-bold underline hover:text-amber-600">
              View Cashflow Log ➔
            </NavLink>
          </div>
        </div>

        {/* Goal Pace & Velocity */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border-2 border-stone-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Target className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-black text-stone-900">{text.savingsVelocity}</h3>
              </div>
              <span className="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 font-black text-xs">
                On Track
              </span>
            </div>
            <p className="text-xs text-stone-500 font-medium mb-5">{text.laptopGoalPace}</p>

            <div className="p-4 sm:p-5 rounded-2xl bg-stone-50 border border-stone-200 mb-4">
              <div className="flex items-center justify-between text-sm font-bold text-stone-900 mb-2">
                <span>{text.laptopGoal}</span>
                <span className="text-emerald-700 font-black">₹9,600 / ₹15,000</span>
              </div>
              <div className="w-full h-3.5 bg-stone-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" style={{ width: '64%' }} />
              </div>
              <div className="flex items-center justify-between text-[11px] text-stone-500 mt-2 font-semibold">
                <span>Saved from smart round-up pots</span>
                <span>Deadline: Dec 2026</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Tip: Depositing ₹350 more this week reaches your goal 5 days earlier!</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs">
            <NavLink to="/goals" className="text-stone-900 font-bold underline hover:text-amber-600">
              Customize All Goals ➔
            </NavLink>
          </div>
        </div>

      </div>

      {/* 5. Quick Shortcut Strip */}
      <div className="p-5 sm:p-6 rounded-3xl bg-stone-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-stone-900 flex items-center justify-center font-bold text-xl shadow-md">
            🛡️
          </div>
          <div>
            <h4 className="text-base font-black">Need to verify a suspicious UPI payment link?</h4>
            <p className="text-xs text-stone-300 mt-0.5">Scan before entering your UPI PIN</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <NavLink
            to="/shield"
            className="min-h-[46px] px-5 py-2.5 rounded-xl bg-white text-stone-900 text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm hover:bg-stone-100 transition-colors"
          >
            <span>Scan Fraud</span>
            <ArrowUpRight className="w-4 h-4" />
          </NavLink>
          <NavLink
            to="/quiz"
            className="min-h-[46px] px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Daily Quiz</span>
            <HelpCircle className="w-4 h-4 text-amber-400" />
          </NavLink>
        </div>
      </div>

    </div>
  );
}
