import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migration جامع راوی
 * رفع تفاوت‌های entity های تکراری و ستون‌های مفقود
 * 
 * اجرا: npm run typeorm migration:run
 */
export class RaviFullSync1740000000000 implements MigrationInterface {
  name = 'RaviFullSync1740000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {

    // ═══════════════════════════════════════════════════
    // ① جدول USERS — ستون‌های مفقود
    // ═══════════════════════════════════════════════════
    await queryRunner.query(`
      ALTER TABLE "users"
        ADD COLUMN IF NOT EXISTS "warning_count"      integer   NOT NULL DEFAULT 0,
        ADD COLUMN IF NOT EXISTS "ban_reason"         text,
        ADD COLUMN IF NOT EXISTS "ban_expires_at"     timestamp,
        ADD COLUMN IF NOT EXISTS "telegram_id"        bigint    UNIQUE,
        ADD COLUMN IF NOT EXISTS "telegram_username"  varchar,
        ADD COLUMN IF NOT EXISTS "current_fsm_state"  varchar   NOT NULL DEFAULT 'onboarding',
        ADD COLUMN IF NOT EXISTS "credits_balance"    integer   NOT NULL DEFAULT 0,
        ADD COLUMN IF NOT EXISTS "login_count"        integer   NOT NULL DEFAULT 0,
        ADD COLUMN IF NOT EXISTS "last_login"         timestamp
    `);

    // ═══════════════════════════════════════════════════
    // ② جدول EVENTS — ستون‌های نسخه جدید که در نسخه قدیم نیستند
    // ═══════════════════════════════════════════════════
    await queryRunner.query(`
      ALTER TABLE "events"
        ADD COLUMN IF NOT EXISTS "event_type"            varchar,
        ADD COLUMN IF NOT EXISTS "min_match_score"       float     NOT NULL DEFAULT 0.7,
        ADD COLUMN IF NOT EXISTS "max_group_size"        integer   NOT NULL DEFAULT 6,
        ADD COLUMN IF NOT EXISTS "min_group_size"        integer   NOT NULL DEFAULT 3,
        ADD COLUMN IF NOT EXISTS "current_bookings"      integer   NOT NULL DEFAULT 0,
        ADD COLUMN IF NOT EXISTS "start_date"            timestamp,
        ADD COLUMN IF NOT EXISTS "end_date"              timestamp,
        ADD COLUMN IF NOT EXISTS "registration_deadline" timestamp,
        ADD COLUMN IF NOT EXISTS "currency"              varchar   NOT NULL DEFAULT 'IRR',
        ADD COLUMN IF NOT EXISTS "location"              varchar,
        ADD COLUMN IF NOT EXISTS "is_online"             boolean   NOT NULL DEFAULT false,
        ADD COLUMN IF NOT EXISTS "meeting_link"          varchar,
        ADD COLUMN IF NOT EXISTS "image_url"             varchar,
        ADD COLUMN IF NOT EXISTS "instructor_name"       varchar,
        ADD COLUMN IF NOT EXISTS "requirements"          text,
        ADD COLUMN IF NOT EXISTS "tags"                  text[],
        ADD COLUMN IF NOT EXISTS "features"              text[],
        ADD COLUMN IF NOT EXISTS "is_active"             boolean   NOT NULL DEFAULT true,
        ADD COLUMN IF NOT EXISTS "is_featured"           boolean   NOT NULL DEFAULT false,
        ADD COLUMN IF NOT EXISTS "created_by"            uuid
    `);

    // مهاجرت داده: از ستون‌های قدیم به جدید
    await queryRunner.query(`
      UPDATE "events"
        SET "start_date" = (date || ' ' || COALESCE(time, '00:00'))::timestamp
      WHERE "start_date" IS NULL AND "date" IS NOT NULL
    `).catch(() => {}); // اگر ستون date وجود نداشت نادیده بگیر

    // ═══════════════════════════════════════════════════
    // ③ جدول BOOKINGS — ستون‌های نسخه جدید
    // ═══════════════════════════════════════════════════
    await queryRunner.query(`
      ALTER TABLE "bookings"
        ADD COLUMN IF NOT EXISTS "payment_status"         varchar   NOT NULL DEFAULT 'unpaid',
        ADD COLUMN IF NOT EXISTS "payment_id"             uuid,
        ADD COLUMN IF NOT EXISTS "booking_code"           varchar   UNIQUE,
        ADD COLUMN IF NOT EXISTS "locked_until"           timestamp,
        ADD COLUMN IF NOT EXISTS "locked_by_session"      varchar,
        ADD COLUMN IF NOT EXISTS "confirmation_code"      varchar,
        ADD COLUMN IF NOT EXISTS "confirmed_at"           timestamp,
        ADD COLUMN IF NOT EXISTS "attended"               boolean   NOT NULL DEFAULT false,
        ADD COLUMN IF NOT EXISTS "attendance_marked_at"   timestamp,
        ADD COLUMN IF NOT EXISTS "metadata"               jsonb
    `);

    // ═══════════════════════════════════════════════════
    // ④ جدول SMART_PROFILES — ادغام هر دو نسخه entity
    // ═══════════════════════════════════════════════════
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "smart_profiles" (
        "id"                          uuid              PRIMARY KEY DEFAULT gen_random_uuid(),
        "user_id"                     uuid              NOT NULL UNIQUE,
        "communication_type"          varchar,
        "extroversion_score"          float             NOT NULL DEFAULT 50,
        "energy_level"                float             NOT NULL DEFAULT 50,
        "dominant_need"               varchar,
        "interaction_rhythm"          varchar,
        "total_events_attended"       integer           NOT NULL DEFAULT 0,
        "total_events_booked"         integer           NOT NULL DEFAULT 0,
        "return_rate"                 float             NOT NULL DEFAULT 0,
        "no_show_count"               integer           NOT NULL DEFAULT 0,
        "is_suspended"                boolean           NOT NULL DEFAULT false,
        "suspension_reason"           text,
        "suspended_at"                timestamp,
        "suspension_approved_by_admin" boolean          NOT NULL DEFAULT false,
        "location_preference"         varchar,
        "preferred_neighborhood"      varchar,
        "neighborhood_preferences"    text,
        "telegram_behavior"           jsonb,
        "telegram_message_rate"       float,
        "telegram_response_time"      float,
        "telegram_messages_sent"      integer,
        "next_event_interests"        text,
        "preferred_event_types"       text,
        "group_reactions"             jsonb,
        "group_reaction_history"      jsonb,
        "smart_score"                 float             NOT NULL DEFAULT 0,
        "avg_match_satisfaction"      float             NOT NULL DEFAULT 0,
        "matching_weights"            jsonb,
        "last_ai_update"              timestamp,
        "ai_insights"                 jsonb,
        "test_results_summary"        jsonb,
        "last_event_attended_at"      timestamp,
        "created_at"                  timestamp         NOT NULL DEFAULT now(),
        "updated_at"                  timestamp         NOT NULL DEFAULT now(),
        CONSTRAINT "FK_smart_profiles_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    // اگر جدول قبلاً وجود داشت، ستون‌های جدید را اضافه کن
    await queryRunner.query(`
      ALTER TABLE "smart_profiles"
        ADD COLUMN IF NOT EXISTS "extroversion_score"           float     NOT NULL DEFAULT 50,
        ADD COLUMN IF NOT EXISTS "suspension_approved_by_admin" boolean   NOT NULL DEFAULT false,
        ADD COLUMN IF NOT EXISTS "preferred_neighborhood"       varchar,
        ADD COLUMN IF NOT EXISTS "neighborhood_preferences"     text,
        ADD COLUMN IF NOT EXISTS "telegram_behavior"            jsonb,
        ADD COLUMN IF NOT EXISTS "telegram_message_rate"        float,
        ADD COLUMN IF NOT EXISTS "telegram_response_time"       float,
        ADD COLUMN IF NOT EXISTS "telegram_messages_sent"       integer,
        ADD COLUMN IF NOT EXISTS "next_event_interests"         text,
        ADD COLUMN IF NOT EXISTS "group_reactions"              jsonb,
        ADD COLUMN IF NOT EXISTS "group_reaction_history"       jsonb,
        ADD COLUMN IF NOT EXISTS "smart_score"                  float     NOT NULL DEFAULT 0,
        ADD COLUMN IF NOT EXISTS "avg_match_satisfaction"       float     NOT NULL DEFAULT 0,
        ADD COLUMN IF NOT EXISTS "matching_weights"             jsonb,
        ADD COLUMN IF NOT EXISTS "last_ai_update"               timestamp,
        ADD COLUMN IF NOT EXISTS "ai_insights"                  jsonb,
        ADD COLUMN IF NOT EXISTS "test_results_summary"         jsonb,
        ADD COLUMN IF NOT EXISTS "last_event_attended_at"       timestamp,
        ADD COLUMN IF NOT EXISTS "total_events_booked"          integer   NOT NULL DEFAULT 0,
        ADD COLUMN IF NOT EXISTS "preferred_event_types"        text
    `);

    // مهاجرت داده: اگر ستون قدیم introvert_score وجود داشت، به extroversion تبدیل کن
    await queryRunner.query(`
      UPDATE "smart_profiles"
        SET "extroversion_score" = 100 - COALESCE("introvert_score", 50)
      WHERE "extroversion_score" = 50
        AND EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'smart_profiles' AND column_name = 'introvert_score'
        )
    `).catch(() => {});

    // مهاجرت داده: total_events_registered → total_events_booked
    await queryRunner.query(`
      UPDATE "smart_profiles"
        SET "total_events_booked" = COALESCE("total_events_registered", 0)
      WHERE "total_events_booked" = 0
        AND EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'smart_profiles' AND column_name = 'total_events_registered'
        )
    `).catch(() => {});

    // ═══════════════════════════════════════════════════
    // ⑤ جداول موجودیت‌های فاقد جدول (create if not exists)
    // ═══════════════════════════════════════════════════

    // جدول PROFILES
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "profiles" (
        "id"              uuid      PRIMARY KEY DEFAULT gen_random_uuid(),
        "user_id"         uuid      NOT NULL UNIQUE,
        "first_name"      varchar,
        "last_name"       varchar,
        "bio"             varchar,
        "avatar"          varchar,
        "birth_date"      date,
        "gender"          varchar,
        "city"            varchar,
        "neighborhood"    varchar,
        "occupation"      varchar,
        "education"       varchar,
        "personality_type" varchar,
        "age"             integer,
        "interests"       text,
        "big5_scores"     text,
        "profile_completion" integer NOT NULL DEFAULT 0,
        "is_visible"      boolean   NOT NULL DEFAULT true,
        "credits"         integer   NOT NULL DEFAULT 0,
        "last_seen"       timestamp,
        "created_at"      timestamp NOT NULL DEFAULT now(),
        "updated_at"      timestamp NOT NULL DEFAULT now(),
        CONSTRAINT "FK_profiles_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    // جدول PAYMENTS
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "payments" (
        "id"                uuid      PRIMARY KEY DEFAULT gen_random_uuid(),
        "user_id"           uuid      NOT NULL,
        "booking_id"        uuid,
        "amount"            decimal(12,2) NOT NULL DEFAULT 0,
        "currency"          varchar   NOT NULL DEFAULT 'IRR',
        "status"            varchar   NOT NULL DEFAULT 'pending',
        "gateway"           varchar   NOT NULL DEFAULT 'zarinpal',
        "authority"         varchar   UNIQUE,
        "ref_id"            varchar,
        "tracking_code"     varchar,
        "description"       text,
        "metadata"          jsonb,
        "paid_at"           timestamp,
        "refunded_at"       timestamp,
        "refund_amount"     decimal(12,2),
        "error_code"        varchar,
        "error_message"     text,
        "ip_address"        varchar,
        "callback_url"      text,
        "created_at"        timestamp NOT NULL DEFAULT now(),
        "updated_at"        timestamp NOT NULL DEFAULT now(),
        CONSTRAINT "FK_payments_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    // جدول NOTIFICATIONS
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "notifications" (
        "id"          uuid      PRIMARY KEY DEFAULT gen_random_uuid(),
        "user_id"     uuid      NOT NULL,
        "title"       varchar   NOT NULL,
        "message"     text      NOT NULL,
        "type"        varchar   NOT NULL DEFAULT 'info',
        "is_read"     boolean   NOT NULL DEFAULT false,
        "created_at"  timestamp NOT NULL DEFAULT now(),
        CONSTRAINT "FK_notifications_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    // جدول SUPPORT_TICKETS
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "support_tickets" (
        "id"          uuid      PRIMARY KEY DEFAULT gen_random_uuid(),
        "user_id"     uuid,
        "subject"     varchar   NOT NULL,
        "message"     text      NOT NULL,
        "status"      varchar   NOT NULL DEFAULT 'open',
        "priority"    varchar   NOT NULL DEFAULT 'normal',
        "category"    varchar,
        "admin_reply" text,
        "replied_at"  timestamp,
        "closed_at"   timestamp,
        "metadata"    jsonb,
        "created_at"  timestamp NOT NULL DEFAULT now(),
        "updated_at"  timestamp NOT NULL DEFAULT now()
      )
    `);

    // جدول AI_CONTENT
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "ai_content" (
        "id"          uuid      PRIMARY KEY DEFAULT gen_random_uuid(),
        "title"       varchar   NOT NULL,
        "content"     text      NOT NULL,
        "type"        varchar   NOT NULL DEFAULT 'text',
        "status"      varchar   NOT NULL DEFAULT 'pending',
        "tags"        text,
        "event_id"    uuid,
        "source_data" jsonb,
        "ai_model"    varchar,
        "prompt"      text,
        "score"       float,
        "reviewed_by" uuid,
        "reviewed_at" timestamp,
        "published_at" timestamp,
        "metadata"    jsonb,
        "created_at"  timestamp NOT NULL DEFAULT now(),
        "updated_at"  timestamp NOT NULL DEFAULT now()
      )
    `);

    // جدول OTPS
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "otps" (
        "id"          uuid      PRIMARY KEY DEFAULT gen_random_uuid(),
        "phone"       varchar   NOT NULL,
        "code"        varchar   NOT NULL,
        "expires_at"  timestamp NOT NULL,
        "used"        boolean   NOT NULL DEFAULT false,
        "created_at"  timestamp NOT NULL DEFAULT now()
      )
    `);

    // جدول TEST_RESULTS
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "test_results" (
        "id"          uuid      PRIMARY KEY DEFAULT gen_random_uuid(),
        "user_id"     uuid      NOT NULL,
        "test_type"   varchar   NOT NULL DEFAULT 'big5',
        "answers"     jsonb,
        "scores"      jsonb,
        "result_type" varchar,
        "created_at"  timestamp NOT NULL DEFAULT now(),
        "updated_at"  timestamp NOT NULL DEFAULT now(),
        CONSTRAINT "FK_test_results_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    // جدول FEEDBACKS
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "feedbacks" (
        "id"          uuid      PRIMARY KEY DEFAULT gen_random_uuid(),
        "user_id"     uuid,
        "target_id"   uuid,
        "event_id"    uuid,
        "score"       integer   NOT NULL DEFAULT 5,
        "comment"     text,
        "tags"        text,
        "is_public"   boolean   NOT NULL DEFAULT false,
        "type"        varchar   NOT NULL DEFAULT 'event',
        "created_at"  timestamp NOT NULL DEFAULT now(),
        CONSTRAINT "FK_feedbacks_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL
      )
    `);

    // جدول GROUPS
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "groups" (
        "id"          uuid      PRIMARY KEY DEFAULT gen_random_uuid(),
        "event_id"    uuid,
        "name"        varchar,
        "members"     jsonb,
        "status"      varchar   NOT NULL DEFAULT 'active',
        "telegram_group_id" varchar,
        "telegram_invite_link" varchar,
        "created_at"  timestamp NOT NULL DEFAULT now(),
        "updated_at"  timestamp NOT NULL DEFAULT now()
      )
    `);

    // ═══════════════════════════════════════════════════
    // ⑥ Indexes برای کارایی
    // ═══════════════════════════════════════════════════
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_users_telegram_id"           ON "users"("telegram_id");
      CREATE INDEX IF NOT EXISTS "IDX_bookings_event_attended"     ON "bookings"("event_id", "attended");
      CREATE INDEX IF NOT EXISTS "IDX_bookings_user_status"        ON "bookings"("user_id", "status");
      CREATE INDEX IF NOT EXISTS "IDX_smart_profiles_suspended"    ON "smart_profiles"("is_suspended");
      CREATE INDEX IF NOT EXISTS "IDX_smart_profiles_user"         ON "smart_profiles"("user_id");
      CREATE INDEX IF NOT EXISTS "IDX_notifications_user_unread"   ON "notifications"("user_id", "is_read");
      CREATE INDEX IF NOT EXISTS "IDX_support_tickets_status"      ON "support_tickets"("status");
      CREATE INDEX IF NOT EXISTS "IDX_payments_user_status"        ON "payments"("user_id", "status");
      CREATE INDEX IF NOT EXISTS "IDX_events_active_date"          ON "events"("is_active", "start_date");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // حذف indexها
    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_events_active_date";
      DROP INDEX IF EXISTS "IDX_payments_user_status";
      DROP INDEX IF EXISTS "IDX_support_tickets_status";
      DROP INDEX IF EXISTS "IDX_notifications_user_unread";
      DROP INDEX IF EXISTS "IDX_smart_profiles_user";
      DROP INDEX IF EXISTS "IDX_smart_profiles_suspended";
      DROP INDEX IF EXISTS "IDX_bookings_user_status";
      DROP INDEX IF EXISTS "IDX_bookings_event_attended";
      DROP INDEX IF EXISTS "IDX_users_telegram_id";
    `);

    // توجه: جداول اصلی را drop نکن چون ممکن است داده داشته باشند
    // فقط جداول کمکی که این migration ساخته حذف می‌شوند
    await queryRunner.query(`DROP TABLE IF EXISTS "feedbacks" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "groups" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "otps" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "ai_content" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "support_tickets" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "notifications" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "test_results" CASCADE`);
  }
}
