import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { ProductCard } from './ProductCard';
import {
  Star,
  ShoppingBag,
  Heart,
  Truck,
  RotateCcw,
  ShieldCheck,
  Check,
  Plus,
  Minus,
  ArrowLeft,
  Share2,
  Sparkles,
  MessageSquare,
  Send,
  User,
} from 'lucide-react';
import { motion } from 'motion/react';

export const ProductDetailPage: React.FC = () => {
  const {
    products,
    selectedProductId,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setActivePage,
    navigateToCategory,
    reviews,
    addReview,
    currentUser,
    setIsAuthModalOpen,
  } = useShop();

  const product = products.find((p) => p.id === selectedProductId) || products[0];

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>(
    product?.colors?.[0]?.name || ''
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    product?.sizes?.[0] || ''
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'shipping' | 'reviews'>('overview');

  // New review form states
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Product Not Found</h2>
        <button
          onClick={() => setActivePage('products')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [product.image];
  const isSaved = isInWishlist(product.id);
  const productReviews = reviews.filter((r) => r.productId === product.id && r.status === 'approved');

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor || product.colors?.[0]?.name, selectedSize || product.sizes?.[0]);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedColor || product.colors?.[0]?.name, selectedSize || product.sizes?.[0]);
    setActivePage('checkout');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    if (!newTitle.trim() || !newComment.trim()) return;

    addReview({
      productId: product.id,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      rating: newRating,
      title: newTitle.trim(),
      comment: newComment.trim(),
      isVerifiedPurchase: true,
    });

    setNewTitle('');
    setNewComment('');
    setNewRating(5);
  };

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <button onClick={() => setActivePage('home')} className="hover:text-indigo-600">
          Home
        </button>
        <span>/</span>
        <button
          onClick={() => navigateToCategory(product.category)}
          className="hover:text-indigo-600 capitalize"
        >
          {product.category.replace('-', ' ')}
        </button>
        <span>/</span>
        <span className="text-slate-900 font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Product Hero Section (Gallery + Purchase Info) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-50 border border-slate-200/80 shadow-inner group">
            <img
              src={images[selectedImageIndex] || product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {product.discountPercentage && (
              <span className="absolute top-4 left-4 bg-rose-600 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-md">
                SAVE {product.discountPercentage}%
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition ${
                    selectedImageIndex === idx
                      ? 'border-indigo-600 ring-2 ring-indigo-600/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Information & Add to Cart */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div>
            {/* Brand & SKU */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                {product.brand}
              </span>
              <span className="text-xs text-slate-400 font-mono">SKU: {product.sku}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight mb-3">
              {product.name}
            </h1>

            {/* Rating Stars & Count */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating) ? 'fill-current' : 'text-slate-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-slate-800">{product.rating.toFixed(1)}</span>
              <span className="text-xs text-slate-400">•</span>
              <button
                onClick={() => {
                  setActiveTab('reviews');
                  const el = document.getElementById('product-tabs-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-xs text-indigo-600 hover:underline font-semibold"
              >
                {product.reviewCount} customer reviews
              </button>
            </div>

            {/* Price Box */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-6 flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-black text-slate-900">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-base text-slate-400 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
              <span
                className={`ml-auto text-xs px-2.5 py-1 rounded-full font-bold ${
                  product.stock > 0
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Currently Out of Stock'}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
              {product.detailedDescription || product.description}
            </p>

            {/* Color Swatches */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-5">
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  Select Color:{' '}
                  <span className="font-normal text-indigo-600">
                    {selectedColor || product.colors[0].name}
                  </span>
                </label>
                <div className="flex gap-2.5">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`w-9 h-9 rounded-full border-2 transition flex items-center justify-center ${
                        (selectedColor || product.colors![0].name) === c.name
                          ? 'border-indigo-600 ring-2 ring-indigo-600/30 scale-105'
                          : 'border-slate-300 hover:scale-105'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    >
                      {(selectedColor || product.colors![0].name) === c.name && (
                        <Check className="w-4 h-4 text-white drop-shadow" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  Select Size:{' '}
                  <span className="font-normal text-indigo-600">
                    {selectedSize || product.sizes[0]}
                  </span>
                </label>
                <div className="flex gap-2">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`px-4 py-2 text-xs rounded-xl border font-bold transition ${
                        (selectedSize || product.sizes![0]) === sz
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
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

          {/* Action Buttons */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Quantity Counter */}
              <div className="flex items-center justify-between border border-slate-200 rounded-xl bg-slate-50 p-1">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2.5 hover:bg-slate-200 text-slate-700 transition rounded-lg"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm font-extrabold text-slate-900 min-w-10 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock || 99, q + 1))}
                  className="p-2.5 hover:bg-slate-200 text-slate-700 transition rounded-lg"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1 py-3 px-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}</span>
              </button>

              {/* Buy Now */}
              <button
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="py-3 px-6 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition"
              >
                Buy Now
              </button>

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-3 rounded-xl border transition ${
                  isSaved
                    ? 'bg-rose-50 border-rose-200 text-rose-600'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
                title="Save to Wishlist"
              >
                <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Trust assurances */}
            <div className="grid grid-cols-3 gap-2 pt-4 text-center border-t border-slate-100 text-[11px] text-slate-500">
              <div className="flex flex-col items-center gap-1 p-2">
                <Truck className="w-4 h-4 text-indigo-600" />
                <span className="font-semibold text-slate-700">Free Fast Delivery</span>
                <span>On orders over $100</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-2 border-x border-slate-100">
                <RotateCcw className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold text-slate-700">30-Day Returns</span>
                <span>100% money back</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-2">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span className="font-semibold text-slate-700">2-Year Warranty</span>
                <span>Full manufacturer cover</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section: Overview, Specs, Shipping, Reviews */}
      <div id="product-tabs-section" className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
        <div className="flex border-b border-slate-200 gap-6 overflow-x-auto">
          {[
            { id: 'overview', label: 'Product Overview' },
            { id: 'specs', label: 'Technical Specifications' },
            { id: 'shipping', label: 'Shipping & Delivery' },
            { id: 'reviews', label: `Customer Reviews (${productReviews.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 text-xs sm:text-sm font-bold uppercase tracking-wider transition whitespace-nowrap border-b-2 ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="pt-6 space-y-6">
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
              {product.detailedDescription || product.description}
            </p>

            {product.features && product.features.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
                  Key Engineered Features
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Technical Specifications */}
        {activeTab === 'specs' && (
          <div className="pt-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
              Hardware & Build Specifications
            </h4>
            <div className="bg-slate-50 rounded-2xl border border-slate-200/80 overflow-hidden divide-y divide-slate-200/80">
              {Object.entries(product.specifications || {}).map(([key, value]) => (
                <div key={key} className="grid grid-cols-1 sm:grid-cols-3 p-3.5 text-xs">
                  <span className="font-semibold text-slate-600">{key}</span>
                  <span className="sm:col-span-2 text-slate-900 font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Shipping & Delivery */}
        {activeTab === 'shipping' && (
          <div className="pt-6 space-y-4 text-xs text-slate-600 leading-relaxed max-w-3xl">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Global Fulfillment & Dispatch
            </h4>
            <p>
              All orders are processed and packed in our climate-controlled fulfillment center within 24 business hours. You will receive an automated tracking link via email once your shipment departs.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="font-bold text-slate-900">Standard Shipping</p>
                <p className="text-indigo-600 font-semibold mt-1">FREE on $100+ (or $9.99)</p>
                <p className="text-slate-400 mt-1">3–5 business days</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="font-bold text-slate-900">Express Priority</p>
                <p className="text-indigo-600 font-semibold mt-1">$14.99</p>
                <p className="text-slate-400 mt-1">1–2 business days</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="font-bold text-slate-900">30-Day Returns</p>
                <p className="text-emerald-600 font-semibold mt-1">Pre-paid label included</p>
                <p className="text-slate-400 mt-1">Full refund to original payment</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Reviews & Rating Form */}
        {activeTab === 'reviews' && (
          <div className="pt-6 space-y-8">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Rating Summary Card */}
              <div className="w-full md:w-64 bg-slate-50 p-5 rounded-2xl border border-slate-200/80 text-center shrink-0">
                <p className="text-4xl font-extrabold text-slate-900">{product.rating.toFixed(1)}</p>
                <div className="flex justify-center text-amber-400 my-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating) ? 'fill-current' : 'text-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-slate-500">Based on {productReviews.length} reviews</p>
              </div>

              {/* Add Review Form */}
              <div className="flex-1 w-full bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-indigo-600" />
                  <span>Write a Customer Review</span>
                </h4>
                <form onSubmit={handleReviewSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Your Rating
                    </label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(null)}
                          onClick={() => setNewRating(star)}
                          className="p-1 text-amber-400 hover:scale-110 transition"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= (hoverRating || newRating) ? 'fill-current' : 'text-slate-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <input
                      type="text"
                      required
                      placeholder="Review Headline (e.g., Incredible build quality & acoustics!)"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
                    />
                  </div>

                  <div>
                    <textarea
                      required
                      rows={3}
                      placeholder="Share your detailed impressions with fellow buyers..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Verified Review</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              {productReviews.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-6">
                  No reviews yet. Be the first to share your thoughts on this product!
                </p>
              ) : (
                productReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
                          {rev.userName[0]}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">{rev.userName}</span>
                            {rev.isVerifiedPurchase && (
                              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.2 rounded-full">
                                Verified Purchase
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400">{rev.createdAt}</span>
                        </div>
                      </div>

                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating ? 'fill-current' : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <h5 className="text-xs font-bold text-slate-900">{rev.title}</h5>
                    <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-extrabold text-slate-900">You Might Also Like</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
