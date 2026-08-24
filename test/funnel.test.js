import test from "node:test";
import assert from "node:assert/strict";
import { freeLookup, prototypeOrder, validatePrototypeAccount } from "../src/domain/funnel.js";
import { acquisitionPages, marketingMarkup, pageForPath } from "../src/ui/renderMarketing.js";

test("free lookup runs before account creation and finds the reference fixture", () => {
  const result = freeLookup("FG11 YKC");
  assert.equal(result.valid, true);
  assert.equal(result.status, "FIXTURE_FOUND");
});

test("valid unknown registrations do not pretend a live report exists", () => {
  const result = freeLookup("AB12 CDE");
  assert.equal(result.valid, true);
  assert.equal(result.status, "NO_LIVE_ADAPTER");
});

test("prototype account validates email and password without creating a real account", () => {
  assert.equal(validatePrototypeAccount({ email: "invalid", password: "short" }).valid, false);
  assert.equal(validatePrototypeAccount({ email: "driver@example.com", password: "long-enough" }).valid, true);
});

test("prototype order never charges the user", () => {
  const order = prototypeOrder("PLUS_ANNUAL");
  assert.equal(order.plan.price, 39);
  assert.equal(order.dueToday, 0);
  assert.equal(order.paymentsConnected, false);
});

test("high-intent acquisition pages have unique titles, descriptions and useful headings", () => {
  const pages = Object.values(acquisitionPages);
  assert.equal(new Set(pages.map((page) => page.title)).size, pages.length);
  assert.equal(new Set(pages.map((page) => page.description)).size, pages.length);
  for (const page of pages) {
    const markup = marketingMarkup(page);
    assert.match(markup, /<h1>.+?<\/h1>/s);
    assert.match(markup, /Check this vehicle free/);
    assert.match(markup, /Official GOV\.UK/);
  }
});

test("unknown marketing routes resolve to the main free-check page", () => {
  assert.equal(pageForPath("/unknown").path, "/free-car-check");
});

test("comparison SEO page is unique, sourced and honest about prototype coverage", () => {
  const page = pageForPath("/compare/vehicle-history-checks");
  const markup = marketingMarkup(page);
  assert.equal(page.comparison, true);
  assert.match(markup, /Facts checked 24 August 2026/);
  assert.match(markup, /not affiliated/i);
  assert.match(markup, /not available in this prototype/i);
  assert.match(markup, /home\.hpicheck\.com/);
  assert.match(markup, /totalcarcheck\.co\.uk/);
  assert.match(markup, /motorcheck\.co\.uk/);
  assert.match(markup, /carvertical\.com/);
});

test("marketing lookup has a distinct preview region and no dead hidden-account navigation", () => {
  const markup = marketingMarkup(acquisitionPages["/free-car-check"]);
  assert.match(markup, /id="passport-preview"/);
  assert.doesNotMatch(markup, /href="#account"/);
  assert.doesNotMatch(markup, /type="password"/);
  assert.match(markup, /No account or payment details are requested/);
});
