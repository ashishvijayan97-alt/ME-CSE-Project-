import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { AdminDashboard } from './AdminDashboard';
import { AdminProducts } from './AdminProducts';
import { AdminOrders } from './AdminOrders';
import { AdminCategories } from './AdminCategories';
import { AdminInventory } from './AdminInventory';
import { AdminCoupons } from './AdminCoupons';
import { AdminCustomers } from './AdminCustomers';
import { AdminReviews } from './AdminReviews';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Layers,
  Boxes,
  Tag,
  Users,
  MessageSquare,
  ArrowLeft,
  Shield,
  LogOut,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AdminPortal: React.FC = () => {
  const { setActivePage, currentUser, setCurrentUser, logout } = useShop();

  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'products' | 'orders' | 'categories' | 'inventory' | 'coupons' | 'customers' | 'reviews'
  >('dashboard');

  const navItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'products', label: 'Products & Catalog', icon: Package },
    { id: 'orders', label: 'Orders & Fulfillment', icon: ShoppingBag },
    { id: 'categories', label: 'Categories Taxonomy', icon: Layers },
    { id: 'inventory', label: 'Stock & Inventory', icon: Boxes },
    { id: 'coupons', label: 'Coupons & Promos', icon: Tag },
    { id: 'customers', label: 'Customer Accounts', icon: Users },
    { id: 'reviews', label: 'Reviews Moderation', icon: MessageSquare },
  ];

  return (
    <div className="min-h-[calc(100vh-140px)] bg-slate-100/70 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Admin Navigation Bar */}
        <div className="bg-slate-900 text-white rounded-3xl p-4 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-lg font-bold shadow-md">
              🛒
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-extrabold tracking-tight">ShopCloud Admin Control</h1>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  LIVE PORTAL
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Connected to Flask REST Backend & SQLAlchemy ORM
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActivePage('home')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl border border-slate-700 transition flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Customer Storefront</span>
            </button>

            <button
              onClick={() => setActivePage('flask-code')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition"
            >
              Flask API Docs
            </button>
          </div>
        </div>

        {/* Main Grid: Sub-Navigation + Content Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Sub-Nav Sidebar */}
          <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200/80 p-3 shadow-xs space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition text-left ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Dynamic Content Panel */}
          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'dashboard' && <AdminDashboard onNavigateTab={(t) => setActiveTab(t as any)} />}
                {activeTab === 'products' && <AdminProducts />}
                {activeTab === 'orders' && <AdminOrders />}
                {activeTab === 'categories' && <AdminCategories />}
                {activeTab === 'inventory' && <AdminInventory />}
                {activeTab === 'coupons' && <AdminCoupons />}
                {activeTab === 'customers' && <AdminCustomers />}
                {activeTab === 'reviews' && <AdminReviews />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
