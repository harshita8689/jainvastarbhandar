import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { WhatsAppFloatingButton } from '../components/common/WhatsAppFloatingButton';
import { ConfigBanner } from '../components/common/ConfigBanner';

export const StorefrontLayout: React.FC = () => {
  const { pathname } = useLocation();

  // Scroll to top on route navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-jvb-ivory selection:bg-pink-100 selection:text-jvb-wine-800">
      <ConfigBanner />
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <WhatsAppFloatingButton />
      <Footer />
    </div>
  );
};
