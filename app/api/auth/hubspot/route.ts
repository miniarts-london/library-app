import { NextResponse } from "next/server";
import { hasGoogleSession } from "@/lib/google-auth";
import { getHubSpotPortalId } from "@/lib/hubspot-project";
import { setOAuthState } from "@/lib/hubspot-token";

export async function GET(request: Request) {
  if (!(await hasGoogleSession())) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const clientId = process.env.HUBSPOT_CLIENT_ID;
  const redirectUri = process.env.HUBSPOT_REDIRECT_URI;
  const portalId = getHubSpotPortalId();

  if (!clientId || !redirectUri) {
    return NextResponse.json(
      { error: "HubSpot OAuth environment variables are missing" },
      { status: 500 },
    );
  }

  if (!portalId) {
    return NextResponse.json(
      {
        error:
          "HUBSPOT_PORTAL_ID is missing. Set it to the HubSpot account to connect.",
      },
      { status: 500 },
    );
  }

  const state = crypto.randomUUID();
  await setOAuthState(state);

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: "oauth crm.objects.contacts.read crm.objects.contacts.write",
    state,
  });

  const hubspotAuthUrl = `https://app.hubspot.com/oauth/${portalId}/authorize?${params.toString()}`;

  return NextResponse.redirect(hubspotAuthUrl);
}
