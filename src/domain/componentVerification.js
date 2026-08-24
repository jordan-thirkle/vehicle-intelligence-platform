export function createComponentVerification(input, now = () => new Date()) {
  const assertionId = input.assertionId?.trim();
  const installedValue = input.installedValue?.trim();
  const physicalIdentifier = input.physicalIdentifier?.trim();
  if (!assertionId || !installedValue || !physicalIdentifier) throw new Error("Component verification requires a component, installed value and physical identifier.");
  return { id: `component-${assertionId}-${now().getTime()}`, assertionId, installedValue, physicalIdentifier, note: input.note?.trim() || "", evidenceLevel: "PHYSICAL_IDENTIFIER", verification: "OWNER_OBSERVED", recordedAt: now().toISOString() };
}

export function applyComponentVerifications(assertions, verifications = []) {
  return assertions.map((assertion) => {
    const verification = [...verifications].reverse().find((item) => item.assertionId === assertion.id);
    return verification ? { ...assertion, value: verification.installedValue, qualifier: "physically identified", verification: "OWNER OBSERVED", physicalIdentifier: verification.physicalIdentifier, ownerNote: verification.note } : assertion;
  });
}
