#!/bin/bash
# PETZEUSTECH DIAGNOSTIC & REPAIR TOOL v2.0
# Optimized for Ubuntu/MariaDB 10.x+ installations.

echo "===================================================="
echo "   PETZEUSTECH ARCHITECT: DIAGNOSTIC SEQUENCE"
echo "===================================================="

echo "[1/4] SYNCHRONIZING DATABASE NODE..."
DB_NAME="petzeustech_db"
DB_USER="zeus_admin"
DB_PASS="Petuel99.5"

# Attempt to create user and DB using sudo (bypasses local root password)
sudo mysql -e "CREATE DATABASE IF NOT EXISTS $DB_NAME;"
sudo mysql -e "CREATE USER IF NOT EXISTS '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASS';"
sudo mysql -e "ALTER USER '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASS';"
sudo mysql -e "GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'localhost';"
sudo mysql -e "FLUSH PRIVILEGES;"

if [ $? -eq 0 ]; then
    echo "SUCCESS: Database user '$DB_USER' is synchronized with password logic."
else
    echo "FAILURE: Could not access MariaDB root. Please run: sudo mysql and manually create the user."
fi

echo "[2/4] REFRESHING FIREWALL PROTOCOLS..."
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw --force enable
sudo ufw reload

echo "[3/4] RESTARTING LISTENERS..."
PHP_V=$(php -v | head -n 1 | cut -d " " -f 2 | cut -d "." -f 1,2)
sudo systemctl restart nginx
sudo systemctl restart php${PHP_V}-fpm

echo "[4/4] INTERNAL CONNECTIVITY TEST..."
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost)
if [ "$RESPONSE" == "200" ]; then
    echo "STATUS: ONLINE (Code 200)"
else
    echo "STATUS: NODE ERROR (Code $RESPONSE). Check /var/log/nginx/error.log"
fi

echo "===================================================="
echo "   REPAIR COMPLETE. ACCESS: http://petzeustech.duckdns.org"
echo "===================================================="
