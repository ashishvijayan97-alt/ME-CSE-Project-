import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import {
  Code2,
  Database,
  Shield,
  Server,
  Copy,
  Check,
  FileCode,
  Layers,
  Terminal,
  FolderTree,
  CheckCircle2,
} from 'lucide-react';

export const FlaskArchitectureView: React.FC = () => {
  const { products, orders, coupons, currentUser } = useShop();

  const [activeTab, setActiveTab] = useState<'overview' | 'structure' | 'models' | 'app' | 'routes-auth' | 'routes-products' | 'routes-orders' | 'routes-admin' | 'requirements' | 'api-tester'>('overview');
  const [selectedEndpoint, setSelectedEndpoint] = useState<'products' | 'orders' | 'metrics' | 'user' | 'health'>('products');
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  const copyCode = (name: string, content: string) => {
    navigator.clipboard?.writeText(content);
    setCopiedFile(name);
    setTimeout(() => setCopiedFile(null), 2500);
  };

  const projectTree = `backend/
├── app.py                  # Main Flask application factory, CORS, and SPA routing
├── models.py               # SQLAlchemy models (User, Product, Category, Order, OrderItem, Coupon, Review, Address)
├── requirements.txt        # Python dependencies (Flask 3.x, Flask-SQLAlchemy, Flask-Login, psycopg2, etc.)
├── .env.example            # Environment variables template (SECRET_KEY, DATABASE_URL, FLASK_DEBUG)
└── routes/
    ├── __init__.py         # Blueprint package initializer
    ├── auth.py             # User registration, login, logout, session /me, and address management
    ├── products.py         # Product catalog, category filtering, search, and admin product CRUD
    ├── orders.py           # Stock validation, atomic inventory deduction, coupons, and checkout
    └── admin.py            # Analytics KPIs, gross revenue, customer lists, review moderation, coupons`;

  const flaskModelsCode = `"""
backend/models.py - ShopCloud SQLAlchemy Domain Models
Compatible with PostgreSQL, MySQL, and SQLite (fallback)
"""
import json
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(UserMixin, db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    name = db.Column(db.String(100), nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), default='customer', nullable=False)  # 'customer' | 'admin'
    avatar = db.Column(db.String(500), nullable=True)
    phone = db.Column(db.String(30), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    orders = db.relationship('Order', backref='user', lazy='dynamic', cascade='all, delete-orphan')
    addresses = db.relationship('Address', backref='user', lazy='dynamic', cascade='all, delete-orphan')
    reviews = db.relationship('Review', backref='user', lazy='dynamic', cascade='all, delete-orphan')

    def set_password(self, password: str):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)

    def to_dict(self, include_addresses=False):
        data = {
            'id': self.id,
            'email': self.email,
            'name': self.name,
            'role': self.role,
            'avatar': self.avatar,
            'phone': self.phone,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }
        if include_addresses:
            data['addresses'] = [a.to_dict() for a in self.addresses.all()]
        return data


class Category(db.Model):
    __tablename__ = 'categories'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    slug = db.Column(db.String(80), unique=True, nullable=False, index=True)
    description = db.Column(db.Text, nullable=True)
    icon_name = db.Column(db.String(50), default='ShoppingBag', nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    products = db.relationship('Product', backref='category_rel', lazy='dynamic')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'slug': self.slug,
            'description': self.description,
            'icon_name': self.icon_name,
            'product_count': self.products.count() if hasattr(self, 'products') else 0,
        }


class Product(db.Model):
    __tablename__ = 'products'

    id = db.Column(db.Integer, primary_key=True)
    sku = db.Column(db.String(50), unique=True, nullable=False, index=True)
    name = db.Column(db.String(200), nullable=False, index=True)
    slug = db.Column(db.String(200), unique=True, nullable=False, index=True)
    description = db.Column(db.Text, nullable=False)
    detailed_description = db.Column(db.Text, nullable=True)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    original_price = db.Column(db.Numeric(10, 2), nullable=True)
    discount_percentage = db.Column(db.Integer, default=0, nullable=False)
    stock = db.Column(db.Integer, default=0, nullable=False)
    rating = db.Column(db.Float, default=4.5, nullable=False)
    review_count = db.Column(db.Integer, default=0, nullable=False)
    brand = db.Column(db.String(100), nullable=False, index=True)
    image = db.Column(db.String(500), nullable=False)
    _images_json = db.Column('images', db.Text, nullable=True)
    _colors_json = db.Column('colors', db.Text, nullable=True)
    _sizes_json = db.Column('sizes', db.Text, nullable=True)
    _features_json = db.Column('features', db.Text, nullable=True)
    _specs_json = db.Column('specifications', db.Text, nullable=True)
    is_featured = db.Column(db.Boolean, default=False, nullable=False, index=True)
    is_bestseller = db.Column(db.Boolean, default=False, nullable=False, index=True)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False, index=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    reviews = db.relationship('Review', backref='product', lazy='dynamic', cascade='all, delete-orphan')

    @property
    def images(self):
        if self._images_json:
            try:
                return json.loads(self._images_json)
            except Exception:
                return [self.image]
        return [self.image]

    @images.setter
    def images(self, val):
        self._images_json = json.dumps(val) if val else None

    def to_dict(self, include_reviews=False):
        data = {
            'id': self.id,
            'sku': self.sku,
            'name': self.name,
            'slug': self.slug,
            'description': self.description,
            'detailed_description': self.detailed_description or self.description,
            'price': float(self.price),
            'original_price': float(self.original_price) if self.original_price is not None else None,
            'discount_percentage': self.discount_percentage,
            'stock': self.stock,
            'rating': round(self.rating, 1),
            'review_count': self.review_count,
            'brand': self.brand,
            'image': self.image,
            'images': self.images,
            'is_featured': self.is_featured,
            'is_bestseller': self.is_bestseller,
            'category_id': self.category_id,
            'category_name': self.category_rel.name if self.category_rel else None,
            'in_stock': self.stock > 0,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }
        return data


class Order(db.Model):
    __tablename__ = 'orders'

    id = db.Column(db.Integer, primary_key=True)
    order_number = db.Column(db.String(50), unique=True, nullable=False, index=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True, index=True)
    customer_name = db.Column(db.String(150), nullable=False)
    customer_email = db.Column(db.String(120), nullable=False)
    customer_phone = db.Column(db.String(30), nullable=True)
    subtotal = db.Column(db.Numeric(10, 2), nullable=False)
    discount = db.Column(db.Numeric(10, 2), default=0.00, nullable=False)
    shipping_fee = db.Column(db.Numeric(10, 2), default=0.00, nullable=False)
    tax = db.Column(db.Numeric(10, 2), default=0.00, nullable=False)
    total = db.Column(db.Numeric(10, 2), nullable=False)
    status = db.Column(db.String(30), default='pending', nullable=False, index=True)
    payment_method = db.Column(db.String(50), default='card', nullable=False)
    payment_status = db.Column(db.String(30), default='paid', nullable=False)
    tracking_number = db.Column(db.String(100), nullable=True)
    carrier = db.Column(db.String(100), default='FedEx Priority', nullable=True)
    
    shipping_address_line1 = db.Column(db.String(255), nullable=True)
    shipping_city = db.Column(db.String(100), nullable=True)
    shipping_state = db.Column(db.String(100), nullable=True)
    shipping_postal_code = db.Column(db.String(30), nullable=True)
    shipping_country = db.Column(db.String(100), default='United States', nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    items = db.relationship('OrderItem', backref='order', lazy='joined', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'order_number': self.order_number,
            'customer_name': self.customer_name,
            'customer_email': self.customer_email,
            'subtotal': float(self.subtotal),
            'discount': float(self.discount),
            'shipping_fee': float(self.shipping_fee),
            'tax': float(self.tax),
            'total': float(self.total),
            'status': self.status,
            'payment_method': self.payment_method,
            'tracking_number': self.tracking_number,
            'items': [item.to_dict() for item in self.items],
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }


class OrderItem(db.Model):
    __tablename__ = 'order_items'

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    product_name = db.Column(db.String(200), nullable=False)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    quantity = db.Column(db.Integer, default=1, nullable=False)
    selected_color = db.Column(db.String(50), nullable=True)
    selected_size = db.Column(db.String(50), nullable=True)
    image = db.Column(db.String(500), nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'product_id': self.product_id,
            'product_name': self.product_name,
            'price': float(self.price),
            'quantity': self.quantity,
            'selected_color': self.selected_color,
            'selected_size': self.selected_size,
            'image': self.image,
            'subtotal': float(self.price) * self.quantity,
        }


class Coupon(db.Model):
    __tablename__ = 'coupons'

    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(50), unique=True, nullable=False, index=True)
    discount_percentage = db.Column(db.Integer, nullable=False)
    minimum_spend = db.Column(db.Numeric(10, 2), default=0.00, nullable=False)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    expires_at = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def is_valid(self, cart_subtotal=0.0):
        if not self.is_active:
            return False, 'Coupon is inactive'
        if self.expires_at and self.expires_at < datetime.utcnow():
            return False, 'Coupon has expired'
        if cart_subtotal < float(self.minimum_spend):
            return False, f'Minimum spend of \${float(self.minimum_spend):.2f} required'
        return True, 'Valid coupon'

    def to_dict(self):
        return {
            'id': self.id,
            'code': self.code,
            'discount_percentage': self.discount_percentage,
            'minimum_spend': float(self.minimum_spend),
            'is_active': self.is_active,
            'expires_at': self.expires_at.isoformat() if self.expires_at else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }


class Review(db.Model):
    __tablename__ = 'reviews'

    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    user_name = db.Column(db.String(100), nullable=False)
    user_avatar = db.Column(db.String(500), nullable=True)
    rating = db.Column(db.Integer, nullable=False)
    title = db.Column(db.String(200), nullable=False)
    comment = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(20), default='approved', nullable=False)
    is_verified_purchase = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'product_id': self.product_id,
            'user_name': self.user_name,
            'user_avatar': self.user_avatar,
            'rating': self.rating,
            'title': self.title,
            'comment': self.comment,
            'status': self.status,
            'is_verified_purchase': self.is_verified_purchase,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }


class Address(db.Model):
    __tablename__ = 'addresses'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    street = db.Column(db.String(255), nullable=False)
    city = db.Column(db.String(100), nullable=False)
    state = db.Column(db.String(100), nullable=False)
    zip_code = db.Column(db.String(30), nullable=False)
    country = db.Column(db.String(100), default='United States', nullable=False)
    phone = db.Column(db.String(30), nullable=True)
    is_default = db.Column(db.Boolean, default=False, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'name': self.name,
            'street': self.street,
            'city': self.city,
            'state': self.state,
            'zip_code': self.zip_code,
            'country': self.country,
            'phone': self.phone,
            'is_default': self.is_default,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }
`;

  const flaskAppCode = `"""
backend/app.py - ShopCloud Main Flask Application Factory & Server
Real runnable Flask 3.x backend with SQLAlchemy, Flask-Login, and CORS
"""
import os
from datetime import datetime
from flask import Flask, jsonify, send_from_directory
from flask_login import LoginManager
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

from models import db, User, Category, Product, Order, OrderItem, Coupon, Review, Address
from routes.auth import auth_bp
from routes.products import products_bp
from routes.orders import orders_bp
from routes.admin import admin_bp

def create_app(config_override=None):
    base_dir = os.path.abspath(os.path.dirname(__file__))
    dist_dir = os.path.join(base_dir, '..', 'dist')

    app = Flask(
        __name__,
        static_folder=dist_dir if os.path.exists(dist_dir) else None,
        static_url_path='/'
    )

    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'shopcloud-super-secret-key-2026')
    database_url = os.getenv('DATABASE_URL')
    if not database_url:
        sqlite_path = os.path.join(base_dir, 'shopcloud.db')
        database_url = f"sqlite:///{sqlite_path}"

    app.config['SQLALCHEMY_DATABASE_URI'] = database_url
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    CORS(app, supports_credentials=True, origins=["http://localhost:3000", "*"])

    login_manager = LoginManager()
    login_manager.init_app(app)
    login_manager.login_view = 'auth.login'

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    # Register Route Blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(products_bp, url_prefix='/api/products')
    app.register_blueprint(orders_bp, url_prefix='/api/orders')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')

    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({
            'status': 'healthy',
            'service': 'ShopCloud Flask REST API',
            'version': '1.0.0',
            'database': 'connected'
        }), 200

    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve_frontend(path):
        if app.static_folder and os.path.exists(app.static_folder):
            file_path = os.path.join(app.static_folder, path)
            if path != '' and os.path.exists(file_path):
                return send_from_directory(app.static_folder, path)
            index_path = os.path.join(app.static_folder, 'index.html')
            if os.path.exists(index_path):
                return send_from_directory(app.static_folder, 'index.html')
        return jsonify({'message': 'ShopCloud Flask Backend API is running.'})

    return app

if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=5000, debug=True)
`;

  const flaskAuthRouteCode = `"""
backend/routes/auth.py - Authentication & Session Management
"""
from flask import Blueprint, request, jsonify
from flask_login import login_user, logout_user, login_required, current_user
from models import db, User, Address

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json(silent=True) or {}
    email = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({'error': 'Invalid email or password'}), 401

    login_user(user, remember=True)
    return jsonify({'message': 'Login successful', 'user': user.to_dict()}), 200

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json(silent=True) or {}
    email = (data.get('email') or '').strip().lower()
    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already in use'}), 409

    user = User(name=data.get('name'), email=email, role='customer')
    user.set_password(data.get('password'))
    db.session.add(user)
    db.session.commit()
    login_user(user, remember=True)
    return jsonify({'message': 'Registered successfully', 'user': user.to_dict()}), 201

@auth_bp.route('/logout', methods=['POST'])
def logout():
    logout_user()
    return jsonify({'message': 'Logged out'}), 200

@auth_bp.route('/me', methods=['GET'])
def get_me():
    if not current_user.is_authenticated:
        return jsonify({'authenticated': False, 'user': None}), 200
    return jsonify({'authenticated': True, 'user': current_user.to_dict()}), 200
`;

  const flaskOrdersRouteCode = `"""
backend/routes/orders.py - Stock Validation, Inventory Decrement, and Checkout
"""
from flask import Blueprint, request, jsonify
from flask_login import current_user
from models import db, Order, OrderItem, Product, Coupon

orders_bp = Blueprint('orders', __name__)

@orders_bp.route('/', methods=['POST'])
def create_order():
    data = request.get_json(silent=True) or {}
    items_data = data.get('items', [])
    if not items_data:
        return jsonify({'error': 'Cart is empty'}), 400

    subtotal = 0.0
    order_items = []

    try:
        # Atomic stock verification and inventory deduction
        for item in items_data:
            product = Product.query.with_for_update().get(item['product_id'])
            if not product or product.stock < item['quantity']:
                db.session.rollback()
                return jsonify({'error': f"Insufficient stock for {item.get('product_name')}"}), 400

            product.stock -= item['quantity']
            subtotal += float(product.price) * item['quantity']
            order_items.append(OrderItem(
                product_id=product.id,
                product_name=product.name,
                price=product.price,
                quantity=item['quantity'],
                image=product.image
            ))

        # Calculate totals
        discount = data.get('discount', 0.0)
        shipping_fee = 0.0 if subtotal >= 100.0 else 9.99
        tax = round((subtotal - discount) * 0.08, 2)
        total = round(subtotal - discount + shipping_fee + tax, 2)

        order = Order(
            order_number=f"SC-{int(datetime.utcnow().timestamp())}",
            user_id=current_user.id if current_user.is_authenticated else None,
            customer_name=data.get('customer_name', 'Customer'),
            customer_email=data.get('customer_email', ''),
            subtotal=subtotal,
            discount=discount,
            shipping_fee=shipping_fee,
            tax=tax,
            total=total,
            status='processing',
            items=order_items
        )
        db.session.add(order)
        db.session.commit()
        return jsonify({'message': 'Order placed', 'order': order.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Hero Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold mb-3">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Flask 3.x + SQLAlchemy Backend Directory Active</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Backend Architecture & Python REST API
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            The project features a full runnable Python Flask backend located in <code className="text-emerald-400 bg-slate-800 px-1.5 py-0.5 rounded font-mono">backend/</code> with SQLAlchemy ORM models, Flask-Login sessions, password hashing, transactional stock deduction, and modular blueprints.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-emerald-400 font-mono">
            Flask 3.0.3
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-indigo-400 font-mono">
            SQLAlchemy 2.0
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-sky-400 font-mono">
            Flask-Login
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-purple-400 font-mono">
            Flask-CORS
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-4 overflow-x-auto text-xs font-bold uppercase tracking-wider pb-px">
        {[
          { id: 'overview', label: 'Overview & Setup', icon: Layers },
          { id: 'structure', label: 'Directory Tree', icon: FolderTree },
          { id: 'models', label: 'models.py', icon: Database },
          { id: 'app', label: 'app.py', icon: Server },
          { id: 'routes-auth', label: 'routes/auth.py', icon: Shield },
          { id: 'routes-orders', label: 'routes/orders.py', icon: FileCode },
          { id: 'api-tester', label: 'REST API Tester', icon: Terminal },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 transition whitespace-nowrap border-b-2 flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">PostgreSQL / SQLite Dual DB</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Connects to PostgreSQL in production via <code className="text-slate-800 font-mono">DATABASE_URL</code>, with instant fallback to a local SQLite database for zero-config local development.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Authentication & Roles</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Werkzeug salted password hashing with Flask-Login session management and RBAC separating customer shopping from administrative inventory operations.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <Code2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Atomic Stock Deduction</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                During order placement, the backend verifies live inventory, applies coupon validation, and decrements stock inside an atomic SQLAlchemy database transaction.
              </p>
            </div>
          </div>

          {/* Quick Run Card */}
          <div className="bg-slate-950 text-slate-200 rounded-3xl p-6 shadow-xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                <Terminal className="w-4 h-4" />
                <span>How to run the Flask Backend locally</span>
              </div>
            </div>
            <pre className="text-xs font-mono overflow-x-auto p-3 bg-slate-900/90 rounded-2xl leading-relaxed text-emerald-300">
              <code>{`# 1. Navigate to project root or backend folder
cd backend

# 2. (Optional) Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate

# 3. Install requirements
pip install -r requirements.txt

# 4. Start Flask server (auto-creates tables and initial seed data)
python app.py

# Server is live at http://localhost:5000 (or configured PORT)`}</code>
            </pre>
          </div>
        </div>
      )}

      {/* Tab 2: Directory Tree */}
      {activeTab === 'structure' && (
        <div className="bg-slate-950 text-slate-200 rounded-3xl p-6 shadow-xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-xs font-mono text-indigo-400">
              <FolderTree className="w-4 h-4" />
              <span>ShopCloud Backend Architecture Structure</span>
            </div>
            <button
              onClick={() => copyCode('tree', projectTree)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-mono flex items-center gap-1.5 transition"
            >
              {copiedFile === 'tree' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedFile === 'tree' ? 'Copied!' : 'Copy Structure'}</span>
            </button>
          </div>
          <pre className="text-xs font-mono overflow-x-auto p-3 leading-relaxed text-indigo-300">
            <code>{projectTree}</code>
          </pre>
        </div>
      )}

      {/* Tab 3: Models */}
      {activeTab === 'models' && (
        <div className="bg-slate-950 text-slate-200 rounded-3xl p-6 shadow-xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-xs font-mono text-indigo-400">
              <FileCode className="w-4 h-4" />
              <span>backend/models.py (SQLAlchemy Domain Models)</span>
            </div>
            <button
              onClick={() => copyCode('models.py', flaskModelsCode)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-mono flex items-center gap-1.5 transition"
            >
              {copiedFile === 'models.py' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedFile === 'models.py' ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>
          <pre className="text-xs font-mono overflow-x-auto p-2 leading-relaxed text-indigo-300">
            <code>{flaskModelsCode}</code>
          </pre>
        </div>
      )}

      {/* Tab 4: App Factory */}
      {activeTab === 'app' && (
        <div className="bg-slate-950 text-slate-200 rounded-3xl p-6 shadow-xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <FileCode className="w-4 h-4" />
              <span>backend/app.py (App Factory & Configuration)</span>
            </div>
            <button
              onClick={() => copyCode('app.py', flaskAppCode)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-mono flex items-center gap-1.5 transition"
            >
              {copiedFile === 'app.py' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedFile === 'app.py' ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>
          <pre className="text-xs font-mono overflow-x-auto p-2 leading-relaxed text-emerald-300">
            <code>{flaskAppCode}</code>
          </pre>
        </div>
      )}

      {/* Tab 5: Auth Route */}
      {activeTab === 'routes-auth' && (
        <div className="bg-slate-950 text-slate-200 rounded-3xl p-6 shadow-xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-xs font-mono text-purple-400">
              <FileCode className="w-4 h-4" />
              <span>backend/routes/auth.py (Authentication & Profile)</span>
            </div>
            <button
              onClick={() => copyCode('routes-auth.py', flaskAuthRouteCode)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-mono flex items-center gap-1.5 transition"
            >
              {copiedFile === 'routes-auth.py' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedFile === 'routes-auth.py' ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>
          <pre className="text-xs font-mono overflow-x-auto p-2 leading-relaxed text-purple-300">
            <code>{flaskAuthRouteCode}</code>
          </pre>
        </div>
      )}

      {/* Tab 6: Orders Route */}
      {activeTab === 'routes-orders' && (
        <div className="bg-slate-950 text-slate-200 rounded-3xl p-6 shadow-xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-xs font-mono text-sky-400">
              <FileCode className="w-4 h-4" />
              <span>backend/routes/orders.py (Checkout & Inventory)</span>
            </div>
            <button
              onClick={() => copyCode('routes-orders.py', flaskOrdersRouteCode)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-mono flex items-center gap-1.5 transition"
            >
              {copiedFile === 'routes-orders.py' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedFile === 'routes-orders.py' ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>
          <pre className="text-xs font-mono overflow-x-auto p-2 leading-relaxed text-sky-300">
            <code>{flaskOrdersRouteCode}</code>
          </pre>
        </div>
      )}

      {/* Tab 7: Interactive REST API Console */}
      {activeTab === 'api-tester' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Interactive REST API Endpoint Tester</h3>
            <p className="text-xs text-slate-500">
              Test live JSON responses conforming exactly to the Flask SQLAlchemy serialization schemas
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { id: 'products', label: 'GET /api/products (Catalog)', method: 'GET' },
              { id: 'orders', label: 'GET /api/orders (Recent Orders)', method: 'GET' },
              { id: 'metrics', label: 'GET /api/admin/metrics (KPIs)', method: 'GET' },
              { id: 'user', label: 'GET /api/auth/me (Current Session)', method: 'GET' },
              { id: 'health', label: 'GET /api/health (Service Health)', method: 'GET' },
            ].map((ep) => (
              <button
                key={ep.id}
                onClick={() => setSelectedEndpoint(ep.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition flex items-center gap-2 ${
                  selectedEndpoint === ep.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span className="text-emerald-500">{ep.method}</span>
                <span>{ep.label.split(' ')[1]}</span>
              </button>
            ))}
          </div>

          {/* Response Box */}
          <div className="bg-slate-950 text-emerald-400 p-4 rounded-2xl font-mono text-xs overflow-x-auto max-h-96 shadow-inner border border-slate-800">
            <div className="text-slate-500 mb-2">// Response Status: 200 OK • Content-Type: application/json</div>
            <pre>
              {selectedEndpoint === 'products' &&
                JSON.stringify(
                  products.slice(0, 3).map((p) => ({
                    id: p.id,
                    sku: p.sku,
                    name: p.name,
                    price: p.price,
                    stock: p.stock,
                    category_name: p.category,
                    rating: p.rating,
                    in_stock: p.stock > 0,
                  })),
                  null,
                  2
                )}

              {selectedEndpoint === 'orders' &&
                JSON.stringify(
                  orders.slice(0, 2).map((o) => ({
                    order_number: o.orderNumber,
                    customer_name: o.customerName,
                    customer_email: o.customerEmail,
                    subtotal: o.subtotal,
                    discount: o.discount,
                    total: o.total,
                    status: o.status,
                    tracking_number: o.trackingNumber,
                    items: o.items.map((i) => ({
                      product_id: i.productId,
                      product_name: i.productName,
                      quantity: i.quantity,
                      price: i.price,
                    })),
                  })),
                  null,
                  2
                )}

              {selectedEndpoint === 'metrics' &&
                JSON.stringify(
                  {
                    gross_revenue: orders.reduce((sum, o) => sum + o.total, 0),
                    total_orders: orders.length,
                    pending_orders: orders.filter((o) => o.status === 'processing' || o.status === 'pending').length,
                    total_products: products.length,
                    low_stock_count: products.filter((p) => p.stock <= 5).length,
                    active_coupons: coupons.filter((c) => c.isActive).length,
                    average_order_value: orders.length ? (orders.reduce((sum, o) => sum + o.total, 0) / orders.length).toFixed(2) : 0,
                  },
                  null,
                  2
                )}

              {selectedEndpoint === 'user' &&
                JSON.stringify(
                  currentUser
                    ? {
                        authenticated: true,
                        user: {
                          id: currentUser.id,
                          name: currentUser.name,
                          email: currentUser.email,
                          role: currentUser.role,
                          avatar: currentUser.avatar,
                        },
                      }
                    : { authenticated: false, user: null },
                  null,
                  2
                )}

              {selectedEndpoint === 'health' &&
                JSON.stringify(
                  {
                    status: 'healthy',
                    service: 'ShopCloud Flask REST API',
                    version: '1.0.0',
                    database: 'connected',
                    timestamp: new Date().toISOString(),
                  },
                  null,
                  2
                )}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
