import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  Shield,
  Wallet,
  LayoutDashboard,
  Target,
  HelpCircle,
  Sparkles,
  LogOut,
  Lock,
  Menu,
  X,
  Sun,
  Moon
} from 'lucide-react';
import ChatWidget from './ChatWidget';

export default function Layout({ user, onSignOut, onLogin }) {
  const location = useLocation();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('kavach_theme') || 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
    localStorage.setItem('kavach_theme', theme);
  }, [theme]);

  const navItems = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      desc: 'Pulse & analytics'
    },
    {
      to: '/shield',
      label: 'Scam Shield',
      icon: Shield,
      desc: 'Pre-tap fraud check'
    },
    {
      to: '/spend',
      label: 'Daily Cashflow',
      icon: Wallet,
      desc: 'Income & spend log'
    },
    {
      to: '/save',
      label: 'Savings Tracker',
      icon: Target,
      desc: 'General vs Goal split'
    },
    {
      to: '/goals',
      label: 'Savings Goals',
      icon: Target,
      desc: 'Future buy planner'
    },
    {
      to: '/quiz',
      label: 'Daily Quiz',
      icon: HelpCircle,
      desc: 'Test financial IQ'
    }
  ];

  const isAuthPage = location.pathname === '/auth';
  const isLandingPage = location.pathname === '/';
  const showSidebar = user && !isAuthPage && !isLandingPage;

  return (
    <div className="min-h-screen bg-[#fbfbf9] dark:bg-[#0b0f17] text-stone-900 dark:text-slate-100 font-sans flex flex-col selection:bg-amber-200 dark:selection:bg-blue-900/60 transition-colors duration-200">
      
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[54rem] h-[26rem] bg-gradient-to-b from-amber-100/60 via-orange-50/40 dark:from-blue-950/20 dark:via-slate-900/10 to-transparent blur-3xl rounded-full" />
        <div className="absolute top-72 -left-20 w-96 h-96 bg-emerald-100/30 dark:bg-emerald-950/10 blur-3xl rounded-full" />
        <div className="absolute top-96 -right-20 w-96 h-96 bg-blue-100/30 dark:bg-blue-950/10 blur-3xl rounded-full" />
      </div>

      {/* TOP HEADER: Centrally Aligned Title, Right Profile & Logout */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#fbfbf9]/95 dark:bg-[#0b0f17]/95 border-b border-stone-200/90 dark:border-slate-800 shadow-xs transition-colors duration-200">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
          
          {/* Left Side: Slide-In / Slide-Out Navigation Button & Logo */}
          <div className="flex items-center gap-3 w-1/4">
            {showSidebar && (
              <button
                type="button"
                onClick={() => setIsNavOpen(!isNavOpen)}
                className="flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer active:scale-95 border border-stone-800 dark:border-blue-500"
                aria-label="Toggle Navigation Menu"
                title={isNavOpen ? "Close Navigation" : "Open Navigation"}
              >
                {isNavOpen ? <X className="w-4 h-4 text-amber-400 dark:text-white" /> : <Menu className="w-4 h-4 text-amber-400 dark:text-white" />}
                <span className="font-bold text-xs">{isNavOpen ? 'Close' : 'Menu'}</span>
              </button>
            )}

            <NavLink to={user ? "/dashboard" : "/"} className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-2xl bg-stone-900 dark:bg-blue-600 text-amber-400 dark:text-white flex items-center justify-center shadow-md shadow-stone-900/10 dark:shadow-blue-900/20 group-hover:scale-105 transition-transform shrink-0">
                <Shield className="w-5 h-5 stroke-[2.4]" />
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xl font-black tracking-tight text-stone-900 dark:text-white flex items-center gap-1.5 leading-tight">
                  Kavach
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </span>
                <span className="text-[10px] font-bold text-stone-500 dark:text-slate-400 tracking-wider -mt-0.5 uppercase">
                  Money Copilot
                </span>
              </div>
            </NavLink>
          </div>

          {/* CENTER: Centrally Aligned Title */}
          <div className="w-2/4 flex items-center justify-center text-center">
            <div className="inline-flex items-center gap-2 py-1 px-3.5 bg-stone-100/90 dark:bg-slate-800/90 border border-stone-200/80 dark:border-slate-700 rounded-full shadow-xs">
              <span className="text-sm sm:text-base font-black text-stone-900 dark:text-white tracking-tight">
                🛡️ Kavach
              </span>
              <span className="text-stone-300 dark:text-slate-600">•</span>
              <span className="text-[11px] sm:text-xs font-bold text-stone-600 dark:text-slate-300 tracking-wide uppercase">
                Digital Money Copilot
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse hidden sm:inline-block" />
            </div>
          </div>

          {/* RIGHT: Profile Badge & Logout button on the RIGHT */}
          <div className="flex items-center justify-end gap-3 w-1/4">
            {user ? (
              <div className="flex items-center gap-3">
                {/* Profile Badge (Right Side) */}
                <div className="flex items-center gap-2.5 p-1.5 pr-3 bg-stone-100/80 dark:bg-slate-800/80 border border-stone-200/90 dark:border-slate-700 rounded-2xl shadow-xs">
                  <div className="relative">
                    <div className="w-9 h-9 rounded-xl bg-amber-400 dark:bg-blue-600 text-stone-900 dark:text-white font-black text-xs flex items-center justify-center shadow-sm">
                      {(user.full_name || user.name || 'U').charAt(0).toUpperCase()}
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-800" />
                  </div>
                  <div className="hidden md:flex flex-col text-left">
                    <span className="text-xs font-black text-stone-900 dark:text-white leading-tight max-w-[120px] truncate">
                      {user.full_name || user.name || 'Alex Rivera'}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 leading-none">
                      Active • Protected
                    </span>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  type="button"
                  onClick={onSignOut}
                  className="p-2 sm:px-3 sm:py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200/80 dark:border-rose-800/60 text-rose-700 dark:text-rose-400 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4 stroke-[2.2]" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <NavLink
                to="/auth"
                className="px-4 py-2 rounded-xl bg-stone-900 dark:bg-blue-600 hover:bg-stone-800 dark:hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-sm"
              >
                Sign In
              </NavLink>
            )}
          </div>

        </div>
      </header>

      {/* BODY WORKSPACE: Slide-In Sidebar + Main Content Area with Blur on open */}
      <div className="flex-1 flex w-full relative">
        
        {/* SLIDE-IN NAVIGATION SIDEBAR & BLURRED BACKDROP */}
        {showSidebar && (
          <>
            {/* Backdrop Blur Overlay: Blurs entire website behind the navigation drawer */}
            {isNavOpen && (
              <div
                onClick={() => setIsNavOpen(false)}
                className="fixed inset-0 z-40 bg-stone-900/40 backdrop-blur-md transition-all duration-300 animate-fade-in"
                aria-hidden="true"
              />
            )}

            <aside
              className={`fixed top-0 left-0 z-50 h-full w-72 sm:w-80 bg-white dark:bg-slate-900 border-r border-stone-200/90 dark:border-slate-800 p-6 flex flex-col justify-between shadow-2xl transition-transform duration-300 ease-in-out ${
                isNavOpen ? 'translate-x-0' : '-translate-x-full'
              }`}
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-stone-900 dark:bg-blue-600 text-amber-400 dark:text-white flex items-center justify-center shadow-sm">
                      <Shield className="w-4 h-4 stroke-[2.4]" />
                    </div>
                    <div>
                      <span className="text-lg font-black tracking-tight text-stone-900 dark:text-white flex items-center gap-1 leading-tight">
                        Kavach
                        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      </span>
                      <span className="text-[10px] font-bold text-stone-500 dark:text-slate-400 uppercase tracking-wider block">
                        Navigation Menu
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsNavOpen(false)}
                    className="w-8 h-8 rounded-xl bg-stone-100 dark:bg-slate-800 hover:bg-stone-200 dark:hover:bg-slate-700 text-stone-700 dark:text-slate-300 flex items-center justify-center cursor-pointer transition-colors"
                    aria-label="Slide out navigation"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <span className="text-[10px] font-black tracking-widest text-stone-400 dark:text-slate-500 uppercase block mb-3 pl-2">
                    Features
                  </span>

                  <nav className="space-y-2" aria-label="Sidebar Navigation">
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.to;

                      return (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          onClick={() => setIsNavOpen(false)}
                          className={`w-full p-3 rounded-2xl flex items-center gap-3 transition-all text-left group cursor-pointer ${
                            isActive
                              ? 'bg-stone-900 dark:bg-blue-600 text-white shadow-md font-bold'
                              : 'text-stone-600 dark:text-slate-300 hover:text-stone-950 dark:hover:text-white hover:bg-stone-100/80 dark:hover:bg-slate-800/80 font-medium'
                          }`}
                        >
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                              isActive
                                ? 'bg-amber-400 dark:bg-white text-stone-900 dark:text-blue-700 font-bold'
                                : 'bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-slate-300 group-hover:bg-stone-200 dark:group-hover:bg-slate-700'
                            }`}
                          >
                            <Icon className="w-4 h-4 stroke-[2.2]" />
                          </div>
                          <div>
                            <span className="text-xs sm:text-sm font-bold block leading-tight">
                              {item.label}
                            </span>
                            <span className={`text-[10px] block leading-tight ${isActive ? 'text-stone-300 dark:text-blue-100' : 'text-stone-400 dark:text-slate-500'}`}>
                              {item.desc}
                            </span>
                          </div>
                        </NavLink>
                      );
                    })}
                  </nav>
                </div>
              </div>

              {/* Drawer Footer: Theme Switcher */}
              <div className="pt-4 border-t border-stone-200/80 dark:border-slate-800">
                <div className="text-[10px] font-bold text-stone-400 dark:text-slate-500 uppercase tracking-wider mb-2 px-1">
                  Theme Switcher
                </div>
                <div className="grid grid-cols-2 p-1 bg-stone-100 dark:bg-slate-800 rounded-xl border border-stone-200 dark:border-slate-700 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setTheme('light')}
                    className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                      theme === 'light'
                        ? 'bg-white text-slate-900 shadow-xs font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                    aria-pressed={theme === 'light'}
                  >
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span>Light</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme('dark')}
                    className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                      theme === 'dark'
                        ? 'bg-slate-900 text-white shadow-xs font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                    aria-pressed={theme === 'dark'}
                  >
                    <Moon className="w-3.5 h-3.5 text-blue-400" />
                    <span>Dark</span>
                  </button>
                </div>
              </div>
            </aside>
          </>
        )}

        {/* MAIN LAPTOP CONTENT AREA: Centered, blurred when navigation tab is ON */}
        <main className={`flex-1 min-w-0 px-4 sm:px-8 lg:px-12 py-8 overflow-y-auto transition-all duration-300 ${
          isNavOpen ? 'filter blur-sm pointer-events-none select-none' : ''
        }`}>
          <div className="w-full max-w-6xl mx-auto">
            <Outlet context={{ user, onLogin }} />
          </div>
        </main>

      </div>

      {/* GLOBAL FLOATING CHATBOT WIDGET: Accessible ONLY inside authenticated app, NOT on landing page or auth */}
      {user && !isLandingPage && !isAuthPage && (
        <ChatWidget user={user} />
      )}

    </div>
  );
}
