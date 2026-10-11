import { supabase, isSupabaseConfigured } from '../lib/supabase/client';
import type { ProductImage } from '../types';

const BUCKET_NAME = 'product-images';
const MAX_FILE_SIZE_MB = 5;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

export interface UploadProgress {
  fileName: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'failed';
  error?: string;
}

export const storageService = {
  /**
   * Validate image before uploading
   */
  validateImage(file: File): { isValid: boolean; error?: string } {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return {
        isValid: false,
        error: `Invalid file type "${file.type}". Please upload JPEG, PNG, or WebP images.`,
      };
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      return {
        isValid: false,
        error: `File "${file.name}" exceeds maximum allowed size of ${MAX_FILE_SIZE_MB}MB.`,
      };
    }

    return { isValid: true };
  },

  /**
   * Upload an image to Supabase Storage and link it to the product
   */
  async uploadProductImage(
    productId: string,
    file: File,
    displayOrder = 0,
    altText = ''
  ): Promise<{ image: ProductImage | null; error: string | null }> {
    if (!isSupabaseConfigured) {
      return { image: null, error: 'Supabase storage is unconfigured' };
    }

    const validation = this.validateImage(file);
    if (!validation.isValid) {
      return { image: null, error: validation.error || 'Invalid image' };
    }

    try {
      const timestamp = Date.now();
      const sanitizedName = file.name.replace(/[^\w.-]/g, '_');
      const storagePath = `products/${productId}/${timestamp}_${sanitizedName}`;

      // Upload file to Supabase storage bucket
      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(storagePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        return { image: null, error: uploadError.message };
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from(BUCKET_NAME).getPublicUrl(storagePath);

      // Insert record in product_images table
      const { data: imageRecord, error: dbError } = await supabase
        .from('product_images')
        .insert({
          product_id: productId,
          storage_path: storagePath,
          public_url: publicUrl,
          alt_text: altText || file.name,
          display_order: displayOrder,
        })
        .select()
        .single();

      if (dbError) {
        // Rollback storage upload if DB insert failed
        await supabase.storage.from(BUCKET_NAME).remove([storagePath]);
        return { image: null, error: dbError.message };
      }

      return { image: imageRecord, error: null };
    } catch (err: any) {
      return { image: null, error: err?.message || 'Upload failed' };
    }
  },

  /**
   * Insert an external/imported image URL directly into product_images
   */
  async addExternalImageUrl(
    productId: string,
    imageUrl: string,
    displayOrder = 0,
    altText = ''
  ): Promise<{ image: ProductImage | null; error: string | null }> {
    if (!isSupabaseConfigured) {
      return { image: null, error: 'Supabase is unconfigured' };
    }

    try {
      const { data, error } = await supabase
        .from('product_images')
        .insert({
          product_id: productId,
          storage_path: `external/${productId}_${displayOrder}`,
          public_url: imageUrl,
          alt_text: altText || 'Product image',
          display_order: displayOrder,
        })
        .select()
        .single();

      if (error) return { image: null, error: error.message };
      return { image: data, error: null };
    } catch (err: any) {
      return { image: null, error: err?.message || 'Failed to add image URL' };
    }
  },

  /**
   * Delete an image record and remove it from storage if applicable
   */
  async deleteProductImage(image: ProductImage): Promise<{ success: boolean; error: string | null }> {
    if (!isSupabaseConfigured) return { success: false, error: 'Database unconfigured' };

    try {
      // Delete from database
      const { error: dbError } = await supabase
        .from('product_images')
        .delete()
        .eq('id', image.id);

      if (dbError) return { success: false, error: dbError.message };

      // Delete from storage if it's hosted in bucket
      if (image.storage_path && !image.storage_path.startsWith('external/')) {
        await supabase.storage.from(BUCKET_NAME).remove([image.storage_path]);
      }

      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to delete image' };
    }
  },

  /**
   * Update the order of images
   */
  async updateImageOrder(images: { id: string; display_order: number }[]): Promise<boolean> {
    if (!isSupabaseConfigured || images.length === 0) return false;

    try {
      const updates = images.map((img) =>
        supabase.from('product_images').update({ display_order: img.display_order }).eq('id', img.id)
      );
      await Promise.all(updates);
      return true;
    } catch {
      return false;
    }
  },
};
