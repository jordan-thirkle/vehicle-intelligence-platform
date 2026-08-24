const decode = (value = "") => value
  .replace(/<[^>]+>/g, " ")
  .replace(/&(?:nbsp|#160);/gi, " ")
  .replace(/&amp;/gi, "&")
  .replace(/&pound;/gi, "£")
  .replace(/&quot;/gi, '"')
  .replace(/&#(?:39|x27);/gi, "'")
  .replace(/\s+/g, " ")
  .trim();

const unique = (values, limit = 20) => [...new Set(values.filter(Boolean))].slice(0, limit);
const matches = (html, regex, limit) => unique([...html.matchAll(regex)].map((match) => decode(match[1])), limit);

export function extractMarketingSignals(html, url = "") {
  const text = decode(html);
  const lower = text.toLowerCase();
  const title = decode(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]);
  const description = decode(html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)/i)?.[1]
    || html.match(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i)?.[1]);
  const headings = matches(html, /<h[12][^>]*>([\s\S]*?)<\/h[12]>/gi, 16);
  const ctas = unique([
    ...matches(html, /<button[^>]*>([\s\S]*?)<\/button>/gi, 30),
    ...matches(html, /<a[^>]*>([\s\S]*?)<\/a>/gi, 50),
  ].filter((label) => label.length <= 90 && /check|buy|get|start|view|report|go|free|price|continue|sign|register|download/i.test(label)), 20);
  const prices = unique([...text.matchAll(/£\s?\d[\d,]*(?:\.\d{1,2})?/g)].map((match) => match[0].replace(/£\s+/, "£")), 12);
  const guarantees = unique([...text.matchAll(/(?:up to\s*)?£\s?[\d,.]+[^.!?]{0,45}guarantee|guarantee[^.!?]{0,45}(?:up to\s*)?£\s?[\d,.]+/gi)].map((match) => match[0]), 8);
  const inputTypes = unique([...html.matchAll(/<input[^>]*(?:type=["']?([^\s"'>]+))?[^>]*>/gi)].map((match) => (match[1] || "text").toLowerCase()), 12);
  const jsonLdTypes = unique([...html.matchAll(/["']@type["']\s*:\s*["']([^"']+)/gi)].map((match) => match[1]), 12);
  const proofTerms = ["trustpilot", "trusted by", "reviews", "data points", "data sources", "million", "guarantee", "instant", "official", "experience"]
    .filter((term) => lower.includes(term));

  return {
    url,
    title,
    description,
    headings,
    ctas,
    prices,
    guarantees,
    proofTerms,
    jsonLdTypes,
    formCount: (html.match(/<form\b/gi) || []).length,
    inputTypes,
    signals: {
      registrationFirst: /(?:enter|check|your)\s+(?:car\s+)?(?:reg|registration|vrm)|number\s*plate/i.test(text),
      freeHook: /\bfree\b/i.test(text),
      instantPromise: /\binstant(?:ly)?\b/i.test(text),
      bundlePricing: /\b(?:multi.?check|bundle|\d+\s+(?:checks|reports)|save\s+\d+)/i.test(text),
      socialProof: /trustpilot|trusted by|customer reviews|million/i.test(text),
      riskFraming: /hidden|stolen|write.?off|finance|scam|fraud|risk|costly|peace of mind/i.test(text),
      accountFields: inputTypes.includes("email") || inputTypes.includes("password"),
    },
  };
}

export function parseRobots(text = "", userAgent = "vehicleintelligencecompetitiveresearch") {
  const groups = [];
  let agents = [];
  let rules = [];
  const flush = () => {
    if (agents.length) groups.push({ agents, rules });
    agents = [];
    rules = [];
  };
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.replace(/#.*$/, "").trim();
    if (!line) continue;
    const [field, ...rest] = line.split(":");
    const value = rest.join(":").trim();
    if (field.toLowerCase() === "user-agent") {
      if (rules.length) flush();
      agents.push(value.toLowerCase());
    } else if (/^(allow|disallow)$/i.test(field) && agents.length) {
      rules.push({ type: field.toLowerCase(), path: value });
    }
  }
  flush();
  const exact = groups.filter((group) => group.agents.some((agent) => userAgent.toLowerCase().includes(agent) && agent !== "*"));
  const selected = exact.length ? exact : groups.filter((group) => group.agents.includes("*"));
  return selected.flatMap((group) => group.rules);
}

export function isPathAllowed(pathname, rules = []) {
  const applicable = rules.filter((rule) => rule.path && pathname.startsWith(rule.path.replace(/\*.*$/, "")));
  if (!applicable.length) return true;
  applicable.sort((a, b) => b.path.length - a.path.length);
  return applicable[0].type === "allow";
}
