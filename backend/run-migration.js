#!/usr/bin/env node
/**
 * Migration Runner - اجرای SQL migration بدون نیاز به psql
 * نحوه استفاده: node run-migration.js
 */

const fs = require("fs");
const path = require("path");

// تشخیص دیتابیس
const useTypeORM = fs.existsSync(
  path.join(__dirname, "node_modules", "typeorm"),
);
const usePg =
  !useTypeORM && fs.existsSync(path.join(__dirname, "node_modules", "pg"));

if (!useTypeORM && !usePg) {
  console.error("❌ هیچ کدام از typeorm یا pg نصب نیست!");
  console.log("نصب کنید: npm install pg");
  process.exit(1);
}

const migrationFile = path.join(
  __dirname,
  "migrations",
  "001_add_created_by_and_wallet.sql",
);
if (!fs.existsSync(migrationFile)) {
  console.error(`❌ فایل migration یافت نشد: ${migrationFile}`);
  process.exit(1);
}

const sql = fs.readFileSync(migrationFile, "utf8");

async function runMigration() {
  if (useTypeORM) {
    console.log("🔧 استفاده از TypeORM...");
    const { DataSource } = require("typeorm");

    const dataSource = new DataSource({
      type: "postgres",
      url: process.env.DATABASE_URL,
      synchronize: false,
    });

    try {
      await dataSource.initialize();
      console.log("✓ اتصال به دیتابیس برقرار شد");

      await dataSource.query(sql);
      console.log("✓ Migration با موفقیت اجرا شد!");

      await dataSource.destroy();
    } catch (error) {
      console.error("❌ خطا در اجرای migration:", error.message);
      process.exit(1);
    }
  } else if (usePg) {
    console.log("🔧 استفاده از pg...");
    const { Client } = require("pg");

    const client = new Client({
      connectionString: process.env.DATABASE_URL,
    });

    try {
      await client.connect();
      console.log("✓ اتصال به دیتابیس برقرار شد");

      await client.query(sql);
      console.log("✓ Migration با موفقیت اجرا شد!");

      await client.end();
    } catch (error) {
      console.error("❌ خطا در اجرای migration:", error.message);
      process.exit(1);
    }
  }
}

// Load .env if exists
const envPath = path.join(__dirname, ".env");
if (fs.existsSync(envPath)) {
  console.log("📄 بارگذاری .env...");
  require("dotenv").config({ path: envPath });
}

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL تعریف نشده است!");
  console.log("متغیر محیطی DATABASE_URL را تنظیم کنید یا فایل .env ایجاد کنید");
  process.exit(1);
}

console.log("🚀 شروع اجرای migration...\n");
runMigration()
  .then(() => {
    console.log("\n✅ تمام! دیتابیس به‌روز شد.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ خطا:", error);
    process.exit(1);
  });
