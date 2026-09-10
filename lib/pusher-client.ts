"use client";

import PusherClient from "pusher-js";
import { ALERTS_CHANNEL, NEW_NOTIFICATION_EVENT } from "@/lib/pusher-shared";

let pusherClient: PusherClient | null = null;

function getPusherClient(): PusherClient {
  if (pusherClient) return pusherClient;

  const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
  const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

  if (!key || !cluster) {
    throw new Error(
      "Pusher is not configured. Set NEXT_PUBLIC_PUSHER_KEY and NEXT_PUBLIC_PUSHER_CLUSTER.",
    );
  }

  pusherClient = new PusherClient(key, {
    cluster,
    // The private-alerts channel requires auth; this route checks the
    // caller has a Google session before letting them subscribe.
    authEndpoint: "/api/pusher/auth",
  });

  return pusherClient;
}

// Subscribes to the shared alerts channel and calls `onNotification` for
// every new-notification event. Returns an unsubscribe function for
// cleanup in a useEffect.
export function subscribeToAlerts(onNotification: (payload: unknown) => void) {
  const client = getPusherClient();
  const channel = client.subscribe(ALERTS_CHANNEL);
  channel.bind(NEW_NOTIFICATION_EVENT, onNotification);

  return () => {
    channel.unbind(NEW_NOTIFICATION_EVENT, onNotification);
    client.unsubscribe(ALERTS_CHANNEL);
  };
}
