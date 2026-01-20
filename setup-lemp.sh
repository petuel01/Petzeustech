#!/bin/bash
# PETZEUSTECH INFRASTRUCTURE ENGINE v21.0
# High-Velocity Deployment Script

set -e
DOMAIN="petzeustech.duckdns.org"
DB_PASS="Petuel99.5"
WEB_ROOT="/var/www/petzeustech"
UPLOAD_ROOT="/var/www/petzeustech_uploads"

echo "Syncing Protocol Listeners for $DOMAIN..."

# 1. INSTALL STACK
apt update && apt install -y nginx mariadb-server php-fpm php-mysql git ufw

# 2. FIREWALL SETUP
ufw allow 80/tcp
ufw allow 22/tcp
ufw --force enable

# 3. DATABASE INFRASTRUCTURE
echo "Creating Secure Database Nodes..."
mysql -u root <<EOF
CREATE DATABASE IF NOT EXISTS petzeustech_db;
CREATE USER IF NOT EXISTS 'zeus_admin'@'localhost' IDENTIFIED BY '$DB_PASS';
GRANT ALL PRIVILEGES ON petzeustech_db.* TO 'zeus_admin'@'localhost';
FLUSH PRIVILEGES;
EOF

if [ -f "$WEB_ROOT/backend/schema.sql" ]; then
    mysql -u root petzeustech_db < "$WEB_ROOT/backend/schema.sql"
fi

# 4. NGINX VIRTUAL HOST
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

    location /backend/ {
        allow all;
    }
}
EOF

ln -sf /etc/nginx/sites-available/petzeustech /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl restart nginx

# 5. PERMISSIONS
mkdir -p "$UPLOAD_ROOT"
chown -R www-data:www-data "$WEB_ROOT"
chown -R www-data:www-data "$UPLOAD_ROOT"
chmod -R 755 "$WEB_ROOT"
chmod -R 775 "$UPLOAD_ROOT"

echo "Infrastructure Core: ONLINE."
