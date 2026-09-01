import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { ProductCard } from './ProductCard';
import {
  SlidersHorizontal,
  LayoutGrid,
  List,
  RotateCcw,
  Star,
  Search,
  Check,
  X,
  Filter,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ProductListingPage: React.FC = () => {
  const {
    filteredProducts,
    categories,
    filters,
    setFilters,
    resetFilters,
  } = useShop();

  const [layoutMode, setLayoutMode] = useState<'grid' | 'list'>('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Extract unique brands
  const allBrands = ['all', 'AcousticMax', 'ChronosTech', 'KeyCraft', 'Artisan Home', 'Nordic Labs', 'OptiCraft Cine', 'ErgoTech'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header & Controls Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                {filters.category === 'all'
                  ? 'All Products'
                  : categories.find((c) => c.slug === filters.category)?.name || 'Products'}
              </h1>
              <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-full border border-indigo-100">
                {filteredProducts.length} items
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Explore our curated selection of premium electronics, audio gear, and lifestyle essentials.
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-2.5">
            {/* Mobile filter toggle */}
            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="lg:hidden px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <span className="hidden sm:inline font-medium">Sort by:</span>
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    sortBy: e.target.value as any,
                  }))
                }
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 cursor-pointer"
              >
                <option value="featured">Featured Picks</option>
                <option value="bestseller">Best Sellers</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>

            {/* Grid / List Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setLayoutMode('grid')}
                className={`p-1.5 rounded-lg transition ${
                  layoutMode === 'grid'
                    ? 'bg-white text-indigo-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setLayoutMode('list')}
                className={`p-1.5 rounded-lg transition ${
                  layoutMode === 'list'
                    ? 'bg-white text-indigo-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filter Chips */}
        {(filters.category !== 'all' ||
          filters.minPrice > 0 ||
          filters.maxPrice < 2000 ||
          filters.minRating > 0 ||
          filters.inStockOnly ||
          filters.onSaleOnly ||
          filters.brand !== 'all' ||
          filters.searchQuery) && (
          <div className="flex flex-wrap items-center gap-2 pt-3 mt-3 border-t border-slate-100 text-xs">
            <span className="text-slate-400 text-[11px] font-semibold">Active filters:</span>
            {filters.searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-medium">
                Search: "{filters.searchQuery}"
                <X
                  onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))}
                  className="w-3 h-3 cursor-pointer hover:text-indigo-900"
                />
              </span>
            )}
            {filters.category !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-medium">
                Category: {filters.category}
                <X
                  onClick={() => setFilters((prev) => ({ ...prev, category: 'all' }))}
                  className="w-3 h-3 cursor-pointer hover:text-indigo-900"
                />
              </span>
            )}
            {filters.brand !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-medium">
                Brand: {filters.brand}
                <X
                  onClick={() => setFilters((prev) => ({ ...prev, brand: 'all' }))}
                  className="w-3 h-3 cursor-pointer hover:text-indigo-900"
                />
              </span>
            )}
            {filters.onSaleOnly && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 font-medium">
                On Sale
                <X
                  onClick={() => setFilters((prev) => ({ ...prev, onSaleOnly: false }))}
                  className="w-3 h-3 cursor-pointer hover:text-rose-900"
                />
              </span>
            )}
            {filters.inStockOnly && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-medium">
                In Stock Only
                <X
                  onClick={() => setFilters((prev) => ({ ...prev, inStockOnly: false }))}
                  className="w-3 h-3 cursor-pointer hover:text-emerald-900"
                />
              </span>
            )}
            {filters.minRating > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 font-medium">
                Rating: {filters.minRating}★+
                <X
                  onClick={() => setFilters((prev) => ({ ...prev, minRating: 0 }))}
                  className="w-3 h-3 cursor-pointer hover:text-amber-900"
                />
              </span>
            )}
            <button
              onClick={resetFilters}
              className="text-xs text-slate-500 hover:text-indigo-600 underline ml-auto flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear All</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Content Layout: Sidebar + Catalog Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Sidebar Filters */}
        <div
          className={`bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-6 ${
            isMobileFilterOpen ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
              <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
              <span>Filter Catalog</span>
            </div>
            <button
              onClick={resetFilters}
              className="text-[11px] text-indigo-600 hover:underline font-semibold"
            >
              Reset
            </button>
          </div>

          {/* Department / Category */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
              Department
            </h4>
            <div className="space-y-1">
              <button
                onClick={() => setFilters((prev) => ({ ...prev, category: 'all' }))}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition flex items-center justify-between ${
                  filters.category === 'all'
                    ? 'bg-indigo-50 text-indigo-700 font-bold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>All Departments</span>
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setFilters((prev) => ({ ...prev, category: cat.slug }))}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition flex items-center justify-between ${
                    filters.category === cat.slug
                      ? 'bg-indigo-50 text-indigo-700 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs mb-2">
              <h4 className="font-bold uppercase tracking-wider text-slate-700">Price Range</h4>
              <span className="font-bold text-indigo-600">
                ${filters.minPrice} – ${filters.maxPrice}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1200"
              step="20"
              value={filters.maxPrice}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  maxPrice: Number(e.target.value),
                }))
              }
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>$0</span>
              <span>$600</span>
              <span>$1,200+</span>
            </div>
          </div>

          {/* Customer Rating */}
          <div className="pt-3 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
              Minimum Rating
            </h4>
            <div className="space-y-1.5">
              {[4, 3, 2].map((stars) => (
                <button
                  key={stars}
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      minRating: prev.minRating === stars ? 0 : stars,
                    }))
                  }
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition ${
                    filters.minRating === stars
                      ? 'bg-amber-50 text-amber-900 font-bold'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < stars ? 'fill-current' : 'text-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span>{stars} Stars & Up</span>
                  </div>
                  {filters.minRating === stars && <Check className="w-3.5 h-3.5 text-amber-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* Brand Filter */}
          <div className="pt-3 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
              Brand
            </h4>
            <select
              value={filters.brand}
              onChange={(e) => setFilters((prev) => ({ ...prev, brand: e.target.value }))}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 font-medium text-slate-800 focus:outline-none focus:border-indigo-600 cursor-pointer"
            >
              {allBrands.map((b) => (
                <option key={b} value={b}>
                  {b === 'all' ? 'All Brands' : b}
                </option>
              ))}
            </select>
          </div>

          {/* Toggles */}
          <div className="pt-3 border-t border-slate-100 space-y-2.5">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={filters.onSaleOnly}
                onChange={(e) => setFilters((prev) => ({ ...prev, onSaleOnly: e.target.checked }))}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
              />
              <span className="text-xs font-semibold text-slate-700">On Sale / Discounted</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={filters.inStockOnly}
                onChange={(e) => setFilters((prev) => ({ ...prev, inStockOnly: e.target.checked }))}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
              />
              <span className="text-xs font-semibold text-slate-700">In Stock Items Only</span>
            </label>
          </div>
        </div>

        {/* Product Catalog Grid / List */}
        <div className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-xs">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-1">No matching products found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
                Try widening your price range, clearing filters, or searching for broader terms.
              </p>
              <button
                onClick={resetFilters}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition"
              >
                Reset All Filters
              </button>
            </div>
          ) : layoutMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} layout="grid" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} layout="list" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
