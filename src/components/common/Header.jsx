import React from 'react';
import { Sparkles, Calendar, Bot, Home, Briefcase, Sun, Moon } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, isAdmin, setIsAdmin, theme, toggleTheme }) {
  const navItems = [
    { id: 'home', label: 'Inicio', icon: Home },
    { id: 'services', label: 'Catálogo & Precios', icon: Sparkles },
    { id: 'booking', label: 'Turnos & Agenda', icon: Calendar },
    { id: 'ai', label: 'Asistente IA', icon: Bot },
  ];

  return (
    <>
      {/* Top Navigation Header - Full Width & Responsive */}
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200 dark:border-slate-800/80 px-4 md:px-8 py-3 transition-all shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo Section */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <img 
              src={theme === 'dark' ? '/logo-moreno-dark.png' : '/logo-moreno.png'} 
              alt="Moreno Car Center" 
              className="h-11 md:h-13 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          {/* Desktop Navigation Tabs (Hidden on Mobile) */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-900/80 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id && !isAdmin;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setIsAdmin(false);
                    setActiveTab(item.id);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#DC1B46] text-white shadow-md shadow-[#DC1B46]/25'
                      : 'text-slate-600 dark:text-slate-300 hover:text-[#DC1B46] dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Area */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Live Operational Status */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Abierto • Sin Demora</span>
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              title={theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-[#DC1B46] transition-all cursor-pointer"
            >
              {theme === 'light' ? <Moon className="w-4 h-4 text-slate-700" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>

            {/* Admin Toggle Mode */}
            <button
              onClick={() => {
                setIsAdmin(!isAdmin);
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold transition-all duration-300 cursor-pointer ${
                isAdmin
                  ? 'bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950 shadow-lg scale-102'
                  : 'bg-slate-100 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:border-[#DC1B46]'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span className="hidden sm:inline">{isAdmin ? 'Portal Operacional' : 'Admin'}</span>
            </button>

            {/* Book Now Desktop CTA */}
            {!isAdmin && activeTab !== 'booking' && (
              <button
                onClick={() => setActiveTab('booking')}
                className="hidden xl:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#DC1B46] hover:bg-[#b81438] text-white font-extrabold text-sm shadow-lg shadow-[#DC1B46]/25 hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Reservar Turno</span>
              </button>
            )}
          </div>

        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-panel border-t border-slate-200 dark:border-slate-800 px-2 py-2 flex justify-around items-center shadow-2xl bg-white/95 dark:bg-slate-950/95">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id && !isAdmin;
          return (
            <button
              key={item.id}
              onClick={() => {
                setIsAdmin(false);
                setActiveTab(item.id);
              }}
              className={`flex flex-col items-center justify-center px-3 py-1 rounded-xl transition-all ${
                isActive ? 'text-[#DC1B46] font-extrabold scale-105' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[11px] leading-none">{item.label}</span>
            </button>
          );
        })}
        <button
          onClick={() => setIsAdmin(!isAdmin)}
          className={`flex flex-col items-center justify-center px-3 py-1 rounded-xl transition-all ${
            isAdmin ? 'text-[#DC1B46] font-extrabold scale-105' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Briefcase className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] leading-none">Admin</span>
        </button>
      </nav>
    </>
  );
}
