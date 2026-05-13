#!/bin/bash

################################################################################
# یک کامند کامل برای Deploy روی سرور راوی
# فقط کپی و پیست کنید!
################################################################################

echo "=============================================="
echo "  Ravi Platform - One-Command Deployment"
echo "  Server: 217.114.40.38"
echo "  Domain: raaviiplatform.com"
echo "=============================================="
echo ""

# رنگ‌ها
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_step() {
    echo ""
    echo -e "${BLUE}===================================================${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}===================================================${NC}"
    echo ""
}

print_success() { echo -e "${GREEN}✓ $1${NC}"; }
print_error() { echo -e "${RED}✗ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠ $1${NC}"; }

# تنظیمات سرور
SERVER_IP="217.114.40.38"
SERVER_USER="root"
DOMAIN="raaviiplatform.com"

print_step "مرحله 1: بررسی اتصال به سرور"

echo "Testing SSH connection to ${SERVER_IP}..."
if ssh -o ConnectTimeout=5 -o BatchMode=yes ${SERVER_USER}@${SERVER_IP} exit 2>/dev/null; then
    print_success "SSH connection successful!"
else
    print_warning "SSH connection requires password/key authentication"
    echo "Please make sure you can connect: ssh ${SERVER_USER}@${SERVER_IP}"
    read -p "Press Enter to continue when ready..."
fi

print_step "مرحله 2: آپلود اسکریپت راه‌اندازی به سرور"

# ایجاد اسکریپت موقت برای سرور
cat > /tmp/ravi-server-setup.sh << 'ENDSCRIPT'
#!/bin/bash
set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_success() { echo -e "${GREEN}✓ $1${NC}"; }
print_error() { echo -e "${RED}✗ $1${NC}"; }
print_info() { echo -e "${BLUE}ℹ $1${NC}"; }

echo "=============================================="
echo "  Ravi Platform - Server Setup"
echo "=============================================="

# به‌روزرسانی سیستم
print_info "Updating system..."
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get upgrade -y -qq

# نصب ابزارهای مورد نیاز
print_info "Installing required tools..."
apt-get install -y -qq curl wget git ufw fail2ban openssl

# نصب Docker
if ! command -v docker &> /dev/null; then
    print_info "Installing Docker..."
    curl -fsSL https://get.docker.com -o /tmp/get-docker.sh
    sh /tmp/get-docker.sh
    rm /tmp/get-docker.sh
else
    print_success "Docker already installed"
fi

# تست Docker
docker --version
docker compose version

# تنظیم Firewall
print_info "Configuring firewall..."
ufw --force enable
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw status

# فعال‌سازی Fail2Ban
systemctl enable fail2ban
systemctl start fail2ban

print_success "Server preparation complete!"
ENDSCRIPT

# آپلود به سرور
print_info "Uploading setup script to server..."
scp /tmp/ravi-server-setup.sh ${SERVER_USER}@${SERVER_IP}:/tmp/
rm /tmp/ravi-server-setup.sh

print_step "مرحله 3: آماده‌سازی سرور"

ssh ${SERVER_USER}@${SERVER_IP} 'bash /tmp/ravi-server-setup.sh'

print_step "مرحله 4: بررسی وجود فایل complete-setup.sh"

if [ ! -f "complete-setup.sh" ]; then
    print_error "فایل complete-setup.sh پیدا نشد!"
    echo ""
    echo "لطفاً ابتدا فایل complete-setup.sh را دانلود کنید و در همین پوشه قرار دهید."
    echo "سپس این اسکریپت را مجدداً اجرا کنید."
    exit 1
fi

print_success "فایل complete-setup.sh پیدا شد"

print_step "مرحله 5: آپلود فایل‌ها به سرور"

# ایجاد دایرکتوری روی سرور
ssh ${SERVER_USER}@${SERVER_IP} 'mkdir -p /opt/ravi'

# آپلود اسکریپت اصلی
print_info "Uploading complete-setup.sh..."
scp complete-setup.sh ${SERVER_USER}@${SERVER_IP}:/opt/ravi/

# اگر backend-fixed.zip موجود است، آپلود کن
if [ -f "backend-fixed.zip" ]; then
    print_info "Uploading backend..."
    scp backend-fixed.zip ${SERVER_USER}@${SERVER_IP}:/opt/ravi/
fi

# اگر production-ready.tar.gz موجود است، آپلود کن
if [ -f "production-ready.tar.gz" ]; then
    print_info "Uploading production package..."
    scp production-ready.tar.gz ${SERVER_USER}@${SERVER_IP}:/opt/ravi/
fi

print_step "مرحله 6: اجرای راه‌اندازی روی سرور"

ssh ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
cd /opt/ravi

# اگر بسته production موجود است، استخراج کن
if [ -f "production-ready.tar.gz" ]; then
    echo "Extracting production package..."
    tar -xzf production-ready.tar.gz
    cd deployment-ready || cd /opt/ravi
fi

# اگر backend-fixed.zip موجود است، استخراج کن
if [ -f "backend-fixed.zip" ]; then
    echo "Extracting backend..."
    unzip -q -o backend-fixed.zip -d backend-temp
    mkdir -p backend
    cp -r backend-temp/* backend/ 2>/dev/null || cp -r backend-temp/backend-fixed/* backend/
    rm -rf backend-temp
fi

# اجرای اسکریپت راه‌اندازی
chmod +x complete-setup.sh
./complete-setup.sh

echo ""
echo "=============================================="
echo "  Initial Setup Complete!"
echo "=============================================="
echo ""
echo "Created files:"
ls -lh
echo ""
ENDSSH

print_step "مرحله 7: راهنمای مراحل بعدی"

echo ""
echo -e "${GREEN}✅ راه‌اندازی اولیه کامل شد!${NC}"
echo ""
echo -e "${YELLOW}مراحل بعدی:${NC}"
echo ""
echo "1️⃣  SSH به سرور:"
echo "   ssh ${SERVER_USER}@${SERVER_IP}"
echo ""
echo "2️⃣  رفتن به پوشه پروژه:"
echo "   cd /opt/ravi"
echo ""
echo "3️⃣  بررسی فایل SECRETS.txt:"
echo "   cat SECRETS.txt"
echo ""
echo "4️⃣  کپی کدهای Backend و Frontend (اگر قبلاً آپلود نشده):"
echo "   # از کامپیوتر محلی:"
echo "   scp -r backend/* ${SERVER_USER}@${SERVER_IP}:/opt/ravi/backend/"
echo "   scp -r frontend/* ${SERVER_USER}@${SERVER_IP}:/opt/ravi/frontend/"
echo ""
echo "5️⃣  روی سرور، اجرای setup:"
echo "   ./setup.sh"
echo ""
echo "6️⃣  نصب SSL Certificate:"
echo "   ./ssl-setup.sh"
echo ""
echo "7️⃣  تست سایت:"
echo "   https://${DOMAIN}"
echo "   https://${DOMAIN}/api/health"
echo ""
echo -e "${BLUE}💡 نکات مهم:${NC}"
echo "   - فایل SECRETS.txt حاوی تمام رمزها و کلیدها است"
echo "   - ZarinPal merchant ID را در .env files تنظیم کنید"
echo "   - DNS باید به ${SERVER_IP} اشاره کند"
echo ""
print_success "آماده برای Deploy! 🚀"
echo ""

# نمایش دستور SSH برای سهولت
echo -e "${GREEN}برای ادامه، این دستور را اجرا کنید:${NC}"
echo "ssh ${SERVER_USER}@${SERVER_IP}"
