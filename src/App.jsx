import React, { useState, useEffect } from 'react';
import Header from './components/common/Header';
import HomeShowcase from './components/home/HomeShowcase';
import ServiceShowcase from './components/catalog/ServiceShowcase';
import BookingWizard from './components/booking/BookingWizard';
import BookingChatAssistant from './components/ai/BookingChatAssistant';
import AdminDashboard from './components/admin/AdminDashboard';
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
    setActiveTab('booking');
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
      <main className="flex-1 flex flex-col">
        {isAdmin ? (
          <AdminDashboard />
        ) : (
          <>
            {activeTab === 'home' && (
              <HomeShowcase
                onSelectBooking={() => {
                  setSelectedPackageForBooking(null);
                  setActiveTab('booking');
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
                onSelectService={handleSelectServiceForBooking}
              />
            )}
          </>
        )}
      </main>

    </div>
  );
}
