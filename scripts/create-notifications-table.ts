// One-off setup script - creates the Notification table if it doesn't
// exist yet. Needs POSTGRES_URL in the environment (run `vercel env pull
// .env.local` first if you don't have it locally), then:
//
//   npx tsx scripts/create-notifications-table.ts
//
// Safe to re-run - both statements are idempotent (IF NOT EXISTS).

import { sql } from "@vercel/postgres";

async function main() {
  await sql`
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
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS notification_created_at_idx
      ON public."Notification" (created_at DESC);
  `;

  console.log("Notification table ready.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
