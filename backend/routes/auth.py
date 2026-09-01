"""
backend/routes/auth.py - Authentication & User Profile Endpoints
Handles user login, registration, logout, and session checks via Flask-Login
"""
from flask import Blueprint, request, jsonify
from flask_login import login_user, logout_user, login_required, current_user
from models import db, User, Address

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json(silent=True)
    if not data:
        return jsonify({'error': 'Invalid JSON request'}), 400

    email = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''
    remember = data.get('remember', True)

    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({'error': 'Invalid email or password'}), 401

    login_user(user, remember=remember)
    return jsonify({
        'message': 'Login successful',
        'user': user.to_dict(include_addresses=True)
    }), 200


@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json(silent=True)
    if not data:
        return jsonify({'error': 'Invalid JSON request'}), 400

    name = (data.get('name') or '').strip()
    email = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''
    role = data.get('role', 'customer')

    if not name or not email or not password:
        return jsonify({'error': 'Name, email, and password are required'}), 400

    if len(password) < 6:
        return jsonify({'error': 'Password must be at least 6 characters'}), 400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({'error': 'An account with this email already exists'}), 409

    # Only allow customer role on public registration unless specific admin secret provided
    user_role = 'admin' if role == 'admin' and email.endswith('@shopcloud.io') else 'customer'

    new_user = User(
        name=name,
        email=email,
        role=user_role,
        avatar=f"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
    )
    new_user.set_password(password)

    db.session.add(new_user)
    db.session.commit()

    login_user(new_user, remember=True)

    return jsonify({
        'message': 'Account registered successfully',
        'user': new_user.to_dict(include_addresses=True)
    }), 201


@auth_bp.route('/logout', methods=['POST'])
def logout():
    if current_user.is_authenticated:
        logout_user()
    return jsonify({'message': 'Logged out successfully'}), 200


@auth_bp.route('/me', methods=['GET'])
def get_current_user():
    if not current_user.is_authenticated:
        return jsonify({'authenticated': False, 'user': None}), 200

    return jsonify({
        'authenticated': True,
        'user': current_user.to_dict(include_addresses=True)
    }), 200


@auth_bp.route('/addresses', methods=['GET'])
@login_required
def get_addresses():
    addresses = Address.query.filter_by(user_id=current_user.id).all()
    return jsonify([a.to_dict() for a in addresses]), 200


@auth_bp.route('/addresses', methods=['POST'])
@login_required
def add_address():
    data = request.get_json(silent=True) or {}
    if not data.get('street') or not data.get('city') or not data.get('zip_code'):
        return jsonify({'error': 'Street, city, and zip code are required'}), 400

    is_default = data.get('is_default', False)
    if is_default:
        Address.query.filter_by(user_id=current_user.id).update({'is_default': False})

    address = Address(
        user_id=current_user.id,
        name=data.get('name', current_user.name),
        street=data.get('street'),
        city=data.get('city'),
        state=data.get('state', ''),
        zip_code=data.get('zip_code'),
        country=data.get('country', 'United States'),
        phone=data.get('phone', ''),
        is_default=is_default
    )
    db.session.add(address)
    db.session.commit()

    return jsonify(address.to_dict()), 201
