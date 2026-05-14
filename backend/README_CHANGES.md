# تغییرات انجام شده در بک‌اند / Backend Changes

## خلاصه تغییرات / Summary of Changes

این فایل‌ها برای رفع مشکلات بیلد و سازگاری با نسخه‌های جدید اصلاح شده‌اند.

These files have been fixed to resolve build issues and ensure compatibility with latest package versions.

---

## مشکلات برطرف شده / Issues Fixed

### 1. نسخه‌های اشتباه پکیج‌ها / Incorrect Package Versions

#### ❌ قبل / Before:
```json
"axios": "^1.13.5",    // این نسخه وجود ندارد
"multer": "^2.0.2",    // این نسخه وجود ندارد
"uuid": "^13.0.0",     // این نسخه وجود ندارد
"csurf": "^1.11.0",    // منسوخ شده
```

#### ✅ بعد / After:
```json
"axios": "^1.7.9",         // نسخه صحیح
"multer": "^1.4.5-lts.1",  // نسخه صحیح
"uuid": "^11.0.3",         // نسخه صحیح
"csrf-csrf": "^3.0.4",     // جایگزین csurf
```

### 2. پکیج CSRF منسوخ / Deprecated CSRF Package

**مشکل / Problem:**
- پکیج `csurf` دیگر نگهداری نمی‌شود و با Node.js جدید کار نمی‌کند
- The `csurf` package is no longer maintained and doesn't work with modern Node.js

**راه‌حل / Solution:**
- استفاده از `csrf-csrf` که پکیج جدید و فعال است
- Using `csrf-csrf` which is a modern, actively maintained package

**تغییرات در `src/main.ts` / Changes in `src/main.ts`:**

```typescript
// ❌ قبل / Before:
import csurf from 'csurf';
...
app.use(csurf({ cookie: true }));

// ✅ بعد / After:
import { doubleCsrf } from 'csrf-csrf';
...
if (configService.get<boolean>('ENABLE_CSRF')) {
  const { doubleCsrfProtection } = doubleCsrf({
    getSecret: () => configService.get<string>('CSRF_SECRET', 'your-csrf-secret-key'),
    cookieName: '__Host-psifi.x-csrf-token',
    cookieOptions: {
      sameSite: 'strict',
      path: '/',
      secure: configService.get<string>('NODE_ENV') === 'production',
      httpOnly: true,
    },
    size: 64,
    ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
  });
  app.use(doubleCsrfProtection);
}
```

### 3. نوع‌های TypeScript / TypeScript Types

**اضافه شده / Added:**
```json
"@types/multer": "^1.4.12"  // به‌روزرسانی شده برای سازگاری
```

---

## نحوه استفاده / How to Use

### نصب بسته‌ها / Install Dependencies:
```bash
cd backend
npm install
```

### اجرای پروژه / Run the Project:

#### حالت توسعه / Development Mode:
```bash
npm run start:dev
```

#### حالت تولید / Production Mode:
```bash
npm run build
npm run start:prod
```

### مایگریشن دیتابیس / Database Migration:
```bash
npm run migrate:dev
```

---

## متغیرهای محیطی مورد نیاز / Required Environment Variables

اگر CSRF فعال باشد، این متغیر را اضافه کنید:
If CSRF is enabled, add this variable:

```env
CSRF_SECRET=your-secure-random-secret-key-here
ENABLE_CSRF=true  # اختیاری / Optional
```

---

## نکات مهم / Important Notes

1. **CSRF Secret:** 
   - برای امنیت بیشتر، یک کلید تصادفی قوی برای `CSRF_SECRET` تولید کنید
   - For better security, generate a strong random key for `CSRF_SECRET`
   
2. **کوکی CSRF:**
   - کوکی CSRF با نام `__Host-psifi.x-csrf-token` ارسال می‌شود
   - CSRF cookie is sent with name `__Host-psifi.x-csrf-token`
   
3. **درخواست‌های مجاز بدون CSRF:**
   - `GET`, `HEAD`, `OPTIONS` نیاز به توکن CSRF ندارند
   - `GET`, `HEAD`, `OPTIONS` don't require CSRF token

---

## تست / Testing

پس از نصب، سرور را اجرا کنید و به آدرس زیر بروید:
After installation, run the server and visit:

```
http://localhost:4000/api/docs
```

باید صفحه Swagger با موفقیت نمایش داده شود.
You should see the Swagger documentation page successfully.

---

## در صورت بروز مشکل / Troubleshooting

### اگر خطای نصب دریافت کردید:
### If you get installation errors:

1. حذف node_modules و package-lock.json:
   Delete node_modules and package-lock.json:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. استفاده از npm cache clean:
   Use npm cache clean:
   ```bash
   npm cache clean --force
   npm install
   ```

3. بررسی نسخه Node.js (باید 18 یا بالاتر باشد):
   Check Node.js version (should be 18 or higher):
   ```bash
   node --version
   ```

---

## تغییرات برای Production / Production Changes

برای محیط تولید، حتماً موارد زیر را تنظیم کنید:
For production environment, make sure to set:

```env
NODE_ENV=production
CSRF_SECRET=<کلید-امن-تصادفی>
ENABLE_CSRF=true
```

---

## پشتیبانی / Support

در صورت بروز هرگونه مشکل، فایل‌های زیر را بررسی کنید:
If you encounter any issues, check these files:

- `package.json` - نسخه‌های پکیج‌ها
- `src/main.ts` - تنظیمات سرور و middleware
- `.env` - متغیرهای محیطی

---

**تاریخ به‌روزرسانی / Last Updated:** فوریه 2026 / February 2026
