import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
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
  ShieldCheck
} from 'lucide-react';

export default function SavePage() {
  const { lang } = useOutletContext() || { lang: 'en' };

  // Base goal data
  const GOAL_TARGET = 15000;
  const INITIAL_SAVED = 9600;

  // Active AutoPay Mandates list with cancel state
  const [mandates, setMandates] = useState([
    {
      id: 1,
      name: "FitTrack Pro App",
      costPerMonth: 99,
      frequency: "Monthly",
      approvedDate: "Jun 14, 2026",
      isCancelled: false,
      reason: "Inactive since 42 days",
      badge: "Unused Mandate"
    },
    {
      id: 2,
      name: "StreamFlix Mobile Pass",
      costPerMonth: 199,
      frequency: "Monthly",
      approvedDate: "May 02, 2026",
      isCancelled: false,
      reason: "Duplicate video subscription",
      badge: "AutoPay Active"
    },
    {
      id: 3,
      name: "CloudVault Extra 100GB",
      costPerMonth: 89,
      frequency: "Monthly",
      approvedDate: "Jul 21, 2026",
      isCancelled: false,
      reason: "Trial period ended",
      badge: "AutoPay Active"
    }
  ]);

  // Toggle cancellation of mandate
  const toggleMandate = (id) => {
    setMandates((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isCancelled: !m.isCancelled } : m))
    );
  };

  // Calculations for dynamic acceleration
  const totalLeakingMonthly = mandates
    .filter((m) => !m.isCancelled)
    .reduce((sum, m) => sum + m.costPerMonth, 0);

  const totalRecoveredMonthly = mandates
    .filter((m) => m.isCancelled)
    .reduce((sum, m) => sum + m.costPerMonth, 0);

  const cancelledCount = mandates.filter((m) => m.isCancelled).length;

  // Days saved calculation (assuming ~₹20/day standard contribution rate)
  const daysAccelerated = Math.round((totalRecoveredMonthly * 3) / 25);

  const currentSaved = INITIAL_SAVED + (totalRecoveredMonthly > 0 ? 300 : 0);
  const progressPercent = Math.min(100, Math.round((currentSaved / GOAL_TARGET) * 100));

  const t = {
    en: {
      badge: "Silent Leak Recovery",
      headline: "Recover Your Leaks",
      subheadline: "Stop hidden ₹99 AutoPay mandates before they drain your next paycheck.",
      goalTitle: "Savings Goal",
      goalName: "₹15,000 Laptop",
      goalTarget: "Target: ₹15,000",
      mandatesTitle: "Active AutoPay Mandates",
      mandatesSub: "Click 'Cancel' to simulate stopping the leak & boosting your goal.",
      acceleratorBanner: "Mandate Cancellation Impact",
      acceleratorMsg: `Canceling ${cancelledCount} mandate(s) frees up ₹${totalRecoveredMonthly}/mo.`,
      acceleratorDays: `You will reach your ₹15,000 Laptop goal ~${daysAccelerated} days sooner!`,
      noCancellationPrompt: "Cancel unnecessary subscriptions below to accelerate your goal.",
      activeLeakWarning: `You are currently leaking ₹${totalLeakingMonthly}/mo across active mandates.`
    },
    hi: {
      badge: "साइलेंट लीक रिकवरी",
      headline: "Recover Your Leaks",
      subheadline: "छिपे हुए ₹99 वाले ऑटो-पे मैन्डेट्स को रोकें और अपने बचत लक्ष्यों को गति दें।",
      goalTitle: "बचत लक्ष्य (Savings Goal)",
      goalName: "₹15,000 नया लैपटॉप फंड",
      goalTarget: "लक्ष्य: ₹15,000",
      mandatesTitle: "सक्रिय ऑटो-पे मैन्डेट्स (AutoPay Mandates)",
      mandatesSub: "अनचाहे सब्सक्रिप्शन रोकें और देखें कि आपका लैपटॉप लक्ष्य कितना जल्दी पूरा होगा।",
      acceleratorBanner: "बचत गति प्रभाव",
      acceleratorMsg: `${cancelledCount} सब्सक्रिप्शन रद्द करने से ₹${totalRecoveredMonthly}/माह की बचत होगी।`,
      acceleratorDays: `आपका ₹15,000 लैपटॉप लक्ष्य ~${daysAccelerated} दिन पहले पूरा हो जाएगा!`,
      noCancellationPrompt: "नीचे दिए गए अनचाहे ऑटो-पे को रद्द करके अपने लक्ष्य को तेज़ करें।",
      activeLeakWarning: `वर्तमान में ₹${totalLeakingMonthly}/माह ऑटो-पे के रूप में कट रहे हैं।`
    }
  };

  const text = t[lang] || t.en;

  return (
    <div className="flex flex-col animate-fade-in text-left">
      
      {/* Header */}
      <div className="text-center sm:text-left mb-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
          <span>{text.badge}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight leading-tight">
          {text.headline}
        </h1>
        <p className="text-stone-600 text-sm sm:text-base font-medium mt-1 leading-relaxed">
          {text.subheadline}
        </p>
      </div>

      {/* SAVINGS GOAL PROGRESS SECTION */}
      <section className="mb-8" aria-labelledby="savings-goal-heading">
        <div className="bg-white rounded-3xl p-6 border-2 border-stone-300 shadow-md">
          
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 shadow-sm">
                <Laptop className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-stone-400 block">
                  {text.goalTitle}
                </span>
                <h2 id="savings-goal-heading" className="text-xl sm:text-2xl font-black text-stone-900">
                  {text.goalName}
                </h2>
              </div>
            </div>

            <div className="text-right">
              <span className="text-lg sm:text-xl font-black text-emerald-700 block">
                ₹{currentSaved.toLocaleString()}
              </span>
              <span className="text-xs text-stone-400 font-medium">of ₹{GOAL_TARGET.toLocaleString()}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-3">
            <div className="w-full h-4 bg-stone-100 rounded-full overflow-hidden p-0.5 border border-stone-200">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-semibold text-stone-600">
            <span>{progressPercent}% Achieved</span>
            <span>₹{(GOAL_TARGET - currentSaved).toLocaleString()} to go</span>
          </div>

          {/* Dynamic Acceleration Banner */}
          {totalRecoveredMonthly > 0 ? (
            <div className="mt-5 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 animate-fade-in">
              <div className="flex items-center gap-2 font-black text-sm mb-0.5">
                <TrendingUp className="w-4 h-4 text-emerald-700" />
                <span>{text.acceleratorBanner}</span>
              </div>
              <p className="text-xs sm:text-sm font-semibold">
                {text.acceleratorMsg}
              </p>
              <p className="text-xs text-emerald-800 font-medium mt-1">
                ⚡ {text.acceleratorDays}
              </p>
            </div>
          ) : (
            <div className="mt-5 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>{text.activeLeakWarning}</span>
            </div>
          )}

        </div>
      </section>

      {/* ACTIVE AUTOPAY MANDATES SECTION */}
      <section aria-labelledby="mandates-heading">
        <div className="mb-3.5">
          <h2 id="mandates-heading" className="text-xl font-extrabold text-stone-900">
            {text.mandatesTitle}
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 font-medium">
            {text.mandatesSub}
          </p>
        </div>

        <div className="space-y-3">
          {mandates.map((mandate) => {
            return (
              <div
                key={mandate.id}
                className={`p-4 sm:p-5 rounded-3xl border-2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm ${
                  mandate.isCancelled
                    ? 'bg-stone-100/70 border-stone-200 opacity-80'
                    : 'bg-white border-stone-300 hover:border-stone-400'
                }`}
              >
                {/* Left: Mandate Info */}
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 ${
                      mandate.isCancelled
                        ? 'bg-stone-200 text-stone-400'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    <Repeat className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3
                        className={`text-base font-bold ${
                          mandate.isCancelled
                            ? 'line-through text-stone-500'
                            : 'text-stone-900'
                        }`}
                      >
                        {mandate.name}
                      </h3>
                      {mandate.isCancelled ? (
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">
                          Cancelled
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-100 text-rose-800">
                          {mandate.badge}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-stone-500 font-medium">
                      {mandate.reason} • Approved: {mandate.approvedDate}
                    </p>
                  </div>
                </div>

                {/* Right: Amount & Cancel Toggle */}
                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                  <div className="text-left sm:text-right">
                    <span
                      className={`text-base sm:text-lg font-black block ${
                        mandate.isCancelled ? 'text-stone-400 line-through' : 'text-stone-900'
                      }`}
                    >
                      ₹{mandate.costPerMonth}/mo
                    </span>
                    <span className="text-[11px] text-stone-400">Recurring UPI</span>
                  </div>

                  {/* 48px Touch Target Button */}
                  <button
                    type="button"
                    onClick={() => toggleMandate(mandate.id)}
                    aria-label={`${mandate.isCancelled ? 'Restore' : 'Cancel'} ${mandate.name}`}
                    className={`min-h-[48px] px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer ${
                      mandate.isCancelled
                        ? 'bg-stone-200 hover:bg-stone-300 text-stone-800'
                        : 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm'
                    }`}
                  >
                    {mandate.isCancelled ? (
                      <>
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Restore</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4" />
                        <span>Cancel Mandate</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
