import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { Coupon } from '../../types';
import {
  Tag,
  Plus,
  Trash2,
  Check,
  X,
  Calendar,
  Percent,
} from 'lucide-react';

export const AdminCoupons: React.FC = () => {
  const { coupons, addCoupon, deleteCoupon, toggleCouponStatus } = useShop();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState('20');
  const [minimumSpend, setMinimumSpend] = useState('100');
  const [expiresAt, setExpiresAt] = useState('2026-12-31');

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    addCoupon({
      code: code.trim().toUpperCase(),
      discountPercentage: parseInt(discountPercentage, 10) || 10,
      minimumSpend: parseFloat(minimumSpend) || 0,
      expiresAt,
      isActive: true,
    });

    setCode('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Manage Discount Codes & Coupons</h2>
          <p className="text-xs text-slate-500">Create promotional codes, set minimum purchase rules, and toggle active status</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Create Coupon Code</span>
        </button>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {coupons.map((c) => (
          <div
            key={c.id}
            className={`rounded-3xl border p-5 shadow-xs transition flex flex-col justify-between ${
              c.isActive ? 'bg-white border-slate-200/80' : 'bg-slate-50 border-slate-200 opacity-60'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <Tag className="w-5 h-5" />
                </span>
                <button
                  onClick={() => toggleCouponStatus(c.id)}
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full transition ${
                    c.isActive
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {c.isActive ? 'ACTIVE' : 'DISABLED'}
                </button>
              </div>

              <h3 className="text-lg font-mono font-black text-indigo-600">{c.code}</h3>
              <p className="text-sm font-bold text-slate-900 mt-1">
                {c.discountPercentage}% Discount
              </p>

              <div className="mt-3 space-y-1 text-xs text-slate-500">
                <p>Min. Spend: <strong>${c.minimumSpend || 0}</strong></p>
                <p className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Valid until {c.expiresAt || 'No Expiry'}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
              <button
                onClick={() => toggleCouponStatus(c.id)}
                className="text-xs text-indigo-600 hover:underline font-semibold"
              >
                {c.isActive ? 'Disable Code' : 'Enable Code'}
              </button>

              <button
                onClick={() => deleteCoupon(c.id)}
                className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition"
                title="Delete coupon"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">Create New Coupon Code</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Coupon Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SUMMER25"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 font-mono font-bold uppercase focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Discount Percentage (%)</label>
                <input
                  type="number"
                  min="1"
                  max="90"
                  required
                  value={discountPercentage}
                  onChange={(e) => setDiscountPercentage(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Minimum Order Subtotal ($)</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={minimumSpend}
                  onChange={(e) => setMinimumSpend(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Expiration Date</label>
                <input
                  type="date"
                  required
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
