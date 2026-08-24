export const funnelEvents = Object.freeze({
  PAGE_VIEWED: "acquisition_page_viewed",
  LOOKUP_COMPLETED: "free_lookup_completed",
  PLAN_SELECTED: "plan_selected",
  ACCOUNT_STEP_COMPLETED: "prototype_account_step_completed",
  AVAILABILITY_SELECTED: "licensed_availability_selected",
});

const allowedFields = Object.freeze({
  [funnelEvents.PAGE_VIEWED]: ["route", "intent"],
  [funnelEvents.LOOKUP_COMPLETED]: ["route", "identifierType", "outcome"],
  [funnelEvents.PLAN_SELECTED]: ["route", "planId"],
  [funnelEvents.ACCOUNT_STEP_COMPLETED]: ["route", "outcome"],
  [funnelEvents.AVAILABILITY_SELECTED]: ["route"],
});

export function createFunnelEvent(name, properties = {}, now = new Date()) {
  if (!allowedFields[name]) throw new Error("Unknown funnel event.");
  const safeProperties = Object.fromEntries(
    allowedFields[name]
      .filter((key) => properties[key] !== undefined)
      .map((key) => [key, String(properties[key]).slice(0, 80)]),
  );
  return { name, properties: safeProperties, occurredAt: now.toISOString(), schemaVersion: 1 };
}

export function intentForRoute(route) {
  if (route.startsWith("/compare/")) return "comparison";
  if (route === "/mot-history-check") return "mot_history";
  if (route === "/vehicle-passport") return "ownership";
  return "vehicle_check";
}
