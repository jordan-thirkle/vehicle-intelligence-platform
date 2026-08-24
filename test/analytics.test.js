import test from "node:test";
import assert from "node:assert/strict";
import { createFunnelEvent, funnelEvents, intentForRoute } from "../src/domain/analytics.js";

test("analytics events keep only approved non-identifying fields", () => {
  const event = createFunnelEvent(funnelEvents.LOOKUP_COMPLETED, {
    route: "/free-car-check",
    identifierType: "VRM",
    outcome: "FIXTURE_FOUND",
    registration: "FG11 YKC",
    email: "driver@example.com",
  }, new Date("2026-08-24T12:00:00.000Z"));

  assert.deepEqual(event.properties, {
    route: "/free-car-check",
    identifierType: "VRM",
    outcome: "FIXTURE_FOUND",
  });
  assert.equal(JSON.stringify(event).includes("FG11"), false);
  assert.equal(JSON.stringify(event).includes("example.com"), false);
});

test("analytics rejects unknown events rather than accepting arbitrary payloads", () => {
  assert.throws(() => createFunnelEvent("raw_form_submitted", { password: "secret" }), /Unknown funnel event/);
});

test("acquisition routes map to stable search intents", () => {
  assert.equal(intentForRoute("/compare/vehicle-history-checks"), "comparison");
  assert.equal(intentForRoute("/mot-history-check"), "mot_history");
  assert.equal(intentForRoute("/vehicle-passport"), "ownership");
  assert.equal(intentForRoute("/free-car-check"), "vehicle_check");
});
