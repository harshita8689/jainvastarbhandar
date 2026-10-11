// import React, { useEffect, useState } from 'react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
  Compass,
  Scissors,
  HeartHandshake,
  ShoppingBag,
  Award,
} from 'lucide-react';
import { InstagramIcon } from '../components/common/InstagramIcon';
import { ProductCard } from '../components/common/ProductCard';
import { ProductGridSkeleton } from '../components/common/LoadingSkeleton';
import { productService } from '../services/productService';
import type { Product } from '../types';
import { BUSINESS_INFO, buildGeneralWhatsAppUrl } from '../utils/constants';

export const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadFeatured() {
      setLoading(true);
      const { products, error } = await productService.getFeaturedProducts(8);
      if (isMounted) {
        setFeaturedProducts(products);
        setError(error);
        setLoading(false);
      }
    }
    loadFeatured();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-jvb-pink-50/70 via-jvb-ivory to-white pt-8 pb-16 sm:pt-14 sm:pb-24 border-b border-jvb-pink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Messaging */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-jvb-pink-100/80 text-jvb-wine-700 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide border border-jvb-pink-200">
                <Sparkles className="w-3.5 h-3.5 text-jvb-pink-600" />
                <span>Elegance Woven Since 1977 • Gharaunda, Karnal</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-[1.15]">
                Pure Unstitched <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-jvb-pink-600 to-jvb-wine-700">
                  Ladies' Suits
                </span>{' '}
                from Top Brands
              </h1>

              {/* Brand Announcement Pill */}
              <div className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs font-medium text-stone-700 bg-white/80 backdrop-blur-sm px-3.5 py-2 rounded-xl border border-rose-200 shadow-sm">
                <span className="font-bold text-rose-800 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-rose-600" /> Stockists of:
                </span>
                <span className="font-semibold text-stone-900">Ganga</span>
                <span>•</span>
                <span className="font-semibold text-stone-900">Krupali</span>
                <span>•</span>
                <span className="text-stone-500">& Handpicked Heritage Mills</span>
              </div>

              <p className="text-base sm:text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
                Discover authentic unstitched suit materials from India's premier brands like{' '}
                <strong>Ganga</strong> and <strong>Krupali</strong> alongside curated handpicked fabrics.
                Fine count pure cotton, regal Chanderi silk, flowy georgette, and pure organza dupattas
                ready for your bespoke tailoring.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/collection"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-jvb-pink-600 hover:bg-jvb-pink-700 text-white font-semibold px-8 py-3.5 rounded-full text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Explore Unstitched Suits</span>
                </Link>

                <a
                  href={buildGeneralWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-emerald-700 font-semibold px-6 py-3.5 rounded-full text-base border-2 border-emerald-600 shadow-sm transition-all"
                >
                  <MessageCircle className="w-5 h-5 text-emerald-600" />
                  <span>Order on WhatsApp</span>
                </a>
              </div>

              {/* Trust badges */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-jvb-pink-100 text-center lg:text-left">
                <div>
                  <div className="font-serif font-bold text-xl text-jvb-wine-700">1977</div>
                  <div className="text-xs text-gray-600">Established Store</div>
                </div>
                <div>
                  <div className="font-serif font-bold text-xl text-jvb-wine-700">Ganga & Krupali</div>
                  <div className="text-xs text-gray-600">Authentic Labels</div>
                </div>
                <div>
                  <div className="font-serif font-bold text-xl text-jvb-wine-700">100% Pure</div>
                  <div className="text-xs text-gray-600">Unstitched Suits Only</div>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Decorative border container */}
                <div className="absolute -inset-2 bg-gradient-to-r from-jvb-pink-400 to-jvb-wine-600 rounded-2xl opacity-20 blur-lg" />
                <div className="relative bg-white rounded-2xl p-3 shadow-elevated border border-jvb-pink-100">
                  <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-stone-100">
                    <img
                      src="/images/image.png"
                      alt="Ganga & Krupali Brand Unstitched Ladies Suit - Jain Vastar Bhandar"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-jvb-wine-950/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-rose-700 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                          Premium Unstitched Suit
                        </span>
                        <span className="bg-white/20 backdrop-blur-sm text-pink-100 text-[10px] font-medium px-2 py-0.5 rounded">
                          Ganga & Krupali Collection
                        </span>
                      </div>
                      <h4 className="font-serif font-bold text-lg sm:text-xl mt-1 text-white">
                        Festive Embroidered & Daily Wear Suits
                      </h4>
                      <p className="text-xs text-stone-200 mt-0.5">
                        Top (2.5m) • Bottom (2.5m) • Pure Dupatta (2.25m+)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DEDICATED BRANDS SHOWCASE SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold text-rose-700 uppercase tracking-widest bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
            Authorized Suit Stockists
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-gray-900 mt-2">
            Featuring Ganga, Krupali & Premier Indian Brands
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-2.5 leading-relaxed">
            At Jain Vastar Bhandar, we take pride in offering genuine unstitched suit materials from
            India's most celebrated suit brands, backed by 45+ years of family trust in Gharaunda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto justify-center">
          {/* Brand 1: Ganga */}
          <div className="bg-white rounded-2xl overflow-hidden border border-rose-100 shadow-subtle hover:shadow-card transition-all duration-300 group flex flex-col justify-between">
            <div>
              <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
                <img
                  src="/images/image.png"
                  alt="Ganga Brand Unstitched Suits"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-md shadow-sm border border-rose-100">
                  <span className="font-serif font-bold text-xs tracking-wider text-rose-900 uppercase">
                    Ganga Fashions
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-serif text-lg font-bold text-gray-900 mb-1">
                  Ganga Unstitched Suits
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed mb-3">
                  Celebrated for royal pure pashmina, digital silk prints, fine jam cotton kurtas, and pure bamber silk dupattas.
                </p>
                <div className="flex flex-wrap gap-1 text-[11px] text-rose-700 font-medium">
                  <span className="bg-rose-50 px-2 py-0.5 rounded">Pure Pashmina</span>
                  <span className="bg-rose-50 px-2 py-0.5 rounded">Digital Silk</span>
                  <span className="bg-rose-50 px-2 py-0.5 rounded">Jam Cotton</span>
                </div>
              </div>
            </div>
            <div className="p-5 pt-0">
              <Link
                to="/collection?search=Ganga"
                className="w-full py-2.5 px-3 bg-rose-50 hover:bg-rose-700 text-rose-800 hover:text-white rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
              >
                <span>View Ganga Suits</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Brand 2: Krupali */}
          <div className="bg-white rounded-2xl overflow-hidden border border-rose-100 shadow-subtle hover:shadow-card transition-all duration-300 group flex flex-col justify-between">
            <div>
              <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
                <img
                  src="/images/image.png"
                  alt="Krupali Brand Designer Unstitched Suits"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-md shadow-sm border border-rose-100">
                  <span className="font-serif font-bold text-xs tracking-wider text-rose-900 uppercase">
                    Krupali Suits
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-serif text-lg font-bold text-gray-900 mb-1">
                  Krupali Designer Suits
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed mb-3">
                  Famous for exquisite pastel shades, intricate neckline resham threadwork, and sheer pure organza dupattas.
                </p>
                <div className="flex flex-wrap gap-1 text-[11px] text-rose-700 font-medium">
                  <span className="bg-rose-50 px-2 py-0.5 rounded">Organza Dupatta</span>
                  <span className="bg-rose-50 px-2 py-0.5 rounded">Resham Work</span>
                  <span className="bg-rose-50 px-2 py-0.5 rounded">Pastels</span>
                </div>
              </div>
            </div>
            <div className="p-5 pt-0">
              <Link
                to="/collection?search=Krupali"
                className="w-full py-2.5 px-3 bg-rose-50 hover:bg-rose-700 text-rose-800 hover:text-white rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
              >
                <span>View Krupali Suits</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Brand 3: JVB Handpicked Heritage */}
          <div className="bg-white rounded-2xl overflow-hidden border border-rose-100 shadow-subtle hover:shadow-card transition-all duration-300 group flex flex-col justify-between">
            <div>
              <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
                <img
                  src="https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80"
                  alt="JVB Handpicked Suits"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-md shadow-sm border border-rose-100">
                  <span className="font-serif font-bold text-xs tracking-wider text-rose-900 uppercase">
                    JVB Handpicked
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-serif text-lg font-bold text-gray-900 mb-1">
                  JVB Exclusive Handpicks
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed mb-3">
                  Directly sourced from trusted master weavers across India since 1977. 100% pure 60x60 cotton and pure georgettes.
                </p>
                <div className="flex flex-wrap gap-1 text-[11px] text-rose-700 font-medium">
                  <span className="bg-rose-50 px-2 py-0.5 rounded">60x60 Cotton</span>
                  <span className="bg-rose-50 px-2 py-0.5 rounded">Since 1977</span>
                  <span className="bg-rose-50 px-2 py-0.5 rounded">Gharaunda</span>
                </div>
              </div>
            </div>
            <div className="p-5 pt-0">
              <Link
                to="/collection"
                className="w-full py-2.5 px-3 bg-rose-50 hover:bg-rose-700 text-rose-800 hover:text-white rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
              >
                <span>View Handpicked</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FABRIC WEAVES CATEGORY CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-jvb-pink-600 uppercase tracking-widest">
            Unstitched Suit Materials
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
            Explore Unstitched Suits By Fabric
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            Every suit piece in our catalog is an unstitched ladies' suit with generous cut lengths,
            giving you complete freedom to tailor according to your custom fit.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            {
              name: 'Pure Cotton Suits',
              fabric: 'Pure Cotton',
              desc: '60x60 breathable summer & daily suits',
              image:
                "/images/cotton.png",
            },
            {
              name: 'Chanderi Silk Suits',
              fabric: 'Chanderi Silk',
              desc: 'Zari woven festive unstitched suits',
              image:
                'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=500&q=80',
            },
            {
              name: 'Georgette Suits',
              fabric: 'Georgette',
              desc: 'Graceful drape & embroidered unstitched suits',
              image:
                '/images/georgette.png',
            },
            {
              name: 'Organza & Modal Suits',
              fabric: 'Organza',
              desc: 'Luxury sheer & modal silk unstitched suits',
              image:
                'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=500&q=80',
            },
          ].map((cat, idx) => (
            <Link
              key={idx}
              to={`/collection?fabric=${encodeURIComponent(cat.fabric)}`}
              className="group relative rounded-xl overflow-hidden shadow-subtle hover:shadow-card border border-jvb-pink-100 bg-white transition-all duration-300 hover:-translate-y-1"
            >
              <div className="aspect-[3/4] overflow-hidden bg-stone-100">
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-serif font-bold text-base sm:text-lg">{cat.name}</h3>
                  <p className="text-[11px] text-stone-200 line-clamp-1">{cat.desc}</p>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-pink-300 mt-1 group-hover:text-white">
                    <span>View Fabrics</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED UNSTITCHED SUITS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-jvb-pink-600 uppercase tracking-widest">
              Live Store Inventory
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
              Featured Unstitched Suits
            </h2>
          </div>
          <Link
            to="/collection"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-jvb-pink-600 hover:text-jvb-wine-700"
          >
            <span>View Full Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <ProductGridSkeleton count={4} />
        ) : error ? (
          <div className="text-center py-12 bg-pink-50/50 rounded-2xl border border-jvb-pink-100 p-6">
            <p className="text-sm text-gray-600 mb-4">{error}</p>
            <Link
              to="/collection"
              className="inline-block bg-jvb-pink-600 text-white px-5 py-2 rounded-lg text-sm font-medium"
            >
              Browse Catalog
            </Link>
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-jvb-pink-200 p-8 max-w-lg mx-auto">
            <p className="font-serif text-lg font-bold text-gray-800 mb-2">
              Catalog Live on Supabase
            </p>
            <p className="text-sm text-gray-600 mb-6">
              Manage your Ganga, Krupali, and unstitched suit products in the admin panel to display them here instantly.
            </p>
            <Link
              to="/admin"
              className="inline-block bg-jvb-pink-600 hover:bg-jvb-pink-700 text-white font-medium px-5 py-2.5 rounded-lg text-sm"
            >
              Open Admin Portal
            </Link>
          </div>
        )}
      </section>

      {/* BRAND STORY */}
      <section className="bg-gradient-to-r from-jvb-wine-900 via-jvb-wine-800 to-jvb-wine-900 text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 bg-jvb-pink-500/20 text-pink-200 px-3 py-1 rounded-full text-xs font-semibold tracking-wider border border-pink-400/30">
                <Scissors className="w-3.5 h-3.5 text-pink-300" />
                <span>Our Heritage & Focus</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white tracking-tight leading-snug">
                Jain Vastar Bhandar <br />
                <span className="text-pink-300 font-normal italic">
                  Elegance Woven Since 1977
                </span>
              </h2>

              <p className="text-stone-200 text-base leading-relaxed">
                Established in 1977 on Railway Road, Gharaunda (Karnal, Haryana), Jain Vastar Bhandar has remained dedicated to one specialized craft: providing women with pure, authentic, unstitched suit fabrics.
              </p>

              <p className="text-stone-300 text-sm leading-relaxed">
                We believe that every woman deserves an outfit tailored to her exact fit and personal style. By specializing strictly in unstitched suit materials from leading houses like Ganga and Krupali alongside handpicked textiles, we preserve the time-honored Indian tradition of bespoke tailoring.
              </p>

              <div className="pt-2 flex flex-wrap gap-4">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 bg-white text-jvb-wine-800 hover:bg-stone-100 font-semibold px-6 py-2.5 rounded-full text-sm transition-all"
                >
                  <span>Read Full Brand Story</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 border border-pink-300 text-pink-200 hover:text-white hover:border-white font-medium px-6 py-2.5 rounded-full text-sm transition-all"
                >
                  <Compass className="w-4 h-4" />
                  <span>Visit Our Store</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 bg-jvb-wine-950/60 p-6 sm:p-8 rounded-2xl border border-jvb-pink-500/30">
              <h3 className="font-serif text-lg font-bold text-pink-200 mb-4 pb-2 border-b border-jvb-pink-900">
                The JVB Commitment
              </h3>
              <ul className="space-y-4 text-sm text-stone-200">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-pink-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Exclusively Unstitched Suits:</strong> We only sell unstitched ladies' suits. No sarees, stitched clothes, or other readymade garments.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-pink-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Top Suit Brands:</strong> Authentic catalog suits from Ganga, Krupali, Sahiba, and Varsha.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-pink-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Physical Store:</strong> Trusted clothing store located on Railway Road, Gharaunda, Karnal since 1977.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-pink-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Direct Store Ordering:</strong> Add to bag and order via WhatsApp on 7015344280 with direct confirmation from our family.
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE JVB */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-jvb-pink-600 uppercase tracking-widest">
            Family Heritage
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
            Why Choose Jain Vastar Bhandar
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            Grounded in genuine family values, honest fabric representations, and personal service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl border border-jvb-pink-100 shadow-subtle space-y-3">
            <div className="w-12 h-12 rounded-lg bg-jvb-pink-50 text-jvb-pink-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-gray-900">45+ Years of Trust</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Serving patrons continuously since 1977 from our Gharaunda clothing store, earning loyalty across generations.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-jvb-pink-100 shadow-subtle space-y-3">
            <div className="w-12 h-12 rounded-lg bg-jvb-pink-50 text-jvb-pink-600 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-gray-900">Original Brand Stock</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              100% original suits from iconic brands like Ganga, Krupali, Sahiba, and Varsha.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-jvb-pink-100 shadow-subtle space-y-3">
            <div className="w-12 h-12 rounded-lg bg-jvb-pink-50 text-jvb-pink-600 flex items-center justify-center">
              <Scissors className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-gray-900">Exact Cut Transparency</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Full fabric measurements (Kurta 2.5m, Salwar 2.5m, Dupatta 2.25m+) clearly stated for effortless tailoring.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-jvb-pink-100 shadow-subtle space-y-3">
            <div className="w-12 h-12 rounded-lg bg-jvb-pink-50 text-jvb-pink-600 flex items-center justify-center">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-gray-900">Personal Assistance</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Speak directly with our store team on WhatsApp or phone to confirm texture, drape, and color shades.
            </p>
          </div>
        </div>
      </section>

      {/* HOW SHOPPING & ORDERING WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-jvb-ivory rounded-2xl border border-jvb-pink-200 p-8 sm:p-12 shadow-sm">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest flex items-center justify-center gap-1.5">
              <ShoppingBag className="w-4 h-4 text-emerald-600" />
              Easy Online Ordering
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
              How Ordering Works at Jain Vastar Bhandar
            </h2>
            <p className="text-sm text-gray-600">
              Browse our collection, add suits to your shopping bag, and checkout with direct WhatsApp confirmation from our store.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white p-6 rounded-xl border border-jvb-pink-100 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-jvb-pink-100 text-jvb-wine-700 font-bold flex items-center justify-center mx-auto text-sm">
                1
              </div>
              <h4 className="font-serif font-bold text-base text-gray-900">Select & Add to Bag</h4>
              <p className="text-xs text-gray-600">
                Explore our unstitched suits from Ganga, Krupali, and exclusive handpicks. Click "Add to Bag" on your favorite suits.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-jvb-pink-100 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center mx-auto text-sm">
                2
              </div>
              <h4 className="font-serif font-bold text-base text-gray-900">Review Bag & Address</h4>
              <p className="text-xs text-gray-600">
                Open your Shopping Bag, review quantities, enter your delivery address and contact number, and click Place Order.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-jvb-pink-100 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-jvb-wine-100 text-jvb-wine-800 font-bold flex items-center justify-center mx-auto text-sm">
                3
              </div>
              <h4 className="font-serif font-bold text-base text-gray-900">Confirm on WhatsApp</h4>
              <p className="text-xs text-gray-600">
                A formatted order summary automatically opens in WhatsApp on 7015344280. We confirm stock and arrange delivery.
              </p>
            </div>
          </div>

          <div className="mt-8 text-center flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/collection"
              className="inline-flex items-center gap-2 bg-rose-700 hover:bg-rose-800 text-white font-semibold px-8 py-3.5 rounded-full text-sm shadow-md transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Browse Catalog & Shop Now</span>
            </Link>
            <a
              href={buildGeneralWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white hover:bg-stone-50 text-emerald-700 border border-emerald-600 font-semibold px-6 py-3.5 rounded-full text-sm shadow-sm transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat with Store (7015344280)</span>
            </a>
          </div>
        </div>
      </section>

      {/* INSTAGRAM SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 text-jvb-pink-600 text-xs font-bold uppercase tracking-widest">
          <InstagramIcon className="w-4 h-4" />
          <span>Follow Us on Instagram</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
          Connect with {BUSINESS_INFO.instagramHandle}
        </h2>
        <p className="text-sm text-gray-600 max-w-xl mx-auto">
          Watch real suit videos, latest Ganga & Krupali stock arrivals, and fabric clips of our unstitched suits on Instagram.
        </p>
        <div className="pt-2">
          <a
            href={BUSINESS_INFO.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-90 text-white font-semibold px-6 py-3 rounded-full text-sm shadow-md transition-all hover:scale-105"
          >
            <InstagramIcon className="w-4 h-4" />
            <span>Open {BUSINESS_INFO.instagramHandle} Profile</span>
          </a>
        </div>
      </section>
    </div>
  );
};
// import { Link } from 'react-router-dom';
// import {
//   Sparkles,
//   ArrowRight,
//   MessageCircle,
//   ShieldCheck,
//   CheckCircle2,
//   Compass,
//   Scissors,
//   HeartHandshake,
//   ShoppingBag,
//   Award,
// } from 'lucide-react';
// import { InstagramIcon } from '../components/common/InstagramIcon';
// import { ProductCard } from '../components/common/ProductCard';
// import { ProductGridSkeleton } from '../components/common/LoadingSkeleton';
// import { productService } from '../services/productService';
// import type { Product } from '../types';
// import { BUSINESS_INFO, buildGeneralWhatsAppUrl } from '../utils/constants';

// export const HomePage: React.FC = () => {
//   const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     let isMounted = true;
//     async function loadFeatured() {
//       setLoading(true);
//       const { products, error } = await productService.getFeaturedProducts(8);
//       if (isMounted) {
//         setFeaturedProducts(products);
//         setError(error);
//         setLoading(false);
//       }
//     }
//     loadFeatured();
//     return () => {
//       isMounted = false;
//     };
//   }, []);

//   return (
//     <div className="space-y-16 sm:space-y-24 pb-16">
//       {/* HERO SECTION */}
//       <section className="relative overflow-hidden bg-gradient-to-b from-jvb-pink-50/70 via-jvb-ivory to-white pt-8 pb-16 sm:pt-14 sm:pb-24 border-b border-jvb-pink-100">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
//           <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
//             {/* Left Column: Messaging */}
//             <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
//               <div className="inline-flex items-center gap-2 bg-jvb-pink-100/80 text-jvb-wine-700 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide border border-jvb-pink-200">
//                 <Sparkles className="w-3.5 h-3.5 text-jvb-pink-600" />
//                 <span>Elegance Woven Since 1977 • Gharaunda, Karnal</span>
//               </div>

//               <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-[1.15]">
//                 Pure Unstitched <br />
//                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-jvb-pink-600 to-jvb-wine-700">
//                   Ladies' Suits
//                 </span>{' '}
//                 from Top Brands
//               </h1>

//               {/* Brand Announcement Pill */}
//               <div className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs font-medium text-stone-700 bg-white/80 backdrop-blur-sm px-3.5 py-2 rounded-xl border border-rose-200 shadow-sm">
//                 <span className="font-bold text-rose-800 flex items-center gap-1">
//                   <Award className="w-3.5 h-3.5 text-rose-600" /> Stockists of:
//                 </span>
//                 <span className="font-semibold text-stone-900">Ganga</span>
//                 <span>•</span>
//                 <span className="font-semibold text-stone-900">Krupali</span>
//                 <span>•</span>
//               =
//                 <span className="text-stone-500">& Handpicked Heritage Mills</span>
//               </div>

//               <p className="text-base sm:text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
//                 Discover authentic unstitched suit materials from India's premier brands like{' '}
//                 <strong>Ganga</strong> and <strong>Krupali</strong> alongside curated handpicked fabrics.
//                 Fine count pure cotton, regal Chanderi silk, flowy georgette, and pure organza dupattas
//                 ready for your bespoke tailoring.
//               </p>

//               {/* CTAs */}
//               <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
//                 <Link
//                   to="/collection"
//                   className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-jvb-pink-600 hover:bg-jvb-pink-700 text-white font-semibold px-8 py-3.5 rounded-full text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
//                 >
//                   <ShoppingBag className="w-4 h-4" />
//                   <span>Explore Unstitched Suits</span>
//                 </Link>

//                 <a
//                   href={buildGeneralWhatsAppUrl()}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-emerald-700 font-semibold px-6 py-3.5 rounded-full text-base border-2 border-emerald-600 shadow-sm transition-all"
//                 >
//                   <MessageCircle className="w-5 h-5 text-emerald-600" />
//                   <span>Order on WhatsApp</span>
//                 </a>
//               </div>

//               {/* Trust badges */}
//               <div className="pt-6 grid grid-cols-3 gap-4 border-t border-jvb-pink-100 text-center lg:text-left">
//                 <div>
//                   <div className="font-serif font-bold text-xl text-jvb-wine-700">1977</div>
//                   <div className="text-xs text-gray-600">Established Store</div>
//                 </div>
//                 <div>
//                   <div className="font-serif font-bold text-xl text-jvb-wine-700">Ganga & Krupali</div>
//                   <div className="text-xs text-gray-600">Authentic Labels</div>
//                 </div>
//                 <div>
//                   <div className="font-serif font-bold text-xl text-jvb-wine-700">100% Pure</div>
//                   <div className="text-xs text-gray-600">Unstitched Suits Only</div>
//                 </div>
//               </div>
//             </div>

//             {/* Right Column: Visual Showcase */}
//             <div className="lg:col-span-5 relative">
//               <div className="relative mx-auto max-w-md lg:max-w-none">
//                 {/* Decorative border container */}
//                 <div className="absolute -inset-2 bg-gradient-to-r from-jvb-pink-400 to-jvb-wine-600 rounded-2xl opacity-20 blur-lg" />
//                 <div className="relative bg-white rounded-2xl p-3 shadow-elevated border border-jvb-pink-100">
//                   <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-stone-100">
//                     <img
//                       src="/images/image.png"
//                       alt="Ganga & Krupali Brand Unstitched Ladies Suit - Jain Vastar Bhandar"
//                       className="w-full h-full object-cover"
//                     />
//                     <div className="absolute inset-0 bg-gradient-to-t from-jvb-wine-950/80 via-black/20 to-transparent" />
//                     <div className="absolute bottom-4 left-4 right-4 text-white">
//                       <div className="flex items-center gap-2 mb-1">
//                         <span className="bg-rose-700 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
//                           Premium Unstitched Suit
//                         </span>
//                         <span className="bg-white/20 backdrop-blur-sm text-pink-100 text-[10px] font-medium px-2 py-0.5 rounded">
//                           Ganga & Krupali Collection
//                         </span>
//                       </div>
//                       <h4 className="font-serif font-bold text-lg sm:text-xl mt-1 text-white">
//                         Festive Embroidered & Daily Wear Suits
//                       </h4>
//                       <p className="text-xs text-stone-200 mt-0.5">
//                         Top (2.5m) • Bottom (2.5m) • Pure Dupatta (2.25m+)
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>


//       <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="text-center max-w-3xl mx-auto mb-10">
//           <span className="text-xs font-bold text-rose-700 uppercase tracking-widest bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
//             Authorized Suit Stockists
//           </span>
//           <h2 className="font-serif text-2xl sm:text-4xl font-bold text-gray-900 mt-2">
//             Featuring Ganga, Krupali & Premier Indian Brands
//           </h2>
//           <p className="text-sm sm:text-base text-gray-600 mt-2.5 leading-relaxed">
//             At Jain Vastar Bhandar, we take pride in offering genuine unstitched suit materials from
//             India's most celebrated suit brands, backed by 45+ years of family trust in Gharaunda.
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {/* Brand 1: Ganga */}
//           <div className="bg-white rounded-2xl overflow-hidden border border-rose-100 shadow-subtle hover:shadow-card transition-all duration-300 group flex flex-col justify-between">
//             <div>
//               <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
//                 <img
//                   src="/images/image.png"
//                   alt="Ganga Brand Unstitched Suits"
//                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//                 />
//                 <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-md shadow-sm border border-rose-100">
//                   <span className="font-serif font-bold text-xs tracking-wider text-rose-900 uppercase">
//                     Ganga Fashions
//                   </span>
//                 </div>
//               </div>
//               <div className="p-5">
//                 <h3 className="font-serif text-lg font-bold text-gray-900 mb-1">
//                   Ganga Unstitched Suits
//                 </h3>
//                 <p className="text-xs text-gray-600 leading-relaxed mb-3">
//                   Celebrated for royal pure pashmina, digital silk prints, fine jam cotton kurtas, and pure bamber silk dupattas.
//                 </p>
//                 <div className="flex flex-wrap gap-1 text-[11px] text-rose-700 font-medium">
//                   <span className="bg-rose-50 px-2 py-0.5 rounded">Pure Pashmina</span>
//                   <span className="bg-rose-50 px-2 py-0.5 rounded">Digital Silk</span>
//                   <span className="bg-rose-50 px-2 py-0.5 rounded">Jam Cotton</span>
//                 </div>
//               </div>
//             </div>
//             <div className="p-5 pt-0">
//               <Link
//                 to="/collection?search=Ganga"
//                 className="w-full py-2.5 px-3 bg-rose-50 hover:bg-rose-700 text-rose-800 hover:text-white rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
//               >
//                 <span>View Ganga Suits</span>
//                 <ArrowRight className="w-3.5 h-3.5" />
//               </Link>
//             </div>
//           </div>

//           {/* Brand 2: Krupali */}
//           <div className="bg-white rounded-2xl overflow-hidden border border-rose-100 shadow-subtle hover:shadow-card transition-all duration-300 group flex flex-col justify-between">
//             <div>
//               <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
//                 <img
//                   src="images/image.png"
//                   alt="Krupali Brand Designer Unstitched Suits"
//                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//                 />
//                 <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-md shadow-sm border border-rose-100">
//                   <span className="font-serif font-bold text-xs tracking-wider text-rose-900 uppercase">
//                     Krupali Suits
//                   </span>
//                 </div>
//               </div>
//               <div className="p-5">
//                 <h3 className="font-serif text-lg font-bold text-gray-900 mb-1">
//                   Krupali Designer Suits
//                 </h3>
//                 <p className="text-xs text-gray-600 leading-relaxed mb-3">
//                   Famous for exquisite pastel shades, intricate neckline resham threadwork, and sheer pure organza dupattas.
//                 </p>
//                 <div className="flex flex-wrap gap-1 text-[11px] text-rose-700 font-medium">
//                   <span className="bg-rose-50 px-2 py-0.5 rounded">Organza Dupatta</span>
//                   <span className="bg-rose-50 px-2 py-0.5 rounded">Resham Work</span>
//                   <span className="bg-rose-50 px-2 py-0.5 rounded">Pastels</span>
//                 </div>
//               </div>
//             </div>
//             <div className="p-5 pt-0">
//               <Link
//                 to="/collection?search=Krupali"
//                 className="w-full py-2.5 px-3 bg-rose-50 hover:bg-rose-700 text-rose-800 hover:text-white rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
//               >
//                 <span>View Krupali Suits</span>
//                 <ArrowRight className="w-3.5 h-3.5" />
//               </Link>
//             </div>
//           </div>

          

//           {/* Brand 4: JVB Handpicked Heritage */}
//           <div className="bg-white rounded-2xl overflow-hidden border border-rose-100 shadow-subtle hover:shadow-card transition-all duration-300 group flex flex-col justify-between">
//             <div>
//               <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
//                 <img
//                   src="https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80"
//                   alt="JVB Handpicked Suits"
//                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//                 />
//                 <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-md shadow-sm border border-rose-100">
//                   <span className="font-serif font-bold text-xs tracking-wider text-rose-900 uppercase">
//                     JVB Handpicked
//                   </span>
//                 </div>
//               </div>
//               <div className="p-5">
//                 <h3 className="font-serif text-lg font-bold text-gray-900 mb-1">
//                   JVB Exclusive Handpicks
//                 </h3>
//                 <p className="text-xs text-gray-600 leading-relaxed mb-3">
//                   Directly sourced from trusted master weavers across India since 1977. 100% pure 60x60 cotton and pure georgettes.
//                 </p>
//                 <div className="flex flex-wrap gap-1 text-[11px] text-rose-700 font-medium">
//                   <span className="bg-rose-50 px-2 py-0.5 rounded">60x60 Cotton</span>
//                   <span className="bg-rose-50 px-2 py-0.5 rounded">Since 1977</span>
//                   <span className="bg-rose-50 px-2 py-0.5 rounded">Gharaunda</span>
//                 </div>
//               </div>
//             </div>
//             <div className="p-5 pt-0">
//               <Link
//                 to="/collection"
//                 className="w-full py-2.5 px-3 bg-rose-50 hover:bg-rose-700 text-rose-800 hover:text-white rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
//               >
//                 <span>View Handpicked</span>
//                 <ArrowRight className="w-3.5 h-3.5" />
//               </Link>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* FABRIC WEAVES CATEGORY CARDS */}
//       <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="text-center max-w-2xl mx-auto mb-10">
//           <span className="text-xs font-bold text-jvb-pink-600 uppercase tracking-widest">
//             Unstitched Suit Materials
//           </span>
//           <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
//             Explore Unstitched Suits By Fabric
//           </h2>
//           <p className="text-sm text-gray-600 mt-2">
//             Every suit piece in our catalog is an unstitched ladies' suit with generous cut lengths,
//             giving you complete freedom to tailor according to your custom fit.
//           </p>
//         </div>

//         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
//           {[
//             {
//               name: 'Pure Cotton Suits',
//               fabric: 'Pure Cotton',
//               desc: '60x60 breathable summer & daily suits',
//               image:
//                 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=500&q=80',
//             },
//             {
//               name: 'Chanderi Silk Suits',
//               fabric: 'Chanderi Silk',
//               desc: 'Zari woven festive unstitched suits',
//               image:
//                 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=500&q=80',
//             },
//             {
//               name: 'Georgette Suits',
//               fabric: 'Georgette',
//               desc: 'Graceful drape & embroidered unstitched suits',
//               image:
//                 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=500&q=80',
//             },
//             {
//               name: 'Organza & Modal Suits',
//               fabric: 'Organza',
//               desc: 'Luxury sheer & modal silk unstitched suits',
//               image:
//                 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=500&q=80',
//             },
//           ].map((cat, idx) => (
//             <Link
//               key={idx}
//               to={`/collection?fabric=${encodeURIComponent(cat.fabric)}`}
//               className="group relative rounded-xl overflow-hidden shadow-subtle hover:shadow-card border border-jvb-pink-100 bg-white transition-all duration-300 hover:-translate-y-1"
//             >
//               <div className="aspect-[3/4] overflow-hidden bg-stone-100">
//                 <img
//                   src={cat.image}
//                   alt={cat.name}
//                   loading="lazy"
//                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
//                 <div className="absolute bottom-3 left-3 right-3 text-white">
//                   <h3 className="font-serif font-bold text-base sm:text-lg">{cat.name}</h3>
//                   <p className="text-[11px] text-stone-200 line-clamp-1">{cat.desc}</p>
//                   <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-pink-300 mt-1 group-hover:text-white">
//                     <span>View Fabrics</span>
//                     <ArrowRight className="w-3 h-3" />
//                   </span>
//                 </div>
//               </div>
//             </Link>
//           ))}
//         </div>
//       </section>

//       {/* FEATURED UNSTITCHED SUITS (DYNAMICALLY LOADED FROM SUPABASE) */}
//       <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
//           <div>
//             <span className="text-xs font-bold text-jvb-pink-600 uppercase tracking-widest">
//               Live Store Inventory
//             </span>
//             <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
//               Featured Unstitched Suits
//             </h2>
//           </div>
//           <Link
//             to="/collection"
//             className="inline-flex items-center gap-1.5 text-sm font-semibold text-jvb-pink-600 hover:text-jvb-wine-700"
//           >
//             <span>View Full Catalog</span>
//             <ArrowRight className="w-4 h-4" />
//           </Link>
//         </div>

//         {loading ? (
//           <ProductGridSkeleton count={4} />
//         ) : error ? (
//           <div className="text-center py-12 bg-pink-50/50 rounded-2xl border border-jvb-pink-100 p-6">
//             <p className="text-sm text-gray-600 mb-4">{error}</p>
//             <Link
//               to="/collection"
//               className="inline-block bg-jvb-pink-600 text-white px-5 py-2 rounded-lg text-sm font-medium"
//             >
//               Browse Catalog
//             </Link>
//           </div>
//         ) : featuredProducts.length > 0 ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//             {featuredProducts.map((product) => (
//               <ProductCard key={product.id} product={product} />
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-jvb-pink-200 p-8 max-w-lg mx-auto">
//             <p className="font-serif text-lg font-bold text-gray-800 mb-2">
//               Catalog Live on Supabase
//             </p>
//             <p className="text-sm text-gray-600 mb-6">
//               Manage your Ganga, Krupali, and unstitched suit products in the admin panel to display them here instantly.
//             </p>
//             <Link
//               to="/admin"
//               className="inline-block bg-jvb-pink-600 hover:bg-jvb-pink-700 text-white font-medium px-5 py-2.5 rounded-lg text-sm"
//             >
//               Open Admin Portal
//             </Link>
//           </div>
//         )}
//       </section>

//       {/* BRAND STORY (ESTABLISHED 1977) */}
//       <section className="bg-gradient-to-r from-jvb-wine-900 via-jvb-wine-800 to-jvb-wine-900 text-white py-16 sm:py-20">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
//             <div className="lg:col-span-7 space-y-6">
//               <div className="inline-flex items-center gap-2 bg-jvb-pink-500/20 text-pink-200 px-3 py-1 rounded-full text-xs font-semibold tracking-wider border border-pink-400/30">
//                 <Scissors className="w-3.5 h-3.5 text-pink-300" />
//                 <span>Our Heritage & Focus</span>
//               </div>

//               <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white tracking-tight leading-snug">
//                 Jain Vastar Bhandar <br />
//                 <span className="text-pink-300 font-normal italic">
//                   Elegance Woven Since 1977
//                 </span>
//               </h2>

//               <p className="text-stone-200 text-base leading-relaxed">
//                 Established in 1977 on Railway Road, Gharaunda (Karnal, Haryana), Jain Vastar Bhandar has remained dedicated to one specialized craft: providing women with pure, authentic, unstitched suit fabrics.
//               </p>

//               <p className="text-stone-300 text-sm leading-relaxed">
//                 We believe that every woman deserves an outfit tailored to her exact fit and personal style. By specializing strictly in unstitched suit materials from leading houses like Ganga and Krupali alongside handpicked textiles, we preserve the time-honored Indian tradition of bespoke tailoring.
//               </p>

//               <div className="pt-2 flex flex-wrap gap-4">
//                 <Link
//                   to="/about"
//                   className="inline-flex items-center gap-2 bg-white text-jvb-wine-800 hover:bg-stone-100 font-semibold px-6 py-2.5 rounded-full text-sm transition-all"
//                 >
//                   <span>Read Full Brand Story</span>
//                   <ArrowRight className="w-4 h-4" />
//                 </Link>

//                 <Link
//                   to="/contact"
//                   className="inline-flex items-center gap-2 border border-pink-300 text-pink-200 hover:text-white hover:border-white font-medium px-6 py-2.5 rounded-full text-sm transition-all"
//                 >
//                   <Compass className="w-4 h-4" />
//                   <span>Visit Our Store</span>
//                 </Link>
//               </div>
//             </div>

//             <div className="lg:col-span-5 bg-jvb-wine-950/60 p-6 sm:p-8 rounded-2xl border border-jvb-pink-500/30">
//               <h3 className="font-serif text-lg font-bold text-pink-200 mb-4 pb-2 border-b border-jvb-pink-900">
//                 The JVB Commitment
//               </h3>
//               <ul className="space-y-4 text-sm text-stone-200">
//                 <li className="flex items-start gap-3">
//                   <CheckCircle2 className="w-5 h-5 text-pink-400 mt-0.5 flex-shrink-0" />
//                   <div>
//                     <strong>Exclusively Unstitched Suits:</strong> We only sell unstitched ladies' suits. No sarees, stitched clothes, or other readymade garments.
//                   </div>
//                 </li>
//                 <li className="flex items-start gap-3">
//                   <CheckCircle2 className="w-5 h-5 text-pink-400 mt-0.5 flex-shrink-0" />
//                   <div>
//                     <strong>Top Suit Brands:</strong> Authentic catalog suits from Ganga, Krupali, Sahiba, and Varsha.
//                   </div>
//                 </li>
//                 <li className="flex items-start gap-3">
//                   <CheckCircle2 className="w-5 h-5 text-pink-400 mt-0.5 flex-shrink-0" />
//                   <div>
//                     <strong>Physical Store:</strong> Trusted clothing store located on Railway Road, Gharaunda, Karnal since 1977.
//                   </div>
//                 </li>
//                 <li className="flex items-start gap-3">
//                   <CheckCircle2 className="w-5 h-5 text-pink-400 mt-0.5 flex-shrink-0" />
//                   <div>
//                     <strong>Direct Store Ordering:</strong> Add to bag and order via WhatsApp on 7015344280 with direct confirmation from our family.
//                   </div>
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* WHY CHOOSE JVB (SUPPORTABLE CLAIMS ONLY) */}
//       <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="text-center max-w-2xl mx-auto mb-12">
//           <span className="text-xs font-bold text-jvb-pink-600 uppercase tracking-widest">
//             Family Heritage
//           </span>
//           <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
//             Why Choose Jain Vastar Bhandar
//           </h2>
//           <p className="text-sm text-gray-600 mt-2">
//             Grounded in genuine family values, honest fabric representations, and personal service.
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           <div className="bg-white p-6 rounded-xl border border-jvb-pink-100 shadow-subtle space-y-3">
//             <div className="w-12 h-12 rounded-lg bg-jvb-pink-50 text-jvb-pink-600 flex items-center justify-center">
//               <ShieldCheck className="w-6 h-6" />
//             </div>
//             <h3 className="font-serif font-bold text-lg text-gray-900">45+ Years of Trust</h3>
//             <p className="text-xs text-gray-600 leading-relaxed">
//               Serving patrons continuously since 1977 from our Gharaunda clothing store, earning loyalty across generations.
//             </p>
//           </div>

//           <div className="bg-white p-6 rounded-xl border border-jvb-pink-100 shadow-subtle space-y-3">
//             <div className="w-12 h-12 rounded-lg bg-jvb-pink-50 text-jvb-pink-600 flex items-center justify-center">
//               <Award className="w-6 h-6" />
//             </div>
//             <h3 className="font-serif font-bold text-lg text-gray-900">Original Brand Stock</h3>
//             <p className="text-xs text-gray-600 leading-relaxed">
//               100% original suits from iconic brands like Ganga, Krupali, Sahiba, and Varsha.
//             </p>
//           </div>

//           <div className="bg-white p-6 rounded-xl border border-jvb-pink-100 shadow-subtle space-y-3">
//             <div className="w-12 h-12 rounded-lg bg-jvb-pink-50 text-jvb-pink-600 flex items-center justify-center">
//               <Scissors className="w-6 h-6" />
//             </div>
//             <h3 className="font-serif font-bold text-lg text-gray-900">Exact Cut Transparency</h3>
//             <p className="text-xs text-gray-600 leading-relaxed">
//               Full fabric measurements (Kurta 2.5m, Salwar 2.5m, Dupatta 2.25m+) clearly stated for effortless tailoring.
//             </p>
//           </div>

//           <div className="bg-white p-6 rounded-xl border border-jvb-pink-100 shadow-subtle space-y-3">
//             <div className="w-12 h-12 rounded-lg bg-jvb-pink-50 text-jvb-pink-600 flex items-center justify-center">
//               <HeartHandshake className="w-6 h-6" />
//             </div>
//             <h3 className="font-serif font-bold text-lg text-gray-900">Personal Assistance</h3>
//             <p className="text-xs text-gray-600 leading-relaxed">
//               Speak directly with our store team on WhatsApp or phone to confirm texture, drape, and color shades.
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* HOW SHOPPING & ORDERING WORKS */}
//       <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="bg-jvb-ivory rounded-2xl border border-jvb-pink-200 p-8 sm:p-12 shadow-sm">
//           <div className="max-w-3xl mx-auto text-center space-y-4">
//             <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest flex items-center justify-center gap-1.5">
//               <ShoppingBag className="w-4 h-4 text-emerald-600" />
//               Easy Online Ordering
//             </span>
//             <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
//               How Ordering Works at Jain Vastar Bhandar
//             </h2>
//             <p className="text-sm text-gray-600">
//               Browse our collection, add suits to your shopping bag, and checkout with direct WhatsApp confirmation from our store.
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
//             <div className="bg-white p-6 rounded-xl border border-jvb-pink-100 text-center space-y-2">
//               <div className="w-10 h-10 rounded-full bg-jvb-pink-100 text-jvb-wine-700 font-bold flex items-center justify-center mx-auto text-sm">
//                 1
//               </div>
//               <h4 className="font-serif font-bold text-base text-gray-900">Select & Add to Bag</h4>
//               <p className="text-xs text-gray-600">
//                 Explore our unstitched suits from Ganga, Krupali, and exclusive handpicks. Click "Add to Bag" on your favorite suits.
//               </p>
//             </div>

//             <div className="bg-white p-6 rounded-xl border border-jvb-pink-100 text-center space-y-2">
//               <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center mx-auto text-sm">
//                 2
//               </div>
//               <h4 className="font-serif font-bold text-base text-gray-900">Review Bag & Address</h4>
//               <p className="text-xs text-gray-600">
//                 Open your Shopping Bag, review quantities, enter your delivery address and contact number, and click Place Order.
//               </p>
//             </div>

//             <div className="bg-white p-6 rounded-xl border border-jvb-pink-100 text-center space-y-2">
//               <div className="w-10 h-10 rounded-full bg-jvb-wine-100 text-jvb-wine-800 font-bold flex items-center justify-center mx-auto text-sm">
//                 3
//               </div>
//               <h4 className="font-serif font-bold text-base text-gray-900">Confirm on WhatsApp</h4>
//               <p className="text-xs text-gray-600">
//                 A formatted order summary automatically opens in WhatsApp on 7015344280. We confirm stock and arrange delivery.
//               </p>
//             </div>
//           </div>

//           <div className="mt-8 text-center flex flex-col sm:flex-row items-center justify-center gap-4">
//             <Link
//               to="/collection"
//               className="inline-flex items-center gap-2 bg-rose-700 hover:bg-rose-800 text-white font-semibold px-8 py-3.5 rounded-full text-sm shadow-md transition-all"
//             >
//               <ShoppingBag className="w-4 h-4" />
//               <span>Browse Catalog & Shop Now</span>
//             </Link>
//             <a
//               href={buildGeneralWhatsAppUrl()}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="inline-flex items-center gap-2 bg-white hover:bg-stone-50 text-emerald-700 border border-emerald-600 font-semibold px-6 py-3.5 rounded-full text-sm shadow-sm transition-all"
//             >
//               <MessageCircle className="w-4 h-4" />
//               <span>Chat with Store (7015344280)</span>
//             </a>
//           </div>
//         </div>
//       </section>

//       {/* INSTAGRAM SECTION */}
//       <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
//         <div className="inline-flex items-center gap-2 text-jvb-pink-600 text-xs font-bold uppercase tracking-widest">
//           <InstagramIcon className="w-4 h-4" />
//           <span>Follow Us on Instagram</span>
//         </div>
//         <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
//           Connect with {BUSINESS_INFO.instagramHandle}
//         </h2>
//         <p className="text-sm text-gray-600 max-w-xl mx-auto">
//           Watch real suit videos, latest Ganga & Krupali stock arrivals, and fabric clips of our unstitched suits on Instagram.
//         </p>
//         <div className="pt-2">
//           <a
//             href={BUSINESS_INFO.instagramUrl}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-90 text-white font-semibold px-6 py-3 rounded-full text-sm shadow-md transition-all hover:scale-105"
//           >
//             <InstagramIcon className="w-4 h-4" />
//             <span>Open {BUSINESS_INFO.instagramHandle} Profile</span>
//           </a>
//         </div>
//       </section>
//     </div>
//   );
// };
