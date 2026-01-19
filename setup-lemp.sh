#!/bin/bash
# PETZEUSTECH UNLIMITED NETWORKS - PRODUCTION DEPLOYER v9.0
# Target: Ubuntu 22.04/24.04 (LEMP Stack)

set -e

# Visual Constants
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BOLD='\033[1m'
NC='\033[0m'

clear
echo -e "${BLUE}==================================================================${NC}"
echo -e "${BLUE}${BOLD}   PETZEUSTECH NETWORKS - PRODUCTION VPS DEPLOYER v9.0           ${NC}"
echo -e "${BLUE}==================================================================${NC}"

# 1. User Inputs
read -p "Enter Target Domain (e.g. portal.petzeustech.com): " DOMAIN
read -s -p "Set Master Database Password: " DB_PASS
echo -e "\n"

# 2. Update System & Install Core
echo -e "${BLUE}[1/8] Installing LEMP Architecture...${NC}"
apt update && apt upgrade -y
apt install -y ufw nginx mariadb-server php-fpm php-mysql php-gd php-curl php-json php-mbstring certbot python3-certbot-nginx zip unzip curl

# 3. Security Hardening
echo -e "${BLUE}[2/8] Configuring Firewall...${NC}"
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
echo "y" | ufw enable

# 4. phpMyAdmin Installation
echo -e "${BLUE}[3/8] Deploying phpMyAdmin for Node Management...${NC}"
mkdir -p /var/www/phpmyadmin
cd /var/www/phpmyadmin
PMA_VER="5.2.1"
wget https://files.phpmyadmin.net/phpMyAdmin/${PMA_VER}/phpMyAdmin-${PMA_VER}-all-languages.tar.gz
tar xvf phpMyAdmin-${PMA_VER}-all-languages.tar.gz --strip-components=1
rm phpMyAdmin-${PMA_VER}-all-languages.tar.gz
cp config.sample.inc.php config.inc.php
# Secure Blowfish Secret
SECRET=$(openssl rand -base64 32)
sed -i "s/\$cfg\['blowfish_secret'\] = '';/\$cfg\['blowfish_secret'\] = '$SECRET';/" config.inc.php

# 5. Database Initialization
echo -e "${BLUE}[4/8] Synchronizing MariaDB...${NC}"
DB_NAME="petzeustech_db"
DB_USER="zeus_admin"

mysql -e "CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;"
mysql -e "CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASS}';"
mysql -e "GRANT ALL PRIVILEGES ON \`${DB_NAME}\`.* TO '${DB_USER}'@'localhost';"
mysql -e "FLUSH PRIVILEGES;"

# 6. Project Deployment
echo -e "${BLUE}[5/8] Mapping File Architecture...${NC}"
WEB_ROOT="/var/www/petzeustech"
UPLOAD_DIR="/var/www/petzeustech_uploads" # Outside public root for security

mkdir -p "$WEB_ROOT"
mkdir -p "$UPLOAD_DIR"

# Move files to web root
cp -r ./* "$WEB_ROOT/"

# Update config.php dynamically
cat <<EOF > "$WEB_ROOT/backend/config.php"
<?php
if (session_status() === PHP_SESSION_NONE) { session_start(); }
\$dbhost = 'localhost';
\$dbuser = '$DB_USER';
\$dbpass = '$DB_PASS';
\$dbname = '$DB_NAME';
\$conn = mysqli_connect(\$dbhost, \$dbuser, \$dbpass, \$dbname);
define('UPLOAD_DIR', '$UPLOAD_DIR/');
if (!\$conn) { die("Database Error"); }
?>
EOF

# Import SQL Schema
if [ -f "$WEB_ROOT/backend/schema.sql" ]; then
    mysql "$DB_NAME" < "$WEB_ROOT/backend/schema.sql"
fi

# 7. Nginx Configuration (SPA + PHP Support)
echo -e "${BLUE}[6/8] Configuring Nginx Routing Node...${NC}"
PHP_FPM_VERSION=$(php -v | head -n 1 | cut -d " " -f 2 | cut -d "." -f 1,2)

cat <<EOF > /etc/nginx/sites-available/petzeustech
server {
    listen 80;
    server_name $DOMAIN;
    root $WEB_ROOT;
    index index.html index.php;

    # React SPA Routing
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # phpMyAdmin Mapping
    location /phpmyadmin {
        alias /var/www/phpmyadmin;
        location ~ \.php$ {
            fastcgi_pass unix:/var/run/php/php${PHP_FPM_VERSION}-fpm.sock;
            fastcgi_index index.php;
            include fastcgi_params;
            fastcgi_param SCRIPT_FILENAME \$request_filename;
        }
    }

    # PHP API Support
    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php${PHP_FPM_VERSION}-fpm.sock;
    }

    # Hardening
    location ~ /\.ht { deny all; }
    location /backend/config.php { deny all; }
}
EOF

ln -sf /etc/nginx/sites-available/petzeustech /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl restart nginx

# 8. Final Permissions & SSL
chown -R www-data:www-data "$WEB_ROOT"
chown -R www-data:www-data "$UPLOAD_DIR"
chown -R www-data:www-data /var/www/phpmyadmin
chmod -R 755 "$WEB_ROOT"
chmod -R 775 "$UPLOAD_DIR"

echo -e "${BLUE}[7/8] Attempting SSL Encryption...${NC}"
certbot --nginx -d $DOMAIN --non-interactive --agree-tos -m admin@$DOMAIN --redirect || echo "SSL Skip: Domain propagation pending."

# FINAL OUTPUT
clear
echo -e "${BLUE}==================================================================${NC}"
echo -e "${GREEN}${BOLD}          PETZEUSTECH NETWORKS - DEPLOYMENT SUCCESSFUL            ${NC}"
echo -e "${BLUE}==================================================================${NC}"
echo -e "${BOLD}SITE URL:${NC}        https://$DOMAIN (or http://$DOMAIN)"
echo -e "${BOLD}PHPMYADMIN:${NC}      http://$DOMAIN/phpmyadmin"
echo -e "${BOLD}DB NAME:${NC}         $DB_NAME"
echo -e "${BOLD}DB USER:${NC}         $DB_USER"
echo -e "${BOLD}DB PASSWORD:${NC}     $DB_PASS"
echo -e "${BOLD}ADMIN PANEL:${NC}     admin@petzeustech.com / admin123"
echo -e "${BLUE}------------------------------------------------------------------${NC}"
echo -e "${YELLOW}ACTION REQUIRED: Copy these details and secure them. Done.${NC}"
echo -e "${BLUE}==================================================================${NC}"
