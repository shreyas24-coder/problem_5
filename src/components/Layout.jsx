import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  Shield,
  Wallet,
  LayoutDashboard,
  Target,
  HelpCircle,
  Sparkles,
  Bot,
  LogOut
} from 'lucide-react';

export default function Layout({ user, onSignOut, onLogin }) {
  const location = useLocation();

  const navItems = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard
    },
    {
      to: '/shield',
      label: 'Shield',
      icon: Shield
    },
    {
      to: '/spend',
      label: 'Tracker',
      icon: Wallet
    },
    {
      to: '/goals',
      label: 'Goals',
      icon: Target
    },
    {
      to: '/chat',
      label: 'Copilot',
      icon: Bot
    },
    {
      to: '/quiz',
      label: 'Quiz',
      icon: HelpCircle
    }
  ];

  const showBottomNav = user && location.pathname !== '/auth';

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
        <div className="max-w-md md:max-w-4xl mx-auto px-3.5 sm:px-6 h-18 py-3 flex items-center justify-between">
          
          {/* Left Side: Brand Logo + Enhanced Profile GUI */}
          <div className="flex items-center gap-3">
            <NavLink to={user ? "/dashboard" : "/"} className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-2xl bg-stone-900 text-amber-400 flex items-center justify-center shadow-md shadow-stone-900/10 group-hover:scale-105 transition-transform shrink-0">
                <Shield className="w-5 h-5 stroke-[2.4]" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xl font-black tracking-tight text-stone-900 flex items-center gap-1.5 leading-tight">
                  Kavach
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                </span>
                <span className="text-[10px] font-bold text-stone-500 tracking-wider -mt-0.5 uppercase">
                  Money Copilot
                </span>
              </div>
            </NavLink>

            {/* Shifted to Left: Upgraded Profile Card GUI */}
            {user && (
              <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l-2 border-stone-200/80">
                <div className="relative">
                  <div className="w-9 h-9 rounded-xl bg-stone-900 text-amber-400 font-black text-xs flex items-center justify-center shadow-sm">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'S'}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white"></span>
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-black text-stone-900 leading-tight max-w-[90px] sm:max-w-[140px] truncate">
                    {user.name}
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-700 leading-tight flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    {user.persona === 'freelance' ? 'Creator' : user.persona === 'junior' ? 'Early Career' : 'Student'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Right Side: Logout or Sign Up */}
          <div className="flex items-center gap-2">
            {user ? (
              <button
                type="button"
                onClick={onSignOut}
                title="Logout from Kavach"
                className="min-h-[40px] px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-rose-50 text-stone-700 hover:text-rose-700 border border-stone-200 hover:border-rose-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            ) : (
              <NavLink
                to="/auth"
                className="min-h-[42px] px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Sign Up</span>
              </NavLink>
            )}
          </div>

        </div>
      </header>

      {/* PAGE CONTENT CONTAINER */}
      <main className={`flex-1 w-full max-w-md md:max-w-4xl mx-auto px-3.5 sm:px-6 pt-5 ${showBottomNav ? 'pb-28 sm:pb-32' : 'pb-12 sm:pb-16'}`}>
        <Outlet context={{ user, onLogin }} />
      </main>

      {/* STICKY BOTTOM TAB BAR (Rendered strictly for authenticated users) */}
      {showBottomNav && (
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
      )}
    </div>
  );
}
