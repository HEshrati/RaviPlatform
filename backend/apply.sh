#!/bin/bash
# ══════════════════════════════════════════════════════════════════
# اسکریپت اعمال تمام تغییرات پروژه راوی
# نسخه: 1.0 | تاریخ: ۱۴۰۳
#
# این اسکریپت باید از پوشه root پروژه اجرا شود:
#   - فرانت‌اند: cd /path/to/frontend && bash apply_fixes.sh
#   - بک‌اند:    cd /path/to/backend && bash apply_fixes.sh
#
# ══════════════════════════════════════════════════════════════════

set -e

echo ""
echo "🔧 اسکریپت اعمال تغییرات راوی"
echo "══════════════════════════════════"

# ══════════════════════════════════════════════════════════════════
# ─── PATCH 1: FRONTEND - src/app/dashboard/profile/page.tsx ──────
# مشکل: بعد از ذخیره شهر، AppContext آپدیت نمی‌شد
# راه‌حل: صدا زدن setCity بعد از ذخیره موفق پروفایل
# ══════════════════════════════════════════════════════════════════
PROFILE_PAGE="src/app/dashboard/profile/page.tsx"
if [ -f "$PROFILE_PAGE" ]; then
  python3 << PYEOF
path = "$PROFILE_PAGE"
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

# 1. اضافه کردن setCity به destructure
c = c.replace(
    'const { state } = useApp();',
    'const { state, setCity } = useApp();'
)

# 2. صدا زدن setCity بعد از ذخیره پروفایل
c = c.replace(
    '''      const updated = await updateUserProfile(payload);
      setProfile(updated);
      setInterestsInput(updated.interests?.join("، ") ?? "");
      setStatus("پروفایل با موفقیت ذخیره شد.");
      setIsEditing(false);''',
    '''      const updated = await updateUserProfile(payload);
      setProfile(updated);
      setInterestsInput(updated.interests?.join("، ") ?? "");
      // انتقال شهر به AppContext تا صفحه رزرو آن را ببیند
      if (updated.city) {
        setCity(updated.city);
        localStorage.setItem("city", updated.city);
      }
      setStatus("پروفایل با موفقیت ذخیره شد.");
      setIsEditing(false);'''
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)
print("  ✅ profile/page.tsx - setCity اضافه شد")
PYEOF
else
  echo "  ⚠️  $PROFILE_PAGE یافت نشد (احتمالاً پوشه بک‌اند)"
fi

# ══════════════════════════════════════════════════════════════════
# ─── PATCH 2: BACKEND - src/modules/auth/strategies/jwt.strategy.ts
# مشکل: JWT validate() مشخصه mobileNumber برنمی‌گرداند
# راه‌حل: اضافه کردن mobileNumber به return value
# ══════════════════════════════════════════════════════════════════
JWT_STRATEGY="src/modules/auth/strategies/jwt.strategy.ts"
if [ -f "$JWT_STRATEGY" ]; then
  python3 << PYEOF
path = "$JWT_STRATEGY"
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace(
    'return { id: user.id, email: user.email, role: user.role };',
    'return { id: user.id, email: user.email, role: user.role, mobileNumber: user.mobileNumber };'
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)
print("  ✅ jwt.strategy.ts - mobileNumber اضافه شد")
PYEOF
else
  echo "  ⚠️  $JWT_STRATEGY یافت نشد (احتمالاً پوشه فرانت‌اند)"
fi

# ══════════════════════════════════════════════════════════════════
# ─── PATCH 3: BACKEND - src/modules/ai-content/ai-content.service.ts
# مشکل: API Key هاردکد شده و نام مدل اشتباه
# راه‌حل: استفاده از env variable + نام مدل صحیح
# ══════════════════════════════════════════════════════════════════
AI_SERVICE="src/modules/ai-content/ai-content.service.ts"
if [ -f "$AI_SERVICE" ]; then
  python3 << PYEOF
path = "$AI_SERVICE"
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

# حذف API Key هاردکد شده
c = c.replace(
    "const AI_API_KEY = process.env.ANTHROPIC_API_KEY || 'sk-fRQfQLXc8pkuNIIf6eSokMD2KU1BdsLUXXj4gtv4yQLrIlxQ';",
    "// ⚠️ مهم: کلید ANTHROPIC_API_KEY را در .env قرار دهید (فرمت: sk-ant-api03-...)\nconst AI_API_KEY = process.env.ANTHROPIC_API_KEY || '';"
)

# اصلاح نام مدل
c = c.replace("model: 'claude-opus-4-6',", "model: 'claude-opus-4-5',")

# اضافه کردن چک API Key
old_fn = "  private async callAIAPI(topic: string): Promise<{\n    title: string;\n    body: string;\n    summary: string;\n    tags: string[];\n  }> {\n    const prompt ="
new_fn = """  private async callAIAPI(topic: string): Promise<{
    title: string;
    body: string;
    summary: string;
    tags: string[];
  }> {
    if (!AI_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY تعریف نشده. کلید sk-ant-api03-... را در .env قرار دهید.');
    }
    const prompt ="""
c = c.replace(old_fn, new_fn)

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)
print("  ✅ ai-content.service.ts - اصلاح شد")
PYEOF
else
  echo "  ⚠️  $AI_SERVICE یافت نشد"
fi

# ══════════════════════════════════════════════════════════════════
# ─── PATCH 4: FRONTEND - جایگزینی "رویداد" با "همنشینی"
# در تمام فایل‌های فرانت‌اند
# ══════════════════════════════════════════════════════════════════
if [ -d "src/app" ]; then
  python3 << PYEOF
import os

REPLACEMENTS = [
    ("رویداد تمام‌شده", "همنشینی تمام‌شده"),
    ("رویداد پیش‌رو", "همنشینی پیش‌رو"),
    ("رویداد جدید", "همنشینی جدید"),
    ("رویداد جدیدی", "همنشینی جدیدی"),
    ("ایجاد رویداد", "ایجاد همنشینی"),
    ("رویدادهای من", "همنشینی‌های من"),
    ("رویدادهای پیش‌رو", "همنشینی‌های پیش‌رو"),
    ('برای دیدن رویدادهای شهرت', 'برای دیدن همنشینی‌های شهرت'),
    ("رویدادهای شهرت", "همنشینی‌های شهرت"),
    ("رویدادهایی", "همنشینی‌هایی"),
    ("اولین رویداد خود را ایجاد کنید", "اولین همنشینی خود را ایجاد کنید"),
    ("رویداد با موفقیت ایجاد شد", "همنشینی با موفقیت ایجاد شد"),
    ("خطا در ایجاد رویداد", "خطا در ایجاد همنشینی"),
    ("رویدادی یافت نشد", "همنشینی‌ای یافت نشد"),
    ('"رویداد استارتاپی"', '"همنشینی استارتاپی"'),
]

changed = 0
for root, dirs, files in os.walk("src/app"):
    for fname in files:
        if not (fname.endswith('.tsx') or fname.endswith('.ts')):
            continue
        fpath = os.path.join(root, fname)
        with open(fpath, 'r', encoding='utf-8') as f:
            content = f.read()
        orig = content
        for old, new in REPLACEMENTS:
            content = content.replace(old, new)
        if content != orig:
            with open(fpath, 'w', encoding='utf-8') as f:
                f.write(content)
            changed += 1
            print(f"  ✅ {fpath}")

print(f"\n  {changed} فایل متن‌ها آپدیت شد")
PYEOF
fi

# ══════════════════════════════════════════════════════════════════
# ─── PATCH 5: FRONTEND - تغییر بک‌گراند سفید به تیره
# فایل‌های: events/page.tsx, admin/events/new/page.tsx
# ══════════════════════════════════════════════════════════════════
if [ -d "src/app" ]; then
  python3 << PYEOF
import os

# ── events/page.tsx ──────────────────────────────────────
path = "src/app/events/page.tsx"
if os.path.exists(path):
    with open(path, 'r', encoding='utf-8') as f:
        c = f.read()
    
    REPLACEMENTS = [
        ('className="min-h-screen pb-28 bg-white" dir="rtl">',
         'className="min-h-screen pb-28 bg-slate-950" dir="rtl">'),
        ('className="sticky top-16 z-30 bg-white border-b border-slate-100 shadow-sm">',
         'className="sticky top-16 z-30 bg-slate-900 border-b border-slate-700 shadow-sm">'),
        ('className="text-center text-lg font-black text-slate-900 mb-3">',
         'className="text-center text-lg font-black text-white mb-3">'),
        ('className="w-full bg-slate-100 rounded-xl pr-9 pl-4 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-orange-400 placeholder-slate-400"',
         'className="w-full bg-slate-800 rounded-xl pr-9 pl-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-orange-400 placeholder-slate-500"'),
        ('className="flex border-b border-slate-200 mb-5">',
         'className="flex border-b border-slate-700 mb-5">'),
        ('border-transparent text-slate-400 hover:text-slate-600',
         'border-transparent text-slate-500 hover:text-slate-300'),
        ('className="bg-orange-50 px-4 py-1.5 flex items-center gap-2">',
         'className="bg-orange-950/30 px-4 py-1.5 flex items-center gap-2">'),
        ('className="text-[11px] text-orange-700 font-bold">',
         'className="text-[11px] text-orange-400 font-bold">'),
        ('"bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex items-center gap-3"',
         '"bg-slate-800 rounded-2xl border border-slate-700 p-4 flex items-center gap-3"'),
        # popup رتینگ
        ('style={{ background: "#fff", direction: "rtl" }}',
         'style={{ background: "#1e293b", direction: "rtl" }}'),
        ('className="text-xl font-black text-slate-900 mb-1">',
         'className="text-xl font-black text-white mb-1">'),
        ('className="text-slate-500 text-sm mb-5">',
         'className="text-slate-400 text-sm mb-5">'),
        ('style={{ background: "#f9fafb" }}',
         'style={{ background: "#334155" }}'),
        ('className="font-bold text-slate-800 text-sm">',
         'className="font-bold text-white text-sm">'),
        # عناوین بخش‌ها
        ('<h2 className="text-base font-black text-slate-900 mb-4">',
         '<h2 className="text-base font-black text-white mb-4">'),
    ]
    for old, new in REPLACEMENTS:
        c = c.replace(old, new)
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(c)
    print(f"  ✅ {path} - رنگ‌ها تیره شدند")

# ── admin/events/new/page.tsx ──────────────────────────
path = "src/app/admin/events/new/page.tsx"
if os.path.exists(path):
    with open(path, 'r', encoding='utf-8') as f:
        c = f.read()
    
    REPLACEMENTS = [
        ('className="min-h-screen bg-slate-50 p-4 md:p-8">',
         'className="min-h-screen bg-slate-950 p-4 md:p-8">'),
        ('className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">',
         'className="rounded-3xl bg-slate-800 border border-slate-700 p-6 shadow-sm">'),
        ('className="text-2xl font-black">ایجاد همنشینی جدید',
         'className="text-2xl font-black text-white">ایجاد همنشینی جدید'),
        ('className="text-slate-500 mt-1">مرحله',
         'className="text-slate-400 mt-1">مرحله'),
        (' className="w-full rounded-xl border border-slate-200 p-3"',
         ' className="w-full rounded-xl bg-slate-700 border border-slate-600 p-3 text-white placeholder-slate-400"'),
        ('className="w-full rounded-xl border border-slate-200 p-3 min-h-28"',
         'className="w-full rounded-xl bg-slate-700 border border-slate-600 p-3 min-h-28 text-white placeholder-slate-400"'),
        ('className="rounded-3xl bg-white border border-slate-200 p-5 shadow-sm">',
         'className="rounded-3xl bg-slate-800 border border-slate-700 p-5 shadow-sm">'),
        ('className="font-black mb-4">پیش‌نمایش زنده',
         'className="font-black mb-4 text-white">پیش‌نمایش زنده'),
        ('className="rounded-2xl border border-slate-200 p-4 space-y-2">',
         'className="rounded-2xl border border-slate-700 bg-slate-700/50 p-4 space-y-2">'),
        ('className="font-bold text-lg">',
         'className="font-bold text-lg text-white">'),
        ('className="text-sm text-slate-500">',
         'className="text-sm text-slate-400">'),
    ]
    for old, new in REPLACEMENTS:
        c = c.replace(old, new)
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(c)
    print(f"  ✅ {path} - رنگ‌ها تیره شدند")

PYEOF
fi

echo ""
echo "══════════════════════════════════════════════════════════════════"
echo "✅ تمام پچ‌ها با موفقیت اعمال شدند!"
echo ""
echo "⚠️  اقدام لازم برای هوش مصنوعی:"
echo "   ۱. کلید API معتبر از https://console.anthropic.com بگیرید"
echo "   ۲. در فایل .env بک‌اند اضافه کنید:"
echo "      ANTHROPIC_API_KEY=sk-ant-api03-XXXXXXX..."
echo ""
echo "📋 خلاصه تغییرات:"
echo "   🔵 [FRONTEND] profile/page.tsx → شهر به AppContext منتقل می‌شود"
echo "   🔵 [BACKEND]  jwt.strategy.ts → mobileNumber در token payload"
echo "   🔵 [BACKEND]  ai-content.service.ts → مدل صحیح + API Key از env"
echo "   🔵 [FRONTEND] *.tsx → رویداد → همنشینی"
echo "   🔵 [FRONTEND] events/page.tsx → بک‌گراند تیره"
echo "   🔵 [FRONTEND] admin/events/new/page.tsx → بک‌گراند تیره"
echo "══════════════════════════════════════════════════════════════════"