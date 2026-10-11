// ==============================================================================
// JAIN VASTAR BHANDAR (JVB) - BUSINESS INFORMATION & CONSTANTS
// Rules:
// - Spelling: VASTAR (not VASTER)
// - Exclusively UNSTITCHED LADIES' SUITS
// - Authorized stockists of leading labels: Ganga, Krupali, Sahiba, Varsha, etc.
// ==============================================================================

import type { BusinessInfo, CartItem } from '../types';

export const BUSINESS_INFO: BusinessInfo = {
  name: 'Jain Vastar Bhandar',
  shortName: 'JVB',
  established: 1977,
  instagramHandle: '@jainvasterbhandar',
  instagramUrl: 'https://www.instagram.com/jainvasterbhandar?exln=ZjU0a3Jwam43bmdo',
  primaryPhone: '9416950256',
  secondaryPhone: '7015344280',
  whatsappPhone: '7015344280',
  whatsappUrl: 'https://wa.me/917015344280',
  address: {
    street: 'Railway Road',
    city: 'Gharaunda',
    district: 'Karnal',
    state: 'Haryana',
    pincode: '132114',
    country: 'India',
    fullAddress: 'Railway Road, Gharaunda, Karnal, Haryana – 132114, India',
  },
};

export const GOOGLE_MAPS_SEARCH_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  'Railway Road, Gharaunda, Karnal, Haryana 132114'
)}`;

export const FABRIC_CATEGORIES = [
  'Pure Cotton',
  'Chanderi Silk',
  'Georgette',
  'Organza',
  'Modal Silk',
  'Linen',
  'Pashmina',
  'Crepe',
] as const;

export const SUIT_BRANDS = [
  'Ganga',
  'Krupali',
  'Sahiba',
  'Varsha',
  'Belliza',
  'JVB Handpicked',
] as const;

/**
 * Builds prefilled WhatsApp inquiry message for a specific unstitched suit
 */
export function buildProductWhatsAppUrl(
  productName: string,
  sku: string,
  quantity = 1,
  productUrl?: string,
  brand?: string
): string {
  const currentUrl = productUrl || (typeof window !== 'undefined' ? window.location.href : '');
  const message = [
    `Namaste Jain Vastar Bhandar,`,
    ``,
    `I would like to inquire about this unstitched ladies' suit:`,
    brand ? `• Brand: ${brand}` : '',
    `• Suit: ${productName}`,
    `• Code / SKU: ${sku}`,
    `• Requested Quantity: ${quantity}`,
    currentUrl ? `• Link: ${currentUrl}` : '',
    ``,
    `Please let me know if this suit is currently in stock. Thank you!`,
  ]
    .filter(Boolean)
    .join('\n');

  return `https://wa.me/91${BUSINESS_INFO.whatsappPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Builds prefilled WhatsApp order message for an entire cart
 */
export function buildCartWhatsAppUrl(
  items: CartItem[],
  customerDetails: {
    name: string;
    phone: string;
    address: string;
    city: string;
    pincode: string;
    orderNumber?: string;
  }
): string {
  const total = items.reduce((sum, item) => {
    const price = item.product.sale_price || item.product.price;
    return sum + price * item.quantity;
  }, 0);

  const itemsList = items
    .map(
      (item, idx) =>
        `${idx + 1}. ${item.product.name} (SKU: ${item.product.sku}${
          item.product.brand ? `, Brand: ${item.product.brand}` : ''
        }) x ${item.quantity} = ₹${(
          (item.product.sale_price || item.product.price) * item.quantity
        ).toLocaleString('en-IN')}`
    )
    .join('\n');

  const message = [
    `Namaste Jain Vastar Bhandar,`,
    ``,
    `I would like to place an order from your website:`,
    customerDetails.orderNumber ? `• Order Reference: ${customerDetails.orderNumber}` : '',
    `• Customer Name: ${customerDetails.name}`,
    `• Mobile Phone: ${customerDetails.phone}`,
    `• Delivery Address: ${customerDetails.address}, ${customerDetails.city} - ${customerDetails.pincode}`,
    ``,
    `Unstitched Suits Ordered:`,
    itemsList,
    ``,
    `• Total Amount: ₹${total.toLocaleString('en-IN')}`,
    ``,
    `Please confirm the order, share payment details (UPI/Account), and dispatch timeline. Thank you!`,
  ]
    .filter(Boolean)
    .join('\n');

  return `https://wa.me/91${BUSINESS_INFO.whatsappPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * General WhatsApp inquiry URL
 */
export function buildGeneralWhatsAppUrl(): string {
  const message = `Namaste Jain Vastar Bhandar, I am browsing your unstitched ladies' suit collection and have an inquiry.`;
  return `https://wa.me/91${BUSINESS_INFO.whatsappPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Format INR currency
 */
export function formatCurrencyINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
