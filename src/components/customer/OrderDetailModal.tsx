import React from 'react';
import { Order } from '../../types';
import {
  X,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Printer,
  Calendar,
  MapPin,
  CreditCard,
  XCircle,
} from 'lucide-react';
import { motion } from 'motion/react';

interface OrderDetailModalProps {
  order: Order;
  onClose: () => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ order, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200/80"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Order Inspection</span>
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <span>Order #{order.orderNumber}</span>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  order.status === 'delivered'
                    ? 'bg-emerald-100 text-emerald-800'
                    : order.status === 'shipped'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {order.status.toUpperCase()}
              </span>
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Tracking Step Timeline */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-indigo-600" />
              <span>Carrier Tracking Progress ({order.carrier || 'FedEx Priority'})</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-indigo-100/60 border border-indigo-200 font-semibold text-indigo-900">
                1. Placed ({order.createdAt.split('T')[0]})
              </div>
              <div
                className={`p-2.5 rounded-xl border ${
                  order.status !== 'pending'
                    ? 'bg-indigo-100/60 border-indigo-200 font-semibold text-indigo-900'
                    : 'bg-white border-slate-200 text-slate-400'
                }`}
              >
                2. Processed
              </div>
              <div
                className={`p-2.5 rounded-xl border ${
                  order.status === 'shipped' || order.status === 'delivered'
                    ? 'bg-indigo-100/60 border-indigo-200 font-semibold text-indigo-900'
                    : 'bg-white border-slate-200 text-slate-400'
                }`}
              >
                3. In Transit
              </div>
              <div
                className={`p-2.5 rounded-xl border ${
                  order.status === 'delivered'
                    ? 'bg-emerald-100 border-emerald-300 font-bold text-emerald-900'
                    : 'bg-white border-slate-200 text-slate-400'
                }`}
              >
                4. Delivered
              </div>
            </div>

            {order.trackingNumber && (
              <p className="text-[11px] text-slate-500 pt-1">
                Tracking code: <strong className="text-slate-800 font-mono">{order.trackingNumber}</strong>
              </p>
            )}
          </div>

          {/* Purchased Items Table */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
              Items Purchased
            </h4>
            <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
              {order.items.map((item, i) => (
                <div key={i} className="p-3.5 flex items-center justify-between bg-white">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-12 h-12 rounded-xl object-cover bg-slate-50 border border-slate-100"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900">{item.productName}</p>
                      <p className="text-[11px] text-slate-500">
                        Qty: {item.quantity} {item.selectedColor ? `• ${item.selectedColor}` : ''}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-slate-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery & Payment Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <span className="font-bold text-slate-800 block mb-1">Shipping Destination</span>
              <p className="font-semibold text-slate-900">{order.shippingAddress.fullName}</p>
              <p className="text-slate-600">{order.shippingAddress.street} {order.shippingAddress.apartment}</p>
              <p className="text-slate-600">
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
              </p>
              <p className="text-slate-500 mt-1">{order.shippingAddress.phone}</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
              <span className="font-bold text-slate-800 block mb-1">Payment & Charges</span>
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount:</span>
                  <span>-${order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Shipping:</span>
                <span>{order.shippingFee === 0 ? 'FREE' : `$${order.shippingFee.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tax:</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-1.5 font-extrabold text-slate-900 text-sm">
                <span>Total Paid:</span>
                <span className="text-indigo-600">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs rounded-xl transition flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Invoice</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};
