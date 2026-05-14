import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddWarningCountAndAttendance1700000000000 implements MigrationInterface {
  name = 'AddWarningCountAndAttendance1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // اضافه کردن فیلد warning_count به جدول users
    await queryRunner.query(`
      ALTER TABLE "users" 
      ADD COLUMN IF NOT EXISTS "warning_count" integer NOT NULL DEFAULT 0
    `);

    // اضافه کردن فیلد ban_reason به جدول users
    await queryRunner.query(`
      ALTER TABLE "users" 
      ADD COLUMN IF NOT EXISTS "ban_reason" text
    `);

    // اضافه کردن فیلد ban_expires_at به جدول users (برای بن موقت)
    await queryRunner.query(`
      ALTER TABLE "users" 
      ADD COLUMN IF NOT EXISTS "ban_expires_at" timestamp
    `);

    // اطمینان از وجود فیلدهای attendance در bookings
    await queryRunner.query(`
      ALTER TABLE "bookings" 
      ADD COLUMN IF NOT EXISTS "attended" boolean NOT NULL DEFAULT false
    `);

    await queryRunner.query(`
      ALTER TABLE "bookings" 
      ADD COLUMN IF NOT EXISTS "attendance_marked_at" timestamp
    `);

    // ایندکس برای جستجوی سریع‌تر
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_bookings_event_attended" 
      ON "bookings" ("event_id", "attended")
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_bookings_user_attended" 
      ON "bookings" ("user_id", "attended")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_bookings_user_attended"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_bookings_event_attended"`);
    await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN IF EXISTS "attendance_marked_at"`);
    await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN IF EXISTS "attended"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "ban_expires_at"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "ban_reason"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "warning_count"`);
  }
}
