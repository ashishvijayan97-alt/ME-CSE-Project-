import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Mail,
  ArrowRight,
  Code2,
  Lock,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { categories, navigateToCategory, setActivePage, addToast } = useShop();
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    addToast(
      'success',
      'Subscribed to Newsletter!',
      `Thank you! We sent an exclusive 15% discount code to ${email}.`
    );
    setEmail('');
  };

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      {/* Value Propositions / Trust Bar */}
      <div className="border-b border-slate-800/80 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-indigo-950/80 border border-indigo-800/40 text-indigo-400 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Free Shipping</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">On all US orders over $100</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-emerald-950/80 border border-emerald-800/40 text-emerald-400 flex items-center justify-center shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">30-Day Free Returns</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Hassle-free 100% money back</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-amber-950/80 border border-amber-800/40 text-amber-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">2-Year Warranty</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Guaranteed hardware reliability</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-purple-950/80 border border-purple-800/40 text-purple-400 flex items-center justify-center shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">24/7 Expert Support</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Real engineers ready to assist</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-lg">
                🛒
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">ShopCloud</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              ShopCloud is a next-generation e-commerce platform offering premium computing, audio, wearables, and camera optics with seamless checkout, real-time tracking, and durable Flask backend architecture.
            </p>
            <div className="flex items-center gap-2 text-xs text-indigo-400 pt-1">
              <Code2 className="w-4 h-4" />
              <span>Built with Flask, SQLAlchemy, Flask-Login & React 19</span>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-3.5">
              Categories
            </h5>
            <ul className="space-y-2 text-xs">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => navigateToCategory(cat.slug)}
                    className="text-slate-400 hover:text-white transition"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-3.5">
              Quick Links
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setActivePage('profile')}
                  className="text-slate-400 hover:text-white transition"
                >
                  My Account
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('order-history')}
                  className="text-slate-400 hover:text-white transition"
                >
                  Order Tracking
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('wishlist')}
                  className="text-slate-400 hover:text-white transition"
                >
                  Saved Wishlist
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('admin')}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold transition"
                >
                  Admin Control Portal
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('flask-code')}
                  className="text-indigo-400 hover:text-indigo-300 font-semibold transition"
                >
                  Flask Architecture Code
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-3.5">
              Newsletter
            </h5>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Get notified of flash discounts, product drops, and coupon codes.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="you@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5"
              >
                <span>Subscribe</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} ShopCloud Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-[11px] text-slate-400">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>256-Bit SSL Encrypted</span>
            </span>
            <span>•</span>
            <span>Visa / MasterCard / PayPal / Apple Pay</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
