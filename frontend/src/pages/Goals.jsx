import React, { useState, useEffect } from 'react';
import {
  Target,
  Plus,
  Calendar,
  Laptop,
  Plane,
  Headphones,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Clock,
  Trash2,
  X,
  Coins,
  ArrowRight,
  ArrowDownLeft,
  ArrowUpRight,
  Wallet,
  Lock,
  AlertCircle,
  RefreshCcw
} from 'lucide-react';
import { goalsApi, savingsApi } from '../services/api';

export default function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availableSavings, setAvailableSavings] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [transferModal, setTransferModal] = useState({
    isOpen: false,
    goal: null,
    type: 'deposit', // 'deposit' | 'withdraw'
    amount: ''
  });

  // New Goal Form
  const [newTitle, setNewTitle] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [newCategory, setNewCategory] = useState('Specific Purchase');
  const [newDescription, setNewDescription] = useState('');
  const [newDeadline, setNewDeadline] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [goalsData, savingsData] = await Promise.all([
        goalsApi.getAll(),
        savingsApi.getTracker().catch(() => ({ general_available_savings: 0 }))
      ]);
      setGoals(goalsData || []);
      setAvailableSavings(savingsData.general_available_savings || savingsData.net_balance || 0);
      setErrorMsg('');
    } catch (err) {
      console.error('Error loading goals:', err);
      setErrorMsg(err.message || 'Failed to load goals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddGoal = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newTarget || Number(newTarget) <= 0) return;

    try {
      await goalsApi.create({
        title: newTitle.trim(),
        description: newDescription.trim() || undefined,
        category: newCategory,
        target_amount: Number(newTarget),
        target_date: newDeadline || undefined
      });

      await loadData();
      setIsAddModalOpen(false);
      setNewTitle('');
      setNewTarget('');
      setNewDescription('');
      setNewDeadline('');
      setSuccessMsg('Goal created successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to create goal');
    }
  };

  const handleDeleteGoal = async (id) => {
    if (!window.confirm('Are you sure you want to delete this goal? Any locked funds will be returned to your wallet.')) return;
    try {
      await goalsApi.delete(id);
      await loadData();
      setSuccessMsg('Goal deleted.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to delete goal');
    }
  };

  // Execute Wallet-Transfer: Deposit or Withdraw
  const handleExecuteTransfer = async (e) => {
    e.preventDefault();
    const { goal, type, amount } = transferModal;
    const numAmount = Number(amount);

    if (!goal || !numAmount || numAmount <= 0) return;

    try {
      if (type === 'deposit') {
        if (numAmount > availableSavings) {
          setErrorMsg(`Insufficient General Available Savings. You only have ₹${availableSavings.toLocaleString()} available to lock.`);
          return;
        }
        await goalsApi.deposit(goal.id, numAmount);
        setSuccessMsg(`Locked ₹${numAmount.toLocaleString()} into "${goal.title}"! Deducted from available savings.`);
      } else {
        if (numAmount > goal.current_amount) {
          setErrorMsg(`Cannot withdraw more than current locked amount of ₹${goal.current_amount.toLocaleString()}.`);
          return;
        }
        await goalsApi.withdraw(goal.id, numAmount);
        setSuccessMsg(`Withdrew ₹${numAmount.toLocaleString()} back to General Available Savings.`);
      }

      setTransferModal({ isOpen: false, goal: null, type: 'deposit', amount: '' });
      await loadData();
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err) {
      setErrorMsg(err.message || `Wallet-transfer failed`);
    }
  };

  return (
    <div className="w-full space-y-8 animate-fade-in text-left">
      
      {/* 1. Header Banner & Current Available Savings */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-full text-xs font-black uppercase tracking-wider">
              Feature 5 • Wallet-Transfer Mechanic
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-stone-900 tracking-tight mt-1.5">
            Personal Financial Goals
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-medium mt-1">
            Lock savings into dedicated purchase lockboxes. Funds are strictly deducted from your available balance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-2xl text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Create New Goal</span>
          </button>
        </div>
      </div>

      {/* Wallet Balance Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-emerald-50 border-2 border-emerald-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              General Available Savings (Ready to Lock)
            </span>
            <span className="text-xl sm:text-2xl font-black text-emerald-950 block">
              ₹{availableSavings.toLocaleString()}
            </span>
          </div>
        </div>
        <div className="text-xs text-emerald-800 sm:text-right">
          <span>Deposits to goals instantly subtract from this pool.</span>
        </div>
      </div>

      {/* Notifications */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center justify-between">
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg('')}><X className="w-4 h-4" /></button>
        </div>
      )}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg('')}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* 2. Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => {
          const current = Number(goal.current_amount || 0);
          const target = Number(goal.target_amount || 1);
          const percent = Math.min(100, Math.round((current / target) * 100));
          const remaining = Math.max(0, target - current);
          const isDone = percent >= 100;

          return (
            <div
              key={goal.id}
              className="bg-white rounded-3xl border-2 border-stone-200 hover:border-stone-400 p-6 shadow-sm transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-stone-100 text-stone-600 uppercase tracking-wider">
                      {goal.category || 'Purchase Goal'}
                    </span>
                    <h3 className="text-lg font-black text-stone-900 mt-1.5 leading-snug">
                      {goal.title}
                    </h3>
                    {goal.description && (
                      <p className="text-xs text-stone-500 mt-0.5">{goal.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteGoal(goal.id)}
                    className="text-stone-300 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                    title="Delete Goal"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Amount Numbers */}
                <div className="mt-4 mb-2 flex items-baseline justify-between">
                  <div>
                    <span className="text-2xl font-black text-stone-900">
                      ₹{current.toLocaleString()}
                    </span>
                    <span className="text-xs text-stone-400 font-bold ml-1.5">
                      / ₹{target.toLocaleString()}
                    </span>
                  </div>
                  <span className={`text-xs font-black px-2 py-0.5 rounded-lg ${
                    isDone ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                  }`}>
                    {percent}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden p-0.5 border border-stone-200">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isDone ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="mt-2 text-xs text-stone-400 flex items-center justify-between">
                  <span>{isDone ? 'Goal Achieved 🎉' : `₹${remaining.toLocaleString()} remaining`}</span>
                  {goal.target_date && <span>Target: {goal.target_date}</span>}
                </div>
              </div>

              {/* Wallet-Transfer Action Buttons */}
              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTransferModal({ isOpen: true, goal, type: 'deposit', amount: '' })}
                  className="flex-1 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
                >
                  <ArrowDownLeft className="w-3.5 h-3.5 text-amber-400" />
                  <span>Lock Money</span>
                </button>

                {current > 0 && (
                  <button
                    type="button"
                    onClick={() => setTransferModal({ isOpen: true, goal, type: 'withdraw', amount: '' })}
                    className="py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer"
                    title="Unlock money back to wallet"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>Withdraw</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {goals.length === 0 && !loading && (
          <div className="col-span-full py-12 text-center bg-white rounded-3xl border-2 border-dashed border-stone-300">
            <Target className="w-12 h-12 text-stone-300 mx-auto mb-2" />
            <h3 className="text-base font-bold text-stone-800">No Goals Created Yet</h3>
            <p className="text-xs text-stone-500 mt-1 mb-4">
              Create a goal to lock unspent savings away for a laptop, trip, or emergency cushion.
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold"
            >
              + Create First Goal
            </button>
          </div>
        )}
      </div>

      {/* MODAL: Wallet-Transfer (Deposit / Withdraw) */}
      {transferModal.isOpen && transferModal.goal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-7 shadow-2xl border-2 border-stone-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  transferModal.type === 'deposit' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  <Coins className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-black text-stone-900">
                  {transferModal.type === 'deposit' ? 'Lock Funds into Goal' : 'Withdraw Funds to Wallet'}
                </h3>
              </div>
              <button
                onClick={() => setTransferModal({ isOpen: false, goal: null, type: 'deposit', amount: '' })}
                className="text-stone-400 hover:text-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-stone-500 mb-4">
              Goal: <strong className="text-stone-800">{transferModal.goal.title}</strong>
              {transferModal.type === 'deposit' ? (
                <span> • Available to Lock: <strong className="text-emerald-700">₹{availableSavings.toLocaleString()}</strong></span>
              ) : (
                <span> • Currently Locked: <strong className="text-amber-800">₹{transferModal.goal.current_amount.toLocaleString()}</strong></span>
              )}
            </p>

            <form onSubmit={handleExecuteTransfer} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
                  Amount to {transferModal.type === 'deposit' ? 'Lock (₹)' : 'Withdraw (₹)'}
                </label>
                <input
                  type="number"
                  min="1"
                  step="100"
                  value={transferModal.amount}
                  onChange={(e) => setTransferModal({ ...transferModal, amount: e.target.value })}
                  placeholder="e.g. 5000"
                  className="w-full h-12 bg-stone-50 border border-stone-300 rounded-xl px-4 text-lg font-bold text-stone-900 focus:bg-white focus:border-stone-900 outline-none"
                  required
                  autoFocus
                />
              </div>

              {/* Quick Amount Chips */}
              <div className="flex items-center gap-2">
                {[1000, 2000, 5000, 10000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setTransferModal({ ...transferModal, amount: String(amt) })}
                    className="flex-1 py-1.5 bg-stone-100 hover:bg-stone-200 rounded-lg text-xs font-bold text-stone-700"
                  >
                    +₹{amt}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                className={`w-full h-12 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                  transferModal.type === 'deposit'
                    ? 'bg-stone-900 hover:bg-stone-800'
                    : 'bg-emerald-700 hover:bg-emerald-800'
                }`}
              >
                <span>{transferModal.type === 'deposit' ? 'Confirm Wallet Lock' : 'Confirm Return to Wallet'}</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Create New Goal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-7 shadow-2xl border-2 border-stone-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-black text-stone-900">Create Financial Goal</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-stone-400 hover:text-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddGoal} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-stone-600 mb-1">Goal Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. MacBook Pro M3 or Goa Roadtrip"
                  className="w-full h-11 bg-stone-50 border border-stone-300 rounded-xl px-4 text-sm font-bold text-stone-900 focus:bg-white focus:border-stone-900 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-stone-600 mb-1">Target Amount (₹)</label>
                <input
                  type="number"
                  min="100"
                  value={newTarget}
                  onChange={(e) => setNewTarget(e.target.value)}
                  placeholder="e.g. 85000"
                  className="w-full h-11 bg-stone-50 border border-stone-300 rounded-xl px-4 text-sm font-bold text-stone-900 focus:bg-white focus:border-stone-900 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-stone-600 mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full h-11 bg-stone-50 border border-stone-300 rounded-xl px-4 text-sm font-bold text-stone-900 focus:bg-white focus:border-stone-900 outline-none"
                >
                  <option value="Specific Purchase">Specific Purchase (Laptop, Phone, Gear)</option>
                  <option value="Emergency">Emergency Buffer (3-6 mo living costs)</option>
                  <option value="Milestone">Milestone (Trip, Course, Moving)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-stone-600 mb-1">Description (Optional)</label>
                <input
                  type="text"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="e.g. For college projects and coding hackathons"
                  className="w-full h-11 bg-stone-50 border border-stone-300 rounded-xl px-4 text-sm text-stone-900 focus:bg-white focus:border-stone-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-stone-600 mb-1">Target Deadline</label>
                <input
                  type="date"
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                  className="w-full h-11 bg-stone-50 border border-stone-300 rounded-xl px-4 text-sm font-bold text-stone-900 focus:bg-white focus:border-stone-900 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full h-12 bg-stone-900 hover:bg-stone-800 rounded-xl text-white font-bold text-sm shadow-md mt-2 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Create Lockbox</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
