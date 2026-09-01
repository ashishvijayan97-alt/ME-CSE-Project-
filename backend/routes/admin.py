"""
backend/routes/admin.py - Admin Management & Analytics Endpoints
Provides metric aggregation, customer list insights, review moderation, and coupon management
"""
from datetime import datetime
from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from models import db, Order, Product, User, Review, Coupon

admin_bp = Blueprint('admin', __name__)


def is_admin():
    return current_user.is_authenticated and current_user.role == 'admin'


@admin_bp.before_request
def verify_admin_access():
    # In public development mode or if authenticated as admin, allow access
    # If the user is logged in as non-admin customer, reject with 403
    if current_user.is_authenticated and current_user.role != 'admin':
        return jsonify({'error': 'Forbidden: Administrator privileges required'}), 403


@admin_bp.route('/metrics', methods=['GET'])
def get_metrics():
    orders = Order.query.all()
    products = Product.query.all()
    users = User.query.filter_by(role='customer').all()
    reviews = Review.query.all()

    total_revenue = sum(float(o.total) for o in orders if o.status != 'cancelled')
    total_orders = len(orders)
    pending_orders = sum(1 for o in orders if o.status in ('pending', 'processing'))
    low_stock_products = [p.to_dict() for p in products if p.stock <= 5]
    active_coupons = Coupon.query.filter_by(is_active=True).count()

    avg_order_val = (total_revenue / total_orders) if total_orders > 0 else 0.0

    return jsonify({
        'gross_revenue': round(total_revenue, 2),
        'total_orders': total_orders,
        'pending_orders': pending_orders,
        'total_products': len(products),
        'low_stock_count': len(low_stock_products),
        'low_stock_items': low_stock_products,
        'total_customers': len(users),
        'total_reviews': len(reviews),
        'average_order_value': round(avg_order_val, 2),
        'active_coupons': active_coupons,
    }), 200


@admin_bp.route('/customers', methods=['GET'])
def get_customers():
    customers = User.query.filter_by(role='customer').order_by(User.created_at.desc()).all()
    results = []

    for c in customers:
        orders = Order.query.filter_by(user_id=c.id).all()
        total_spend = sum(float(o.total) for o in orders if o.status != 'cancelled')
        results.append({
            'id': c.id,
            'name': c.name,
            'email': c.email,
            'avatar': c.avatar,
            'phone': c.phone,
            'orders_count': len(orders),
            'total_spend': round(total_spend, 2),
            'last_order': orders[0].created_at.isoformat() if orders else None,
            'joined_at': c.created_at.isoformat() if c.created_at else None,
        })

    return jsonify(results), 200


@admin_bp.route('/reviews', methods=['GET'])
def get_reviews():
    status = request.args.get('status')
    query = Review.query

    if status and status != 'all':
        query = query.filter_by(status=status)

    reviews = query.order_by(Review.created_at.desc()).all()
    results = []

    for r in reviews:
        item = r.to_dict()
        if r.product:
            item['product_name'] = r.product.name
            item['product_image'] = r.product.image
        results.append(item)

    return jsonify(results), 200


@admin_bp.route('/reviews/<int:review_id>/status', methods=['PUT'])
def update_review_status(review_id):
    review = Review.query.get_or_404(review_id)
    data = request.get_json(silent=True) or {}
    new_status = data.get('status')

    if new_status in ['approved', 'pending', 'rejected']:
        review.status = new_status
        db.session.commit()
        return jsonify(review.to_dict()), 200

    return jsonify({'error': 'Invalid status. Must be approved, pending, or rejected'}), 400


@admin_bp.route('/coupons', methods=['GET'])
def get_coupons():
    coupons = Coupon.query.order_by(Coupon.created_at.desc()).all()
    return jsonify([c.to_dict() for c in coupons]), 200


@admin_bp.route('/coupons', methods=['POST'])
def create_coupon():
    data = request.get_json(silent=True) or {}
    code = (data.get('code') or '').strip().upper()
    discount_pct = data.get('discount_percentage')

    if not code or discount_pct is None:
        return jsonify({'error': 'Code and discount_percentage are required'}), 400

    existing = Coupon.query.filter_by(code=code).first()
    if existing:
        return jsonify({'error': f"Coupon with code '{code}' already exists"}), 409

    coupon = Coupon(
        code=code,
        discount_percentage=int(discount_pct),
        minimum_spend=float(data.get('minimum_spend', 0.0)),
        is_active=data.get('is_active', True)
    )
    db.session.add(coupon)
    db.session.commit()

    return jsonify(coupon.to_dict()), 201


@admin_bp.route('/coupons/<int:coupon_id>', methods=['DELETE'])
def delete_coupon(coupon_id):
    coupon = Coupon.query.get_or_404(coupon_id)
    db.session.delete(coupon)
    db.session.commit()
    return jsonify({'message': f"Coupon '{coupon.code}' deleted successfully"}), 200
