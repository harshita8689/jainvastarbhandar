import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  MessageCircle,
  ShoppingBag,
  ArrowRight,
  MapPin,
  Phone,
  ShieldCheck,
  Package,
} from 'lucide-react';
import { BUSINESS_INFO, formatCurrencyINR, buildCartWhatsAppUrl } from '../utils/constants';
import type { CartItem } from '../types';

interface StoredOrder {
  orderNumber: string;
  items: CartItem[];
  total: number;
  customer: {
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    notes?: string;
  };
  createdAt: string;
}

export const OrderSuccessPage: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [order, setOrder] = useState<StoredOrder | null>(null);

  useEffect(() => {
    if (orderNumber) {
      try {
        const stored = sessionStorage.getItem(`order_${orderNumber}`);
        if (stored) {
          setOrder(JSON.parse(stored));
        }
      } catch (e) {
        console.error('Failed to parse order from session storage', e);
      }
    }
  }, [orderNumber]);

  const reOpenWhatsApp = () => {
    if (order) {
      const url = buildCartWhatsAppUrl(order.items, {
        name: order.customer.name,
        phone: order.customer.phone,
        address: order.customer.address,
        city: order.customer.city,
        pincode: order.customer.pincode,
        orderNumber: order.orderNumber,
      });
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      window.open(
        `https://wa.me/91${BUSINESS_INFO.whatsappPhone}?text=${encodeURIComponent(
          `Namaste Jain Vastar Bhandar, I placed order reference ${orderNumber} on your website.`
        )}`,
        '_blank'
      );
    }
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Main Success Card */}
        <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm p-8 sm:p-12 text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-emerald-50/50">
            <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
          </div>

          <span className="inline-block px-3 py-1 bg-rose-50 text-rose-800 text-xs font-semibold rounded-full uppercase tracking-wider mb-3">
            Order Request Placed
          </span>

          <h1 className="font-serif text-2xl sm:text-4xl text-stone-900 font-semibold mb-3">
            Thank You for Shopping with JVB!
          </h1>

          <p className="text-stone-600 text-sm sm:text-base max-w-lg mx-auto mb-6 leading-relaxed">
            Your unstitched suit order request has been registered. Order Reference:{' '}
            <span className="font-mono font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded">
              {orderNumber || 'JVB-REQUEST'}
            </span>
          </p>

          {/* WhatsApp Direct Action */}
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-5 mb-8 text-left sm:flex items-center justify-between gap-4">
            <div className="space-y-1 mb-4 sm:mb-0">
              <p className="font-semibold text-emerald-900 text-sm sm:text-base flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-emerald-700" />
                WhatsApp Message Initiated
              </p>
              <p className="text-xs sm:text-sm text-emerald-800">
                If your WhatsApp window didn't open automatically, click the button to finalize your
                order directly with our store team.
              </p>
            </div>
            <button
              type="button"
              onClick={reOpenWhatsApp}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-all shrink-0"
            >
              Open WhatsApp Now
            </button>
          </div>

          {/* Order Details Accordion / Summary if available */}
          {order && (
            <div className="border border-stone-200 rounded-xl overflow-hidden text-left mb-8">
              <div className="bg-stone-50 px-5 py-3 border-b border-stone-200 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-700 flex items-center gap-2">
                  <Package className="w-4 h-4 text-stone-500" /> Ordered Items ({order.items.length})
                </span>
                <span className="text-sm font-semibold text-rose-700 font-serif">
                  Total: {formatCurrencyINR(order.total)}
                </span>
              </div>
              <div className="divide-y divide-stone-100 p-4 space-y-3">
                {order.items.map((item) => (
                  <div key={item.product.id} className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-3">
                      {item.product.images?.[0] && (
                        <img
                          src={item.product.images[0].public_url}
                          alt={item.product.name}
                          className="w-12 h-14 object-cover rounded border border-stone-200"
                        />
                      )}
                      <div>
                        <p className="text-sm font-medium text-stone-900 leading-snug">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-stone-500">
                          {item.product.brand && `${item.product.brand} • `}Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-stone-900">
                      {formatCurrencyINR(
                        (item.product.sale_price || item.product.price) * item.quantity
                      )}
                    </span>
                  </div>
                ))}

                {/* Delivery Recipient */}
                <div className="pt-4 text-xs text-stone-600">
                  <p className="font-semibold text-stone-800 mb-1">Delivering to:</p>
                  <p>
                    {order.customer.name} ({order.customer.phone})
                  </p>
                  <p>
                    {order.customer.address}, {order.customer.city} - {order.customer.pincode}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-stone-100">
            <Link
              to="/collection"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-rose-700 hover:bg-rose-800 text-white rounded-lg text-sm font-medium transition-all shadow-sm"
            >
              <ShoppingBag className="w-4 h-4" />
              Continue Shopping
            </Link>
            <Link
              to="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 rounded-lg text-sm font-medium transition-all"
            >
              Back to Home
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Store Trust & Contact Information */}
        <div className="bg-white rounded-xl border border-stone-200/80 p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-stone-700 text-xs sm:text-sm">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-stone-900">Authentic Suit Material</p>
              <p className="text-stone-500 text-xs mt-0.5">
                100% genuine pieces from Ganga, Krupali, Sahiba & verified handpicked mills.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-stone-900">Store Support</p>
              <p className="text-stone-500 text-xs mt-0.5">
                Call {BUSINESS_INFO.primaryPhone} or {BUSINESS_INFO.secondaryPhone} for assistance.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-stone-900">Physical Store</p>
              <p className="text-stone-500 text-xs mt-0.5">
                Railway Road, Gharaunda, Karnal, Haryana – 132114 (Est. 1977).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
