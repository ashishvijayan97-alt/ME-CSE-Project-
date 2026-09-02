#!/bin/bash

set -e

echo "=== ShopCloud ApplicationStart started ==="

PROJECT_DIR="/home/ubuntu/ME-CSE-Project-"
BACKEND_DIR="$PROJECT_DIR/backend"

cd "$BACKEND_DIR"

echo "Activating Python virtual environment..."
source "$BACKEND_DIR/venv/bin/activate"

echo "Installing backend dependencies..."
pip install -r requirements.txt

echo "Restarting ShopCloud Flask service..."

sudo systemctl restart shopcloud-flask

echo "=== ShopCloud ApplicationStart completed ==="