export function createPassportExport({ vehicle, assertions, observations, events, componentVerifications }, now = () => new Date()) {
  return {
    schema: "vehicle-intelligence-passport", schemaVersion: 1, exportedAt: now().toISOString(),
    vehicle: { id: vehicle.id, registration: vehicle.registration, vin: vehicle.vin, title: vehicle.title, facts: vehicle.facts },
    mechanicalDNA: assertions.map(({ id, label, value, qualifier, verification, physicalIdentifier = null, ownerNote = "" }) => ({ id, label, value, qualifier, verification, physicalIdentifier, ownerNote })),
    diagnosticObservations: observations, timeline: events, componentVerifications,
    caveat: "This export includes user-supplied and inferred evidence. UNKNOWN does not mean CLEAR. Verify material claims with their cited source or the physical vehicle.",
  };
}
