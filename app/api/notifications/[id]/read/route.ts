import { NextRequest, NextResponse } from "next/server";
import { hasGoogleSession } from "@/lib/google-auth";
import { markNotificationRead } from "@/app/utils/db/notifications";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await hasGoogleSession())) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const { id } = await params;
  const notificationId = Number(id);

  if (!Number.isInteger(notificationId)) {
    return NextResponse.json({ error: "Invalid notification id." }, { status: 400 });
  }

  await markNotificationRead(notificationId);
  return NextResponse.json({ ok: true });
}
