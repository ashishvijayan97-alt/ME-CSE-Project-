import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  Product,
  Category,
  CartItem,
  Coupon,
  Address,
  Order,
  OrderStatus,
  Review,
  User,
  ProductFilters,
  ToastMessage,
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_COUPONS,
  DEMO_USERS,
  INITIAL_ADDRESSES,
  INITIAL_REVIEWS,
  INITIAL_ORDERS,
} from '../data/initialData';

export type PageView =
  | 'home'
  | 'products'
  | 'product-detail'
  | 'cart'
  | 'checkout'
  | 'order-success'
  | 'order-history'
  | 'profile'
  | 'wishlist'
  | 'admin'
  | 'flask-code';

interface ShopContextType {
  // Navigation & Page State
  activePage: PageView;
  setActivePage: (page: PageView) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  selectedOrderId: string | null;
  setSelectedOrderId: (id: string | null) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  navigateToProduct: (productId: string) => void;
  navigateToCategory: (categorySlug: string) => void;
  navigateToOrder: (orderId: string) => void;

  // Products & Categories
  products: Product[];
  categories: Category[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  editProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateStock: (id: string, newStock: number) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  editCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedColor?: string, selectedSize?: string) => void;
  removeFromCart: (productId: string, selectedColor?: string, selectedSize?: string) => void;
  updateCartQuantity: (productId: string, quantity: number, selectedColor?: string, selectedSize?: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  cartCount: number;
  cartSubtotal: number;
  cartDiscount: number;
  cartShippingFee: number;
  cartTax: number;
  cartTotal: number;
  freeShippingThreshold: number;

  // Coupons
  coupons: Coupon[];
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  addCoupon: (coupon: Omit<Coupon, 'id' | 'usageCount'>) => void;
  deleteCoupon: (id: string) => void;
  toggleCouponActive: (id: string) => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  moveToCartFromWishlist: (product: Product) => void;

  // User & Auth
  currentUser: User | null;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalTab: 'login' | 'register';
  setAuthModalTab: (tab: 'login' | 'register') => void;
  login: (email: string, role?: 'customer' | 'admin') => boolean;
  register: (name: string, email: string, role?: 'customer' | 'admin') => boolean;
  logout: () => void;
  switchDemoRole: (role: 'customer' | 'admin') => void;

  // Addresses
  addresses: Address[];
  addAddress: (address: Omit<Address, 'id' | 'userId'>) => Address;
  editAddress: (id: string, updates: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;

  // Orders
  orders: Order[];
  createOrder: (orderData: {
    items: CartItem[];
    shippingAddress: Address;
    paymentMethod: 'card' | 'paypal' | 'apple_pay' | 'cod';
    shippingFee: number;
  }) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;
  getOrderById: (orderId: string) => Order | undefined;

  // Reviews
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'createdAt' | 'helpfulCount' | 'status'>) => void;
  approveReview: (reviewId: string) => void;
  deleteReview: (reviewId: string) => void;
  getProductReviews: (productId: string) => Review[];

  // Filters & Search
  filters: ProductFilters;
  setFilters: React.Dispatch<React.SetStateAction<ProductFilters>>;
  resetFilters: () => void;
  filteredProducts: Product[];

  // Toasts
  toasts: ToastMessage[];
  addToast: (type: 'success' | 'error' | 'info' | 'warning', title: string, message: string) => void;
  removeToast: (id: string) => void;

  // Admin stats
  adminStats: {
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    totalCustomers: number;
    lowStockCount: number;
    pendingOrdersCount: number;
  };
}

const defaultFilters: ProductFilters = {
  category: 'all',
  minPrice: 0,
  maxPrice: 2000,
  minRating: 0,
  inStockOnly: false,
  onSaleOnly: false,
  brand: 'all',
  sortBy: 'featured',
  searchQuery: '',
};

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Navigation
  const [activePage, setActivePage] = useState<PageView>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');

  // Persistence with localStorage fallback
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('shopcloud_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('shopcloud_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('shopcloud_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('shopcloud_wishlist');
    return saved ? JSON.parse(saved) : ['prod-1', 'prod-3'];
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('shopcloud_user');
    return saved ? JSON.parse(saved) : DEMO_USERS[0];
  });

  const [addresses, setAddresses] = useState<Address[]>(() => {
    const saved = localStorage.getItem('shopcloud_addresses');
    return saved ? JSON.parse(saved) : INITIAL_ADDRESSES;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('shopcloud_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('shopcloud_coupons');
    return saved ? JSON.parse(saved) : INITIAL_COUPONS;
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('shopcloud_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [filters, setFilters] = useState<ProductFilters>(defaultFilters);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('shopcloud_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('shopcloud_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('shopcloud_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('shopcloud_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('shopcloud_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('shopcloud_addresses', JSON.stringify(addresses));
  }, [addresses]);

  useEffect(() => {
    localStorage.setItem('shopcloud_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('shopcloud_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('shopcloud_reviews', JSON.stringify(reviews));
  }, [reviews]);

  // Toast Helper
  const addToast = (type: 'success' | 'error' | 'info' | 'warning', title: string, message: string) => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, type, title, message, duration: 4000 }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Navigation helpers
  const navigateToProduct = (productId: string) => {
    setSelectedProductId(productId);
    setActivePage('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToCategory = (categorySlug: string) => {
    setFilters((prev) => ({ ...prev, category: categorySlug, searchQuery: '' }));
    setActivePage('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    setActivePage('order-history');
  };

  // Cart operations
  const addToCart = (
    product: Product,
    quantity = 1,
    selectedColor?: string,
    selectedSize?: string
  ) => {
    if (product.stock <= 0) {
      addToast('error', 'Out of Stock', 'This product is currently out of stock.');
      return;
    }

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedColor === selectedColor &&
          item.selectedSize === selectedSize
      );

      if (existingIndex > -1) {
        const newCart = [...prevCart];
        const newQty = Math.min(newCart[existingIndex].quantity + quantity, product.stock);
        newCart[existingIndex] = { ...newCart[existingIndex], quantity: newQty };
        return newCart;
      } else {
        return [
          ...prevCart,
          {
            product,
            quantity: Math.min(quantity, product.stock),
            selectedColor: selectedColor || (product.colors && product.colors[0]?.name),
            selectedSize: selectedSize || (product.sizes && product.sizes[0]),
          },
        ];
      }
    });

    addToast('success', 'Added to Cart', `${product.name} (x${quantity}) was added to your cart.`);
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, selectedColor?: string, selectedSize?: string) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.selectedColor === selectedColor &&
            item.selectedSize === selectedSize
          )
      )
    );
    addToast('info', 'Item Removed', 'Item was removed from your cart.');
  };

  const updateCartQuantity = (
    productId: string,
    quantity: number,
    selectedColor?: string,
    selectedSize?: string
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedColor, selectedSize);
      return;
    }

    setCart((prev) =>
      prev.map((item) => {
        if (
          item.product.id === productId &&
          item.selectedColor === selectedColor &&
          item.selectedSize === selectedSize
        ) {
          const maxStock = item.product.stock || 99;
          return { ...item, quantity: Math.min(quantity, maxStock) };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const cartCount = useMemo(() => cart.reduce((acc, item) => acc + item.quantity, 0), [cart]);

  const cartSubtotal = useMemo(
    () => cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0),
    [cart]
  );

  const freeShippingThreshold = 100;

  const cartShippingFee = useMemo(() => {
    if (cartSubtotal === 0) return 0;
    return cartSubtotal >= freeShippingThreshold ? 0 : 9.99;
  }, [cartSubtotal]);

  const cartDiscount = useMemo(() => {
    if (!appliedCoupon || cartSubtotal < appliedCoupon.minPurchase) return 0;
    let disc = (cartSubtotal * appliedCoupon.discountPercentage) / 100;
    if (appliedCoupon.maxDiscount && disc > appliedCoupon.maxDiscount) {
      disc = appliedCoupon.maxDiscount;
    }
    return disc;
  }, [appliedCoupon, cartSubtotal]);

  const cartTax = useMemo(() => {
    const taxable = Math.max(0, cartSubtotal - cartDiscount);
    return Math.round(taxable * 0.08 * 100) / 100; // 8% sales tax
  }, [cartSubtotal, cartDiscount]);

  const cartTotal = useMemo(() => {
    if (cartSubtotal === 0) return 0;
    return Math.max(0, cartSubtotal - cartDiscount + cartShippingFee + cartTax);
  }, [cartSubtotal, cartDiscount, cartShippingFee, cartTax]);

  // Coupon actions
  const applyCoupon = (code: string): boolean => {
    const coupon = coupons.find(
      (c) => c.code.toUpperCase() === code.trim().toUpperCase() && c.isActive
    );

    if (!coupon) {
      addToast('error', 'Invalid Coupon', 'Coupon code is not valid or expired.');
      return false;
    }

    if (cartSubtotal < coupon.minPurchase) {
      addToast(
        'warning',
        'Minimum Spend Required',
        `This coupon requires a minimum purchase of $${coupon.minPurchase.toFixed(2)}.`
      );
      return false;
    }

    setAppliedCoupon(coupon);
    addToast(
      'success',
      'Coupon Applied!',
      `You saved ${coupon.discountPercentage}% with code "${coupon.code}".`
    );
    return true;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    addToast('info', 'Coupon Removed', 'Discount coupon has been removed.');
  };

  const addCoupon = (couponData: Omit<Coupon, 'id' | 'usageCount'>) => {
    const newCoupon: Coupon = {
      ...couponData,
      id: `coup-${Date.now()}`,
      usageCount: 0,
    };
    setCoupons((prev) => [newCoupon, ...prev]);
    addToast('success', 'Coupon Created', `Coupon code "${newCoupon.code}" is now active.`);
  };

  const deleteCoupon = (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    if (appliedCoupon?.id === id) setAppliedCoupon(null);
    addToast('info', 'Coupon Deleted', 'Coupon code was removed.');
  };

  const toggleCouponActive = (id: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
  };

  // Wishlist
  const toggleWishlist = (productId: string) => {
    const exists = wishlist.includes(productId);
    const product = products.find((p) => p.id === productId);
    if (exists) {
      setWishlist((prev) => prev.filter((id) => id !== productId));
      addToast('info', 'Removed from Wishlist', `${product?.name || 'Product'} removed from your wishlist.`);
    } else {
      setWishlist((prev) => [...prev, productId]);
      addToast('success', 'Saved to Wishlist', `${product?.name || 'Product'} added to your wishlist.`);
    }
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const moveToCartFromWishlist = (product: Product) => {
    addToCart(product, 1);
    setWishlist((prev) => prev.filter((id) => id !== product.id));
  };

  // User Auth & Switcher
  const login = (email: string, role: 'customer' | 'admin' = 'customer'): boolean => {
    const existing = DEMO_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      setCurrentUser(existing);
    } else {
      const newUser: User = {
        id: `usr-${Date.now()}`,
        email,
        name: email.split('@')[0].replace('.', ' '),
        role,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setCurrentUser(newUser);
    }
    setIsAuthModalOpen(false);
    addToast('success', 'Welcome back!', `Logged in as ${email}`);
    return true;
  };

  const register = (name: string, email: string, role: 'customer' | 'admin' = 'customer'): boolean => {
    const newUser: User = {
      id: `usr-${Date.now()}`,
      email,
      name,
      role,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCurrentUser(newUser);
    setIsAuthModalOpen(false);
    addToast('success', 'Account Created', `Welcome to ShopCloud, ${name}!`);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setActivePage('home');
    addToast('info', 'Logged Out', 'You have been safely signed out.');
  };

  const switchDemoRole = (role: 'customer' | 'admin') => {
    if (role === 'admin') {
      setCurrentUser(DEMO_USERS[1]);
      setActivePage('admin');
      addToast('info', 'Admin Portal', 'Switched to Admin Account (Sarah Chen).');
    } else {
      setCurrentUser(DEMO_USERS[0]);
      setActivePage('home');
      addToast('info', 'Customer Storefront', 'Switched to Customer Account (Alex Morgan).');
    }
  };

  // Addresses
  const addAddress = (addressData: Omit<Address, 'id' | 'userId'>): Address => {
    const newAddress: Address = {
      ...addressData,
      id: `addr-${Date.now()}`,
      userId: currentUser?.id || 'guest',
    };
    if (newAddress.isDefault) {
      setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: false })));
    }
    setAddresses((prev) => [newAddress, ...prev]);
    addToast('success', 'Address Saved', 'New delivery address was added.');
    return newAddress;
  };

  const editAddress = (id: string, updates: Partial<Address>) => {
    setAddresses((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          return { ...a, ...updates };
        }
        if (updates.isDefault) {
          return { ...a, isDefault: false };
        }
        return a;
      })
    );
    addToast('success', 'Address Updated', 'Your delivery address was updated.');
  };

  const deleteAddress = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    addToast('info', 'Address Removed', 'Delivery address was deleted.');
  };

  const setDefaultAddress = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
    );
  };

  // Orders
  const createOrder = (orderData: {
    items: CartItem[];
    shippingAddress: Address;
    paymentMethod: 'card' | 'paypal' | 'apple_pay' | 'cod';
    shippingFee: number;
  }): Order => {
    const orderNum = `SC-${Math.floor(10000 + Math.random() * 90000)}`;
    const subtotal = orderData.items.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );
    let discount = 0;
    if (appliedCoupon && subtotal >= appliedCoupon.minPurchase) {
      discount = (subtotal * appliedCoupon.discountPercentage) / 100;
      if (appliedCoupon.maxDiscount && discount > appliedCoupon.maxDiscount) {
        discount = appliedCoupon.maxDiscount;
      }
    }
    const tax = Math.round(Math.max(0, subtotal - discount) * 0.08 * 100) / 100;
    const total = Math.max(0, subtotal - discount + orderData.shippingFee + tax);

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      userId: currentUser?.id || 'guest',
      customerName: currentUser?.name || orderData.shippingAddress.fullName,
      customerEmail: currentUser?.email || 'customer@example.com',
      items: orderData.items.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        productImage: item.product.image,
        price: item.product.price,
        quantity: item.quantity,
        selectedColor: item.selectedColor,
        selectedSize: item.selectedSize,
      })),
      shippingAddress: orderData.shippingAddress,
      subtotal,
      discount,
      appliedCoupon: appliedCoupon?.code,
      shippingFee: orderData.shippingFee,
      tax,
      total,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: 'paid',
      status: 'pending',
      trackingNumber: `TRK-${Math.floor(100000000 + Math.random() * 900000000)}US`,
      carrier: 'FedEx Express Ground',
      timeline: [
        {
          status: 'pending',
          title: 'Order Placed',
          timestamp: new Date().toLocaleString(),
          description: `Order successfully confirmed via ${orderData.paymentMethod.toUpperCase()}.`,
        },
      ],
      createdAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
    };

    // Deduct stock for ordered items
    setProducts((prev) =>
      prev.map((p) => {
        const item = orderData.items.find((it) => it.product.id === p.id);
        if (item) {
          return { ...p, stock: Math.max(0, p.stock - item.quantity) };
        }
        return p;
      })
    );

    // Update coupon usage count
    if (appliedCoupon) {
      setCoupons((prev) =>
        prev.map((c) =>
          c.id === appliedCoupon.id ? { ...c, usageCount: c.usageCount + 1 } : c
        )
      );
    }

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setSelectedOrderId(newOrder.id);
    setActivePage('order-success');
    addToast('success', 'Order Confirmed!', `Order ${newOrder.orderNumber} has been placed successfully.`);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, note?: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const statusTitles: Record<OrderStatus, string> = {
            pending: 'Order Pending',
            processing: 'Processing & Packaging',
            shipped: 'Shipped with Carrier',
            delivered: 'Delivered',
            cancelled: 'Order Cancelled',
          };
          const newTimelineItem = {
            status,
            title: statusTitles[status],
            timestamp: new Date().toLocaleString(),
            description: note || `Order status updated to ${status}.`,
          };
          return {
            ...ord,
            status,
            timeline: [...ord.timeline, newTimelineItem],
          };
        }
        return ord;
      })
    );
    addToast('info', 'Order Status Updated', `Order status changed to ${status}.`);
  };

  const getOrderById = (orderId: string) => orders.find((o) => o.id === orderId);

  // Products CRUD (Admin)
  const addProduct = (productData: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      images: productData.images && productData.images.length > 0 ? productData.images : [productData.image],
    };
    setProducts((prev) => [newProduct, ...prev]);
    addToast('success', 'Product Added', `"${newProduct.name}" was added to catalog.`);
  };

  const editProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    addToast('success', 'Product Updated', 'Product changes saved successfully.');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    addToast('info', 'Product Deleted', 'Product removed from catalog.');
  };

  const updateStock = (id: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stock: Math.max(0, newStock) } : p))
    );
    addToast('info', 'Inventory Adjusted', `Stock quantity updated to ${newStock}.`);
  };

  // Categories CRUD (Admin)
  const addCategory = (catData: Omit<Category, 'id'>) => {
    const newCat: Category = {
      ...catData,
      id: `cat-${Date.now()}`,
    };
    setCategories((prev) => [...prev, newCat]);
    addToast('success', 'Category Created', `Category "${newCat.name}" added.`);
  };

  const editCategory = (id: string, updates: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
    addToast('success', 'Category Updated', 'Category changes saved.');
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    addToast('info', 'Category Deleted', 'Category removed.');
  };

  // Reviews
  const addReview = (reviewData: Omit<Review, 'id' | 'createdAt' | 'helpfulCount' | 'status'>) => {
    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      helpfulCount: 0,
      status: 'approved',
    };
    setReviews((prev) => [newReview, ...prev]);

    // Recalculate product rating
    const prodReviews = [...reviews.filter((r) => r.productId === reviewData.productId), newReview];
    const avgRating = prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;
    setProducts((prev) =>
      prev.map((p) =>
        p.id === reviewData.productId
          ? {
              ...p,
              rating: Math.round(avgRating * 10) / 10,
              reviewCount: prodReviews.length,
            }
          : p
      )
    );

    addToast('success', 'Review Submitted', 'Thank you for sharing your feedback!');
  };

  const approveReview = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, status: 'approved' } : r))
    );
  };

  const deleteReview = (reviewId: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    addToast('info', 'Review Deleted', 'Review has been removed.');
  };

  const getProductReviews = (productId: string) => {
    return reviews.filter((r) => r.productId === productId);
  };

  // Filters & Search Logic
  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Search query
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const matchName = product.name.toLowerCase().includes(query);
        const matchDesc = product.description.toLowerCase().includes(query);
        const matchBrand = product.brand.toLowerCase().includes(query);
        const matchCat = product.category.toLowerCase().includes(query);
        if (!matchName && !matchDesc && !matchBrand && !matchCat) return false;
      }

      // Category
      if (filters.category !== 'all' && product.category !== filters.category) {
        return false;
      }

      // Price range
      if (product.price < filters.minPrice || product.price > filters.maxPrice) {
        return false;
      }

      // Rating
      if (filters.minRating > 0 && product.rating < filters.minRating) {
        return false;
      }

      // In stock
      if (filters.inStockOnly && product.stock <= 0) {
        return false;
      }

      // On sale
      if (filters.onSaleOnly && (!product.discountPercentage || product.discountPercentage <= 0)) {
        return false;
      }

      // Brand
      if (filters.brand !== 'all' && product.brand !== filters.brand) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'bestseller':
          return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
        case 'featured':
        default:
          return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      }
    });
  }, [products, filters]);

  // Admin stats calculation
  const adminStats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, ord) => sum + (ord.status !== 'cancelled' ? ord.total : 0), 0);
    const totalOrders = orders.length;
    const totalProducts = products.length;
    const totalCustomers = DEMO_USERS.length + 12; // Base customers
    const lowStockCount = products.filter((p) => p.stock < 15).length;
    const pendingOrdersCount = orders.filter((o) => o.status === 'pending' || o.status === 'processing').length;

    return {
      totalRevenue,
      totalOrders,
      totalProducts,
      totalCustomers,
      lowStockCount,
      pendingOrdersCount,
    };
  }, [orders, products]);

  return (
    <ShopContext.Provider
      value={{
        activePage,
        setActivePage,
        selectedProductId,
        setSelectedProductId,
        selectedOrderId,
        setSelectedOrderId,
        quickViewProduct,
        setQuickViewProduct,
        navigateToProduct,
        navigateToCategory,
        navigateToOrder,
        products,
        categories,
        addProduct,
        editProduct,
        deleteProduct,
        updateStock,
        addCategory,
        editCategory,
        deleteCategory,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        cartCount,
        cartSubtotal,
        cartDiscount,
        cartShippingFee,
        cartTax,
        cartTotal,
        freeShippingThreshold,
        coupons,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        addCoupon,
        deleteCoupon,
        toggleCouponActive,
        wishlist,
        toggleWishlist,
        isInWishlist,
        moveToCartFromWishlist,
        currentUser,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalTab,
        setAuthModalTab,
        login,
        register,
        logout,
        switchDemoRole,
        addresses,
        addAddress,
        editAddress,
        deleteAddress,
        setDefaultAddress,
        orders,
        createOrder,
        updateOrderStatus,
        getOrderById,
        reviews,
        addReview,
        approveReview,
        deleteReview,
        getProductReviews,
        filters,
        setFilters,
        resetFilters,
        filteredProducts,
        toasts,
        addToast,
        removeToast,
        adminStats,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
