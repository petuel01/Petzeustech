#!/bin/bash
# PETZEUSTECH UNLIMITED NETWORKS - SMART DEPLOYMENT v5.0
# Optimized for Ubuntu (Contabo VPS)

set -e

# Visuals
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

clear
echo -e "${BLUE}==================================================${NC}"
echo -e "${BLUE}   PETZEUSTECH NETWORKS - SMART VPS DEPLOYER      ${NC}"
echo -e "${BLUE}==================================================${NC}"

# 1. User Inputs
read -p "Target Domain (e.g. portal.petzeustech.com): " DOMAIN
read -p "DB Password for new user: " DB_PASS

# 2. System Prep
echo -e "${BLUE}[1/6] Installing LEMP Architecture...${NC}"
apt update && apt upgrade -y
apt install -y nginx mariadb-server php-fpm php-mysql php-gd php-curl certbot python3-certbot-nginx zip unzip

# 3. Smart Relocation
echo -e "${BLUE}[2/6] Orchestrating File System...${NC}"
TARGET_DIR="/var/www/petzeustech"
CURRENT_DIR=$(pwd)

# Create the target structure
mkdir -p "$TARGET_DIR/uploads"
mkdir -p "$TARGET_DIR/public"

# If we are not currently in the target dir, move files there
if [ "$CURRENT_DIR" != "$TARGET_DIR/public" ] && [ "$CURRENT_DIR" != "$TARGET_DIR" ]; then
    echo -e "${BLUE}Relocating project from $CURRENT_DIR to $TARGET_DIR...${NC}"
    # Move everything to public folder (standard for web security)
    cp -r ./* "$TARGET_DIR/public/"
    # Move the backend folder to its proper place if it's not already inside public
    # (In our structure, it's already inside public)
fi

# 4. Database Initialization
echo -e "${BLUE}[3/6] Configuring MariaDB Cluster...${NC}"
DB_NAME="petzeustech_db"
DB_USER="zeus_admin"

mysql -e "CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;"
mysql -e "CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASS}';"
mysql -e "GRANT ALL PRIVILEGES ON \`${DB_NAME}\`.* TO '${DB_USER}'@'localhost';"
mysql -e "FLUSH PRIVILEGES;"

# Import schema
if [ -f "$TARGET_DIR/public/backend/schema.sql" ]; then
    mysql "$DB_NAME" < "$TARGET_DIR/public/backend/schema.sql"
    echo -e "${GREEN}Database schema injected.${NC}"
fi

# 5. Nginx Gateway Config
echo -e "${BLUE}[4/6] Mapping Nginx Virtual Host...${NC}"
cat <<EOF > /etc/nginx/sites-available/petzeustech
server {
    listen 80;
    server_name $DOMAIN;
    root $TARGET_DIR/public;
    index index.html index.php;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
    }

    # Block access to the secure uploads folder
    location /uploads {
        deny all;
    }
}
EOF

ln -sf /etc/nginx/sites-available/petzeustech /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl restart nginx

# 6. Permissions & Security
echo -e "${BLUE}[5/6] Hardening Permissions...${NC}"
chown -R www-data:www-data $TARGET_DIR
chmod -R 755 $TARGET_DIR
chmod -R 775 $TARGET_DIR/uploads

# 7. SSL via Let's Encrypt
echo -e "${BLUE}[6/6] Securing with SSL...${NC}"
# Note: This will fail if DNS is not yet pointed to the VPS IP
certbot --nginx -d $DOMAIN --non-interactive --agree-tos -m admin@$DOMAIN --redirect || echo -e "${RED}SSL Failed. Ensure DNS A-Record points to this IP.${NC}"

echo -e "${GREEN}==================================================${NC}"
echo -e "${GREEN}DEPLOYMENT COMPLETE${NC}"
echo -e "${GREEN}Portal: https://$DOMAIN${NC}"
echo -e "${GREEN}Files Location: $TARGET_DIR/public${NC}"
echo -e "${GREEN}Secure Storage: $TARGET_DIR/uploads${NC}"
echo -e "${GREEN}==================================================${NC}"
