-- ==============================================================================
-- JAIN VASTAR BHANDAR (JVB) - PRODUCTION DATABASE SCHEMA & RLS POLICIES
-- Business Established: 1977 | Gharaunda, Karnal, Haryana
-- Specialty: Exclusively Unstitched Ladies' Suits
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sku TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL DEFAULT '',
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  sale_price NUMERIC(10, 2) CHECK (sale_price IS NULL OR sale_price >= 0),
  fabric_type TEXT NOT NULL, -- e.g., 'Pure Cotton', 'Chanderi Silk', 'Georgette', 'Modal Silk', 'Organza', 'Linen'
  brand TEXT DEFAULT 'Ganga', -- e.g., 'Ganga', 'Krupali', 'Sahiba', 'Varsha', 'Belliza', 'JVB Handpicked'
  color TEXT NOT NULL,
  pattern TEXT NOT NULL, -- e.g., 'Bandhani', 'Handblock Print', 'Embroidery', 'Zari Work', 'Floral Print', 'Solid'
  included_material TEXT NOT NULL DEFAULT 'Top (Kurta): 2.5m, Bottom (Salwar): 2.5m, Dupatta: 2.25m',
  stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Migration support for existing setups:
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS brand TEXT;

-- 3. PRODUCT IMAGES TABLE
CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  alt_text TEXT DEFAULT '',
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. ADMIN USERS TABLE (Explicit role verification for additional security)
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products(sku);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_fabric_type ON public.products(fabric_type);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON public.products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON public.product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_order ON public.product_images(product_id, display_order ASC);

-- 6. AUTOMATIC UPDATED_AT TRIGGER
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_products_updated_at ON public.products;
CREATE TRIGGER set_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 7. HELPER FUNCTION TO CHECK IF AUTHENTICATED USER IS AN AUTHORIZED ADMIN
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    auth.role() = 'authenticated' AND (
      EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
      OR NOT EXISTS (SELECT 1 FROM public.admin_users) -- Fallback during initial setup before first row inserted
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- PRODUCTS POLICIES:
-- Anonymous & public users can ONLY SELECT published products
CREATE POLICY "Public can view published products"
  ON public.products
  FOR SELECT
  TO public
  USING (status = 'published');

-- Authenticated admins can view ALL products (drafts, published, archived)
CREATE POLICY "Admins can view all products"
  ON public.products
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- Authenticated admins can insert new products
CREATE POLICY "Admins can insert products"
  ON public.products
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

-- Authenticated admins can update products
CREATE POLICY "Admins can update products"
  ON public.products
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Authenticated admins can delete products
CREATE POLICY "Admins can delete products"
  ON public.products
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- PRODUCT IMAGES POLICIES:
-- Public can view images of published products
CREATE POLICY "Public can view images of published products"
  ON public.product_images
  FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM public.products
      WHERE public.products.id = public.product_images.product_id
        AND public.products.status = 'published'
    )
  );

-- Admins can view all images
CREATE POLICY "Admins can view all images"
  ON public.product_images
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- Admins can manage images
CREATE POLICY "Admins can insert product images"
  ON public.product_images
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update product images"
  ON public.product_images
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete product images"
  ON public.product_images
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ADMIN USERS POLICIES:
CREATE POLICY "Admins can view admin profiles"
  ON public.admin_users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Super admins can manage admin users"
  ON public.admin_users
  FOR ALL
  TO authenticated
  USING (public.is_admin());

-- 9. STORAGE BUCKET CONFIGURATION (Run in Supabase SQL editor)
-- Creates the public storage bucket for product images:
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage policies:
-- Anyone can view product images in public bucket
CREATE POLICY "Public images are viewable by anyone"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'product-images');

-- Only authenticated admins can upload images
CREATE POLICY "Admins can upload product images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'product-images');

-- Only authenticated admins can update images
CREATE POLICY "Admins can update product images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'product-images');

-- Only authenticated admins can delete images
CREATE POLICY "Admins can delete product images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'product-images');
