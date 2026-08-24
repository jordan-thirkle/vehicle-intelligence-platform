import test from "node:test";
import assert from "node:assert/strict";
import { applyComponentVerifications, createComponentVerification } from "../src/domain/componentVerification.js";

test("physical component evidence supersedes an inferred candidate without overstating authority", () => {
  const evidence = createComponentVerification({ assertionId: "turbo", installedValue: "Garrett 123", physicalIdentifier: "LABEL-123", note: "Read on housing" }, () => new Date("2026-08-24T12:00:00Z"));
  const [result] = applyComponentVerifications([{ id: "turbo", value: "candidate", verification: "INFERRED" }], [evidence]);
  assert.equal(result.value, "Garrett 123");
  assert.equal(result.verification, "OWNER OBSERVED");
  assert.equal(result.physicalIdentifier, "LABEL-123");
});

test("component evidence requires the physical identifier", () => {
  assert.throws(() => createComponentVerification({ assertionId: "turbo", installedValue: "Garrett" }), /physical identifier/);
});
