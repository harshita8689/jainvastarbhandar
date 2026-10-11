// ==============================================================================
// JAIN VASTAR BHANDAR (JVB) - TYPE DEFINITIONS
// ==============================================================================

export type ProductStatus = 'draft' | 'published' | 'archived';

export interface ProductImage {
  id: string;
  product_id: string;
  storage_path: string;
  public_url: string;
  alt_text?: string;
  display_order: number;
  created_at?: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  brand?: string; // e.g., 'Ganga', 'Krupali', 'Sahiba', 'Varsha', 'JVB Heritage'
  description: string;
  price: number;
  sale_price?: number | null;
  fabric_type: string;
  color: string;
  pattern: string;
  included_material: string;
  stock_quantity: number;
  status: ProductStatus;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  images?: ProductImage[];
}

export interface ProductFormData {
  sku: string;
  name: string;
  slug?: string;
  brand?: string;
  description: string;
  price: number;
  sale_price?: number | null;
  fabric_type: string;
  color: string;
  pattern: string;
  included_material: string;
  stock_quantity: number;
  status: ProductStatus;
  is_featured: boolean;
  new_images?: File[];
  existing_images?: ProductImage[];
}

export interface FilterOptions {
  search?: string;
  fabric_type?: string;
  brand?: string;
  color?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  status?: ProductStatus;
}

export type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'name-asc';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  id?: string;
  product_id?: string;
  product_name: string;
  sku: string;
  price: number;
  quantity: number;
  image_url?: string;
}

export interface Order {
  id?: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  shipping_address: string;
  city: string;
  pincode: string;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'dispatched' | 'delivered' | 'cancelled';
  notes?: string;
  items?: OrderItem[];
  created_at?: string;
}

export interface CSVImportRow {
  sku: string;
  name: string;
  brand?: string;
  price: string;
  sale_price?: string;
  fabric_type: string;
  color: string;
  pattern: string;
  included_material: string;
  stock_quantity: string;
  description: string;
  status?: string;
  is_featured?: string;
  image_url?: string;
}

export interface ValidatedCSVRow {
  rowNumber: number;
  data: Partial<Product>;
  imageUrl?: string;
  isValid: boolean;
  errors: string[];
}

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'super_admin';
  created_at: string;
}

export interface BusinessInfo {
  name: string;
  shortName: string;
  established: number;
  instagramHandle: string;
  instagramUrl: string;
  primaryPhone: string;
  secondaryPhone: string;
  whatsappPhone: string;
  whatsappUrl: string;
  address: {
    street: string;
    city: string;
    district: string;
    state: string;
    pincode: string;
    country: string;
    fullAddress: string;
  };
}
