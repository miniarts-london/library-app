import { NextRequest, NextResponse } from "next/server";
import { hasGoogleSession } from "@/lib/google-auth";
import {
  createNotification,
  getUnreadCount,
  listNotifications,
} from "@/app/utils/db/notifications";
import { getPusherServer, ALERTS_CHANNEL, NEW_NOTIFICATION_EVENT } from "@/lib/pusher";

export async function GET() {
  if (!(await hasGoogleSession())) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const [notifications, unreadCount] = await Promise.all([
    listNotifications(20),
    getUnreadCount(),
  ]);

  return NextResponse.json({ notifications, unreadCount });
}

// Creates a notification and broadcasts it live over Pusher. Called both
// by real triggers (e.g. the HubSpot webhook route) and by the "Send test
// alert" button in the UI for demo purposes.
export async function POST(request: NextRequest) {
  if (!(await hasGoogleSession())) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);

  if (!body || typeof body.title !== "string" || !body.title.trim()) {
    return NextResponse.json({ error: "A title is required." }, { status: 400 });
  }

  const notification = await createNotification({
    type: typeof body.type === "string" && body.type ? body.type : "general",
    title: body.title,
    body: typeof body.body === "string" ? body.body : undefined,
    data: body.data,
    recipientEmail: typeof body.recipientEmail === "string" ? body.recipientEmail : undefined,
  });

  try {
    await getPusherServer().trigger(ALERTS_CHANNEL, NEW_NOTIFICATION_EVENT, notification);
  } catch (err) {
    // Don't fail the request over a broadcast issue - the notification is
    // already persisted, so it'll still show up next time the list is
    // fetched even if the live push didn't go out.
    console.error("Failed to publish notification to Pusher:", err);
  }

  return NextResponse.json({ notification }, { status: 201 });
}
