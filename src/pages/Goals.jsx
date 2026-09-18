import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
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
  Coins
} from 'lucide-react';

export default function GoalsPage() {
  const { lang } = useOutletContext() || { lang: 'en' };

  // Goals initial state
  const [goals, setGoals] = useState([
    {
      id: 1,
      title: "M2 Coding Laptop",
      targetAmount: 65000,
      savedAmount: 38400,
      deadline: "2026-12-15",
      deadlineLabel: "15 Dec 2026",
      category: "Tech",
      icon: "💻"
    },
    {
      id: 2,
      title: "Goa College Roadtrip",
      targetAmount: 12000,
      savedAmount: 8500,
      deadline: "2026-11-10",
      deadlineLabel: "10 Nov 2026",
      category: "Travel",
      icon: "🏖️"
    },
    {
      id: 3,
      title: "Sony Noise-Canceling Headphones",
      targetAmount: 18000,
      savedAmount: 6200,
      deadline: "2027-02-28",
      deadlineLabel: "28 Feb 2027",
      category: "Audio",
      icon: "🎧"
    }
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [newSaved, setNewSaved] = useState('');
  const [newDeadline, setNewDeadline] = useState('');
  const [newEmoji, setNewEmoji] = useState('🎯');

  // Quick Deposit function
  const handleDeposit = (id, amount) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          const updated = Math.min(g.targetAmount, g.savedAmount + amount);
          return { ...g, savedAmount: updated };
        }
        return g;
      })
    );
  };

  // Add Goal Form Submission
  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newTarget) return;

    const newGoalObj = {
      id: Date.now(),
      title: newTitle,
      targetAmount: Number(newTarget),
      savedAmount: Number(newSaved) || 0,
      deadline: newDeadline || '2027-01-01',
      deadlineLabel: newDeadline ? new Date(newDeadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Future Target',
      category: 'Personal',
      icon: newEmoji || '🎯'
    };

    setGoals([newGoalObj, ...goals]);
    setIsAddModalOpen(false);
    setNewTitle('');
    setNewTarget('');
    setNewSaved('');
    setNewDeadline('');
  };

  const handleDeleteGoal = (id) => {
    setGoals(goals.filter((g) => g.id !== id));
  };

  // Aggregated Stats
  const totalTarget = goals.reduce((acc, g) => acc + g.targetAmount, 0);
  const totalSaved = goals.reduce((acc, g) => acc + g.savedAmount, 0);
  const totalPercent = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

  const t = {
    en: {
      badge: "Future Buys Planner",
      headline: "Personal Savings Goals",
      subheadline: "Track and fund your dream gadgets, trips, and major buys with clear deadlines—no EMI traps.",
      newGoalBtn: "Add New Goal",
      totalTargetLabel: "Combined Targets",
      totalSavedLabel: "Total Saved So Far",
      overallProgress: "Overall Goal Progress",
      deadlineHeader: "Target Deadline",
      daysLeft: "days to deadline",
      completedBadge: "Goal Achieved! 🎉",
      addDeposit: "+ Deposit",
      modalTitle: "Create a Future Savings Goal",
      modalSub: "Specify what you're buying, how much you need, and your target date.",
      titleLabel: "What are you buying?",
      titlePlaceholder: "e.g. iPad Air for College Notes",
      targetLabel: "Target Price (₹)",
      targetPlaceholder: "45000",
      savedLabel: "Initial Deposit (₹)",
      savedPlaceholder: "5000",
      deadlineLabelText: "Target Deadline Date",
      submitGoal: "Save Goal & Start Tracking"
    },
    hi: {
      badge: "भविष्य की खरीदारी योजना",
      headline: "व्यक्तिगत बचत लक्ष्य (Goals)",
      subheadline: "बिना किसी EMI या लोन के अपने पसंदीदा गैजेट्स, यात्रा और सपनों की खरीदारी के लिए समयबद्ध बचत करें।",
      newGoalBtn: "नया लक्ष्य जोड़ें",
      totalTargetLabel: "कुल लक्ष्य राशि",
      totalSavedLabel: "अब तक की कुल बचत",
      overallProgress: "समग्र बचत प्रगति",
      deadlineHeader: "अंतिम तिथि (Deadline)",
      daysLeft: "दिन शेष",
      completedBadge: "लक्ष्य पूरा हुआ! 🎉",
      addDeposit: "+ पैसे जोड़ें",
      modalTitle: "नया बचत लक्ष्य निर्धारित करें",
      modalSub: "आप क्या खरीदना चाहते हैं, कितनी राशि चाहिए और किस तारीख तक चाहिए।",
      titleLabel: "आप क्या खरीदना चाहते हैं?",
      titlePlaceholder: "उदा. कॉलेज नोट्स के लिए iPad Air",
      targetLabel: "कुल लक्ष्य राशि (₹)",
      targetPlaceholder: "45000",
      savedLabel: "प्रारंभिक बचत (₹)",
      savedPlaceholder: "5000",
      deadlineLabelText: "लक्ष्य की अंतिम तिथि",
      submitGoal: "लक्ष्य सेव करें"
    }
  };

  const text = t[lang] || t.en;

  return (
    <div className="flex flex-col animate-fade-in text-left space-y-6">
      
      {/* 1. Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-stone-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>{text.badge}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            {text.headline}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 font-medium mt-0.5">
            {text.subheadline}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="min-h-[48px] px-5 py-2.5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-[0.98] self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>{text.newGoalBtn}</span>
        </button>
      </div>

      {/* 2. Overview Banner */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border-2 border-stone-300 shadow-sm">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
          <div>
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">{text.totalSavedLabel}</span>
            <span className="text-xl sm:text-2xl font-black text-emerald-700">₹{totalSaved.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">{text.totalTargetLabel}</span>
            <span className="text-xl sm:text-2xl font-black text-stone-900">₹{totalTarget.toLocaleString()}</span>
          </div>
          <div className="col-span-2 sm:col-span-1 border-t sm:border-t-0 sm:border-l border-stone-100 pt-2 sm:pt-0 sm:pl-4">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">{text.overallProgress}</span>
            <span className="text-xl sm:text-2xl font-black text-amber-700">{totalPercent}% Complete</span>
          </div>
        </div>

        <div className="w-full h-3.5 bg-stone-100 rounded-full overflow-hidden p-0.5 border border-stone-200">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, totalPercent)}%` }}
          />
        </div>
      </div>

      {/* 3. Goals List */}
      <div className="space-y-4">
        {goals.map((goal) => {
          const percent = Math.min(100, Math.round((goal.savedAmount / goal.targetAmount) * 100));
          const remaining = Math.max(0, goal.targetAmount - goal.savedAmount);
          const isDone = goal.savedAmount >= goal.targetAmount;

          // Days left calculation
          const today = new Date();
          const targetDate = new Date(goal.deadline);
          const diffDays = Math.max(0, Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24)));

          return (
            <div
              key={goal.id}
              className="bg-white p-5 sm:p-6 rounded-3xl border-2 border-stone-200 hover:border-stone-300 shadow-sm transition-all text-left"
            >
              {/* Card Top */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center text-2xl shrink-0 border border-stone-200">
                    {goal.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base sm:text-lg font-black text-stone-900 truncate">
                        {goal.title}
                      </h3>
                      {isDone && (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                          Completed
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-stone-500 font-medium mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-stone-400" />
                      <span>{text.deadlineHeader}: <strong className="text-stone-700">{goal.deadlineLabel}</strong></span>
                      <span>•</span>
                      <span className="text-amber-700 font-bold">{diffDays} {text.daysLeft}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteGoal(goal.id)}
                  title="Remove Goal"
                  className="w-8 h-8 rounded-lg text-stone-300 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Progress & Numbers */}
              <div className="my-3">
                <div className="flex items-center justify-between text-xs font-bold text-stone-700 mb-1.5">
                  <span className="text-emerald-700 text-sm font-black">₹{goal.savedAmount.toLocaleString()}</span>
                  <span className="text-stone-500">Target: ₹{goal.targetAmount.toLocaleString()}</span>
                </div>
                <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden border border-stone-200">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isDone ? 'bg-emerald-500' : 'bg-gradient-to-r from-amber-500 to-emerald-500'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] font-semibold text-stone-500 mt-1.5">
                  <span>{percent}% Saved</span>
                  <span>{isDone ? text.completedBadge : `₹${remaining.toLocaleString()} left to fund`}</span>
                </div>
              </div>

              {/* Quick Contribution Buttons */}
              <div className="mt-4 pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs text-stone-500 font-medium">Quick Deposit:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleDeposit(goal.id, 500)}
                    disabled={isDone}
                    className="min-h-[38px] px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors cursor-pointer disabled:opacity-40"
                  >
                    + ₹500
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeposit(goal.id, 1000)}
                    disabled={isDone}
                    className="min-h-[38px] px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors cursor-pointer disabled:opacity-40"
                  >
                    + ₹1,000
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeposit(goal.id, 2500)}
                    disabled={isDone}
                    className="min-h-[38px] px-3.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-colors cursor-pointer disabled:opacity-40 shadow-sm"
                  >
                    + ₹2,500
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* 4. Add Goal Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl border-2 border-stone-300 shadow-2xl p-6 sm:p-7 text-stone-900">
            
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-5 text-left">
              <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mb-3">
                <Target className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-black text-stone-900">{text.modalTitle}</h2>
              <p className="text-xs text-stone-600 mt-1">{text.modalSub}</p>
            </div>

            <form onSubmit={handleAddGoal} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  {text.titleLabel}
                </label>
                <div className="flex items-center gap-2">
                  <select
                    value={newEmoji}
                    onChange={(e) => setNewEmoji(e.target.value)}
                    className="min-h-[48px] px-3 bg-stone-50 border border-stone-300 rounded-xl text-lg outline-none"
                  >
                    <option value="💻">💻</option>
                    <option value="📱">📱</option>
                    <option value="🏖️">🏖️</option>
                    <option value="🎧">🎧</option>
                    <option value="📷">📷</option>
                    <option value="🛵">🛵</option>
                    <option value="🎓">🎓</option>
                    <option value="🎯">🎯</option>
                  </select>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder={text.titlePlaceholder}
                    className="flex-1 min-h-[48px] bg-stone-50 border border-stone-300 rounded-xl px-4 text-sm sm:text-base text-stone-900 focus:bg-white focus:border-stone-900 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    {text.targetLabel}
                  </label>
                  <input
                    type="number"
                    value={newTarget}
                    onChange={(e) => setNewTarget(e.target.value)}
                    placeholder={text.targetPlaceholder}
                    className="w-full min-h-[48px] bg-stone-50 border border-stone-300 rounded-xl px-3.5 text-sm sm:text-base text-stone-900 focus:bg-white focus:border-stone-900 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    {text.savedLabel}
                  </label>
                  <input
                    type="number"
                    value={newSaved}
                    onChange={(e) => setNewSaved(e.target.value)}
                    placeholder={text.savedPlaceholder}
                    className="w-full min-h-[48px] bg-stone-50 border border-stone-300 rounded-xl px-3.5 text-sm sm:text-base text-stone-900 focus:bg-white focus:border-stone-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  {text.deadlineLabelText}
                </label>
                <input
                  type="date"
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                  className="w-full min-h-[48px] bg-stone-50 border border-stone-300 rounded-xl px-3.5 text-sm sm:text-base text-stone-900 focus:bg-white focus:border-stone-900 outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full min-h-[50px] rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-base flex items-center justify-center gap-2 cursor-pointer shadow-md mt-4"
              >
                <span>{text.submitGoal}</span>
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
