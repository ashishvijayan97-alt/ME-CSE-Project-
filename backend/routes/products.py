"""
backend/routes/products.py - Product Catalog & Category Endpoints
Handles product querying, filtering, search, and CRUD administration
"""
import re
from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from models import db, Product, Category, Review

products_bp = Blueprint('products', __name__)


def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text)
    return re.sub(r'^-+|-+$', '', text)


def is_admin():
    return current_user.is_authenticated and current_user.role == 'admin'


@products_bp.route('/categories', methods=['GET'])
def get_categories():
    categories = Category.query.order_by(Category.name.asc()).all()
    return jsonify([c.to_dict() for c in categories]), 200


@products_bp.route('/', methods=['GET'])
def get_products():
    category_slug = request.args.get('category')
    search = request.args.get('search')
    brand = request.args.get('brand')
    min_price = request.args.get('min_price', type=float)
    max_price = request.args.get('max_price', type=float)
    min_rating = request.args.get('min_rating', type=float)
    in_stock_only = request.args.get('in_stock', type=lambda v: v.lower() in ('true', '1'))
    featured_only = request.args.get('featured', type=lambda v: v.lower() in ('true', '1'))
    bestseller_only = request.args.get('bestseller', type=lambda v: v.lower() in ('true', '1'))
    sort_by = request.args.get('sort_by', 'featured')
    limit = request.args.get('limit', type=int)

    query = Product.query

    if category_slug and category_slug != 'all':
        cat = Category.query.filter_by(slug=category_slug).first()
        if cat:
            query = query.filter_by(category_id=cat.id)
        else:
            return jsonify([]), 200

    if search:
        search_term = f"%{search.strip()}%"
        query = query.filter(
            db.or_(
                Product.name.ilike(search_term),
                Product.brand.ilike(search_term),
                Product.description.ilike(search_term),
                Product.sku.ilike(search_term)
            )
        )

    if brand:
        query = query.filter(Product.brand.ilike(brand.strip()))

    if min_price is not None:
        query = query.filter(Product.price >= min_price)

    if max_price is not None:
        query = query.filter(Product.price <= max_price)

    if min_rating is not None:
        query = query.filter(Product.rating >= min_rating)

    if in_stock_only:
        query = query.filter(Product.stock > 0)

    if featured_only:
        query = query.filter_by(is_featured=True)

    if bestseller_only:
        query = query.filter_by(is_bestseller=True)

    # Sorting
    if sort_by == 'price-asc':
        query = query.order_by(Product.price.asc())
    elif sort_by == 'price-desc':
        query = query.order_by(Product.price.desc())
    elif sort_by == 'rating':
        query = query.order_by(Product.rating.desc(), Product.review_count.desc())
    elif sort_by == 'bestseller':
        query = query.order_by(Product.is_bestseller.desc(), Product.review_count.desc())
    elif sort_by == 'newest':
        query = query.order_by(Product.created_at.desc())
    else:  # featured / default
        query = query.order_by(Product.is_featured.desc(), Product.id.desc())

    if limit:
        query = query.limit(limit)

    products = query.all()
    return jsonify([p.to_dict() for p in products]), 200


@products_bp.route('/<int:product_id>', methods=['GET'])
def get_product(product_id):
    product = Product.query.get_or_404(product_id)
    return jsonify(product.to_dict(include_reviews=True)), 200


@products_bp.route('/', methods=['POST'])
def create_product():
    # Role-based admin check
    if not is_admin():
        return jsonify({'error': 'Admin authorization required'}), 403

    data = request.get_json(silent=True)
    if not data:
        return jsonify({'error': 'Invalid JSON request'}), 400

    required_fields = ['name', 'price', 'category_id', 'sku', 'image']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f"Missing required field: '{field}'"}), 400

    # Ensure unique SKU
    if Product.query.filter_by(sku=data['sku']).first():
        return jsonify({'error': f"Product with SKU '{data['sku']}' already exists"}), 409

    # Generate slug if not provided
    name = data['name'].strip()
    slug = data.get('slug') or slugify(name)
    base_slug = slug
    counter = 1
    while Product.query.filter_by(slug=slug).first():
        slug = f"{base_slug}-{counter}"
        counter += 1

    product = Product(
        sku=data['sku'].strip(),
        name=name,
        slug=slug,
        description=data.get('description', ''),
        detailed_description=data.get('detailed_description', ''),
        price=data['price'],
        original_price=data.get('original_price'),
        discount_percentage=data.get('discount_percentage', 0),
        stock=data.get('stock', 0),
        brand=data.get('brand', 'ShopCloud'),
        image=data['image'],
        is_featured=data.get('is_featured', False),
        is_bestseller=data.get('is_bestseller', False),
        category_id=data['category_id']
    )

    if 'images' in data:
        product.images = data['images']
    if 'colors' in data:
        product.colors = data['colors']
    if 'sizes' in data:
        product.sizes = data['sizes']
    if 'features' in data:
        product.features = data['features']
    if 'specifications' in data:
        product.specifications = data['specifications']

    db.session.add(product)
    db.session.commit()

    return jsonify(product.to_dict()), 201


@products_bp.route('/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    if not is_admin():
        return jsonify({'error': 'Admin authorization required'}), 403

    product = Product.query.get_or_404(product_id)
    data = request.get_json(silent=True) or {}

    if 'name' in data:
        product.name = data['name'].strip()
    if 'price' in data:
        product.price = data['price']
    if 'original_price' in data:
        product.original_price = data['original_price']
    if 'discount_percentage' in data:
        product.discount_percentage = data['discount_percentage']
    if 'stock' in data:
        product.stock = data['stock']
    if 'description' in data:
        product.description = data['description']
    if 'detailed_description' in data:
        product.detailed_description = data['detailed_description']
    if 'brand' in data:
        product.brand = data['brand']
    if 'image' in data:
        product.image = data['image']
    if 'category_id' in data:
        product.category_id = data['category_id']
    if 'is_featured' in data:
        product.is_featured = bool(data['is_featured'])
    if 'is_bestseller' in data:
        product.is_bestseller = bool(data['is_bestseller'])
    if 'images' in data:
        product.images = data['images']
    if 'colors' in data:
        product.colors = data['colors']
    if 'sizes' in data:
        product.sizes = data['sizes']
    if 'features' in data:
        product.features = data['features']
    if 'specifications' in data:
        product.specifications = data['specifications']

    db.session.commit()
    return jsonify(product.to_dict()), 200


@products_bp.route('/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    if not is_admin():
        return jsonify({'error': 'Admin authorization required'}), 403

    product = Product.query.get_or_404(product_id)
    db.session.delete(product)
    db.session.commit()
    return jsonify({'message': f"Product {product_id} deleted successfully"}), 200


@products_bp.route('/<int:product_id>/reviews', methods=['POST'])
def add_review(product_id):
    product = Product.query.get_or_404(product_id)
    data = request.get_json(silent=True) or {}

    rating = data.get('rating')
    comment = data.get('comment')
    title = data.get('title', 'Customer Review')

    if not rating or not comment:
        return jsonify({'error': 'Rating and comment are required'}), 400

    user_name = current_user.name if current_user.is_authenticated else data.get('user_name', 'Verified Buyer')
    user_avatar = current_user.avatar if current_user.is_authenticated else None
    user_id = current_user.id if current_user.is_authenticated else None

    review = Review(
        product_id=product.id,
        user_id=user_id,
        user_name=user_name,
        user_avatar=user_avatar,
        rating=int(rating),
        title=title,
        comment=comment,
        status='approved',
        is_verified_purchase=True
    )
    db.session.add(review)

    # Recalculate average rating
    all_reviews = Review.query.filter_by(product_id=product.id, status='approved').all()
    total_ratings = sum(r.rating for r in all_reviews) + int(rating)
    count = len(all_reviews) + 1
    product.rating = round(total_ratings / count, 1)
    product.review_count = count

    db.session.commit()
    return jsonify(review.to_dict()), 201
