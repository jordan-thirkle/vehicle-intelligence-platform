const weight = { supports: 1, contradicts: -1 };

export function rankHypotheses(hypotheses, observations = []) {
  return hypotheses
    .map((hypothesis) => {
      const adjustment = observations.reduce((total, observation) => {
        const relationship = observation.relationships?.[hypothesis.id];
        return total + (weight[relationship] ?? 0) * (observation.strength ?? 1);
      }, 0);
      return { ...hypothesis, score: hypothesis.baseScore + adjustment };
    })
    .sort((a, b) => b.score - a.score);
}

export function recommendedTests(hypotheses) {
  const ids = new Set(hypotheses.slice(0, 3).map((item) => item.id));
  return [
    {
      id: "retrieve-dtcs",
      title: "Retrieve current and pending DTCs",
      why: "Fault codes and freeze-frame data can separate airflow, boost-control and fuel-pressure paths without replacing parts.",
      effort: "Low effort",
      value: "High value",
    },
    {
      id: "inspect-charge-air",
      title: "Inspect the charge-air system",
      why: "A visual check for displaced joints, splits and concentrated oil marks directly tests the leading leak hypothesis.",
      effort: "Low effort",
      value: ids.has("charge-air-leak") ? "High value" : "Useful",
    },
  ];
}

export const diagnosticResults = Object.freeze({
  "no-dtcs": {
    label: "No current or pending DTCs found",
    strength: 0.25,
    relationships: { "air-metering": "contradicts", "turbo-control": "contradicts", "fuel-delivery": "contradicts" },
    explanation: "No stored code slightly reduces electronically monitored paths, but does not clear them or exclude a mechanical fault.",
  },
  "underboost-dtc": {
    label: "Underboost DTC recorded",
    strength: 2,
    relationships: { "charge-air-leak": "supports", "turbo-control": "supports" },
    explanation: "Underboost supports both an air leak and a boost-control problem; inspection and live data are still needed to separate them.",
  },
  "leak-found": {
    label: "Charge-air leak or displaced joint found",
    strength: 4,
    relationships: { "charge-air-leak": "supports", "turbo-control": "contradicts" },
    explanation: "Physical leak evidence strongly supports the leading path and makes turbo-control failure less necessary to explain the symptoms.",
  },
  "charge-air-intact": {
    label: "Charge-air hoses and joints appear intact",
    strength: 2,
    relationships: { "charge-air-leak": "contradicts" },
    explanation: "A visual inspection reduces the leak hypothesis, but a pressure or smoke test may still be needed for small leaks.",
  },
  "rpm-flare": {
    label: "Engine RPM rises disproportionately to road speed",
    strength: 5,
    relationships: { "clutch-slip": "supports", "charge-air-leak": "contradicts", "air-metering": "contradicts", "turbo-control": "contradicts" },
    explanation: "RPM flare directly supports clutch slip and reduces engine-airflow explanations for the loss of road speed.",
  },
});

export function createDiagnosticObservation(resultId, note = "") {
  const result = diagnosticResults[resultId];
  if (!result) throw new Error(`Unknown diagnostic result: ${resultId}`);
  return {
    id: `result-${resultId}-${Date.now()}`,
    resultId,
    label: result.label,
    note: note.trim(),
    strength: result.strength,
    relationships: result.relationships,
    explanation: result.explanation,
    recordedAt: new Date().toISOString(),
    source: "USER_SUPPLIED",
  };
}
