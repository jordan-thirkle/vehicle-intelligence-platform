import { createFunnelEvent } from "../domain/analytics.js";

export function trackFunnelEvent(name, properties) {
  const event = createFunnelEvent(name, properties);
  window.dispatchEvent(new CustomEvent("vehicle-intelligence:analytics", { detail: event }));

  const endpoint = document.querySelector('meta[name="vi-analytics-endpoint"]')?.content;
  if (endpoint && navigator.sendBeacon) {
    navigator.sendBeacon(endpoint, new Blob([JSON.stringify(event)], { type: "application/json" }));
  }
  return event;
}
