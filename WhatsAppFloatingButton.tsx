import React from 'react';
import { MessageCircle } from 'lucide-react';
import { BUSINESS_INFO, buildGeneralWhatsAppUrl } from '../../utils/constants';

export const WhatsAppFloatingButton: React.FC = () => {
  return (
    <aside
      aria-label="WhatsApp quick chat"
      className="fixed bottom-6 right-6 z-50 flex items-center group pointer-events-auto"
    >
      {/* Tooltip on hover */}
      <div className="hidden sm:block mr-3 bg-white text-gray-800 text-xs font-semibold py-1.5 px-3 rounded-full shadow-lg border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
        Order / Inquire on WhatsApp: {BUSINESS_INFO.whatsappPhone}
      </div>

      {/* Floating Action Button */}
      <a
        href={buildGeneralWhatsAppUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-emerald-300 animate-pulse hover:animate-none"
        aria-label="Chat with Jain Vastar Bhandar on WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
      </a>
    </aside>
  );
};
