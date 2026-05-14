/**
 * src/data-source.ts
 * فایل مورد نیاز TypeORM CLI برای migration
 * این فایل مستقل از NestJS است
 */
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config(); // بارگذاری .env

export const AppDataSource = new DataSource({
  type: 'postgres',
  host:     process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'raavi_db',

  // همه entity ها
  entities: [path.join(__dirname, '**/*.entity.{ts,js}')],

  // همه migration ها
  migrations: [path.join(__dirname, 'database/migrations/*.{ts,js}')],

  synchronize: false, // در CLI هیچ‌وقت synchronize نباشد
  logging: true,
});
