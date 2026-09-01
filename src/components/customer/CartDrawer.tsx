import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Tag,
  Check,
  Truck,
  ShieldCheck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    cartCount,
    cartSubtotal,
    cartDiscount,
    cartShippingFee,
    cartTotal,
    freeShippingThreshold,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    setActivePage,
  } = useShop();

  const [couponInput, setCouponInput] = useState('');

  if (!isCartOpen) return null;

  const progressPercent = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    if (applyCoupon(couponInput)) {
      setCouponInput('');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs">
        {/* Backdrop click to close */}
        <div className="flex-1" onClick={() => setIsCartOpen(false)} />

        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 border-l border-slate-200"
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-indigo-600" />
              <h2 className="font-bold text-slate-900">Your Cart ({cartCount})</h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 transition"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="bg-indigo-50/80 px-4 py-3 border-b border-indigo-100/70">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-950 mb-1.5">
              <Truck className="w-4 h-4 text-indigo-600 shrink-0" />
              {remainingForFreeShipping === 0 ? (
                <span className="text-emerald-700 font-bold">You unlocked FREE Express Shipping! 🎉</span>
              ) : (
                <span>
                  Add <strong className="text-indigo-600">${remainingForFreeShipping.toFixed(2)}</strong> more for <strong>FREE Shipping</strong>
                </span>
              )}
            </div>
            <div className="w-full bg-indigo-200/60 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                className={`h-full rounded-full transition-all duration-300 ${
                  progressPercent >= 100 ? 'bg-emerald-500' : 'bg-indigo-600'
                }`}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-3 text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-1">Your cart is empty</h3>
                <p className="text-xs text-slate-500 max-w-xs mb-5">
                  Looks like you haven't added any gear yet. Discover our top trending audio, wearables, and office accessories.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setActivePage('products');
                  }}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition"
                >
                  Explore Products
                </button>
              </div>
            ) : (
              cart.map((item, index) => (
                <div
                  key={`${item.product.id}-${item.selectedColor || ''}-${item.selectedSize || ''}-${index}`}
                  className="flex gap-3 p-3 bg-slate-50/60 border border-slate-100 rounded-xl hover:border-slate-200 transition"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-18 h-18 object-cover rounded-lg bg-white border border-slate-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-xs font-semibold text-slate-900 line-clamp-2 leading-tight">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id, item.selectedColor, item.selectedSize)}
                          className="text-slate-400 hover:text-rose-600 transition p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {(item.selectedColor || item.selectedSize) && (
                        <div className="text-[11px] text-slate-500 mt-0.5 flex gap-2">
                          {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                          {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-200/50">
                      <div className="flex items-center border border-slate-300 rounded-md bg-white">
                        <button
                          onClick={() =>
                            updateCartQuantity(
                              item.product.id,
                              item.quantity - 1,
                              item.selectedColor,
                              item.selectedSize
                            )
                          }
                          className="p-1 hover:bg-slate-100 text-slate-600 transition"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-semibold text-slate-800 min-w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateCartQuantity(
                              item.product.id,
                              item.quantity + 1,
                              item.selectedColor,
                              item.selectedSize
                            )
                          }
                          className="p-1 hover:bg-slate-100 text-slate-600 transition"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-slate-900">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                        {item.quantity > 1 && (
                          <div className="text-[10px] text-slate-400">
                            ${item.product.price.toFixed(2)} each
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with Coupon & Totals */}
          {cart.length > 0 && (
            <div className="p-4 border-t border-slate-200 bg-slate-50/70 space-y-3">
              {/* Coupon Form */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs">
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="font-semibold">{appliedCoupon.code}</span>
                    <span>(-{appliedCoupon.discountPercentage}%)</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-emerald-700 hover:text-emerald-900 font-semibold text-[11px] underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div>
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Coupon code (e.g. WELCOME15)"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="w-full pl-8 pr-2 py-1.5 text-xs uppercase border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 bg-white"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg transition"
                    >
                      Apply
                    </button>
                  </form>
                  <div className="flex items-center gap-1 mt-1.5">
                    <span className="text-[10px] text-slate-500">Quick apply:</span>
                    <button
                      type="button"
                      onClick={() => applyCoupon('WELCOME15')}
                      className="text-[10px] text-indigo-600 hover:underline bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100 font-mono"
                    >
                      WELCOME15
                    </button>
                    <button
                      type="button"
                      onClick={() => applyCoupon('FLASH50')}
                      className="text-[10px] text-indigo-600 hover:underline bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100 font-mono"
                    >
                      FLASH50
                    </button>
                  </div>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-800">${cartSubtotal.toFixed(2)}</span>
                </div>
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount ({appliedCoupon?.code})</span>
                    <span className="font-semibold">-${cartDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span>
                    {cartShippingFee === 0 ? (
                      <span className="text-emerald-600 font-semibold">FREE</span>
                    ) : (
                      `$${cartShippingFee.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2 text-sm font-bold text-slate-900">
                  <span>Total</span>
                  <span className="text-indigo-600">${cartTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setActivePage('checkout');
                  }}
                  className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setActivePage('cart');
                  }}
                  className="w-full py-2 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl transition"
                >
                  View Full Cart & Details
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>256-Bit SSL Encrypted Safe Checkout</span>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
