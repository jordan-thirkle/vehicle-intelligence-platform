# Privacy-safe funnel measurement

The acquisition journey emits a small, versioned set of anonymous product events:

1. acquisition page viewed;
2. free lookup completed;
3. plan selected;
4. prototype account step completed;
5. licensed-check availability selected.

Events contain only allow-listed route, intent, identifier type, outcome and plan identifiers. They never contain a registration, VIN, email address, password or free text.

By default, events are dispatched inside the browser as `vehicle-intelligence:analytics` custom events and leave the device nowhere. A future first-party collector can be enabled by adding a `vi-analytics-endpoint` meta tag; the client then uses `sendBeacon`. Enabling an endpoint requires a production privacy review, consent decision, retention policy and server-side schema validation.

This boundary makes the current prototype measurable in local or automated browser tests without silently introducing third-party tracking or a new production dependency.
