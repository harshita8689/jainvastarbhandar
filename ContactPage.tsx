import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  MessageCircle,
  Clock,
  ExternalLink,
  Send,
  Sparkles,
} from 'lucide-react';
import { InstagramIcon } from '../components/common/InstagramIcon';
import {
  BUSINESS_INFO,
  GOOGLE_MAPS_SEARCH_URL,
} from '../utils/constants';

export const ContactPage: React.FC = () => {
  const [customerName, setCustomerName] = useState('');
  const [inquiryType, setInquiryType] = useState('General Suit Inquiry');
  const [message, setMessage] = useState('');

  const handleSendMessageOnWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    const text = [
      `Namaste Jain Vastar Bhandar,`,
      customerName ? `My name is ${customerName}.` : '',
      `Inquiry: ${inquiryType}`,
      message ? `Message: ${message}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    const url = `https://wa.me/91${BUSINESS_INFO.whatsappPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-jvb-pink-600 bg-jvb-pink-50 border border-jvb-pink-200 px-3.5 py-1.5 rounded-full uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Connect with Our Clothing Store</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900">
          Contact Jain Vastar Bhandar
        </h1>
        <p className="text-sm text-gray-600">
          Have an inquiry about an unstitched suit, stock availability, or visiting our clothing store on Railway Road? We are just a message or call away.
        </p>
      </div>

      {/* Contact Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* WhatsApp & Orders Card */}
        <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-subtle space-y-4 hover:shadow-card transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Primary Order Channel
            </span>
            <h3 className="font-serif text-lg font-bold text-gray-900 mt-0.5">
              WhatsApp Ordering
            </h3>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            Send us product photos, inquiries, or SKU numbers directly on WhatsApp for instant confirmation.
          </p>
          <div className="pt-2">
            <a
              href={BUSINESS_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-5 py-2.5 rounded-lg shadow-sm transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat on +91 {BUSINESS_INFO.whatsappPhone}</span>
            </a>
          </div>
        </div>

        {/* Direct Phone Numbers Card */}
        <div className="bg-white p-6 rounded-2xl border border-jvb-pink-100 shadow-subtle space-y-4 hover:shadow-card transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-jvb-pink-50 text-jvb-pink-600 flex items-center justify-center">
            <Phone className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-jvb-pink-600 uppercase tracking-wider">
              Speak With Us
            </span>
            <h3 className="font-serif text-lg font-bold text-gray-900 mt-0.5">
              Phone Calls
            </h3>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            Call our store directly for urgent inquiries or directions to the showroom:
          </p>
          <div className="space-y-2 pt-1">
            <div>
              <span className="text-[11px] text-gray-500 block">Phone 1:</span>
              <a
                href={`tel:${BUSINESS_INFO.primaryPhone}`}
                className="text-sm font-bold text-jvb-wine-700 hover:text-jvb-pink-600 inline-flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>+91 {BUSINESS_INFO.primaryPhone}</span>
              </a>
            </div>
            <div>
              <span className="text-[11px] text-gray-500 block">Phone 2:</span>
              <a
                href={`tel:${BUSINESS_INFO.secondaryPhone}`}
                className="text-sm font-bold text-jvb-wine-700 hover:text-jvb-pink-600 inline-flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>+91 {BUSINESS_INFO.secondaryPhone}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Instagram Profile Card */}
        <div className="bg-white p-6 rounded-2xl border border-pink-100 shadow-subtle space-y-4 hover:shadow-card transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center">
            <InstagramIcon className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-pink-600 uppercase tracking-wider">
              Social Updates
            </span>
            <h3 className="font-serif text-lg font-bold text-gray-900 mt-0.5">
              Instagram
            </h3>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            Follow our Instagram handle for suit draping videos, new textile arrivals, and DM inquiries.
          </p>
          <div className="pt-2">
            <a
              href={BUSINESS_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white font-semibold text-xs px-5 py-2.5 rounded-lg shadow-sm transition-opacity hover:opacity-90"
            >
              <InstagramIcon className="w-4 h-4" />
              <span>{BUSINESS_INFO.instagramHandle}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Physical Showroom & Inquiry Form Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Physical Address Details */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-jvb-pink-100 shadow-subtle space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-lg bg-jvb-pink-50 text-jvb-pink-600">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-gray-900">
                Physical Showroom Location
              </h2>
              <p className="text-xs text-gray-500">Established 1977 in Gharaunda</p>
            </div>
          </div>

          <div className="p-4 bg-jvb-ivory rounded-xl border border-jvb-pink-100 space-y-2">
            <div className="font-serif font-bold text-base text-jvb-wine-800">
              Jain Vastar Bhandar (JVB)
            </div>
            <address className="not-italic text-sm text-gray-700 leading-relaxed">
              Railway Road, Gharaunda, <br />
              Karnal, Haryana – 132114, India.
            </address>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-jvb-pink-600" />
              <span>Visiting Hours</span>
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Open all days during regular retail market hours. Feel free to call us beforehand to confirm specific fabric availability or arrival time.
            </p>
          </div>

          <div className="pt-2">
            <a
              href={GOOGLE_MAPS_SEARCH_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-jvb-wine-800 hover:bg-jvb-wine-900 text-white font-medium text-xs px-5 py-2.5 rounded-lg transition-colors"
            >
              <span>Search on Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Quick WhatsApp Inquiry Builder Form */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-jvb-pink-100 shadow-subtle space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-gray-900">
                Direct WhatsApp Message
              </h2>
              <p className="text-xs text-gray-500">
                Type your inquiry below to open directly with 7015344280
              </p>
            </div>
          </div>

          <form onSubmit={handleSendMessageOnWhatsApp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Your Name (Optional)
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Anjali Sharma"
                className="w-full text-xs p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-jvb-pink-500 bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Inquiry Topic
              </label>
              <select
                value={inquiryType}
                onChange={(e) => setInquiryType(e.target.value)}
                className="w-full text-xs p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-jvb-pink-500 bg-gray-50 font-medium"
              >
                <option value="General Suit Inquiry">General Unstitched Suit Inquiry</option>
                <option value="Pure Cotton Suit Availability">Pure Cotton Suit Availability</option>
                <option value="Chanderi or Silk Festive Suits">Chanderi or Silk Festive Suits</option>
                <option value="Showroom Visit Guidance">Showroom Visit / Store Directions</option>
                <option value="Custom Order or Bulk Inquiries">Bulk Inquiry / Specific Weave</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Your Question or Required Suit Details
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Please let us know which color, fabric, or budget range you are looking for..."
                className="w-full text-xs p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-jvb-pink-500 bg-gray-50"
              />
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg text-xs shadow-sm transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>Send Message on WhatsApp (7015344280)</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
