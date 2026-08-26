-- ============================================
-- ServiceFinder — Full Database Schema
-- Paste this entire script into Supabase SQL Editor and click Run
-- ============================================


-- ── 1. USERS ──────────────────────────────
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  avatar_url TEXT,
  is_provider BOOLEAN DEFAULT false NOT NULL,
  is_admin BOOLEAN DEFAULT false NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP DEFAULT now() NOT NULL
);


-- ── 2. SERVICES ───────────────────────────
CREATE TABLE services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  provider_type TEXT NOT NULL CHECK (provider_type IN ('shop', 'freelancer')),
  service_mode TEXT NOT NULL CHECK (service_mode IN ('visit_only', 'comes_to_you', 'both')),
  price_min NUMERIC NOT NULL,
  price_max NUMERIC NOT NULL,
  phone TEXT NOT NULL,
  photo_url TEXT,
  latitude NUMERIC NOT NULL,
  longitude NUMERIC NOT NULL,
  address TEXT,
  service_range_km NUMERIC,
  avg_rating NUMERIC DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false NOT NULL,
  is_active BOOLEAN DEFAULT false NOT NULL,
  is_paused BOOLEAN DEFAULT false NOT NULL,
  slug TEXT UNIQUE,
  created_at TIMESTAMP DEFAULT now() NOT NULL
);


-- ── 3. WORKING HOURS ──────────────────────
CREATE TABLE working_hours (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  day TEXT NOT NULL CHECK (day IN ('monday','tuesday','wednesday','thursday','friday','saturday','sunday')),
  is_open BOOLEAN DEFAULT true NOT NULL,
  open_time TIME,
  close_time TIME,
  UNIQUE (service_id, day)
);


-- ── 4. REVIEWS ────────────────────────────
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT now() NOT NULL,
  UNIQUE (service_id, customer_id)
);


-- ── 5. FAVORITES ──────────────────────────
CREATE TABLE favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT now() NOT NULL,
  UNIQUE (user_id, service_id)
);


-- ── 6. SERVICE REQUESTS ───────────────────
CREATE TABLE service_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  location_name TEXT NOT NULL,
  latitude NUMERIC,
  longitude NUMERIC,
  status TEXT DEFAULT 'open' NOT NULL CHECK (status IN ('open', 'filled', 'closed')),
  created_at TIMESTAMP DEFAULT now() NOT NULL
);


-- ── 7. REQUEST RESPONSES ──────────────────
CREATE TABLE request_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID NOT NULL REFERENCES service_requests(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now() NOT NULL
);


-- ── 8. CONVERSATIONS ──────────────────────
CREATE TABLE conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_one_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_two_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  last_message TEXT,
  last_message_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now() NOT NULL,
  UNIQUE (user_one_id, user_two_id)
);


-- ── 9. MESSAGES ───────────────────────────
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP DEFAULT now() NOT NULL
);


-- ── 10. VERIFICATION REQUESTS ─────────────
CREATE TABLE verification_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  document_url TEXT NOT NULL,
  status TEXT DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_note TEXT,
  created_at TIMESTAMP DEFAULT now() NOT NULL
);


-- ── 11. REPORTS ───────────────────────────
CREATE TABLE reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'reviewed', 'dismissed')),
  created_at TIMESTAMP DEFAULT now() NOT NULL
);


-- ============================================
-- ENABLE REALTIME on messages table
-- ============================================
ALTER PUBLICATION supabase_realtime ADD TABLE messages;


-- ============================================
-- AUTO DELETE requests older than 7 days
-- ============================================
CREATE EXTENSION IF NOT EXISTS pg_cron;

SELECT cron.schedule(
  'delete-old-requests',
  '0 0 * * *',
  $$
    DELETE FROM service_requests
    WHERE created_at < now() - INTERVAL '7 days'
    AND status = 'open';
  $$
);


-- ============================================
-- Done! All 11 tables created successfully.
-- ============================================
