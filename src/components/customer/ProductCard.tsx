import React from 'react';
import { Product } from '../../types';
import { useShop } from '../../context/ShopContext';
import { Star, ShoppingBag, Heart, Eye, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  layout?: 'grid' | 'list';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, layout = 'grid' }) => {
  const {
    navigateToProduct,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setQuickViewProduct,
  } = useShop();

  const isSaved = isInWishlist(product.id);

  if (layout === 'list') {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs hover:shadow-md transition flex flex-col sm:flex-row gap-5 group">
        <div className="relative w-full sm:w-48 aspect-square rounded-xl overflow-hidden bg-slate-50 shrink-0">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {product.discountPercentage && (
            <span className="absolute top-2.5 left-2.5 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
              -{product.discountPercentage}% OFF
            </span>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition ${
              isSaved
                ? 'bg-rose-500 text-white shadow-xs'
                : 'bg-white/90 text-slate-600 hover:text-rose-600 hover:bg-white'
            }`}
            title="Save to wishlist"
          >
            <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider">
                {product.brand}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-[11px] text-slate-500 capitalize">{product.category.replace('-', ' ')}</span>
            </div>

            <h3
              onClick={() => navigateToProduct(product.id)}
              className="text-base font-bold text-slate-900 hover:text-indigo-600 cursor-pointer transition mb-1.5"
            >
              {product.name}
            </h3>

            <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
              {product.description}
            </p>

            <div className="flex items-center gap-2 mb-3">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.floor(product.rating) ? 'fill-current' : 'text-slate-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-slate-700">{product.rating.toFixed(1)}</span>
              <span className="text-xs text-slate-400">({product.reviewCount})</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-slate-900">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-xs text-slate-400 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold">
                {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuickViewProduct(product)}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Quick View</span>
              </button>
              <button
                onClick={() => addToCart(product, 1)}
                disabled={product.stock <= 0}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white text-xs font-semibold rounded-lg shadow-xs transition flex items-center gap-1.5"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{product.stock > 0 ? 'Add to Cart' : 'Sold Out'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col group h-full">
      {/* Image Container */}
      <div
        onClick={() => navigateToProduct(product.id)}
        className="relative aspect-square bg-slate-50 overflow-hidden cursor-pointer"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.discountPercentage && (
            <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
              -{product.discountPercentage}%
            </span>
          )}
          {product.isNewArrival && (
            <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
              New
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
              Top Rated
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition z-10 ${
            isSaved
              ? 'bg-rose-500 text-white shadow-xs'
              : 'bg-white/90 text-slate-600 hover:text-rose-600 hover:bg-white shadow-xs'
          }`}
          title="Save to wishlist"
        >
          <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Button on Hover */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setQuickViewProduct(product);
            }}
            className="w-full py-2 bg-slate-900/90 backdrop-blur-md hover:bg-slate-900 text-white text-xs font-semibold rounded-xl shadow-lg transition flex items-center justify-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
            <span className="font-semibold text-indigo-600 uppercase tracking-wider">{product.brand}</span>
            <span className="capitalize">{product.category.replace('-', ' ')}</span>
          </div>

          <h3
            onClick={() => navigateToProduct(product.id)}
            className="text-sm font-bold text-slate-900 hover:text-indigo-600 cursor-pointer transition line-clamp-2 leading-snug mb-2"
          >
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-3">
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
            <span className="text-xs font-bold text-slate-700">{product.rating.toFixed(1)}</span>
            <span className="text-[11px] text-slate-400">({product.reviewCount})</span>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-slate-900">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-xs text-slate-400 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <div className="text-[10px] text-emerald-600 font-medium">
              {product.stock > 0 ? `Stock: ${product.stock}` : 'Out of Stock'}
            </div>
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            disabled={product.stock <= 0}
            className="p-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white disabled:text-slate-400 rounded-xl transition shadow-xs hover:shadow-md shrink-0"
            title={product.stock > 0 ? 'Add to Cart' : 'Out of stock'}
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
