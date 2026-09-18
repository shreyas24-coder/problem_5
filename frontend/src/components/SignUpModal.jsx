import React, { useState } from 'react';
import {
  X,
  Shield,
  Smartphone,
  CheckCircle2,
  ArrowRight,
  Lock,
  Sparkles,
  User,
  Briefcase,
  GraduationCap,
  Laptop
} from 'lucide-react';

export default function SignUpModal({ isOpen, onClose, onComplete, lang = 'en' }) {
  const [step, setStep] = useState(1); // 1: Info & Phone, 2: OTP, 3: Persona, 4: Success
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [selectedPersona, setSelectedPersona] = useState('student');
  const [errorMsg, setErrorMsg] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isOpen) return null;

  const t = {
    en: {
      title: "Join Kavach",
      subtitle: "Set up your free UPI protection copilot in under 60 seconds.",
      step1Title: "Basic Information",
      step1Sub: "Enter your details linked with your primary UPI number.",
      nameLabel: "Your Full Name",
      namePlaceholder: "e.g. Shreyas Patel",
      phoneLabel: "Mobile Number (Linked with UPI)",
      phonePlaceholder: "98765 43210",
      sendOtpBtn: "Send 4-Digit OTP",
      step2Title: "Verify Your Number",
      step2Sub: `We sent a code to +91 ${phone || '9876543210'}`,
      otpHint: "Demo OTP is auto-ready: Click 'Auto-Fill 2426'",
      autoFillBtn: "Auto-Fill 2426",
      verifyBtn: "Verify & Continue",
      step3Title: "How do you earn & spend?",
      step3Sub: "Kavach personalizes your payout cycles based on your lifestyle.",
      personaStudent: "College Student / Intern",
      personaStudentDesc: "Irregular stipends, allowances, college projects",
      personaFreelance: "Freelancer / Creator",
      personaFreelanceDesc: "Gig payouts, variable client invoices, Razorpay",
      personaJunior: "Early Career Professional",
      personaJuniorDesc: "First salary, rent splits, weekend social spends",
      completeBtn: "Activate Protection",
      step4Title: "You're Protected!",
      step4Sub: "Kavach Copilot is now active. Your UPI intents are safeguarded before PIN entry.",
      exploreBtn: "Open Scam Shield",
      securityBadge: "Bank-grade 256-bit encryption • Non-custodial • Zero UPI PIN storage"
    },
  };

  const text = t.en;

  const handleStep1Submit = (e) => {
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

  const handleAutoFillOtp = () => {
    setOtp(['2', '4', '2', '6']);
    setErrorMsg('');
  };

  const handleStep2Submit = (e) => {
    e.preventDefault();
    const fullOtp = otp.join('');
    if (fullOtp.length < 4) {
      setErrorMsg('Please enter 4 digits');
      return;
    }
    setErrorMsg('');
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setStep(3);
    }, 800);
  };

  const handleStep3Submit = () => {
    setStep(4);
    if (onComplete) {
      onComplete({
        name: name || 'Shreyas',
        phone: phone || '9876543210',
        persona: selectedPersona
      });
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="signup-modal-title"
    >
      <div className="relative w-full max-w-md bg-white rounded-3xl border-2 border-stone-300 shadow-2xl overflow-hidden p-6 sm:p-7 text-stone-900">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Progress Dots */}
        <div className="flex items-center gap-1.5 mb-5">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                s === step
                  ? 'w-8 bg-stone-900'
                  : s < step
                  ? 'w-4 bg-emerald-500'
                  : 'w-4 bg-stone-200'
              }`}
            />
          ))}
          <span className="text-[11px] font-bold text-stone-400 ml-auto uppercase tracking-wider">
            Step {step} of 4
          </span>
        </div>

        {/* STEP 1: Name & Phone */}
        {step === 1 && (
          <form onSubmit={handleStep1Submit} className="space-y-4 text-left">
            <div>
              <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mb-3">
                <Smartphone className="w-5 h-5" />
              </div>
              <h2 id="signup-modal-title" className="text-2xl font-black text-stone-900">
                {text.title}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                {text.step1Sub}
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                {text.nameLabel}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={text.namePlaceholder}
                  className="w-full min-h-[50px] bg-stone-50 border border-stone-300 rounded-xl px-4 text-base text-stone-900 placeholder-stone-400 focus:bg-white focus:border-stone-900 outline-none transition-colors"
                  required
                />
              </div>
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

            {errorMsg && (
              <p className="text-rose-600 text-xs font-bold">{errorMsg}</p>
            )}

            <button
              type="submit"
              className="w-full min-h-[50px] rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-base flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <span>{text.sendOtpBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-[11px] text-stone-500 text-center flex items-center justify-center gap-1.5 pt-1">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>{text.securityBadge}</span>
            </div>
          </form>
        )}

        {/* STEP 2: OTP Verification */}
        {step === 2 && (
          <form onSubmit={handleStep2Submit} className="space-y-5 text-left">
            <div>
              <div className="w-11 h-11 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center mb-3">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-black text-stone-900">
                {text.step2Title}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                {text.step2Sub}
              </p>
            </div>

            {/* 4 Digit Boxes */}
            <div className="flex justify-between gap-2.5 max-w-[260px] mx-auto">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-${idx}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => {
                    const val = e.target.value;
                    const newOtp = [...otp];
                    newOtp[idx] = val;
                    setOtp(newOtp);
                    if (val && idx < 3) {
                      document.getElementById(`otp-${idx + 1}`)?.focus();
                    }
                  }}
                  className="w-14 h-14 text-center text-2xl font-black bg-stone-50 border-2 border-stone-300 rounded-2xl focus:bg-white focus:border-stone-900 outline-none transition-all shadow-inner"
                />
              ))}
            </div>

            {/* Quick autofill helper */}
            <div className="text-center">
              <button
                type="button"
                onClick={handleAutoFillOtp}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-xs font-bold text-stone-800 border border-stone-300 cursor-pointer"
              >
                <span>⚡ {text.autoFillBtn}</span>
              </button>
            </div>

            {errorMsg && (
              <p className="text-rose-600 text-xs font-bold text-center">{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full min-h-[50px] rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-base flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-50"
            >
              {isVerifying ? (
                <span>Verifying...</span>
              ) : (
                <>
                  <span>{text.verifyBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 3: Lifestyle / Income Persona */}
        {step === 3 && (
          <div className="space-y-4 text-left">
            <div>
              <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-black text-stone-900">
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
              onClick={handleStep3Submit}
              className="w-full min-h-[50px] rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-base flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md mt-2"
            >
              <span>{text.completeBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 4: Success & Activation */}
        {step === 4 && (
          <div className="space-y-5 text-center py-2 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-md">
              <Shield className="w-8 h-8 stroke-[2.4]" />
            </div>

            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black tracking-wider uppercase mb-2">
                Active Protection
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
                {text.step4Title}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 max-w-xs mx-auto mt-2 leading-relaxed">
                {text.step4Sub}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-left text-xs text-stone-700 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-medium text-stone-500">Registered Name:</span>
                <span className="font-bold text-stone-900">{name || 'Shreyas Patel'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-stone-500">UPI Number:</span>
                <span className="font-bold text-stone-900">+91 {phone || '9876543210'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-stone-500">Scam Shield Status:</span>
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Armed & Guarding
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full min-h-[50px] rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-base flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <span>{text.exploreBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
