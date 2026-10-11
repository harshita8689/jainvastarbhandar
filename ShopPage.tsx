import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  RotateCcw,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import { ProductCard } from '../components/common/ProductCard';
import { ProductGridSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { productService } from '../services/productService';
import type { Product, SortOption } from '../types';
import { FABRIC_CATEGORIES, SUIT_BRANDS } from '../utils/constants';

const ITEMS_PER_PAGE = 12;

export const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Local filter states read from URL query params
  const initialSearch = searchParams.get('search') || '';
  const initialFabric = searchParams.get('fabric') || 'all';
  const initialBrand = searchParams.get('brand') || 'all';
  const initialSort = (searchParams.get('sort') as SortOption) || 'newest';

  const [search, setSearch] = useState(initialSearch);
  const [selectedFabric, setSelectedFabric] = useState(initialFabric);
  const [selectedBrand, setSelectedBrand] = useState(initialBrand);
  const [sort, setSort] = useState<SortOption>(initialSort);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [page, setPage] = useState(1);

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Available fabric list
  const [availableFabrics, setAvailableFabrics] = useState<string[]>([]);

  // Synchronize URL parameters when filters change
  useEffect(() => {
    const params: Record<string, string> = {};
    if (search.trim()) params.search = search.trim();
    if (selectedFabric && selectedFabric !== 'all') params.fabric = selectedFabric;
    if (selectedBrand && selectedBrand !== 'all') params.brand = selectedBrand;
    if (sort !== 'newest') params.sort = sort;
    setSearchParams(params, { replace: true });
  }, [search, selectedFabric, selectedBrand, sort, setSearchParams]);

  // Load distinct fabrics once
  useEffect(() => {
    productService.getAvailableFabrics().then((fabrics) => {
      if (fabrics.length > 0) {
        setAvailableFabrics(fabrics);
      } else {
        setAvailableFabrics(Array.from(FABRIC_CATEGORIES));
      }
    });
  }, []);

  // Fetch products
  const fetchCatalog = async () => {
    setLoading(true);
    setError(null);

    const { products: fetched, totalCount: total, error: fetchErr } = await productService.getProducts(
      {
        search,
        fabric_type: selectedFabric === 'all' ? undefined : selectedFabric,
        brand: selectedBrand === 'all' ? undefined : selectedBrand,
        inStockOnly,
        minPrice,
        maxPrice,
      },
      sort,
      page,
      ITEMS_PER_PAGE,
      false // public store, only published suits
    );

    setProducts(fetched);
    setTotalCount(total);
    setError(fetchErr);
    setLoading(false);
  };

  useEffect(() => {
    fetchCatalog();
  }, [search, selectedFabric, selectedBrand, sort, inStockOnly, minPrice, maxPrice, page]);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedFabric('all');
    setSelectedBrand('all');
    setSort('newest');
    setInStockOnly(false);
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setPage(1);
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header */}
      <div className="border-b border-jvb-pink-100 pb-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-jvb-pink-600 uppercase tracking-widest mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Pure Unstitched Fabrics Only</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900">
              Unstitched Ladies' Suits Collection
            </h1>
            <p className="text-sm text-gray-600 mt-1 max-w-2xl">
              Browse pure cotton, Chanderi silk, georgette, and organza unstitched ladies' suits.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="text-xs sm:text-sm font-semibold text-gray-700 bg-jvb-pink-50 border border-jvb-pink-100 px-3.5 py-1.5 rounded-full">
              {loading ? 'Searching...' : `${totalCount} ${totalCount === 1 ? 'Suit' : 'Suits'} Found`}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Filters & Products */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-6 bg-white p-6 rounded-2xl border border-jvb-pink-100 shadow-subtle h-fit sticky top-28">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <h2 className="font-serif font-bold text-base text-gray-900 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-jvb-pink-600" />
              <span>Filters</span>
            </h2>
            <button
              onClick={handleResetFilters}
              className="text-xs text-jvb-pink-600 hover:text-jvb-wine-700 font-medium flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Search input in sidebar */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Search Suits
            </label>
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Suit name or SKU (e.g. Cotton, JVB-01)..."
                className="w-full text-xs pl-8 pr-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-jvb-pink-500 bg-gray-50/50"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          {/* Suit Brand Filter */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Brand / Label
            </label>
            <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
              <button
                onClick={() => {
                  setSelectedBrand('all');
                  setPage(1);
                }}
                className={`w-full text-left text-xs py-1.5 px-2.5 rounded-md transition-colors flex items-center justify-between ${
                  selectedBrand === 'all'
                    ? 'bg-rose-700 text-white font-semibold'
                    : 'text-gray-700 hover:bg-rose-50'
                }`}
              >
                <span>All Brands</span>
              </button>
              {SUIT_BRANDS.map((brand) => (
                <button
                  key={brand}
                  onClick={() => {
                    setSelectedBrand(brand);
                    setPage(1);
                  }}
                  className={`w-full text-left text-xs py-1.5 px-2.5 rounded-md transition-colors flex items-center justify-between ${
                    selectedBrand === brand
                      ? 'bg-rose-700 text-white font-semibold'
                      : 'text-gray-700 hover:bg-rose-50'
                  }`}
                >
                  <span>{brand}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Fabric Type Filter */}
          <div className="pt-2 border-t border-gray-100">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Fabric Type
            </label>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              <button
                onClick={() => {
                  setSelectedFabric('all');
                  setPage(1);
                }}
                className={`w-full text-left text-xs py-1.5 px-2.5 rounded-md transition-colors flex items-center justify-between ${
                  selectedFabric === 'all'
                    ? 'bg-jvb-pink-600 text-white font-semibold'
                    : 'text-gray-700 hover:bg-jvb-pink-50'
                }`}
              >
                <span>All Fabric Weaves</span>
              </button>
              {availableFabrics.map((fabric) => (
                <button
                  key={fabric}
                  onClick={() => {
                    setSelectedFabric(fabric);
                    setPage(1);
                  }}
                  className={`w-full text-left text-xs py-1.5 px-2.5 rounded-md transition-colors flex items-center justify-between ${
                    selectedFabric === fabric
                      ? 'bg-jvb-pink-600 text-white font-semibold'
                      : 'text-gray-700 hover:bg-jvb-pink-50'
                  }`}
                >
                  <span>{fabric}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Stock Availability */}
          <div className="pt-2 border-t border-gray-100">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-800">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => {
                  setInStockOnly(e.target.checked);
                  setPage(1);
                }}
                className="rounded text-jvb-pink-600 focus:ring-jvb-pink-500 w-4 h-4"
              />
              <span>In Stock Only</span>
            </label>
          </div>

          {/* Price Range Filter */}
          <div className="pt-2 border-t border-gray-100">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Price Range (INR)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min ₹"
                value={minPrice !== undefined ? minPrice : ''}
                onChange={(e) => {
                  const val = e.target.value ? Number(e.target.value) : undefined;
                  setMinPrice(val);
                  setPage(1);
                }}
                className="w-full text-xs p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-jvb-pink-500 bg-gray-50/50"
              />
              <input
                type="number"
                placeholder="Max ₹"
                value={maxPrice !== undefined ? maxPrice : ''}
                onChange={(e) => {
                  const val = e.target.value ? Number(e.target.value) : undefined;
                  setMaxPrice(val);
                  setPage(1);
                }}
                className="w-full text-xs p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-jvb-pink-500 bg-gray-50/50"
              />
            </div>
          </div>
        </aside>

        {/* Products Column */}
        <main className="lg:col-span-3 space-y-6">
          {/* Top Bar: Mobile filter button & Sort controls */}
          <div className="bg-white p-3.5 rounded-xl border border-jvb-pink-100 shadow-subtle flex flex-wrap items-center justify-between gap-3">
            {/* Mobile Filter Trigger */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden inline-flex items-center gap-1.5 text-xs font-semibold bg-jvb-pink-50 border border-jvb-pink-200 text-jvb-wine-700 px-3.5 py-2 rounded-lg hover:bg-jvb-pink-100 transition-colors"
            >
              <Filter className="w-3.5 h-3.5 text-jvb-pink-600" />
              <span>Filters {selectedFabric !== 'all' || inStockOnly ? '(Active)' : ''}</span>
            </button>

            {/* Active filter pills */}
            <div className="hidden sm:flex items-center gap-2 flex-wrap">
              {selectedFabric !== 'all' && (
                <span className="inline-flex items-center gap-1 text-xs bg-jvb-pink-100 text-jvb-wine-800 px-2.5 py-1 rounded-full font-medium">
                  <span>Fabric: {selectedFabric}</span>
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-black"
                    onClick={() => setSelectedFabric('all')}
                  />
                </span>
              )}
              {inStockOnly && (
                <span className="inline-flex items-center gap-1 text-xs bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full font-medium">
                  <span>In Stock</span>
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-black"
                    onClick={() => setInStockOnly(false)}
                  />
                </span>
              )}
              {search && (
                <span className="inline-flex items-center gap-1 text-xs bg-stone-100 text-stone-800 px-2.5 py-1 rounded-full font-medium">
                  <span>Search: "{search}"</span>
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-black"
                    onClick={() => setSearch('')}
                  />
                </span>
              )}
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-2 ml-auto">
              <label htmlFor="sortSelect" className="text-xs font-medium text-gray-500 whitespace-nowrap">
                Sort by:
              </label>
              <select
                id="sortSelect"
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value as SortOption);
                  setPage(1);
                }}
                className="text-xs border border-gray-200 rounded-lg py-1.5 px-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-jvb-pink-500 font-medium text-gray-800"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
              </select>
            </div>
          </div>

          {/* Product Grid / Loading / Error / Empty States */}
          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center space-y-4">
              <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
              <h3 className="font-serif font-bold text-lg text-red-900">
                Database Communication Error
              </h3>
              <p className="text-xs text-red-700 max-w-md mx-auto">{error}</p>
              <button
                onClick={fetchCatalog}
                className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Fetching Catalog</span>
              </button>
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="pt-8 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }).map((_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`w-9 h-9 rounded-lg text-xs font-semibold transition-colors ${
                            page === pageNum
                              ? 'bg-jvb-pink-600 text-white'
                              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Next page"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <EmptyState
              title="No Unstitched Suits Found"
              description="No suit fabrics matched your active filters or search terms. Try searching for a different weave or resetting your filters."
              onReset={handleResetFilters}
            />
          )}
        </main>
      </div>

      {/* Mobile Filters Slide-over / Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h2 className="font-serif font-bold text-lg text-gray-900 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-jvb-pink-600" />
                <span>Filter Suits</span>
              </h2>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Search */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Search
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Suit name or SKU..."
                  className="w-full text-xs pl-8 pr-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-jvb-pink-500 bg-gray-50"
                />
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            {/* Mobile Brand Filter */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Brand / Label
              </label>
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                <button
                  onClick={() => setSelectedBrand('all')}
                  className={`w-full text-left text-xs py-2 px-3 rounded-md transition-colors ${
                    selectedBrand === 'all'
                      ? 'bg-rose-700 text-white font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  All Brands
                </button>
                {SUIT_BRANDS.map((brand) => (
                  <button
                    key={brand}
                    onClick={() => setSelectedBrand(brand)}
                    className={`w-full text-left text-xs py-2 px-3 rounded-md transition-colors ${
                      selectedBrand === brand
                        ? 'bg-rose-700 text-white font-semibold'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Fabric Filter */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Fabric Type
              </label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                <button
                  onClick={() => setSelectedFabric('all')}
                  className={`w-full text-left text-xs py-2 px-3 rounded-md transition-colors ${
                    selectedFabric === 'all'
                      ? 'bg-jvb-pink-600 text-white font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  All Fabrics
                </button>
                {availableFabrics.map((fabric) => (
                  <button
                    key={fabric}
                    onClick={() => setSelectedFabric(fabric)}
                    className={`w-full text-left text-xs py-2 px-3 rounded-md transition-colors ${
                      selectedFabric === fabric
                        ? 'bg-jvb-pink-600 text-white font-semibold'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {fabric}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Stock Filter */}
            <div className="pt-2 border-t border-gray-100">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-800">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded text-jvb-pink-600 focus:ring-jvb-pink-500 w-4 h-4"
                />
                <span>In Stock Only</span>
              </label>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-gray-100 space-y-2">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full bg-jvb-pink-600 text-white font-medium py-2.5 rounded-lg text-xs"
              >
                Apply Filters
              </button>
              <button
                onClick={() => {
                  handleResetFilters();
                  setMobileFilterOpen(false);
                }}
                className="w-full border border-gray-200 text-gray-700 font-medium py-2 rounded-lg text-xs hover:bg-gray-50"
              >
                Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
