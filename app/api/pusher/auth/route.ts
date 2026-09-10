import { NextRequest, NextResponse } from "next/server";
import { hasGoogleSession } from "@/lib/google-auth";
import { getPusherServer } from "@/lib/pusher";

// pusher-js posts here (as application/x-www-form-urlencoded) whenever it
// wants to subscribe to a private/presence channel. Only signed-in users
// get authorized, so random visitors can't listen in on the alerts feed.
export async function POST(request: NextRequest) {
  if (!(await hasGoogleSession())) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const form = await request.formData();
  const socketId = form.get("socket_id");
  const channelName = form.get("channel_name");

  if (typeof socketId !== "string" || typeof channelName !== "string") {
    return NextResponse.json({ error: "Missing socket_id or channel_name." }, { status: 400 });
  }

  const authResponse = getPusherServer().authorizeChannel(socketId, channelName);
  return NextResponse.json(authResponse);
}
