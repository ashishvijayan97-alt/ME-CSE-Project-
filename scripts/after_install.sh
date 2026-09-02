#!/bin/bash

set -e

echo "=== ShopCloud AfterInstall started ==="

PROJECT_DIR="/home/ubuntu/ME-CSE-Project-"
BACKEND_DIR="$PROJECT_DIR/backend"

echo "Project directory: $PROJECT_DIR"

# Make deployed files owned by ubuntu.
sudo chown -R ubuntu:ubuntu "$PROJECT_DIR"

# Create the Python virtual environment if it does not exist.
if [ ! -d "$BACKEND_DIR/venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv "$BACKEND_DIR/venv"
fi

# Make React production files readable by Nginx.
if [ -d "$PROJECT_DIR/dist" ]; then
    chmod -R o+rX "$PROJECT_DIR/dist"
fi

echo "=== ShopCloud AfterInstall completed ==="