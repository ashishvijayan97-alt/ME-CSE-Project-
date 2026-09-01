"""
backend/routes/__init__.py - Routes Package Initialization
"""
from .auth import auth_bp
from .products import products_bp
from .orders import orders_bp
from .admin import admin_bp

__all__ = ['auth_bp', 'products_bp', 'orders_bp', 'admin_bp']
