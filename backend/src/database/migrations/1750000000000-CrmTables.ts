/**
 * Migration: CrmTables
 * ساخت جداول CRM
 * مسیر: src/database/migrations/1750000000000-CrmTables.ts
 */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CrmTables1750000000000 implements MigrationInterface {
  name = 'CrmTables1750000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ── جدول رویدادهای رفتاری ─────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "crm_user_behavior_events" (
        "id"               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "user_id"          UUID,
        "event_type"       VARCHAR(100) NOT NULL,
        "severity"         VARCHAR(20) NOT NULL DEFAULT 'info',
        "page_path"        VARCHAR,
        "api_endpoint"     VARCHAR,
        "http_status"      INTEGER,
        "response_time_ms" INTEGER,
        "session_id"       VARCHAR,
        "ip_address"       VARCHAR,
        "user_agent"       VARCHAR,
        "metadata"         JSONB,
        "created_at"       TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
      )
    `);

    // ایندکس‌ها
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_crm_behavior_user_date"
      ON "crm_user_behavior_events" ("user_id", "created_at")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_crm_behavior_type_date"
      ON "crm_user_behavior_events" ("event_type", "created_at")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_crm_behavior_session"
      ON "crm_user_behavior_events" ("session_id")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_crm_behavior_severity"
      ON "crm_user_behavior_events" ("severity", "created_at")`);

    // ── جدول هشدارهای AI ─────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "crm_ai_alerts" (
        "id"               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "alert_type"       VARCHAR(50) NOT NULL,
        "severity"         VARCHAR(20) NOT NULL DEFAULT 'medium',
        "status"           VARCHAR(20) NOT NULL DEFAULT 'open',
        "title"            VARCHAR NOT NULL,
        "ai_analysis"      TEXT NOT NULL,
        "recommendation"   TEXT,
        "raw_data"         JSONB,
        "related_user_id"  UUID,
        "risk_score"       FLOAT NOT NULL DEFAULT 0,
        "admin_note"       TEXT,
        "reviewed_by"      UUID,
        "reviewed_at"      TIMESTAMP WITH TIME ZONE,
        "created_at"       TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at"       TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_crm_alerts_status_date"
      ON "crm_ai_alerts" ("status", "created_at")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_crm_alerts_type_severity"
      ON "crm_ai_alerts" ("alert_type", "severity")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "crm_user_behavior_events"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "crm_ai_alerts"`);
  }
}
