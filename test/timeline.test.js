import test from "node:test";
import assert from "node:assert/strict";
import { createTimelineEvent, sortTimeline } from "../src/domain/timeline.js";

const fixedNow = () => new Date("2026-08-24T10:00:00.000Z");

test("owner-recorded work is explicitly unverified user evidence", () => {
  const event = createTimelineEvent({ type: "REPAIR", description: " Battery replaced ", occurredOn: "2026-08-20", mileage: "98000", note: " Receipt retained " }, fixedNow);
  assert.equal(event.description, "Battery replaced");
  assert.equal(event.mileage, 98000);
  assert.equal(event.evidenceLevel, "OWNER_ENTERED");
  assert.equal(event.verification, "UNVERIFIED");
  assert.equal(event.source, "USER_SUPPLIED");
});

test("timeline rejects invalid or empty events", () => {
  assert.throws(() => createTimelineEvent({ type: "UNKNOWN", description: "Thing" }, fixedNow));
  assert.throws(() => createTimelineEvent({ type: "REPAIR", description: " " }, fixedNow));
  assert.throws(() => createTimelineEvent({ type: "REPAIR", description: "Thing", mileage: "-1" }, fixedNow));
});

test("timeline displays newest events first", () => {
  const events = sortTimeline([
    { id: "old", occurredOn: "2025-01-01" },
    { id: "new", occurredOn: "2026-01-01" },
    { id: "recorded", recordedAt: "2026-08-24T10:00:00.000Z" },
  ]);
  assert.deepEqual(events.map((event) => event.id), ["recorded", "new", "old"]);
});
