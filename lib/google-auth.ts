import { cookies } from "next/headers";

// Session is stored as a signed-nothing, httpOnly JSON cookie. That's
// enough for this internal tool (the cookie only ever holds the Google
// profile fields below, never a token), and avoids standing up a
// database/session store just to gate a single-portal admin page.

const SESSION_COOKIE = "google_session";
const STATE_COOKIE = "google_oauth_state";

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days
const STATE_MAX_AGE_SECONDS = 60 * 10; // 10 minutes - just long enough for the redirect round trip

export type GoogleSession = {
  sub: string;
  email: string;
  name: string;
  picture?: string;
};

const baseCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

// --- CSRF state for the OAuth redirect dance ---

export async function setGoogleOAuthState(state: string) {
  const cookieStore = await cookies();
  cookieStore.set(STATE_COOKIE, state, {
    ...baseCookieOptions,
    maxAge: STATE_MAX_AGE_SECONDS,
  });
}

// Reads the expected state and deletes the cookie so it can't be replayed.
export async function consumeGoogleOAuthState() {
  const cookieStore = await cookies();
  const value = cookieStore.get(STATE_COOKIE)?.value;
  if (value) {
    cookieStore.delete(STATE_COOKIE);
  }
  return value;
}

// --- The logged-in session itself ---

export async function setGoogleSession(session: GoogleSession) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, JSON.stringify(session), {
    ...baseCookieOptions,
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function getGoogleSession(): Promise<GoogleSession | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE)?.value;
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.sub === "string" && typeof parsed.email === "string") {
      return parsed as GoogleSession;
    }
    return null;
  } catch {
    return null;
  }
}

export async function hasGoogleSession() {
  return (await getGoogleSession()) !== null;
}

export async function clearGoogleSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
