import { getValidHubSpotAccessToken } from "@/lib/hubspot-token";

export type HubSpotContact = {
  id: string;
  properties: {
    firstname?: string | null;
    lastname?: string | null;
    email?: string | null;
    [key: string]: unknown;
  };
};

type FetchContactsResult =
  | { ok: true; results: HubSpotContact[] }
  | { ok: false; status: number; error: string };

// Prefer a token from the OAuth connect flow (lib/hubspot-token.ts); fall
// back to a HubSpot private-app token via HUBSPOT_ACCESS_TOKEN if one is
// set. That fallback is what lets this run locally (see .env) without
// having to click through "Connect HubSpot" first. Exported since the
// HubSpot webhook route (app/api/webhooks/hubspot/contacts/route.ts)
// needs the same token to enrich a bare contact-id event.
export async function getHubSpotAccessToken(): Promise<string | null> {
  const oauthToken = await getValidHubSpotAccessToken();
  if (oauthToken) return oauthToken;

  return process.env.HUBSPOT_ACCESS_TOKEN ?? null;
}

export async function fetchHubSpotContacts(): Promise<FetchContactsResult> {
  const accessToken = await getHubSpotAccessToken();

  if (!accessToken) {
    return {
      ok: false,
      status: 401,
      error: "HubSpot is not connected yet.",
    };
  }

  const url = new URL("https://api.hubapi.com/crm/v3/objects/contacts");
  url.searchParams.set("properties", "firstname,lastname,email");
  url.searchParams.set("limit", "100");

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.text();
    console.error("HubSpot contacts request failed:", response.status, body);
    return {
      ok: false,
      status: response.status,
      error: "Could not load contacts from HubSpot.",
    };
  }

  const data = await response.json();

  return {
    ok: true,
    results: (data.results ?? []) as HubSpotContact[],
  };
}

// Looks up a single contact by id - used by the HubSpot webhook receiver,
// which only gets an objectId in the event payload and needs the name/
// email to put in the alert.
export async function fetchHubSpotContactById(
  id: string | number,
): Promise<HubSpotContact | null> {
  const accessToken = await getHubSpotAccessToken();
  if (!accessToken) return null;

  const url = new URL(`https://api.hubapi.com/crm/v3/objects/contacts/${id}`);
  url.searchParams.set("properties", "firstname,lastname,email");

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  if (!response.ok) {
    console.error("HubSpot get-contact-by-id failed:", response.status, await response.text());
    return null;
  }

  return (await response.json()) as HubSpotContact;
}
