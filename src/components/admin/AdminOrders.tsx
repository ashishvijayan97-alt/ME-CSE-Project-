import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { Order, OrderStatus } from '../../types';
import { OrderDetailModal } from '../customer/OrderDetailModal';
import {
  Search,
  Eye,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  Package,
  Filter,
} from 'lucide-react';

export const AdminOrders: React.FC = () => {
  const { orders, updateOrderStatus } = useShop();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [inspectedOrder, setInspectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNum = o.orderNumber.toLowerCase().includes(q);
      const matchCust = o.customerName.toLowerCase().includes(q);
      const matchEmail = o.customerEmail.toLowerCase().includes(q);
      if (!matchNum && !matchCust && !matchEmail) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Manage Customer Orders</h2>
          <p className="text-xs text-slate-500">
            Fulfill shipments, update transit tracking statuses, and inspect receipts
          </p>
        </div>

        <div className="text-xs bg-indigo-50 border border-indigo-100 text-indigo-700 px-3 py-1.5 rounded-xl font-bold">
          {orders.length} Total Orders Recorded
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by order #, customer, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
                statusFilter === st
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4">Order Reference</th>
                <th className="py-3.5 px-4">Customer Details</th>
                <th className="py-3.5 px-4">Items</th>
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4">Update Status</th>
                <th className="py-3.5 px-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-indigo-600 block">{ord.orderNumber}</span>
                    <span className="text-[10px] text-slate-400">{ord.createdAt.split('T')[0]}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900 block">{ord.customerName}</span>
                    <span className="text-[11px] text-slate-500">{ord.customerEmail}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-slate-800">
                      {ord.items.reduce((s, i) => s + i.quantity, 0)} units ({ord.items.length} line items)
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-extrabold text-slate-900">${ord.total.toFixed(2)}</span>
                  </td>
                  <td className="py-3.5 px-4 uppercase text-[11px] font-semibold text-slate-600">
                    {ord.paymentMethod}
                  </td>
                  <td className="py-3.5 px-4">
                    <select
                      value={ord.status}
                      onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                      className={`px-2.5 py-1 text-xs font-bold rounded-lg border focus:outline-none cursor-pointer ${
                        ord.status === 'delivered'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : ord.status === 'shipped'
                          ? 'bg-blue-50 text-blue-800 border-blue-200'
                          : ord.status === 'processing'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : ord.status === 'cancelled'
                          ? 'bg-rose-50 text-rose-800 border-rose-200'
                          : 'bg-slate-100 text-slate-800 border-slate-200'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setInspectedOrder(ord)}
                      className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-indigo-600 rounded-lg transition"
                      title="Inspect Order"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {inspectedOrder && (
        <OrderDetailModal
          order={inspectedOrder}
          onClose={() => setInspectedOrder(null)}
        />
      )}
    </div>
  );
};
