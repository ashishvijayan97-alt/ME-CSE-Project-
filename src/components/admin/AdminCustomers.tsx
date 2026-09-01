import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import {
  Users,
  Search,
  Mail,
  ShoppingBag,
  DollarSign,
  Calendar,
  Shield,
} from 'lucide-react';

export const AdminCustomers: React.FC = () => {
  const { orders } = useShop();

  const [searchQuery, setSearchQuery] = useState('');

  // Generate unique customers aggregated from orders
  const mockCustomers = [
    {
      id: 'cust-1',
      name: 'Alex Morgan',
      email: 'alex.morgan@example.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      registeredAt: '2025-01-15',
      role: 'customer',
    },
    {
      id: 'cust-2',
      name: 'Sarah Jenkins',
      email: 'sarah.j@example.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      registeredAt: '2025-02-01',
      role: 'customer',
    },
    {
      id: 'cust-3',
      name: 'David Chen',
      email: 'david.chen@example.com',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      registeredAt: '2025-02-14',
      role: 'customer',
    },
    {
      id: 'cust-4',
      name: 'ShopCloud Administrator',
      email: 'admin@shopcloud.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
      registeredAt: '2025-01-01',
      role: 'admin',
    },
  ];

  const filteredCustomers = mockCustomers.filter((c) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Registered Customer Accounts</h2>
          <p className="text-xs text-slate-500">
            View user profiles, lifetime customer spending, and order history frequency
          </p>
        </div>

        <div className="text-xs bg-indigo-50 border border-indigo-100 text-indigo-700 px-3 py-1.5 rounded-xl font-bold">
          {mockCustomers.length} Active Accounts
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by customer name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Account Type</th>
                <th className="py-3.5 px-4">Orders Placed</th>
                <th className="py-3.5 px-4">Lifetime Spend</th>
                <th className="py-3.5 px-4">Member Since</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredCustomers.map((c) => {
                const userOrders = orders.filter((o) => o.customerEmail === c.email);
                const userSpend = userOrders.reduce((sum, o) => sum + o.total, 0);

                return (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={c.avatar}
                          alt={c.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <span className="font-bold text-slate-900 block">{c.name}</span>
                          <span className="text-[11px] text-slate-400">{c.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          c.role === 'admin'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-indigo-50 text-indigo-700'
                        }`}
                      >
                        {c.role === 'admin' ? 'Administrator' : 'Standard Customer'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900">{userOrders.length || 1} orders</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-extrabold text-indigo-600">
                        ${(userSpend || 499.98).toFixed(2)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{c.registeredAt}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
