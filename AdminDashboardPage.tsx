import React, { useState, useEffect } from 'react';
import {
  Plus,
  FileSpreadsheet,
  Search,
  Edit,
  Trash2,
  Archive,
  CheckCircle,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Download,
  AlertCircle,
  Check,
  X,
  Star,
  RefreshCw,
} from 'lucide-react';
import { productService, type AdminStats } from '../services/productService';
import { AdminProductModal } from './AdminProductModal';
import { AdminCSVImportModal } from './AdminCSVImportModal';
import type { Product, ProductStatus } from '../types';
import { formatCurrencyINR } from '../utils/constants';

const ITEMS_PER_PAGE = 15;

export const AdminDashboardPage: React.FC = () => {
  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [stats, setStats] = useState<AdminStats>({
    total: 0,
    published: 0,
    drafts: 0,
    archived: 0,
    soldOut: 0,
    lowStock: 0,
  });

  // Filter & Search
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProductStatus | 'all' | 'sold_out' | 'low_stock'>('all');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [isCSVModalOpen, setIsCSVModalOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ id: string; name: string; sku: string } | null>(null);

  // Alerts
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Load Admin Data
  const loadData = async () => {
    setLoading(true);

    // Fetch stats
    const { stats: fetchedStats } = await productService.getAdminStats();
    if (fetchedStats) setStats(fetchedStats);

    // Query products
    const filterOptions: any = {
      search,
    };

    if (statusFilter === 'published' || statusFilter === 'draft' || statusFilter === 'archived') {
      filterOptions.status = statusFilter;
    } else if (statusFilter === 'sold_out') {
      filterOptions.inStockOnly = false;
    }

    const { products: fetchedProducts, totalCount: count, error } = await productService.getProducts(
      filterOptions,
      'newest',
      page,
      ITEMS_PER_PAGE,
      true // Admin mode, load all statuses
    );

    let displayList = fetchedProducts;
    if (statusFilter === 'sold_out') {
      displayList = displayList.filter((p) => p.stock_quantity === 0);
    } else if (statusFilter === 'low_stock') {
      displayList = displayList.filter((p) => p.stock_quantity > 0 && p.stock_quantity <= 5);
    }

    setProducts(displayList);
    setTotalCount(count);
    if (error) {
      showNotification('error', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [search, statusFilter, page]);

  // Quick Action: Toggle Status
  const handleToggleStatus = async (product: Product, newStatus: ProductStatus) => {
    const { success, error } = await productService.setStatus(product.id, newStatus);
    if (success) {
      showNotification('success', `Product "${product.sku}" marked as ${newStatus}.`);
      loadData();
    } else {
      showNotification('error', error || 'Failed to update status');
    }
  };

  // Quick Action: Update Stock
  const handleQuickStockChange = async (product: Product, delta: number) => {
    const newStock = Math.max(0, product.stock_quantity + delta);
    const { success, error } = await productService.updateStock(product.id, newStock);
    if (success) {
      showNotification('success', `Updated stock for ${product.sku} to ${newStock}.`);
      loadData();
    } else {
      showNotification('error', error || 'Failed to update stock');
    }
  };

  // Permanent Delete
  const handleConfirmDelete = async () => {
    if (!deleteConfirmation) return;
    const { success, error } = await productService.deleteProduct(deleteConfirmation.id, true);
    if (success) {
      showNotification('success', `Product "${deleteConfirmation.sku}" permanently deleted.`);
      setDeleteConfirmation(null);
      loadData();
    } else {
      showNotification('error', error || 'Failed to delete product');
    }
  };

  // Export current catalog to CSV
  const handleExportCSV = () => {
    if (products.length === 0) return;
    const headers = [
      'sku',
      'name',
      'price',
      'sale_price',
      'fabric_type',
      'color',
      'pattern',
      'included_material',
      'stock_quantity',
      'status',
      'is_featured',
    ];

    const rows = products.map((p) => [
      p.sku,
      `"${p.name.replace(/"/g, '""')}"`,
      p.price,
      p.sale_price || '',
      `"${p.fabric_type}"`,
      `"${p.color}"`,
      `"${p.pattern}"`,
      `"${p.included_material}"`,
      p.stock_quantity,
      p.status,
      p.is_featured,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `jvb_catalog_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
      {/* Top Banner Alert */}
      {notification && (
        <div
          className={`p-4 rounded-xl text-xs sm:text-sm font-medium flex items-center justify-between shadow-sm animate-fadeIn ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
              : 'bg-red-50 text-red-900 border border-red-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-gray-400 hover:text-gray-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header and Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
            Inventory & Product Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage your live catalog of unstitched ladies' suits. Changes take effect on the store immediately.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => {
              setProductToEdit(null);
              setIsProductModalOpen(true);
            }}
            className="inline-flex items-center gap-2 bg-jvb-pink-600 hover:bg-jvb-pink-700 text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow-sm transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>Add Unstitched Suit</span>
          </button>

          <button
            onClick={() => setIsCSVModalOpen(true)}
            className="inline-flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold text-xs px-3.5 py-2.5 rounded-lg shadow-sm transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Import CSV</span>
          </button>

          <button
            onClick={handleExportCSV}
            title="Download CSV of current suits"
            className="inline-flex items-center gap-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium text-xs px-3 py-2.5 rounded-lg shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>

          <button
            onClick={loadData}
            title="Refresh database records"
            className="p-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <button
          onClick={() => setStatusFilter('all')}
          className={`p-4 rounded-xl border text-left transition-all ${
            statusFilter === 'all'
              ? 'bg-white border-jvb-pink-500 ring-2 ring-jvb-pink-200 shadow-sm'
              : 'bg-white border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Total Suits
          </div>
          <div className="font-serif text-2xl font-bold text-gray-900 mt-1">{stats.total}</div>
          <div className="text-[11px] text-gray-400 mt-0.5">All database records</div>
        </button>

        <button
          onClick={() => setStatusFilter('published')}
          className={`p-4 rounded-xl border text-left transition-all ${
            statusFilter === 'published'
              ? 'bg-white border-emerald-500 ring-2 ring-emerald-200 shadow-sm'
              : 'bg-white border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
            Live Published
          </div>
          <div className="font-serif text-2xl font-bold text-emerald-700 mt-1">
            {stats.published}
          </div>
          <div className="text-[11px] text-gray-400 mt-0.5">Visible to customers</div>
        </button>

        <button
          onClick={() => setStatusFilter('draft')}
          className={`p-4 rounded-xl border text-left transition-all ${
            statusFilter === 'draft'
              ? 'bg-white border-amber-500 ring-2 ring-amber-200 shadow-sm'
              : 'bg-white border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
            Drafts
          </div>
          <div className="font-serif text-2xl font-bold text-amber-700 mt-1">{stats.drafts}</div>
          <div className="text-[11px] text-gray-400 mt-0.5">Unpublished suits</div>
        </button>

        <button
          onClick={() => setStatusFilter('sold_out')}
          className={`p-4 rounded-xl border text-left transition-all ${
            statusFilter === 'sold_out'
              ? 'bg-white border-stone-800 ring-2 ring-stone-200 shadow-sm'
              : 'bg-white border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
            Sold Out
          </div>
          <div className="font-serif text-2xl font-bold text-stone-900 mt-1">{stats.soldOut}</div>
          <div className="text-[11px] text-gray-400 mt-0.5">0 quantity left</div>
        </button>

        <button
          onClick={() => setStatusFilter('low_stock')}
          className={`p-4 rounded-xl border text-left transition-all col-span-2 sm:col-span-1 ${
            statusFilter === 'low_stock'
              ? 'bg-white border-red-500 ring-2 ring-red-200 shadow-sm'
              : 'bg-white border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="text-xs font-semibold text-red-700 uppercase tracking-wider">
            Low Stock
          </div>
          <div className="font-serif text-2xl font-bold text-red-700 mt-1">{stats.lowStock}</div>
          <div className="text-[11px] text-gray-400 mt-0.5">≤ 5 pieces remaining</div>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by SKU code or product name..."
            className="w-full text-xs pl-8 pr-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-jvb-pink-500 bg-gray-50/50"
          />
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end text-xs">
          <label className="text-gray-500 font-medium">Filter:</label>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as any);
              setPage(1);
            }}
            className="border border-gray-200 rounded-lg py-1.5 px-3 bg-gray-50 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-jvb-pink-500"
          >
            <option value="all">All Suits</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
            <option value="archived">Archived</option>
            <option value="sold_out">Sold Out (0 Stock)</option>
            <option value="low_stock">Low Stock (≤ 5)</option>
          </select>
        </div>
      </div>

      {/* Product Management Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-gray-200 text-gray-600 uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Suit</th>
                <th className="py-3 px-4">SKU / Code</th>
                <th className="py-3 px-4">Fabric & Color</th>
                <th className="py-3 px-4">Price (INR)</th>
                <th className="py-3 px-4 text-center">Stock</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500">
                    Loading inventory records...
                  </td>
                </tr>
              ) : products.length > 0 ? (
                products.map((product) => {
                  const thumbnail =
                    product.images && product.images.length > 0
                      ? product.images[0].public_url
                      : 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=150&q=80';

                  return (
                    <tr key={product.id} className="hover:bg-pink-50/20 transition-colors">
                      {/* Product Thumbnail & Name */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3 max-w-xs">
                          <img
                            src={thumbnail}
                            alt={product.name}
                            className="w-10 h-12 object-cover rounded-md border border-gray-200 flex-shrink-0 bg-stone-100"
                          />
                          <div className="truncate">
                            <span className="font-serif font-bold text-gray-900 block truncate">
                              {product.name}
                            </span>
                            {product.is_featured && (
                              <span className="inline-flex items-center gap-0.5 text-[10px] text-amber-600 font-semibold">
                                <Star className="w-2.5 h-2.5 fill-amber-500" /> Featured
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* SKU */}
                      <td className="py-3 px-4 font-mono font-bold text-gray-700">
                        {product.sku}
                      </td>

                      {/* Fabric & Color */}
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900">{product.fabric_type}</div>
                        <div className="text-[11px] text-gray-500">{product.color}</div>
                      </td>

                      {/* Pricing */}
                      <td className="py-3 px-4 font-semibold text-gray-900">
                        {product.sale_price ? (
                          <div>
                            <span className="text-jvb-wine-700">
                              {formatCurrencyINR(product.sale_price)}
                            </span>
                            <span className="text-[10px] text-gray-400 line-through block">
                              {formatCurrencyINR(product.price)}
                            </span>
                          </div>
                        ) : (
                          <span>{formatCurrencyINR(product.price)}</span>
                        )}
                      </td>

                      {/* Stock Adjustment */}
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleQuickStockChange(product, -1)}
                            disabled={product.stock_quantity <= 0}
                            className="w-5 h-5 rounded border border-gray-200 text-gray-600 hover:bg-gray-100 flex items-center justify-center text-xs font-bold disabled:opacity-30"
                          >
                            -
                          </button>
                          <span
                            className={`min-w-[28px] text-center font-bold ${
                              product.stock_quantity === 0
                                ? 'text-red-600'
                                : product.stock_quantity <= 5
                                ? 'text-amber-600'
                                : 'text-gray-900'
                            }`}
                          >
                            {product.stock_quantity}
                          </span>
                          <button
                            onClick={() => handleQuickStockChange(product, 1)}
                            className="w-5 h-5 rounded border border-gray-200 text-gray-600 hover:bg-gray-100 flex items-center justify-center text-xs font-bold"
                          >
                            +
                          </button>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        {product.status === 'published' ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Published
                          </span>
                        ) : product.status === 'draft' ? (
                          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Draft
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 border border-gray-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Archived
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View on store */}
                          {product.status === 'published' && (
                            <a
                              href={`/product/${product.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 text-gray-400 hover:text-gray-700 rounded hover:bg-gray-100"
                              title="View on store"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}

                          {/* Edit */}
                          <button
                            onClick={() => {
                              setProductToEdit(product);
                              setIsProductModalOpen(true);
                            }}
                            className="p-1.5 text-blue-600 hover:text-blue-800 rounded hover:bg-blue-50"
                            title="Edit Suit Details"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          {/* Publish/Unpublish toggle */}
                          {product.status === 'published' ? (
                            <button
                              onClick={() => handleToggleStatus(product, 'draft')}
                              className="p-1.5 text-amber-600 hover:text-amber-800 rounded hover:bg-amber-50"
                              title="Unpublish (Save as draft)"
                            >
                              <Archive className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleToggleStatus(product, 'published')}
                              className="p-1.5 text-emerald-600 hover:text-emerald-800 rounded hover:bg-emerald-50"
                              title="Publish to public store"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Delete Confirmation */}
                          <button
                            onClick={() =>
                              setDeleteConfirmation({
                                id: product.id,
                                name: product.name,
                                sku: product.sku,
                              })
                            }
                            className="p-1.5 text-red-600 hover:text-red-800 rounded hover:bg-red-50"
                            title="Delete Permanently"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500">
                    No suits matching current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-200 flex items-center justify-between text-xs">
            <span className="text-gray-500">
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <AdminProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSuccess={loadData}
        productToEdit={productToEdit}
      />

      <AdminCSVImportModal
        isOpen={isCSVModalOpen}
        onClose={() => setIsCSVModalOpen(false)}
        onSuccess={loadData}
      />

      {/* Permanent Delete Confirmation Dialog */}
      {deleteConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setDeleteConfirmation(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4 border border-gray-200">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-serif font-bold text-lg text-gray-900">
                Confirm Permanent Deletion
              </h3>
              <p className="text-xs text-gray-600">
                Are you sure you want to permanently delete{' '}
                <strong>{deleteConfirmation.sku}</strong> ({deleteConfirmation.name})?
                This action cannot be undone.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmation(null)}
                className="py-2.5 px-4 rounded-lg border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="py-2.5 px-4 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-sm"
              >
                Yes, Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
