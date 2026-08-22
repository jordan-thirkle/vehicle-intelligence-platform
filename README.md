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

**Research / foundation.** No production integrations are claimed yet. Data-source availability, licensing and API access must be verified before an adapter is represented as live.
