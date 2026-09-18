import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Shield, Wallet, Coins, ArrowUpRight } from 'lucide-react';

export default function Layout({ lang, setLang }) {
  const location = useLocation();

  const navItems = [
    {
      to: '/',
      label: lang === 'en' ? 'Shield' : 'शील्ड',
      sublabel: lang === 'en' ? 'Scam Check' : 'सुरक्षा जाँच',
      icon: Shield
    },
    {
      to: '/spend',
      label: lang === 'en' ? 'Spend' : 'स्पेंड',
      sublabel: lang === 'en' ? 'Payouts' : 'आय-व्यय',
      icon: Wallet
    },
    {
      to: '/save',
      label: lang === 'en' ? 'Save' : 'सेव',
      sublabel: lang === 'en' ? 'Leaks' : 'बचत लक्ष्य',
      icon: Coins
    }
  ];

  return (
    <div className="min-h-screen bg-[#fbfbf9] text-stone-900 font-sans flex flex-col justify-between selection:bg-amber-200">
      {/* Warm Ambient Backdrop Lights */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[42rem] h-[22rem] bg-gradient-to-b from-amber-100/60 via-orange-50/40 to-transparent blur-3xl rounded-full" />
        <div className="absolute top-72 -left-20 w-80 h-80 bg-emerald-100/30 blur-3xl rounded-full" />
        <div className="absolute top-96 -right-20 w-80 h-80 bg-blue-100/30 blur-3xl rounded-full" />
      </div>

      {/* TOP HEADER */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#fbfbf9]/90 border-b border-stone-200/80 transition-colors">
        <div className="max-w-md md:max-w-4xl mx-auto px-4 sm:px-6 h-18 py-3 flex items-center justify-between">
          {/* Left: Bold "Kavach" Logo */}
          <NavLink to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-stone-900 text-amber-400 flex items-center justify-center shadow-md shadow-stone-900/10 group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5 stroke-[2.4]" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-stone-900 flex items-center gap-1.5">
                Kavach
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </span>
              <span className="text-[11px] font-bold text-stone-500 tracking-wider -mt-1 uppercase">
                Money Copilot
              </span>
            </div>
          </NavLink>

          {/* Right: Functional English / Hindi Toggle Switch */}
          <div className="flex items-center" role="region" aria-label="Language selection">
            <div 
              className="flex items-center bg-stone-100 p-1 rounded-full border border-stone-300 shadow-inner"
              role="group"
              aria-label="Language switcher"
            >
              <button
                type="button"
                onClick={() => setLang('en')}
                aria-pressed={lang === 'en'}
                className={`min-h-[48px] min-w-[72px] px-3.5 text-sm font-bold rounded-full transition-all duration-200 flex items-center justify-center cursor-pointer ${
                  lang === 'en'
                    ? 'bg-stone-900 text-white shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLang('hi')}
                aria-pressed={lang === 'hi'}
                className={`min-h-[48px] min-w-[72px] px-3.5 text-sm font-bold rounded-full transition-all duration-200 flex items-center justify-center cursor-pointer ${
                  lang === 'hi'
                    ? 'bg-stone-900 text-white shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                हिन्दी
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* PAGE CONTENT CONTAINER (Padding-bottom accommodates sticky bottom nav) */}
      <main className="flex-1 w-full max-w-md md:max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-28 sm:pb-32">
        <Outlet context={{ lang }} />
      </main>

      {/* BOTTOM NAVIGATION (Sticky Bottom Tab Bar for Mobile & Desktop) */}
      <nav 
        className="fixed bottom-0 left-0 right-0 z-50 bg-[#fbfbf9]/95 backdrop-blur-lg border-t border-stone-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]"
        aria-label="Bottom Navigation"
      >
        <div className="max-w-md md:max-w-4xl mx-auto px-4 flex items-center justify-around h-20">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`flex flex-col items-center justify-center flex-1 min-h-[48px] min-w-[48px] py-1.5 rounded-2xl transition-all duration-200 ${
                  isActive
                    ? 'text-stone-950 font-extrabold'
                    : 'text-stone-500 hover:text-stone-800 font-medium'
                }`}
              >
                <div
                  className={`w-11 h-9 rounded-xl flex items-center justify-center mb-0.5 transition-all ${
                    isActive
                      ? 'bg-stone-900 text-amber-400 shadow-sm scale-105'
                      : 'text-stone-500 hover:bg-stone-200/60'
                  }`}
                >
                  <Icon className="w-5 h-5 stroke-[2.2]" />
                </div>
                <span className="text-xs tracking-tight">
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
