#!/bin/bash
# PETZEUSTECH INFRASTRUCTURE ENGINE v19.0
# ASSUMPTION: This script is running INSIDE /var/www/petzeustech

set -e
DOMAIN="petzeustech.duckdns.org"
DB_PASS="Petuel99.5"
WEB_ROOT="/var/www/petzeustech"
UPLOAD_ROOT="/var/www/petzeustech_uploads"

echo "Setting up Protocol Listeners for $DOMAIN..."

# 1. Install/Update Packages
apt update && apt install -y nginx mariadb-server php-fpm php-mysql

# 2. Nginx Configuration
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

    location /uploads/ {
        deny all;
        return 403;
    }
}
EOF

ln -sf /etc/nginx/sites-available/petzeustech /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl restart nginx

# 3. Database Sync
mysql -u root -p"$DB_PASS" -e "CREATE DATABASE IF NOT EXISTS petzeustech_db;" || true
if [ -f "backend/schema.sql" ]; then
    mysql -u root -p"$DB_PASS" petzeustech_db < backend/schema.sql
fi

# 4. Global Permissions (Direct /var/www strategy)
mkdir -p "$UPLOAD_ROOT"
chown -R www-data:www-data "$WEB_ROOT"
chown -R www-data:www-data "$UPLOAD_ROOT"
chmod -R 755 "$WEB_ROOT"
chmod -R 775 "$UPLOAD_ROOT"

echo "Infrastructure synchronized successfully."
