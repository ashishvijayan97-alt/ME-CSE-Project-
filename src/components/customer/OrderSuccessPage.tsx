import React from 'react';
import { useShop } from '../../context/ShopContext';
import {
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  Calendar,
  CreditCard,
  ArrowRight,
  Printer,
  Download,
  ShoppingBag,
} from 'lucide-react';
import { motion } from 'motion/react';

export const OrderSuccessPage: React.FC = () => {
  const { selectedOrderId, orders, setActivePage, navigateToOrder } = useShop();

  const order = orders.find((o) => o.id === selectedOrderId) || orders[0];

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-800 mb-2">No Order Found</h2>
        <button
          onClick={() => setActivePage('home')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold"
        >
          Return Home
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Top Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs text-center space-y-4"
      >
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Payment & Order Confirmed
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Thank you for your order, {order.customerName}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            We've received your order and our warehouse team is preparing your package. A confirmation has been dispatched to{' '}
            <strong className="text-slate-800">{order.customerEmail}</strong>.
          </p>
        </div>

        <div className="inline-flex flex-wrap items-center justify-center gap-4 bg-slate-50 border border-slate-200 px-6 py-3 rounded-2xl text-xs">
          <div>
            <span className="text-slate-400 block text-[10px]">Order Reference</span>
            <span className="font-mono font-bold text-indigo-600 text-sm">{order.orderNumber}</span>
          </div>
          <div className="hidden sm:block text-slate-300">|</div>
          <div>
            <span className="text-slate-400 block text-[10px]">Tracking Number</span>
            <span className="font-mono font-bold text-slate-800">{order.trackingNumber || 'Pending'}</span>
          </div>
          <div className="hidden sm:block text-slate-300">|</div>
          <div>
            <span className="text-slate-400 block text-[10px]">Estimated Delivery</span>
            <span className="font-bold text-emerald-700">{order.estimatedDelivery || 'In 2–3 Days'}</span>
          </div>
        </div>
      </motion.div>

      {/* Order Tracking Progress Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
          <Truck className="w-5 h-5 text-indigo-600" />
          <span>Fulfillment Status</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[
            { title: 'Order Placed', desc: 'Payment Authorized', active: true },
            { title: 'Processing', desc: 'Warehouse Packing', active: order.status !== 'pending' },
            { title: 'Shipped', desc: 'In Carrier Transit', active: order.status === 'shipped' || order.status === 'delivered' },
            { title: 'Delivered', desc: 'Package Arrived', active: order.status === 'delivered' },
          ].map((step, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border-2 transition ${
                step.active
                  ? 'border-indigo-600 bg-indigo-50/40 text-indigo-950'
                  : 'border-slate-100 bg-slate-50/50 text-slate-400'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                    step.active ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {idx + 1}
                </span>
                <span className="font-bold text-xs">{step.title}</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Item Breakdown & Address Details */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="text-base font-extrabold text-slate-900">Order Items & Summary</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>
          </div>
        </div>

        {/* Items List */}
        <div className="divide-y divide-slate-100">
          {order.items.map((item, i) => (
            <div key={i} className="py-3.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <img
                  src={item.productImage}
                  alt={item.productName}
                  className="w-14 h-14 rounded-xl object-cover bg-slate-50 border border-slate-100 shrink-0"
                />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">{item.productName}</h4>
                  <div className="text-[11px] text-slate-500">
                    Qty: {item.quantity} {item.selectedColor ? `• Color: ${item.selectedColor}` : ''}
                  </div>
                </div>
              </div>
              <div className="text-xs sm:text-sm font-extrabold text-slate-900 text-right">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        {/* Address and Financial Totals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1 text-xs">
            <span className="font-bold text-slate-800 block mb-1">Delivery Destination:</span>
            <p className="font-semibold text-slate-900">{order.shippingAddress.fullName}</p>
            <p className="text-slate-600">{order.shippingAddress.street} {order.shippingAddress.apartment}</p>
            <p className="text-slate-600">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
            <p className="text-slate-500 mt-1">Payment: {order.paymentMethod.toUpperCase()}</p>
          </div>

          <div className="space-y-2 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-800">${order.subtotal.toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount ({order.appliedCoupon || 'Coupon'})</span>
                <span className="font-bold">-${order.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping Fee</span>
              <span className="font-semibold text-slate-800">
                {order.shippingFee === 0 ? 'FREE' : `$${order.shippingFee.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Tax</span>
              <span className="font-semibold text-slate-800">${order.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-extrabold text-slate-900">
              <span>Total Paid</span>
              <span className="text-indigo-600 text-lg">${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={() => setActivePage('order-history')}
          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-2"
        >
          <Package className="w-4 h-4" />
          <span>View All Orders & Tracking</span>
        </button>

        <button
          onClick={() => setActivePage('products')}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-2"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
