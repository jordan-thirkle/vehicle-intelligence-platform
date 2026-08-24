export const sources = {
  fixture: {
    id: "source-reference-fixture",
    name: "Reference Vehicle #000001",
    licenceClass: "USER_SUPPLIED",
    note: "Fixture-backed observations captured from the project reference vehicle; not a live government adapter.",
  },
  derived: {
    id: "source-platform-derived",
    name: "Platform reasoning",
    licenceClass: "PLATFORM_DERIVED",
    note: "Inference derived from the cited fixture evidence. It is not an OEM or government record.",
  },
};

export const evidenceById = {
  "ev-identity": {
    id: "ev-identity",
    sourceId: sources.fixture.id,
    subject: "vehicle-000001",
    predicate: "identity",
    value: "2011 Vauxhall Astra J 1.7 CDTi",
    observedAt: "2026-08-23",
    verification: "CORROBORATED",
  },
  "ev-engine-candidate": {
    id: "ev-engine-candidate",
    sourceId: sources.derived.id,
    subject: "vehicle-000001",
    predicate: "factory_candidate_engine",
    value: "A17DTJ",
    observedAt: "2026-08-23",
    verification: "INFERRED",
  },
  "ev-gearbox-candidate": {
    id: "ev-gearbox-candidate",
    sourceId: sources.derived.id,
    subject: "vehicle-000001",
    predicate: "factory_candidate_transmission",
    value: "M32 6-speed manual",
    observedAt: "2026-08-23",
    verification: "INFERRED",
  },
  "ev-turbo-candidate": {
    id: "ev-turbo-candidate",
    sourceId: sources.derived.id,
    subject: "vehicle-000001",
    predicate: "factory_candidate_turbo",
    value: "Garrett/OE candidate family",
    observedAt: "2026-08-23",
    verification: "INFERRED",
  },
};

export const referenceVehicle = {
  id: "vehicle-000001",
  registration: "FG11 YKC",
  vin: "W0LPD6EGXBG121817",
  title: "2011 Vauxhall Astra J 1.7 CDTi",
  facts: [
    ["Year", "2011"],
    ["Body", "5-door hatchback"],
    ["Fuel", "Diesel"],
    ["Transmission", "Manual"],
  ],
  officialLinks: [
    ["MOT history", "https://www.gov.uk/check-mot-history"],
    ["DVLA vehicle information", "https://www.gov.uk/get-vehicle-information-from-dvla"],
    ["Safety recalls", "https://www.gov.uk/check-vehicle-recall"],
  ],
  assertions: [
    { id: "engine", label: "Engine", value: "A17DTJ 1.7L 16V CDTi", qualifier: "factory candidate", verification: "INFERRED", evidenceIds: ["ev-engine-candidate"] },
    { id: "transmission", label: "Transmission", value: "M32 6-speed manual", qualifier: "factory candidate", verification: "INFERRED", evidenceIds: ["ev-gearbox-candidate"] },
    { id: "turbo", label: "Turbo / induction", value: "Garrett/OE candidate family", qualifier: "candidate family", verification: "INFERRED", evidenceIds: ["ev-turbo-candidate"] },
  ],
};

export const diagnosticFixture = {
  title: "Poor acceleration + boost whoosh",
  hypotheses: [
    { id: "charge-air-leak", label: "Charge-air / boost leak", detail: "Hoses, intercooler or clamps", baseScore: 5 },
    { id: "air-metering", label: "Air metering / EGR / MAP / MAF", detail: "Incorrect air measurement or EGR flow", baseScore: 3 },
    { id: "turbo-control", label: "Turbo control", detail: "Actuator, solenoid or underboost behaviour", baseScore: 3 },
    { id: "fuel-delivery", label: "Fuel delivery", detail: "Filter, pressure or injector path", baseScore: 1 },
    { id: "clutch-slip", label: "Clutch slip", detail: "RPM rises disproportionately to road speed", baseScore: 1 },
  ],
  observations: [
    { id: "whoosh", label: "Boost airflow sounds more prominent", strength: 1, relationships: { "charge-air-leak": "supports" } },
    { id: "slow-acceleration", label: "Acceleration feels slow", strength: 1, relationships: { "charge-air-leak": "supports", "air-metering": "supports", "turbo-control": "supports", "fuel-delivery": "supports", "clutch-slip": "supports" } },
  ],
};

export const referenceTimeline = [
  {
    id: "event-reference-captured",
    type: "INSPECTION",
    label: "Inspection",
    description: "Reference vehicle identity and candidate configuration captured",
    occurredOn: "2026-08-23",
    mileage: null,
    note: "Fixture evidence created for Vehicle #000001.",
    evidenceLevel: "FIXTURE_BACKED",
    verification: "CORROBORATED",
    source: "USER_SUPPLIED",
    recordedAt: "2026-08-23T12:00:00.000Z",
  },
  {
    id: "event-investigation-opened",
    type: "DIAGNOSTIC_OUTCOME",
    label: "Diagnostic outcome",
    description: "Poor acceleration and prominent boost whoosh investigation opened",
    occurredOn: "2026-08-23",
    mileage: null,
    note: "No failed component concluded; discriminating evidence requested.",
    evidenceLevel: "PLATFORM_DERIVED",
    verification: "INFERRED",
    source: "PLATFORM_DERIVED",
    recordedAt: "2026-08-23T12:10:00.000Z",
  },
];
