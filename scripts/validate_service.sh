#!/bin/bash

set -e

echo "=== ShopCloud validation started ==="

echo "Checking Flask systemd service..."
sudo systemctl is-active --quiet shopcloud-flask

echo "Waiting for ShopCloud API to become ready..."

for i in {1..30}; do
    if curl --fail --silent http://localhost/api/products/ > /dev/null; then
        echo "ShopCloud API is responding successfully."
        echo "ShopCloud application validation successful."
        echo "=== ShopCloud validation completed ==="
        exit 0
    fi

    echo "API not ready yet... attempt $i/30"
    sleep 2
done

echo "ERROR: ShopCloud API did not become ready within 60 seconds."
exit 1