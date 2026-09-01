import React, { useState, useEffect } from 'react';
import { useShop } from '../../context/ShopContext';
import { ProductCard } from './ProductCard';
import {
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Clock,
  ShieldCheck,
  TrendingUp,
  Award,
  Zap,
  Headphones,
  Watch,
  Laptop,
  Home,
  Camera,
  Tag,
  Check,
  Copy,
} from 'lucide-react';
import { motion } from 'motion/react';

export const HomePage: React.FC = () => {
  const {
    products,
    categories,
    navigateToCategory,
    setActivePage,
    setFilters,
    navigateToProduct,
    applyCoupon,
    addToast,
  } = useShop();

  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Flash deal countdown timer (hours, minutes, seconds)
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 32,
    seconds: 45,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 4);
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);
  const saleProducts = products.filter((p) => p.discountPercentage && p.discountPercentage > 15).slice(0, 4);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Headphones':
        return <Headphones className="w-6 h-6" />;
      case 'Watch':
        return <Watch className="w-6 h-6" />;
      case 'Laptop':
        return <Laptop className="w-6 h-6" />;
      case 'Home':
        return <Home className="w-6 h-6" />;
      case 'Camera':
        return <Camera className="w-6 h-6" />;
      default:
        return <ShoppingBag className="w-6 h-6" />;
    }
  };

  const copyCoupon = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    applyCoupon(code);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-4 p-8 sm:p-12 lg:p-16 shadow-2xl border border-slate-800">
        {/* Subtle Background Glows */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Next-Gen Audio & Computing Hardware</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Precision Crafted Gear for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-300">Modern Creators</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
              Immerse yourself in studio-grade ANC acoustics, titanium smart wearables, tactile mechanical keyboards, and precision optics. Tested by professionals, built for life.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => {
                  setFilters((prev) => ({ ...prev, category: 'all' }));
                  setActivePage('products');
                }}
                className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition flex items-center gap-2 group"
              >
                <span>Shop All Products</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setActivePage('flask-code')}
                className="px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-xl border border-white/20 backdrop-blur-md transition flex items-center gap-2"
              >
                <span>Flask Backend Docs</span>
              </button>
            </div>

            {/* Quick stats banner */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-800/80 max-w-md">
              <div>
                <p className="text-xl sm:text-2xl font-extrabold text-white">4.9/5</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Over 2,400 Reviews</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-extrabold text-white">48h</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Express Delivery</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-extrabold text-white">100%</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Money-Back Guarantee</p>
              </div>
            </div>
          </div>

          {/* Hero Featured Card Highlight */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-xl"
            >
              <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-slate-950 mb-5">
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
                  alt="AcousticMax Pro"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-rose-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-md">
                  HOT DEAL • SAVE 24%
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-indigo-400 font-semibold">
                  <span>ACOUSTICMAX PRO</span>
                  <span className="text-emerald-400">In Stock</span>
                </div>
                <h3 className="text-lg font-bold text-white leading-snug">
                  Active Noise Cancelling Titanium Studio Headphones
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2">
                  40mm titanium drivers with 45-hour battery life and spatial lossless wireless audio.
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                  <div>
                    <span className="text-2xl font-extrabold text-white">$249.99</span>
                    <span className="text-xs text-slate-500 line-through ml-2">$329.99</span>
                  </div>
                  <button
                    onClick={() => navigateToProduct('prod-1')}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition"
                  >
                    View Product
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Promo Coupons Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-indigo-50 via-sky-50 to-emerald-50 rounded-2xl p-4 sm:p-6 border border-indigo-100/80 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Limited-Time Exclusive Discount Codes</h4>
              <p className="text-xs text-slate-600">Click any coupon below to automatically copy and apply to your cart:</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {[
              { code: 'WELCOME15', desc: '15% off ($50+)' },
              { code: 'FLASH50', desc: '50% off ($150+)' },
              { code: 'TECH20', desc: '20% off ($100+)' },
            ].map((c) => (
              <button
                key={c.code}
                onClick={() => copyCoupon(c.code)}
                className="px-3 py-1.5 bg-white border border-indigo-200 hover:border-indigo-500 rounded-xl text-xs font-mono font-bold text-indigo-900 shadow-xs hover:shadow transition flex items-center gap-1.5 group"
              >
                <span>{c.code}</span>
                <span className="text-[10px] font-sans font-normal text-slate-500">({c.desc})</span>
                {copiedCode === c.code ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3 h-3 text-slate-400 group-hover:text-indigo-600" />
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Explore Catalog</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Browse by Department
            </h2>
          </div>
          <button
            onClick={() => {
              setFilters((prev) => ({ ...prev, category: 'all' }));
              setActivePage('products');
            }}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 hover:underline"
          >
            <span>See all items</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => navigateToCategory(cat.slug)}
              className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs hover:shadow-lg hover:border-indigo-300 transition-all duration-300 cursor-pointer flex flex-col items-center text-center group"
            >
              <div className="relative w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                {getCategoryIcon(cat.iconName)}
              </div>
              <h3 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition mb-1">
                {cat.name}
              </h3>
              <p className="text-[11px] text-slate-400">
                {cat.itemCount || 12} items
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Flash Deals with Countdown */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Limited Time Flash Sale</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold">
                Deep Discounts on Top Gear
              </h2>
            </div>

            {/* Countdown timer */}
            <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-700/80 px-4 py-2.5 rounded-2xl">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Clock className="w-4 h-4 text-rose-500 animate-pulse" />
                <span>Offer ends in:</span>
              </div>
              <div className="flex items-center gap-1 font-mono text-sm font-extrabold text-white">
                <span className="bg-slate-800 px-2 py-1 rounded-lg">
                  {String(timeLeft.hours).padStart(2, '0')}h
                </span>
                <span>:</span>
                <span className="bg-slate-800 px-2 py-1 rounded-lg">
                  {String(timeLeft.minutes).padStart(2, '0')}m
                </span>
                <span>:</span>
                <span className="bg-slate-800 px-2 py-1 rounded-lg text-rose-400">
                  {String(timeLeft.seconds).padStart(2, '0')}s
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {saleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
              <Award className="w-3.5 h-3.5" />
              <span>Hand-Picked Quality</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Featured Products
            </h2>
          </div>
          <button
            onClick={() => {
              setFilters((prev) => ({ ...prev, category: 'all' }));
              setActivePage('products');
            }}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 hover:underline"
          >
            <span>View Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Customer Favorites</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Best Sellers of the Week
            </h2>
          </div>
          <button
            onClick={() => {
              setFilters((prev) => ({ ...prev, sortBy: 'bestseller' }));
              setActivePage('products');
            }}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 hover:underline"
          >
            <span>Explore All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};
