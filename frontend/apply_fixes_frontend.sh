#!/bin/bash
# ───────────────────────────────────────────────────────────
# اسکریپت اعمال تغییرات صفحه رزرو راوی
# Apply Ravi reservation page changes
# ───────────────────────────────────────────────────────────
set -e

# ── تنظیم مسیر ──────────────────────────────────────────────
# آدرس پوشه frontend خود را اینجا بنویسید
FRONTEND_DIR="${1:-./frontend}"

TARGET="$FRONTEND_DIR/src/app/events/page.tsx"

if [ ! -f "$TARGET" ]; then
  echo "❌ فایل پیدا نشد: $TARGET"
  echo "   مثال استفاده:  bash apply_changes.sh /path/to/frontend"
  exit 1
fi

echo "📦 بکاپ فایل اصلی..."
cp "$TARGET" "${TARGET}.bak"
echo "   ✅ بکاپ: ${TARGET}.bak"

echo "🔄 اعمال فایل جدید..."
cp "$(dirname "$0")/events_page.tsx" "$TARGET"
echo "   ✅ فایل جدید کپی شد."

echo ""
echo "✅ تغییرات اعمال شد!"
echo ""
echo "📝 خلاصه تغییرات:"
echo "   1. حذف بک‌گراند سورمه‌ای از صفحه رزرو (تبدیل به bg-gray-50 روشن)"
echo "   2. وضوح تصاویر دسته‌بندی: opacity از 30% به 95%، حذف mixBlendMode"
echo "   3. وضوح تصاویر همنشینی: حذف overlay تیره، gradient فقط در پایین"
echo "   4. دسته‌بندی‌های فعال به‌ازای هر شهر: 3 یا 4 دسته به صورت تعیینی (نه تصادفی)"
echo "   5. رویدادهای نمونه برای اصفهان، شیراز، مشهد، تبریز، کرج"
echo ""
echo "🚀 برای اجرا:"
echo "   cd $FRONTEND_DIR && npm run dev"