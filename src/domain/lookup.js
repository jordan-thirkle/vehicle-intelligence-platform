const UK_VRM = /^[A-Z]{2}[0-9]{2}[A-Z]{3}$/;
const VIN = /^[A-HJ-NPR-Z0-9]{17}$/;

export function normalizeIdentifier(value) {
  return value.toUpperCase().replace(/[\s-]/g, "");
}

export function classifyIdentifier(value) {
  const normalized = normalizeIdentifier(value);

  if (UK_VRM.test(normalized)) return { valid: true, type: "VRM", normalized };
  if (VIN.test(normalized)) return { valid: true, type: "VIN", normalized };

  return {
    valid: false,
    type: null,
    normalized,
    message: "Enter a UK registration or a 17-character VIN (excluding I, O and Q).",
  };
}
