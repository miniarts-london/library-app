import { cookies } from "next/headers";

// Mirrors the cookie-based approach in lib/google-auth.ts: no database,
// just an httpOnly cookie holding the OAuth tokens for this single
// HubSpot portal connection.

const STATE_COOKIE = "hubspot_oauth_state";
const TOKENS_COOKIE = "hubspot_tokens";

const STATE_MAX_AGE_SECONDS = 60 * 10; // 10 minutes
const TOKENS_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days - refreshed well before expiry, see getValidHubSpotAccessToken()

const baseCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

type StoredHubSpotTokens = {
  accessToken: string;
  refreshToken?: string;
  // ms since epoch
  expiresAt: number;
};

// HubSpot's token response shape (both the initial code exchange and the
// refresh grant return the same fields).
type HubSpotTokenResponse = {
  access_token: string;
  refresh_token?: string;
  expires_in: number; // seconds
};

// --- CSRF state for the OAuth redirect dance ---

export async function setOAuthState(state: string) {
  const cookieStore = await cookies();
  cookieStore.set(STATE_COOKIE, state, {
    ...baseCookieOptions,
    maxAge: STATE_MAX_AGE_SECONDS,
  });
}

export async function consumeOAuthState() {
  const cookieStore = await cookies();
  const value = cookieStore.get(STATE_COOKIE)?.value;
  if (value) {
    cookieStore.delete(STATE_COOKIE);
  }
  return value;
}

// --- Tokens ---

export async function setHubSpotTokens(tokenResponse: HubSpotTokenResponse) {
  const cookieStore = await cookies();
  const stored: StoredHubSpotTokens = {
    accessToken: tokenResponse.access_token,
    refreshToken: tokenResponse.refresh_token,
    expiresAt: Date.now() + tokenResponse.expires_in * 1000,
  };
  cookieStore.set(TOKENS_COOKIE, JSON.stringify(stored), {
    ...baseCookieOptions,
    maxAge: TOKENS_MAX_AGE_SECONDS,
  });
}

export async function getHubSpotTokens(): Promise<StoredHubSpotTokens | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(TOKENS_COOKIE)?.value;
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.accessToken === "string") {
      return parsed as StoredHubSpotTokens;
    }
    return null;
  } catch {
    return null;
  }
}

export async function clearHubSpotTokens() {
  const cookieStore = await cookies();
  cookieStore.delete(TOKENS_COOKIE);
}

// Returns a still-valid access token, refreshing it first if it's expired
// (or about to expire) and a refresh token is available. Returns null if
// there's nothing usable stored - callers fall back to
// HUBSPOT_ACCESS_TOKEN (see lib/hubspot-contacts.ts) in that case.
export async function getValidHubSpotAccessToken(): Promise<string | null> {
  const tokens = await getHubSpotTokens();
  if (!tokens) return null;

  const EXPIRY_BUFFER_MS = 60 * 1000; // refresh a minute early
  if (tokens.expiresAt - EXPIRY_BUFFER_MS > Date.now()) {
    return tokens.accessToken;
  }

  if (!tokens.refreshToken) {
    return null;
  }

  const clientId = process.env.HUBSPOT_CLIENT_ID;
  const clientSecret = process.env.HUBSPOT_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return null;
  }

  const response = await fetch("https://api.hubapi.com/oauth/v1/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: tokens.refreshToken,
    }),
  });

  if (!response.ok) {
    console.error("HubSpot token refresh failed:", await response.text());
    return null;
  }

  const data = (await response.json()) as HubSpotTokenResponse;
  await setHubSpotTokens(data);
  return data.access_token;
}
