import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { Order, OrderStatus } from '../../types';
import { OrderDetailModal } from './OrderDetailModal';
import {
  Package,
  Search,
  Truck,
  Eye,
  RotateCcw,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  ArrowRight,
  ShoppingBag,
} from 'lucide-react';

export const OrderHistoryPage: React.FC = () => {
  const { orders, addToCart, setActivePage, selectedOrderId, setSelectedOrderId } = useShop();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalOrder, setActiveModalOrder] = useState<Order | null>(null);

  // If a selectedOrderId exists on load, open that modal
  React.useEffect(() => {
    if (selectedOrderId) {
      const found = orders.find((o) => o.id === selectedOrderId);
      if (found) setActiveModalOrder(found);
    }
  }, [selectedOrderId, orders]);

  const filteredOrders = orders.filter((ord) => {
    if (statusFilter !== 'all' && ord.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNum = ord.orderNumber.toLowerCase().includes(q);
      const matchItem = ord.items.some((it) => it.productName.toLowerCase().includes(q));
      if (!matchNum && !matchItem) return false;
    }
    return true;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5" /> Delivered
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
            <Truck className="w-3.5 h-3.5" /> In Transit
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
            <Clock className="w-3.5 h-3.5" /> Processing
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
            <XCircle className="w-3.5 h-3.5" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
            <Clock className="w-3.5 h-3.5" /> Order Placed
          </span>
        );
    }
  };

  const handleReorder = (order: Order) => {
    order.items.forEach((item) => {
      // Find full product object if available
      addToCart(
        {
          id: item.productId,
          name: item.productName,
          slug: item.productId,
          description: '',
          price: item.price,
          category: 'electronics',
          brand: 'ShopCloud',
          sku: item.productId,
          stock: 50,
          rating: 4.8,
          reviewCount: 10,
          image: item.productImage,
          images: [item.productImage],
          features: [],
          specifications: {},
          createdAt: '2025-01-01',
        },
        item.quantity,
        item.selectedColor,
        item.selectedSize
      );
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Your Orders & Tracking</h1>
          <p className="text-xs text-slate-500 mt-1">
            Track real-time carrier delivery status, view invoices, and manage past purchases.
          </p>
        </div>

        <button
          onClick={() => setActivePage('products')}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 self-start"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Shop More Items</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by order # or product name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
          />
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
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

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center shadow-xs">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">No Orders Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
            We couldn't find any orders matching your criteria. Try adjusting your search query or status filter.
          </p>
          <button
            onClick={() => {
              setStatusFilter('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition"
            >
              {/* Order Header bar */}
              <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex flex-wrap items-center gap-6">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Order Placed</span>
                    <span className="font-semibold text-slate-800">{order.createdAt.split('T')[0] || order.createdAt}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Order Number</span>
                    <span className="font-mono font-bold text-indigo-600">{order.orderNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Amount</span>
                    <span className="font-bold text-slate-900">${order.total.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Ship To</span>
                    <span className="font-semibold text-slate-800">{order.shippingAddress.fullName}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {getStatusBadge(order.status)}
                </div>
              </div>

              {/* Order Body */}
              <div className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                {/* Item thumbs */}
                <div className="flex-1 space-y-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-14 h-14 object-cover rounded-xl bg-slate-50 border border-slate-100 shrink-0"
                      />
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900">{item.productName}</h4>
                        <div className="text-[11px] text-slate-500">
                          Qty: {item.quantity} {item.selectedColor ? `• ${item.selectedColor}` : ''} • ${item.price.toFixed(2)} each
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Right actions */}
                <div className="flex flex-wrap sm:flex-col gap-2.5 w-full md:w-48">
                  <button
                    onClick={() => setActiveModalOrder(order)}
                    className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Order Details</span>
                  </button>

                  <button
                    onClick={() => handleReorder(order)}
                    className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Buy Again</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Detail Modal */}
      {activeModalOrder && (
        <OrderDetailModal
          order={activeModalOrder}
          onClose={() => {
            setActiveModalOrder(null);
            setSelectedOrderId(null);
          }}
        />
      )}
    </div>
  );
};
