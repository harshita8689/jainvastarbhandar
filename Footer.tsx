import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  MessageCircle,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { InstagramIcon } from './InstagramIcon';
import { BUSINESS_INFO, GOOGLE_MAPS_SEARCH_URL, buildGeneralWhatsAppUrl } from '../../utils/constants';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-jvb-wine-900 text-stone-200 border-t-4 border-jvb-pink-600">
      {/* Top Banner inside Footer */}
      <div className="bg-jvb-wine-800/60 border-b border-jvb-wine-700/60 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="font-serif text-xl sm:text-2xl text-white font-bold flex items-center justify-center md:justify-start gap-2">
              <Sparkles className="w-5 h-5 text-jvb-pink-400" />
              Looking for Authentic Unstitched Ladies' Suits?
            </h3>
            <p className="text-stone-300 text-sm mt-1">
              Connect directly with our Gharaunda clothing store on WhatsApp for unstitched suit inquiries and personal assistance.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={buildGeneralWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-full text-sm shadow-md transition-all hover:scale-105"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp: 7015344280</span>
            </a>
            <a
              href={BUSINESS_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-jvb-pink-600 hover:bg-jvb-pink-700 text-white font-semibold px-6 py-3 rounded-full text-sm shadow-md transition-all hover:scale-105"
            >
              <InstagramIcon className="w-4 h-4" />
              <span>Instagram {BUSINESS_INFO.instagramHandle}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-jvb-pink-500 to-jvb-wine-700 flex flex-col items-center justify-center text-white font-serif font-bold text-base shadow">
                <span>JVB</span>
              </div>
              <div>
                <h4 className="font-serif text-lg font-bold text-white tracking-wide">
                  Jain Vastar Bhandar
                </h4>
                <p className="text-xs text-jvb-pink-300 font-medium uppercase tracking-wider">
                  Established 1977
                </p>
              </div>
            </div>
            <p className="text-stone-300 text-sm leading-relaxed">
              Serving patrons with handpicked, genuine unstitched ladies' suits. Pure cotton, Chanderi silk, georgette, and organza unstitched suits curated with 45+ years of family trust.
            </p>
            <div className="pt-2">
              <span className="inline-block bg-jvb-wine-800 text-jvb-pink-200 text-xs px-3 py-1 rounded-full border border-jvb-pink-800/40">
                Pure Unstitched Ladies' Suits Only
              </span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-serif text-base font-bold text-white mb-4 tracking-wide border-b border-jvb-wine-700/60 pb-2">
              Browse Collections
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  to="/collection"
                  className="hover:text-jvb-pink-300 transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-jvb-pink-400" />
                  <span>All Unstitched Suits</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/collection?fabric=Pure+Cotton"
                  className="hover:text-jvb-pink-300 transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-jvb-pink-400" />
                  <span>Pure Cotton Suits</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/collection?fabric=Chanderi+Silk"
                  className="hover:text-jvb-pink-300 transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-jvb-pink-400" />
                  <span>Chanderi & Silk Suits</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/collection?fabric=Georgette"
                  className="hover:text-jvb-pink-300 transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-jvb-pink-400" />
                  <span>Georgette Unstitched Suits</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-jvb-pink-300 transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-jvb-pink-400" />
                  <span>About Our Heritage (1977)</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-jvb-pink-300 transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-jvb-pink-400" />
                  <span>Contact & Store Visit</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Physical Address */}
          <div>
            <h4 className="font-serif text-base font-bold text-white mb-4 tracking-wide border-b border-jvb-wine-700/60 pb-2">
              Physical Clothing Store
            </h4>
            <div className="space-y-3 text-sm text-stone-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-jvb-pink-400 mt-1 flex-shrink-0" />
                <address className="not-italic leading-relaxed">
                  <strong>Jain Vastar Bhandar</strong>
                  <br />
                  Railway Road, Gharaunda,
                  <br />
                  Karnal, Haryana – 132114, India.
                </address>
              </div>
              <div className="pt-1">
                <a
                  href={GOOGLE_MAPS_SEARCH_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-jvb-pink-300 hover:text-white font-medium underline"
                >
                  <span>Open Address on Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p className="text-xs text-stone-400 italic">
                Visitors are welcome at our clothing store on Railway Road during regular shop hours.
              </p>
            </div>
          </div>

          {/* Column 4: Contact & Inquiries */}
          <div>
            <h4 className="font-serif text-base font-bold text-white mb-4 tracking-wide border-b border-jvb-wine-700/60 pb-2">
              Customer Support
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-jvb-pink-400 flex-shrink-0" />
                <div>
                  <div className="text-xs text-stone-400">Primary Contact:</div>
                  <a
                    href={`tel:${BUSINESS_INFO.primaryPhone}`}
                    className="text-white hover:text-jvb-pink-300 font-semibold"
                  >
                    +91 {BUSINESS_INFO.primaryPhone}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <div>
                  <div className="text-xs text-stone-400">WhatsApp & Phone:</div>
                  <a
                    href={BUSINESS_INFO.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-emerald-300 font-semibold"
                  >
                    +91 {BUSINESS_INFO.whatsappPhone}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <InstagramIcon className="w-4 h-4 text-pink-400 flex-shrink-0" />
                <div>
                  <div className="text-xs text-stone-400">Instagram Handle:</div>
                  <a
                    href={BUSINESS_INFO.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-pink-300 font-semibold"
                  >
                    {BUSINESS_INFO.instagramHandle}
                  </a>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-1 text-xs text-stone-400 hover:text-jvb-pink-300 transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Shopkeeper Admin Portal</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright & disclaimers */}
       
{/* Bottom copyright & disclaimers */}
<div className="mt-12 pt-8 border-t border-jvb-wine-800 text-center sm:flex sm:justify-between sm:items-center sm:text-left text-xs text-stone-400 gap-4">
  <p>
    © {BUSINESS_INFO.established} – {new Date().getFullYear()}{" "}
    {BUSINESS_INFO.name}. All rights reserved.
  </p>

  <p>
    Built by ~ Er. Harshita Jain
    <br />
    <a
      href="mailto:jharshita107@gmail.com"
      className="inline-block mt-1 hover:text-jvb-pink-300 underline underline-offset-4 transition-colors"
    >
      jharshita107@gmail.com
    </a>
  </p>

  <p className="mt-2 sm:mt-0">
    Specializing exclusively in unstitched ladies' suit fabrics.
    Orders confirmed directly via WhatsApp.
  </p>
</div>
      </div>
    </footer>
  );
};
