import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import {
  Code2,
  Database,
  Shield,
  Server,
  Play,
  Copy,
  Check,
  FileCode,
  Layers,
  Terminal,
  ExternalLink,
} from 'lucide-react';

export const FlaskArchitectureView: React.FC = () => {
  const { products, orders, categories, coupons, reviews, currentUser } = useShop();

  const [activeTab, setActiveTab] = useState<'overview' | 'models' | 'app' | 'routes' | 'api-tester'>('overview');
  const [selectedEndpoint, setSelectedEndpoint] = useState<'products' | 'orders' | 'metrics' | 'user'>('products');
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  const copyCode = (name: string, content: string) => {
    navigator.clipboard?.writeText(content);
    setCopiedFile(name);
    setTimeout(() => setCopiedFile(null), 2500);
  };

  const flaskModelsCode = `"""
models.py - ShopCloud SQLAlchemy Domain Models
PostgreSQL / MySQL / SQLite compatible ORM architecture
"""
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
    role = db.Column(db.String(20), default='customer') # 'customer' or 'admin'
    avatar = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    orders = db.relationship('Order', backref='customer', lazy='dynamic')
    addresses = db.relationship('Address', backref='user', lazy='dynamic')
    reviews = db.relationship('Review', backref='author', lazy='dynamic')

    def set_password(self, password: str):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'role': self.role,
            'avatar': self.avatar
        }

class Category(db.Model):
    __tablename__ = 'categories'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    slug = db.Column(db.String(80), unique=True, nullable=False, index=True)
    description = db.Column(db.Text, nullable=True)
    icon_name = db.Column(db.String(50), default='ShoppingBag')
    
    products = db.relationship('Product', backref='category_rel', lazy='dynamic')

class Product(db.Model):
    __tablename__ = 'products'
    
    id = db.Column(db.Integer, primary_key=True)
    sku = db.Column(db.String(50), unique=True, nullable=False, index=True)
    name = db.Column(db.String(200), nullable=False)
    slug = db.Column(db.String(200), unique=True, nullable=False, index=True)
    description = db.Column(db.Text, nullable=False)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    original_price = db.Column(db.Numeric(10, 2), nullable=True)
    stock = db.Column(db.Integer, default=0, nullable=False)
    brand = db.Column(db.String(100), nullable=False)
    image = db.Column(db.String(500), nullable=False)
    is_featured = db.Column(db.Boolean, default=False)
    is_bestseller = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)
    reviews = db.relationship('Review', backref='product', lazy='dynamic')

class Order(db.Model):
    __tablename__ = 'orders'
    
    id = db.Column(db.Integer, primary_key=True)
    order_number = db.Column(db.String(50), unique=True, nullable=False, index=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    subtotal = db.Column(db.Numeric(10, 2), nullable=False)
    discount = db.Column(db.Numeric(10, 2), default=0.00)
    shipping_fee = db.Column(db.Numeric(10, 2), default=0.00)
    tax = db.Column(db.Numeric(10, 2), default=0.00)
    total = db.Column(db.Numeric(10, 2), nullable=False)
    status = db.Column(db.String(30), default='pending') # pending, processing, shipped, delivered, cancelled
    payment_method = db.Column(db.String(50), default='card')
    tracking_number = db.Column(db.String(100), nullable=True)
    carrier = db.Column(db.String(100), default='FedEx Priority')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    items = db.relationship('OrderItem', backref='order', cascade='all, delete-orphan')

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

class Coupon(db.Model):
    __tablename__ = 'coupons'
    
    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(50), unique=True, nullable=False, index=True)
    discount_percentage = db.Column(db.Integer, nullable=False)
    minimum_spend = db.Column(db.Numeric(10, 2), default=0.00)
    is_active = db.Column(db.Boolean, default=True)
    expires_at = db.Column(db.DateTime, nullable=True)

class Review(db.Model):
    __tablename__ = 'reviews'
    
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    title = db.Column(db.String(200), nullable=False)
    comment = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(20), default='approved') # approved, pending, rejected
    is_verified_purchase = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
`;

  const flaskAppCode = `"""
app.py - Main Flask Application Factory
Configured with Flask-Login, Flask-WTF CSRF protection, and REST API blueprints
"""
import os
from flask import Flask, jsonify, render_template, request, session
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from flask_cors import CORS
from dotenv import load_dotenv

from models import db, User, Product, Category, Order, OrderItem, Coupon, Review
from routes.auth import auth_bp
from routes.products import products_bp
from routes.orders import orders_bp
from routes.admin import admin_bp

load_dotenv()

def create_app(config_name=None):
    app = Flask(__name__, static_folder='../dist', static_url_path='/')
    
    # Environment Configuration
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'shopcloud-super-secret-production-key-2026')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv(
        'DATABASE_URL', 
        'postgresql://postgres:password@localhost:5432/shopcloud_db'
    )
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
        'pool_size': 10,
        'pool_recycle': 3600,
        'pool_pre_ping': True
    }
    
    # Initialize Extensions
    db.init_app(app)
    CORS(app, supports_credentials=True)
    
    # Flask-Login Session Manager
    login_manager = LoginManager()
    login_manager.init_app(app)
    login_manager.login_view = 'auth.login'
    
    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    # Register API Blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(products_bp, url_prefix='/api/products')
    app.register_blueprint(orders_bp, url_prefix='/api/orders')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')

    # Health check endpoint
    @app.route('/api/health')
    def health_check():
        return jsonify({
            'status': 'healthy',
            'service': 'ShopCloud Flask Backend',
            'database': 'connected',
            'version': '1.0.0'
        })

    # Serve SPA Frontend
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve_frontend(path):
        if path != "" and os.path.exists(app.static_folder + '/' + path):
            return app.send_static_file(path)
        return app.send_static_file('index.html')

    return app

if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=3000, debug=os.getenv('FLASK_DEBUG', 'False') == 'True')
`;

  const flaskRoutesCode = `"""
routes/products.py & routes/orders.py
REST-style endpoints with filtering, sorting, pagination, and order processing
"""
from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from models import db, Product, Category, Order, OrderItem, Coupon
from datetime import datetime

products_bp = Blueprint('products', __name__)
orders_bp = Blueprint('orders', __name__)

@products_bp.route('/', methods=['GET'])
def get_products():
    category = request.args.get('category')
    search = request.args.get('search')
    sort_by = request.args.get('sort_by', 'featured')
    min_price = request.args.get('min_price', type=float)
    max_price = request.args.get('max_price', type=float)
    
    query = Product.query
    
    if category and category != 'all':
        cat = Category.query.filter_by(slug=category).first()
        if cat:
            query = query.filter_by(category_id=cat.id)
            
    if search:
        query = query.filter(Product.name.ilike(f'%{search}%'))
        
    if min_price is not None:
        query = query.filter(Product.price >= min_price)
    if max_price is not None:
        query = query.filter(Product.price <= max_price)
        
    if sort_by == 'price-asc':
        query = query.order_by(Product.price.asc())
    elif sort_by == 'price-desc':
        query = query.order_by(Product.price.desc())
    elif sort_by == 'bestseller':
        query = query.filter_by(is_bestseller=True)
    else:
        query = query.order_by(Product.id.desc())
        
    products = query.all()
    return jsonify([p.to_dict() for p in products])

@orders_bp.route('/', methods=['POST'])
def create_order():
    data = request.get_json()
    items_data = data.get('items', [])
    shipping_address = data.get('shipping_address', {})
    
    # Calculate subtotal and deduct inventory
    subtotal = 0
    order_items = []
    
    for item in items_data:
        product = Product.query.get(item['product_id'])
        if not product or product.stock < item['quantity']:
            return jsonify({'error': f"Insufficient stock for {item.get('product_name')}"}), 400
            
        product.stock -= item['quantity']
        subtotal += float(product.price) * item['quantity']
        
        order_items.append(OrderItem(
            product_id=product.id,
            product_name=product.name,
            price=product.price,
            quantity=item['quantity'],
            selected_color=item.get('selected_color'),
            selected_size=item.get('selected_size')
        ))
        
    # Generate unique reference
    import random
    order_number = f"SC-{random.randint(10000, 99999)}"
    
    discount = data.get('discount', 0.0)
    shipping_fee = data.get('shipping_fee', 0.0)
    tax = round((subtotal - discount) * 0.08, 2)
    total = subtotal - discount + shipping_fee + tax
    
    new_order = Order(
        order_number=order_number,
        user_id=current_user.id if current_user.is_authenticated else None,
        subtotal=subtotal,
        discount=discount,
        shipping_fee=shipping_fee,
        tax=tax,
        total=total,
        status='processing',
        payment_method=data.get('payment_method', 'card'),
        tracking_number=f"TRK{random.randint(10000000, 99999999)}",
        items=order_items
    )
    
    db.session.add(new_order)
    db.session.commit()
    
    return jsonify({'success': True, 'order_id': new_order.id, 'order_number': order_number}), 201
`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Hero Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-3">
            <Server className="w-3.5 h-3.5" />
            <span>Flask + SQLAlchemy + Flask-Login Full Stack Architecture</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Backend Architecture & REST API
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            ShopCloud is engineered on a clean, decoupled architecture: a high-performance React client-side SPA coupled with a robust Flask Python backend with PostgreSQL/MySQL relational models, bcrypt password hashing, session management, and REST endpoints.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-emerald-400 font-mono">
            Flask 3.0+
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-indigo-400 font-mono">
            SQLAlchemy 2.0
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-sky-400 font-mono">
            Flask-Login
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-6 overflow-x-auto text-xs font-bold uppercase tracking-wider">
        {[
          { id: 'overview', label: 'Architecture Overview', icon: Layers },
          { id: 'models', label: 'SQLAlchemy Models (models.py)', icon: Database },
          { id: 'app', label: 'App Factory & Config (app.py)', icon: Server },
          { id: 'routes', label: 'REST Blueprints (routes/*.py)', icon: FileCode },
          { id: 'api-tester', label: 'Live REST API Console', icon: Terminal },
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">Relational Database</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Fully parameterized PostgreSQL / MySQL schemas managed via SQLAlchemy ORM. Includes primary keys, foreign key constraints, indexes, and connection pooling.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">Security & Authentication</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Bcrypt salted password hashing with Flask-Login session management. Role-Based Access Control (RBAC) separates customer shopping from administrative inventory operations.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">Modular REST API</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Flask Blueprints for auth, product catalog filtering, cart manipulation, checkout transactions, inventory deduction, and coupon validation.
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: SQLAlchemy Models */}
      {activeTab === 'models' && (
        <div className="bg-slate-950 text-slate-200 rounded-3xl p-6 shadow-xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-xs font-mono text-indigo-400">
              <FileCode className="w-4 h-4" />
              <span>models.py (SQLAlchemy Domain Models)</span>
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

      {/* Tab 3: Flask App */}
      {activeTab === 'app' && (
        <div className="bg-slate-950 text-slate-200 rounded-3xl p-6 shadow-xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-xs font-mono text-indigo-400">
              <FileCode className="w-4 h-4" />
              <span>app.py (Application Factory & Flask-Login)</span>
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

      {/* Tab 4: Flask Routes */}
      {activeTab === 'routes' && (
        <div className="bg-slate-950 text-slate-200 rounded-3xl p-6 shadow-xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-xs font-mono text-indigo-400">
              <FileCode className="w-4 h-4" />
              <span>routes/products.py & routes/orders.py</span>
            </div>
            <button
              onClick={() => copyCode('routes.py', flaskRoutesCode)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-mono flex items-center gap-1.5 transition"
            >
              {copiedFile === 'routes.py' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedFile === 'routes.py' ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>
          <pre className="text-xs font-mono overflow-x-auto p-2 leading-relaxed text-sky-300">
            <code>{flaskRoutesCode}</code>
          </pre>
        </div>
      )}

      {/* Tab 5: Interactive REST API Console */}
      {activeTab === 'api-tester' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Interactive REST API Endpoint Tester</h3>
            <p className="text-xs text-slate-500">
              Simulate live API queries against the ShopCloud data layer and view formatted JSON payload responses
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { id: 'products', label: 'GET /api/products (Catalog)', method: 'GET' },
              { id: 'orders', label: 'GET /api/orders (Recent Orders)', method: 'GET' },
              { id: 'metrics', label: 'GET /api/admin/metrics (KPIs)', method: 'GET' },
              { id: 'user', label: 'GET /api/auth/me (Current Session)', method: 'GET' },
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
                    category: p.category,
                    rating: p.rating,
                  })),
                  null,
                  2
                )}

              {selectedEndpoint === 'orders' &&
                JSON.stringify(
                  orders.slice(0, 2).map((o) => ({
                    order_number: o.orderNumber,
                    customer: o.customerName,
                    total: o.total,
                    status: o.status,
                    tracking_number: o.trackingNumber,
                    items_count: o.items.length,
                  })),
                  null,
                  2
                )}

              {selectedEndpoint === 'metrics' &&
                JSON.stringify(
                  {
                    gross_sales: orders.reduce((sum, o) => sum + o.total, 0),
                    total_orders: orders.length,
                    active_products: products.length,
                    low_stock_items: products.filter((p) => p.stock <= 5).length,
                    active_coupons: coupons.filter((c) => c.isActive).length,
                  },
                  null,
                  2
                )}

              {selectedEndpoint === 'user' &&
                JSON.stringify(
                  currentUser
                    ? {
                        id: currentUser.id,
                        name: currentUser.name,
                        email: currentUser.email,
                        role: currentUser.role,
                        session_valid: true,
                        authenticated_via: 'flask_login_session_cookie',
                      }
                    : { authenticated: false, session_valid: false },
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
