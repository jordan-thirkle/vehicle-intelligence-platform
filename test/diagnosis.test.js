import test from "node:test";
import assert from "node:assert/strict";
import { diagnosticFixture } from "../src/data/referenceVehicle.js";
import { createDiagnosticObservation, rankHypotheses, recommendedTests } from "../src/domain/diagnosis.js";

test("reference symptoms preserve multiple candidates and rank charge-air leak first", () => {
  const ranked = rankHypotheses(diagnosticFixture.hypotheses, diagnosticFixture.observations);
  assert.equal(ranked[0].id, "charge-air-leak");
  assert.equal(ranked.length, 5);
  assert.ok(ranked.some((item) => item.id === "turbo-control"));
});

test("a contradictory observation can lower a hypothesis", () => {
  const ranked = rankHypotheses(diagnosticFixture.hypotheses, [{ strength: 5, relationships: { "charge-air-leak": "contradicts" } }]);
  assert.notEqual(ranked[0].id, "charge-air-leak");
});

test("next evidence requests DTCs and charge-air inspection without declaring turbo failure", () => {
  const ranked = rankHypotheses(diagnosticFixture.hypotheses, diagnosticFixture.observations);
  const tests = recommendedTests(ranked);
  assert.deepEqual(tests.map((item) => item.id), ["retrieve-dtcs", "inspect-charge-air"]);
  assert.equal(JSON.stringify(tests).toLowerCase().includes("turbo failure"), false);
});

test("physical charge-air leak evidence raises the leak path and reduces turbo control", () => {
  const result = createDiagnosticObservation("leak-found", "Split hose at intercooler joint");
  const ranked = rankHypotheses(diagnosticFixture.hypotheses, [...diagnosticFixture.observations, result]);
  const leak = ranked.find((item) => item.id === "charge-air-leak");
  const turbo = ranked.find((item) => item.id === "turbo-control");
  assert.equal(ranked[0].id, "charge-air-leak");
  assert.ok(leak.score > leak.baseScore);
  assert.ok(turbo.score < turbo.baseScore + 1);
});

test("RPM flare can move clutch slip to the leading hypothesis", () => {
  const result = createDiagnosticObservation("rpm-flare");
  const ranked = rankHypotheses(diagnosticFixture.hypotheses, [...diagnosticFixture.observations, result]);
  assert.equal(ranked[0].id, "clutch-slip");
});

test("no DTC result does not clear or remove any hypothesis", () => {
  const result = createDiagnosticObservation("no-dtcs");
  const ranked = rankHypotheses(diagnosticFixture.hypotheses, [...diagnosticFixture.observations, result]);
  assert.equal(ranked.length, 5);
  assert.ok(ranked.every((item) => Number.isFinite(item.score)));
});
