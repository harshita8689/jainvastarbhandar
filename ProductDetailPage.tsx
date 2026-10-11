import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MessageCircle,
  Scissors,
  AlertCircle,
  ArrowLeft,
  Share2,
  ShieldCheck,
  ChevronRight,
  Plus,
  Minus,
  ShoppingBag,
  Check,
} from 'lucide-react';
import { InstagramIcon } from '../components/common/InstagramIcon';
import { productService } from '../services/productService';
import { ProductCard } from '../components/common/ProductCard';
import type { Product } from '../types';
import {
  BUSINESS_INFO,
  formatCurrencyINR,
  buildProductWhatsAppUrl,
} from '../utils/constants';
import { useCart } from '../context/CartContext';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { addToCart } = useCart();
  const [addedRecently, setAddedRecently] = useState(false);

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadProduct() {
      if (!slug) return;
      setLoading(true);
      setError(null);

      const { product: fetched, error: err } = await productService.getProductBySlug(slug, false);

      if (!isMounted) return;

      if (err || !fetched) {
        setError(err || 'Product not found or is currently unavailable');
        setProduct(null);
        setLoading(false);
        return;
      }

      setProduct(fetched);
      setSelectedImageIndex(0);
      setQuantity(1);
      setLoading(false);

      // Load related products of same fabric type
      if (fetched.fabric_type) {
        productService
          .getProducts({ fabric_type: fetched.fabric_type }, 'newest', 1, 4, false)
          .then((res) => {
            if (isMounted) {
              setRelatedProducts(res.products.filter((p) => p.id !== fetched.id).slice(0, 3));
            }
          });
      }
    }

    loadProduct();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-pulse">
          <div className="aspect-[4/5] bg-gray-200 rounded-2xl" />
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-6 bg-gray-200 rounded w-1/3" />
            <div className="h-24 bg-gray-200 rounded w-full" />
            <div className="h-12 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-pink-100 text-jvb-pink-600 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Unstitched Suit Not Found or Unavailable
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          This unstitched suit fabric might have been removed, archived, or is currently unpublished.
        </p>
        <Link
          to="/collection"
          className="inline-flex items-center gap-2 bg-jvb-pink-600 hover:bg-jvb-pink-700 text-white font-medium px-6 py-3 rounded-full text-sm shadow transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse Available Unstitched Suits</span>
        </Link>
      </div>
    );
  }

  const images = product.images || [];
  const activeImage =
    images.length > 0 && images[selectedImageIndex]
      ? images[selectedImageIndex].public_url
      : 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80';

  const isSoldOut = product.stock_quantity === 0;
  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= 5;
  const maxAvailable = product.stock_quantity;

  const isDemo =
    product.sku?.startsWith('DEMO-') ||
    product.name?.includes('[DEMO') ||
    product.name?.includes('[SAMPLE');

  const whatsAppUrl = buildProductWhatsAppUrl(
    product.name,
    product.sku,
    quantity,
    typeof window !== 'undefined' ? window.location.href : undefined,
    product.brand
  );

  const handleAddToCart = () => {
    if (!product || isSoldOut) return;
    addToCart(product, quantity);
    setAddedRecently(true);
    setTimeout(() => setAddedRecently(false), 2000);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-gray-500 font-medium overflow-x-auto whitespace-nowrap pb-2">
        <Link to="/" className="hover:text-jvb-pink-600">Home</Link>
        <ChevronRight className="w-3 h-3 text-gray-400" />
        <Link to="/collection" className="hover:text-jvb-pink-600">Unstitched Suits</Link>
        <ChevronRight className="w-3 h-3 text-gray-400" />
        <Link
          to={`/collection?fabric=${encodeURIComponent(product.fabric_type)}`}
          className="hover:text-jvb-pink-600"
        >
          {product.fabric_type}
        </Link>
        <ChevronRight className="w-3 h-3 text-gray-400" />
        <span className="text-gray-900 truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left Gallery (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Photo View */}
          <div className="relative aspect-[4/5] bg-stone-100 rounded-2xl overflow-hidden border border-jvb-pink-100 shadow-subtle group">
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />

            {/* Demo Badge */}
            {isDemo && (
              <div className="absolute top-4 left-4 bg-amber-600 text-white text-xs font-bold px-2.5 py-1 rounded shadow">
                DEMO PRODUCT
              </div>
            )}

            {/* Stock pill */}
            <div className="absolute top-4 right-4">
              {isSoldOut ? (
                <span className="bg-stone-900 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow">
                  Sold Out
                </span>
              ) : isLowStock ? (
                <span className="bg-amber-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow">
                  Only {product.stock_quantity} Left in Store
                </span>
              ) : (
                <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow">
                  In Stock ({product.stock_quantity} available)
                </span>
              )}
            </div>
          </div>

          {/* Thumbnails row if multiple images */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {images.map((img, index) => (
                <button
                  key={img.id || index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`w-20 h-24 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 bg-stone-100 ${
                    selectedImageIndex === index
                      ? 'border-jvb-pink-600 ring-2 ring-jvb-pink-200'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img.public_url}
                    alt={img.alt_text || `Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Info (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            {/* Brand, SKU & Category */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {product.brand && (
                  <span className="text-xs font-bold tracking-wider text-rose-700 bg-rose-50 px-2.5 py-1 rounded border border-rose-200 uppercase">
                    {product.brand}
                  </span>
                )}
                <span className="text-xs font-mono font-semibold tracking-wider text-jvb-wine-700 bg-pink-50 px-2.5 py-1 rounded border border-pink-100 uppercase">
                  CODE: {product.sku}
                </span>
              </div>
              <span className="text-xs font-semibold text-jvb-pink-600 flex items-center gap-1">
                <Scissors className="w-3.5 h-3.5" />
                Pure Unstitched Fabric
              </span>
            </div>

            {/* Product Name */}
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 leading-snug">
              {product.name}
            </h1>
          </div>

          {/* Pricing */}
          <div className="p-4 bg-jvb-ivory rounded-xl border border-jvb-pink-100 flex items-baseline gap-3">
            {product.sale_price ? (
              <>
                <span className="font-serif text-3xl font-bold text-jvb-wine-700">
                  {formatCurrencyINR(product.sale_price)}
                </span>
                <span className="text-base text-gray-400 line-through">
                  {formatCurrencyINR(product.price)}
                </span>
                <span className="text-xs font-bold text-jvb-pink-600 bg-pink-100 px-2 py-0.5 rounded">
                  {Math.round(((product.price - product.sale_price) / product.price) * 100)}% OFF
                </span>
              </>
            ) : (
              <span className="font-serif text-3xl font-bold text-jvb-wine-700">
                {formatCurrencyINR(product.price)}
              </span>
            )}
            <span className="text-xs text-gray-500 font-medium ml-auto">
              Inclusive of all taxes
            </span>
          </div>

          {/* Fabric & Material Specifications */}
          <div className="space-y-3 border-y border-gray-100 py-4 text-xs sm:text-sm">
            {product.brand && (
              <div className="grid grid-cols-3 py-1.5 border-b border-gray-50">
                <span className="text-gray-500 font-medium">Brand:</span>
                <span className="col-span-2 font-bold text-rose-800">{product.brand}</span>
              </div>
            )}
            <div className="grid grid-cols-3 py-1.5 border-b border-gray-50">
              <span className="text-gray-500 font-medium">Fabric Type:</span>
              <span className="col-span-2 font-semibold text-gray-900">{product.fabric_type}</span>
            </div>
            <div className="grid grid-cols-3 py-1.5 border-b border-gray-50">
              <span className="text-gray-500 font-medium">Color:</span>
              <span className="col-span-2 font-semibold text-gray-900">{product.color}</span>
            </div>
            <div className="grid grid-cols-3 py-1.5 border-b border-gray-50">
              <span className="text-gray-500 font-medium">Pattern / Work:</span>
              <span className="col-span-2 font-semibold text-gray-900">{product.pattern}</span>
            </div>
            <div className="grid grid-cols-3 py-1.5 border-b border-gray-50">
              <span className="text-gray-500 font-medium">Material Included:</span>
              <span className="col-span-2 font-semibold text-jvb-wine-800">
                {product.included_material || 'Top (Kurta): 2.5m, Bottom: 2.5m, Dupatta: 2.25m'}
              </span>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div className="space-y-2">
              <h3 className="font-serif font-bold text-sm text-gray-900">About this Suit Fabric</h3>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}

          {/* Quantity Selector (Bounded by Stock) */}
          {!isSoldOut && (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Select Quantity (Max: {maxAvailable})
              </label>
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center border border-gray-200 rounded-lg bg-gray-50">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="p-2 text-gray-600 hover:text-black disabled:opacity-30"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center text-sm font-semibold text-gray-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(maxAvailable, q + 1))}
                    disabled={quantity >= maxAvailable}
                    className="p-2 text-gray-600 hover:text-black disabled:opacity-30"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-xs text-gray-500">
                  {maxAvailable > 1 ? `${maxAvailable} pieces currently available` : 'Last piece in stock'}
                </span>
              </div>
            </div>
          )}

          {/* Primary Actions: Add to Bag + Order on WhatsApp */}
          <div className="space-y-3 pt-2">
            {isSoldOut ? (
              <div className="bg-stone-100 text-stone-600 p-4 rounded-xl text-center text-sm font-medium">
                This unstitched suit fabric is currently sold out. Message us on WhatsApp to inquire about fresh arrivals or restocks.
              </div>
            ) : (
              <div className="space-y-2.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Add to Bag Button */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className={`w-full inline-flex items-center justify-center gap-2 font-semibold py-3.5 px-4 rounded-xl text-sm shadow-sm transition-all active:scale-95 ${
                      addedRecently
                        ? 'bg-emerald-50 border-2 border-emerald-600 text-emerald-800'
                        : 'bg-rose-700 hover:bg-rose-800 text-white'
                    }`}
                  >
                    {addedRecently ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-700" />
                        <span>Added to Bag!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add to Bag</span>
                      </>
                    )}
                  </button>

                  {/* Direct WhatsApp Order */}
                  <a
                    href={whatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 px-4 rounded-xl text-sm shadow-md transition-all hover:scale-[1.02]"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp Order</span>
                  </a>
                </div>

                {/* Quick link to view bag after adding */}
                {addedRecently && (
                  <Link
                    to="/cart"
                    className="block text-center py-2 px-3 bg-rose-50 text-rose-800 rounded-lg text-xs font-semibold hover:bg-rose-100 transition-colors animate-fadeIn"
                  >
                    Item added to bag! Click here to review cart & checkout →
                  </Link>
                )}
              </div>
            )}

            {/* Instagram Contact & Share */}
            <div className="grid grid-cols-2 gap-3">
              <a
                href={BUSINESS_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 border border-pink-200 text-jvb-wine-700 hover:bg-pink-50 rounded-xl text-xs font-semibold transition-colors"
              >
                <InstagramIcon className="w-4 h-4 text-pink-600" />
                <span>Ask on Instagram</span>
              </a>

              <button
                onClick={handleShare}
                className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl text-xs font-semibold transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>{copied ? 'Link Copied!' : 'Share Suit'}</span>
              </button>
            </div>
          </div>

          {/* Business Order Process Disclaimer */}
          <div className="bg-amber-50/70 border border-amber-200/70 rounded-xl p-4 text-xs text-amber-900 space-y-1.5">
            <div className="font-semibold flex items-center gap-1.5 text-amber-950">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span>Inquiry-Based Ordering Information</span>
            </div>
            <p className="leading-relaxed">
              Clicking "Order on WhatsApp" opens a chat with our Gharaunda showroom with the suit name, SKU, and quantity prefilled. An order is confirmed only after we verify the physical fabric piece and confirm with you.
            </p>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="pt-12 border-t border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-bold text-jvb-pink-600 uppercase tracking-widest">
                More in {product.fabric_type}
              </span>
              <h2 className="font-serif text-2xl font-bold text-gray-900 mt-1">
                You May Also Like
              </h2>
            </div>
            <Link
              to={`/collection?fabric=${encodeURIComponent(product.fabric_type)}`}
              className="text-xs font-semibold text-jvb-pink-600 hover:text-jvb-wine-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
