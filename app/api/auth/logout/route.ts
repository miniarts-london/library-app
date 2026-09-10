import { NextRequest, NextResponse } from "next/server";
import { clearGoogleSession } from "@/lib/google-auth";
import { clearHubSpotTokens } from "@/lib/hubspot-token";

export async function GET(request: NextRequest) {
  await clearHubSpotTokens();
  await clearGoogleSession();
  return NextResponse.redirect(new URL("/login", request.nextUrl.origin));
}
