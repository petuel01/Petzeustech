#!/bin/bash
# PETZEUSTECH UNLIMITED NETWORKS - PRODUCTION DEPLOYMENT v4.0
set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

clear
echo -e "${BLUE}PETZEUSTECH NETWORKS - CONTABO VPS NODE SYNC${NC}"

# Inputs
read -p "Domain (portal.yourdomain.com): " DOMAIN
read -p "DB Name: " DB_NAME
read -p "DB User: " DB_USER
read -s -p "DB Password: " DB_PASS
echo -e "\n"
read -p "Admin Email: " ADMIN_EMAIL

# Install Stack
apt update && apt upgrade -y
apt install nginx mariadb-server php-fpm php-mysql php-gd php-curl certbot python3-certbot-nginx -y

# DB Setup
mysql -e "CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;"
mysql -e "GRANT ALL PRIVILEGES ON \`${DB_NAME}\`.* TO '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASS}';"
mysql -e "FLUSH PRIVILEGES;"

# Create Protected Uploads (Above Public Root)
mkdir -p /var/www/petzeustech/uploads
mkdir -p /var/www/petzeustech/public

# Generate config.php
cat <<EOF > /var/www/petzeustech/public/backend/config.php
<?php
session_start();
\$dbhost = 'localhost';
\$dbuser = '$DB_USER';
\$dbpass = '$DB_PASS';
\$dbname = '$DB_NAME';
\$admin_email = '$ADMIN_EMAIL';
\$conn = mysqli_connect(\$dbhost, \$dbuser, \$dbpass, \$dbname);
if (!\$conn) { die("Database cluster offline."); }
?>
EOF

# Nginx Config
cat <<EOF > /etc/nginx/sites-available/petzeustech
server {
    listen 80;
    server_name $DOMAIN;
    root /var/www/petzeustech/public;
    index index.html index.php;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock; # Adjust version if needed
    }
    
    # Block direct access to uploads if moved into public
    location /uploads/ {
        deny all;
        return 403;
    }
}
EOF

ln -sf /etc/nginx/sites-available/petzeustech /etc/nginx/sites-enabled/
nginx -t && systemctl restart nginx

# Permissions
chown -R www-data:www-data /var/www/petzeustech
chmod -R 755 /var/www/petzeustech
chmod -R 775 /var/www/petzeustech/uploads

# SSL
certbot --nginx -d $DOMAIN --non-interactive --agree-tos --register-unsafely-without-email

echo -e "${GREEN}DEPLOYMENT PROTOCOL COMPLETE.${NC}"
echo -e "Upload your React build files to /var/www/petzeustech/public"
