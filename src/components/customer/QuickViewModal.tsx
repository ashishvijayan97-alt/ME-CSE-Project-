import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import {
  X,
  Star,
  ShoppingBag,
  Heart,
  Check,
  Truck,
  Shield,
  Eye,
  Plus,
  Minus,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const QuickViewModal: React.FC = () => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    toggleWishlist,
    isInWishlist,
    navigateToProduct,
  } = useShop();

  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');

  if (!quickViewProduct) return null;

  const images =
    quickViewProduct.images && quickViewProduct.images.length > 0
      ? quickViewProduct.images
      : [quickViewProduct.image];

  const handleAddToCart = () => {
    addToCart(
      quickViewProduct,
      quantity,
      selectedColor || (quickViewProduct.colors?.[0]?.name),
      selectedSize || (quickViewProduct.sizes?.[0])
    );
    setQuickViewProduct(null);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col md:flex-row"
        >
          {/* Close button */}
          <button
            onClick={() => setQuickViewProduct(null)}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-100/80 hover:bg-slate-200 text-slate-600 transition"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Left: Images */}
          <div className="md:w-1/2 bg-slate-50 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-200">
            <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-white border border-slate-200/80 mb-3 shadow-inner">
              <img
                src={images[selectedImageIndex] || quickViewProduct.image}
                alt={quickViewProduct.name}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
              {quickViewProduct.discountPercentage && (
                <span className="absolute top-3 left-3 bg-rose-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                  Save {quickViewProduct.discountPercentage}%
                </span>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 w-full justify-center">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition ${
                      selectedImageIndex === idx ? 'border-indigo-600 ring-2 ring-indigo-600/20' : 'border-slate-200'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Details & Purchase */}
          <div className="md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  {quickViewProduct.brand}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">SKU: {quickViewProduct.sku}</span>
              </div>

              <h3 className="text-base md:text-lg font-bold text-slate-900 leading-snug mb-2">
                {quickViewProduct.name}
              </h3>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.floor(quickViewProduct.rating) ? 'fill-current' : 'text-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-slate-700">
                  {quickViewProduct.rating.toFixed(1)}
                </span>
                <span className="text-xs text-slate-400">
                  ({quickViewProduct.reviewCount} customer reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2.5 mb-4">
                <span className="text-2xl font-bold text-slate-900">
                  ${quickViewProduct.price.toFixed(2)}
                </span>
                {quickViewProduct.originalPrice && (
                  <span className="text-sm text-slate-400 line-through">
                    ${quickViewProduct.originalPrice.toFixed(2)}
                  </span>
                )}
                <span
                  className={`text-xs px-2 py-0.5 rounded font-medium ${
                    quickViewProduct.stock > 0
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  {quickViewProduct.stock > 0 ? `In Stock (${quickViewProduct.stock})` : 'Sold Out'}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3">
                {quickViewProduct.description}
              </p>

              {/* Color Selector if available */}
              {quickViewProduct.colors && quickViewProduct.colors.length > 0 && (
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Color:{' '}
                    <span className="font-normal text-slate-500">
                      {selectedColor || quickViewProduct.colors[0].name}
                    </span>
                  </label>
                  <div className="flex gap-2">
                    {quickViewProduct.colors.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColor(c.name)}
                        className={`w-7 h-7 rounded-full border-2 transition flex items-center justify-center ${
                          (selectedColor || quickViewProduct.colors![0].name) === c.name
                            ? 'border-indigo-600 ring-2 ring-indigo-600/30'
                            : 'border-slate-300'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      >
                        {(selectedColor || quickViewProduct.colors![0].name) === c.name && (
                          <Check className="w-3.5 h-3.5 text-white drop-shadow" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size selector if available */}
              {quickViewProduct.sizes && quickViewProduct.sizes.length > 0 && (
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Size:{' '}
                    <span className="font-normal text-slate-500">
                      {selectedSize || quickViewProduct.sizes[0]}
                    </span>
                  </label>
                  <div className="flex gap-2">
                    {quickViewProduct.sizes.map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`px-3 py-1 text-xs rounded-md border font-medium transition ${
                          (selectedSize || quickViewProduct.sizes![0]) === sz
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quantity & Actions */}
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-slate-300 rounded-lg bg-slate-50">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2 hover:bg-slate-200 text-slate-600 transition rounded-l-lg"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-bold text-slate-900 min-w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(quickViewProduct.stock || 99, q + 1))}
                    className="p-2 hover:bg-slate-200 text-slate-600 transition rounded-r-lg"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={quickViewProduct.stock <= 0}
                  className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-semibold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{quickViewProduct.stock > 0 ? 'Add to Shopping Cart' : 'Out of Stock'}</span>
                </button>

                <button
                  onClick={() => toggleWishlist(quickViewProduct.id)}
                  className={`p-2.5 rounded-xl border transition ${
                    isInWishlist(quickViewProduct.id)
                      ? 'bg-rose-50 border-rose-200 text-rose-600'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                  title="Toggle wishlist"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isInWishlist(quickViewProduct.id) ? 'fill-current' : ''
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <button
                  onClick={() => {
                    const id = quickViewProduct.id;
                    setQuickViewProduct(null);
                    navigateToProduct(id);
                  }}
                  className="text-indigo-600 font-semibold hover:underline flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Full Product Specifications & Reviews</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
