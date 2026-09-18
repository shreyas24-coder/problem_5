import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
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
  Share2,
  ChevronRight,
  ChevronLeft,
  Check
} from 'lucide-react';
import { educationApi } from '../services/api';

export default function QuizPage() {
  const [activeTab, setActiveTab] = useState('quiz'); // 'quiz' | 'shorts'
  const [questions, setQuestions] = useState([]);
  const [shorts, setShorts] = useState([]);
  const [streakData, setStreakData] = useState({ current_streak: 0, longest_streak: 0 });
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [questionId]: selectedIndex }
  const [quizResults, setQuizResults] = useState(null); // Result object from backend after submit
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeShortIdx, setActiveShortIdx] = useState(0);
  const [streakCheckedIn, setStreakCheckedIn] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [qData, sData, streak] = await Promise.all([
        educationApi.getQuiz('general').catch(err => {
          console.error('Quiz fetch error:', err);
          return [];
        }),
        educationApi.getShorts().catch(() => []),
        educationApi.getStreak().catch(() => ({ current_streak: 0, longest_streak: 0 }))
      ]);

      setQuestions(qData || []);
      setShorts(sData || []);
      setStreakData(streak || { current_streak: 0, longest_streak: 0 });
      setErrorMsg('');
    } catch (e) {
      console.error('Error loading education data from database:', e);
      setErrorMsg('Failed to load quiz from database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const currentQ = questions[currentIdx];
  const isSelected = currentQ && selectedAnswers[currentQ.id] !== undefined;

  const handleSelectOption = (index) => {
    if (!currentQ) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQ.id]: index
    });
  };

  const handleNext = async () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      // Final question -> submit to backend database
      await handleSubmitQuiz();
    }
  };

  const handleSubmitQuiz = async () => {
    setIsSubmitting(true);
    try {
      const answersList = Object.entries(selectedAnswers).map(([qId, optIdx]) => ({
        question_id: Number(qId),
        selected_option_index: Number(optIdx)
      }));

      const res = await educationApi.submitQuiz('general', answersList);
      setQuizResults(res);

      // Refresh streak from database
      const freshStreak = await educationApi.getStreak().catch(() => null);
      if (freshStreak) {
        setStreakData(freshStreak);
      }
    } catch (err) {
      console.error('Quiz submission error:', err);
      setErrorMsg(err.message || 'Failed to submit quiz to database');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setCurrentIdx(0);
    setQuizResults(null);
  };

  const handleCheckInStreak = async () => {
    try {
      const res = await educationApi.checkInStreak();
      if (res?.current_streak !== undefined) {
        setStreakData(res);
      }
      setStreakCheckedIn(true);
      setTimeout(() => setStreakCheckedIn(false), 3000);
    } catch (err) {
      console.warn('Streak checkin error:', err);
    }
  };

  return (
    <div className="w-full space-y-8 animate-fade-in text-left">
      
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-full text-xs font-black uppercase tracking-wider">
              Feature 6 • Database Driven
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-stone-900 tracking-tight mt-1.5">
            Financial IQ & Daily Shorts
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-medium mt-1">
            Questions and daily learning shorts loaded directly from your database.
          </p>
        </div>

        {/* Streak Counter */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 border-2 border-amber-300 rounded-2xl shadow-xs">
            <Flame className="w-6 h-6 text-amber-500 fill-amber-500 animate-bounce" />
            <div>
              <span className="block text-sm font-black text-stone-900 leading-tight">
                {streakData.current_streak} Days Active
              </span>
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                Best: {streakData.longest_streak} Days
              </span>
            </div>
          </div>

          <button
            onClick={handleCheckInStreak}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              streakCheckedIn
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-300'
            }`}
          >
            {streakCheckedIn ? 'Streak Checked In ✓' : 'Daily Check-in'}
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold">
          {errorMsg}
        </div>
      )}

      {/* Mode Switcher */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
        <button
          onClick={() => setActiveTab('quiz')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'quiz'
              ? 'bg-stone-900 text-white shadow-sm'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          Daily Quiz ({questions.length})
        </button>
        <button
          onClick={() => setActiveTab('shorts')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'shorts'
              ? 'bg-stone-900 text-white shadow-sm'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          Daily Shorts ({shorts.length})
        </button>
      </div>

      {/* TAB 1: QUIZ */}
      {activeTab === 'quiz' && (
        <div className="max-w-2xl mx-auto">
          {loading ? (
            <div className="p-12 text-center text-stone-400">Loading questions from database...</div>
          ) : !quizResults && currentQ ? (
            <div className="bg-white rounded-3xl border-2 border-stone-200 shadow-md p-6 sm:p-8 space-y-6">
              {/* Question Index & Progress Bar */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">
                  <span>Question {currentIdx + 1} of {questions.length}</span>
                  <span className="text-amber-700 font-bold">{currentQ.quiz_topic}</span>
                </div>
                <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-stone-900 transition-all duration-300"
                    style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question Text */}
              <h2 className="text-lg sm:text-xl font-black text-stone-900 leading-snug">
                {currentQ.question}
              </h2>

              {/* Options List */}
              <div className="space-y-3">
                {(currentQ.options || []).map((optText, idx) => {
                  const isCurSelected = selectedAnswers[currentQ.id] === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full p-4 rounded-2xl border-2 text-left font-bold text-sm transition-all flex items-center justify-between gap-3 cursor-pointer ${
                        isCurSelected
                          ? 'bg-amber-50 border-stone-900 text-stone-950 ring-2 ring-stone-900/10'
                          : 'bg-stone-50 border-stone-200 hover:border-stone-400 text-stone-800'
                      }`}
                    >
                      <span className="flex-1">{optText}</span>
                      {isCurSelected && (
                        <span className="w-6 h-6 rounded-full bg-stone-900 text-amber-400 flex items-center justify-center text-xs">
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Next Question / Submit Button */}
              <button
                type="button"
                disabled={!isSelected || isSubmitting}
                onClick={handleNext}
                className="w-full h-12 bg-stone-900 hover:bg-stone-800 disabled:opacity-40 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
              >
                <span>
                  {isSubmitting 
                    ? 'Submitting to Database...' 
                    : currentIdx < questions.length - 1 
                    ? 'Next Question' 
                    : 'Submit Quiz to Database'}
                </span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>
            </div>
          ) : quizResults ? (
            /* Results Screen */
            <div className="bg-white rounded-3xl border-2 border-stone-200 shadow-xl p-8 text-center space-y-6">
              <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-900 flex items-center justify-center mx-auto shadow-md">
                <Trophy className="w-8 h-8 text-amber-600" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Official Database Evaluation
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-stone-900 mt-1">
                  You scored {quizResults.score} of {quizResults.total_questions} ({quizResults.percentage}%)
                </h2>
                <p className="text-xs sm:text-sm text-stone-500 mt-1">
                  {quizResults.percentage >= 75
                    ? "Great job! Your financial safety instincts are sharp."
                    : "Review the question explanations below to stay protected against online fraud."}
                </p>
              </div>

              {/* Explanations List from Database */}
              {quizResults.results && quizResults.results.length > 0 && (
                <div className="space-y-4 text-left pt-2 border-t border-stone-100">
                  <h3 className="text-xs font-black uppercase text-stone-400 tracking-wider">Answer Review:</h3>
                  {quizResults.results.map((res, i) => (
                    <div
                      key={i}
                      className={`p-4 rounded-2xl border text-xs sm:text-sm space-y-1.5 ${
                        res.is_correct ? 'bg-emerald-50/50 border-emerald-200' : 'bg-rose-50/50 border-rose-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-bold">
                        {res.is_correct ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-600" />
                        )}
                        <span>{res.question}</span>
                      </div>
                      <p className="text-stone-600 text-xs pl-6">{res.explanation}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-800 flex items-center justify-center gap-2">
                <Flame className="w-4 h-4 text-emerald-600" />
                <span>Streak updated to {streakData.current_streak} days in database ✓</span>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleResetQuiz}
                  className="px-5 py-2.5 rounded-xl bg-stone-900 text-white font-bold text-xs hover:bg-stone-800 flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Retake Quiz</span>
                </button>
                <NavLink
                  to="/dashboard"
                  className="px-5 py-2.5 rounded-xl bg-stone-100 text-stone-800 font-bold text-xs hover:bg-stone-200"
                >
                  Return to Dashboard
                </NavLink>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-stone-400">No quiz questions found in database.</div>
          )}
        </div>
      )}

      {/* TAB 2: DAILY SHORTS FROM DATABASE */}
      {activeTab === 'shorts' && (
        <div className="max-w-xl mx-auto space-y-6">
          {shorts.length > 0 ? (
            <div className="bg-white rounded-3xl border-2 border-stone-200 p-6 sm:p-8 shadow-md space-y-5 text-left relative overflow-hidden">
              <div className="flex items-center justify-between text-xs">
                <span className="px-2.5 py-0.5 rounded-lg bg-amber-100 text-amber-900 font-bold uppercase tracking-wider">
                  {shorts[activeShortIdx]?.category || 'Daily Short'}
                </span>
                <span className="font-bold text-stone-400">
                  {activeShortIdx + 1} of {shorts.length}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-stone-900">
                {shorts[activeShortIdx]?.title}
              </h2>

              <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                {shorts[activeShortIdx]?.content}
              </p>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                <button
                  type="button"
                  disabled={activeShortIdx === 0}
                  onClick={() => setActiveShortIdx(prev => Math.max(0, prev - 1))}
                  className="px-3 py-1.5 rounded-xl border border-stone-300 text-xs font-bold text-stone-700 disabled:opacity-40 flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>

                <button
                  type="button"
                  onClick={handleCheckInStreak}
                  className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-sm cursor-pointer"
                >
                  Mark Read & Check In 🔥
                </button>

                <button
                  type="button"
                  disabled={activeShortIdx >= shorts.length - 1}
                  onClick={() => setActiveShortIdx(prev => Math.min(shorts.length - 1, prev + 1))}
                  className="px-3 py-1.5 rounded-xl border border-stone-300 text-xs font-bold text-stone-700 disabled:opacity-40 flex items-center gap-1 cursor-pointer"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-stone-400 bg-white rounded-3xl border border-stone-200">
              No educational shorts found in database.
            </div>
          )}
        </div>
      )}

    </div>
  );
}
