export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  detailedDescription?: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  category: string;
  brand: string;
  sku: string;
  stock: number;
  rating: number;
  reviewCount: number;
  image: string;
  images: string[];
  features: string[];
  specifications: Record<string, string>;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  colors?: { name: string; hex: string }[];
  sizes?: string[];
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  iconName: string;
  itemCount?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountPercentage: number;
  maxDiscount?: number;
  minPurchase: number;
  expiresAt: string;
  isActive: boolean;
  usageCount: number;
  description: string;
}

export interface Address {
  id: string;
  userId: string;
  fullName: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
  type: 'home' | 'work' | 'other';
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  shippingAddress: Address;
  subtotal: number;
  discount: number;
  appliedCoupon?: string;
  shippingFee: number;
  tax: number;
  total: number;
  paymentMethod: 'card' | 'paypal' | 'apple_pay' | 'cod';
  paymentStatus: 'paid' | 'pending' | 'refunded';
  status: OrderStatus;
  trackingNumber?: string;
  carrier?: string;
  timeline: {
    status: OrderStatus;
    title: string;
    timestamp: string;
    description: string;
  }[];
  createdAt: string;
  estimatedDelivery?: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
  helpfulCount: number;
  status: 'approved' | 'pending' | 'rejected';
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'admin';
  avatar?: string;
  phone?: string;
  createdAt: string;
}

export interface ProductFilters {
  category: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  inStockOnly: boolean;
  onSaleOnly: boolean;
  brand: string;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest' | 'bestseller';
  searchQuery: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  duration?: number;
}
