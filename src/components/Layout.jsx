import React, { useState } from 'react';
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
  X
} from 'lucide-react';
import ChatWidget from './ChatWidget';

export default function Layout({ user, onSignOut, onLogin }) {
  const location = useLocation();
  const [isNavOpen, setIsNavOpen] = useState(false);

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
    <div className="min-h-screen bg-[#fbfbf9] text-stone-900 font-sans flex flex-col selection:bg-amber-200">
      
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[54rem] h-[26rem] bg-gradient-to-b from-amber-100/60 via-orange-50/40 to-transparent blur-3xl rounded-full" />
        <div className="absolute top-72 -left-20 w-96 h-96 bg-emerald-100/30 blur-3xl rounded-full" />
        <div className="absolute top-96 -right-20 w-96 h-96 bg-blue-100/30 blur-3xl rounded-full" />
      </div>

      {/* TOP HEADER: Centrally Aligned Title, Right Profile & Logout */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#fbfbf9]/95 border-b border-stone-200/90 shadow-xs">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
          
          {/* Left Side: Slide-In / Slide-Out Navigation Button & Logo */}
          <div className="flex items-center gap-3 w-1/4">
            {showSidebar && (
              <button
                type="button"
                onClick={() => setIsNavOpen(!isNavOpen)}
                className="flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-all shadow-sm cursor-pointer active:scale-95 border border-stone-800"
                aria-label="Toggle Navigation Menu"
                title={isNavOpen ? "Close Navigation" : "Open Navigation"}
              >
                {isNavOpen ? <X className="w-4 h-4 text-amber-400" /> : <Menu className="w-4 h-4 text-amber-400" />}
                <span className="font-bold text-xs">{isNavOpen ? 'Close' : 'Menu'}</span>
              </button>
            )}

            <NavLink to={user ? "/dashboard" : "/"} className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-2xl bg-stone-900 text-amber-400 flex items-center justify-center shadow-md shadow-stone-900/10 group-hover:scale-105 transition-transform shrink-0">
                <Shield className="w-5 h-5 stroke-[2.4]" />
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xl font-black tracking-tight text-stone-900 flex items-center gap-1.5 leading-tight">
                  MONEYCRAFT
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </span>
                <span className="text-[10px] font-bold text-stone-500 tracking-wider -mt-0.5 uppercase">
                  Money Copilot
                </span>
              </div>
            </NavLink>
          </div>

          {/* CENTER: Centrally Aligned Title */}
          <div className="w-2/4 flex items-center justify-center text-center">
            <div className="inline-flex items-center gap-2 py-1 px-3.5 bg-stone-100/90 border border-stone-200/80 rounded-full shadow-xs">
              <span className="text-sm sm:text-base font-black text-stone-900 tracking-tight">
                🛡️ MONEYCRAFT
              </span>
              <span className="text-stone-300">•</span>
              <span className="text-[11px] sm:text-xs font-bold text-stone-600 tracking-wide uppercase">
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
                <div className="flex items-center gap-2.5 p-1.5 pr-3 bg-stone-100/80 border border-stone-200/90 rounded-2xl shadow-xs">
                  <div className="relative">
                    <div className="w-9 h-9 rounded-xl bg-amber-400 text-stone-900 font-black text-xs flex items-center justify-center shadow-sm">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'S'}
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                  </div>
                  <div className="hidden md:flex flex-col text-left">
                    <span className="text-xs font-black text-stone-900 leading-tight max-w-[120px] truncate">
                      {user.name}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-700 leading-none">
                      {user.persona === 'freelance' ? 'Creator' : user.persona === 'junior' ? 'Early Career' : 'Student'} • Protected
                    </span>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  type="button"
                  onClick={onSignOut}
                  title="Logout from MONEYCRAFT"
                  className="min-h-[40px] px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-rose-700 text-white border border-stone-800 hover:border-rose-800 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <NavLink
                to="/auth"
                className="min-h-[42px] px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Sign Up</span>
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
              className={`fixed top-0 left-0 z-50 h-full w-72 sm:w-80 bg-white border-r border-stone-200/90 p-6 flex flex-col justify-between shadow-2xl transition-transform duration-300 ease-in-out ${
                isNavOpen ? 'translate-x-0' : '-translate-x-full'
              }`}
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-stone-900 text-amber-400 flex items-center justify-center shadow-sm">
                      <Shield className="w-4 h-4 stroke-[2.4]" />
                    </div>
                    <div>
                      <span className="text-lg font-black tracking-tight text-stone-900 flex items-center gap-1 leading-tight">
                        MONEYCRAFT
                        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      </span>
                      <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                        Navigation Menu
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsNavOpen(false)}
                    className="w-8 h-8 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center cursor-pointer transition-colors"
                    aria-label="Slide out navigation"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <span className="text-[10px] font-black tracking-widest text-stone-400 uppercase block mb-3 pl-2">
                    Menu Items
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
                              ? 'bg-stone-900 text-white shadow-md shadow-stone-900/10 font-bold'
                              : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100/80 font-medium'
                          }`}
                        >
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                              isActive
                                ? 'bg-amber-400 text-stone-900 font-bold'
                                : 'bg-stone-100 text-stone-700 group-hover:bg-stone-200'
                            }`}
                          >
                            <Icon className="w-4 h-4 stroke-[2.2]" />
                          </div>
                          <div>
                            <span className="text-xs sm:text-sm font-bold block leading-tight">
                              {item.label}
                            </span>
                            <span className={`text-[10px] block leading-tight ${isActive ? 'text-stone-300' : 'text-stone-400'}`}>
                              {item.desc}
                            </span>
                          </div>
                        </NavLink>
                      );
                    })}
                  </nav>
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
