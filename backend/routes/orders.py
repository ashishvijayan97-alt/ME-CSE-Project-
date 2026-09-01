"""
backend/routes/orders.py - Order Processing & Checkout Transactions
Validates stock availability, deducts inventory transactionally, and manages order lifecycle
"""
import random
import string
from datetime import datetime
from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from models import db, Order, OrderItem, Product, Coupon

orders_bp = Blueprint('orders', __name__)


def generate_order_number() -> str:
    timestamp = datetime.utcnow().strftime('%Y%m%d')
    random_str = ''.join(random.choices(string.ascii_uppercase + string.digits, k=5))
    return f"SC-{timestamp}-{random_str}"


def is_admin():
    return current_user.is_authenticated and current_user.role == 'admin'


@orders_bp.route('/', methods=['GET'])
def get_orders():
    # If admin, return all orders; if customer, return their orders; if anonymous, return 401
    if not current_user.is_authenticated:
        # Check if query parameter order_number is provided for guest lookup
        order_number = request.args.get('order_number')
        if order_number:
            order = Order.query.filter_by(order_number=order_number).first()
            if order:
                return jsonify([order.to_dict()]), 200
            return jsonify([]), 200
        return jsonify({'error': 'Authentication required to view orders'}), 401

    if current_user.role == 'admin':
        status = request.args.get('status')
        query = Order.query
        if status and status != 'all':
            query = query.filter_by(status=status)
        orders = query.order_by(Order.created_at.desc()).all()
    else:
        orders = Order.query.filter_by(user_id=current_user.id).order_by(Order.created_at.desc()).all()

    return jsonify([o.to_dict() for o in orders]), 200


@orders_bp.route('/<int:order_id>', methods=['GET'])
def get_order(order_id):
    order = Order.query.get_or_404(order_id)

    # Permission check: owner or admin
    if current_user.is_authenticated:
        if current_user.role != 'admin' and order.user_id != current_user.id:
            return jsonify({'error': 'Unauthorized to view this order'}), 403
    
    return jsonify(order.to_dict()), 200


@orders_bp.route('/', methods=['POST'])
def create_order():
    data = request.get_json(silent=True)
    if not data:
        return jsonify({'error': 'Invalid JSON body'}), 400

    items_data = data.get('items', [])
    if not items_data or len(items_data) == 0:
        return jsonify({'error': 'Cart is empty. Order must include at least one item.'}), 400

    customer_name = data.get('customer_name') or (current_user.name if current_user.is_authenticated else 'Guest Customer')
    customer_email = data.get('customer_email') or (current_user.email if current_user.is_authenticated else '')
    customer_phone = data.get('customer_phone') or (current_user.phone if current_user.is_authenticated else '')
    shipping_addr = data.get('shipping_address', {})

    if not customer_email:
        return jsonify({'error': 'Customer email is required'}), 400

    # Start atomic transaction check
    subtotal = 0.0
    order_items = []

    try:
        # Step 1: Validate stock and calculate authoritative subtotal
        for item in items_data:
            product_id = item.get('product_id')
            quantity = int(item.get('quantity', 1))

            if quantity <= 0:
                return jsonify({'error': 'Item quantity must be greater than zero'}), 400

            product = Product.query.with_for_update().get(product_id)
            if not product:
                db.session.rollback()
                return jsonify({'error': f"Product with ID {product_id} was not found"}), 404

            if product.stock < quantity:
                db.session.rollback()
                return jsonify({
                    'error': f"Insufficient stock for '{product.name}'. Available: {product.stock}, Requested: {quantity}"
                }), 400

            # Deduct stock transactionally
            product.stock -= quantity
            item_price = float(product.price)
            subtotal += item_price * quantity

            order_item = OrderItem(
                product_id=product.id,
                product_name=product.name,
                price=product.price,
                quantity=quantity,
                selected_color=item.get('selected_color'),
                selected_size=item.get('selected_size'),
                image=item.get('image') or product.image
            )
            order_items.append(order_item)

        # Step 2: Handle coupon discount if applied
        coupon_code = data.get('coupon_code')
        discount = 0.0
        if coupon_code:
            coupon = Coupon.query.filter_by(code=coupon_code.strip().upper(), is_active=True).first()
            if coupon:
                is_valid, _ = coupon.is_valid(subtotal)
                if is_valid:
                    discount = round(subtotal * (coupon.discount_percentage / 100.0), 2)

        # Step 3: Compute final shipping & tax
        shipping_fee = 0.0 if subtotal >= 100.0 else 9.99
        tax = round((subtotal - discount) * 0.08, 2)
        total = round(subtotal - discount + shipping_fee + tax, 2)

        # Step 4: Create Order record
        order = Order(
            order_number=generate_order_number(),
            user_id=current_user.id if current_user.is_authenticated else None,
            customer_name=customer_name,
            customer_email=customer_email,
            customer_phone=customer_phone,
            subtotal=subtotal,
            discount=discount,
            shipping_fee=shipping_fee,
            tax=tax,
            total=total,
            status='processing',
            payment_method=data.get('payment_method', 'credit_card'),
            payment_status='paid',
            carrier='FedEx Express',
            tracking_number=f"TRK{random.randint(100000000, 999999999)}",
            shipping_address_line1=shipping_addr.get('line1') or shipping_addr.get('street', ''),
            shipping_address_line2=shipping_addr.get('line2', ''),
            shipping_city=shipping_addr.get('city', ''),
            shipping_state=shipping_addr.get('state', ''),
            shipping_postal_code=shipping_addr.get('postal_code') or shipping_addr.get('zip_code', ''),
            shipping_country=shipping_addr.get('country', 'United States'),
            items=order_items
        )

        db.session.add(order)
        db.session.commit()

        return jsonify({
            'message': 'Order placed successfully',
            'order': order.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f"Failed to place order: {str(e)}"}), 500


@orders_bp.route('/<int:order_id>/status', methods=['PUT'])
def update_order_status(order_id):
    if not is_admin():
        return jsonify({'error': 'Admin authorization required'}), 403

    order = Order.query.get_or_404(order_id)
    data = request.get_json(silent=True) or {}

    new_status = data.get('status')
    valid_statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
    if new_status and new_status in valid_statuses:
        order.status = new_status

    if 'tracking_number' in data:
        order.tracking_number = data['tracking_number']
    if 'carrier' in data:
        order.carrier = data['carrier']

    db.session.commit()
    return jsonify(order.to_dict()), 200


@orders_bp.route('/coupons/validate', methods=['POST'])
def validate_coupon():
    data = request.get_json(silent=True) or {}
    code = (data.get('code') or '').strip().upper()
    subtotal = float(data.get('subtotal', 0.0))

    if not code:
        return jsonify({'valid': False, 'error': 'Coupon code is required'}), 400

    coupon = Coupon.query.filter_by(code=code).first()
    if not coupon:
        return jsonify({'valid': False, 'error': 'Invalid promo code'}), 404

    is_valid, msg = coupon.is_valid(subtotal)
    if not is_valid:
        return jsonify({'valid': False, 'error': msg}), 400

    discount_amount = round(subtotal * (coupon.discount_percentage / 100.0), 2)
    return jsonify({
        'valid': True,
        'coupon': coupon.to_dict(),
        'discount_amount': discount_amount,
        'message': f"Success! {coupon.discount_percentage}% discount applied"
    }), 200
