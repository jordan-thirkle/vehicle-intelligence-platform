# Reference Vehicle #000001 — FG11 YKC

> Purpose: real-world acceptance fixture. Inferred facts are intentionally separated from physically verified facts.

## Identity

- Registration: `FG11 YKC`
- VIN: `W0LPD6EGXBG121817`
- Make: Vauxhall
- Family: Astra J
- Model year: 2011
- Fuel: diesel
- Displacement: 1686 cc
- Steering market: UK RHD
- Transmission: manual

## Current high-confidence hypotheses

These are research conclusions, **not yet physical component verification**:

| Assertion | Current state | Notes |
|---|---|---|
| Engine family/code | A17DTJ candidate | High confidence from matching 1.7 CDTi 81 kW application evidence; engine marking still required |
| Gearbox | M32 6-speed candidate | High confidence application match; gearbox marking still required |
| Production plant | Gliwice candidate | VIN plant-position interpretation; retain source evidence in implementation |
| Turbo | Garrett/OE candidate family | Do not select/order from inference alone; read physical turbo tag |

## Physical verification backlog

Capture and retain evidence for:
1. engine identification/stamping;
2. gearbox identifier;
3. turbocharger identification plate;
4. tyre/door-jamb/VIN labels where useful;
5. installed clutch master-cylinder markings when removed/replaced.

Physical verification describes **current installed hardware** and must not erase factory-history evidence.

## Active diagnostic fixture: poor acceleration + boost whoosh

### Context already eliminated/reduced
- low fuel: addressed;
- flat battery/start event: battery issue addressed before continuing diagnosis.

### Observations
- acceleration feels slower than expected;
- turbo/boost airflow whoosh is prominent.

### Initial hypotheses

| Candidate | Initial priority | Why it remains plausible |
|---|---|---|
| Charge-air/boost leak | High | airflow noise + reduced acceleration can coexist when pressurised air escapes |
| Air metering / EGR / MAP / MAF | Medium | can produce weak response and incorrect air management |
| Turbo control | Medium | actuator/control/underboost behaviour requires evidence |
| Fuel delivery | Lower/unknown | poor acceleration can be fuel-related; no supporting DTC/live data yet |
| Clutch slip | Lower/unknown | distinguish by engine RPM rising disproportionately to road speed |

This ranking is a diagnostic fixture, not a confirmed fault.

### Next evidence
- retrieve current and pending DTCs;
- inspect charge-air hoses/joints/intercooler for displacement, splits and concentrated oil escape marks;
- capture requested vs actual boost/MAP where supported;
- capture MAF and relevant fuel-pressure data where supported;
- record whether RPM rises normally, reluctantly, or disproportionately to road speed;
- record smoke colour/quantity if abnormal.

## Acceptance behaviour

The platform must:
- show candidate engine/gearbox/turbo identification as inferred until verified;
- not convert unavailable evidence into `CLEAR`;
- not diagnose turbo failure solely from whoosh + slow acceleration;
- explain why the next requested evidence discriminates between hypotheses;
- allow a confirmed repair outcome to become structured diagnostic evidence.
