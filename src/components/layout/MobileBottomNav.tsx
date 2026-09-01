import React from 'react';
import { useShop } from '../../context/ShopContext';
import {
  Home,
  Compass,
  Heart,
  ShoppingBag,
  User,
  ShieldCheck,
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const {
    activePage,
    setActivePage,
    cartCount,
    setIsCartOpen,
    wishlist,
    currentUser,
    setIsAuthModalOpen,
    setAuthModalTab,
  } = useShop();

  const handleAccountClick = () => {
    if (currentUser) {
      setActivePage('profile');
    } else {
      setAuthModalTab('login');
      setIsAuthModalOpen(true);
    }
  };

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 py-1.5 px-2 safe-area-pb shadow-lg shadow-slate-900/10">
      <div className="flex items-center justify-around">
        {/* Home */}
        <button
          onClick={() => setActivePage('home')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl min-w-[56px] min-h-[44px] transition ${
            activePage === 'home'
              ? 'text-indigo-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Home className={`w-5 h-5 ${activePage === 'home' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
          <span className="text-[10px] mt-0.5">Home</span>
        </button>

        {/* Shop Catalog */}
        <button
          onClick={() => setActivePage('products')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl min-w-[56px] min-h-[44px] transition ${
            activePage === 'products'
              ? 'text-indigo-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Compass className={`w-5 h-5 ${activePage === 'products' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
          <span className="text-[10px] mt-0.5">Shop</span>
        </button>

        {/* Cart Trigger */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-3 rounded-xl min-w-[56px] min-h-[44px] relative transition text-slate-500 hover:text-slate-800"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 stroke-2" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-indigo-600 text-white font-extrabold text-[9px] w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5">Cart</span>
        </button>

        {/* Wishlist */}
        <button
          onClick={() => setActivePage('wishlist')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl min-w-[56px] min-h-[44px] relative transition ${
            activePage === 'wishlist'
              ? 'text-rose-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <Heart className={`w-5 h-5 ${activePage === 'wishlist' ? 'fill-rose-500 text-rose-500' : 'stroke-2'}`} />
            {wishlist.length > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                {wishlist.length}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5">Saved</span>
        </button>

        {/* Admin or Profile */}
        {currentUser?.role === 'admin' ? (
          <button
            onClick={() => setActivePage('admin')}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl min-w-[56px] min-h-[44px] transition ${
              activePage === 'admin'
                ? 'text-emerald-600 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className={`w-5 h-5 ${activePage === 'admin' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
            <span className="text-[10px] mt-0.5">Admin</span>
          </button>
        ) : (
          <button
            onClick={handleAccountClick}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl min-w-[56px] min-h-[44px] transition ${
              activePage === 'profile'
                ? 'text-indigo-600 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className={`w-5 h-5 ${activePage === 'profile' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
            <span className="text-[10px] mt-0.5">{currentUser ? 'Account' : 'Sign In'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
