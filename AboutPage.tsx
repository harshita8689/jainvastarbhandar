import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Scissors,
  MapPin,
  Clock,
  ArrowRight,
  MessageCircle,
  HeartHandshake,
  Layers,
} from 'lucide-react';
import { buildGeneralWhatsAppUrl } from '../utils/constants';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16 sm:space-y-20">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-jvb-pink-600 bg-jvb-pink-50 border border-jvb-pink-200 px-3.5 py-1.5 rounded-full uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Established 1977 • Gharaunda, Haryana</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-gray-900 tracking-tight">
          A Legacy of Pure Unstitched Ladies' Suit Fabrics
        </h1>
        <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
          For more than 45 years, Jain Vastar Bhandar has stood for fabric integrity, meticulous curation, and personal family service on Railway Road, Gharaunda.
        </p>
      </div>

      {/* Story Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-jvb-wine-700 uppercase tracking-wider">
            <Clock className="w-4 h-4 text-jvb-pink-600" />
            <span>Founded in 1977</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 leading-snug">
            Rooted in Tradition, Tailored to You
          </h2>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            Jain Vastar Bhandar was founded in 1977 in the historic market town of Gharaunda (Karnal district, Haryana). From our modest beginnings on Railway Road, our founding philosophy was simple: provide discerning patrons with genuine, uncompromised textiles.
          </p>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            While modern retail has flooded the market with mass-produced ready-made clothes, we have steadfastly chosen a different path. We specialize exclusively in unstitched ladies' suits, because we know true elegance lies in bespoke tailoring — where the fabric is chosen with love and tailored to your exact measurements.
          </p>
        </div>

        <div className="lg:col-span-6">
          <div className="bg-gradient-to-br from-jvb-pink-100/50 via-jvb-ivory to-white p-6 sm:p-8 rounded-2xl border border-jvb-pink-200 shadow-subtle space-y-6">
            <h3 className="font-serif text-xl font-bold text-jvb-wine-800 border-b border-jvb-pink-200/60 pb-3">
              Our Core Principles
            </h3>
            <div className="space-y-4 text-sm text-gray-800">
              <div className="flex items-start gap-3">
                <Scissors className="w-5 h-5 text-jvb-pink-600 mt-1 flex-shrink-0" />
                <div>
                  <strong>Pure Unstitched Ladies' Suits Only:</strong>
                  <p className="text-xs text-gray-600 mt-0.5">
                    We strictly and exclusively sell unstitched ladies' suits. We do not sell sarees, stitched clothes, kurtis, or other apparel. Every item in our store is a complete unstitched suit.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Layers className="w-5 h-5 text-jvb-pink-600 mt-1 flex-shrink-0" />
                <div>
                  <strong>Authentic Regional Handpicks:</strong>
                  <p className="text-xs text-gray-600 mt-0.5">
                    From breathable fine-count cotton suits to artisanal Chanderi weaves, rich modal silk, and georgette suits, our collection represents India's finest unstitched suits.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <HeartHandshake className="w-5 h-5 text-jvb-pink-600 mt-1 flex-shrink-0" />
                <div>
                  <strong>Direct Family Connection:</strong>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Whether you walk into our Railway Road clothing store or message us from across India on WhatsApp, you speak directly with our family store owners.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Address & Presence Callout */}
      <div className="bg-jvb-wine-900 text-white rounded-2xl p-8 sm:p-12 shadow-xl">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-pink-300 text-xs font-semibold uppercase tracking-wider">
              <MapPin className="w-4 h-4" />
              <span>Gharaunda, Karnal, Haryana</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Visit Our Clothing Store on Railway Road
            </h3>
            <p className="text-stone-300 text-sm max-w-xl">
              Railway Road, Gharaunda, Karnal, Haryana – 132114, India. Experience the touch and drape of our unstitched suits in person.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/collection"
              className="inline-flex items-center justify-center gap-2 bg-jvb-pink-600 hover:bg-jvb-pink-700 text-white font-semibold px-6 py-3 rounded-full text-sm shadow transition-all"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href={buildGeneralWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-full text-sm shadow transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Message on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
