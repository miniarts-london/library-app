
import { NextResponse } from 'next/server'
import { sql } from '@vercel/postgres';
import { unstable_cache } from 'next/cache';

// Wrapping the raw DB call in unstable_cache (rather than relying only on
// the `revalidate` export below) is what lets this be tagged. A plain
// `export const revalidate = 60` caches the route's response on a timer,
// but a direct `sql` query isn't a `fetch`, so it has no way to carry
// cache tags on its own — unstable_cache adds that, so a future mutation
// can call revalidateTag('assets') to invalidate this immediately instead
// of waiting up to 60s for it to go stale.
const getAssetList = unstable_cache(
  async () => {
    const { rows } = await sql`SELECT * FROM public."Asset" ORDER BY id;`
    return rows
  },
  ['asset-list'],
  { revalidate: 60, tags: ['assets'] },
)

// Allow this route's response to be cached and revalidated every 60s
// instead of running fresh on every single request.
export const revalidate = 60

export async function GET() {
  try {
    const rows = await getAssetList()

    return NextResponse.json({ assetList: rows }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
