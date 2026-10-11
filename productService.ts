import { supabase, isSupabaseConfigured } from '../lib/supabase/client';
import type { Product, ProductFormData, FilterOptions, SortOption, ProductStatus } from '../types';

export interface ProductsResponse {
  products: Product[];
  totalCount: number;
  error: string | null;
}

export interface AdminStats {
  total: number;
  published: number;
  drafts: number;
  archived: number;
  soldOut: number;
  lowStock: number;
}

/**
 * Utility to generate a URL-friendly slug from product name and SKU
 */
export function generateSlug(name: string, sku: string): string {
  const base = `${name}-${sku}`
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return base || `product-${Date.now()}`;
}

export const productService = {
  /**
   * Fetch products for the public storefront or admin dashboard
   */
  async getProducts(
    options: FilterOptions = {},
    sort: SortOption = 'newest',
    page = 1,
    pageSize = 12,
    isAdmin = false
  ): Promise<ProductsResponse> {
    if (!isSupabaseConfigured) {
      return {
        products: [],
        totalCount: 0,
        error: 'Supabase credentials are not configured. Please add your credentials in .env or see the setup guide.',
      };
    }

    try {
      let query = supabase
        .from('products')
        .select('*, images:product_images(*)', { count: 'exact' });

      // Public visitors can only view published suits
      if (!isAdmin) {
        query = query.eq('status', 'published');
      } else if (options.status) {
        query = query.eq('status', options.status);
      }

      // Filter by fabric type
      if (options.fabric_type && options.fabric_type !== 'all') {
        query = query.eq('fabric_type', options.fabric_type);
      }

      // Filter by brand
      if (options.brand && options.brand !== 'all') {
        const brandTerm = options.brand.trim();
        query = query.or(`name.ilike.%${brandTerm}%,description.ilike.%${brandTerm}%`);
      }

      // Filter by search text (Name or SKU)
      if (options.search && options.search.trim()) {
        const searchTerm = options.search.trim();
        query = query.or(`name.ilike.%${searchTerm}%,sku.ilike.%${searchTerm}%`);
      }

      // Filter by price range
      if (options.minPrice !== undefined && options.minPrice > 0) {
        query = query.gte('price', options.minPrice);
      }
      if (options.maxPrice !== undefined && options.maxPrice > 0) {
        query = query.lte('price', options.maxPrice);
      }

      // Filter by stock
      if (options.inStockOnly) {
        query = query.gt('stock_quantity', 0);
      }

      // Apply sorting
      switch (sort) {
        case 'price-asc':
          query = query.order('price', { ascending: true });
          break;
        case 'price-desc':
          query = query.order('price', { ascending: false });
          break;
        case 'name-asc':
          query = query.order('name', { ascending: true });
          break;
        case 'newest':
        default:
          query = query.order('created_at', { ascending: false });
          break;
      }

      // Apply pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, count, error } = await query;

      if (error) {
        console.error('Error fetching products:', error);
        return { products: [], totalCount: 0, error: error.message };
      }

      // Sort images by display_order
      const products: Product[] = (data || []).map((prod: any) => ({
        ...prod,
        images: (prod.images || []).sort((a: any, b: any) => a.display_order - b.display_order),
      }));

      return {
        products,
        totalCount: count || 0,
        error: null,
      };
    } catch (err: any) {
      console.error('Exception fetching products:', err);
      return { products: [], totalCount: 0, error: err?.message || 'Failed to fetch products' };
    }
  },

  /**
   * Fetch featured products for homepage
   */
  async getFeaturedProducts(limit = 6): Promise<{ products: Product[]; error: string | null }> {
    if (!isSupabaseConfigured) {
      return { products: [], error: 'Supabase credentials not configured' };
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, images:product_images(*)')
        .eq('status', 'published')
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        return { products: [], error: error.message };
      }

      const products = (data || []).map((prod: any) => ({
        ...prod,
        images: (prod.images || []).sort((a: any, b: any) => a.display_order - b.display_order),
      }));

      return { products, error: null };
    } catch (err: any) {
      return { products: [], error: err?.message || 'Failed to fetch featured products' };
    }
  },

  /**
   * Fetch product by slug for product detail page
   */
  async getProductBySlug(slug: string, isAdmin = false): Promise<{ product: Product | null; error: string | null }> {
    if (!isSupabaseConfigured) {
      return { product: null, error: 'Database unconfigured' };
    }

    try {
      let query = supabase
        .from('products')
        .select('*, images:product_images(*)')
        .eq('slug', slug);

      if (!isAdmin) {
        query = query.eq('status', 'published');
      }

      const { data, error } = await query.single();

      if (error) {
        return { product: null, error: error.message };
      }

      if (!data) {
        return { product: null, error: 'Product not found' };
      }

      const product: Product = {
        ...data,
        images: (data.images || []).sort((a: any, b: any) => a.display_order - b.display_order),
      };

      return { product, error: null };
    } catch (err: any) {
      return { product: null, error: err?.message || 'Error loading product' };
    }
  },

  /**
   * Fetch product by ID
   */
  async getProductById(id: string): Promise<{ product: Product | null; error: string | null }> {
    if (!isSupabaseConfigured) return { product: null, error: 'Database unconfigured' };

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, images:product_images(*)')
        .eq('id', id)
        .single();

      if (error) return { product: null, error: error.message };

      const product: Product = {
        ...data,
        images: (data.images || []).sort((a: any, b: any) => a.display_order - b.display_order),
      };

      return { product, error: null };
    } catch (err: any) {
      return { product: null, error: err?.message || 'Error loading product' };
    }
  },

  /**
   * Create a new product (Admin only)
   */
  async createProduct(formData: ProductFormData): Promise<{ product: Product | null; error: string | null }> {
    if (!isSupabaseConfigured) {
      return { product: null, error: 'Supabase credentials are not configured.' };
    }

    try {
      const slug = formData.slug || generateSlug(formData.name, formData.sku);

      // Check if SKU exists
      const { data: existingSku } = await supabase
        .from('products')
        .select('id')
        .eq('sku', formData.sku)
        .maybeSingle();

      if (existingSku) {
        return { product: null, error: `A product with code / SKU "${formData.sku}" already exists.` };
      }

      const insertPayload: any = {
        sku: formData.sku.trim().toUpperCase(),
        name: formData.name.trim(),
        slug,
        description: formData.description.trim(),
        price: Number(formData.price),
        sale_price: formData.sale_price ? Number(formData.sale_price) : null,
        fabric_type: formData.fabric_type.trim(),
        color: formData.color.trim(),
        pattern: formData.pattern.trim(),
        included_material: formData.included_material.trim(),
        stock_quantity: Math.max(0, parseInt(String(formData.stock_quantity), 10) || 0),
        status: formData.status,
        is_featured: formData.is_featured,
      };

      if (formData.brand) {
        insertPayload.brand = formData.brand.trim();
      }

      const { data, error } = await supabase
        .from('products')
        .insert(insertPayload)
        .select()
        .single();

      if (error) {
        return { product: null, error: error.message };
      }

      return { product: data, error: null };
    } catch (err: any) {
      return { product: null, error: err?.message || 'Failed to create product' };
    }
  },

  /**
   * Update an existing product (Admin only)
   */
  async updateProduct(
    id: string,
    updates: Partial<ProductFormData>
  ): Promise<{ product: Product | null; error: string | null }> {
    if (!isSupabaseConfigured) {
      return { product: null, error: 'Supabase credentials are not configured.' };
    }

    try {
      const payload: any = {};
      if (updates.name !== undefined) payload.name = updates.name.trim();
      if (updates.sku !== undefined) payload.sku = updates.sku.trim().toUpperCase();
      if (updates.brand !== undefined) payload.brand = updates.brand ? updates.brand.trim() : null;
      if (updates.description !== undefined) payload.description = updates.description.trim();
      if (updates.price !== undefined) payload.price = Number(updates.price);
      if (updates.sale_price !== undefined) {
        payload.sale_price = updates.sale_price ? Number(updates.sale_price) : null;
      }
      if (updates.fabric_type !== undefined) payload.fabric_type = updates.fabric_type.trim();
      if (updates.color !== undefined) payload.color = updates.color.trim();
      if (updates.pattern !== undefined) payload.pattern = updates.pattern.trim();
      if (updates.included_material !== undefined) payload.included_material = updates.included_material.trim();
      if (updates.stock_quantity !== undefined) {
        payload.stock_quantity = Math.max(0, parseInt(String(updates.stock_quantity), 10) || 0);
      }
      if (updates.status !== undefined) payload.status = updates.status;
      if (updates.is_featured !== undefined) payload.is_featured = updates.is_featured;

      const { data, error } = await supabase
        .from('products')
        .update(payload)
        .eq('id', id)
        .select('*, images:product_images(*)')
        .single();

      if (error) {
        return { product: null, error: error.message };
      }

      return { product: data, error: null };
    } catch (err: any) {
      return { product: null, error: err?.message || 'Failed to update product' };
    }
  },

  /**
   * Update stock quantity directly
   */
  async updateStock(id: string, stockQuantity: number): Promise<{ success: boolean; error: string | null }> {
    if (!isSupabaseConfigured) return { success: false, error: 'Database unconfigured' };

    try {
      const safeStock = Math.max(0, Math.floor(stockQuantity));
      const { error } = await supabase
        .from('products')
        .update({ stock_quantity: safeStock })
        .eq('id', id);

      if (error) return { success: false, error: error.message };
      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to update stock' };
    }
  },

  /**
   * Change status (published, draft, archived)
   */
  async setStatus(id: string, status: ProductStatus): Promise<{ success: boolean; error: string | null }> {
    if (!isSupabaseConfigured) return { success: false, error: 'Database unconfigured' };

    try {
      const { error } = await supabase
        .from('products')
        .update({ status })
        .eq('id', id);

      if (error) return { success: false, error: error.message };
      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to update status' };
    }
  },

  /**
   * Delete product: archive (soft-delete) or permanent delete
   */
  async deleteProduct(id: string, permanent = false): Promise<{ success: boolean; error: string | null }> {
    if (!isSupabaseConfigured) return { success: false, error: 'Database unconfigured' };

    try {
      if (!permanent) {
        return this.setStatus(id, 'archived');
      }

      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) return { success: false, error: error.message };
      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to delete product' };
    }
  },

  /**
   * Fetch aggregate admin statistics
   */
  async getAdminStats(): Promise<{ stats: AdminStats; error: string | null }> {
    if (!isSupabaseConfigured) {
      return {
        stats: { total: 0, published: 0, drafts: 0, archived: 0, soldOut: 0, lowStock: 0 },
        error: 'Database unconfigured',
      };
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, status, stock_quantity');

      if (error) {
        return {
          stats: { total: 0, published: 0, drafts: 0, archived: 0, soldOut: 0, lowStock: 0 },
          error: error.message,
        };
      }

      const items = data || [];
      const stats: AdminStats = {
        total: items.length,
        published: items.filter((p) => p.status === 'published').length,
        drafts: items.filter((p) => p.status === 'draft').length,
        archived: items.filter((p) => p.status === 'archived').length,
        soldOut: items.filter((p) => p.stock_quantity === 0).length,
        lowStock: items.filter((p) => p.stock_quantity > 0 && p.stock_quantity <= 5).length,
      };

      return { stats, error: null };
    } catch (err: any) {
      return {
        stats: { total: 0, published: 0, drafts: 0, archived: 0, soldOut: 0, lowStock: 0 },
        error: err?.message || 'Failed to fetch admin stats',
      };
    }
  },

  /**
   * Fetch distinct fabric types for filter dropdown
   */
  async getAvailableFabrics(): Promise<string[]> {
    if (!isSupabaseConfigured) return [];

    try {
      const { data } = await supabase
        .from('products')
        .select('fabric_type')
        .eq('status', 'published');

      if (!data) return [];
      const set = new Set<string>();
      data.forEach((p) => {
        if (p.fabric_type) set.add(p.fabric_type);
      });
      return Array.from(set).sort();
    } catch {
      return [];
    }
  },
};
