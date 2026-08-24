import { classifyIdentifier } from "./lookup.js";

export const prototypePlans = Object.freeze({
  FREE: { id: "FREE", label: "Free", price: 0 },
  PLUS_MONTHLY: { id: "PLUS_MONTHLY", label: "Passport Plus — Monthly", price: 4.99 },
  PLUS_ANNUAL: { id: "PLUS_ANNUAL", label: "Passport Plus — Annual", price: 39 },
});

export function freeLookup(value) {
  const identifier = classifyIdentifier(value);
  if (!identifier.valid) return identifier;
  const isFixture = ["FG11YKC", "W0LPD6EGXBG121817"].includes(identifier.normalized);
  return { ...identifier, isFixture, status: isFixture ? "FIXTURE_FOUND" : "NO_LIVE_ADAPTER" };
}

export function validatePrototypeAccount({ email, password }) {
  const errors = {};
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email?.trim() || "")) errors.email = "Enter a valid email address.";
  if ((password || "").length < 8) errors.password = "Use at least 8 characters.";
  return { valid: Object.keys(errors).length === 0, errors };
}

export function prototypeOrder(planId) {
  const plan = prototypePlans[planId];
  if (!plan) throw new Error("Unknown prototype plan.");
  return { plan, dueToday: 0, paymentsConnected: false };
}
