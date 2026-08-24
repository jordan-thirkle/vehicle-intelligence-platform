import test from "node:test";
import assert from "node:assert/strict";
import { classifyIdentifier, normalizeIdentifier } from "../src/domain/lookup.js";

test("normalizes UK registration spacing and case", () => {
  assert.equal(normalizeIdentifier("fg11 ykc"), "FG11YKC");
});

test("classifies the reference registration", () => {
  assert.deepEqual(classifyIdentifier("FG11 YKC"), { valid: true, type: "VRM", normalized: "FG11YKC" });
});

test("classifies the reference VIN", () => {
  assert.deepEqual(classifyIdentifier("W0LPD6EGXBG121817"), { valid: true, type: "VIN", normalized: "W0LPD6EGXBG121817" });
});

test("rejects VIN characters I, O and Q", () => {
  assert.equal(classifyIdentifier("W0LPD6EGXBG12181Q").valid, false);
});
