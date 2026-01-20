#!/bin/bash
# PETZEUSTECH MASTER DEPLOYER v2.0
# Target: /var/www/petzeustech
# Run this from your home directory: bash deploy.sh

REPO_URL="https://github.com/YOUR_USERNAME/Petzeustech.git"
WEB_ROOT="/var/www/petzeustech"

echo "------------------------------------------------"
echo "PETZEUSTECH: COMMENCING HARD RE-CLONE..."
echo "------------------------------------------------"

# 1. Purge existing production folder
if [ -d "$WEB_ROOT" ]; then
    echo "[1/4] Deleting existing project folder in $WEB_ROOT..."
    sudo rm -rf "$WEB_ROOT"
fi

# 2. Fresh Clone directly to /var/www/
echo "[2/4] Cloning repository directly into $WEB_ROOT..."
sudo git clone "$REPO_URL" "$WEB_ROOT"

# 3. Secure Internal Scripts
echo "[3/4] Authorizing internal logic..."
cd "$WEB_ROOT"
sudo chmod +x setup-lemp.sh sync.sh

# 4. Trigger Infrastructure Engine
echo "[4/4] Handing over to Infrastructure Engine..."
sudo ./setup-lemp.sh

echo "------------------------------------------------"
echo "DEPLOYMENT FINALIZED. PRODUCTION IS LIVE."
echo "------------------------------------------------"
