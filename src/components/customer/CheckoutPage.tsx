import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { Address } from '../../types';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  CreditCard,
  Truck,
  MapPin,
  CheckCircle2,
  Lock,
  Plus,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  Tag,
} from 'lucide-react';
import { motion } from 'motion/react';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    cartDiscount,
    appliedCoupon,
    addresses,
    addAddress,
    createOrder,
    currentUser,
    setActivePage,
    freeShippingThreshold,
  } = useShop();

  // Selected state
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    addresses.find((a) => a.isDefault)?.id || addresses[0]?.id || ''
  );
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express' | 'overnight'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'apple_pay' | 'cod'>('card');

  // New address modal state
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddrFullName, setNewAddrFullName] = useState('');
  const [newAddrStreet, setNewAddrStreet] = useState('');
  const [newAddrApartment, setNewAddrApartment] = useState('');
  const [newAddrCity, setNewAddrCity] = useState('');
  const [newAddrState, setNewAddrState] = useState('CA');
  const [newAddrPostal, setNewAddrPostal] = useState('');
  const [newAddrPhone, setNewAddrPhone] = useState('');
  const [newAddrIsDefault, setNewAddrIsDefault] = useState(false);

  // Card details
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardHolder, setCardHolder] = useState(currentUser?.name || 'Alex Morgan');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Your Cart is Empty</h2>
        <p className="text-xs text-slate-500">Please add items to your cart before proceeding to checkout.</p>
        <button
          onClick={() => setActivePage('products')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold"
        >
          Browse Products
        </button>
      </div>
    );
  }

  // Calculate Shipping fee based on selected method
  const getShippingFee = () => {
    if (shippingMethod === 'overnight') return 24.99;
    if (shippingMethod === 'express') return 14.99;
    return cartSubtotal >= freeShippingThreshold ? 0 : 9.99;
  };

  const shippingFee = getShippingFee();
  const taxableAmount = Math.max(0, cartSubtotal - cartDiscount);
  const tax = Math.round(taxableAmount * 0.08 * 100) / 100;
  const grandTotal = Math.max(0, cartSubtotal - cartDiscount + shippingFee + tax);

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId) || addresses[0];

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrFullName || !newAddrStreet || !newAddrCity || !newAddrPostal) return;

    const saved = addAddress({
      fullName: newAddrFullName,
      street: newAddrStreet,
      apartment: newAddrApartment,
      city: newAddrCity,
      state: newAddrState,
      postalCode: newAddrPostal,
      country: 'United States',
      phone: newAddrPhone || '+1 (555) 000-0000',
      isDefault: newAddrIsDefault,
      type: 'home',
    });

    setSelectedAddressId(saved.id);
    setIsAddingAddress(false);
    // Reset
    setNewAddrFullName('');
    setNewAddrStreet('');
    setNewAddrApartment('');
    setNewAddrCity('');
    setNewAddrPostal('');
  };

  const handlePlaceOrder = () => {
    if (!selectedAddress) {
      alert('Please select or add a shipping address.');
      return;
    }

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (err) {
      console.log('Confetti triggered');
    }

    createOrder({
      items: cart,
      shippingAddress: selectedAddress,
      paymentMethod,
      shippingFee,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => setActivePage('cart')}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-600 mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Shopping Cart</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Checkout & Payment</h1>
        </div>

        <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl font-semibold">
          <Lock className="w-3.5 h-3.5" />
          <span>SSL 256-Bit Encrypted</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Columns: Steps 1, 2, 3 */}
        <div className="lg:col-span-8 space-y-6">
          {/* Step 1: Shipping Address */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                  1
                </div>
                <h2 className="text-base font-extrabold text-slate-900">Shipping Address</h2>
              </div>

              {!isAddingAddress && (
                <button
                  onClick={() => setIsAddingAddress(true)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Address</span>
                </button>
              )}
            </div>

            {isAddingAddress ? (
              <form onSubmit={handleSaveAddress} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  New Delivery Address
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Alex Morgan"
                      value={newAddrFullName}
                      onChange={(e) => setNewAddrFullName(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 234-5678"
                      value={newAddrPhone}
                      onChange={(e) => setNewAddrPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Street Address</label>
                  <input
                    type="text"
                    required
                    placeholder="742 Evergreen Terrace"
                    value={newAddrStreet}
                    onChange={(e) => setNewAddrStreet(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">City</label>
                    <input
                      type="text"
                      required
                      placeholder="San Francisco"
                      value={newAddrCity}
                      onChange={(e) => setNewAddrCity(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">State</label>
                    <input
                      type="text"
                      required
                      placeholder="CA"
                      value={newAddrState}
                      onChange={(e) => setNewAddrState(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Zip Code</label>
                    <input
                      type="text"
                      required
                      placeholder="94107"
                      value={newAddrPostal}
                      onChange={(e) => setNewAddrPostal(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition"
                  >
                    Save Address & Use
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingAddress(false)}
                    className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs rounded-lg transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id)}
                    className={`p-4 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between ${
                      selectedAddressId === addr.id
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-900">{addr.fullName}</span>
                        {addr.isDefault && (
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-semibold">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 leading-snug">
                        {addr.street} {addr.apartment}
                      </p>
                      <p className="text-xs text-slate-600">
                        {addr.city}, {addr.state} {addr.postalCode}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">{addr.phone}</p>
                    </div>

                    <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-indigo-600 font-semibold">
                        {selectedAddressId === addr.id ? '✓ Deliver to this address' : 'Select address'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Step 2: Shipping Method */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                2
              </div>
              <h2 className="text-base font-extrabold text-slate-900">Delivery Method</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  id: 'standard',
                  title: 'Standard Ground',
                  eta: '3–5 Business Days',
                  cost: cartSubtotal >= freeShippingThreshold ? 0 : 9.99,
                },
                {
                  id: 'express',
                  title: 'Express Priority',
                  eta: '2 Business Days',
                  cost: 14.99,
                },
                {
                  id: 'overnight',
                  title: 'Next-Day Air',
                  eta: 'Next Business Day',
                  cost: 24.99,
                },
              ].map((method) => (
                <div
                  key={method.id}
                  onClick={() => setShippingMethod(method.id as any)}
                  className={`p-4 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between ${
                    shippingMethod === method.id
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900">{method.title}</span>
                      <span className="text-xs font-extrabold text-indigo-600">
                        {method.cost === 0 ? 'FREE' : `$${method.cost.toFixed(2)}`}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">{method.eta}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step 3: Payment Method */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                3
              </div>
              <h2 className="text-base font-extrabold text-slate-900">Payment Options</h2>
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'card', name: 'Credit / Debit Card', icon: CreditCard },
                { id: 'paypal', name: 'PayPal', icon: DollarSign },
                { id: 'apple_pay', name: 'Apple Pay', icon: CheckCircle2 },
                { id: 'cod', name: 'Cash on Delivery', icon: Truck },
              ].map((opt) => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setPaymentMethod(opt.id as any)}
                    className={`p-3 rounded-2xl border-2 transition text-left flex flex-col items-center justify-center gap-1.5 ${
                      paymentMethod === opt.id
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <Icon className="w-5 h-5 text-indigo-600" />
                    <span className="text-xs">{opt.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Card details view if credit card selected */}
            {paymentMethod === 'card' && (
              <div className="p-5 bg-slate-900 text-white rounded-2xl space-y-4 mt-4">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Demo Credit Card Simulator</span>
                  <span className="text-emerald-400 font-semibold">Test Mode Active</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">Expiry Date</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">CVC Code</label>
                    <input
                      type="text"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white font-mono"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Summary & Confirm */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-6">
          <h2 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3">
            Review & Place Order
          </h2>

          {/* Cart Item Preview List */}
          <div className="space-y-3 max-h-60 overflow-y-auto pr-1 divide-y divide-slate-100">
            {cart.map((item, idx) => (
              <div key={idx} className="pt-3 first:pt-0 flex items-center gap-3">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-12 h-12 rounded-lg object-cover bg-slate-50 border border-slate-100 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-slate-800 truncate">{item.product.name}</h4>
                  <div className="text-[11px] text-slate-400">
                    Qty: {item.quantity} {item.selectedColor ? `• ${item.selectedColor}` : ''}
                  </div>
                </div>
                <div className="text-xs font-bold text-slate-900">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          {/* Financial Breakdown */}
          <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-800">${cartSubtotal.toFixed(2)}</span>
            </div>

            {cartDiscount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount ({appliedCoupon?.code})</span>
                <span className="font-bold">-${cartDiscount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Shipping ({shippingMethod.toUpperCase()})</span>
              <span className="font-semibold text-slate-800">
                {shippingFee === 0 ? <span className="text-emerald-600">FREE</span> : `$${shippingFee.toFixed(2)}`}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Sales Tax (8%)</span>
              <span className="font-semibold text-slate-800">${tax.toFixed(2)}</span>
            </div>

            <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-extrabold text-slate-900">
              <span>Total To Pay</span>
              <span className="text-indigo-600 text-xl">${grandTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Place Order CTA */}
          <button
            onClick={handlePlaceOrder}
            className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-2"
          >
            <span>Confirm & Place Order (${grandTotal.toFixed(2)})</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Money-Back Guarantee • 30-Day Free Returns</span>
          </div>
        </div>
      </div>
    </div>
  );
};
