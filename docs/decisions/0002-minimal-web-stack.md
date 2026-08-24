# ADR 0002: Minimal browser-native web stack

## Status

Accepted for v0.1.

## Decision

Build the first vertical slice with standards-based JavaScript modules, semantic HTML and CSS, using Vite only for local development and production bundling. Domain logic remains framework-independent and is covered by Node's built-in test runner.

## Why

- The repository currently has no application framework to preserve.
- v0.1 must prove evidence resolution and diagnostic behaviour before committing to a larger application platform.
- This adds no production runtime dependency.
- The domain modules can move behind an API or into a framework later without rewriting the core rules.

## Boundary

The first adapter is explicitly fixture-backed. It does not claim live DVLA, DVSA, TecDoc, Autodata or other licensed integration. The UI retains direct official GOV.UK link-outs.

Revisit the framework and persistence choice when the slice requires authenticated passports, durable evidence uploads, live provider adapters or server-side secrets.
