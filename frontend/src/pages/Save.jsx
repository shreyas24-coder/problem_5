import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Coins,
  Laptop,
  Repeat,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Target,
  Wallet,
  Lock,
  RefreshCcw,
  Check,
  Flame
} from 'lucide-react';
import { savingsApi, transactionsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function SavePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tracker, setTracker] = useState({
    net_accumulated_balance: 0,
    general_available_savings: 0,
    locked_goal_savings: 0,
    total_goal_deposits: 0,
    expected_monthly_savings: 0,
    actual_monthly_savings: 0,
    savings_rate_percentage: 0,
    savings_variance: 0,
    is_on_track: true,
    active_goals_count: 0,
    completed_goals_count: 0
  });

  // Real recurring expenses/bills fetched from database
  const [recurringBills, setRecurringBills] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [trackerData, txnsData] = await Promise.all([
        savingsApi.getTracker(),
        transactionsApi.getAll({ limit: 50 }).catch(() => [])
      ]);

      setTracker({
        net_accumulated_balance: Number(trackerData.net_accumulated_balance || trackerData.net_balance) || 0,
        general_available_savings: Number(trackerData.general_available_savings) || 0,
        locked_goal_savings: Number(trackerData.locked_goal_savings) || 0,
        total_goal_deposits: Number(trackerData.total_goal_deposits) || 0,
        expected_monthly_savings: Number(trackerData.expected_monthly_savings) || Number(user?.expected_monthly_savings) || 0,
        actual_monthly_savings: Number(trackerData.actual_monthly_savings) || 0,
        savings_rate_percentage: Number(trackerData.savings_rate_percentage) || 0,
        savings_variance: Number(trackerData.savings_variance) || 0,
        is_on_track: Boolean(trackerData.is_on_track),
        active_goals_count: Number(trackerData.active_goals_count) || 0,
        completed_goals_count: Number(trackerData.completed_goals_count) || 0
      });

      // Filter real recurring/bill transactions from database
      const bills = (txnsData || []).filter(t => 
        (t.type === 'EXPENSE' || t.type === 'expense') &&
        (t.category === 'Bills & Utilities' || t.payment_method === 'AutoPay' || (t.description && /sub|bill|recharge|netflix|spotify|wifi/i.test(t.description)))
      );
      setRecurringBills(bills);
      setError(null);
    } catch (err) {
      console.error('Error fetching savings tracker:', err);
      setError(err.message || 'Failed to load savings tracker from database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const targetSavings = tracker.expected_monthly_savings || 0;
  const actualSavings = tracker.actual_monthly_savings || 0;
  const progressPercent = targetSavings > 0 
    ? Math.min(100, Math.max(0, Math.round((actualSavings / targetSavings) * 100))) 
    : (actualSavings > 0 ? 100 : 0);

  return (
    <div className="w-full space-y-8 animate-fade-in text-left">
      
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-full text-xs font-black uppercase tracking-wider">
              Feature 3 • Database Driven
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-stone-900 tracking-tight mt-1.5">
            Savings Tracker & Lockbox Split
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-medium mt-1">
            Real-time savings split fetched from your database: General Available Savings vs Locked Goal Savings.
          </p>
        </div>

        <button
          onClick={fetchData}
          className="flex items-center gap-2 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-2xl border border-stone-300 text-xs font-bold transition-all cursor-pointer self-start sm:self-auto"
        >
          <RefreshCcw className="w-3.5 h-3.5" />
          <span>Refresh Database</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)}><XCircle className="w-4 h-4" /></button>
        </div>
      )}

      {/* 2. THE CORE ARCHITECTURAL SPLIT: General Available vs Locked Goal Savings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* General Available Savings */}
        <div className="bg-white p-6 rounded-3xl border-2 border-stone-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              General Available Savings
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <span className="text-3xl font-black text-emerald-700 block">
            ₹{tracker.general_available_savings.toLocaleString()}
          </span>
          <p className="text-xs text-stone-500 mt-2 font-medium">
            Unallocated liquid cash from your transactions. Ready for daily spend or transferring to goals.
          </p>
          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
            <span className="text-emerald-700 font-bold">● Unlocked & Liquid</span>
            <NavLink to="/spend" className="font-bold text-stone-700 hover:text-stone-900 underline">
              View Spends
            </NavLink>
          </div>
        </div>

        {/* Locked Goal Savings */}
        <div className="bg-white p-6 rounded-3xl border-2 border-stone-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Locked Goal Savings
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Lock className="w-4 h-4 text-amber-700" />
            </div>
          </div>
          <span className="text-3xl font-black text-amber-700 block">
            ₹{tracker.locked_goal_savings.toLocaleString()}
          </span>
          <p className="text-xs text-stone-500 mt-2 font-medium">
            Accumulated across {tracker.active_goals_count} active purchase goal lockboxes in database.
          </p>
          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
            <span className="text-amber-800 font-bold">● Protected Lockboxes</span>
            <NavLink to="/goals" className="font-bold text-stone-700 hover:text-stone-900 underline">
              Manage Goals ({tracker.active_goals_count})
            </NavLink>
          </div>
        </div>

        {/* Total Net Combined Pool */}
        <div className="bg-stone-900 text-white p-6 rounded-3xl border-2 border-stone-800 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Combined Savings Pool
              </span>
              <div className="w-8 h-8 rounded-xl bg-stone-800 text-amber-400 flex items-center justify-center">
                <Coins className="w-4 h-4" />
              </div>
            </div>
            <span className="text-3xl font-black text-white block">
              ₹{(tracker.general_available_savings + tracker.locked_goal_savings).toLocaleString()}
            </span>
            <span className="text-xs text-amber-300 font-bold mt-1 block">
              {tracker.savings_rate_percentage}% Monthly Savings Rate
            </span>
          </div>
          <div className="pt-4 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
            <span>Completed Goals: {tracker.completed_goals_count}</span>
            <span className="text-emerald-400 font-bold">Database Synchronized ✓</span>
          </div>
        </div>

      </div>

      {/* 3. Planned vs Actual Monthly Target Gauge */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-stone-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <span className="text-xs font-black text-stone-400 uppercase tracking-wider block">
              Monthly Cadence (Database)
            </span>
            <h2 className="text-xl font-black text-stone-900 mt-0.5">
              Planned vs Actual Savings Target
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Your expected monthly savings target is ₹{targetSavings.toLocaleString()} (from your profile).
            </p>
          </div>

          <div className="flex items-center gap-2">
            {tracker.is_on_track ? (
              <span className="px-3.5 py-1.5 bg-emerald-100 text-emerald-800 rounded-xl font-bold text-xs flex items-center gap-1.5 border border-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>On Track to Monthly Target</span>
              </span>
            ) : (
              <span className="px-3.5 py-1.5 bg-amber-100 text-amber-800 rounded-xl font-bold text-xs flex items-center gap-1.5 border border-amber-300">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>₹{Math.abs(tracker.savings_variance).toLocaleString()} Behind Target</span>
              </span>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-stone-700">
            <span>Actual Net Savings This Month: ₹{actualSavings.toLocaleString()}</span>
            <span>Target: ₹{targetSavings.toLocaleString()} ({progressPercent}%)</span>
          </div>
          <div className="w-full h-4 bg-stone-100 rounded-full overflow-hidden p-0.5 border border-stone-200">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                progressPercent >= 100
                  ? 'bg-emerald-500'
                  : progressPercent >= 50
                  ? 'bg-amber-500'
                  : 'bg-stone-900'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-stone-100 text-xs">
          <div className="p-3 bg-stone-50 rounded-2xl">
            <span className="text-stone-400 font-bold block">Actual Monthly Savings</span>
            <span className="text-sm font-black text-stone-900 mt-0.5 block">
              ₹{actualSavings.toLocaleString()}
            </span>
          </div>
          <div className="p-3 bg-stone-50 rounded-2xl">
            <span className="text-stone-400 font-bold block">Profile Target</span>
            <span className="text-sm font-black text-stone-900 mt-0.5 block">
              ₹{targetSavings.toLocaleString()}
            </span>
          </div>
          <div className="p-3 bg-stone-50 rounded-2xl">
            <span className="text-stone-400 font-bold block">Variance</span>
            <span className={`text-sm font-black mt-0.5 block ${tracker.savings_variance >= 0 ? 'text-emerald-700' : 'text-amber-700'}`}>
              {tracker.savings_variance >= 0 ? '+' : ''}₹{tracker.savings_variance.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Real Recurring Bills & Subscriptions Logged in Database */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-stone-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <Repeat className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-black text-stone-900">
                Logged Recurring Bills & Subscriptions
              </h3>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Detected from your logged transactions in the database (Bills & Utilities / AutoPay).
            </p>
          </div>

          <NavLink
            to="/spend"
            className="text-xs font-bold px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl transition-all self-start sm:self-auto"
          >
            + Log New Bill
          </NavLink>
        </div>

        {recurringBills.length > 0 ? (
          <div className="space-y-3">
            {recurringBills.map((b) => (
              <div
                key={b.id}
                className="p-4 rounded-2xl border border-stone-200 hover:border-stone-400 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-stone-900">{b.description || 'Subscription'}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-100 text-stone-700">
                      {b.category}
                    </span>
                  </div>
                  <span className="text-xs text-stone-400 block mt-0.5">
                    Logged on {b.date} • Method: {b.payment_method || 'UPI'}
                  </span>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-auto">
                  <span className="text-sm font-black text-rose-600">
                    -₹{Number(b.amount).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-200 text-xs text-stone-500">
            No recurring utility bills or subscriptions found in your transaction logs.
            <NavLink to="/spend" className="block text-stone-900 font-bold underline mt-1">
              Log an expense under &apos;Bills & Utilities&apos; to track it here.
            </NavLink>
          </div>
        )}
      </div>

    </div>
  );
}
