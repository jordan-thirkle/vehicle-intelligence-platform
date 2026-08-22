# UK Data Sources

> Research map, not a claim that integrations are live. Verify current terms/access before implementation.

## DVSA MOT History

Potential role: core MOT/vehicle-history evidence, mileage timeline, failures, defects and advisories.

Known integration modes from current DVSA documentation:
- API lookup including registration/VIN use cases;
- authorised registration/application process;
- bulk vehicle/MOT snapshot plus delta distribution.

Implementation rule: store returned records as attributed evidence and retain retrieval timestamps.

Official user link: `https://www.gov.uk/check-mot-history`

## DVLA Vehicle Enquiry

Potential role: registration-level vehicle attributes and tax/MOT status where permitted by the available service/API.

Access state must be checked before implementation; do not make v0.1 dependent on an API credential we do not possess.

Official user link: `https://www.gov.uk/get-vehicle-information-from-dvla`

## Vehicle recalls

Potential role: safety recall routing and, where a legitimately accessible dataset/API supports it, structured evidence.

Do not assume manufacturer-facing DVSA recall APIs are public consumer APIs.

Official user link: `https://www.gov.uk/check-vehicle-recall`

## Vehicle Certification Agency (VCA)

Potential role:
- emissions/fuel-consumption data;
- type-approval enrichment;
- future electronic Certificate of Conformity (eCoC) VIN workflows as public capabilities mature.

Official site: `https://www.vehicle-certification-agency.gov.uk/`

## OEM/manufacturer sources

Potential role:
- VIN structure documentation;
- recalls/campaigns;
- owner manuals;
- technical specifications where publication/licensing permits reuse.

Rights vary by document and field. Public accessibility is not equivalent to redistribution permission.

## Data-source contract

Every provider adapter should expose:
```text
provider_id
country
capabilities
licence_class
authority_level
freshness_policy
lookup(input)
source_links
```

Adapters return evidence/observations, not final truth.

## First-class official links

UK Passport UI should preserve direct routes to:
- DVLA vehicle information;
- DVSA MOT history;
- official recall checker;
- relevant VCA/OEM source where useful.

Do not describe the platform as “DVLA approved”, “DVSA approved” or government endorsed without actual authorization.
