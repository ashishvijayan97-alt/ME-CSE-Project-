import React from 'react';
import { useShop } from '../../context/ShopContext';
import {
  Heart,
  ShoppingBag,
  Trash2,
  ArrowRight,
  Sparkles,
  Star,
} from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const {
    wishlist,
    products,
    moveToCartFromWishlist,
    removeFromWishlist,
    setActivePage,
    navigateToProduct,
    addToCart,
    addToast,
  } = useShop();

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  const handleAddAllToCart = () => {
    if (wishlistProducts.length === 0) return;
    wishlistProducts.forEach((p) => {
      addToCart(p, 1, p.colors?.[0]?.name, p.sizes?.[0]);
    });
    addToast('success', 'All Items Added to Cart', `${wishlistProducts.length} items moved to your shopping bag.`);
  };

  if (wishlistProducts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto shadow-inner">
          <Heart className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900">Your Wishlist is Empty</h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          Keep track of items you love. Click the heart icon on any product to save it here for later.
        </p>
        <button
          onClick={() => setActivePage('products')}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition"
        >
          Explore Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">My Saved Wishlist</h1>
          <p className="text-xs text-slate-500 mt-1">
            {wishlistProducts.length} saved item{wishlistProducts.length === 1 ? '' : 's'} ready for your bag
          </p>
        </div>

        <button
          onClick={handleAddAllToCart}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2 self-start"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Move All to Cart</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlistProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-3xl border border-slate-200/80 p-4 shadow-xs hover:shadow-md transition flex flex-col justify-between group"
          >
            <div>
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 mb-3">
                <img
                  src={product.image}
                  alt={product.name}
                  onClick={() => navigateToProduct(product.id)}
                  className="w-full h-full object-cover cursor-pointer group-hover:scale-105 transition-transform duration-500"
                />
                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 hover:bg-rose-50 text-slate-400 hover:text-rose-600 shadow-md backdrop-blur-xs transition"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600">
                {product.brand}
              </span>
              <h3
                onClick={() => navigateToProduct(product.id)}
                className="text-xs font-bold text-slate-900 hover:text-indigo-600 cursor-pointer line-clamp-2 mt-0.5"
              >
                {product.name}
              </h3>

              <div className="flex items-center gap-1 my-2 text-xs">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < Math.floor(product.rating) ? 'fill-current' : 'text-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-slate-500 font-semibold">({product.rating.toFixed(1)})</span>
              </div>

              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-base font-black text-slate-900">${product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <span className="text-xs text-slate-400 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => moveToCartFromWishlist(product.id)}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Move to Cart</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
