"""
backend/app.py - ShopCloud Main Flask Application Factory & Server
Real runnable Flask 3.x backend with SQLAlchemy, Flask-Login, and CORS
"""
import os
import json
from datetime import datetime, timedelta
from flask import Flask, jsonify, request, send_from_directory
from flask_login import LoginManager
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import models and route blueprints
from models import db, User, Category, Product, Order, OrderItem, Coupon, Review, Address
from routes.auth import auth_bp
from routes.products import products_bp
from routes.orders import orders_bp
from routes.admin import admin_bp


def create_app(config_override=None):
    """Application Factory for Flask backend."""
    base_dir = os.path.abspath(os.path.dirname(__file__))
    dist_dir = os.path.join(base_dir, '..', 'dist')

    app = Flask(
        __name__,
        static_folder=dist_dir if os.path.exists(dist_dir) else None,
        static_url_path='/'
    )

    # Core Configuration
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'shopcloud-super-secret-key-2026-production')

    # Database Configuration: PostgreSQL in production, SQLite local fallback
    database_url = os.getenv('DATABASE_URL')
    if not database_url:
        sqlite_path = os.path.join(base_dir, 'shopcloud.db')
        database_url = f"sqlite:///{sqlite_path}"
    elif database_url.startswith('postgres://'):
        # Fix SQLAlchemy 1.4+ compatibility for Heroku/Render postgres URI
        database_url = database_url.replace('postgres://', 'postgresql://', 1)

    app.config['SQLALCHEMY_DATABASE_URI'] = database_url
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    if config_override:
        app.config.update(config_override)

    # Initialize Database
    db.init_app(app)

    # Initialize CORS for cross-origin requests from React/Vite development server
    CORS(
        app,
        supports_credentials=True,
        origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5173", "*"]
    )

    # Initialize Flask-Login
    login_manager = LoginManager()
    login_manager.init_app(app)
    login_manager.login_view = 'auth.login'

    @login_manager.user_loader
    def load_user(user_id):
        try:
            return User.query.get(int(user_id))
        except Exception:
            return None

    @login_manager.unauthorized_handler
    def unauthorized():
        return jsonify({'error': 'Authentication required', 'authenticated': False}), 401

    # Register Route Blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(products_bp, url_prefix='/api/products')
    app.register_blueprint(orders_bp, url_prefix='/api/orders')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')

    # Health Check API
    @app.route('/api/health', methods=['GET'])
    def health_check():
        db_status = 'connected'
        try:
            db.session.execute(db.text('SELECT 1'))
        except Exception as e:
            db_status = f'error: {str(e)}'

        return jsonify({
            'status': 'healthy',
            'service': 'ShopCloud Flask REST API',
            'version': '1.0.0',
            'database': db_status,
            'timestamp': datetime.utcnow().isoformat()
        }), 200

    # SPA Static Files Handler (serves built React bundle if dist exists)
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
        return jsonify({
            'message': 'ShopCloud Flask Backend API is running.',
            'endpoints': {
                'health': '/api/health',
                'products': '/api/products',
                'orders': '/api/orders',
                'auth': '/api/auth/me',
                'admin_metrics': '/api/admin/metrics'
            }
        })

    return app


def seed_database():
    """Populates database with initial store categories, products, admin, and demo data."""
    if Category.query.first():
        return  # Database already seeded

    print("🌱 Seeding ShopCloud initial database...")

    # 1. Categories
    categories = [
        Category(name='Electronics', slug='electronics', description='High-end audio, computing, and peripherals', icon_name='Headphones'),
        Category(name='Apparel', slug='apparel', description='Designer minimalist fashion and outerwear', icon_name='Shirt'),
        Category(name='Home & Living', slug='home', description='Ergonomic workspace and artisan homeware', icon_name='Home'),
        Category(name='Accessories', slug='accessories', description='Leather goods, luxury timepieces, and everyday carry', icon_name='Watch'),
    ]
    for c in categories:
        db.session.add(c)
    db.session.commit()

    # 2. Users (Admin & Customer)
    admin_user = User(
        name='Sarah Jenkins',
        email='admin@shopcloud.io',
        role='admin',
        avatar='https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        phone='+1 (555) 234-5678'
    )
    admin_user.set_password('Admin2026!')
    db.session.add(admin_user)

    customer_user = User(
        name='Alex Morgan',
        email='alex@example.com',
        role='customer',
        avatar='https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        phone='+1 (555) 876-5432'
    )
    customer_user.set_password('Customer123!')
    db.session.add(customer_user)
    db.session.commit()

    # 3. Seed Products
    cat_map = {c.slug: c.id for c in Category.query.all()}

    products_data = [
        {
            'sku': 'AUD-NOISE-01',
            'name': 'Apex Wireless Noise-Cancelling Headphones',
            'slug': 'apex-wireless-headphones',
            'description': 'Masterfully tuned custom 40mm titanium drivers with hybrid active noise cancellation and 40-hour ultra battery life.',
            'detailed_description': 'Engineered for audio purists and daily commuters alike, the Apex Wireless features lossless LDAC Bluetooth 5.3 streaming, plush memory foam earcups, and dual beamforming voice microphones.',
            'price': 299.99,
            'original_price': 349.99,
            'discount_percentage': 14,
            'stock': 42,
            'rating': 4.9,
            'review_count': 128,
            'brand': 'Aura Acoustics',
            'image': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
            'images': [
                'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80'
            ],
            'colors': ['Midnight Black', 'Platinum Silver', 'Deep Navy'],
            'sizes': ['Standard'],
            'features': ['40mm Titanium Drivers', 'Hybrid ANC with Transparency Mode', '40h Continuous Playback', 'Lossless Multipoint Bluetooth 5.3'],
            'specifications': {'Weight': '250g', 'Connectivity': 'Bluetooth 5.3 + 3.5mm Aux', 'Charging': 'USB-C Fast Charge (10 min = 5h)', 'Warranty': '2 Years'},
            'is_featured': True,
            'is_bestseller': True,
            'category_id': cat_map.get('electronics')
        },
        {
            'sku': 'WATCH-CHRONO-02',
            'name': 'Horizon Chronograph Minimalist Watch',
            'slug': 'horizon-chronograph-watch',
            'description': 'Swiss-engineered sapphire glass quartz timepiece with interchangeable full-grain Italian leather strap and 50m water resistance.',
            'detailed_description': 'Understated luxury for the modern aesthetic. Features a surgical-grade 316L stainless steel case, anti-reflective domed sapphire crystal, and precision movement.',
            'price': 249.00,
            'original_price': 299.00,
            'discount_percentage': 17,
            'stock': 18,
            'rating': 4.8,
            'review_count': 64,
            'brand': 'Chronos Studio',
            'image': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
            'images': [
                'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80'
            ],
            'colors': ['Matte Black', 'Brushed Rose Gold', 'Silver Sunburst'],
            'sizes': ['40mm', '42mm'],
            'features': ['Domed Sapphire Crystal', 'Swiss Quartz Movement', '5 ATM Water Resistance', 'Italian Top-Grain Leather'],
            'specifications': {'Case Diameter': '40mm', 'Case Thickness': '8.5mm', 'Band Width': '20mm', 'Movement': 'Swiss Ronda Quartz'},
            'is_featured': True,
            'is_bestseller': False,
            'category_id': cat_map.get('accessories')
        },
        {
            'sku': 'BAG-LEATHER-03',
            'name': 'Urban Nomad Canvas & Leather Backpack',
            'slug': 'urban-nomad-backpack',
            'description': 'Weatherproof 16oz waxed cotton canvas backpack featuring dedicated padded 16-inch laptop compartment and brass hardware.',
            'detailed_description': 'Crafted for daily commutes and weekend wanderlust. Features water-resistant YKK Aquaguard zippers, ergonomic breathable mesh back panel, and expandable 24L volume.',
            'price': 169.50,
            'original_price': 199.00,
            'discount_percentage': 15,
            'stock': 3,  # Low stock test item
            'rating': 4.7,
            'review_count': 49,
            'brand': 'Nomad Heritage',
            'image': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
            'images': [
                'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80'
            ],
            'colors': ['Olive Drab', 'Charcoal', 'Tan Leather'],
            'sizes': ['24L Standard'],
            'features': ['16" Padded Laptop Sleeve', 'Waxed Weatherproof Canvas', 'Magnetic Quick-Release Buckles', 'Luggage Pass-Through Sleeve'],
            'specifications': {'Dimensions': '48 x 30 x 16 cm', 'Capacity': '24 Liters', 'Weight': '1.1 kg', 'Material': '16oz Cotton Canvas & Veg-Tan Leather'},
            'is_featured': True,
            'is_bestseller': True,
            'category_id': cat_map.get('accessories')
        },
        {
            'sku': 'OPTIC-LENS-04',
            'name': 'Aero Titanium Polarized Sunglasses',
            'slug': 'aero-titanium-sunglasses',
            'description': 'Ultra-lightweight Japanese aerospace titanium frames with polarized UV400 hydrophobic scratch-resistant lenses.',
            'detailed_description': 'Weighing only 18 grams, the Aero titanium sunglasses deliver featherlight comfort with 100% UV protection and high-contrast optical clarity.',
            'price': 185.00,
            'original_price': None,
            'discount_percentage': 0,
            'stock': 25,
            'rating': 4.6,
            'review_count': 38,
            'brand': 'Optic Pure',
            'image': 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80',
            'images': [
                'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80'
            ],
            'colors': ['Gunmetal / Polarized Grey', 'Gold / Amber Bronze', 'Silver / Mirror Blue'],
            'sizes': ['Universal 52-20-145'],
            'features': ['Aerospace Titanium Wireframe', 'UV400 Category 3 Polarization', 'Hydrophobic & Oleophobic Coating', 'Custom Leather Travel Case'],
            'specifications': {'Frame Material': 'Beta Titanium', 'Lens Material': 'Tri-Acetate Cellulose (TAC)', 'Total Weight': '18g'},
            'is_featured': False,
            'is_bestseller': True,
            'category_id': cat_map.get('accessories')
        }
    ]

    for p_info in products_data:
        prod = Product(
            sku=p_info['sku'],
            name=p_info['name'],
            slug=p_info['slug'],
            description=p_info['description'],
            detailed_description=p_info['detailed_description'],
            price=p_info['price'],
            original_price=p_info['original_price'],
            discount_percentage=p_info['discount_percentage'],
            stock=p_info['stock'],
            rating=p_info['rating'],
            review_count=p_info['review_count'],
            brand=p_info['brand'],
            image=p_info['image'],
            is_featured=p_info['is_featured'],
            is_bestseller=p_info['is_bestseller'],
            category_id=p_info['category_id']
        )
        prod.images = p_info['images']
        prod.colors = p_info['colors']
        prod.sizes = p_info['sizes']
        prod.features = p_info['features']
        prod.specifications = p_info['specifications']
        db.session.add(prod)

    # 4. Seed Promo Coupons
    coupons = [
        Coupon(code='SAVE20', discount_percentage=20, minimum_spend=100.0, is_active=True, expires_at=datetime.utcnow() + timedelta(days=90)),
        Coupon(code='WELCOME10', discount_percentage=10, minimum_spend=50.0, is_active=True, expires_at=datetime.utcnow() + timedelta(days=180)),
        Coupon(code='FLASH50', discount_percentage=50, minimum_spend=250.0, is_active=True, expires_at=datetime.utcnow() + timedelta(days=30)),
    ]
    for c in coupons:
        db.session.add(c)

    db.session.commit()
    print("✅ ShopCloud database seeded successfully!")


if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        db.create_all()
        seed_database()

    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('FLASK_DEBUG', 'True').lower() in ('true', '1', 't')
    print(f"🚀 Starting ShopCloud Flask Server on http://0.0.0.0:{port}")
    app.run(host='0.0.0.0', port=port, debug=debug)
