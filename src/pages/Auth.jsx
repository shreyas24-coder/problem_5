import React, { useState } from 'react';
import { useNavigate, useOutletContext, NavLink } from 'react-router-dom';
import {
  Shield,
  Smartphone,
  CheckCircle2,
  ArrowRight,
  Lock,
  Sparkles,
  ArrowLeft,
  GraduationCap,
  Laptop,
  Briefcase
} from 'lucide-react';

export default function AuthPage() {
  const navigate = useNavigate();
  const { lang, onLogin } = useOutletContext() || { lang: 'en' };

  const [step, setStep] = useState(1); // 1: Info & Phone, 2: OTP, 3: Lifestyle Persona
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [selectedPersona, setSelectedPersona] = useState('student');
  const [errorMsg, setErrorMsg] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const t = {
    en: {
      backHome: "Back to Home",
      title: "Sign Up for Kavach",
      sub: "Create your free account to unlock Scam Shield, Stipend Budgeting, and Goals.",
      step1Title: "1. Your Primary Details",
      step1Sub: "Enter your full name and primary UPI mobile number.",
      nameLabel: "Full Name",
      namePlaceholder: "e.g. Shreyas Patel",
      phoneLabel: "Mobile Number (Linked with UPI)",
      phonePlaceholder: "98765 43210",
      sendOtpBtn: "Send 4-Digit Verification Code",
      demoQuickFill: "⚡ Auto-Fill Demo Profile (Shreyas • 9876543210)",
      step2Title: "2. Verify Mobile Number",
      step2Sub: `Enter the 4-digit code sent to +91 ${phone || '9876543210'}`,
      otpHint: "Click below for instant presentation verification:",
      autoFillOtpBtn: "Auto-Fill 2426",
      verifyBtn: "Verify & Continue",
      step3Title: "3. Choose Your Money Lifestyle",
      step3Sub: "Kavach personalizes your payout cycles based on your lifestyle.",
      personaStudent: "College Student / Intern",
      personaStudentDesc: "Irregular stipends, allowances, college projects",
      personaFreelance: "Freelancer / Creator",
      personaFreelanceDesc: "Gig payouts, client invoices, Razorpay payouts",
      personaJunior: "Early Career Professional",
      personaJuniorDesc: "First salary, rent splits, weekend social spends",
      completeBtn: "Activate Protection & Enter App",
      securityNote: "Bank-grade 256-bit encryption • Non-custodial • Zero UPI PIN access"
    },
  };

  const text = t.en;

  // Step 1: Submit info
  const handleStep1 = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please enter your name');
      return;
    }
    if (phone.replace(/\D/g, '').length < 10) {
      setErrorMsg('Please enter a valid 10-digit number');
      return;
    }
    setErrorMsg('');
    setStep(2);
  };

  const handleQuickDemoFill = () => {
    setName('Shreyas Patel');
    setPhone('9876543210');
    setErrorMsg('');
  };

  // Step 2: OTP
  const handleStep2 = (e) => {
    e.preventDefault();
    if (otp.join('').length < 4) {
      setErrorMsg('Please enter 4 digits');
      return;
    }
    setErrorMsg('');
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setStep(3);
    }, 600);
  };

  // Step 3: Complete & log in
  const handleComplete = () => {
    const userData = {
      name: name || 'Shreyas Patel',
      phone: phone || '9876543210',
      persona: selectedPersona
    };

    if (onLogin) {
      onLogin(userData);
    }
    // Navigate straight to the protected dashboard
    navigate('/dashboard');
  };

  return (
    <div className="max-w-md mx-auto py-4 sm:py-8 animate-fade-in text-left">
      
      {/* Back to Home Link */}
      <NavLink
        to="/"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-stone-900 mb-6 group transition-colors"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>{text.backHome}</span>
      </NavLink>

      {/* Main Authentication Card */}
      <div className="bg-white rounded-3xl border-2 border-stone-300 shadow-xl p-6 sm:p-8">
        
        {/* Top Progress Bar */}
        <div className="flex items-center gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                s === step
                  ? 'w-10 bg-stone-900'
                  : s < step
                  ? 'w-6 bg-emerald-500'
                  : 'w-6 bg-stone-200'
              }`}
            />
          ))}
          <span className="text-[11px] font-bold text-stone-400 ml-auto uppercase tracking-wider">
            Step {step} of 3
          </span>
        </div>

        {/* STEP 1: Name and Phone */}
        {step === 1 && (
          <form onSubmit={handleStep1} className="space-y-4">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mb-3 shadow-sm">
                <Smartphone className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-stone-900 tracking-tight">
                {text.step1Title}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                {text.step1Sub}
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                {text.nameLabel}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={text.namePlaceholder}
                className="w-full min-h-[50px] bg-stone-50 border border-stone-300 rounded-xl px-4 text-base text-stone-900 placeholder-stone-400 focus:bg-white focus:border-stone-900 outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                {text.phoneLabel}
              </label>
              <div className="flex items-center">
                <span className="min-h-[50px] px-3.5 bg-stone-100 border border-r-0 border-stone-300 rounded-l-xl flex items-center text-sm font-bold text-stone-600">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder={text.phonePlaceholder}
                  className="flex-1 min-h-[50px] bg-stone-50 border border-stone-300 rounded-r-xl px-4 text-base text-stone-900 placeholder-stone-400 focus:bg-white focus:border-stone-900 outline-none transition-colors"
                  required
                />
              </div>
            </div>

            {/* Presentation Shortcut */}
            <div className="pt-1">
              <button
                type="button"
                onClick={handleQuickDemoFill}
                className="text-xs text-stone-600 hover:text-stone-900 font-bold underline cursor-pointer"
              >
                {text.demoQuickFill}
              </button>
            </div>

            {errorMsg && (
              <p className="text-rose-600 text-xs font-bold">{errorMsg}</p>
            )}

            <button
              type="submit"
              className="w-full min-h-[52px] rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-base flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md mt-4 active:scale-[0.98]"
            >
              <span>{text.sendOtpBtn}</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          </form>
        )}

        {/* STEP 2: OTP Verification */}
        {step === 2 && (
          <form onSubmit={handleStep2} className="space-y-5">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center mb-3 shadow-sm">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-stone-900 tracking-tight">
                {text.step2Title}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                {text.step2Sub}
              </p>
            </div>

            <div className="flex justify-between gap-3 max-w-[260px] mx-auto py-2">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  id={`auth-otp-${idx}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => {
                    const val = e.target.value;
                    const newOtp = [...otp];
                    newOtp[idx] = val;
                    setOtp(newOtp);
                    if (val && idx < 3) {
                      document.getElementById(`auth-otp-${idx + 1}`)?.focus();
                    }
                  }}
                  className="w-14 h-14 text-center text-2xl font-black bg-stone-50 border-2 border-stone-300 rounded-2xl focus:bg-white focus:border-stone-900 outline-none transition-all"
                />
              ))}
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setOtp(['2', '4', '2', '6'])}
                className="px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 border border-stone-300 text-xs font-bold text-stone-800 rounded-xl cursor-pointer shadow-sm"
              >
                ⚡ {text.autoFillOtpBtn}
              </button>
            </div>

            {errorMsg && (
              <p className="text-rose-600 text-xs font-bold text-center">{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full min-h-[52px] rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-base flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-[0.98] disabled:opacity-50"
            >
              {isVerifying ? (
                <span>Verifying...</span>
              ) : (
                <>
                  <span>{text.verifyBtn}</span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 3: Lifestyle Persona */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3 shadow-sm">
                <Sparkles className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-stone-900 tracking-tight">
                {text.step3Title}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                {text.step3Sub}
              </p>
            </div>

            <div className="space-y-2.5">
              {[
                { id: 'student', title: text.personaStudent, desc: text.personaStudentDesc, icon: GraduationCap },
                { id: 'freelance', title: text.personaFreelance, desc: text.personaFreelanceDesc, icon: Laptop },
                { id: 'junior', title: text.personaJunior, desc: text.personaJuniorDesc, icon: Briefcase }
              ].map((p) => {
                const Icon = p.icon;
                const isSelected = selectedPersona === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPersona(p.id)}
                    className={`w-full p-3.5 rounded-2xl border-2 text-left flex items-center gap-3.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-stone-900 bg-amber-50/50 ring-2 ring-stone-900/10'
                        : 'border-stone-200 hover:border-stone-300 bg-stone-50'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-stone-900 text-amber-400' : 'bg-stone-200 text-stone-600'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-stone-900">{p.title}</h4>
                      <p className="text-xs text-stone-500 leading-snug">{p.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleComplete}
              className="w-full min-h-[52px] rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-base flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md mt-4 active:scale-[0.98]"
            >
              <span>{text.completeBtn}</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        )}

      </div>

      <div className="mt-5 text-center text-xs text-stone-500 flex items-center justify-center gap-1.5">
        <Lock className="w-3.5 h-3.5 text-emerald-600" />
        <span>{text.securityNote}</span>
      </div>

    </div>
  );
}
