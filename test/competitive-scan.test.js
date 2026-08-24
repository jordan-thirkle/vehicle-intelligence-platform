import test from "node:test";
import assert from "node:assert/strict";
import { extractMarketingSignals, isPathAllowed, parseRobots } from "../src/domain/competitiveScan.js";

test("extracts durable conversion signals without retaining page HTML", () => {
  const result = extractMarketingSignals(`<title>Free car check</title><meta name="description" content="Instant vehicle report"><h1>Uncover hidden history</h1><form><input name="registration"><button>Check my car free</button></form><p>3 checks for £14.99. Trusted by millions. £30,000 guarantee.</p>`, "https://example.test/");
  assert.equal(result.title, "Free car check");
  assert.deepEqual(result.prices, ["£14.99", "£30,000"]);
  assert.equal(result.signals.freeHook, true);
  assert.equal(result.signals.bundlePricing, true);
  assert.equal(result.signals.socialProof, true);
  assert.equal(result.formCount, 1);
  assert.equal("html" in result, false);
});

test("robots parser selects wildcard rules and honours the longest path", () => {
  const rules = parseRobots("User-agent: *\nDisallow: /account\nAllow: /account/help\n");
  assert.equal(isPathAllowed("/pricing", rules), true);
  assert.equal(isPathAllowed("/account/report", rules), false);
  assert.equal(isPathAllowed("/account/help/article", rules), true);
});
