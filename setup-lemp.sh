#!/bin/bash
# PETZEUSTECH UNLIMITED NETWORKS - MASTER DEPLOYER v7.0
# Optimized for: Ubuntu 20.04/22.04/24.04 (Contabo VPS)

set -e

# Visuals
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

clear
echo -e "${BLUE}==================================================================${NC}"
echo -e "${BLUE}   PETZEUSTECH NETWORKS - ULTIMATE VPS ARCHITECT v7.0             ${NC}"
echo -e "${BLUE}==================================================================${NC}"

# 1. User Inputs
read -p "Enter Target Domain (e.g. petzeustech.duckdns.org): " DOMAIN
read -s -p "Set Database Password for 'zeus_admin': " DB_PASS
echo -e "\n"

# 2. Infrastructure Deployment
echo -e "${BLUE}[1/8] Deploying LEMP Stack Components...${NC}"
apt update && apt upgrade -y
apt install -y ufw nginx mariadb-server php-fpm php-mysql php-gd php-curl certbot python3-certbot-nginx zip unzip curl

# 3. Network Gateway (Firewall) - CRITICAL FIX FOR CONNECTION CLOSED
echo -e "${BLUE}[2/8] Hardening Network Gateways (Firewall)...${NC}"
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 'Nginx Full'
echo "y" | ufw enable
echo -e "${GREEN}Ports 80 & 443 are now OPEN.${NC}"

# 4. PHP Intelligence
echo -e "${BLUE}[3/8] Synchronizing PHP Runtimes...${NC}"
PHP_VAL=$(php -v | head -n 1 | cut -d " " -f 2 | cut -d "." -f 1,2)
echo -e "${GREEN}Detected Active Runtime: PHP $PHP_VAL${NC}"

# 5. File System Orchestration
echo -e "${BLUE}[4/8] Mapping Web Directory Architecture...${NC}"
TARGET_DIR="/var/www/petzeustech"
CURRENT_DIR=$(pwd)

# Create clean structure
mkdir -p "$TARGET_DIR/uploads"
mkdir -p "$TARGET_DIR/public"

# Relocate files from current directory to /var/www if needed
if [ "$CURRENT_DIR" != "$TARGET_DIR/public" ]; then
    echo -e "${YELLOW}Relocating project nodes to $TARGET_DIR/public...${NC}"
    cp -r ./* "$TARGET_DIR/public/"
fi

# 6. Database Synchronization
echo -e "${BLUE}[5/8] Initializing MariaDB Secure Cluster...${NC}"
DB_NAME="petzeustech_db"
DB_USER="zeus_admin"

mysql -e "CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;"
mysql -e "CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASS}';"
mysql -e "GRANT ALL PRIVILEGES ON \`${DB_NAME}\`.* TO '${DB_USER}'@'localhost';"
mysql -e "FLUSH PRIVILEGES;"

# Ingest Schema
if [ -f "$TARGET_DIR/public/backend/schema.sql" ]; then
    mysql "$DB_NAME" < "$TARGET_DIR/public/backend/schema.sql"
    echo -e "${GREEN}Matrix Schema Injected Successfully.${NC}"
fi

# 7. Nginx Virtual Host Configuration
echo -e "${BLUE}[6/8] Configuring Nginx Routing Node...${NC}"
cat <<EOF > /etc/nginx/sites-available/petzeustech
server {
    listen 80;
    server_name $DOMAIN;
    root $TARGET_DIR/public;
    index index.php index.html;

    # Certbot Validation Support
    location /.well-known/acme-challenge/ {
        root $TARGET_DIR/public;
        allow all;
    }

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php${PHP_VAL}-fpm.sock;
    }

    location /uploads {
        deny all;
    }
}
EOF

ln -sf /etc/nginx/sites-available/petzeustech /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl restart nginx

# 8. Ownership & Permissions
echo -e "${BLUE}[7/8] Calibrating System Permissions...${NC}"
chown -R www-data:www-data $TARGET_DIR
chmod -R 755 $TARGET_DIR
chmod -R 775 $TARGET_DIR/uploads

# 9. SSL Provisioning (Optional but Recommended)
echo -e "${BLUE}[8/8] Securing Protocol via Let's Encrypt...${NC}"
certbot --nginx -d $DOMAIN --non-interactive --agree-tos -m admin@$DOMAIN --redirect --expand || echo -e "${RED}Certbot failed. Site remains on HTTP (Port 80).${NC}"

# FINAL REVEAL
clear
echo -e "${BLUE}==================================================================${NC}"
echo -e "${GREEN}          PETZEUSTECH NETWORKS - DEPLOYMENT SUCCESSFUL            ${NC}"
echo -e "${BLUE}==================================================================${NC}"
echo -e "${YELLOW}MASTER DOMAIN:   ${NC} http://$DOMAIN"
echo -e "${YELLOW}INTERNAL PATH:   ${NC} $TARGET_DIR/public"
echo -e "${YELLOW}SECURE STORAGE:  ${NC} $TARGET_DIR/uploads"
echo -e "${YELLOW}PHP RUNTIME:     ${NC} PHP $PHP_VAL (Socket Connected)"
echo -e "${YELLOW}DB NAME:         ${NC} $DB_NAME"
echo -e "${YELLOW}DB USER:         ${NC} $DB_USER"
echo -e "${YELLOW}DB PASS:         ${NC} [Hidden for Security]"
echo -e "${BLUE}------------------------------------------------------------------${NC}"
echo -e "${GREEN}STATUS:          ONLINE & SYNCHRONIZED${NC}"
echo -e "${BLUE}==================================================================${NC}"
echo -e "${YELLOW}If you still see 'Connection Closed', please check your VPS firewall${NC}"
echo -e "${YELLOW}dashboard on Contabo (Cloud Firewall) and open 80/443.${NC}"
echo -e "${BLUE}==================================================================${NC}"
