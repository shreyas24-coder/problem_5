import React, { useState } from 'react';
import { useOutletContext, NavLink } from 'react-router-dom';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  Sparkles,
  RotateCcw,
  Trophy,
  Flame,
  ArrowRight,
  ShieldCheck,
  BookOpen,
  Share2
} from 'lucide-react';

export default function QuizPage() {
  const { lang } = useOutletContext() || { lang: 'en' };

  const questions = [
    {
      id: 1,
      question: "A message says 'Claim your ₹3,500 refund here'. Tapping it opens PhonePe asking for your UPI PIN. What happens if you enter it?",
      options: [
        { id: 'a', text: "₹3,500 is credited to your bank account", isCorrect: false },
        { id: 'b', text: "₹3,500 is instantly debited (deducted) from your account", isCorrect: true },
        { id: 'c', text: "Your bank sends a confirmation OTP first", isCorrect: false }
      ],
      explanation: "Golden Rule of UPI: You NEVER need to enter your UPI PIN to receive money or refunds. UPI PIN is exclusively used to authorize debits (sending money)."
    },
    {
      id: 2,
      question: "You signed up for a 'Free 7-Day OTT Trial' that set up an AutoPay mandate of ₹499/mo. When should you audit or cancel it?",
      options: [
        { id: 'a', text: "After a month when you check your bank SMS", isCorrect: false },
        { id: 'b', text: "Immediately after starting the trial or on Day 5 before auto-debit triggers", isCorrect: true },
        { id: 'c', text: "Free trials cancel themselves automatically", isCorrect: false }
      ],
      explanation: "AutoPay mandates automatically deduct money once trials end without asking for your daily PIN. Always review mandates in your banking app before Day 7."
    },
    {
      id: 3,
      question: "For a student or freelancer with irregular income, how much should be set aside as an Emergency Fund?",
      options: [
        { id: 'a', text: "1 week of pocket money", isCorrect: false },
        { id: 'b', text: "3 to 6 months of essential living costs in a safe liquid pot", isCorrect: true },
        { id: 'c', text: "Put everything into speculative crypto tokens", isCorrect: false }
      ],
      explanation: "Having a 3-6 month cash reserve protects you from high-interest borrowing when client payments or internship stipends get delayed."
    },
    {
      id: 4,
      question: "Why is saving ₹1,000/month at age 20 more powerful than saving ₹3,000/month starting at age 35?",
      options: [
        { id: 'a', text: "Compounding interest gives your money 15 extra years to multiply exponentially", isCorrect: true },
        { id: 'b', text: "Bank accounts only pay interest to people under 25", isCorrect: false },
        { id: 'c', text: "Stock prices are always cheaper in your twenties", isCorrect: false }
      ],
      explanation: "Albert Einstein called compound interest the 8th wonder of the world: earnings generate their own earnings. Starting early beats saving larger amounts late."
    }
  ];

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answers, setAnswers] = useState({}); // { [questionId]: { selected, isCorrect } }
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = questions[currentIdx];
  const isCurrentAnswered = answers[currentQ.id] !== undefined;

  const handleSelectOption = (opt) => {
    if (isCurrentAnswered) return;
    const isCorrect = opt.isCorrect;
    setAnswers({
      ...answers,
      [currentQ.id]: { selected: opt.id, isCorrect }
    });
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleResetQuiz = () => {
    setAnswers({});
    setCurrentIdx(0);
    setIsFinished(false);
  };

  // Score calculation
  const score = Object.values(answers).filter((a) => a.isCorrect).length;
  const total = questions.length;
  const percentage = Math.round((score / total) * 100);

  const t = {
    en: {
      badge: "Daily Financial IQ",
      headline: "Daily Money & Scam Quiz",
      subheadline: "Test your digital payments smarts in 90 seconds. Boost your financial IQ and build your learning streak.",
      questionCounter: `Question ${currentIdx + 1} of ${total}`,
      streakLabel: "3-Day Streak",
      nextBtn: currentIdx < total - 1 ? "Next Question" : "See Results",
      retakeBtn: "Retake Quiz",
      scoreTitle: "Quiz Completed!",
      scoreSub: `You scored ${score} out of ${total} (${percentage}%)`,
      tierMaster: "🛡️ Kavach Grandmaster (Financial IQ: 100%)",
      tierSmart: "⚡ Smart Saver (Financial IQ: 75%)",
      tierRookie: "🌱 Rookie Defender (Keep Learning!)",
      goToDashboard: "Go to Dashboard",
      trackGoals: "Apply Learnings to Goals"
    },
  };

  const text = t.en;

  return (
    <div className="flex flex-col animate-fade-in text-left space-y-6 max-w-xl mx-auto">
      
      {/* Top Header */}
      <div className="text-center sm:text-left pb-2 border-b border-stone-200">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-stone-800 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>{text.badge}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-black border border-orange-200">
            <Flame className="w-3.5 h-3.5 text-orange-600" />
            <span>{text.streakLabel}</span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
          {text.headline}
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 font-medium mt-0.5">
          {text.subheadline}
        </p>
      </div>

      {!isFinished ? (
        /* ACTIVE QUESTION CARD */
        <div className="bg-white p-5 sm:p-7 rounded-3xl border-2 border-stone-300 shadow-md">
          
          {/* Question Header & Progress */}
          <div className="flex items-center justify-between text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">
            <span>{text.questionCounter}</span>
            <span>Score: {score} pts</span>
          </div>

          <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden mb-5">
            <div
              className="h-full bg-stone-900 rounded-full transition-all duration-300"
              style={{ width: `${((currentIdx + 1) / total) * 100}%` }}
            />
          </div>

          {/* Question Title */}
          <h2 className="text-base sm:text-lg font-black text-stone-900 leading-snug mb-5">
            {currentQ.question}
          </h2>

          {/* Options */}
          <div className="space-y-3 mb-5">
            {currentQ.options.map((opt) => {
              const currentAns = answers[currentQ.id];
              const isChosen = currentAns?.selected === opt.id;
              const hasAnswered = isCurrentAnswered;

              let btnStyle = "bg-stone-50 border-stone-200 text-stone-800 hover:border-stone-400";
              if (hasAnswered) {
                if (opt.isCorrect) {
                  btnStyle = "bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-200";
                } else if (isChosen && !opt.isCorrect) {
                  btnStyle = "bg-rose-50 border-rose-500 text-rose-950 font-bold ring-2 ring-rose-200";
                } else {
                  btnStyle = "bg-stone-50 border-stone-200 opacity-60 text-stone-500";
                }
              }

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelectOption(opt)}
                  disabled={hasAnswered}
                  className={`w-full p-4 rounded-2xl border-2 text-left text-xs sm:text-sm transition-all flex items-center justify-between gap-3 cursor-pointer ${btnStyle}`}
                >
                  <span className="leading-snug">{opt.text}</span>
                  {hasAnswered && opt.isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                  {hasAnswered && isChosen && !opt.isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box (Visible once answered) */}
          {isCurrentAnswered && (
            <div className="p-4 rounded-2xl bg-stone-100 border border-stone-200 text-xs text-stone-700 mb-5 animate-fade-in">
              <div className="flex items-center gap-1.5 font-bold text-stone-900 mb-1">
                <BookOpen className="w-3.5 h-3.5 text-stone-700" />
                <span>Financial Fact:</span>
              </div>
              <p className="leading-relaxed">{currentQ.explanation}</p>
            </div>
          )}

          {/* Next Button */}
          {isCurrentAnswered && (
            <button
              type="button"
              onClick={handleNext}
              className="w-full min-h-[50px] rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-base flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-[0.98]"
            >
              <span>{text.nextBtn}</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          )}

        </div>
      ) : (
        /* RESULTS SCREEN */
        <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-stone-300 shadow-xl text-center animate-fade-in space-y-6">
          
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-sm">
            <Trophy className="w-8 h-8" />
          </div>

          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider mb-2">
              Daily Quiz Complete
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
              {text.scoreTitle}
            </h2>
            <p className="text-sm text-stone-600 font-semibold mt-1">
              {text.scoreSub}
            </p>
          </div>

          {/* Tier Badge Card */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-center">
            <span className="text-xs text-stone-400 font-bold uppercase tracking-wider block mb-1">
              Your Financial Knowledge Tier
            </span>
            <span className="text-base sm:text-lg font-black text-stone-900">
              {percentage >= 75 ? text.tierMaster : percentage >= 50 ? text.tierSmart : text.tierRookie}
            </span>
            <p className="text-xs text-stone-500 mt-1">
              You know more about UPI scams and AutoPay mandate leaks than 89% of first-time digital payers!
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-2.5 pt-2">
            <button
              type="button"
              onClick={handleResetQuiz}
              className="w-full min-h-[48px] rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{text.retakeBtn}</span>
            </button>

            <NavLink
              to="/dashboard"
              className="w-full min-h-[50px] rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>{text.goToDashboard}</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </NavLink>
          </div>

        </div>
      )}

    </div>
  );
}
