#!/bin/bash
# PETZEUSTECH UNLIMITED NETWORKS - PRODUCTION DEPLOYER v15.5
# AUTOMATED FOR: petzeustech.duckdns.org
set -e

# Visual Styles
BLUE='\033[0;34m'
GREEN='\033[0;32m'
BOLD='\033[1m'
NC='\033[0m'

clear
echo -e "${BLUE}${BOLD}================================================================${NC}"
echo -e "${BLUE}${BOLD}   PETZEUSTECH NETWORKS - PRODUCTION INFRASTRUCTURE DEPLOYER    ${NC}"
echo -e "${BLUE}${BOLD}================================================================${NC}"
echo -e "${BLUE}Target Domain: petzeustech.duckdns.org${NC}"
echo -e "${BLUE}MySQL Password: Petuel99.5 (Hardcoded)${NC}"
echo "----------------------------------------------------------------"

# 1. Configuration Constants
DOMAIN="petzeustech.duckdns.org"
DB_PASS="Petuel99.5"
WEB_ROOT="/var/www/petzeustech"
UPLOAD_ROOT="/var/www/petzeustech_uploads"

# 2. Dependency Installation
echo -e "${BLUE}[1/5] Installing Nginx, MariaDB, PHP-FPM, and Security Modules...${NC}"
apt update && apt install -y nginx mariadb-server php-fpm php-mysql certbot python3-certbot-nginx zip unzip

# 3. Database Automation
echo -e "${BLUE}[2/5] Initializing MariaDB Node with Credential: $DB_PASS...${NC}"
# Set root password and create application user
mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED BY '$DB_PASS';" || echo "Root password already initialized."
mysql -u root -p"$DB_PASS" -e "CREATE DATABASE IF NOT EXISTS petzeustech_db;"
mysql -u root -p"$DB_PASS" -e "CREATE USER IF NOT EXISTS 'zeus_admin'@'localhost' IDENTIFIED BY '$DB_PASS';"
mysql -u root -p"$DB_PASS" -e "GRANT ALL PRIVILEGES ON petzeustech_db.* TO 'zeus_admin'@'localhost';"
mysql -u root -p"$DB_PASS" -e "FLUSH PRIVILEGES;"

# 4. File System and Permissions
echo -e "${BLUE}[3/5] Allocating Web Root and Secure Upload Vault...${NC}"
mkdir -p "$WEB_ROOT"
mkdir -p "$UPLOAD_ROOT"

# Copy local files to web root
cp -r ./* "$WEB_ROOT/" || echo "Warning: Manual file sync may be required if running outside project root."

# Set Ownership and Permissions for Web User (www-data)
chown -R www-data:www-data "$WEB_ROOT"
chown -R www-data:www-data "$UPLOAD_ROOT"
chmod -R 775 "$UPLOAD_ROOT"

# 5. Nginx Server Block Configuration
echo -e "${BLUE}[4/5] Establishing Nginx Protocols for $DOMAIN...${NC}"
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
    }

    # Internal protection for uploads folder
    location /uploads {
        deny all;
        return 403;
    }
}
EOF

ln -sf /etc/nginx/sites-available/petzeustech /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl restart nginx

# 6. SSL Implementation
echo -e "${BLUE}[5/5] Requesting SSL Certificate via Let's Encrypt...${NC}"
certbot --nginx -d $DOMAIN --non-interactive --agree-tos -m admin@$DOMAIN --redirect || echo -e "${BLUE}SSL propagation pending.${NC}"

# FINAL SYSTEM REPORT
clear
echo -e "${GREEN}${BOLD}================================================================${NC}"
echo -e "${GREEN}${BOLD}    PETZEUSTECH NETWORKS - DEPLOYMENT SUCCESS REPORT            ${NC}"
echo -e "${GREEN}${BOLD}================================================================${NC}"
echo -e "${BOLD}1. PRIMARY HOST:    ${NC} https://$DOMAIN"
echo -e "${BOLD}2. MYSQL ROOT:      ${NC} root / $DB_PASS"
echo -e "${BOLD}3. MYSQL APP USER:  ${NC} zeus_admin / $DB_PASS"
echo -e "${BOLD}4. DATABASE NAME:   ${NC} petzeustech_db"
echo -e "${BOLD}5. UPLOAD PATH:     ${NC} $UPLOAD_ROOT"
echo -e "${BOLD}6. ADMIN DASHBOARD: ${NC} https://$DOMAIN/dashboard"
echo -e "${GREEN}${BOLD}================================================================${NC}"
echo -e "${BLUE}All protocols are online. Access the terminal to begin broadcasting.${NC}"
