# Acquisition funnel design contract

The acquisition surface is split from the product workspace:

- `/free-car-check` serves search intent and permits registration validation before account creation;
- `/passport` opens the persistent product workspace;
- the free/premium/licensed boundary is visible before signup;
- account creation and checkout are explicitly prototype-only until secure backend services, consent records, terms and payment processing exist.

Visual references:

- `acquisition-upper.png` — search landing, lookup and lifecycle differentiation;
- `acquisition-lower.png` — feature boundary, funnel, pricing, account and order-review states.

## Search intent

Primary intent cluster:

- free car check;
- check car by registration;
- MOT history check;
- UK vehicle check;
- car history check UK.

The page should answer these naturally without keyword repetition or pages mass-produced for near-identical phrases.

## Conversion principles

1. Deliver the free result before requesting an account.
2. Ask for signup when saving a permanent Passport becomes valuable.
3. Keep public GOV.UK services free and linked directly.
4. Distinguish unavailable licensed checks from UNKNOWN results.
5. Show pricing before credentials.
6. Do not imply a charge while checkout is disconnected.
