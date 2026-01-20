#!/bin/bash
# PETZEUSTECH FAST SYNC v2.1
# Optimized for High-Velocity Node Synchronization

echo "===================================================="
echo "   PETZEUSTECH ARCHITECT: SYNC SEQUENCE"
echo "===================================================="

# 1. CONFIGURE IDENTITY
git config user.email "admin@petzeustech.com"
git config user.name "Zeus Sync Node"

# 2. STAGE AND COMMIT LOCAL CHANGES
echo "[1/4] Staging local modifications..."
git add .
if ! git diff-index --quiet HEAD --; then
    echo "Committing local changes..."
    git commit -m "Node-Sync: Hotfix archived $(date +'%Y-%m-%d %H:%M:%S')"
else
    echo "No local changes to commit."
fi

# 3. PULL AND MERGE
echo "[2/4] Pulling latest protocols..."
# Rebase is cleaner, but if branches have diverged significantly, we use merge
git pull origin main --no-rebase

# 4. PERMISSION ALIGNMENT
echo "[3/4] Calibrating file system..."
sudo chown -R www-data:www-data .
sudo chmod +x *.sh

# 5. REFRESH SERVICES
echo "[4/4] Reloading system listeners..."
sudo systemctl reload nginx
PHP_V=$(php -v | head -n 1 | cut -d " " -f 2 | cut -d "." -f 1,2)
sudo systemctl restart php${PHP_V}-fpm

echo "===================================================="
echo "   SYNC COMPLETE. NODE IS STABLE."
echo "===================================================="
