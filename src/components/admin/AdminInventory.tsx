import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import {
  Package,
  Search,
  Plus,
  Minus,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from 'lucide-react';

export const AdminInventory: React.FC = () => {
  const { products, updateProductStock, addToast } = useShop();

  const [searchQuery, setSearchQuery] = useState('');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out' | 'healthy'>('all');

  const filteredProducts = products.filter((p) => {
    if (stockFilter === 'out' && p.stock > 0) return false;
    if (stockFilter === 'low' && (p.stock === 0 || p.stock > 5)) return false;
    if (stockFilter === 'healthy' && p.stock <= 5) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchSku = p.sku.toLowerCase().includes(q);
      const matchBrand = p.brand.toLowerCase().includes(q);
      if (!matchName && !matchSku && !matchBrand) return false;
    }
    return true;
  });

  const handleBulkRestock = () => {
    products.forEach((p) => {
      if (p.stock <= 5) {
        updateProductStock(p.id, p.stock + 20);
      }
    });
    addToast('success', 'Bulk Restock Completed', 'Added 20 units to all low-stock items.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Live Inventory & Stock Manager</h2>
          <p className="text-xs text-slate-500">
            Real-time warehouse units count, low-stock triggers, and instant adjustments
          </p>
        </div>

        <button
          onClick={handleBulkRestock}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 self-start"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Restock All Low Items (+20)</span>
        </button>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by product name, SKU, brand..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all', label: 'All Items' },
            { id: 'low', label: 'Low Stock (≤5)' },
            { id: 'out', label: 'Out of Stock (0)' },
            { id: 'healthy', label: 'Healthy (>5)' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setStockFilter(f.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                stockFilter === f.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4">Item Details</th>
                <th className="py-3.5 px-4">SKU / Department</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Stock Status</th>
                <th className="py-3.5 px-4">Units Available</th>
                <th className="py-3.5 px-4 text-right">Quick Adjust</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-12 h-12 rounded-xl object-cover bg-slate-50 border border-slate-100 shrink-0"
                      />
                      <div>
                        <h4 className="font-bold text-slate-900">{p.name}</h4>
                        <span className="text-[11px] text-slate-400">{p.brand}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-slate-800 block">{p.sku}</span>
                    <span className="text-[11px] text-slate-400 capitalize">{p.category}</span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">${p.price.toFixed(2)}</td>
                  <td className="py-3.5 px-4">
                    {p.stock === 0 ? (
                      <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        <XCircle className="w-3 h-3" /> Out of Stock
                      </span>
                    ) : p.stock <= 5 ? (
                      <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        <AlertTriangle className="w-3 h-3" /> Low Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> Healthy
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-base font-black text-slate-900">{p.stock}</span> units
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => updateProductStock(p.id, Math.max(0, p.stock - 1))}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                        title="Decrement 1"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => updateProductStock(p.id, p.stock + 1)}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                        title="Increment 1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => updateProductStock(p.id, p.stock + 10)}
                        className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded-lg transition"
                        title="Add +10 units"
                      >
                        +10
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
