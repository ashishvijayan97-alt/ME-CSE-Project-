import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { X, Mail, Lock, User, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalTab,
    setAuthModalTab,
    login,
    register,
    switchDemoRole,
  } = useShop();

  const [email, setEmail] = useState('customer@shopcloud.com');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('');
  const [isAdminLogin, setIsAdminLogin] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authModalTab === 'login') {
      login(email, isAdminLogin ? 'admin' : 'customer');
    } else {
      if (!name.trim()) return;
      register(name, email, isAdminLogin ? 'admin' : 'customer');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 p-6 text-white relative">
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🛒</span>
              <span className="text-xl font-bold tracking-tight text-white">ShopCloud</span>
            </div>
            <p className="text-xs text-indigo-200">
              {authModalTab === 'login'
                ? 'Welcome back! Sign in to access your orders, cart & wishlist.'
                : 'Create an account to track orders and save your favorites.'}
            </p>

            {/* Tabs */}
            <div className="flex rounded-lg bg-white/10 p-1 mt-4">
              <button
                type="button"
                onClick={() => {
                  setAuthModalTab('login');
                  setEmail('customer@shopcloud.com');
                }}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition ${
                  authModalTab === 'login'
                    ? 'bg-white text-indigo-950 shadow-sm'
                    : 'text-indigo-200 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthModalTab('register');
                  setEmail('alex.new@example.com');
                }}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition ${
                  authModalTab === 'register'
                    ? 'bg-white text-indigo-950 shadow-sm'
                    : 'text-indigo-200 hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>
          </div>

          {/* Body Form */}
          <div className="p-6">
            {/* Quick Demo Credentials */}
            <div className="mb-5 p-3 rounded-xl bg-indigo-50/70 border border-indigo-100/80">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-900 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>1-Click Demo Logins:</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    switchDemoRole('customer');
                    setIsAuthModalOpen(false);
                  }}
                  className="px-2.5 py-1.5 bg-white border border-indigo-200 rounded-lg text-xs font-medium text-slate-800 hover:border-indigo-500 hover:bg-indigo-50 transition text-left"
                >
                  <div className="font-semibold text-indigo-700">Customer</div>
                  <div className="text-[10px] text-slate-500 truncate">Alex Morgan</div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    switchDemoRole('admin');
                    setIsAuthModalOpen(false);
                  }}
                  className="px-2.5 py-1.5 bg-white border border-indigo-200 rounded-lg text-xs font-medium text-slate-800 hover:border-indigo-500 hover:bg-indigo-50 transition text-left"
                >
                  <div className="font-semibold text-emerald-700 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Admin
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">Sarah Chen</div>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {authModalTab === 'register' && (
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="Alex Morgan"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="user@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-slate-700">Password</label>
                  {authModalTab === 'login' && (
                    <button
                      type="button"
                      onClick={() => alert('Password reset link sent to demo account.')}
                      className="text-[11px] text-indigo-600 hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="admin-role-toggle"
                  checked={isAdminLogin}
                  onChange={(e) => setIsAdminLogin(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <label htmlFor="admin-role-toggle" className="text-xs text-slate-600 select-none">
                  Sign in with Admin Privileges (Flask Admin Portal)
                </label>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-lg shadow-sm transition flex items-center justify-center gap-2"
              >
                <span>{authModalTab === 'login' ? 'Sign In to Account' : 'Complete Registration'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
