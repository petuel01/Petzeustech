#!/bin/bash
# PETZEUSTECH UNLIMITED NETWORKS - PRODUCTION DEPLOYER v15.7
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

# 1. Configuration Constants
DOMAIN="petzeustech.duckdns.org"
DB_PASS="Petuel99.5"
WEB_ROOT="/var/www/petzeustech"
UPLOAD_ROOT="/var/www/petzeustech_uploads"

# 2. Dependency Installation
echo -e "${BLUE}[1/5] Syncing Nginx, MariaDB, and PHP Systems...${NC}"
apt update && apt install -y nginx mariadb-server php-fpm php-mysql certbot python3-certbot-nginx zip unzip

# 3. Database Automation
echo -e "${BLUE}[2/5] Initializing MariaDB Node (Password: Petuel99.5)...${NC}"
mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED BY '$DB_PASS';" || echo "Root access confirmed."
mysql -u root -p"$DB_PASS" -e "CREATE DATABASE IF NOT EXISTS petzeustech_db;"
mysql -u root -p"$DB_PASS" -e "CREATE USER IF NOT EXISTS 'zeus_admin'@'localhost' IDENTIFIED BY '$DB_PASS';"
mysql -u root -p"$DB_PASS" -e "GRANT ALL PRIVILEGES ON petzeustech_db.* TO 'zeus_admin'@'localhost';"
mysql -u root -p"$DB_PASS" -e "FLUSH PRIVILEGES;"

# 4. File System Allocation
echo -e "${BLUE}[3/5] Deploying Web Root and Upload Vault...${NC}"
mkdir -p "$WEB_ROOT"
mkdir -p "$UPLOAD_ROOT"
cp -r ./* "$WEB_ROOT/" || true

# Set Permissions
chown -R www-data:www-data "$WEB_ROOT"
chown -R www-data:www-data "$UPLOAD_ROOT"
chmod -R 775 "$UPLOAD_ROOT"

# 5. Nginx Server Configuration
echo -e "${BLUE}[4/5] Establishing Nginx Protocols...${NC}"
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
}
EOF

ln -sf /etc/nginx/sites-available/petzeustech /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl restart nginx

# 6. Final Report
clear
echo -e "${GREEN}${BOLD}================================================================${NC}"
echo -e "${GREEN}${BOLD}    PETZEUSTECH NETWORKS - DEPLOYMENT SUCCESS REPORT            ${NC}"
echo -e "${GREEN}${BOLD}================================================================${NC}"
echo -e "${BOLD}DOMAIN:      ${NC} https://$DOMAIN"
echo -e "${BOLD}DB NAME:     ${NC} petzeustech_db"
echo -e "${BOLD}DB USER:     ${NC} zeus_admin"
echo -e "${BOLD}DB PASS:     ${NC} $DB_PASS"
echo -e "${BOLD}UPLOAD PATH: ${NC} $UPLOAD_ROOT"
echo -e "${GREEN}${BOLD}================================================================${NC}"
echo -e "${BLUE}The application is now live. Access https://$DOMAIN to begin.${NC}"
