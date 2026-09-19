import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
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
  HelpCircle,
  AlertTriangle,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { dashboardApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  const [activeRange, setActiveRange] = useState('cycle');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState({
    net_balance: 0,
    total_income: 0,
    total_expenses: 0,
    total_goal_deposits: 0,
    savings_rate_pct: 0,
    streak_count: 0,
    category_breakdown: [],
    monthly_trends: [],
    budget_alerts: []
  });

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const data = await dashboardApi.getSummary();
      const netIncome = Number(data.total_income) || 0;
      const netExpenses = Number(data.total_expenses) || 0;
      const netSavings = Math.max(0, netIncome - netExpenses);
      const savingsRate = netIncome > 0 ? Math.round((netSavings / netIncome) * 100) : 0;

      setSummary({
        net_balance: Number(data.net_balance) || 0,
        total_income: netIncome,
        total_expenses: netExpenses,
        total_goal_deposits: Number(data.total_goal_deposits) || 0,
        savings_rate_pct: savingsRate,
        streak_count: data.current_streak || 0,
        category_breakdown: (data.category_spending || []).map((c) => ({
          category: c.category,
          amount: Number(c.total_amount) || 0,
          percentage: Number(c.percentage) || 0,
        })),
        monthly_trends: (data.monthly_trend || []).map((m) => ({
          month: m.month_name,
          income: Number(m.income) || 0,
          expenses: Number(m.expense) || 0,
          savings: Number(m.net_savings) || 0,
        })),
        budget_alerts: data.budget_alerts || []
      });
      setError(null);
    } catch (err) {
      console.error('Error loading dashboard summary:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const displayName = (user?.full_name || user?.name || 'Alex').split(' ')[0];

  const t = {
    welcome: `Welcome back, ${displayName} 👋`,
    subtitle: "Here's your live digital money pulse, spending burn rate, and savings growth.",
    inflowCard: "Total Inflow",
    inflowSub: "Salary & Gig Income",
    spentCard: "Total Spent",
    spentSub: "Logged Outflows",
    savedCard: "Locked in Goals",
    savedSub: "Purchase lockboxes",
    netBalanceCard: "Liquid Balance",
    netBalanceSub: "Available in wallet",
    chartTitle: "6-Month Financial Pulse",
    chartSub: "Track your income, expense and savings trajectory over the last 6 months.",
    breakdownTitle: "Category Allocation",
    breakdownSub: "Breakdown of logged expenditures.",
    quickActions: "Quick Actions",
  };

  // Real monthly trends from database (backend computes 6-month historical points)
  const trends = summary.monthly_trends || [];
  const maxExpense = Math.max(...trends.map(t => Math.max(t.expenses, t.income, 1)), 1000);

  return (
    <div className="w-full space-y-8 animate-fade-in text-left">
      
      {/* 1. Header Banner & Streak */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-stone-900 tracking-tight">
            {t.welcome}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-medium mt-1">
            {t.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Daily Streak Badge */}
          <div className="flex items-center gap-2 px-3.5 py-2 bg-amber-50 border border-amber-300/80 rounded-2xl shadow-xs">
            <Flame className="w-5 h-5 text-amber-500 fill-amber-500 animate-bounce" />
            <div className="text-left">
              <span className="block text-xs font-black text-stone-900 leading-none">
                {summary.streak_count || 0} Day Streak
              </span>
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                Daily Learning
              </span>
            </div>
          </div>

          <button
            onClick={fetchSummary}
            className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 rounded-2xl border border-stone-300 text-xs font-bold text-stone-700 transition-colors cursor-pointer"
          >
            Refresh Pulse
          </button>
        </div>
      </div>

      {/* Budget Boundary Alerts if any */}
      {summary.budget_alerts && summary.budget_alerts.length > 0 && (
        <div className="space-y-2">
          {summary.budget_alerts.map((alert, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border flex items-start gap-3 ${
                alert.is_exceeded
                  ? 'bg-rose-50 border-rose-200 text-rose-900'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}
            >
              <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${alert.is_exceeded ? 'text-rose-600' : 'text-amber-600'}`} />
              <div className="flex-1">
                <span className="font-bold text-sm block">
                  {alert.category ? `${alert.category} Budget Alert` : 'Overall Spending Alert'}
                </span>
                <span className="text-xs">
                  {alert.message || `Spent ₹${alert.spent.toLocaleString()} of ₹${alert.limit.toLocaleString()} (${alert.percentage_used}%)`}
                </span>
              </div>
              <NavLink
                to="/spend"
                className="text-xs font-bold underline shrink-0 mt-0.5"
              >
                Review Spends
              </NavLink>
            </div>
          ))}
        </div>
      )}

      {/* 2. Top Metric Cards (4 Grid) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Liquid Net Balance */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border-2 border-stone-200 shadow-sm hover:border-stone-400 transition-colors">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">{t.netBalanceCard}</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-emerald-700 block">
            ₹{(summary.net_balance || 0).toLocaleString()}
          </span>
          <span className="text-xs text-emerald-700 font-bold mt-1 block">{t.netBalanceSub}</span>
        </div>

        {/* Total Inflow */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border-2 border-stone-200 shadow-sm hover:border-stone-400 transition-colors">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">{t.inflowCard}</span>
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-stone-900 block">
            ₹{(summary.total_income || 0).toLocaleString()}
          </span>
          <span className="text-xs text-stone-500 font-medium mt-1 block">{t.inflowSub}</span>
        </div>

        {/* Total Spent */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border-2 border-stone-200 shadow-sm hover:border-stone-400 transition-colors">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">{t.spentCard}</span>
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-stone-900 block">
            ₹{(summary.total_expenses || 0).toLocaleString()}
          </span>
          <span className="text-xs text-rose-600 font-bold mt-1 block">{t.spentSub}</span>
        </div>

        {/* Locked Goal Deposits */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border-2 border-stone-200 shadow-sm hover:border-stone-400 transition-colors">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">{t.savedCard}</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-amber-700 block">
            ₹{(summary.total_goal_deposits || 0).toLocaleString()}
          </span>
          <span className="text-xs text-amber-700 font-bold mt-1 block">
            {summary.savings_rate_pct || 0}% Savings Rate
          </span>
        </div>
      </div>

      {/* 3. Monthly Pulse Bar Chart */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-stone-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-stone-700" />
              </div>
              <h2 className="text-xl font-black text-stone-900">{t.chartTitle}</h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-500 font-medium mt-1">{t.chartSub}</p>
          </div>
          <div className="flex items-center gap-3 text-xs font-bold">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-500"></span> Income</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-stone-900"></span> Expense</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> Net Savings</span>
          </div>
        </div>

        {/* Bar Graph Visual Container */}
        <div className="h-56 w-full flex items-end justify-around gap-3 sm:gap-6 pt-8 pb-3 border-b border-stone-100">
          {trends.map((d, i) => {
            const expHeight = d.expenses > 0 ? Math.min(100, Math.max(8, (d.expenses / maxExpense) * 100)) : 0;
            const incHeight = d.income > 0 ? Math.min(100, Math.max(8, (d.income / maxExpense) * 100)) : 0;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <div className="flex items-end gap-1 sm:gap-2 h-full justify-center w-full max-w-[80px]">
                  {/* Income bar */}
                  <div
                    className={`w-1/2 rounded-t-lg transition-all ${
                      d.income > 0
                        ? 'bg-blue-400 group-hover:bg-blue-500'
                        : 'bg-stone-100'
                    }`}
                    style={{ height: d.income > 0 ? `${incHeight}%` : '4px' }}
                    title={`Income: ₹${d.income}`}
                  />
                  {/* Expense bar */}
                  <div
                    className={`w-1/2 rounded-t-lg transition-all ${
                      d.expenses > 0
                        ? 'bg-stone-900 group-hover:bg-stone-700'
                        : 'bg-stone-100'
                    }`}
                    style={{ height: d.expenses > 0 ? `${expHeight}%` : '4px' }}
                    title={`Expenses: ₹${d.expenses}`}
                  />
                </div>
                <span className="text-xs sm:text-sm font-bold text-stone-600 mt-1">{d.month}</span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between text-xs sm:text-sm text-stone-500 font-medium mt-4 pt-1">
          <span>Net Savings Rate: <strong className="text-stone-900 font-black">{summary.savings_rate_pct || 0}%</strong></span>
          <span className="text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
            Smart Cashflow Active ✓
          </span>
        </div>
      </div>

      {/* 4. Two Columns: Category Allocation & Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Category Breakdown */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border-2 border-stone-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center">
                <PieChart className="w-4 h-4 text-stone-700" />
              </div>
              <h3 className="text-lg font-black text-stone-900">{t.breakdownTitle}</h3>
            </div>
            <p className="text-xs text-stone-500 font-medium mb-5">{t.breakdownSub}</p>

            {summary.category_breakdown && summary.category_breakdown.length > 0 ? (
              <div className="space-y-4">
                {summary.category_breakdown.map((cat, idx) => {
                  const colors = ['bg-amber-500', 'bg-blue-500', 'bg-rose-500', 'bg-emerald-500', 'bg-purple-500'];
                  const color = colors[idx % colors.length];
                  return (
                    <div key={idx}>
                      <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-stone-800 mb-1.5">
                        <span>{cat.category}</span>
                        <span>₹{Number(cat.amount).toLocaleString()} ({cat.percentage}%)</span>
                      </div>
                      <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${color}`}
                          style={{ width: `${Math.min(100, cat.percentage)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-center text-stone-400 text-sm">
                No expense transactions logged yet this month.
              </div>
            )}
          </div>

          <div className="pt-6 mt-6 border-t border-stone-100 flex items-center justify-between">
            <span className="text-xs text-stone-500 font-semibold">Want to record new spend?</span>
            <NavLink
              to="/spend"
              className="text-xs font-bold text-stone-900 hover:text-amber-600 flex items-center gap-1 group"
            >
              <span>Add Transaction</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </NavLink>
          </div>
        </div>

        {/* Quick Action Navigation Tiles */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border-2 border-stone-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-amber-500" />
              </div>
              <h3 className="text-lg font-black text-stone-900">Copilot Quick Actions</h3>
            </div>
            <p className="text-xs text-stone-500 font-medium mb-5">Access all 6 core features directly.</p>

            <div className="grid grid-cols-2 gap-3">
              <NavLink
                to="/shield"
                className="p-3.5 rounded-2xl bg-stone-50 hover:bg-amber-50 border border-stone-200 hover:border-amber-300 transition-all text-left flex flex-col justify-between group"
              >
                <ShieldCheck className="w-6 h-6 text-emerald-600 mb-2" />
                <div>
                  <span className="block text-xs font-black text-stone-900 group-hover:text-amber-900">Scam Shield</span>
                  <span className="text-[11px] text-stone-500">Scan suspicious SMS / UPI</span>
                </div>
              </NavLink>

              <NavLink
                to="/goals"
                className="p-3.5 rounded-2xl bg-stone-50 hover:bg-amber-50 border border-stone-200 hover:border-amber-300 transition-all text-left flex flex-col justify-between group"
              >
                <Target className="w-6 h-6 text-blue-600 mb-2" />
                <div>
                  <span className="block text-xs font-black text-stone-900 group-hover:text-amber-900">Savings Goals</span>
                  <span className="text-[11px] text-stone-500">Lock money with Transfer</span>
                </div>
              </NavLink>

              <NavLink
                to="/save"
                className="p-3.5 rounded-2xl bg-stone-50 hover:bg-amber-50 border border-stone-200 hover:border-amber-300 transition-all text-left flex flex-col justify-between group"
              >
                <Coins className="w-6 h-6 text-amber-600 mb-2" />
                <div>
                  <span className="block text-xs font-black text-stone-900 group-hover:text-amber-900">Savings Tracker</span>
                  <span className="text-[11px] text-stone-500">General vs Goal split</span>
                </div>
              </NavLink>

              <NavLink
                to="/quiz"
                className="p-3.5 rounded-2xl bg-stone-50 hover:bg-amber-50 border border-stone-200 hover:border-amber-300 transition-all text-left flex flex-col justify-between group"
              >
                <HelpCircle className="w-6 h-6 text-purple-600 mb-2" />
                <div>
                  <span className="block text-xs font-black text-stone-900 group-hover:text-amber-900">Daily Quiz</span>
                  <span className="text-[11px] text-stone-500">Boost financial streak</span>
                </div>
              </NavLink>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span>Powered by FastAPI Backend & Gemini AI</span>
            <span className="text-emerald-700 font-bold">API Connected ✓</span>
          </div>
        </div>

      </div>

    </div>
  );
}
