-- Migration: Add created_by and wallet fields (SAFE)

BEGIN;

-- events.created_by
ALTER TABLE IF EXISTS events
  ADD COLUMN IF NOT EXISTS created_by UUID;

-- users.credits_balance
ALTER TABLE IF EXISTS users
  ADD COLUMN IF NOT EXISTS credits_balance DECIMAL(14,2) DEFAULT 0;

-- FK فقط اگر هر دو جدول وجود دارند
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='events')
     AND EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='users')
  THEN
    ALTER TABLE events
      ADD CONSTRAINT fk_events_created_by
      FOREIGN KEY (created_by)
      REFERENCES users(id)
      ON DELETE SET NULL;
  END IF;
END$$;

-- indexes
CREATE INDEX IF NOT EXISTS idx_events_created_by
  ON events(created_by);

CREATE INDEX IF NOT EXISTS idx_bookings_event_user
  ON bookings(event_id, user_id);

-- payments refunds
ALTER TABLE IF EXISTS payments
  ADD COLUMN IF NOT EXISTS refund_amount DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS refund_reason TEXT,
  ADD COLUMN IF NOT EXISTS refunded_at TIMESTAMP;

COMMIT;
