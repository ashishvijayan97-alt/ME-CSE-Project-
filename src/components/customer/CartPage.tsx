import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import {
  ShoppingBag,
  Trash2,
  Heart,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  Truck,
  Tag,
  ShieldCheck,
  Check,
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartCount,
    cartSubtotal,
    cartDiscount,
    cartShippingFee,
    cartTax,
    cartTotal,
    freeShippingThreshold,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    moveToCartFromWishlist,
    toggleWishlist,
    setActivePage,
    navigateToProduct,
  } = useShop();

  const [couponCode, setCouponCode] = useState('');

  const progressPercent = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);
  const remainingForFree = Math.max(0, freeShippingThreshold - cartSubtotal);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    if (applyCoupon(couponCode)) {
      setCouponCode('');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-inner">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900">Your Shopping Cart is Empty</h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          Explore our collection of studio headphones, titanium wearables, and mechanical keyboards to fill your bag.
        </p>
        <button
          onClick={() => setActivePage('products')}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Shopping Cart</h1>
          <p className="text-xs text-slate-500 mt-1">Review your items before proceeding to checkout</p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-rose-600 hover:text-rose-700 font-semibold underline"
        >
          Clear Cart
        </button>
      </div>

      {/* Free Shipping Bar */}
      <div className="bg-indigo-50/80 border border-indigo-100 rounded-2xl p-4">
        <div className="flex items-center justify-between text-xs font-bold text-indigo-950 mb-1.5">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-indigo-600" />
            <span>
              {remainingForFree === 0 ? (
                <span className="text-emerald-700">Congratulations! You unlocked FREE Express Shipping! 🎉</span>
              ) : (
                <span>
                  Add <strong className="text-indigo-600">${remainingForFree.toFixed(2)}</strong> more to qualify for <strong>FREE Shipping</strong>
                </span>
              )}
            </span>
          </div>
          <span className="text-indigo-600 font-mono">{progressPercent.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-indigo-200/60 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              progressPercent >= 100 ? 'bg-emerald-500' : 'bg-indigo-600'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Cart Items Table / List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs divide-y divide-slate-100">
            {cart.map((item, index) => (
              <div
                key={`${item.product.id}-${item.selectedColor || ''}-${item.selectedSize || ''}-${index}`}
                className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
              >
                <div className="flex gap-4 items-center flex-1 min-w-0">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    onClick={() => navigateToProduct(item.product.id)}
                    className="w-20 h-20 object-cover rounded-xl bg-slate-50 border border-slate-100 shrink-0 cursor-pointer"
                  />
                  <div className="min-w-0">
                    <h3
                      onClick={() => navigateToProduct(item.product.id)}
                      className="text-sm font-bold text-slate-900 hover:text-indigo-600 cursor-pointer transition line-clamp-1"
                    >
                      {item.product.name}
                    </h3>
                    <div className="text-xs text-slate-500 mt-0.5 flex flex-wrap gap-2">
                      <span className="font-semibold text-indigo-600">{item.product.brand}</span>
                      {item.selectedColor && <span>• Color: {item.selectedColor}</span>}
                      {item.selectedSize && <span>• Size: {item.selectedSize}</span>}
                    </div>
                    <div className="text-xs font-bold text-slate-900 mt-1">
                      ${item.product.price.toFixed(2)} each
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-6 pt-2 sm:pt-0">
                  {/* Quantity */}
                  <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50">
                    <button
                      onClick={() =>
                        updateCartQuantity(
                          item.product.id,
                          item.quantity - 1,
                          item.selectedColor,
                          item.selectedSize
                        )
                      }
                      className="p-2 hover:bg-slate-200 text-slate-700 transition rounded-l-xl"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-slate-900 min-w-8 text-center">
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
                      className="p-2 hover:bg-slate-200 text-slate-700 transition rounded-r-xl"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right min-w-20">
                    <span className="text-sm font-extrabold text-slate-900">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        toggleWishlist(item.product.id);
                        removeFromCart(item.product.id, item.selectedColor, item.selectedSize);
                      }}
                      className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-rose-600 transition"
                      title="Move to wishlist"
                    >
                      <Heart className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        removeFromCart(item.product.id, item.selectedColor, item.selectedSize)
                      }
                      className="p-2 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition"
                      title="Delete item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setActivePage('products')}
            className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </button>
        </div>

        {/* Right: Order Summary Card */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-6">
          <h2 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3">
            Order Summary
          </h2>

          {/* Coupon Code Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Promo Code / Coupon
            </label>
            {appliedCoupon ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-emerald-600" />
                  <div>
                    <span className="font-bold">{appliedCoupon.code}</span>
                    <span className="text-[11px] block text-emerald-700">
                      {appliedCoupon.discountPercentage}% Discount Applied
                    </span>
                  </div>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-xs text-emerald-800 font-bold underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Code (e.g. WELCOME15)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs uppercase border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 bg-slate-50"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition"
                >
                  Apply
                </button>
              </form>
            )}
          </div>

          {/* Breakdown */}
          <div className="space-y-2.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
            <div className="flex justify-between">
              <span>Items Subtotal ({cartCount})</span>
              <span className="font-bold text-slate-900">${cartSubtotal.toFixed(2)}</span>
            </div>

            {cartDiscount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Coupon Discount ({appliedCoupon?.code})</span>
                <span className="font-bold">-${cartDiscount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Estimated Shipping</span>
              <span>
                {cartShippingFee === 0 ? (
                  <span className="text-emerald-600 font-bold">FREE</span>
                ) : (
                  `$${cartShippingFee.toFixed(2)}`
                )}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Estimated Sales Tax (8%)</span>
              <span className="font-bold text-slate-900">${cartTax.toFixed(2)}</span>
            </div>

            <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-extrabold text-slate-900">
              <span>Estimated Total</span>
              <span className="text-indigo-600 text-xl">${cartTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Checkout CTA */}
          <button
            onClick={() => setActivePage('checkout')}
            className="w-full py-3.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm rounded-2xl shadow-md transition flex items-center justify-center gap-2"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Guaranteed Safe & Secure Checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
};
