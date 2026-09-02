#!/bin/bash

set -e

echo "=== ShopCloud validation started ==="

echo "Checking Flask systemd service..."
sudo systemctl is-active --quiet shopcloud-flask

echo "Checking Flask API through Nginx..."
curl --fail --silent http://localhost/api/products/ > /dev/null

echo "ShopCloud application validation successful."
echo "=== ShopCloud validation completed ==="