import React from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './components/customer/HomePage';
import { ProductListingPage } from './components/customer/ProductListingPage';
import { ProductDetailPage } from './components/customer/ProductDetailPage';
import { CartPage } from './components/customer/CartPage';
import { CheckoutPage } from './components/customer/CheckoutPage';
import { OrderSuccessPage } from './components/customer/OrderSuccessPage';
import { OrderHistoryPage } from './components/customer/OrderHistoryPage';
import { WishlistPage } from './components/customer/WishlistPage';
import { UserProfilePage } from './components/customer/UserProfilePage';
import { AdminPortal } from './components/admin/AdminPortal';
import { FlaskArchitectureView } from './components/flask/FlaskArchitectureView';
import { CartDrawer } from './components/customer/CartDrawer';
import { AuthModal } from './components/customer/AuthModal';
import { QuickViewModal } from './components/customer/QuickViewModal';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { ToastContainer } from './components/common/Toast';
import { motion, AnimatePresence } from 'motion/react';

const MainContent: React.FC = () => {
  const { activePage } = useShop();

  return (
    <main className="flex-1 pb-16 md:pb-0">
      <AnimatePresence mode="wait">
        <motion.div
          key={activePage}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
        >
          {activePage === 'home' && <HomePage />}
          {activePage === 'products' && <ProductListingPage />}
          {activePage === 'product-detail' && <ProductDetailPage />}
          {activePage === 'cart' && <CartPage />}
          {activePage === 'checkout' && <CheckoutPage />}
          {activePage === 'order-success' && <OrderSuccessPage />}
          {activePage === 'order-history' && <OrderHistoryPage />}
          {activePage === 'wishlist' && <WishlistPage />}
          {activePage === 'profile' && <UserProfilePage />}
          {activePage === 'admin' && <AdminPortal />}
          {activePage === 'flask-code' && <FlaskArchitectureView />}
        </motion.div>
      </AnimatePresence>
    </main>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
        <Navbar />
        <MainContent />
        <Footer />
        <MobileBottomNav />

        {/* Global Overlays & Modals */}
        <CartDrawer />
        <AuthModal />
        <QuickViewModal />
        <ToastContainer />
      </div>
    </ShopProvider>
  );
}
