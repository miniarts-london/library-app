import { sql } from '@vercel/postgres'
import { unstable_cache } from 'next/cache'

// The single source of truth for reading the asset list from Postgres.
// A server component can import and call this directly — no HTTP hop —
// since it runs in the same process and trust boundary as the DB call
// itself. The `/api/assetList` route handler (app/api/assetList/route.ts)
// imports this same function, so a client component or an external
// consumer that genuinely needs it over HTTP still can, without the SQL
// or cache config being duplicated in two places.
export const queryAssetList = unstable_cache(
  async () => {
    const { rows } = await sql`SELECT * FROM public."Asset" ORDER BY id;`
    return rows
  },
  ['asset-list'],
  { revalidate: 60, tags: ['assets'] },
)
