# Vehicle Graph

## Goal

Represent a vehicle as a changing system, not a static VIN-decoder response.

## Core graph

```text
Vehicle
├── Identity
│   ├── VIN
│   ├── registrations
│   ├── manufacturer/model/variant
│   └── market/body/build metadata
├── FactoryConfiguration
├── CurrentConfiguration
│   ├── Engine
│   ├── Transmission
│   ├── Induction/Turbo
│   ├── Fuel
│   ├── Emissions
│   ├── Cooling
│   ├── Brakes
│   ├── Suspension
│   └── Electrical
├── Evidence
├── Events
│   ├── MOT
│   ├── Service
│   ├── Repair
│   ├── Modification
│   └── ComponentReplacement
└── DiagnosticSessions
    ├── Observations
    ├── Hypotheses
    ├── Tests
    └── Outcomes
```

## Component identity

A component can have:
- OEM identity;
- supplier/manufacturer identity;
- part numbers and supersessions;
- candidate vehicle fitments;
- installed-on relationships;
- evidence proving current installation.

A VIN-derived candidate fitment must not become an `installed_on` fact without sufficient evidence.

## Factory vs current

Maintain separate temporal relationships:

```text
Vehicle --factory_candidate--> TurboFamily A
Vehicle --installed_on(date/evidence)--> Turbo B
```

This allows replacement parts and modifications without corrupting historical truth.

## Diagnostic graph

```text
Observation -> supports/contradicts -> Hypothesis
Hypothesis -> discriminated_by -> Test
Test -> produces -> Observation
Repair -> targets -> Hypothesis/Component
Repair -> produces -> Outcome
Outcome -> confirms/refutes -> Hypothesis
```

The graph should support explaining *why* a hypothesis moved rather than only exposing a score.

## International boundary

Government/provider-specific fields are normalized at adapters. Core graph concepts remain country-neutral.
