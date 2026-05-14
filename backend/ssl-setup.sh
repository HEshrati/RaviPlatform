#!/bin/bash
set -e

GREEN='\033[0;32m'
NC='\033[0m'

echo "=============================================="
echo "  SSL Certificate Setup"
echo "  Domain: raaviiplatform.com"
echo "=============================================="
echo ""

if ! command -v certbot &> /dev/null; then
    echo "Installing Certbot..."
    apt update
    apt install -y certbot
fi

echo "Stopping nginx temporarily..."
docker-compose stop nginx

echo "Obtaining SSL certificate..."
certbot certonly --standalone -d raaviiplatform.com -d www.raaviiplatform.com --non-interactive --agree-tos --email admin@raaviiplatform.com

echo "Copying certificates..."
cp /etc/letsencrypt/live/raaviiplatform.com/fullchain.pem nginx/ssl/
cp /etc/letsencrypt/live/raaviiplatform.com/privkey.pem nginx/ssl/
chmod 644 nginx/ssl/*.pem

echo "Starting nginx..."
docker-compose start nginx

echo -e "${GREEN}✓ SSL certificates installed successfully!${NC}"
echo ""
echo "Setting up auto-renewal..."
(crontab -l 2>/dev/null; echo "0 0 * * * certbot renew --quiet && docker-compose -f /d/programming/nextjs/raavi-platform/docker-compose.yml restart nginx") | crontab -

echo -e "${GREEN}✓ Auto-renewal configured!${NC}"
