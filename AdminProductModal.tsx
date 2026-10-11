import React, { useState, useEffect } from 'react';
import {
  X,
  Upload,
  Trash2,
  Star,
  Check,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { productService } from '../services/productService';
import { storageService } from '../services/storageService';
import type { Product, ProductImage, ProductStatus } from '../types';
import { FABRIC_CATEGORIES, SUIT_BRANDS } from '../utils/constants';

interface AdminProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  productToEdit?: Product | null;
}

export const AdminProductModal: React.FC<AdminProductModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  productToEdit,
}) => {
  const isEditing = Boolean(productToEdit);

  // Form State
  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('Ganga');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<string>('');
  const [salePrice, setSalePrice] = useState<string>('');
  const [fabricType, setFabricType] = useState('Pure Cotton');
  const [color, setColor] = useState('');
  const [pattern, setPattern] = useState('');
  const [includedMaterial, setIncludedMaterial] = useState(
    'Top (Kurta): 2.5m, Bottom (Salwar): 2.5m, Dupatta: 2.25m'
  );
  const [stockQuantity, setStockQuantity] = useState<string>('5');
  const [status, setStatus] = useState<ProductStatus>('published');
  const [isFeatured, setIsFeatured] = useState(false);

  // Images state
  const [existingImages, setExistingImages] = useState<ProductImage[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<ProductImage[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<{ file: File; preview: string }[]>([]);

  // Processing states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Populate form on edit
  useEffect(() => {
    if (productToEdit) {
      setSku(productToEdit.sku || '');
      setName(productToEdit.name || '');
      setBrand(productToEdit.brand || 'Ganga');
      setDescription(productToEdit.description || '');
      setPrice(productToEdit.price !== undefined ? String(productToEdit.price) : '');
      setSalePrice(
        productToEdit.sale_price !== null && productToEdit.sale_price !== undefined
          ? String(productToEdit.sale_price)
          : ''
      );
      setFabricType(productToEdit.fabric_type || 'Pure Cotton');
      setColor(productToEdit.color || '');
      setPattern(productToEdit.pattern || '');
      setIncludedMaterial(
        productToEdit.included_material ||
          'Top (Kurta): 2.5m, Bottom (Salwar): 2.5m, Dupatta: 2.25m'
      );
      setStockQuantity(String(productToEdit.stock_quantity ?? 0));
      setStatus(productToEdit.status || 'published');
      setIsFeatured(Boolean(productToEdit.is_featured));
      setExistingImages(productToEdit.images || []);
      setImagesToDelete([]);
      setNewImageFiles([]);
      setErrorMessage(null);
    } else {
      // Reset defaults for new suit
      setSku(`JVB-${Date.now().toString().slice(-4)}`);
      setName('');
      setBrand('Ganga');
      setDescription('');
      setPrice('');
      setSalePrice('');
      setFabricType('Pure Cotton');
      setColor('');
      setPattern('Handblock Print');
      setIncludedMaterial('Top (Kurta): 2.5m, Bottom (Salwar): 2.5m, Dupatta: 2.25m');
      setStockQuantity('10');
      setStatus('published');
      setIsFeatured(false);
      setExistingImages([]);
      setImagesToDelete([]);
      setNewImageFiles([]);
      setErrorMessage(null);
    }
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  // Handle new file additions
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newEntries: { file: File; preview: string }[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const validation = storageService.validateImage(file);
      if (!validation.isValid) {
        setErrorMessage(validation.error || 'Invalid file');
        continue;
      }
      const preview = URL.createObjectURL(file);
      newEntries.push({ file, preview });
    }

    setNewImageFiles((prev) => [...prev, ...newEntries]);
    e.target.value = '';
  };

  const removeNewFile = (index: number) => {
    setNewImageFiles((prev) => {
      const copy = [...prev];
      URL.revokeObjectURL(copy[index].preview);
      copy.splice(index, 1);
      return copy;
    });
  };

  const removeExistingImage = (image: ProductImage) => {
    setExistingImages((prev) => prev.filter((img) => img.id !== image.id));
    setImagesToDelete((prev) => [...prev, image]);
  };

  // Form Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!name.trim()) {
      setErrorMessage('Product name is required.');
      return;
    }
    if (!sku.trim()) {
      setErrorMessage('Product Code / SKU is required.');
      return;
    }
    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice < 0) {
      setErrorMessage('Valid price in INR is required.');
      return;
    }
    const numSalePrice = salePrice.trim() ? parseFloat(salePrice) : null;
    if (numSalePrice !== null && (isNaN(numSalePrice) || numSalePrice < 0)) {
      setErrorMessage('Sale price must be a valid non-negative number.');
      return;
    }
    if (numSalePrice !== null && numSalePrice >= numPrice) {
      setErrorMessage('Sale price must be lower than the regular price.');
      return;
    }
    const numStock = parseInt(stockQuantity, 10);
    if (isNaN(numStock) || numStock < 0) {
      setErrorMessage('Stock quantity must be a non-negative whole number.');
      return;
    }
    if (!fabricType.trim()) {
      setErrorMessage('Fabric type is required.');
      return;
    }
    if (!color.trim()) {
      setErrorMessage('Color is required.');
      return;
    }

    setIsSubmitting(true);

    try {
      let productId = productToEdit?.id;

      if (isEditing && productId) {
        // Update product
        const { error: updateError } = await productService.updateProduct(productId, {
          sku,
          name,
          brand,
          description,
          price: numPrice,
          sale_price: numSalePrice,
          fabric_type: fabricType,
          color,
          pattern,
          included_material: includedMaterial,
          stock_quantity: numStock,
          status,
          is_featured: isFeatured,
        });

        if (updateError) {
          setErrorMessage(updateError);
          setIsSubmitting(false);
          return;
        }

        // Delete discarded images
        for (const img of imagesToDelete) {
          await storageService.deleteProductImage(img);
        }
      } else {
        // Create product
        const { product: created, error: createError } = await productService.createProduct({
          sku,
          name,
          brand,
          description,
          price: numPrice,
          sale_price: numSalePrice,
          fabric_type: fabricType,
          color,
          pattern,
          included_material: includedMaterial,
          stock_quantity: numStock,
          status,
          is_featured: isFeatured,
        });

        if (createError || !created) {
          setErrorMessage(createError || 'Failed to create product');
          setIsSubmitting(false);
          return;
        }
        productId = created.id;
      }

      // Upload new images to Supabase storage
      if (productId && newImageFiles.length > 0) {
        let orderOffset = existingImages.length;
        for (const item of newImageFiles) {
          await storageService.uploadProductImage(
            productId,
            item.file,
            orderOffset,
            name
          );
          orderOffset++;
        }
      }

      setIsSubmitting(false);
      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMessage(err?.message || 'An unexpected error occurred');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="px-6 py-4 bg-jvb-wine-900 text-white flex items-center justify-between border-b border-jvb-wine-800">
          <div>
            <h2 className="font-serif text-lg sm:text-xl font-bold">
              {isEditing ? `Edit Suit: ${productToEdit?.sku}` : "Add New Unstitched Ladies' Suit"}
            </h2>
            <p className="text-xs text-pink-200">
              {isEditing
                ? 'Update live fabric details and image assets'
                : 'Create a new unstitched ladies suit entry'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-300 hover:text-white rounded-lg hover:bg-jvb-wine-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body (Scrollable) */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 text-xs text-red-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Traditional Jaipuri Pure Cotton Unstitched Suit"
                className="w-full text-xs p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-jvb-pink-500 bg-gray-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Product Code / SKU *
              </label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value.toUpperCase())}
                placeholder="e.g. JVB-COT-101"
                className="w-full text-xs p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-jvb-pink-500 bg-gray-50/50 uppercase font-mono"
              />
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Price (INR ₹) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="1"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 2450"
                className="w-full text-xs p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-jvb-pink-500 bg-gray-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Sale Price (Optional ₹)
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                placeholder="e.g. 2199"
                className="w-full text-xs p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-jvb-pink-500 bg-gray-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Stock Quantity *
              </label>
              <input
                type="number"
                required
                min="0"
                step="1"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                placeholder="e.g. 10"
                className="w-full text-xs p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-jvb-pink-500 bg-gray-50/50 font-semibold"
              />
            </div>
          </div>

          {/* Brand & Fabric Specifications */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Brand / Label *
              </label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-jvb-pink-500 bg-gray-50/50 font-medium text-rose-800"
              >
                {SUIT_BRANDS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
                <option value="Belliza">Belliza</option>
                <option value="Other Premium Label">Other Premium Label</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Fabric Type *
              </label>
              <select
                value={fabricType}
                onChange={(e) => setFabricType(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-jvb-pink-500 bg-gray-50/50"
              >
                {FABRIC_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
                <option value="Silk Blend">Silk Blend</option>
                <option value="Cotton Silk">Cotton Silk</option>
                <option value="Other Unstitched Fabric">Other Unstitched Fabric</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Color *
              </label>
              <input
                type="text"
                required
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="e.g. Fuchsia Pink / Wine"
                className="w-full text-xs p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-jvb-pink-500 bg-gray-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Pattern / Weave
              </label>
              <input
                type="text"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder="e.g. Handblock Print / Zari"
                className="w-full text-xs p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-jvb-pink-500 bg-gray-50/50"
              />
            </div>
          </div>

          {/* Set Contents & Included Cuts */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Included Material / Cuts
              </label>
              <button
                type="button"
                onClick={() =>
                  setIncludedMaterial('Top (Kurta): 2.5m, Bottom (Salwar): 2.5m, Dupatta: 2.25m')
                }
                className="text-[10px] text-jvb-pink-600 hover:underline"
              >
                Use Standard (2.5m + 2.5m + 2.25m)
              </button>
            </div>
            <input
              type="text"
              value={includedMaterial}
              onChange={(e) => setIncludedMaterial(e.target.value)}
              placeholder="e.g. Top (Kurta): 2.5m, Bottom (Salwar): 2.5m, Dupatta: 2.25m"
              className="w-full text-xs p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-jvb-pink-500 bg-gray-50/50"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail the weave, texture, thread count, or occasion details of this unstitched suit..."
              className="w-full text-xs p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-jvb-pink-500 bg-gray-50/50"
            />
          </div>

          {/* Product Image Upload Section */}
          <div className="space-y-3 pt-2 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Product Images (Max 5MB each • JPEG, PNG, WebP)
              </label>
              <span className="text-[11px] text-gray-500">
                {existingImages.length + newImageFiles.length} image(s) attached
              </span>
            </div>

            {/* Existing images list */}
            {existingImages.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-gray-600 block">Existing Images:</span>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {existingImages.map((img, idx) => (
                    <div
                      key={img.id}
                      className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group bg-stone-100"
                    >
                      <img
                        src={img.public_url}
                        alt={`Photo ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {idx === 0 && (
                        <span className="absolute top-1 left-1 bg-jvb-pink-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                          Primary
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeExistingImage(img)}
                        className="absolute bottom-1 right-1 bg-red-600 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete image"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New images preview */}
            {newImageFiles.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-emerald-700 block">
                  New Images to Upload:
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {newImageFiles.map((item, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-square rounded-lg overflow-hidden border-2 border-emerald-400 group bg-stone-100"
                    >
                      <img
                        src={item.preview}
                        alt={`New ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewFile(idx)}
                        className="absolute bottom-1 right-1 bg-red-600 text-white p-1 rounded-md"
                        title="Remove"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* File Upload Drop Zone */}
            <label className="border-2 border-dashed border-gray-300 hover:border-jvb-pink-400 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer bg-gray-50/50 hover:bg-pink-50/30 transition-colors">
              <Upload className="w-6 h-6 text-gray-400 mb-1" />
              <span className="text-xs font-semibold text-gray-700">
                Click or drag & drop suit photos to upload
              </span>
              <span className="text-[10px] text-gray-500 mt-0.5">
                Upload up to 5 photos for customer gallery
              </span>
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,image/jpg"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Visibility Status & Featured Settings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Publishing Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProductStatus)}
                className="w-full text-xs p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-jvb-pink-500 bg-gray-50/50 font-medium"
              >
                <option value="published">Published (Visible in Public Catalog)</option>
                <option value="draft">Draft (Hidden from Public)</option>
                <option value="archived">Archived (Unlisted)</option>
              </select>
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-800">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded text-jvb-pink-600 focus:ring-jvb-pink-500 w-4 h-4"
                />
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  Show in "Featured Unstitched Suits" on Homepage
                </span>
              </label>
            </div>
          </div>
        </form>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-white transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 bg-jvb-pink-600 hover:bg-jvb-pink-700 text-white text-xs sm:text-sm font-semibold px-6 py-2.5 rounded-lg shadow-md transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving to Database...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>{isEditing ? 'Save Product Changes' : 'Publish Unstitched Suit'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
