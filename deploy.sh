#!/bin/bash
# PETZEUSTECH MASTER DEPLOYER v3.0 (PUBLIC REPO OPTIMIZED)
# Location: /root/deploy.sh or ~/deploy.sh
# Purpose: Clean-slate deployment bypassing ownership restrictions.

# --- CONFIGURATION ---
REPO_URL="https://github.com/Petuel99/Petzeustech.git"
WEB_ROOT="/var/www/petzeustech"
# ---------------------

echo "===================================================="
echo "   PETZEUSTECH ARCHITECT: INITIATING DEPLOYMENT"
echo "===================================================="

# 1. FORCE PURGE
# Using sudo to override www-data ownership blocks
if [ -d "$WEB_ROOT" ]; then
    echo "[1/4] Overriding ownership and purging: $WEB_ROOT"
    sudo rm -rf "$WEB_ROOT"
fi

# 2. PUBLIC CLONE
echo "[2/4] Pulling fresh infrastructure from Public Repo..."
sudo git clone "$REPO_URL" "$WEB_ROOT"

# 3. PERMISSION HANDOFF
echo "[3/4] Initializing internal script permissions..."
cd "$WEB_ROOT"
sudo chmod +x setup-lemp.sh sync.sh

# 4. ENGINE TRIGGER
echo "[4/4] Executing Infrastructure Engine..."
sudo ./setup-lemp.sh

echo "===================================================="
echo "   DEPLOYMENT SUCCESSFUL: TERMINAL IS LIVE"
echo "===================================================="
