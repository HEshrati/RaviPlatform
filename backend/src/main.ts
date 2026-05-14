import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // سرو فایل‌های آپلود شده (تصاویر همنشینی)
  app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads/' });

  // CORS — دامنه‌های مجاز
  const corsEnv = process.env.CORS_ORIGINS || '';
  const extraOrigins = corsEnv
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  const allowedOrigins = [
    // دامنه‌های محلی برای توسعه
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    // دامنه‌های production (hardcoded به عنوان fallback)
    'https://raaviiplatform.com',
    'https://www.raaviiplatform.com',
    'https://api.raaviiplatform.com',
    // دامنه از environment variable
    process.env.FRONTEND_URL || 'http://localhost:3000',
    ...extraOrigins,
  ].filter(Boolean);

  // حذف مقادیر تکراری
  const uniqueOrigins = [...new Set(allowedOrigins)];


  app.enableCors({
    origin: (origin, callback) => {
      // درخواست‌های بدون origin مجاز هستند (موبایل، Postman، n8n)
      if (!origin) return callback(null, true);

      if (uniqueOrigins.includes(origin)) {
        return callback(null, true);
      }

      // در محیط غیر production همه origin ها مجاز هستند
      if (process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }

      console.warn(`⚠️ CORS blocked origin: ${origin}`);
      callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'Cache-Control',
      'x-ravi-bot-secret',
    ],
    exposedHeaders: ['Authorization'],
    optionsSuccessStatus: 200,
    preflightContinue: false,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api');

  const port = parseInt(process.env.PORT || '4000', 10);
  await app.listen(port);
}

bootstrap();
