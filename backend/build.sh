#!/usr/bin/env bash
# Render build script — runs after pip install
set -e
echo "Running database migrations..."
python -m alembic upgrade head || true
echo "Seeding initial data..."
python seed.py
echo "Build complete."
