import { getGoogleSession } from "@/lib/google-auth";
import { getHubSpotProjectName } from "@/lib/hubspot-project";
import { redirect } from "next/navigation";

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

const errorMessages: Record<string, string> = {
  missing_code: "HubSpot did not return an authorization code.",
  invalid_state: "The login attempt expired. Please try again.",
  missing_config: "HubSpot OAuth is not configured on this server.",
  token_exchange:
    "HubSpot could not complete login. Check the app credentials and redirect URL.",
  google_missing_code: "Google did not return an authorization code.",
  google_invalid_state: "The Google login attempt expired. Please try again.",
  google_missing_config:
    "Google OAuth is not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in the production environment (not .env.local), then add this site's /api/auth/google/callback URL in Google Cloud.",
  google_token_exchange: "Google could not complete login. Check the app credentials.",
  google_userinfo: "Google did not return an account profile.",
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams;
  const errorMessage = error ? errorMessages[error] : undefined;
  const projectName = getHubSpotProjectName();
  const googleSession = await getGoogleSession();

  if (googleSession) {
    redirect("/");
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-6 py-16 dark:bg-black">
      <main className="w-full max-w-md rounded-2xl bg-white p-10 shadow-sm dark:bg-zinc-950">
        <p className="text-sm font-medium text-orange-600">Library CRM</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          Sign in
        </h1>
        <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          Sign in with Google to open the
          {projectName ? ` ${projectName}` : ""} HubSpot portal.
        </p>

        {errorMessage ? (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
            {errorMessage}
          </p>
        ) : null}

        <a
          href="/api/auth/google"
          className="mt-8 flex h-11 items-center justify-center gap-3 rounded-lg border border-zinc-200 bg-white text-sm font-medium text-zinc-800 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
        >
          <GoogleMark />
          Continue with Google
        </a>
      </main>
    </div>
  );
}

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303C33.654 32.657 29.208 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.208 36 24.762 36 24 36c-5.192 0-9.629-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.084 5.571.001-.001 6.19 5.238 6.19 5.238C39.204 36.698 44 31.13 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
    </svg>
  );
}
