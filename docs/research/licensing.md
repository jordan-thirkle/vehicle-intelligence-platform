# Data Licensing & Provenance Boundaries

## Principle

The platform must be commercially viable without depending on unauthorised copying of proprietary vehicle, parts or workshop databases.

## Licence classes

- `OPEN` — open data under the source's stated licence.
- `OGL` — UK Open Government Licence; retain required attribution and restrictions.
- `PUBLIC_DOMAIN` — only where status is genuinely established.
- `LINK_ONLY` — useful public service/content that we route users to but do not ingest/redistribute.
- `LICENSED_DISPLAY` — contract permits displaying supplied data under defined conditions.
- `LICENSED_DERIVATIVE` — contract permits defined derived use; terms must be recorded.
- `USER_SUPPLIED` — evidence supplied by vehicle owner/garage, subject to user rights/privacy.
- `PLATFORM_DERIVED` — our inference/aggregation based on legitimately usable inputs.

## Rules

1. Publicly reachable does not mean freely redistributable.
2. Do not scrape or reproduce proprietary workshop products (e.g. Autodata/HaynesPro) as a substitute for licensing.
3. Do not scrape commercial history reports to construct our own database.
4. Record attribution obligations at source level.
5. Keep raw licensed data separable so deletion/contract changes are manageable.
6. Derived statistics need documented input licences and transformation lineage.
7. Government branding must not imply endorsement.
8. Keeper/personal data is outside the intended public Passport model.

## Commercial-data strategy

Launch using legitimate public/open sources, user evidence and our own inference. Add commercial suppliers only where they unlock enough value to justify licensing.

Potential later suppliers include parts/fitment and workshop/RMI providers. Treat them as replaceable adapters rather than embedding a vendor's ontology into the core domain model.

## Required pre-integration review

Before enabling any source in production, record:
- owner/provider;
- exact dataset/API;
- current terms URL/version/date;
- permitted commercial use;
- redistribution/display restrictions;
- caching/storage limits;
- attribution;
- deletion/termination requirements;
- rate limits;
- personal-data considerations;
- evidence freshness expectations.
