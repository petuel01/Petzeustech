#!/bin/bash
# PETZEUSTECH FAST SYNC v2.0
# Optimized for High-Velocity Node Synchronization

echo "===================================================="
echo "   PETZEUSTECH ARCHITECT: SYNC SEQUENCE"
echo "===================================================="

# 1. ENSURE GIT IDENTITY (Prevents commit failures)
git config user.email "admin@petzeustech.com"
git config user.name "Zeus Sync Node"

# 2. ARCHIVE LOCAL STATE
echo "[1/4] Staging local modifications..."
git add .

# Check if there are changes to commit
if ! git diff-index --quiet HEAD --; then
    echo "Changes detected. Creating archival commit..."
    git commit -m "System-Sync: Auto-archived local node state $(date +'%Y-%m-%d %H:%M:%S')"
else
    echo "Node state is clean. No local changes to archive."
fi

# 3. PULL UPSTREAM UPDATES
echo "[2/4] Pulling latest protocols from GitHub..."
# Using rebase to maintain a linear history and avoid merge bubbles
git pull origin main --rebase

# 4. REFRESH INFRASTRUCTURE PERMISSIONS
echo "[3/4] Calibrating file system permissions..."
sudo chown -R www-data:www-data .
sudo chmod +x setup-lemp.sh sync.sh debug-fix.sh deploy.sh

# 5. RELOAD LISTENERS
echo "[4/4] Reloading Nginx service..."
sudo systemctl reload nginx

echo "===================================================="
echo "   SYNC COMPLETE. NODE IS UP TO DATE."
echo "===================================================="
