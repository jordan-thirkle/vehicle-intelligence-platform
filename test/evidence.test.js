import test from "node:test";
import assert from "node:assert/strict";
import { assertionStates, evidenceSummary, resolveThreeState } from "../src/domain/evidence.js";

test("unavailable evidence remains UNKNOWN", () => {
  assert.equal(resolveThreeState([{ available: false, authoritative: true, clear: true, inScope: true }]), assertionStates.UNKNOWN);
});

test("no observations remains UNKNOWN", () => {
  assert.equal(resolveThreeState([]), assertionStates.UNKNOWN);
});

test("only an available in-scope authoritative clear result resolves CLEAR", () => {
  assert.equal(resolveThreeState([{ available: true, authoritative: true, clear: true, inScope: true }]), assertionStates.CLEAR);
});

test("flagged evidence wins over clear evidence", () => {
  assert.equal(resolveThreeState([{ available: true, authoritative: true, clear: true, inScope: true }, { available: true, authoritative: false, flagged: true, inScope: true }]), assertionStates.FLAGGED);
});

test("material assertions expose their evidence", () => {
  const assertion = { evidenceIds: ["a", "missing"] };
  assert.deepEqual(evidenceSummary(assertion, { a: { id: "a" } }), [{ id: "a" }]);
});
