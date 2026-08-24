export const assertionStates = Object.freeze({
  CLEAR: "CLEAR",
  UNKNOWN: "UNKNOWN",
  FLAGGED: "FLAGGED",
});

export function resolveThreeState(observations = []) {
  const applicable = observations.filter((item) => item.available && item.inScope);
  if (applicable.some((item) => item.flagged)) return assertionStates.FLAGGED;
  if (applicable.some((item) => item.authoritative && item.clear)) return assertionStates.CLEAR;
  return assertionStates.UNKNOWN;
}

export function evidenceSummary(assertion, evidenceById) {
  return assertion.evidenceIds.map((id) => evidenceById[id]).filter(Boolean);
}
