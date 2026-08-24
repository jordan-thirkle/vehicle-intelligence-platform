# Vehicle Intelligence Platform

An evidence-first platform for understanding, owning, diagnosing and repairing vehicles.

## Product thesis

Traditional vehicle-history products mostly answer **“should I buy this car?”** Vehicle Intelligence Platform is intended to support the full lifecycle:

**identify → verify → inspect → buy → own → maintain → diagnose → repair → verify outcome**

The primary user object is a permanent **Vehicle Passport / Digital Twin**: a living record of what a vehicle was built as, what is installed now, what has happened to it, and what evidence supports each assertion.

## Non-negotiable principles

1. **Evidence over assertion.** Important claims carry provenance and confidence.
2. **Unknown ≠ clear.** Missing evidence is never presented as proof that nothing happened.
3. **Public information stays public.** We do not artificially paywall freely available government information.
4. **Official verification is first-class.** Users are linked back to authoritative government/manufacturer services.
5. **Vehicle Passports do not expire.** Individual evidence can become stale and require refresh; the user's vehicle record remains.
6. **Factory specification ≠ current vehicle.** Owner/garage verification can supersede inference about installed components.
7. **Diagnosis reduces uncertainty.** Prefer the cheapest/safest discriminating test over an unranked list of faults.
8. **Hardware-neutral diagnostics.** Do not lock intelligence to a proprietary OBD dongle.
9. **Safety-critical technical data requires appropriate authority.** AI inference must not masquerade as an OEM torque value or repair instruction.
10. **Commercial incentives never determine technical fitment or diagnostic ranking.**

## v0.1 vertical slice

The first product milestone is deliberately narrow:

`Registration/VIN → Vehicle Passport → evidence/provenance → Mechanical DNA → diagnostic session`

Reference Vehicle #000001 is a real UK vehicle used to test inference against physical ground truth:

- Registration: `FG11 YKC`
- VIN: `W0LPD6EGXBG121817`
- Vehicle: 2011 Vauxhall Astra J 1.7 CDTi

See [`docs/reference-vehicles/FG11-YKC.md`](docs/reference-vehicles/FG11-YKC.md).

## Documentation

- [Vision](docs/product/vision.md)
- [Product principles](docs/product/principles.md)
- [v0.1 specification](docs/product/v0.1-spec.md)
- [UK data sources](docs/research/data-sources-uk.md)
- [Competitor research](docs/research/competitors.md)
- [User pain](docs/research/user-pain.md)
- [Licensing model](docs/research/licensing.md)
- [Evidence model](docs/architecture/evidence-model.md)
- [Vehicle graph](docs/architecture/vehicle-graph.md)
- [Architecture decisions](docs/decisions/)

## Status

**Interactive v0.1 prototype.** The fixture-backed vertical slice implements deterministic VRM/VIN validation, evidence-backed Mechanical DNA and a structured diagnostic session for Reference Vehicle #000001. It deliberately claims no live production integrations; data-source availability, licensing and API access must be verified before an adapter is represented as live.

## Run locally

```bash
npm install
npm test
npm run dev
```

Create a production bundle with `npm run build`.

### Prototype routes

- `/free-car-check` — organic-search acquisition page, free lookup, transparent pricing and prototype signup flow;
- `/mot-history-check` — official-MOT-history intent page with advisory/repair continuity positioning;
- `/vehicle-passport` — ownership-lifecycle intent page for the permanent evidence record;
- `/passport` — Vehicle Passport, Mechanical DNA, ownership timeline and diagnostic workspace.

The Passport now supports owner-observed physical component identifiers, local diagnostic and ownership records, and a portable versioned JSON export. These records preserve their evidence level and never convert an owner observation into garage or manufacturer verification.

The production build pre-renders the acquisition routes so useful headings, copy, FAQs, pricing and internal links exist in raw HTML before JavaScript runs.

Before public deployment, replace the `.example` canonical and sitemap host with the chosen production domain, then connect real authentication, consent storage, analytics and payments behind the existing prototype boundaries.
