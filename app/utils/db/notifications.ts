import { sql } from "@vercel/postgres";

// Reads here are intentionally NOT wrapped in unstable_cache (unlike
// queryAssetList in ./assetList.ts) - notifications are meant to reflect
// what's in the database right now, not a 60s-stale cached copy.

export type NotificationRow = {
  id: number;
  type: string;
  title: string;
  body: string | null;
  data: unknown;
  recipient_email: string | null;
  read_at: string | null;
  created_at: string;
};

export type CreateNotificationInput = {
  type: string;
  title: string;
  body?: string;
  data?: unknown;
  // Left unfiltered by the UI for now (this is a single-portal internal
  // tool), but stored so the later email/SMS channels have an address to
  // send to without a schema change.
  recipientEmail?: string;
};

export async function createNotification(
  input: CreateNotificationInput,
): Promise<NotificationRow> {
  const { rows } = await sql<NotificationRow>`
    INSERT INTO public."Notification" (type, title, body, data, recipient_email)
    VALUES (
      ${input.type},
      ${input.title},
      ${input.body ?? null},
      ${input.data !== undefined ? JSON.stringify(input.data) : null}::jsonb,
      ${input.recipientEmail ?? null}
    )
    RETURNING *;
  `;
  return rows[0];
}

export async function listNotifications(limit = 20): Promise<NotificationRow[]> {
  const { rows } = await sql<NotificationRow>`
    SELECT * FROM public."Notification"
    ORDER BY created_at DESC
    LIMIT ${limit};
  `;
  return rows;
}

export async function getUnreadCount(): Promise<number> {
  const { rows } = await sql<{ count: string }>`
    SELECT COUNT(*)::text AS count FROM public."Notification"
    WHERE read_at IS NULL;
  `;
  return Number(rows[0]?.count ?? 0);
}

export async function markNotificationRead(id: number): Promise<void> {
  await sql`
    UPDATE public."Notification"
    SET read_at = now()
    WHERE id = ${id} AND read_at IS NULL;
  `;
}

export async function markAllNotificationsRead(): Promise<void> {
  await sql`
    UPDATE public."Notification"
    SET read_at = now()
    WHERE read_at IS NULL;
  `;
}
