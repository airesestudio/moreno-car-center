import React, { useState, useEffect } from 'react';
import { MessageCircle, Sparkles } from 'lucide-react';
import Header from './components/common/Header';
import HomeShowcase from './components/home/HomeShowcase';
import ServiceShowcase from './components/catalog/ServiceShowcase';
import BookingWizard from './components/booking/BookingWizard';
import BookingChatAssistant from './components/ai/BookingChatAssistant';
import AdminDashboard from './components/admin/AdminDashboard';
import MobileEmulator from './components/common/MobileEmulator';
import { initGTM } from './services/gtm';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedPackageForBooking, setSelectedPackageForBooking] = useState(null);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    initGTM();
    // Ensure root class matches initial theme
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleSelectServiceForBooking = (srv) => {
    setSelectedPackageForBooking(srv);
    setIsAdmin(false);
    setActiveTab('ai');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-[#090D16] dark:text-slate-100 selection:bg-[#DC1B46] selection:text-white transition-colors duration-300">
      
      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col pb-16 md:pb-0">
        {isAdmin ? (
          <AdminDashboard />
        ) : (
          <>
            {activeTab === 'home' && (
              <HomeShowcase
                onSelectBooking={(srv) => {
                  if (srv && srv.id) {
                    handleSelectServiceForBooking(srv);
                  } else {
                    setSelectedPackageForBooking(null);
                    setActiveTab('booking');
                  }
                }}
                onSelectCatalog={() => setActiveTab('services')}
                onSelectAI={() => setActiveTab('ai')}
              />
            )}

            {activeTab === 'services' && (
              <ServiceShowcase
                onSelectService={handleSelectServiceForBooking}
              />
            )}

            {activeTab === 'booking' && (
              <BookingWizard
                preselectedService={selectedPackageForBooking}
                onBookingComplete={() => setActiveTab('home')}
              />
            )}

            {activeTab === 'ai' && (
              <BookingChatAssistant
                preselectedService={selectedPackageForBooking}
                onSelectService={handleSelectServiceForBooking}
                onClose={() => setActiveTab('home')}
              />
            )}
          </>
        )}
      </main>

      {/* Red Perfectly Round Floating Action Button to Open Chat (Not on Home) */}
      {!isAdmin && activeTab !== 'ai' && activeTab !== 'home' && (
        <button
          onClick={() => {
            setSelectedPackageForBooking(null);
            setActiveTab('ai');
          }}
          className="fixed bottom-24 right-5 md:right-8 z-[60] w-14 h-14 rounded-full bg-[#DC1B46] hover:bg-[#b81438] text-white flex items-center justify-center shadow-[0_8px_25px_rgba(220,27,70,0.65)] hover:scale-110 active:scale-95 transition-all cursor-pointer border-2 border-white group"
          title="Abrir Chat de Turnos"
        >
          <MessageCircle className="w-7 h-7 fill-white/20 stroke-[2.3]" />
          <span className="flex h-3 w-3 absolute top-0 right-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border border-white"></span>
          </span>
        </button>
      )}

      {/* Floating Smartphone Emulator Mode */}
      <MobileEmulator />
    </div>
  );
}
