#!/bin/bash
# PETZEUSTECH DIAGNOSTIC & REPAIR TOOL v1.0
# Run this if the domain is not reachable or DB is failing.

echo "--- 1. FIREWALL OVERRIDE ---"
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw --force enable
sudo ufw reload

echo "--- 2. DATABASE SYNCHRONIZATION ---"
# Forces creation of the user defined in backend/config.php
DB_PASS="Petuel99.5"
sudo mysql -u root <<EOF
CREATE DATABASE IF NOT EXISTS petzeustech_db;
CREATE USER IF NOT EXISTS 'zeus_admin'@'localhost' IDENTIFIED BY '$DB_PASS';
GRANT ALL PRIVILEGES ON petzeustech_db.* TO 'zeus_admin'@'localhost';
FLUSH PRIVILEGES;
EOF
echo "Database User 'zeus_admin' synchronized."

echo "--- 3. NGINX & PHP-FPM PULSE ---"
PHP_V=$(php -v | head -n 1 | cut -d " " -f 2 | cut -d "." -f 1,2)
sudo systemctl restart nginx
sudo systemctl restart php${PHP_V}-fpm
sudo nginx -t

echo "--- 4. CONNECTIVITY TEST ---"
curl -I http://localhost
echo "Diagnostics complete. Try accessing http://petzeustech.duckdns.org now."
