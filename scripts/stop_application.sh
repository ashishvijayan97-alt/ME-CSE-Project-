#!/bin/bash

echo "=== Stopping ShopCloud Flask service ==="

sudo systemctl stop shopcloud-flask || true

echo "=== ShopCloud Flask service stopped ==="