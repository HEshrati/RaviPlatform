# راهنمای نصب و رفع مشکلات بک‌اند

## مشکلات پیدا شده و رفع شده:

### ✅ مشکلات حل شده:

1. **فقدان package.json** - ایجاد شد با تمام dependencies لازم
2. **فقدان nest-cli.json** - ایجاد شد
3. **فقدان tsconfig.build.json** - ایجاد شد
4. **فقدان .prettierrc** - ایجاد شد برای فرمت کد
5. **فقدان .eslintrc.js** - ایجاد شد برای linting
6. **تنظیمات نادرست tsconfig.json** - اصلاح شد
7. **فقدان Dockerfile و docker-compose.yml** - ایجاد شدند

## دستورات نصب و اجرا:

### روش 1: نصب مستقیم

```bash
# نصب dependencies
npm install

# کپی کردن .env
cp .env.example .env

# ویرایش .env و تنظیم متغیرهای محیطی
# حتماً این متغیرها را تنظیم کنید:
# - DATABASE_URL
# - JWT_SECRET (حداقل 32 کاراکتر)
# - JWT_REFRESH_SECRET (حداقل 32 کاراکتر)
# - OTP_SECRET (حداقل 32 کاراکتر)
# - N8N_WEBHOOK_SECRET (حداقل 12 کاراکتر)
# - BOT_WEBHOOK_SHARED_SECRET (حداقل 12 کاراکتر)
# - SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS

# اجرای migration ها (اگر دیتابیس آماده است)
npm run migration:run

# اجرا در حالت development
npm run start:dev

# یا build و اجرا در حالت production
npm run build
npm run start:prod
```

### روش 2: استفاده از Docker

```bash
# اجرای کل stack (PostgreSQL + Redis + Backend)
docker-compose up -d

# مشاهده logs
docker-compose logs -f backend

# توقف
docker-compose down

# توقف و پاک کردن volumes
docker-compose down -v
```

## ساختار پروژه:

```
backend-fixed/
├── src/
│   ├── config/              # تنظیمات و validation
│   ├── database/            # Entity ها و migrations
│   │   ├── entities/
│   │   └── migrations/
│   ├── modules/             # ماژول‌های برنامه
│   │   ├── auth/            # احراز هویت و OTP
│   │   ├── users/           # مدیریت کاربران
│   │   ├── events/          # مدیریت رویدادها
│   │   ├── bookings/        # رزرو رویدادها
│   │   ├── payments/        # پرداخت‌ها
│   │   ├── notifications/   # اعلان‌ها
│   │   ├── telegram/        # ربات تلگرام
│   │   ├── matching/        # تطبیق کاربران
│   │   ├── recommendations/ # پیشنهادات
│   │   ├── wallet/          # کیف پول
│   │   ├── health/          # health check
│   │   ├── logger/          # Winston logger
│   │   ├── redis/           # Redis cache
│   │   ├── queue/           # Job queue
│   │   └── webhook/         # Webhook handlers
│   ├── app.module.ts
│   └── main.ts
├── logs/                    # Log files
├── test/                    # Test files
├── package.json
├── nest-cli.json
├── tsconfig.json
├── tsconfig.build.json
├── .env.example
├── .gitignore
├── .prettierrc
├── .eslintrc.js
├── Dockerfile
├── docker-compose.yml
└── README.md
```

## Dependencies اصلی:

### Core Framework:
- @nestjs/common, @nestjs/core, @nestjs/platform-express
- @nestjs/config, @nestjs/typeorm
- typeorm, pg

### Authentication:
- @nestjs/jwt, @nestjs/passport
- passport, passport-jwt
- bcrypt

### Validation:
- class-validator, class-transformer
- joi

### Logging & Monitoring:
- nest-winston, winston
- @nestjs/terminus

### Security:
- helmet
- csrf-csrf
- @nestjs/throttler

### Caching:
- ioredis

### Documentation:
- @nestjs/swagger

### Others:
- cookie-parser
- dotenv

## نکات مهم:

### 1. متغیرهای محیطی:
همه متغیرهای محیطی در `.env.example` لیست شده‌اند. **حتماً** این متغیرها را در `.env` تنظیم کنید:

```env
# حداقل این متغیرها الزامی هستند:
DATABASE_URL=postgresql://user:pass@host:5432/dbname
JWT_SECRET=your-32-char-or-longer-secret-key
JWT_REFRESH_SECRET=your-32-char-or-longer-refresh-secret
OTP_SECRET=your-32-char-or-longer-otp-secret
N8N_WEBHOOK_SECRET=your-webhook-secret
BOT_WEBHOOK_SHARED_SECRET=your-bot-secret
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=email@example.com
SMTP_PASS=password
MAX_FILE_SIZE=5242880
```

### 2. دیتابیس:
- PostgreSQL نسخه 12 یا بالاتر
- پیش از اجرا، دیتابیس را ایجاد کنید
- Migration ها را اجرا کنید

### 3. Redis (اختیاری):
- اگر Redis ندارید، REDIS_URL را خالی بگذارید
- برخی features ممکن است بدون Redis کار نکنند

### 4. Build:
```bash
# Build برای production
npm run build

# خروجی در پوشه dist/ ایجاد می‌شود
```

### 5. Testing:
```bash
# اجرای تست‌ها
npm test

# Test coverage
npm run test:cov
```

### 6. Linting:
```bash
# بررسی کد
npm run lint

# فرمت کردن کد
npm run format
```

## رفع مشکلات رایج:

### خطا: "Cannot find module"
```bash
# پاک کردن node_modules و نصب مجدد
rm -rf node_modules package-lock.json
npm install
```

### خطا در build:
```bash
# پاک کردن dist و build مجدد
rm -rf dist
npm run build
```

### خطای اتصال به دیتابیس:
- مطمئن شوید PostgreSQL در حال اجراست
- DATABASE_URL را بررسی کنید
- دسترسی‌های دیتابیس را چک کنید

### خطای migration:
```bash
# بازگشت آخرین migration
npm run migration:revert

# اجرای مجدد
npm run migration:run
```

## Port های استفاده شده:

- Backend: 4000
- PostgreSQL: 5432
- Redis: 6379

## مستندات API:

بعد از اجرای برنامه:
```
http://localhost:4000/api/docs
```

## Support:

در صورت بروز مشکل:
1. لاگ‌ها را در پوشه `logs/` بررسی کنید
2. متغیرهای محیطی را چک کنید
3. Dependencies را به‌روزرسانی کنید: `npm update`
