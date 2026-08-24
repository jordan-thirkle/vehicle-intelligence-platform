# Competitive marketing intelligence

Last reviewed: 24 August 2026.

## What the public funnels reward

A live scan of six accessible public marketing pages across HPI Check, Total Car Check, MotorCheck and carVertical found a consistent conversion grammar:

| Pattern | Pages observed | Why it works | Vehicle Intelligence response |
|---|---:|---|---|
| Risk framing | 6/6 | Makes the cost of not checking concrete | Explain the decision protected, while keeping UNKNOWN distinct from CLEAR |
| Free entry point | 5/6 | Matches high-volume search intent and lowers commitment | Registration check before account creation; official links remain free |
| Social or institutional proof | 5/6 | Reduces anxiety around unfamiliar data products | Use evidence provenance and official links now; never manufacture review counts |
| Registration-first journey | 4/6 | Converts generic intent into a vehicle-specific result quickly | Keep the registration field as the primary action on every acquisition page |
| Instant-result promise | 4/6 | Sets a clear time-to-value expectation | Give an immediate preview and state plainly when a live provider is unavailable |
| Multi-check/bundle framing | 4/6 | Anchors value for active car shoppers | Defer until licensed checks exist; Passport value is continuity, not check volume |
| Account fields on landing page | 0/6 | Competitors generally postpone identity friction | Keep free lookup before sign-up and ask for an account only when saving value |

The strongest incumbents combine a registration field, an immediate action verb, costly-risk language, a visible guarantee and proof of scale. HPI currently markets 80+ data points, a full check from £19.99, a three-check package and a conditional £30,000 guarantee. Total Car Check competes strongly on price anchoring: £9.99 for one Gold check, falling to £3.99 each in a five-pack, also with a conditional £30,000 guarantee. These guarantees are not simple blanket promises; their terms include scope, timing and evidence conditions.

The product should borrow the funnel clarity, not unsupported claims. Our defensible distinction is the route from free intent to persistent value: **check → save → maintain → diagnose → verify**.

## Low-maintenance collection design

Run `npm run competitive:scan` to produce `artifacts/competitive-marketing/latest.md` and `latest.json`.

The collector intentionally:

- visits configured public marketing pages only;
- requests and honours `robots.txt`, skipping a site when it cannot verify permission;
- scans no more than two configured pages per competitor, sequentially and with a delay;
- uses a 15-second timeout and 2 MB response limit;
- stores extracted headings, calls to action, prices and broad conversion signals—not copied page HTML;
- never logs in, submits a registration, enters checkout or accesses paid reports.

The weekly GitHub Actions workflow is read-only and uploads a 30-day artifact. It does not make automatic repository edits, publish competitor claims, or create maintenance PRs. A human should review meaningful changes before they become product copy.

## Interpretation limits

This is page-content observation, not traffic, ranking or conversion-rate measurement. A detected phrase does not prove performance. JavaScript rendering, experiments, localisation and bot protection can also change what the collector sees. Search visibility and conversion claims require separate first-party analytics or a licensed SEO dataset.
