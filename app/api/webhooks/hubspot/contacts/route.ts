import { createHmac, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { fetchHubSpotContactById } from "@/lib/hubspot-contacts";
import { createNotification } from "@/app/utils/db/notifications";
import { getPusherServer, ALERTS_CHANNEL, NEW_NOTIFICATION_EVENT } from "@/lib/pusher";

// Wire this up in HubSpot: Settings -> Integrations -> Private/Connected
// Apps -> your app -> Webhooks -> Subscribe to "Contact creation", target
// URL = https://<your-deployment>/api/webhooks/hubspot/contacts
//
// HubSpot POSTs a JSON array of events here. For contact.creation the
// event only carries the contact's id, so we fetch the contact to get a
// name/email worth showing in the alert.

type HubSpotWebhookEvent = {
  subscriptionType?: string;
  objectId?: number | string;
};

const SIGNATURE_MAX_AGE_MS = 5 * 60 * 1000;

// Verifies HubSpot's v3 request signature so random POSTs to this URL
// can't inject fake alerts. Skipped (with a warning) if HUBSPOT_CLIENT_SECRET
// isn't set - keeps this easy to try out before that's configured.
function isValidSignature(request: NextRequest, rawBody: string): boolean {
  const clientSecret = process.env.HUBSPOT_CLIENT_SECRET;
  const signature = request.headers.get("x-hubspot-signature-v3");
  const timestamp = request.headers.get("x-hubspot-request-timestamp");

  if (!clientSecret) {
    console.warn(
      "HUBSPOT_CLIENT_SECRET not set - skipping HubSpot webhook signature verification.",
    );
    return true;
  }

  if (!signature || !timestamp) return false;

  if (Math.abs(Date.now() - Number(timestamp)) > SIGNATURE_MAX_AGE_MS) {
    return false;
  }

  const sourceString = `POST${request.nextUrl.pathname}${rawBody}${timestamp}`;
  const expected = createHmac("sha256", clientSecret).update(sourceString).digest("base64");

  const expectedBuffer = Buffer.from(expected);
  const signatureBuffer = Buffer.from(signature);

  return (
    expectedBuffer.length === signatureBuffer.length &&
    timingSafeEqual(expectedBuffer, signatureBuffer)
  );
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();

  if (!isValidSignature(request, rawBody)) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  }

  let events: HubSpotWebhookEvent[];
  try {
    events = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const creationEvents = (Array.isArray(events) ? events : []).filter(
    (event) => event.subscriptionType === "contact.creation" && event.objectId != null,
  );

  for (const event of creationEvents) {
    const contact = await fetchHubSpotContactById(event.objectId!);
    const name = [contact?.properties.firstname, contact?.properties.lastname]
      .filter(Boolean)
      .join(" ");

    const notification = await createNotification({
      type: "hubspot_contact",
      title: "New HubSpot contact",
      body: name || contact?.properties.email || `Contact #${event.objectId}`,
      data: { contactId: event.objectId, email: contact?.properties.email },
    });

    try {
      await getPusherServer().trigger(ALERTS_CHANNEL, NEW_NOTIFICATION_EVENT, notification);
    } catch (err) {
      console.error("Failed to publish HubSpot notification to Pusher:", err);
    }
  }

  return NextResponse.json({ ok: true, processed: creationEvents.length });
}
