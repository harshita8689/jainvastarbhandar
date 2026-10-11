import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Eye, Tag, ShoppingBag, Check } from 'lucide-react';
import type { Product } from '../../types';
import { formatCurrencyINR, buildProductWhatsAppUrl } from '../../utils/constants';
import { useCart } from '../../context/CartContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [imageError, setImageError] = useState(false);
  const [addedRecently, setAddedRecently] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAddedRecently(true);
    setTimeout(() => setAddedRecently(false), 1800);
  };

  const primaryImage =
    product.images && product.images.length > 0
      ? product.images[0].public_url
      : null;

  const fallbackImage =
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80';

  const isDemo =
    product.sku?.startsWith('DEMO-') ||
    product.name?.includes('[DEMO') ||
    product.name?.includes('[SAMPLE');

  const isSoldOut = product.stock_quantity === 0;
  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= 5;

  const discountPercent =
    product.sale_price && product.sale_price < product.price
      ? Math.round(((product.price - product.sale_price) / product.price) * 100)
      : null;

  const whatsAppUrl = buildProductWhatsAppUrl(
    product.name,
    product.sku,
    1,
    typeof window !== 'undefined' ? `${window.location.origin}/product/${product.slug}` : undefined,
    product.brand
  );

  return (
    <div className="group bg-white rounded-xl overflow-hidden border border-jvb-pink-100 shadow-subtle hover:shadow-card transition-all duration-300 flex flex-col h-full relative">
      {/* Demo Data Flag if applicable */}
      {isDemo && (
        <div className="absolute top-3 left-3 z-20 bg-amber-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
          DEMO DATA
        </div>
      )}

      {/* Image container */}
      <div className="relative aspect-[4/5] bg-stone-100 overflow-hidden">
        <Link to={`/product/${product.slug}`} className="block w-full h-full">
          <img
            src={imageError || !primaryImage ? fallbackImage : primaryImage}
            alt={product.name}
            onError={() => setImageError(true)}
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Fabric Type Badge */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className="bg-white/95 backdrop-blur-sm text-jvb-wine-700 text-xs font-semibold px-2.5 py-1 rounded-md shadow-sm border border-pink-100 flex items-center gap-1">
            <Tag className="w-3 h-3 text-jvb-pink-600" />
            {product.fabric_type}
          </span>
        </div>

        {/* Stock Status Badge */}
        <div className="absolute top-3 right-3 z-10">
          {isSoldOut ? (
            <span className="bg-stone-800 text-white text-[11px] font-bold px-2.5 py-1 rounded shadow">
              Sold Out
            </span>
          ) : isLowStock ? (
            <span className="bg-amber-600 text-white text-[11px] font-bold px-2.5 py-1 rounded shadow">
              Only {product.stock_quantity} Left
            </span>
          ) : (
            <span className="bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-1 rounded shadow">
              In Stock
            </span>
          )}
        </div>

        {/* Discount Badge if sale price */}
        {discountPercent && !isSoldOut && (
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-jvb-pink-600 text-white text-[11px] font-bold px-2 py-0.5 rounded shadow">
              {discountPercent}% OFF
            </span>
          </div>
        )}

        {/* Quick View Overlay on Desktop */}
        <div className="absolute inset-0 bg-jvb-wine-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex items-center justify-center">
          <span className="bg-white text-jvb-wine-700 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-md flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5" />
            View Fabric Details
          </span>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between bg-white">
        <div>
          {/* Brand & SKU Header */}
          <div className="flex items-center justify-between mb-1.5">
            {product.brand ? (
              <span className="text-[11px] font-bold tracking-wider uppercase text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                {product.brand}
              </span>
            ) : (
              <span className="text-[10px] text-jvb-pink-700 font-sans font-medium uppercase tracking-wider">
                Unstitched Suit
              </span>
            )}
            <span className="text-[11px] font-mono tracking-wider text-gray-500 uppercase">
              SKU: {product.sku}
            </span>
          </div>

          {/* Product Name */}
          <h3 className="font-serif text-base sm:text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-jvb-pink-700 transition-colors">
            <Link to={`/product/${product.slug}`}>{product.name}</Link>
          </h3>

          {/* Material Specs Snippet */}
          {product.included_material && (
            <p className="text-xs text-gray-600 mt-1 line-clamp-1">
              {product.included_material}
            </p>
          )}
        </div>

        <div className="pt-3 border-t border-gray-100 mt-3">
          {/* Pricing */}
          <div className="flex items-baseline gap-2 mb-3">
            {product.sale_price ? (
              <>
                <span className="text-lg sm:text-xl font-bold text-jvb-wine-700">
                  {formatCurrencyINR(product.sale_price)}
                </span>
                <span className="text-xs text-gray-500 line-through">
                  {formatCurrencyINR(product.price)}
                </span>
              </>
            ) : (
              <span className="text-lg sm:text-xl font-bold text-jvb-wine-700">
                {formatCurrencyINR(product.price)}
              </span>
            )}
          </div>

          {/* Action Buttons: Add to Bag + WhatsApp Inquire */}
          <div className="grid grid-cols-2 gap-2">
            {isSoldOut ? (
              <button
                disabled
                className="w-full py-2 px-3 rounded-lg bg-gray-100 text-gray-400 font-semibold text-xs cursor-not-allowed flex items-center justify-center gap-1 col-span-2"
              >
                <span>Sold Out</span>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={addedRecently}
                  className={`w-full py-2 px-2.5 rounded-lg border font-semibold text-xs transition-all flex items-center justify-center gap-1.5 ${
                    addedRecently
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                      : 'border-rose-300 text-rose-800 hover:bg-rose-50 active:scale-95'
                  }`}
                  title="Add to shopping bag"
                >
                  {addedRecently ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Added</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add to Bag</span>
                    </>
                  )}
                </button>

                <a
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-sm flex items-center justify-center gap-1"
                  title="Inquire directly on WhatsApp"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
