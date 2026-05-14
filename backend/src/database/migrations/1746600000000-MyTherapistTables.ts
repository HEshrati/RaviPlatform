import { MigrationInterface, QueryRunner } from 'typeorm';

export class MyTherapistTables1746600000000 implements MigrationInterface {
  name = 'MyTherapistTables1746600000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "therapist_profiles" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "avatar_url" varchar(500),
        "credentials" text[] NOT NULL DEFAULT '{}',
        "specialties" text[] NOT NULL DEFAULT '{}',
        "bio" text NOT NULL,
        "years_of_experience" int NOT NULL DEFAULT 0,
        "price_per_session" bigint NOT NULL,
        "modes" text[] NOT NULL DEFAULT '{online}',
        "rating" float NOT NULL DEFAULT 0,
        "reviews_count" int NOT NULL DEFAULT 0,
        "city" varchar(100),
        "verified" boolean NOT NULL DEFAULT false,
        "verification_status" varchar(50) NOT NULL DEFAULT 'pending',
        "verification_notes" text,
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_therapist_profiles" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_therapist_profiles_user_id" UNIQUE ("user_id"),
        CONSTRAINT "FK_therapist_profiles_user" FOREIGN KEY ("user_id")
          REFERENCES "users"("id") ON DELETE CASCADE
      );
    `);
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_therapist_profiles_active" ON "therapist_profiles" ("is_active", "verified");`,
    );

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "support_groups" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" varchar(200) NOT NULL,
        "topic" varchar(200) NOT NULL,
        "description" text NOT NULL,
        "facilitator_id" uuid NOT NULL,
        "schedule" varchar(200) NOT NULL,
        "schedule_weekday" varchar(20),
        "schedule_time" varchar(10),
        "mode" text NOT NULL DEFAULT 'online',
        "city" varchar(100),
        "capacity" int NOT NULL,
        "members_count" int NOT NULL DEFAULT 0,
        "price_per_month" bigint NOT NULL,
        "confidentiality_level" varchar(20) NOT NULL DEFAULT 'standard',
        "rules" text[] NOT NULL DEFAULT '{}',
        "image_url" varchar(500),
        "status" varchar(30) NOT NULL DEFAULT 'active',
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_support_groups" PRIMARY KEY ("id"),
        CONSTRAINT "FK_support_groups_facilitator" FOREIGN KEY ("facilitator_id")
          REFERENCES "therapist_profiles"("id") ON DELETE RESTRICT
      );
    `);
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_support_groups_status" ON "support_groups" ("status");`,
    );

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "mt_intake_responses" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "concern_topics" text[] NOT NULL DEFAULT '{}',
        "custom_concern" text,
        "preferred_mode" text NOT NULL DEFAULT 'online',
        "preferred_times" text[] NOT NULL DEFAULT '{}',
        "city" varchar(100),
        "scale_answers" jsonb NOT NULL DEFAULT '{}',
        "budget" bigint,
        "gender_preference" varchar(20) NOT NULL DEFAULT 'any',
        "notes" text,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_mt_intake_responses" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_mt_intake_responses_user_id" UNIQUE ("user_id"),
        CONSTRAINT "FK_mt_intake_responses_user" FOREIGN KEY ("user_id")
          REFERENCES "users"("id") ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "therapy_session_bookings" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "therapist_id" uuid NOT NULL,
        "slot_date" varchar(50),
        "slot_time" varchar(20),
        "scheduled_at" TIMESTAMP WITH TIME ZONE,
        "mode" text NOT NULL DEFAULT 'online',
        "status" varchar(30) NOT NULL DEFAULT 'pending',
        "payment_status" varchar(30) NOT NULL DEFAULT 'pending',
        "amount" bigint,
        "payment_ref" varchar(200),
        "cancellation_reason" text,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_therapy_session_bookings" PRIMARY KEY ("id"),
        CONSTRAINT "FK_therapy_bookings_user" FOREIGN KEY ("user_id")
          REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_therapy_bookings_therapist" FOREIGN KEY ("therapist_id")
          REFERENCES "therapist_profiles"("id") ON DELETE RESTRICT
      );
    `);
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_therapy_bookings_user_status" ON "therapy_session_bookings" ("user_id", "status");`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_therapy_bookings_therapist" ON "therapy_session_bookings" ("therapist_id", "scheduled_at");`,
    );

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "support_group_memberships" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "group_id" uuid NOT NULL,
        "status" varchar(30) NOT NULL DEFAULT 'pending',
        "payment_status" varchar(30) NOT NULL DEFAULT 'pending',
        "amount" bigint,
        "payment_ref" varchar(200),
        "joined_at" TIMESTAMP WITH TIME ZONE,
        "left_at" TIMESTAMP WITH TIME ZONE,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_support_group_memberships" PRIMARY KEY ("id"),
        CONSTRAINT "FK_group_memberships_user" FOREIGN KEY ("user_id")
          REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_group_memberships_group" FOREIGN KEY ("group_id")
          REFERENCES "support_groups"("id") ON DELETE CASCADE
      );
    `);
    await queryRunner.query(
      `CREATE UNIQUE INDEX IF NOT EXISTS "UQ_user_group_active" ON "support_group_memberships" ("user_id", "group_id") WHERE status IN ('pending','active','on_waitlist');`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "support_group_memberships";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "therapy_session_bookings";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "mt_intake_responses";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "support_groups";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "therapist_profiles";`);
  }
}
