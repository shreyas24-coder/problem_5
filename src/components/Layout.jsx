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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
  const showSidebar = user && !isAuthPage;

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
          
          {/* Left Side: Mobile Menu Toggle or Brand Quick-Link */}
          <div className="flex items-center gap-3 w-1/4">
            {showSidebar && (
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden w-10 h-10 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center cursor-pointer transition-colors"
                aria-label="Toggle Navigation Menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}

            <NavLink to={user ? "/dashboard" : "/"} className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-2xl bg-stone-900 text-amber-400 flex items-center justify-center shadow-md shadow-stone-900/10 group-hover:scale-105 transition-transform shrink-0">
                <Shield className="w-5 h-5 stroke-[2.4]" />
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xl font-black tracking-tight text-stone-900 flex items-center gap-1.5 leading-tight">
                  Kavach
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
                🛡️ Kavach
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
                  title="Logout from Kavach"
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

      {/* BODY WORKSPACE: Vertical Sidebar on the Left + Centered Main Content Area */}
      <div className="flex-1 flex w-full relative">
        
        {/* VERTICAL LEFT SIDEBAR (Desktop Fixed / Mobile Responsive Drawer) */}
        {showSidebar && (
          <>
            {/* Mobile Backdrop */}
            {isMobileMenuOpen && (
              <div
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 z-40 bg-stone-900/40 backdrop-blur-xs lg:hidden"
              />
            )}

            <aside
              className={`fixed lg:sticky top-20 left-0 z-40 h-[calc(100vh-80px)] w-64 bg-white border-r border-stone-200/90 p-5 flex flex-col justify-between shrink-0 shadow-xs transition-transform duration-300 ${
                isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
              }`}
            >
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-black tracking-widest text-stone-400 uppercase block mb-3 pl-2">
                    Navigation
                  </span>

                  <nav className="space-y-1.5" aria-label="Sidebar Navigation">
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.to;

                      return (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          onClick={() => setIsMobileMenuOpen(false)}
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

              {/* Sidebar Footer: Security & Protection Badge */}
              <div className="pt-4 border-t border-stone-100">
                <div className="p-3.5 bg-stone-50 border border-stone-200/80 rounded-2xl text-left space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800">
                    <Lock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>256-Bit Protection</span>
                  </div>
                  <p className="text-[11px] text-stone-500 leading-tight">
                    Non-custodial • On-device PIN security • Zero tracking
                  </p>
                </div>
              </div>
            </aside>
          </>
        )}

        {/* MAIN LAPTOP CONTENT AREA: Centered and Spacious */}
        <main className="flex-1 min-w-0 px-4 sm:px-8 lg:px-12 py-8 overflow-y-auto">
          <div className="w-full max-w-6xl mx-auto">
            <Outlet context={{ user, onLogin }} />
          </div>
        </main>

      </div>

      {/* GLOBAL FLOATING CHATBOT WIDGET: Accessible across every page */}
      <ChatWidget user={user} />

    </div>
  );
}
