import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import {
  Shield,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  GraduationCap,
  Laptop,
  Briefcase,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const navigate = useNavigate();
  const { login, register, loginDemo } = useAuth();

  // Mode: 'signin' or 'signup'
  const [mode, setMode] = useState('signin');

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedPersona, setSelectedPersona] = useState('student');
  const [showPassword, setShowPassword] = useState(false);

  // States
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingDemo, setLoadingDemo] = useState(false);

  // Handle direct demo profile login
  const handleQuickDemoFill = async () => {
    setErrorMsg('');
    setLoadingDemo(true);
    try {
      await loginDemo();
      navigate('/dashboard');
    } catch (err) {
      setErrorMsg(err.message || 'Demo login failed. Please try again.');
    } finally {
      setLoadingDemo(false);
    }
  };

  // Handle Sign In submission
  const handleSignIn = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setErrorMsg('Please enter your email address.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    try {
      setIsSubmitting(true);
      await login(cleanEmail, password);
      navigate('/dashboard');
    } catch (err) {
      setErrorMsg(err.message || 'Invalid email or password. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Sign Up submission
  const handleSignUp = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    try {
      setIsSubmitting(true);
      await register({
        email: cleanEmail,
        password,
        full_name: fullName.trim() || 'Alex Rivera',
        expected_monthly_savings: selectedPersona === 'freelance' ? 20000 : 12000,
      });
      navigate('/dashboard');
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. An account with this email may already exist.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-4 sm:py-8 animate-fade-in text-left">
      {/* Back to Home Link */}
      <NavLink
        to="/"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-stone-900 mb-6 group transition-colors"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Back to Home</span>
      </NavLink>

      {/* Main Authentication Card */}
      <div className="bg-white rounded-3xl border-2 border-stone-300 shadow-xl p-6 sm:p-8">
        
        {/* Header Icon & Title */}
        <div className="flex items-center justify-between mb-5">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-stone-900 flex items-center justify-center shadow-sm">
            <Shield className="w-6 h-6 text-amber-600" />
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>256-Bit SSL Encrypted</span>
          </span>
        </div>

        <h2 className="text-2xl font-black text-stone-900 tracking-tight">
          {mode === 'signin' ? 'Sign In to MONEYCRAFT' : 'Create Your Account'}
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 mt-1 mb-6">
          {mode === 'signin'
            ? 'Access your personal financial copilot, scam shield, and goals.'
            : 'Join MONEYCRAFT to safeguard digital transactions and optimize savings.'}
        </p>

        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-2 p-1 bg-stone-100 rounded-2xl mb-6 border border-stone-200">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMsg('');
            }}
            className={`py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
              mode === 'signin'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMsg('');
            }}
            className={`py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
              mode === 'signup'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Message Banner */}
        {errorMsg && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-700 text-xs font-semibold animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* SIGN IN FORM */}
        {mode === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. demo@technofora.com"
                  autoComplete="email"
                  className="w-full min-h-[48px] bg-stone-50 border border-stone-300 rounded-xl pl-10 pr-4 text-sm sm:text-base text-stone-900 placeholder-stone-400 focus:bg-white focus:border-stone-900 outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full min-h-[48px] bg-stone-50 border border-stone-300 rounded-xl pl-10 pr-11 text-sm sm:text-base text-stone-900 placeholder-stone-400 focus:bg-white focus:border-stone-900 outline-none transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Quick Demo Login Option */}
            <div className="pt-1">
              <button
                type="button"
                onClick={handleQuickDemoFill}
                disabled={loadingDemo}
                className="text-xs text-stone-600 hover:text-stone-900 font-bold underline cursor-pointer disabled:opacity-50"
              >
                {loadingDemo ? 'Signing in demo profile...' : '⚡ One-Click Demo Login (demo@technofora.com)'}
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full min-h-[50px] rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-base flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md mt-4 active:scale-[0.98] disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </>
              )}
            </button>
          </form>
        )}

        {/* SIGN UP FORM */}
        {mode === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  className="w-full min-h-[48px] bg-stone-50 border border-stone-300 rounded-xl pl-10 pr-4 text-sm sm:text-base text-stone-900 placeholder-stone-400 focus:bg-white focus:border-stone-900 outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. alex@example.com"
                  autoComplete="email"
                  className="w-full min-h-[48px] bg-stone-50 border border-stone-300 rounded-xl pl-10 pr-4 text-sm sm:text-base text-stone-900 placeholder-stone-400 focus:bg-white focus:border-stone-900 outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Create Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
                  className="w-full min-h-[48px] bg-stone-50 border border-stone-300 rounded-xl pl-10 pr-11 text-sm sm:text-base text-stone-900 placeholder-stone-400 focus:bg-white focus:border-stone-900 outline-none transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Persona Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Financial Persona
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'student', title: 'Student', icon: GraduationCap },
                  { id: 'freelance', title: 'Creator', icon: Laptop },
                  { id: 'junior', title: 'Professional', icon: Briefcase },
                ].map((p) => {
                  const Icon = p.icon;
                  const isSelected = selectedPersona === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedPersona(p.id)}
                      className={`p-2.5 rounded-xl border-2 text-center flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-stone-900 bg-amber-50/70 text-stone-900 font-bold'
                          : 'border-stone-200 hover:border-stone-300 bg-stone-50 text-stone-600'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-xs">{p.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full min-h-[50px] rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-base flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md mt-4 active:scale-[0.98] disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </>
              )}
            </button>
          </form>
        )}

      </div>

      {/* Security Footer Note */}
      <div className="mt-5 text-center text-xs text-stone-500 flex items-center justify-center gap-1.5">
        <Lock className="w-3.5 h-3.5 text-emerald-600" />
        <span>Bank-grade 256-bit encryption • Non-custodial • Zero UPI PIN access</span>
      </div>
    </div>
  );
}
