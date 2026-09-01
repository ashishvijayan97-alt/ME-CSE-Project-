import React from 'react';
import { useShop } from '../../context/ShopContext';
import {
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Clock,
  Truck,
  Eye,
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigateTab: (tab: string) => void;
}

export const AdminDashboard: React.FC = () => {
  const { products, orders, categories, reviews, setSelectedOrderId } = useShop();

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.total : 0), 0);
  const totalOrdersCount = orders.length;
  const lowStockCount = products.filter((p) => p.stock <= 5).length;
  const pendingOrdersCount = orders.filter((o) => o.status === 'pending' || o.status === 'processing').length;
  const averageRating = (
    products.reduce((sum, p) => sum + p.rating, 0) / (products.length || 1)
  ).toFixed(1);

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1 */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Gross Sales</span>
            <h3 className="text-2xl font-black text-slate-900 mt-1">
              ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+18.4% this month</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Orders</span>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{totalOrdersCount}</h3>
            <div className="flex items-center gap-1 text-[11px] text-amber-600 font-bold mt-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{pendingOrdersCount} requiring fulfillment</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Catalog</span>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{products.length} Products</h3>
            <div className="flex items-center gap-1 text-[11px] text-slate-500 font-semibold mt-1">
              <span>Across {categories.length} categories</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Low Stock Alert</span>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{lowStockCount} Items</h3>
            <div className="flex items-center gap-1 text-[11px] text-rose-600 font-bold mt-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>≤ 5 units remaining</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Row: Recent Orders & Stock Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders Table */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Recent Customer Orders</h3>
              <p className="text-xs text-slate-500">Real-time purchase stream from the storefront</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 rounded-l-xl">Order #</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 rounded-r-xl">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 font-mono font-bold text-indigo-600">{ord.orderNumber}</td>
                    <td className="py-3 px-4 text-slate-900 font-bold">{ord.customerName}</td>
                    <td className="py-3 px-4 text-slate-600">
                      {ord.items.reduce((s, i) => s + i.quantity, 0)} items
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">${ord.total.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          ord.status === 'delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ord.status === 'shipped'
                            ? 'bg-blue-100 text-blue-800'
                            : ord.status === 'processing'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {ord.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">{ord.createdAt.split('T')[0]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Warning List */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <span>Inventory Attention</span>
            </h3>
          </div>

          <div className="space-y-3">
            {products
              .filter((p) => p.stock <= 15)
              .slice(0, 5)
              .map((prod) => (
                <div
                  key={prod.id}
                  className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between gap-3"
                >
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-10 h-10 rounded-lg object-cover bg-white shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{prod.name}</h4>
                    <span className="text-[10px] text-slate-400">{prod.brand}</span>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-xs font-black px-2 py-0.5 rounded-md ${
                        prod.stock <= 5
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {prod.stock} left
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
