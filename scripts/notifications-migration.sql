-- Run this once against your Vercel Postgres database (the same one
-- "Asset" already lives in). Easiest ways to run it:
--   1. Vercel dashboard -> Storage -> your Postgres DB -> Query tab, paste + run.
--   2. Or: vercel env pull .env.local && npx tsx scripts/create-notifications-table.ts

CREATE TABLE IF NOT EXISTS public."Notification" (
  id SERIAL PRIMARY KEY,
  type TEXT NOT NULL DEFAULT 'general',
  title TEXT NOT NULL,
  body TEXT,
  data JSONB,
  recipient_email TEXT,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS notification_created_at_idx
  ON public."Notification" (created_at DESC);
