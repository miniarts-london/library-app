import { NextResponse } from "next/server";
import { fetchHubSpotContacts } from "@/lib/hubspot-contacts";

export async function GET() {
  const result = await fetchHubSpotContacts();

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status },
    );
  }

  return NextResponse.json({ results: result.results });
}
