import React, { useState, useRef, useEffect } from 'react';
import { useShop } from '../../context/ShopContext';
import {
  ShoppingBag,
  Heart,
  User as UserIcon,
  Search,
  Menu,
  X,
  ShieldCheck,
  Code2,
  ChevronDown,
  Sparkles,
  LogOut,
  SlidersHorizontal,
  Package,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Navbar: React.FC = () => {
  const {
    activePage,
    setActivePage,
    cartCount,
    cartSubtotal,
    setIsCartOpen,
    wishlist,
    currentUser,
    setIsAuthModalOpen,
    setAuthModalTab,
    logout,
    switchDemoRole,
    categories,
    navigateToCategory,
    navigateToProduct,
    products,
    filters,
    setFilters,
  } = useShop();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter search suggestions
  const searchSuggestions = searchQuery.trim()
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.brand.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setFilters((prev) => ({ ...prev, searchQuery: searchQuery.trim(), category: 'all' }));
    setActivePage('products');
    setIsSearchFocused(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Banner */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-indigo-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
              Flash Deal
            </span>
            <span className="hidden sm:inline text-slate-300">
              Get <strong>15% OFF</strong> on orders over $50 with code <code className="bg-slate-800 text-amber-300 px-1.5 py-0.5 rounded font-mono font-bold">WELCOME15</code>
            </span>
            <span className="sm:hidden text-slate-300">
              Use code <strong className="text-amber-300">WELCOME15</strong> for 15% OFF
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <button
              onClick={() => setActivePage('flask-code')}
              className="hover:text-amber-300 flex items-center gap-1 transition"
            >
              <Code2 className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-semibold text-indigo-300">Flask Backend Architecture</span>
            </button>
            <span className="hidden md:inline">•</span>
            <div className="hidden md:flex items-center gap-1.5">
              <span>Quick switch:</span>
              <button
                onClick={() => switchDemoRole('customer')}
                className="hover:text-white underline"
              >
                Customer
              </button>
              <span>/</span>
              <button
                onClick={() => switchDemoRole('admin')}
                className="hover:text-emerald-400 font-semibold underline"
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div
            onClick={() => setActivePage('home')}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-700 to-indigo-500 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition">
              <span className="text-xl">🛒</span>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-indigo-600 transition">
                  ShopCloud
                </span>
                <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-1.5 py-0.2 rounded">
                  v2.4
                </span>
              </div>
              <p className="text-[10px] text-slate-400 -mt-0.5">Modern E-Commerce</p>
            </div>
          </div>

          {/* Search Bar with Autocomplete Dropdown */}
          <div ref={searchContainerRef} className="relative flex-1 max-w-lg hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search products, brands, gear (e.g., Headphones, Watch, Keyboard)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                className="w-full pl-10 pr-20 py-2 text-xs bg-slate-100/90 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-semibold rounded-lg transition"
              >
                Search
              </button>
            </form>

            {/* Suggestions Dropdown */}
            <AnimatePresence>
              {isSearchFocused && searchSuggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute top-full mt-1.5 inset-x-0 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 p-2 space-y-1"
                >
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                    Matching Products ({searchSuggestions.length})
                  </div>
                  {searchSuggestions.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        navigateToProduct(item.id);
                        setIsSearchFocused(false);
                      }}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 object-cover rounded-md bg-slate-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h5 className="text-xs font-semibold text-slate-800 truncate">{item.name}</h5>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500">
                          <span className="text-indigo-600 font-bold">${item.price.toFixed(2)}</span>
                          <span>•</span>
                          <span className="capitalize">{item.category}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Admin Dashboard Quick Link if Admin */}
            {currentUser?.role === 'admin' && (
              <button
                onClick={() => setActivePage('admin')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition ${
                  activePage === 'admin'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span className="hidden lg:inline">Admin Portal</span>
              </button>
            )}

            {/* Flask Backend Code Explorer */}
            <button
              onClick={() => setActivePage('flask-code')}
              className={`p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition ${
                activePage === 'flask-code'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
              title="Inspect Python Flask Backend & REST API Code"
            >
              <Code2 className="w-4 h-4 text-indigo-600" />
              <span className="hidden lg:inline">Flask Code</span>
            </button>

            {/* Wishlist */}
            <button
              onClick={() => setActivePage('wishlist')}
              className={`relative p-2.5 rounded-xl border transition ${
                activePage === 'wishlist'
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'border-slate-200/80 hover:bg-slate-50 text-slate-700'
              }`}
              title="View Wishlist"
            >
              <Heart className="w-4 h-4" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 sm:px-3.5 sm:py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs transition flex items-center gap-2 group"
              title="Open Shopping Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-2.5 -right-2.5 bg-amber-400 text-slate-950 text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-indigo-600">
                    {cartCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:flex flex-col text-left leading-none">
                <span className="text-[10px] text-indigo-200">Cart</span>
                <span className="text-xs font-bold">${cartSubtotal.toFixed(2)}</span>
              </div>
            </button>

            {/* User Account Menu */}
            <div ref={userMenuRef} className="relative">
              {currentUser ? (
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition text-slate-800"
                >
                  <img
                    src={
                      currentUser.avatar ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'
                    }
                    alt={currentUser.name}
                    className="w-6 h-6 rounded-full object-cover border border-slate-200"
                  />
                  <span className="hidden md:inline text-xs font-semibold max-w-[100px] truncate">
                    {currentUser.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    setAuthModalTab('login');
                    setIsAuthModalOpen(true);
                  }}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              )}

              {/* User Dropdown Menu */}
              <AnimatePresence>
                {isUserMenuOpen && currentUser && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 5 }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 z-50 divide-y divide-slate-100"
                  >
                    <div className="px-3 py-2">
                      <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700">
                        {currentUser.role === 'admin' ? 'Store Administrator' : 'Customer Account'}
                      </span>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setActivePage('profile');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition flex items-center gap-2"
                      >
                        <UserIcon className="w-3.5 h-3.5" />
                        <span>My Account & Addresses</span>
                      </button>
                      <button
                        onClick={() => {
                          setActivePage('order-history');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition flex items-center gap-2"
                      >
                        <Package className="w-3.5 h-3.5" />
                        <span>Order History & Tracking</span>
                      </button>
                      <button
                        onClick={() => {
                          setActivePage('wishlist');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition flex items-center gap-2"
                      >
                        <Heart className="w-3.5 h-3.5" />
                        <span>Saved Wishlist ({wishlist.length})</span>
                      </button>
                      {currentUser.role === 'admin' && (
                        <button
                          onClick={() => {
                            setActivePage('admin');
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-left px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 rounded-lg transition flex items-center gap-2"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Admin Control Center</span>
                        </button>
                      )}
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 md:hidden rounded-lg hover:bg-slate-100 text-slate-700"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Categories Bar (Desktop) */}
        <div className="hidden md:flex items-center gap-6 mt-3 pt-2.5 border-t border-slate-100 text-xs font-medium text-slate-600">
          <button
            onClick={() => {
              setFilters((prev) => ({ ...prev, category: 'all', searchQuery: '' }));
              setActivePage('products');
            }}
            className={`hover:text-indigo-600 transition flex items-center gap-1 ${
              activePage === 'products' && filters.category === 'all'
                ? 'text-indigo-600 font-bold'
                : ''
            }`}
          >
            <span>All Products</span>
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigateToCategory(cat.slug)}
              className={`hover:text-indigo-600 transition ${
                activePage === 'products' && filters.category === cat.slug
                  ? 'text-indigo-600 font-bold border-b-2 border-indigo-600 pb-0.5'
                  : ''
              }`}
            >
              {cat.name}
            </button>
          ))}

          <button
            onClick={() => {
              setFilters((prev) => ({ ...prev, onSaleOnly: true, category: 'all' }));
              setActivePage('products');
            }}
            className="ml-auto text-rose-600 font-bold hover:text-rose-700 flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>On Sale & Deals</span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3"
          >
            {/* Mobile Search */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-lg"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </form>

            {/* Mobile Category Links */}
            <div className="space-y-1 pt-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Categories
              </p>
              <button
                onClick={() => {
                  setFilters((prev) => ({ ...prev, category: 'all' }));
                  setActivePage('products');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left py-1.5 text-xs text-slate-800 hover:text-indigo-600 font-medium"
              >
                All Products
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    navigateToCategory(cat.slug);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-1.5 text-xs text-slate-700 hover:text-indigo-600"
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={() => {
                  setActivePage('flask-code');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-2 px-3 bg-indigo-50 text-indigo-700 font-semibold text-xs rounded-lg flex items-center justify-center gap-2"
              >
                <Code2 className="w-4 h-4" />
                <span>View Flask Backend Code</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
