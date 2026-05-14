-- ============================================
-- Ravi Platform - Database Migration
-- Version: 1.0.0
-- Purpose: Fix missing tables, indexes, and relationships
-- ============================================

-- 1. CREATE MISSING TABLES
-- ============================================

-- Events Table (گمشده بود)
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_type VARCHAR(50) NOT NULL, -- 'course', 'workshop', 'webinar', 'meetup'
    category VARCHAR(100),
    capacity INT NOT NULL CHECK (capacity > 0),
    current_bookings INT DEFAULT 0 CHECK (current_bookings >= 0 AND current_bookings <= capacity),
    min_match_score FLOAT DEFAULT 0.7 CHECK (min_match_score >= 0 AND min_match_score <= 1),
    max_group_size INT DEFAULT 6,
    min_group_size INT DEFAULT 3,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    registration_deadline TIMESTAMP,
    price DECIMAL(10,2) NOT NULL DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'IRR',
    location VARCHAR(255),
    is_online BOOLEAN DEFAULT false,
    meeting_link VARCHAR(500),
    image_url VARCHAR(500),
    instructor_name VARCHAR(255),
    requirements TEXT,
    tags TEXT[], -- Array of tags
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT valid_dates CHECK (end_date > start_date),
    CONSTRAINT valid_registration_deadline CHECK (registration_deadline IS NULL OR registration_deadline <= start_date)
);

-- Bookings Table (گمشده بود)
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'pending', 
    -- Status: 'pending', 'confirmed', 'cancelled', 'expired', 'waitlist'
    payment_status VARCHAR(20) DEFAULT 'unpaid',
    -- Payment status: 'unpaid', 'pending', 'paid', 'refunded', 'failed'
    payment_id UUID,
    amount_paid DECIMAL(10,2),
    booking_code VARCHAR(50) UNIQUE,
    locked_until TIMESTAMP, -- برای Lock mechanism
    locked_by_session VARCHAR(255),
    confirmation_code VARCHAR(50),
    cancellation_reason TEXT,
    cancelled_at TIMESTAMP,
    confirmed_at TIMESTAMP,
    attended BOOLEAN DEFAULT false,
    attendance_marked_at TIMESTAMP,
    metadata JSONB, -- Extra data as JSON
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT unique_user_event UNIQUE(event_id, user_id),
    CONSTRAINT valid_amount CHECK (amount_paid IS NULL OR amount_paid >= 0)
);

-- Payments Table (گمشده بود)
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    currency VARCHAR(3) DEFAULT 'IRR',
    payment_method VARCHAR(50) NOT NULL,
    -- Payment methods: 'zarinpal', 'paypal', 'stripe', 'bank_transfer', 'wallet'
    payment_gateway VARCHAR(50),
    gateway_transaction_id VARCHAR(255),
    gateway_reference VARCHAR(255),
    gateway_tracking_code VARCHAR(255),
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    -- Status: 'pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled'
    description TEXT,
    payer_name VARCHAR(255),
    payer_email VARCHAR(255),
    payer_phone VARCHAR(20),
    callback_url TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    metadata JSONB,
    paid_at TIMESTAMP,
    refunded_at TIMESTAMP,
    refund_amount DECIMAL(10,2),
    refund_reason TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Transaction Logs Table (برای Audit Trail)
CREATE TABLE IF NOT EXISTS transaction_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID,
    old_data JSONB,
    new_data JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    -- Types: 'booking_confirmed', 'payment_received', 'match_found', 'group_formed', 'message_received', etc.
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    link VARCHAR(500),
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP,
    priority VARCHAR(20) DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
    channel VARCHAR(20) DEFAULT 'in_app', -- 'in_app', 'email', 'sms', 'telegram', 'push'
    sent_at TIMESTAMP,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Email Verification Tokens
CREATE TABLE IF NOT EXISTS email_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Password Reset Tokens
CREATE TABLE IF NOT EXISTS password_resets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    used_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Session Management
CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(500) NOT NULL UNIQUE,
    refresh_token VARCHAR(500),
    device_info TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    last_activity TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 2. ALTER EXISTING TABLES
-- ============================================

-- Update matches table
ALTER TABLE matches 
    ADD COLUMN IF NOT EXISTS event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    ADD COLUMN IF NOT EXISTS booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS locked_until TIMESTAMP,
    ADD COLUMN IF NOT EXISTS locked_by_session VARCHAR(255),
    ADD COLUMN IF NOT EXISTS match_reason TEXT,
    ADD COLUMN IF NOT EXISTS dismissed_at TIMESTAMP,
    ADD COLUMN IF NOT EXISTS dismissed_reason TEXT;

-- Update groups table
ALTER TABLE groups
    ADD COLUMN IF NOT EXISTS event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    ADD COLUMN IF NOT EXISTS formation_date TIMESTAMP DEFAULT NOW(),
    ADD COLUMN IF NOT EXISTS disbandment_date TIMESTAMP,
    ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active'; -- 'forming', 'active', 'completed', 'disbanded'

-- Update group_members table
ALTER TABLE group_members
    ADD COLUMN IF NOT EXISTS invitation_sent_at TIMESTAMP,
    ADD COLUMN IF NOT EXISTS invitation_accepted_at TIMESTAMP,
    ADD COLUMN IF NOT EXISTS invitation_rejected_at TIMESTAMP,
    ADD COLUMN IF NOT EXISTS removed_at TIMESTAMP,
    ADD COLUMN IF NOT EXISTS removed_by_user_id UUID REFERENCES users(id),
    ADD COLUMN IF NOT EXISTS removal_reason TEXT;

-- Update users table
ALTER TABLE users
    ADD COLUMN IF NOT EXISTS current_fsm_state VARCHAR(50) DEFAULT 'onboarding',
    ADD COLUMN IF NOT EXISTS last_login TIMESTAMP,
    ADD COLUMN IF NOT EXISTS login_count INT DEFAULT 0,
    ADD COLUMN IF NOT EXISTS profile_completed_at TIMESTAMP,
    ADD COLUMN IF NOT EXISTS verification_sent_at TIMESTAMP,
    ADD COLUMN IF NOT EXISTS banned_at TIMESTAMP,
    ADD COLUMN IF NOT EXISTS ban_reason TEXT;

-- Update profiles table
ALTER TABLE profiles
    ADD COLUMN IF NOT EXISTS profile_completion_percentage INT DEFAULT 0 CHECK (profile_completion_percentage >= 0 AND profile_completion_percentage <= 100),
    ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true,
    ADD COLUMN IF NOT EXISTS profile_views INT DEFAULT 0,
    ADD COLUMN IF NOT EXISTS last_active TIMESTAMP;

-- Update conversations table
ALTER TABLE conversations
    ADD COLUMN IF NOT EXISTS event_id UUID REFERENCES events(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS archived_at TIMESTAMP;

-- Update messages table
ALTER TABLE messages
    ADD COLUMN IF NOT EXISTS edited_at TIMESTAMP,
    ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP,
    ADD COLUMN IF NOT EXISTS is_system_message BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS reply_to_message_id UUID REFERENCES messages(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS reactions JSONB; -- {emoji: [user_ids]}

-- Update feedbacks table
ALTER TABLE feedbacks
    ADD COLUMN IF NOT EXISTS event_id UUID REFERENCES events(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS response TEXT,
    ADD COLUMN IF NOT EXISTS responded_at TIMESTAMP,
    ADD COLUMN IF NOT EXISTS is_anonymous BOOLEAN DEFAULT false;

-- Update reports table
ALTER TABLE reports
    ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP,
    ADD COLUMN IF NOT EXISTS reviewed_by_user_id UUID REFERENCES users(id),
    ADD COLUMN IF NOT EXISTS review_notes TEXT,
    ADD COLUMN IF NOT EXISTS action_taken VARCHAR(100);

-- ============================================
-- 3. CREATE INDEXES
-- ============================================

-- Users table indexes
CREATE INDEX IF NOT EXISTS idx_users_telegram_id ON users(telegram_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone_number ON users(phone_number);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_is_verified ON users(is_verified);
CREATE INDEX IF NOT EXISTS idx_users_is_banned ON users(is_banned);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Profiles table indexes
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_city ON profiles(city);
CREATE INDEX IF NOT EXISTS idx_profiles_gender ON profiles(gender);
CREATE INDEX IF NOT EXISTS idx_profiles_education_level ON profiles(education_level);
CREATE INDEX IF NOT EXISTS idx_profiles_bio_vector ON profiles USING ivfflat (bio_vector vector_cosine_ops); -- For vector similarity

-- Events table indexes
CREATE INDEX IF NOT EXISTS idx_events_event_type ON events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_is_active ON events(is_active);
CREATE INDEX IF NOT EXISTS idx_events_is_featured ON events(is_featured);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
CREATE INDEX IF NOT EXISTS idx_events_tags ON events USING GIN(tags); -- For array search

-- Bookings table indexes
CREATE INDEX IF NOT EXISTS idx_bookings_event_id ON bookings(event_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON bookings(payment_status);
CREATE INDEX IF NOT EXISTS idx_bookings_event_user ON bookings(event_id, user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_locked_until ON bookings(locked_until);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at);

-- Payments table indexes
CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_gateway_transaction_id ON payments(gateway_transaction_id);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at);

-- Messages table indexes
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_is_encrypted ON messages(is_encrypted);

-- Conversations table indexes
CREATE INDEX IF NOT EXISTS idx_conversations_group_id ON conversations(group_id);
CREATE INDEX IF NOT EXISTS idx_conversations_user_a ON conversations(user_a);
CREATE INDEX IF NOT EXISTS idx_conversations_user_b ON conversations(user_b);
CREATE INDEX IF NOT EXISTS idx_conversations_conversation_type ON conversations(conversation_type);
CREATE INDEX IF NOT EXISTS idx_conversations_event_id ON conversations(event_id);

-- Matches table indexes
CREATE INDEX IF NOT EXISTS idx_matches_user_id ON matches(user_id);
CREATE INDEX IF NOT EXISTS idx_matches_target_user_id ON matches(target_user_id);
CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status);
CREATE INDEX IF NOT EXISTS idx_matches_event_id ON matches(event_id);
CREATE INDEX IF NOT EXISTS idx_matches_compatibility_score ON matches(compatibility_score);
CREATE INDEX IF NOT EXISTS idx_matches_locked_until ON matches(locked_until);

-- Groups table indexes
CREATE INDEX IF NOT EXISTS idx_groups_type ON groups(type);
CREATE INDEX IF NOT EXISTS idx_groups_telegram_group_id ON groups(telegram_group_id);
CREATE INDEX IF NOT EXISTS idx_groups_is_active ON groups(is_active);
CREATE INDEX IF NOT EXISTS idx_groups_event_id ON groups(event_id);
CREATE INDEX IF NOT EXISTS idx_groups_status ON groups(status);

-- Group members indexes
CREATE INDEX IF NOT EXISTS idx_group_members_group_id ON group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_group_members_user_id ON group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_group_members_role ON group_members(role);

-- Notifications table indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- Transaction logs indexes
CREATE INDEX IF NOT EXISTS idx_transaction_logs_user_id ON transaction_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_transaction_logs_entity_type ON transaction_logs(entity_type);
CREATE INDEX IF NOT EXISTS idx_transaction_logs_entity_id ON transaction_logs(entity_id);
CREATE INDEX IF NOT EXISTS idx_transaction_logs_action ON transaction_logs(action);
CREATE INDEX IF NOT EXISTS idx_transaction_logs_created_at ON transaction_logs(created_at);

-- User tags indexes
CREATE INDEX IF NOT EXISTS idx_user_tags_user_id ON user_tags(user_id);
CREATE INDEX IF NOT EXISTS idx_user_tags_tag_id ON user_tags(tag_id);

-- Tags indexes
CREATE INDEX IF NOT EXISTS idx_tags_category ON tags(category);
CREATE INDEX IF NOT EXISTS idx_tags_title_fa ON tags(title_fa);

-- Feedbacks indexes
CREATE INDEX IF NOT EXISTS idx_feedbacks_user_id ON feedbacks(user_id);
CREATE INDEX IF NOT EXISTS idx_feedbacks_target_id ON feedbacks(target_id);
CREATE INDEX IF NOT EXISTS idx_feedbacks_rating ON feedbacks(rating);
CREATE INDEX IF NOT EXISTS idx_feedbacks_event_id ON feedbacks(event_id);

-- Reports indexes
CREATE INDEX IF NOT EXISTS idx_reports_reporter_id ON reports(reporter_id);
CREATE INDEX IF NOT EXISTS idx_reports_reported_user_id ON reports(reported_user_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);

-- Blocks indexes
CREATE INDEX IF NOT EXISTS idx_blocks_blocker_id ON blocks(blocker_id);
CREATE INDEX IF NOT EXISTS idx_blocks_blocked_user_id ON blocks(blocked_user_id);

-- ============================================
-- 4. CREATE TRIGGERS & FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all relevant tables
DO $$
DECLARE
    t TEXT;
BEGIN
    FOR t IN 
        SELECT table_name 
        FROM information_schema.columns 
        WHERE column_name = 'updated_at' 
        AND table_schema = 'public'
    LOOP
        EXECUTE format('
            DROP TRIGGER IF EXISTS trigger_update_updated_at ON %I;
            CREATE TRIGGER trigger_update_updated_at
            BEFORE UPDATE ON %I
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
        ', t, t);
    END LOOP;
END $$;

-- Function to update event capacity
CREATE OR REPLACE FUNCTION update_event_capacity()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.status = 'confirmed' THEN
        UPDATE events 
        SET current_bookings = current_bookings + 1 
        WHERE id = NEW.event_id;
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.status != 'confirmed' AND NEW.status = 'confirmed' THEN
            UPDATE events 
            SET current_bookings = current_bookings + 1 
            WHERE id = NEW.event_id;
        ELSIF OLD.status = 'confirmed' AND NEW.status != 'confirmed' THEN
            UPDATE events 
            SET current_bookings = current_bookings - 1 
            WHERE id = NEW.event_id;
        END IF;
    ELSIF TG_OP = 'DELETE' AND OLD.status = 'confirmed' THEN
        UPDATE events 
        SET current_bookings = current_bookings - 1 
        WHERE id = OLD.event_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_event_capacity
AFTER INSERT OR UPDATE OR DELETE ON bookings
FOR EACH ROW
EXECUTE FUNCTION update_event_capacity();

-- Function to auto-expire bookings
CREATE OR REPLACE FUNCTION expire_locked_bookings()
RETURNS void AS $$
BEGIN
    UPDATE bookings
    SET status = 'expired'
    WHERE status = 'pending' 
    AND locked_until IS NOT NULL 
    AND locked_until < NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to calculate profile completion percentage
CREATE OR REPLACE FUNCTION calculate_profile_completion(profile_id UUID)
RETURNS INT AS $$
DECLARE
    completion INT := 0;
    total_fields INT := 11;
    filled_fields INT := 0;
BEGIN
    SELECT 
        (CASE WHEN first_name IS NOT NULL AND first_name != '' THEN 1 ELSE 0 END) +
        (CASE WHEN last_name IS NOT NULL AND last_name != '' THEN 1 ELSE 0 END) +
        (CASE WHEN gender IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN birth_date IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN marital_status IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN education_level IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN religious_intensity IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN smoking_status IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN alcohol_status IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN bio IS NOT NULL AND bio != '' THEN 1 ELSE 0 END) +
        (CASE WHEN city IS NOT NULL AND city != '' THEN 1 ELSE 0 END)
    INTO filled_fields
    FROM profiles
    WHERE user_id = profile_id;
    
    completion := (filled_fields * 100) / total_fields;
    
    UPDATE profiles 
    SET profile_completion_percentage = completion
    WHERE user_id = profile_id;
    
    RETURN completion;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 5. CREATE VIEWS
-- ============================================

-- View for active events with booking stats
CREATE OR REPLACE VIEW v_active_events AS
SELECT 
    e.*,
    (e.capacity - e.current_bookings) as available_slots,
    ROUND((e.current_bookings::DECIMAL / e.capacity) * 100, 2) as booking_percentage,
    CASE 
        WHEN e.current_bookings >= e.capacity THEN 'full'
        WHEN e.current_bookings >= e.capacity * 0.8 THEN 'almost_full'
        WHEN e.current_bookings >= e.capacity * 0.5 THEN 'half_full'
        ELSE 'available'
    END as availability_status
FROM events e
WHERE e.is_active = true
AND e.end_date > NOW();

-- View for user statistics
CREATE OR REPLACE VIEW v_user_stats AS
SELECT 
    u.id,
    u.email,
    u.role,
    u.credits_balance,
    p.first_name,
    p.last_name,
    p.profile_completion_percentage,
    COUNT(DISTINCT b.id) as total_bookings,
    COUNT(DISTINCT CASE WHEN b.status = 'confirmed' THEN b.id END) as confirmed_bookings,
    COUNT(DISTINCT m.id) as total_matches,
    COUNT(DISTINCT gm.group_id) as groups_joined,
    COUNT(DISTINCT conv.id) as active_conversations,
    u.created_at,
    u.last_login
FROM users u
LEFT JOIN profiles p ON u.id = p.user_id
LEFT JOIN bookings b ON u.id = b.user_id
LEFT JOIN matches m ON u.id = m.user_id
LEFT JOIN group_members gm ON u.id = gm.user_id
LEFT JOIN conversations conv ON u.id = conv.user_a OR u.id = conv.user_b
GROUP BY u.id, p.first_name, p.last_name, p.profile_completion_percentage;

-- ============================================
-- 6. SEED DATA (Optional - for testing)
-- ============================================

-- Insert sample tags
INSERT INTO tags (title_fa, category) VALUES
    ('برنامه‌نویسی', 'interests'),
    ('طراحی', 'interests'),
    ('بازاریابی', 'interests'),
    ('کارآفرینی', 'interests'),
    ('ورزش', 'interests'),
    ('موسیقی', 'interests'),
    ('سفر', 'interests'),
    ('مطالعه', 'interests')
ON CONFLICT DO NOTHING;

-- ============================================
-- 7. GRANT PERMISSIONS (if needed)
-- ============================================

-- Example: Grant permissions to app user
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO ravi_app_user;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO ravi_app_user;

-- ============================================
-- 8. MAINTENANCE QUERIES
-- ============================================

-- Query to clean up expired booking locks (run periodically)
-- DELETE FROM bookings WHERE status = 'pending' AND locked_until < NOW() - INTERVAL '1 day';

-- Query to archive old transaction logs (run monthly)
-- CREATE TABLE IF NOT EXISTS transaction_logs_archive (LIKE transaction_logs INCLUDING ALL);
-- INSERT INTO transaction_logs_archive SELECT * FROM transaction_logs WHERE created_at < NOW() - INTERVAL '6 months';
-- DELETE FROM transaction_logs WHERE created_at < NOW() - INTERVAL '6 months';

COMMIT;

-- ============================================
-- END OF MIGRATION
-- ============================================
-- ============================================
-- 9. AI RECOMMENDATION + TELEGRAM BOT TABLES
-- ============================================

CREATE TABLE IF NOT EXISTS user_telegram_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    telegram_user_id BIGINT NOT NULL UNIQUE,
    telegram_username VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT unique_user_telegram_link UNIQUE (user_id)
);

CREATE TABLE IF NOT EXISTS telegram_group_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    telegram_chat_id BIGINT NOT NULL,
    telegram_user_id BIGINT NOT NULL,
    telegram_username VARCHAR(255),
    message_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_telegram_group_messages_user_id
ON telegram_group_messages (telegram_user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS event_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    recommendation_source VARCHAR(20) NOT NULL DEFAULT 'hybrid',
    score FLOAT NOT NULL CHECK (score >= 0),
    reason TEXT,
    is_sent_to_telegram BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_event_recommendations_user_time
ON event_recommendations (user_id, created_at DESC);

-- ============================================
-- GROUP-BASED MATCHING ENGINE
-- ============================================

ALTER TABLE profiles
    ADD COLUMN IF NOT EXISTS personality_type VARCHAR(32),
    ADD COLUMN IF NOT EXISTS personality_traits TEXT[],
    ADD COLUMN IF NOT EXISTS preferred_event_types TEXT[];

ALTER TABLE events
    ADD COLUMN IF NOT EXISTS event_type VARCHAR(50),
    ADD COLUMN IF NOT EXISTS city VARCHAR(100),
    ADD COLUMN IF NOT EXISTS target_personality_traits TEXT[];

CREATE TABLE IF NOT EXISTS group_matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    score FLOAT NOT NULL,
    personality_score FLOAT NOT NULL,
    interests_score FLOAT NOT NULL,
    city_score FLOAT NOT NULL,
    event_type_score FLOAT NOT NULL,
    scoring_explanation TEXT NOT NULL,
    scoring_breakdown JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_group_matches_user_id ON group_matches(user_id);
CREATE INDEX IF NOT EXISTS idx_group_matches_event_id ON group_matches(event_id);
CREATE INDEX IF NOT EXISTS idx_group_matches_score ON group_matches(score DESC);
