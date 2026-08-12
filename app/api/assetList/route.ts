
import { NextResponse } from 'next/server'
import { sql } from '@vercel/postgres';

export async function GET() {
  try {
    const {rows} =
      await sql`SELECT * FROM public."Asset" ORDER BY id;`;
      
    return NextResponse.json({ assetList: rows }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}