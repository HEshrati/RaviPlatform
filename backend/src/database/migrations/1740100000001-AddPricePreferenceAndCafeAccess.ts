import { MigrationInterface, QueryRunner } from 'typeorm';
export class AddPricePreferenceAndCafeAccess1740100000001 implements MigrationInterface {
  name = 'AddPricePreferenceAndCafeAccess1740100000001';
  public async up(q: QueryRunner): Promise<void> {
    await q.query(`ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "venue_cost" DECIMAL(10,2) DEFAULT 0`);
    await q.query(`ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "venue_price_tier" VARCHAR DEFAULT 'medium'`);
    await q.query(`CREATE TABLE IF NOT EXISTS "cafe_access" (
      "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      "username" VARCHAR NOT NULL UNIQUE, "password_hash" VARCHAR NOT NULL,
      "cafe_name" VARCHAR NOT NULL, "city" VARCHAR, "address" VARCHAR,
      "price_tier" VARCHAR NOT NULL DEFAULT 'medium',
      "is_active" BOOLEAN NOT NULL DEFAULT true,
      "created_at" TIMESTAMP NOT NULL DEFAULT now(),
      "updated_at" TIMESTAMP NOT NULL DEFAULT now()
    )`);
    await q.query(`CREATE INDEX IF NOT EXISTS "idx_bookings_event_payment" ON "bookings"("event_id","payment_status")`);
    await q.query(`CREATE INDEX IF NOT EXISTS "idx_bookings_user_attended" ON "bookings"("user_id","attended")`);
  }
  public async down(q: QueryRunner): Promise<void> {
    await q.query(`ALTER TABLE "events" DROP COLUMN IF EXISTS "venue_cost"`);
    await q.query(`ALTER TABLE "events" DROP COLUMN IF EXISTS "venue_price_tier"`);
    await q.query(`DROP TABLE IF EXISTS "cafe_access"`);
  }
}
