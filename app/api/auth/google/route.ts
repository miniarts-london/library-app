import { NextRequest, NextResponse } from "next/server";
import { setGoogleOAuthState } from "@/lib/google-auth";
import {
  getGoogleOAuthCredentials,
  getGoogleRedirectUri,
} from "@/lib/google-oauth";

export async function GET(request: NextRequest) {
  const { clientId } = getGoogleOAuthCredentials();
  const redirectUri = getGoogleRedirectUri(request.nextUrl.origin);
  const loginUrl = new URL("/login", request.nextUrl.origin);

  if (!clientId) {
    loginUrl.searchParams.set("error", "google_missing_config");
    return NextResponse.redirect(loginUrl);
  }

  const state = crypto.randomUUID();
  await setGoogleOAuthState(state);

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state,
    access_type: "offline",
    prompt: "select_account",
  });

  return NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
  );
}
