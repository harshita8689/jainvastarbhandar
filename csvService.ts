import Papa from 'papaparse';
import { supabase, isSupabaseConfigured } from '../lib/supabase/client';
import { generateSlug } from './productService';
import { storageService } from './storageService';
import type { CSVImportRow, ValidatedCSVRow, Product } from '../types';

export interface ImportSummary {
  total: number;
  succeeded: number;
  failed: number;
  errors: { row: number; sku: string; error: string }[];
}

export const csvService = {
  /**
   * Parse CSV File using PapaParse
   */
  async parseCSVFile(file: File): Promise<CSVImportRow[]> {
    return new Promise((resolve, reject) => {
      Papa.parse<CSVImportRow>(file, {
        header: true,
        skipEmptyLines: 'greedy',
        transformHeader: (header) => header.trim().toLowerCase().replace(/\s+/g, '_'),
        complete: (results) => {
          resolve(results.data);
        },
        error: (error) => {
          reject(new Error(`Failed to parse CSV file: ${error.message}`));
        },
      });
    });
  },

  /**
   * Fetch all existing SKUs from the database to avoid duplicate conflicts
   */
  async getExistingSKUs(): Promise<Set<string>> {
    if (!isSupabaseConfigured) return new Set();

    try {
      const { data, error } = await supabase.from('products').select('sku');
      if (error || !data) return new Set();
      return new Set(data.map((item) => item.sku.trim().toUpperCase()));
    } catch {
      return new Set();
    }
  },

  /**
   * Validate every row in the parsed CSV
   */
  validateRows(rows: CSVImportRow[], existingSkusInDb: Set<string>): ValidatedCSVRow[] {
    const seenSkusInFile = new Set<string>();
    const validatedRows: ValidatedCSVRow[] = [];

    rows.forEach((row, index) => {
      const rowNumber = index + 2; // 1-indexed, +1 for header row
      const errors: string[] = [];

      // 1. SKU validation
      const sku = (row.sku || '').trim().toUpperCase();
      if (!sku) {
        errors.push('SKU / Product Code is required');
      } else {
        if (seenSkusInFile.has(sku)) {
          errors.push(`Duplicate SKU "${sku}" found within this CSV file`);
        } else {
          seenSkusInFile.add(sku);
        }

        if (existingSkusInDb.has(sku)) {
          errors.push(`SKU "${sku}" already exists in the live database`);
        }
      }

      // 2. Name validation
      const name = (row.name || '').trim();
      if (!name) {
        errors.push('Product Name is required');
      }

      // 3. Price validation
      const priceStr = (row.price || '').toString().trim().replace(/[^0-9.]/g, '');
      const price = parseFloat(priceStr);
      if (isNaN(price) || price < 0) {
        errors.push('Valid non-negative Price in INR is required');
      }

      // 4. Sale price validation (optional)
      let salePrice: number | null = null;
      if (row.sale_price && row.sale_price.trim()) {
        const saleStr = row.sale_price.trim().replace(/[^0-9.]/g, '');
        salePrice = parseFloat(saleStr);
        if (isNaN(salePrice) || salePrice < 0) {
          errors.push('Sale price must be a valid non-negative number if provided');
        } else if (salePrice >= price) {
          errors.push('Sale price must be lower than regular price');
        }
      }

      // 5. Fabric Type validation (UNSTITCHED SUITS ONLY)
      const fabricType = (row.fabric_type || '').trim();
      if (!fabricType) {
        errors.push('Fabric Type is required (e.g. Pure Cotton, Chanderi Silk)');
      }

      // 6. Color validation
      const color = (row.color || '').trim();
      if (!color) {
        errors.push('Color is required');
      }

      // 7. Pattern validation
      const pattern = (row.pattern || 'Traditional').trim();

      // 8. Included material validation
      const includedMaterial = (
        row.included_material || 'Top (Kurta): 2.5m, Bottom: 2.5m, Dupatta: 2.25m'
      ).trim();

      // 9. Stock validation
      const stockStr = (row.stock_quantity || '0').toString().trim();
      const stockQuantity = parseInt(stockStr, 10);
      if (isNaN(stockQuantity) || stockQuantity < 0) {
        errors.push('Stock quantity must be a non-negative integer');
      }

      // 10. Status validation
      const rawStatus = (row.status || 'published').toLowerCase().trim();
      const status = rawStatus === 'draft' ? 'draft' : 'published';

      // 11. Featured
      const isFeatured =
        row.is_featured === 'true' || row.is_featured === '1' || row.is_featured === 'yes';

      // 12. Image URL validation (optional)
      let imageUrl = (row.image_url || '').trim();
      if (imageUrl && !imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
        errors.push('Image URL must be a valid HTTP/HTTPS link');
      }

      const brand = (row.brand || 'Ganga').trim();

      const productData: Partial<Product> = {
        sku,
        name,
        slug: generateSlug(name, sku),
        brand: brand || 'Ganga',
        description: (row.description || '').trim(),
        price,
        sale_price: salePrice,
        fabric_type: fabricType,
        color,
        pattern,
        included_material: includedMaterial,
        stock_quantity: isNaN(stockQuantity) ? 0 : stockQuantity,
        status,
        is_featured: isFeatured,
      };

      validatedRows.push({
        rowNumber,
        data: productData,
        imageUrl: imageUrl || undefined,
        isValid: errors.length === 0,
        errors,
      });
    });

    return validatedRows;
  },

  /**
   * Import valid rows into Supabase database
   */
  async importRows(
    rows: ValidatedCSVRow[],
    onProgress?: (processed: number, total: number) => void
  ): Promise<ImportSummary> {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase database is unconfigured. Please connect credentials first.');
    }

    const validRows = rows.filter((r) => r.isValid);
    const summary: ImportSummary = {
      total: validRows.length,
      succeeded: 0,
      failed: 0,
      errors: [],
    };

    let count = 0;
    for (const row of validRows) {
      try {
        const { data: insertedProduct, error: insertError } = await supabase
          .from('products')
          .insert(row.data)
          .select()
          .single();

        if (insertError) {
          summary.failed++;
          summary.errors.push({
            row: row.rowNumber,
            sku: row.data.sku || 'UNKNOWN',
            error: insertError.message,
          });
        } else {
          summary.succeeded++;

          // If row has an image URL, attach it
          if (row.imageUrl && insertedProduct) {
            await storageService.addExternalImageUrl(
              insertedProduct.id,
              row.imageUrl,
              0,
              insertedProduct.name
            );
          }
        }
      } catch (err: any) {
        summary.failed++;
        summary.errors.push({
          row: row.rowNumber,
          sku: row.data.sku || 'UNKNOWN',
          error: err?.message || 'Database insertion error',
        });
      }

      count++;
      if (onProgress) {
        onProgress(count, validRows.length);
      }
    }

    return summary;
  },
};
