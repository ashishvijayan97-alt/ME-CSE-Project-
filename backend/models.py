"""
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

    # Relationships
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

    # Relationships
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

    @property
    def colors(self):
        if self._colors_json:
            try:
                return json.loads(self._colors_json)
            except Exception:
                return []
        return []

    @colors.setter
    def colors(self, val):
        self._colors_json = json.dumps(val) if val else None

    @property
    def sizes(self):
        if self._sizes_json:
            try:
                return json.loads(self._sizes_json)
            except Exception:
                return []
        return []

    @sizes.setter
    def sizes(self, val):
        self._sizes_json = json.dumps(val) if val else None

    @property
    def features(self):
        if self._features_json:
            try:
                return json.loads(self._features_json)
            except Exception:
                return []
        return []

    @features.setter
    def features(self, val):
        self._features_json = json.dumps(val) if val else None

    @property
    def specifications(self):
        if self._specs_json:
            try:
                return json.loads(self._specs_json)
            except Exception:
                return {}
        return {}

    @specifications.setter
    def specifications(self, val):
        self._specs_json = json.dumps(val) if val else None

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
            'colors': self.colors,
            'sizes': self.sizes,
            'features': self.features,
            'specifications': self.specifications,
            'is_featured': self.is_featured,
            'is_bestseller': self.is_bestseller,
            'category_id': self.category_id,
            'category_name': self.category_rel.name if self.category_rel else None,
            'category_slug': self.category_rel.slug if self.category_rel else None,
            'in_stock': self.stock > 0,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }
        if include_reviews:
            data['reviews'] = [r.to_dict() for r in self.reviews.filter_by(status='approved').all()]
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
    status = db.Column(db.String(30), default='pending', nullable=False, index=True)  # pending, processing, shipped, delivered, cancelled
    payment_method = db.Column(db.String(50), default='card', nullable=False)
    payment_status = db.Column(db.String(30), default='paid', nullable=False)
    tracking_number = db.Column(db.String(100), nullable=True)
    carrier = db.Column(db.String(100), default='FedEx Priority', nullable=True)
    
    # Shipping Address Details
    shipping_address_line1 = db.Column(db.String(255), nullable=True)
    shipping_address_line2 = db.Column(db.String(255), nullable=True)
    shipping_city = db.Column(db.String(100), nullable=True)
    shipping_state = db.Column(db.String(100), nullable=True)
    shipping_postal_code = db.Column(db.String(30), nullable=True)
    shipping_country = db.Column(db.String(100), default='United States', nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    items = db.relationship('OrderItem', backref='order', lazy='joined', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'order_number': self.order_number,
            'user_id': self.user_id,
            'customer_name': self.customer_name,
            'customer_email': self.customer_email,
            'customer_phone': self.customer_phone,
            'subtotal': float(self.subtotal),
            'discount': float(self.discount),
            'shipping_fee': float(self.shipping_fee),
            'tax': float(self.tax),
            'total': float(self.total),
            'status': self.status,
            'payment_method': self.payment_method,
            'payment_status': self.payment_status,
            'tracking_number': self.tracking_number,
            'carrier': self.carrier,
            'shipping_address': {
                'line1': self.shipping_address_line1,
                'line2': self.shipping_address_line2,
                'city': self.shipping_city,
                'state': self.shipping_state,
                'postal_code': self.shipping_postal_code,
                'country': self.shipping_country,
            },
            'items': [item.to_dict() for item in self.items],
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }


class OrderItem(db.Model):
    __tablename__ = 'order_items'

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False, index=True)
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
            'order_id': self.order_id,
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
            return False, f'Minimum spend of ${float(self.minimum_spend):.2f} required'
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
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False, index=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True, index=True)
    user_name = db.Column(db.String(100), nullable=False)
    user_avatar = db.Column(db.String(500), nullable=True)
    rating = db.Column(db.Integer, nullable=False)
    title = db.Column(db.String(200), nullable=False)
    comment = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(20), default='approved', nullable=False, index=True)  # approved, pending, rejected
    is_verified_purchase = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'product_id': self.product_id,
            'user_id': self.user_id,
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
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
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
