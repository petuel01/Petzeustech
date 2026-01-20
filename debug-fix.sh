#!/bin/bash
# PETZEUSTECH DIAGNOSTIC & REPAIR TOOL v3.0
# Optimized for secured MariaDB environments.

echo "===================================================="
echo "   PETZEUSTECH ARCHITECT: DIAGNOSTIC SEQUENCE"
echo "===================================================="

DB_NAME="petzeustech_db"
DB_USER="zeus_admin"
DB_PASS="Petuel99.5"

echo "[1/4] SYNCHRONIZING DATABASE NODE..."

# Test if root access requires a password
if sudo mysql -e "exit" >/dev/null 2>&1; then
    MYSQL_CMD="sudo mysql"
else
    echo "(!) MariaDB root requires a password."
    read -s -p "Enter MariaDB Root Password: " ROOT_DB_PASS
    echo ""
    MYSQL_CMD="mysql -u root -p$ROOT_DB_PASS"
fi

# Attempt repairs
$MYSQL_CMD -e "CREATE DATABASE IF NOT EXISTS $DB_NAME;" 2>/dev/null
$MYSQL_CMD -e "CREATE USER IF NOT EXISTS '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASS';" 2>/dev/null
$MYSQL_CMD -e "ALTER USER '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASS';" 2>/dev/null
$MYSQL_CMD -e "GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'localhost';" 2>/dev/null
$MYSQL_CMD -e "FLUSH PRIVILEGES;" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "SUCCESS: Database node '$DB_NAME' and user '$DB_USER' are synced."
else
    echo "FAILURE: Database sync failed. Check if your Root Password is correct."
    echo "Manual fix: Run 'sudo mysql' and paste the GRANT commands manually."
fi

echo "[2/4] REFRESHING SYSTEM PERMISSIONS..."
sudo chown -R www-data:www-data /var/www/Petzeustech
sudo chown -R www-data:www-data /var/www/petzeustech_uploads
sudo chmod -R 755 /var/www/Petzeustech
sudo chmod -R 775 /var/www/petzeustech_uploads

echo "[3/4] RESTARTING LISTENERS..."
PHP_V=$(php -v | head -n 1 | cut -d " " -f 2 | cut -d "." -f 1,2)
sudo systemctl restart nginx
sudo systemctl restart php${PHP_V}-fpm

echo "[4/4] INTERNAL CONNECTIVITY TEST..."
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost)

if [ "$RESPONSE" == "200" ]; then
    echo "STATUS: ONLINE (Code 200)"
else
    echo "STATUS: NODE ERROR (Code $RESPONSE)"
    echo "--- LATEST ERROR LOG ENTRIES ---"
    sudo tail -n 5 /var/log/nginx/error.log
fi

echo "===================================================="
echo "   REPAIR COMPLETE. ACCESS: http://petzeustech.duckdns.org"
echo "===================================================="
