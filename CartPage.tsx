import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  MessageCircle,
  ShieldCheck,
  Truck,
  PhoneCall,
  AlertCircle,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { BUSINESS_INFO, formatCurrencyINR, buildCartWhatsAppUrl } from '../utils/constants';

export const CartPage: React.FC = () => {
  const { items, updateQuantity, removeFromCart, clearCart, cartTotal, itemCount } = useCart();
  const navigate = useNavigate();

  // Customer Checkout Details
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: 'Gharaunda',
    state: 'Haryana',
    pincode: '132114',
    notes: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'Please provide your full name';
    if (!formData.phone.trim()) {
      errors.phone = 'Mobile / WhatsApp number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
      errors.phone = 'Please enter a valid 10-digit Indian mobile number';
    }
    if (!formData.address.trim()) errors.address = 'Street address / house number is required';
    if (!formData.city.trim()) errors.city = 'City / Town is required';
    if (!formData.pincode.trim() || !/^\d{6}$/.test(formData.pincode.trim())) {
      errors.pincode = 'Please enter a valid 6-digit PIN code';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const orderNumber = `JVB-${Date.now().toString().slice(-6)}`;
      const orderPayload = {
        orderNumber,
        items,
        total: cartTotal,
        customer: formData,
        createdAt: new Date().toISOString(),
      };

      // Store in session storage for the confirmation page
      sessionStorage.setItem(`order_${orderNumber}`, JSON.stringify(orderPayload));

      // Build WhatsApp URL
      const whatsappUrl = buildCartWhatsAppUrl(items, {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        pincode: formData.pincode.trim(),
        orderNumber,
      });

      // Clear the cart
      clearCart();

      // Open WhatsApp in new tab
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

      // Navigate to order success screen
      navigate(`/order-success/${orderNumber}`);
    } catch (err) {
      console.error('Order dispatch error', err);
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-[#FAF8F5] min-h-[70vh] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center bg-white rounded-2xl p-10 sm:p-14 border border-stone-200/80 shadow-sm">
          <div className="w-20 h-20 bg-rose-50 text-rose-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-stone-900 mb-3 font-semibold">
            Your Shopping Bag is Empty
          </h1>
          <p className="text-stone-600 text-sm sm:text-base mb-8 max-w-md mx-auto leading-relaxed">
            Discover our curated collection of 100% genuine unstitched ladies' suits from authentic
            brands like Ganga, Krupali, and exclusive handpicked fabrics.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/collection"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-rose-700 hover:bg-rose-800 text-white rounded-lg font-medium transition-all shadow-sm"
            >
              Explore Unstitched Suits
            </Link>
            <a
              href={`https://wa.me/91${BUSINESS_INFO.whatsappPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white border border-stone-300 hover:border-emerald-500 text-stone-700 hover:text-emerald-700 rounded-lg font-medium transition-all"
            >
              <MessageCircle className="w-5 h-5 text-emerald-600" />
              Inquire on WhatsApp
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Breadcrumb */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-stone-200">
          <div>
            <Link
              to="/collection"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-500 hover:text-rose-700 mb-2 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Collection
            </Link>
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-stone-900 font-semibold">
              Shopping Bag{' '}
              <span className="text-stone-500 text-xl font-normal font-sans">
                ({itemCount} {itemCount === 1 ? 'Suit' : 'Suits'})
              </span>
            </h1>
          </div>
          <button
            type="button"
            onClick={clearCart}
            className="text-xs sm:text-sm text-stone-500 hover:text-red-700 font-medium inline-flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Clear Bag
          </button>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-xl border border-stone-200/80 shadow-sm overflow-hidden divide-y divide-stone-100">
              {items.map((item) => {
                const effectivePrice = item.product.sale_price || item.product.price;
                const lineTotal = effectivePrice * item.quantity;
                const imageUrl =
                  item.product.images?.[0]?.public_url ||
                  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80';

                return (
                  <div key={item.product.id} className="p-4 sm:p-5 flex gap-4 sm:gap-6">
                    {/* Thumbnail */}
                    <Link
                      to={`/product/${item.product.slug}`}
                      className="shrink-0 w-24 h-32 sm:w-28 sm:h-36 bg-stone-100 rounded-lg overflow-hidden border border-stone-200 block group"
                    >
                      <img
                        src={imageUrl}
                        alt={item.product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            {item.product.brand && (
                              <span className="inline-block text-[11px] font-bold tracking-wider uppercase text-rose-700 bg-rose-50 px-2 py-0.5 rounded mb-1">
                                {item.product.brand}
                              </span>
                            )}
                            <h2 className="font-serif text-base sm:text-lg font-semibold text-stone-900 leading-snug">
                              <Link
                                to={`/product/${item.product.slug}`}
                                className="hover:text-rose-700 transition-colors"
                              >
                                {item.product.name}
                              </Link>
                            </h2>
                            <p className="text-xs text-stone-500 mt-0.5">
                              SKU: <span className="font-mono text-stone-700">{item.product.sku}</span>
                              {item.product.fabric_type && ` • Fabric: ${item.product.fabric_type}`}
                            </p>
                          </div>

                          {/* Remove button */}
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.product.id)}
                            className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg hover:bg-stone-50 transition-colors"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Pricing and Quantity controls */}
                      <div className="flex flex-wrap items-end justify-between gap-3 mt-4 pt-3 border-t border-stone-100">
                        {/* Quantity Counter */}
                        <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden bg-white">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="w-8 h-8 flex items-center justify-center text-stone-600 hover:bg-stone-100 disabled:opacity-40 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-10 text-center font-medium text-sm text-stone-900">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock_quantity}
                            className="w-8 h-8 flex items-center justify-center text-stone-600 hover:bg-stone-100 disabled:opacity-40 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Price Breakdown */}
                        <div className="text-right">
                          <div className="font-semibold text-stone-900 text-base sm:text-lg">
                            {formatCurrencyINR(lineTotal)}
                          </div>
                          {item.quantity > 1 && (
                            <div className="text-xs text-stone-500">
                              {formatCurrencyINR(effectivePrice)} each
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Authenticity Guarantee Card */}
            <div className="bg-rose-50/60 border border-rose-100 rounded-xl p-4 sm:p-5 flex items-start gap-4">
              <ShieldCheck className="w-6 h-6 text-rose-700 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-stone-700 space-y-1">
                <p className="font-semibold text-stone-900">100% Genuine Unstitched Suit Guarantee</p>
                <p className="text-stone-600">
                  Direct stock from authentic mills & premier design houses like Ganga, Krupali, and
                  heritage weavers. Sold directly by Jain Vastar Bhandar, Gharaunda (Est. 1977).
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Checkout & Delivery Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-xl border border-stone-200/80 shadow-sm p-6 sm:p-8">
              <h2 className="font-serif text-xl font-semibold text-stone-900 mb-4 pb-3 border-b border-stone-100">
                Order & Delivery Details
              </h2>

              <form onSubmit={handlePlaceOrder} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Full Name <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Smt. Neha Sharma"
                    className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 transition-all ${
                      formErrors.name ? 'border-red-500 bg-red-50/20' : 'border-stone-300'
                    }`}
                  />
                  {formErrors.name && (
                    <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {formErrors.name}
                    </p>
                  )}
                </div>

                {/* Mobile / WhatsApp Phone */}
                <div>
                  <label htmlFor="phone" className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    WhatsApp / Mobile Number <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-sm text-stone-400 font-medium">+91</span>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      maxLength={10}
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="9876543210"
                      className={`w-full pl-12 pr-3.5 py-2.5 rounded-lg border text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 transition-all ${
                        formErrors.phone ? 'border-red-500 bg-red-50/20' : 'border-stone-300'
                      }`}
                    />
                  </div>
                  {formErrors.phone && (
                    <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {formErrors.phone}
                    </p>
                  )}
                  <p className="text-[11px] text-stone-500 mt-1">
                    Our team will coordinate dispatch & delivery updates via this number.
                  </p>
                </div>

                {/* Delivery Address */}
                <div>
                  <label htmlFor="address" className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Delivery Address <span className="text-rose-600">*</span>
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    rows={2}
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="House/Flat No., Street, Landmark"
                    className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 transition-all ${
                      formErrors.address ? 'border-red-500 bg-red-50/20' : 'border-stone-300'
                    }`}
                  />
                  {formErrors.address && (
                    <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {formErrors.address}
                    </p>
                  )}
                </div>

                {/* City, State, PIN */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label htmlFor="city" className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                      City / Town <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                    />
                  </div>
                  <div>
                    <label htmlFor="pincode" className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                      PIN Code <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      id="pincode"
                      name="pincode"
                      maxLength={6}
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                    />
                  </div>
                </div>

                {/* Additional Note */}
                <div>
                  <label htmlFor="notes" className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Special Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="e.g. Call before dispatch, color shade preference"
                    className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  />
                </div>

                {/* Price Breakdown */}
                <div className="pt-4 border-t border-stone-200 space-y-2 text-sm text-stone-600">
                  <div className="flex justify-between">
                    <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'}):</span>
                    <span className="font-medium text-stone-900">{formatCurrencyINR(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between items-center text-emerald-700">
                    <span className="flex items-center gap-1.5">
                      <Truck className="w-4 h-4" /> Store Delivery / Dispatch:
                    </span>
                    <span className="font-medium">Direct via Store</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-dashed border-stone-200 text-base sm:text-lg font-semibold text-stone-900">
                    <span>Estimated Total:</span>
                    <span className="text-rose-700 font-serif">{formatCurrencyINR(cartTotal)}</span>
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all text-sm sm:text-base disabled:opacity-60"
                  >
                    <MessageCircle className="w-5 h-5 fill-current" />
                    Place Order via WhatsApp ({formatCurrencyINR(cartTotal)})
                  </button>
                  <p className="text-[11px] text-center text-stone-500 mt-2">
                    Clicking will open WhatsApp with your item summary to finalize payment and courier dispatch directly with Jain Vastar Bhandar.
                  </p>
                </div>
              </form>

              {/* Direct Store Helpline */}
              <div className="mt-6 pt-5 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
                <span className="flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5 text-stone-500" /> Need Help?
                </span>
                <div className="flex gap-3 font-medium text-stone-800">
                  <a href={`tel:${BUSINESS_INFO.primaryPhone}`} className="hover:text-rose-700">
                    {BUSINESS_INFO.primaryPhone}
                  </a>
                  <span>•</span>
                  <a href={`tel:${BUSINESS_INFO.secondaryPhone}`} className="hover:text-rose-700">
                    {BUSINESS_INFO.secondaryPhone}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
