import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Shield, Wallet, Coins, Home, LayoutDashboard, Target, HelpCircle, Sparkles } from 'lucide-react';

export default function Layout({ lang, setLang, user, onOpenSignUp, onSignOut }) {
  const location = useLocation();

  const navItems = [
    {
      to: '/',
      label: lang === 'en' ? 'Home' : 'होम',
      icon: Home
    },
    {
      to: '/dashboard',
      label: lang === 'en' ? 'Stats' : 'डैशबोर्ड',
      icon: LayoutDashboard
    },
    {
      to: '/shield',
      label: lang === 'en' ? 'Shield' : 'शील्ड',
      icon: Shield
    },
    {
      to: '/goals',
      label: lang === 'en' ? 'Goals' : 'लक्ष्य',
      icon: Target
    },
    {
      to: '/quiz',
      label: lang === 'en' ? 'Quiz' : 'क्विज़',
      icon: HelpCircle
    }
  ];

  return (
    <div className="min-h-screen bg-[#fbfbf9] text-stone-900 font-sans flex flex-col justify-between selection:bg-amber-200">
      
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[42rem] h-[22rem] bg-gradient-to-b from-amber-100/60 via-orange-50/40 to-transparent blur-3xl rounded-full" />
        <div className="absolute top-72 -left-20 w-80 h-80 bg-emerald-100/30 blur-3xl rounded-full" />
        <div className="absolute top-96 -right-20 w-80 h-80 bg-blue-100/30 blur-3xl rounded-full" />
      </div>

      {/* TOP HEADER */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#fbfbf9]/90 border-b border-stone-200/80 transition-colors">
        <div className="max-w-md md:max-w-4xl mx-auto px-4 sm:px-6 h-18 py-3 flex items-center justify-between">
          
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-stone-900 text-amber-400 flex items-center justify-center shadow-md shadow-stone-900/10 group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5 stroke-[2.4]" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-stone-900 flex items-center gap-1.5">
                Kavach
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </span>
              <span className="text-[10px] font-bold text-stone-500 tracking-wider -mt-1 uppercase">
                Money Copilot
              </span>
            </div>
          </NavLink>

          {/* Secondary Header Navigation for Desktop */}
          <div className="hidden md:flex items-center gap-4 text-xs font-bold text-stone-600">
            <NavLink to="/dashboard" className="hover:text-stone-900">Dashboard</NavLink>
            <NavLink to="/spend" className="hover:text-stone-900">Transactions</NavLink>
            <NavLink to="/save" className="hover:text-stone-900">AutoPay Audit</NavLink>
            <NavLink to="/goals" className="hover:text-stone-900">Goals</NavLink>
            <NavLink to="/quiz" className="hover:text-stone-900">Daily Quiz</NavLink>
          </div>

          {/* Right: Sign Up / User + Language Switcher */}
          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-300 px-3 py-1.5 rounded-full shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                <span className="text-xs font-bold text-emerald-950 truncate max-w-[80px] sm:max-w-[120px]">
                  {user.name.split(' ')[0]}
                </span>
                <button
                  type="button"
                  onClick={onSignOut}
                  title="Sign Out"
                  className="text-[10px] text-emerald-800 hover:text-emerald-950 font-semibold underline ml-1 cursor-pointer"
                >
                  Exit
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenSignUp}
                className="min-h-[44px] px-3.5 sm:px-4 py-2 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{lang === 'en' ? 'Sign Up' : 'साइन अप'}</span>
              </button>
            )}

            {/* Language Switcher */}
            <div 
              className="flex items-center bg-stone-100 p-0.5 rounded-full border border-stone-300 shadow-inner"
              role="group"
              aria-label="Language switcher"
            >
              <button
                type="button"
                onClick={() => setLang('en')}
                aria-pressed={lang === 'en'}
                className={`min-h-[44px] px-2.5 sm:px-3 text-xs font-bold rounded-full transition-all cursor-pointer ${
                  lang === 'en' ? 'bg-stone-900 text-white shadow-sm' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLang('hi')}
                aria-pressed={lang === 'hi'}
                className={`min-h-[44px] px-2.5 sm:px-3 text-xs font-bold rounded-full transition-all cursor-pointer ${
                  lang === 'hi' ? 'bg-stone-900 text-white shadow-sm' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                हि
              </button>
            </div>
          </div>

        </div>
      </header>

      {/* PAGE CONTENT CONTAINER */}
      <main className="flex-1 w-full max-w-md md:max-w-4xl mx-auto px-3.5 sm:px-6 pt-5 pb-28 sm:pb-32">
        <Outlet context={{ lang, user, onOpenSignUp }} />
      </main>

      {/* STICKY BOTTOM TAB BAR (Optimized for 360px Viewports) */}
      <nav 
        className="fixed bottom-0 left-0 right-0 z-40 bg-[#fbfbf9]/95 backdrop-blur-lg border-t border-stone-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]"
        aria-label="Bottom Navigation"
      >
        <div className="max-w-md md:max-w-4xl mx-auto px-1 sm:px-4 flex items-center justify-between h-20">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`flex flex-col items-center justify-center flex-1 min-h-[48px] min-w-[48px] py-1 rounded-2xl transition-all ${
                  isActive
                    ? 'text-stone-950 font-extrabold'
                    : 'text-stone-500 hover:text-stone-800 font-medium'
                }`}
              >
                <div
                  className={`w-10 h-8 rounded-xl flex items-center justify-center mb-0.5 transition-all ${
                    isActive
                      ? 'bg-stone-900 text-amber-400 shadow-sm scale-105'
                      : 'text-stone-500 hover:bg-stone-200/60'
                  }`}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
                </div>
                <span className="text-[10px] sm:text-[11px] tracking-tight font-bold">
                  {item.label}
                </span>
                {isActive && (
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-0.5"></span>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
