# Evidence Model

## Why evidence is the core primitive

Vehicle data conflicts. A VIN inference, government record, aftermarket catalogue and physical component label can each say different things. The platform therefore stores **observations and assertions with provenance** instead of flattening all sources into a single opaque vehicle row.

## Core concepts

### Source
Describes where evidence came from and what reuse rules apply.

Suggested classification:
- `OPEN`
- `OGL`
- `PUBLIC_DOMAIN`
- `LINK_ONLY`
- `LICENSED_DISPLAY`
- `LICENSED_DERIVATIVE`
- `USER_SUPPLIED`
- `PLATFORM_DERIVED`

### Evidence
An immutable observation from a source.

Minimum fields:
```text
id
vehicle_id
source_id
subject
predicate
value
observed_at
retrieved_at
source_reference
licence_class
raw_hash
```

### Assertion
The platform's current resolved view of a fact.

```text
id
vehicle_id
subject
predicate
value
status
confidence
verification_status
resolved_at
supersedes
```

Assertions reference one or more evidence records.

### Verification
Verification describes how directly an assertion has been confirmed.

Suggested states:
- `INFERRED`
- `CORROBORATED`
- `PHYSICALLY_VERIFIED`
- `AUTHORITATIVE_RECORD`
- `CONFLICTED`

Do not equate a numeric confidence score with physical verification.

## Three-state rule

For history/safety questions where absence matters:

- `CLEAR`: an appropriate authoritative source was checked and reports no known record within its scope.
- `UNKNOWN`: sufficient evidence is unavailable, inaccessible, stale or outside source coverage.
- `FLAGGED`: evidence of the condition exists.

`null`, timeout, unavailable API, no licence, or unsupported vehicle **must never resolve to CLEAR**.

## Conflict handling

Conflicting evidence remains visible. Resolver behaviour should:
1. preserve both observations;
2. assess authority, specificity, freshness and directness;
3. mark the assertion `CONFLICTED` when evidence cannot be safely reconciled;
4. suggest a verification action where possible.

## Freshness

Vehicle Passports do not expire; evidence can.

Each source defines a freshness policy. UI should show `last checked` and permit refresh where supported. Stale evidence does not disappear and must not silently masquerade as current.

## Physical verification

A user/garage photograph of a component label can establish what is installed now without rewriting factory history. Example:

- factory/candidate turbo family: inferred;
- current turbo label: physically verified;
- replacement event: user/garage supplied;
- factory turbo remains historical evidence.

## AI rule

Generated reasoning may create a `PLATFORM_DERIVED` assertion/hypothesis, but it must reference underlying evidence and must never relabel itself as OEM/government evidence.
