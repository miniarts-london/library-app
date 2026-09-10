import PusherServer from "pusher";

export { ALERTS_CHANNEL, NEW_NOTIFICATION_EVENT } from "@/lib/pusher-shared";

// Server-side Pusher client, used to publish events (e.g. from an API
// route after writing a notification to Postgres). Requires a free
// pusher.com app - see .env.example for the 4 server-side vars.
let pusherServer: PusherServer | null = null;

export function getPusherServer(): PusherServer {
  if (pusherServer) return pusherServer;

  const { PUSHER_APP_ID, PUSHER_KEY, PUSHER_SECRET, PUSHER_CLUSTER } = process.env;

  if (!PUSHER_APP_ID || !PUSHER_KEY || !PUSHER_SECRET || !PUSHER_CLUSTER) {
    throw new Error(
      "Pusher is not configured. Set PUSHER_APP_ID, PUSHER_KEY, PUSHER_SECRET and PUSHER_CLUSTER.",
    );
  }

  pusherServer = new PusherServer({
    appId: PUSHER_APP_ID,
    key: PUSHER_KEY,
    secret: PUSHER_SECRET,
    cluster: PUSHER_CLUSTER,
    useTLS: true,
  });

  return pusherServer;
}
