import { NextRequest, NextResponse } from "next/server";
import { consumeOAuthState, setHubSpotTokens } from "@/lib/hubspot-token";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const loginUrl = new URL("/login", origin);

  if (!code) {
    loginUrl.searchParams.set("error", "missing_code");
    return NextResponse.redirect(loginUrl);
  }

  const expectedState = await consumeOAuthState();

  if (!state || !expectedState || state !== expectedState) {
    loginUrl.searchParams.set("error", "invalid_state");
    return NextResponse.redirect(loginUrl);
  }

  const clientId = process.env.HUBSPOT_CLIENT_ID;
  const clientSecret = process.env.HUBSPOT_CLIENT_SECRET;
  const redirectUri = process.env.HUBSPOT_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    loginUrl.searchParams.set("error", "missing_config");
    return NextResponse.redirect(loginUrl);
  }

  const response = await fetch("https://api.hubapi.com/oauth/v1/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      code,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("HubSpot token exchange failed:", data);
    loginUrl.searchParams.set("error", "token_exchange");
    return NextResponse.redirect(loginUrl);
  }

  await setHubSpotTokens(data);

  return NextResponse.redirect(new URL("/", origin));
}
