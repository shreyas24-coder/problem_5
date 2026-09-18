import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Wallet,
  Calendar,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingDown,
  TrendingUp,
  Sparkles,
  Coffee,
  ShoppingBag,
  Train,
  CheckCircle2,
  ChevronRight,
  Info,
  Plus,
  Trash2,
  X,
  CreditCard,
  Layers,
  Clock,
  AlertCircle,
  PiggyBank
} from 'lucide-react';

export default function SpendPage() {
  const { user } = useOutletContext() || { user: null };

  const defaultTransactions = [
    {
      id: 1,
      title: "UI Design Client Advance",
      category: "Freelance Gig",
      date: "2026-09-18",
      dateLabel: "Today, 18 Sep",
      amount: 6500,
      type: "income",
      mode: "UPI (Razorpay)"
    },
    {
      id: 2,
      title: "Zepto Quick Delivery",
      category: "Food & Dining",
      date: "2026-09-18",
      dateLabel: "Today, 18 Sep",
      amount: 215,
      type: "expense",
      mode: "UPI (PhonePe)"
    },
    {
      id: 3,
      title: "Chai & Samosa Break",
      category: "Food & Dining",
      date: "2026-09-18",
      dateLabel: "Today, 18 Sep",
      amount: 45,
      type: "expense",
      mode: "UPI (GPay)"
    },
    {
      id: 4,
      title: "Monthly College Stipend",
      category: "Stipend",
      date: "2026-09-17",
      dateLabel: "Yesterday, 17 Sep",
      amount: 12000,
      type: "income",
      mode: "Bank NEFT"
    },
    {
      id: 5,
      title: "Swiggy Dinner with Roommates",
      category: "Food & Dining",
      date: "2026-09-17",
      dateLabel: "Yesterday, 17 Sep",
      amount: 380,
      type: "expense",
      mode: "UPI Auto-Split"
    },
    {
      id: 6,
      title: "Metro Smart Card Top-up",
      category: "Commute & Travel",
      date: "2026-09-17",
      dateLabel: "Yesterday, 17 Sep",
      amount: 200,
      type: "expense",
      mode: "NCMC Card"
    },
    {
      id: 7,
      title: "Cashback Reward",
      category: "Cashback & Refunds",
      date: "2026-09-16",
      dateLabel: "16 Sep 2026",
      amount: 75,
      type: "income",
      mode: "UPI (Cred)"
    },
    {
      id: 8,
      title: "Amazon Coding Cable & USB-C",
      category: "Shopping & Tech",
      date: "2026-09-16",
      dateLabel: "16 Sep 2026",
      amount: 499,
      type: "expense",
      mode: "UPI (AmazonPay)"
    }
  ];

  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem('kavach_transactions');
      return saved ? JSON.parse(saved) : defaultTransactions;
    } catch (e) {
      return defaultTransactions;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('kavach_transactions', JSON.stringify(transactions));
    } catch (e) {}
  }, [transactions]);

  const [filter, setFilter] = useState('all'); // 'all' | 'expense' | 'income'
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Add Transaction Form State
  const [formType, setFormType] = useState('expense'); // 'expense' | 'income'
  const [formTitle, setFormTitle] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formCategory, setFormCategory] = useState('Food & Dining');
  const [formDate, setFormDate] = useState('2026-09-18');
  const [formMode, setFormMode] = useState('UPI');

  const expenseCategories = [
    "Food & Dining",
    "Commute & Travel",
    "Shopping & Tech",
    "Bills & Utilities",
    "Education",
    "Social & Entertainment",
    "Other"
  ];

  const incomeCategories = [
    "Stipend",
    "Freelance Gig",
    "Salary",
    "Pocket Money",
    "Cashback & Refunds",
    "Investment Return",
    "Other Income"
  ];

  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (!formTitle.trim() || !formAmount || Number(formAmount) <= 0) return;

    const todayStr = "2026-09-18";
    let label = formDate;
    if (formDate === todayStr) {
      label = "Today, 18 Sep";
    } else if (formDate === "2026-09-17") {
      label = "Yesterday, 17 Sep";
    } else {
      label = new Date(formDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    }

    const newTx = {
      id: Date.now(),
      title: formTitle.trim(),
      category: formCategory,
      date: formDate,
      dateLabel: label,
      amount: Number(formAmount),
      type: formType,
      mode: formMode
    };

    setTransactions([newTx, ...transactions]);
    setIsModalOpen(false);
    setFormTitle('');
    setFormAmount('');
  };

  const handleDelete = (id) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  // Calculations
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpense;

  // Today's Expense
  const todayExpense = transactions
    .filter((t) => t.type === 'expense' && (t.date === '2026-09-18' || t.dateLabel?.startsWith('Today')))
    .reduce((sum, t) => sum + t.amount, 0);

  const dailyCap = 500;
  const isOverDailyCap = todayExpense > dailyCap;

  // Filtered List
  const filteredList = transactions.filter((t) => {
    if (filter === 'all') return true;
    return t.type === filter;
  });

  // Group by date
  const groupedTransactions = filteredList.reduce((acc, curr) => {
    const key = curr.dateLabel || curr.date;
    if (!acc[key]) acc[key] = [];
    acc[key].push(curr);
    return acc;
  }, {});

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-fade-in text-left">
      
      {/* 1. Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-100 border border-blue-200 text-blue-900 text-xs font-bold uppercase tracking-wider mb-2">
            <Wallet className="w-3.5 h-3.5" />
            <span>Income & Daily Expense Tracker</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-stone-900 tracking-tight leading-tight">
            Daily Cashflow
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-medium mt-0.5">
            Log your irregular income, monitor daily chai & food expenses, and stay under daily caps.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setFormType('expense');
            setFormCategory('Food & Dining');
            setIsModalOpen(true);
          }}
          className="min-h-[48px] px-6 py-2.5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>Add Income / Expense</span>
        </button>
      </div>

      {/* 2. Top Metrics Cards (Laptop Grid) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Net Available Balance */}
        <div className="p-5 sm:p-6 bg-white rounded-3xl border-2 border-stone-200 shadow-sm hover:border-stone-400 transition-colors">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">Net Balance</span>
          <span className="text-2xl sm:text-3xl font-black text-stone-900 block mt-1">
            ₹{netBalance.toLocaleString()}
          </span>
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" /> Inflow - Outflow
          </span>
        </div>

        {/* Today's Spent */}
        <div className={`p-4 bg-white rounded-3xl border-2 shadow-sm ${isOverDailyCap ? 'border-rose-300' : 'border-stone-200'}`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Today's Spend</span>
            <span className={`w-2 h-2 rounded-full ${isOverDailyCap ? 'bg-rose-500' : 'bg-emerald-500'}`}></span>
          </div>
          <span className={`text-xl sm:text-2xl font-black block mt-1 ${isOverDailyCap ? 'text-rose-700' : 'text-stone-900'}`}>
            ₹{todayExpense.toLocaleString()}
          </span>
          <span className={`text-[10px] font-semibold mt-1 block ${isOverDailyCap ? 'text-rose-600' : 'text-stone-500'}`}>
            {isOverDailyCap ? `Exceeded ₹${dailyCap} cap` : `₹${dailyCap - todayExpense} under daily cap`}
          </span>
        </div>

        {/* Total Income */}
        <div className="p-4 bg-white rounded-3xl border-2 border-stone-200 shadow-sm">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">Total Inflow</span>
          <span className="text-xl sm:text-2xl font-black text-emerald-700 block mt-1">
            +₹{totalIncome.toLocaleString()}
          </span>
          <span className="text-[10px] text-stone-500 font-medium mt-1 block">Stipends, gigs & refunds</span>
        </div>

        {/* Total Expenses */}
        <div className="p-4 bg-white rounded-3xl border-2 border-stone-200 shadow-sm">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">Total Spent</span>
          <span className="text-xl sm:text-2xl font-black text-rose-700 block mt-1">
            -₹{totalExpense.toLocaleString()}
          </span>
          <span className="text-[10px] text-stone-500 font-medium mt-1 block">Across all categories</span>
        </div>

      </div>

      {/* 3. Daily Budget Alert Bar */}
      <div className={`p-4 rounded-3xl border-2 flex items-center justify-between gap-3 ${
        isOverDailyCap ? 'bg-rose-50 border-rose-200 text-rose-900' : 'bg-amber-50 border-amber-200 text-stone-900'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
            isOverDailyCap ? 'bg-rose-200 text-rose-800' : 'bg-amber-200 text-amber-900'
          }`}>
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-black">
              {isOverDailyCap ? '⚠️ Today’s Expense Cap Exceeded!' : '🎯 Daily Expense Cap: ₹500/day'}
            </h3>
            <p className="text-[11px] text-stone-600 font-medium">
              {isOverDailyCap
                ? `You have spent ₹${todayExpense} today (₹${todayExpense - dailyCap} over target). Cool down on food & cab taps!`
                : `You spent ₹${todayExpense} today. ₹${dailyCap - todayExpense} left before hitting your daily limit.`}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setFormType('income');
            setFormCategory('Stipend');
            setIsModalOpen(true);
          }}
          className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-white border border-stone-300 text-stone-900 text-xs font-bold hover:bg-stone-50 cursor-pointer shrink-0 shadow-sm"
        >
          + Add Income
        </button>
      </div>

      {/* 4. Filter Switcher */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-2xl border border-stone-200">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`min-h-[36px] px-3.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              filter === 'all' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            All Activity ({transactions.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('expense')}
            className={`min-h-[36px] px-3 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              filter === 'expense' ? 'bg-white text-rose-700 shadow-sm' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Expenses Only
          </button>
          <button
            type="button"
            onClick={() => setFilter('income')}
            className={`min-h-[36px] px-3 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              filter === 'income' ? 'bg-white text-emerald-700 shadow-sm' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Incomes Only
          </button>
        </div>

        <span className="text-xs text-stone-400 font-semibold hidden sm:inline-block">
          Grouped by Day
        </span>
      </div>

      {/* 5. Grouped Transactions by Day */}
      <div className="space-y-6">
        {Object.keys(groupedTransactions).length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border-2 border-stone-200 text-center text-stone-500">
            <p className="text-sm font-bold text-stone-800 mb-1">No transactions found</p>
            <p className="text-xs">Click "+ Add Income / Expense" above to record your cashflow.</p>
          </div>
        ) : (
          Object.entries(groupedTransactions).map(([dateTitle, list]) => {
            const dayExpense = list.filter((x) => x.type === 'expense').reduce((s, x) => s + x.amount, 0);
            const dayIncome = list.filter((x) => x.type === 'income').reduce((s, x) => s + x.amount, 0);

            return (
              <div key={dateTitle} className="bg-white rounded-3xl border-2 border-stone-200 shadow-sm overflow-hidden">
                {/* Date Header with Daily Subtotal Summary */}
                <div className="px-5 py-3.5 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-stone-500" />
                    <span className="text-xs font-black text-stone-900 uppercase tracking-wider">{dateTitle}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold">
                    {dayExpense > 0 && (
                      <span className="text-rose-700">Spent: ₹{dayExpense.toLocaleString()}</span>
                    )}
                    {dayIncome > 0 && (
                      <span className="text-emerald-700">Inflow: +₹{dayIncome.toLocaleString()}</span>
                    )}
                  </div>
                </div>

                {/* List of items on this day */}
                <div className="divide-y divide-stone-100">
                  {list.map((item) => {
                    const isIncome = item.type === 'income';

                    return (
                      <div
                        key={item.id}
                        className="p-4 sm:p-5 flex items-center justify-between hover:bg-stone-50/60 transition-colors group"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                            isIncome ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {isIncome ? (
                              <ArrowDownLeft className="w-5 h-5 stroke-[2.4]" />
                            ) : (
                              <ArrowUpRight className="w-5 h-5 stroke-[2.4]" />
                            )}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-stone-900 leading-snug">{item.title}</h4>
                            <div className="flex items-center gap-2 text-[11px] text-stone-500 font-medium mt-0.5">
                              <span className="bg-stone-100 px-2 py-0.5 rounded text-stone-700 font-semibold">{item.category}</span>
                              <span>•</span>
                              <span>{item.mode}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className={`text-base font-black tracking-tight ${
                            isIncome ? 'text-emerald-700' : 'text-stone-900'
                          }`}>
                            {isIncome ? `+₹${item.amount.toLocaleString()}` : `-₹${item.amount.toLocaleString()}`}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            title="Delete transaction"
                            className="w-8 h-8 rounded-lg text-stone-300 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 6. Add Income / Expense Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl border-2 border-stone-300 shadow-2xl p-6 sm:p-7 text-stone-900">
            
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-stone-900 mb-1">Add Cashflow Entry</h3>
            <p className="text-xs text-stone-500 mb-5">Record new income or log a daily payment.</p>

            {/* Type Toggle */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100 rounded-2xl mb-4 border border-stone-200">
              <button
                type="button"
                onClick={() => {
                  setFormType('expense');
                  setFormCategory('Food & Dining');
                }}
                className={`min-h-[42px] rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  formType === 'expense' ? 'bg-white text-rose-700 shadow-sm font-black' : 'text-stone-600'
                }`}
              >
                💸 Expense (-)
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormType('income');
                  setFormCategory('Stipend');
                }}
                className={`min-h-[42px] rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  formType === 'income' ? 'bg-white text-emerald-700 shadow-sm font-black' : 'text-stone-600'
                }`}
              >
                💰 Income (+)
              </button>
            </div>

            <form onSubmit={handleAddTransaction} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Amount (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-stone-500">₹</span>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                    placeholder="e.g. 350"
                    className="w-full min-h-[48px] pl-8 pr-4 bg-stone-50 border border-stone-300 rounded-xl text-base font-bold text-stone-900 focus:bg-white focus:border-stone-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  {formType === 'income' ? 'Source / Description' : 'Merchant / Expense Description'}
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder={formType === 'income' ? 'e.g. Freelance project payment' : 'e.g. Zepto groceries or Chai tap'}
                  className="w-full min-h-[48px] px-4 bg-stone-50 border border-stone-300 rounded-xl text-sm font-medium text-stone-900 focus:bg-white focus:border-stone-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Category
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full min-h-[48px] px-3 bg-stone-50 border border-stone-300 rounded-xl text-sm font-medium text-stone-900 focus:bg-white focus:border-stone-900 outline-none"
                >
                  {(formType === 'income' ? incomeCategories : expenseCategories).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full min-h-[48px] px-3 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium text-stone-900 focus:bg-white focus:border-stone-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                    Payment Mode
                  </label>
                  <select
                    value={formMode}
                    onChange={(e) => setFormMode(e.target.value)}
                    className="w-full min-h-[48px] px-3 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium text-stone-900 focus:bg-white focus:border-stone-900 outline-none"
                  >
                    <option value="UPI">UPI (GPay/PhonePe)</option>
                    <option value="Bank Transfer">Bank NEFT/IMPS</option>
                    <option value="Cash">Cash</option>
                    <option value="Card">Debit/Credit Card</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full min-h-[50px] rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md mt-4 active:scale-98"
              >
                <span>{formType === 'income' ? 'Record Income (+)' : 'Log Expense (-)'}</span>
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
