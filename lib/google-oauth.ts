// Reads the Google OAuth client credentials and redirect URI from the
// environment. Centralized here so the auth routes don't each reach into
// process.env directly.

export function getGoogleOAuthCredentials() {
  return {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  };
}

// `origin` is the request's own origin (e.g. https://app.example.com or
// http://localhost:3000). GOOGLE_REDIRECT_URI can override this explicitly
// (useful behind a proxy/custom domain); otherwise we derive it from the
// current request so local dev and each deployment "just work".
export function getGoogleRedirectUri(origin: string) {
  return process.env.GOOGLE_REDIRECT_URI || `${origin}/api/auth/google/callback`;
}
