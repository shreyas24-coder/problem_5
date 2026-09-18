import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Wallet,
  Calendar,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingDown,
  Sparkles,
  Coffee,
  ShoppingBag,
  Train,
  CheckCircle2,
  ChevronRight,
  Info,
  Plus,
  PiggyBank,
  X,
  CreditCard,
  Layers
} from 'lucide-react';

export default function SpendPage() {
  const { lang } = useOutletContext() || { lang: 'en' };

  // Transactions list state (allows adding new ones)
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      merchant: "Swiggy Food Delivery",
      category: "Food & Dining",
      date: "Sep 16, 2026",
      amount: 249,
      type: "expense",
      tag: "UPI Auto-Split"
    },
    {
      id: 2,
      merchant: "Zepto Quick Commerce",
      category: "Groceries",
      date: "Sep 15, 2026",
      amount: 185,
      type: "expense",
      tag: "10-Min Delivery"
    },
    {
      id: 3,
      merchant: "Emergency Savings Pot",
      category: "Savings",
      date: "Sep 15, 2026",
      amount: 500,
      type: "saving",
      tag: "Auto-Saved"
    },
    {
      id: 4,
      merchant: "Metro Transit Smart Card",
      category: "Commute",
      date: "Sep 14, 2026",
      amount: 100,
      type: "expense",
      tag: "NCMC Recharge"
    },
    {
      id: 5,
      merchant: "Chai Point UPI Tap",
      category: "Snacks",
      date: "Sep 13, 2026",
      amount: 40,
      type: "expense",
      tag: "Quick Tap"
    }
  ]);

  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'expense' | 'saving'
  const [isAddOpen, setIsAddOpen] = useState(false);
  
  // New transaction form state
  const [entryType, setEntryType] = useState('expense'); // 'expense' | 'saving'
  const [merchant, setMerchant] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food & Dining');

  const handleAddEntry = (e) => {
    e.preventDefault();
    if (!merchant.trim() || !amount) return;

    const newTx = {
      id: Date.now(),
      merchant: merchant.trim(),
      category: entryType === 'saving' ? 'Savings' : category,
      date: 'Today, ' + new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
      amount: Number(amount),
      type: entryType,
      tag: entryType === 'saving' ? 'Saved Pot' : 'Manual Log'
    };

    setTransactions([newTx, ...transactions]);
    setIsAddOpen(false);
    setMerchant('');
    setAmount('');
  };

  const filteredTxs = transactions.filter((tx) => {
    if (activeFilter === 'all') return true;
    return tx.type === activeFilter;
  });

  // Calculate totals
  const totalExpenses = transactions
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalSaved = transactions
    .filter((tx) => tx.type === 'saving')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const STIPEND_INFLOW = 12000;
  const cycleBalance = STIPEND_INFLOW - totalExpenses;

  const t = {
    en: {
      badge: "Irregular Income Copilot",
      headline: "Track Your Cashflow & Savings",
      subheadline: "Log transactions and save funds anchored to your stipend cycles rather than rigid calendar months.",
      addBtn: "Log Payment / Saving",
      cyclesTitle: "Payout Cycles",
      cyclesSubtitle: "Smart grouping anchored to when your money actually arrives.",
      currentCycleLabel: "ACTIVE CYCLE",
      currentCycleName: "Design Internship Stipend",
      currentCycleInflow: "₹12,000",
      creditedOn: "Credited Sep 10 via RazorpayX",
      cycleLeft: `₹${cycleBalance.toLocaleString()} remaining`,
      safeSpend: "Safe Daily Burn: ₹475/day",
      daysEstimated: "24 days until next payout",
      recentHeading: "Transactions & Savings History",
      filterAll: "All",
      filterExpenses: "Expenses",
      filterSavings: "Savings Deposits",
      modalTitle: "Log a Payment or Saving",
      modalSub: "Record where your money went or deposit to your savings pot.",
      typeExpense: "💸 Expense (Spent)",
      typeSaving: "💰 Saving (Set Aside)",
      titleLabel: "Merchant / Destination",
      titlePlaceholder: "e.g. Swiggy, Metro, Laptop Pot",
      amountLabel: "Amount (₹)",
      amountPlaceholder: "250",
      categoryLabel: "Category",
      submitBtn: "Save Entry"
    },
    hi: {
      badge: "अनियमित आय ट्रैकर",
      headline: "खर्च व बचत का सटीक हिसाब",
      subheadline: "महीने की 1 तारीख के बजाय अपने स्टाइपेंड आने के दिन से खर्च और बचत को रिकॉर्ड करें।",
      addBtn: "+ नया खर्च / बचत जोड़ें",
      cyclesTitle: "पेआउट साइकल्स (Payout Cycles)",
      cyclesSubtitle: "जब स्टाइपेंड आता है तब से वास्तविक बजट का हिसाब।",
      currentCycleLabel: "सक्रिय चक्र",
      currentCycleName: "इंटर्नशिप स्टाइपेंड साइकिल",
      currentCycleInflow: "₹12,000",
      creditedOn: "10 सितंबर को प्राप्त (RazorpayX)",
      cycleLeft: `₹${cycleBalance.toLocaleString()} शेष`,
      safeSpend: "सुरक्षित दैनिक खर्च: ₹475/दिन",
      daysEstimated: "अगले स्टाइपेंड में 24 दिन शेष",
      recentHeading: "लेनदेन और बचत का इतिहास",
      filterAll: "सभी",
      filterExpenses: "खर्च",
      filterSavings: "बचत डिपॉजिट",
      modalTitle: "खर्च या बचत जोड़ें",
      modalSub: "अपने खर्च को रिकॉर्ड करें या बचत पॉट में पैसे जोड़ें।",
      typeExpense: "💸 खर्च (Spent)",
      typeSaving: "💰 बचत (Set Aside)",
      titleLabel: "प्राप्तकर्ता / विवरण",
      titlePlaceholder: "उदा. स्विगी, मेट्रो कार्ड, लैपटॉप पॉट",
      amountLabel: "राशि (₹)",
      amountPlaceholder: "250",
      categoryLabel: "कैटेगरी",
      submitBtn: "रिकॉर्ड सेव करें"
    }
  };

  const text = t[lang] || t.en;

  return (
    <div className="flex flex-col animate-fade-in text-left space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-stone-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 border border-blue-300 text-blue-900 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-700" />
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
          onClick={() => setIsAddOpen(true)}
          className="min-h-[48px] px-5 py-2.5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-[0.98] self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>{text.addBtn}</span>
        </button>
      </div>

      {/* Payout Cycles Card */}
      <section>
        <div className="mb-3">
          <h2 className="text-xl font-extrabold text-stone-900">{text.cyclesTitle}</h2>
          <p className="text-xs sm:text-sm text-stone-500 font-medium">{text.cyclesSubtitle}</p>
        </div>

        <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-stone-300 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
            <div>
              <span className="inline-block px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-xs font-black tracking-wider uppercase mb-1">
                {text.currentCycleLabel}
              </span>
              <h3 className="text-xl font-bold text-stone-900">{text.currentCycleName}</h3>
              <p className="text-xs text-stone-500 font-medium mt-0.5">{text.creditedOn}</p>
            </div>
            <div className="sm:text-right">
              <span className="text-xs text-stone-400 font-bold uppercase tracking-wider block">Inflow</span>
              <span className="text-2xl font-black text-emerald-700">+{text.currentCycleInflow}</span>
            </div>
          </div>

          <div className="my-5 grid grid-cols-2 sm:grid-cols-3 gap-3.5">
            <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
              <span className="text-xs text-stone-500 font-medium block mb-0.5">Cycle Balance</span>
              <span className="text-lg sm:text-xl font-black text-stone-900">{text.cycleLeft}</span>
            </div>
            <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200">
              <span className="text-xs text-emerald-700 font-medium block mb-0.5">Total Saved Pot</span>
              <span className="text-lg sm:text-xl font-black text-emerald-800">₹{totalSaved.toLocaleString()}</span>
            </div>
            <div className="col-span-2 sm:col-span-1 bg-amber-50 p-3.5 rounded-2xl border border-amber-200">
              <span className="text-xs text-amber-800 font-medium block mb-0.5">{text.safeSpend}</span>
              <span className="text-xs text-amber-700 font-bold block">{text.daysEstimated}</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-stone-600 font-semibold mb-1.5">
              <span>Spent: ₹{totalExpenses.toLocaleString()} of ₹{STIPEND_INFLOW.toLocaleString()}</span>
              <span className="text-emerald-700 font-bold">
                {Math.round(((STIPEND_INFLOW - totalExpenses) / STIPEND_INFLOW) * 100)}% Available
              </span>
            </div>
            <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden border border-stone-200">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all"
                style={{ width: `${Math.min(100, (totalExpenses / STIPEND_INFLOW) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Transactions & Savings History */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3.5">
          <div>
            <h2 className="text-lg font-bold text-stone-900">{text.recentHeading}</h2>
            <span className="text-xs text-stone-500 font-medium">{filteredTxs.length} records in this cycle</span>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center bg-stone-100 p-1 rounded-full border border-stone-300 text-xs font-bold self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-full transition-all ${
                activeFilter === 'all' ? 'bg-stone-900 text-white shadow-sm' : 'text-stone-600'
              }`}
            >
              {text.filterAll}
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('expense')}
              className={`px-3 py-1.5 rounded-full transition-all ${
                activeFilter === 'expense' ? 'bg-stone-900 text-white shadow-sm' : 'text-stone-600'
              }`}
            >
              {text.filterExpenses}
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('saving')}
              className={`px-3 py-1.5 rounded-full transition-all ${
                activeFilter === 'saving' ? 'bg-emerald-700 text-white shadow-sm' : 'text-stone-600'
              }`}
            >
              {text.filterSavings}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl border-2 border-stone-200 shadow-sm overflow-hidden divide-y divide-stone-100">
          {filteredTxs.map((tx) => {
            const isSaving = tx.type === 'saving';
            return (
              <div
                key={tx.id}
                className="p-4 sm:p-4.5 flex items-center justify-between gap-3 hover:bg-stone-50/70 transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${
                      isSaving
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                        : 'bg-stone-100 text-stone-700 border-stone-200'
                    }`}
                  >
                    {isSaving ? <PiggyBank className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-base font-bold text-stone-900 truncate leading-snug">
                      {tx.merchant}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5">
                      <span>{tx.date}</span>
                      <span>•</span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${
                          isSaving
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {tx.tag}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`text-base sm:text-lg font-black block ${
                      isSaving ? 'text-emerald-700' : 'text-stone-900'
                    }`}
                  >
                    {isSaving ? `+₹${tx.amount}` : `-₹${tx.amount}`}
                  </span>
                  <span className="text-[11px] text-stone-400 font-medium">
                    {isSaving ? 'Set Aside' : 'UPI Debited'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Log Entry Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl border-2 border-stone-300 shadow-2xl p-6 sm:p-7 text-stone-900">
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-5 text-left">
              <h2 className="text-xl font-black text-stone-900">{text.modalTitle}</h2>
              <p className="text-xs text-stone-600 mt-1">{text.modalSub}</p>
            </div>

            <form onSubmit={handleAddEntry} className="space-y-4 text-left">
              {/* Type Switcher */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100 rounded-2xl border border-stone-200">
                <button
                  type="button"
                  onClick={() => setEntryType('expense')}
                  className={`min-h-[44px] rounded-xl text-xs font-bold transition-all ${
                    entryType === 'expense'
                      ? 'bg-white text-stone-900 shadow-sm'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {text.typeExpense}
                </button>
                <button
                  type="button"
                  onClick={() => setEntryType('saving')}
                  className={`min-h-[44px] rounded-xl text-xs font-bold transition-all ${
                    entryType === 'saving'
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {text.typeSaving}
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  {text.titleLabel}
                </label>
                <input
                  type="text"
                  value={merchant}
                  onChange={(e) => setMerchant(e.target.value)}
                  placeholder={text.titlePlaceholder}
                  className="w-full min-h-[48px] bg-stone-50 border border-stone-300 rounded-xl px-4 text-sm sm:text-base text-stone-900 focus:bg-white focus:border-stone-900 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  {text.amountLabel}
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={text.amountPlaceholder}
                  className="w-full min-h-[48px] bg-stone-50 border border-stone-300 rounded-xl px-4 text-sm sm:text-base text-stone-900 focus:bg-white focus:border-stone-900 outline-none"
                  required
                />
              </div>

              {entryType === 'expense' && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    {text.categoryLabel}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full min-h-[48px] bg-stone-50 border border-stone-300 rounded-xl px-4 text-sm sm:text-base text-stone-900 focus:bg-white focus:border-stone-900 outline-none"
                  >
                    <option value="Food & Dining">Food & Dining</option>
                    <option value="Groceries">Groceries & Quick Commerce</option>
                    <option value="Commute">Commute & Transit</option>
                    <option value="Subscriptions">App Subscriptions</option>
                    <option value="Shopping">Shopping & Tech</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                className="w-full min-h-[50px] rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-base flex items-center justify-center gap-2 cursor-pointer shadow-md mt-4"
              >
                <span>{text.submitBtn}</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
