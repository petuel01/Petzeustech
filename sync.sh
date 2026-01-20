#!/bin/bash
# PETZEUSTECH FAST SYNC v1.0
# Usage: Run 'bash sync.sh' from inside /var/www/petzeustech

echo "Pulling latest configurations from GitHub..."
sudo git pull origin main

echo "Refreshing permissions..."
sudo chown -R www-data:www-data .
sudo chmod +x setup-lemp.sh sync.sh

echo "Reloading Nginx..."
sudo systemctl reload nginx

echo "SYNC COMPLETE."
