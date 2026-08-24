const SESSION_KEY = "vip:diagnostic-session:vehicle-000001";

const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
const validDate = (value) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T12:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
};
const validObservation = (item) => isObject(item) && typeof item.label === "string";
const validEvent = (item) => isObject(item)
  && typeof item.description === "string"
  && typeof item.evidenceLevel === "string"
  && typeof item.verification === "string"
  && (item.occurredOn == null || validDate(item.occurredOn));
const validComponentVerification = (item) => isObject(item)
  && typeof item.assertionId === "string"
  && typeof item.installedValue === "string"
  && typeof item.physicalIdentifier === "string";

export function loadSession(storage) {
  try {
    const parsed = JSON.parse(storage.getItem(SESSION_KEY));
    return Array.isArray(parsed?.observations)
      ? {
          observations: parsed.observations.filter(validObservation),
          events: Array.isArray(parsed.events) ? parsed.events.filter(validEvent) : [],
          componentVerifications: Array.isArray(parsed.componentVerifications) ? parsed.componentVerifications.filter(validComponentVerification) : [],
        }
      : { observations: [], events: [], componentVerifications: [] };
  } catch {
    return { observations: [], events: [], componentVerifications: [] };
  }
}

export function saveSession(storage, session) {
  storage.setItem(SESSION_KEY, JSON.stringify({ observations: session.observations, events: session.events ?? [], componentVerifications: session.componentVerifications ?? [] }));
}

export function clearSession(storage) {
  storage.removeItem(SESSION_KEY);
}
