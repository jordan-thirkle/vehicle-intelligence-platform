export const eventTypes = Object.freeze({
  MAINTENANCE: "Maintenance",
  REPAIR: "Repair",
  INSPECTION: "Inspection",
  MODIFICATION: "Modification",
  DIAGNOSTIC_OUTCOME: "Diagnostic outcome",
});

export function createTimelineEvent(input, now = () => new Date()) {
  const type = eventTypes[input.type] ? input.type : null;
  const description = input.description?.trim();
  if (!type || !description) throw new Error("Timeline events require a valid type and description.");

  const mileage = input.mileage === "" || input.mileage == null ? null : Number(input.mileage);
  if (mileage != null && (!Number.isInteger(mileage) || mileage < 0)) throw new Error("Mileage must be a positive whole number.");

  return {
    id: `event-${now().getTime()}`,
    type,
    label: eventTypes[type],
    description,
    occurredOn: input.occurredOn || null,
    mileage,
    note: input.note?.trim() || "",
    evidenceLevel: "OWNER_ENTERED",
    verification: "UNVERIFIED",
    source: "USER_SUPPLIED",
    recordedAt: now().toISOString(),
  };
}

export function sortTimeline(events) {
  return [...events].sort((a, b) => {
    const aDate = a.occurredOn || a.recordedAt || "";
    const bDate = b.occurredOn || b.recordedAt || "";
    return bDate.localeCompare(aDate);
  });
}
