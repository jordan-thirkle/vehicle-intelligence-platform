# ADR 0001 — Evidence-first vehicle domain

**Status:** Accepted

## Context

Vehicle sources conflict, differ in authority and coverage, become stale, and may describe factory configuration rather than current installed hardware. A conventional flattened `vehicles` record would hide these distinctions.

## Decision

Evidence/observations are first-class immutable records. Resolved vehicle assertions reference evidence and carry verification/conflict/freshness state.

The domain distinguishes:
- factory candidate configuration;
- current physically verified configuration;
- authoritative records;
- platform-derived inference;
- conflicting/unknown evidence.

## Consequences

Positive:
- explainability;
- safer uncertainty handling;
- auditable source lineage;
- easier source replacement/licensing changes;
- supports current-vs-factory component history.

Cost:
- more complex resolver and persistence model than a simple vehicle table.

This complexity is intentional and central to the product differentiation.
