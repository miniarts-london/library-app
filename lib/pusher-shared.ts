// Channel/event names shared between the server (lib/pusher.ts, which
// pulls in the Node-only "pusher" SDK) and the browser (lib/pusher-client.ts).
// Kept in their own file with no server-SDK import so the client bundle
// never accidentally pulls in server-only code.

export const ALERTS_CHANNEL = "private-alerts";
export const NEW_NOTIFICATION_EVENT = "new-notification";
