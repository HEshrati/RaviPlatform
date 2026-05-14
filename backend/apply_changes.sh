#!/usr/bin/env bash
set -e

echo "📁 Creating migrations directory..."
mkdir -p src/database/migrations

echo "🧱 Creating AddRelations migration..."
cat > src/database/migrations/1700000005000-AddRelations.ts <<'EOF'
import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRelations1700000005000 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE events
      ADD CONSTRAINT fk_events_created_by
      FOREIGN KEY (created_by)
      REFERENCES users(id)
      ON DELETE SET NULL
    `);

    await queryRunner.query(`
      ALTER TABLE bookings
      ADD CONSTRAINT fk_bookings_user
      FOREIGN KEY (user_id)
      REFERENCES users(id)
    `);

    await queryRunner.query(`
      ALTER TABLE bookings
      ADD CONSTRAINT fk_bookings_event
      FOREIGN KEY (event_id)
      REFERENCES events(id)
    `);

    await queryRunner.query(`
      CREATE INDEX idx_bookings_user ON bookings(user_id)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS idx_bookings_user`);
    await queryRunner.query(`ALTER TABLE bookings DROP CONSTRAINT fk_bookings_event`);
    await queryRunner.query(`ALTER TABLE bookings DROP CONSTRAINT fk_bookings_user`);
    await queryRunner.query(`ALTER TABLE events DROP CONSTRAINT fk_events_created_by`);
  }
}
EOF

echo "💰 Creating Wallet migration..."
cat > src/database/migrations/1700000006000-AddWalletPatch.ts <<'EOF'
import { MigrationInterface, QueryRunner } from "typeorm";

export class AddWalletPatch1700000006000 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS credits_balance NUMERIC(14,2) DEFAULT 0
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE users DROP COLUMN IF EXISTS credits_balance
    `);
  }
}
EOF

echo "✅ Migration files created successfully!"
