import { NextResponse } from "next/server";
import { hasGoogleSession } from "@/lib/google-auth";
import { markAllNotificationsRead } from "@/app/utils/db/notifications";

export async function POST() {
  if (!(await hasGoogleSession())) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  await markAllNotificationsRead();
  return NextResponse.json({ ok: true });
}
