import { NextRequest, NextResponse } from "next/server";
import {
  consumeGoogleOAuthState,
  setGoogleSession,
} from "@/lib/google-auth";
import {
  getGoogleOAuthCredentials,
  getGoogleRedirectUri,
} from "@/lib/google-oauth";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const loginUrl = new URL("/login", origin);

  if (!code) {
    loginUrl.searchParams.set("error", "google_missing_code");
    return NextResponse.redirect(loginUrl);
  }

  const expectedState = await consumeGoogleOAuthState();

  if (!state || !expectedState || state !== expectedState) {
    loginUrl.searchParams.set("error", "google_invalid_state");
    return NextResponse.redirect(loginUrl);
  }

  const { clientId, clientSecret } = getGoogleOAuthCredentials();
  const redirectUri = getGoogleRedirectUri(origin);

  if (!clientId || !clientSecret) {
    loginUrl.searchParams.set("error", "google_missing_config");
    return NextResponse.redirect(loginUrl);
  }

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
    }),
  });

  const tokenData = await tokenResponse.json();

  if (!tokenResponse.ok) {
    console.error("Google token exchange failed:", tokenData);
    loginUrl.searchParams.set("error", "google_token_exchange");
    return NextResponse.redirect(loginUrl);
  }

  const userResponse = await fetch(
    "https://www.googleapis.com/oauth2/v3/userinfo",
    {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    },
  );

  const user = await userResponse.json();

  if (!userResponse.ok || !user.sub || !user.email) {
    console.error("Google userinfo failed:", user);
    loginUrl.searchParams.set("error", "google_userinfo");
    return NextResponse.redirect(loginUrl);
  }

  await setGoogleSession({
    sub: user.sub,
    email: user.email,
    name: user.name ?? user.email,
    picture: user.picture,
  });

  return NextResponse.redirect(new URL("/", origin));
}
