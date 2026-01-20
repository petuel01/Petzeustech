#!/bin/bash
# PETZEUSTECH INFRASTRUCTURE ENGINE v20.0
# Optimized for high-speed protocol delivery.

set -e
DOMAIN="petzeustech.duckdns.org"
DB_PASS="Petuel99.5"
WEB_ROOT="/var/www/petzeustech"
UPLOAD_ROOT="/var/www/petzeustech_uploads"

echo "Syncing Protocol Listeners for $DOMAIN..."

# 1. DEPENDENCY CHECK
apt update && apt install -y nginx mariadb-server php-fpm php-mysql git

# 2. NGINX VIRTUAL HOST CONFIGURATION
PHP_V=$(php -v | head -n 1 | cut -d " " -f 2 | cut -d "." -f 1,2)
cat <<EOF > /etc/nginx/sites-available/petzeustech
server {
    listen 80;
    server_name $DOMAIN;
    root $WEB_ROOT;
    index index.html index.php;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php${PHP_V}-fpm.sock;
        fastcgi_param SCRIPT_FILENAME \$document_root\$fastcgi_script_name;
        include fastcgi_params;
    }

    # Internal Security for Configs
    location /backend/ {
        allow all;
    }
}
EOF

# Link and Reload Nginx
ln -sf /etc/nginx/sites-available/petzeustech /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl restart nginx

# 3. DATABASE INFRASTRUCTURE
echo "Synchronizing MariaDB Nodes..."
mysql -u root -p"$DB_PASS" -e "CREATE DATABASE IF NOT EXISTS petzeustech_db;" || true
if [ -f "backend/schema.sql" ]; then
    mysql -u root -p"$DB_PASS" petzeustech_db < backend/schema.sql
fi

# 4. FINAL PERMISSION RESET (The 'Best Solution' for ownership issues)
echo "Finalizing ownership for www-data cluster..."
mkdir -p "$UPLOAD_ROOT"
# Give the webserver ownership so the app functions correctly
chown -R www-data:www-data "$WEB_ROOT"
chown -R www-data:www-data "$UPLOAD_ROOT"
# Ensure the deploy script can still interact with the directory next time
chmod -R 755 "$WEB_ROOT"
chmod -R 775 "$UPLOAD_ROOT"

echo "Infrastructure Core: ONLINE."
