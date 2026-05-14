#!/bin/bash
set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 دپلوی بکند راوی"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# ساخت فولدرهای لازم
mkdir -p logs uploads

# build و اجرا
docker compose --env-file .env.production up -d --build

echo ""
echo "⏳ صبر برای آماده شدن سرویس‌ها..."
sleep 10

# اجرای migrations
echo "🔄 اجرای migrations..."
docker exec ravi-backend node -e "
const { AppDataSource } = require('./dist/data-source');
AppDataSource.initialize()
  .then(() => AppDataSource.runMigrations())
  .then((m) => { console.log('✅ Migrations اجرا شد:', m.length, 'migration'); process.exit(0); })
  .catch((e) => { console.error('❌ خطا:', e.message); process.exit(1); });
"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ بکند با موفقیت دپلوی شد!"
echo "🔗 Health check: curl http://localhost:4000/api/health"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
