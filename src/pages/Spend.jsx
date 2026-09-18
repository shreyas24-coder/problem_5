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
  Info
} from 'lucide-react';

export default function SpendPage() {
  const { lang } = useOutletContext() || { lang: 'en' };

  // Sample transactions grouped by irregular income payout cycle
  const transactions = [
    {
      id: 1,
      merchant: "Swiggy Food Delivery",
      category: "Food & Dining",
      date: "Sep 16, 2026",
      amount: "-₹249",
      isCredit: false,
      icon: ShoppingBag,
      tag: "UPI Auto-Split"
    },
    {
      id: 2,
      merchant: "Zepto Quick Commerce",
      category: "Groceries",
      date: "Sep 15, 2026",
      amount: "-₹185",
      isCredit: false,
      icon: ShoppingBag,
      tag: "10-Min Delivery"
    },
    {
      id: 3,
      merchant: "Metro Transit Smart Card",
      category: "Commute",
      date: "Sep 14, 2026",
      amount: "-₹100",
      isCredit: false,
      icon: Train,
      tag: "NCMC Recharge"
    },
    {
      id: 4,
      merchant: "Chai Point UPI Tap",
      category: "Snacks",
      date: "Sep 13, 2026",
      amount: "-₹40",
      isCredit: false,
      icon: Coffee,
      tag: "Quick Tap"
    }
  ];

  const t = {
    en: {
      badge: "Irregular Income Copilot",
      headline: "Track Your Cashflow",
      subheadline: "Built for stipends, creator gigs, and freelance payouts—not outdated 30-day calendar months.",
      cyclesTitle: "Payout Cycles",
      cyclesSubtitle: "Smart grouping anchored to when your money actually arrives.",
      currentCycleLabel: "ACTIVE CYCLE",
      currentCycleName: "Design Internship Stipend",
      currentCycleInflow: "₹12,000",
      creditedOn: "Credited Sep 10 via RazorpayX",
      cycleLeft: "₹11,426 remaining",
      safeSpend: "Safe Daily Burn: ₹475/day",
      daysEstimated: "24 days until next expected payout",
      recentHeading: "Recent Expenses in this Cycle",
      viewAll: "Export Statement"
    },
    hi: {
      badge: "अनियमित आय ट्रैकर",
      headline: "Track Your Cashflow",
      subheadline: "स्टाइपेंड, फ्रीलांस प्रोजेक्ट्स और पॉकेट मनी के लिए विशेष रूप से निर्मित।",
      cyclesTitle: "पेआउट साइकल्स (Payout Cycles)",
      cyclesSubtitle: "महीने की 1 तारीख के बजाय आपके पैसे आने के दिन से खर्च का सटीक हिसाब।",
      currentCycleLabel: "सक्रिय चक्र",
      currentCycleName: "इंटर्नशिप स्टाइपेंड साइकिल",
      currentCycleInflow: "₹12,000",
      creditedOn: "10 सितंबर को प्राप्त (RazorpayX)",
      cycleLeft: "₹11,426 शेष",
      safeSpend: "सुरक्षित दैनिक खर्च: ₹475/दिन",
      daysEstimated: "अगले स्टाइपेंड में 24 दिन शेष",
      recentHeading: "इस साइकिल के ताज़ा खर्च",
      viewAll: "स्टेटमेंट देखें"
    }
  };

  const text = t[lang] || t.en;

  return (
    <div className="flex flex-col animate-fade-in text-left">
      
      {/* Header Section */}
      <div className="text-center sm:text-left mb-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 border border-blue-300 text-blue-900 text-xs sm:text-sm font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-blue-700" />
          <span>{text.badge}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight leading-tight">
          {text.headline}
        </h1>
        <p className="text-stone-600 text-sm sm:text-base font-medium mt-1 leading-relaxed">
          {text.subheadline}
        </p>
      </div>

      {/* PAYOUT CYCLES SECTION */}
      <section className="mb-8" aria-labelledby="payout-cycles-heading">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 id="payout-cycles-heading" className="text-xl font-extrabold text-stone-900">
              {text.cyclesTitle}
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 font-medium">
              {text.cyclesSubtitle}
            </p>
          </div>
        </div>

        {/* Active Payout Cycle Card */}
        <div className="bg-white rounded-3xl p-6 border-2 border-stone-300 shadow-md">
          
          {/* Inflow Badge & Title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
            <div>
              <span className="inline-block px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-xs font-black tracking-wider uppercase mb-1">
                {text.currentCycleLabel}
              </span>
              <h3 className="text-xl font-bold text-stone-900">
                {text.currentCycleName}
              </h3>
              <p className="text-xs text-stone-500 font-medium mt-0.5">
                {text.creditedOn}
              </p>
            </div>

            <div className="sm:text-right">
              <span className="text-xs text-stone-400 font-bold uppercase tracking-wider block">Inflow</span>
              <span className="text-2xl font-black text-emerald-700">
                +{text.currentCycleInflow}
              </span>
            </div>
          </div>

          {/* Cycle Metrics / Burn Rate */}
          <div className="my-5 grid grid-cols-2 gap-4">
            <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
              <span className="text-xs text-stone-500 font-medium block mb-0.5">Cycle Balance</span>
              <span className="text-lg sm:text-xl font-extrabold text-stone-900">{text.cycleLeft}</span>
            </div>
            <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200">
              <span className="text-xs text-amber-800 font-medium block mb-0.5">{text.safeSpend}</span>
              <span className="text-xs text-amber-700 font-bold block">{text.daysEstimated}</span>
            </div>
          </div>

          {/* Progress Bar within Cycle */}
          <div>
            <div className="flex justify-between text-xs text-stone-600 font-semibold mb-1.5">
              <span>Cycle Burn: ₹574 of ₹12,000</span>
              <span className="text-emerald-700 font-bold">95.2% Available</span>
            </div>
            <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '4.8%' }}></div>
            </div>
          </div>

        </div>
      </section>

      {/* MOCK TRANSACTION ROWS */}
      <section aria-labelledby="transactions-heading">
        <div className="flex items-center justify-between mb-3.5">
          <h2 id="transactions-heading" className="text-lg font-bold text-stone-900">
            {text.recentHeading}
          </h2>
          <span className="text-xs font-semibold text-stone-500">4 Payments</span>
        </div>

        <div className="bg-white rounded-3xl border-2 border-stone-200 shadow-sm overflow-hidden divide-y divide-stone-100">
          {transactions.map((tx) => {
            const Icon = tx.icon;
            return (
              <div
                key={tx.id}
                className="p-4 sm:p-4.5 flex items-center justify-between gap-3 hover:bg-stone-50/70 transition-colors"
              >
                {/* Left: Icon & Details */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-11 h-11 rounded-2xl bg-stone-100 text-stone-700 border border-stone-200 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-base font-bold text-stone-900 truncate leading-snug">
                      {tx.merchant}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5">
                      <span>{tx.date}</span>
                      <span>•</span>
                      <span className="bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded text-[11px] font-medium">
                        {tx.tag}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Amount */}
                <div className="text-right shrink-0">
                  <span className="text-base sm:text-lg font-extrabold text-stone-900 block">
                    {tx.amount}
                  </span>
                  <span className="text-[11px] text-stone-400 font-medium">UPI Debited</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Human Helper Note */}
        <div className="mt-4 p-4 rounded-2xl bg-stone-100 border border-stone-200 flex items-start gap-3 text-xs text-stone-600">
          <Info className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
          <span>
            Unlike standard banking apps that reset on the 1st of every month, Kavach groups your transactions around your actual stipend and freelance payout events.
          </span>
        </div>
      </section>

    </div>
  );
}
