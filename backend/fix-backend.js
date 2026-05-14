const fs = require('fs');
const path = require('path');

console.log('🚀 شروع رفع ارورهای تایپ‌اسکریپت و دیتابیس بک‌اند...');

function patchFile(filePath, replacements) {
  const fullPath = path.join(process.cwd(), filePath);
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️ فایل پیدا نشد: ${filePath}`);
    return;
  }
  let content = fs.readFileSync(fullPath, 'utf8');
  let originalContent = content;

  replacements.forEach(({ search, replace }) => {
    // اعمال تغییر با در نظر گرفتن رگولار اکسپرشن به صورت سراسری
    content = content.replace(search, replace);
  });

  if (content !== originalContent) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✅ اصلاح شد: ${filePath}`);
  } else {
    console.log(`⚡ نیازی به تغییر نبود (یا قبلاً اعمال شده): ${filePath}`);
  }
}

// 1. Behavior Tracking Interceptor (تبدیل null به undefined)
patchFile('src/common/interceptors/behavior-tracking.interceptor.ts', [
  { search: /sessionId,\n/g, replace: 'sessionId: sessionId ?? undefined,\n' },
  { search: /sessionId,\r\n/g, replace: 'sessionId: sessionId ?? undefined,\r\n' },
  { search: /sessionId, /g, replace: 'sessionId: sessionId ?? undefined, ' },
]);

// 2. User Entity (تایید تایپ خروجی‌ها)
patchFile('src/database/entities/user.entity.ts', [
  { search: /return this\.passwordHash;/g, replace: 'return this.passwordHash as string;' },
  { search: /return this\.mobileNumber;/g, replace: 'return this.mobileNumber as string;' },
  { search: /return this\.lastLogin;/g, replace: 'return this.lastLogin as Date;' },
]);

// 3. AI Content Service (مدیریت احتمال Null بودن مقادیر پیدا شده از دیتابیس)
patchFile('src/modules/ai-content/ai-content.service.ts', [
  {
    search: /content\.status = ContentStatus\.PUBLISHED;/g,
    replace: 'if (!content) throw new Error("Content not found");\n    content.status = ContentStatus.PUBLISHED;',
  },
  {
    search: /content\.status = ContentStatus\.REJECTED;/g,
    replace: 'if (!content) throw new Error("Content not found");\n    content.status = ContentStatus.REJECTED;',
  },
  {
    search: /if \(updates\.title\)/g,
    replace: 'if (!content) throw new Error("Content not found");\n    if (updates.title)',
  },
]);

// 4. Attendance Service (تعریف نوع برای آرایه خالی)
patchFile('src/modules/attendance/attendance.service.ts', [
  { search: /const savedFeedbacks = \[\];/g, replace: 'const savedFeedbacks: any[] = [];' },
]);

// 5. CRM Service (تعریف نوع برای آرایه خالی)
patchFile('src/modules/crm/crm.service.ts', [{ search: /const trend = \[\];/g, replace: 'const trend: any[] = [];' }]);

// 6. ROI Service (تعریف نوع برای آرایه خالی)
patchFile('src/modules/roi/roi.service.ts', [
  { search: /const monthly = \[\];/g, replace: 'const monthly: any[] = [];' },
]);

// 7. Intelligence Controller (دور زدن تایپ‌های Strict برای Null)
patchFile('src/modules/intelligence/intelligence.controller.ts', [
  { search: /sp\.suspension_reason = null;/g, replace: 'sp.suspension_reason = null as any;' },
  { search: /sp\.suspended_at = null;/g, replace: 'sp.suspended_at = null as any;' },
]);

// 8. رفع مشکل ارور اتصال دیتابیس (تبدیل پسورد عددی به استرینگ در .env)
const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  let envContent = fs.readFileSync(envPath, 'utf8');
  // پیدا کردن پسوردهایی که فقط عدد هستند و قرار دادن آنها داخل کوتیشن ("")
  if (/DB_PASSWORD=([0-9]+)$/m.test(envContent)) {
    envContent = envContent.replace(/DB_PASSWORD=([0-9]+)$/m, 'DB_PASSWORD="$1"');
    fs.writeFileSync(envPath, envContent, 'utf8');
    console.log(`✅ فایل .env اصلاح شد (رمز عبور دیتابیس تبدیل به String شد)`);
  }
} else {
  console.log('⚠️ فایل .env پیدا نشد.');
}

console.log('\n🎉 تمام اصلاحات بک‌اند با موفقیت اعمال شد!');
console.log('حالا سرور را با دستور زیر دوباره اجرا کنید:');
console.log('npm run start:dev');
