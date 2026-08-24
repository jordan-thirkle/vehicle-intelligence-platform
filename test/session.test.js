import test from "node:test";
import assert from "node:assert/strict";
import { clearSession, loadSession, saveSession } from "../src/domain/session.js";

function memoryStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
}

test("diagnostic observations survive a storage round trip", () => {
  const storage = memoryStorage();
  saveSession(storage, { observations: [{ id: "one", label: "Observed" }] });
  assert.deepEqual(loadSession(storage), { observations: [{ id: "one", label: "Observed" }], events: [], componentVerifications: [] });
});

test("corrupt session data fails closed to an empty session", () => {
  const storage = memoryStorage({ "vip:diagnostic-session:vehicle-000001": "not-json" });
  assert.deepEqual(loadSession(storage), { observations: [], events: [], componentVerifications: [] });
});

test("a diagnostic session can be cleared", () => {
  const storage = memoryStorage();
  saveSession(storage, { observations: [{ id: "one" }] });
  clearSession(storage);
  assert.deepEqual(loadSession(storage), { observations: [], events: [], componentVerifications: [] });
});

test("timeline events are persisted alongside diagnostic observations", () => {
  const storage = memoryStorage();
  const event = { id: "service-1", description: "Service", evidenceLevel: "OWNER_ENTERED", verification: "UNVERIFIED", occurredOn: null };
  saveSession(storage, { observations: [], events: [event] });
  assert.deepEqual(loadSession(storage).events, [event]);
});

test("older saved sessions gain an empty component verification collection", () => {
  const storage = memoryStorage({ "vip:diagnostic-session:vehicle-000001": JSON.stringify({ observations: [], events: [] }) });
  assert.deepEqual(loadSession(storage).componentVerifications, []);
});

test("valid JSON with malformed stored records is filtered before rendering", () => {
  const storage = memoryStorage({
    "vip:diagnostic-session:vehicle-000001": JSON.stringify({
      observations: [{ label: "Valid" }, null, { unexpected: true }],
      events: [{ description: "Valid", evidenceLevel: "OWNER_ENTERED", verification: "UNVERIFIED", occurredOn: null }, { description: "Broken" }, { description: "Bad date", evidenceLevel: "OWNER_ENTERED", verification: "UNVERIFIED", occurredOn: "2026-99-99" }],
      componentVerifications: [{ assertionId: "turbo", installedValue: "Part", physicalIdentifier: "ID" }, { assertionId: "engine" }],
    }),
  });
  const session = loadSession(storage);
  assert.equal(session.observations.length, 1);
  assert.equal(session.events.length, 1);
  assert.equal(session.componentVerifications.length, 1);
});
