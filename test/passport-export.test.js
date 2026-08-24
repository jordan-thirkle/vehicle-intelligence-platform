import test from "node:test";
import assert from "node:assert/strict";
import { createPassportExport } from "../src/domain/passportExport.js";

test("portable Passport export is versioned and preserves evidence boundaries", () => {
  const result = createPassportExport({ vehicle: { id: "v1", registration: "AB12 CDE", vin: "VIN", title: "Car", facts: [] }, assertions: [], observations: [], events: [], componentVerifications: [] }, () => new Date("2026-08-24T12:00:00Z"));
  assert.equal(result.schemaVersion, 1);
  assert.match(result.caveat, /UNKNOWN does not mean CLEAR/);
  assert.equal(result.exportedAt, "2026-08-24T12:00:00.000Z");
});
