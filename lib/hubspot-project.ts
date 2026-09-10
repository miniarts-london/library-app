// Small env-var readers for the HubSpot side of the integration. Kept in
// their own module (rather than inline in each route) since both the
// OAuth connect route and the login page need them.

export function getHubSpotPortalId() {
  return process.env.HUBSPOT_PORTAL_ID;
}

// Human-readable label for the connected HubSpot account, shown on the
// login screen ("open the <name> HubSpot portal"). Falls back to
// undefined so the caller can omit it entirely if it isn't set.
export function getHubSpotProjectName() {
  return process.env.HUBSPOT_PROJECT;
}
