import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { extractMarketingSignals, isPathAllowed, parseRobots } from "../src/domain/competitiveScan.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const config = JSON.parse(await readFile(resolve(root, "config/competitors.json"), "utf8"));
const outputDir = resolve(root, process.env.COMPETITIVE_OUTPUT || "artifacts/competitive-marketing");
const agent = "VehicleIntelligenceCompetitiveResearch/0.1";
const wait = (milliseconds) => new Promise((done) => setTimeout(done, milliseconds));

async function fetchText(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(url, { headers: { "user-agent": agent, accept: "text/html,text/plain" }, redirect: "follow", signal: controller.signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const body = await response.text();
    if (body.length > 2_000_000) throw new Error("Response exceeds 2 MB safety limit");
    return body;
  } finally {
    clearTimeout(timeout);
  }
}

const robotsCache = new Map();
async function rulesFor(target) {
  const origin = new URL(target).origin;
  if (!robotsCache.has(origin)) {
    robotsCache.set(origin, fetchText(`${origin}/robots.txt`).then((text) => parseRobots(text)).catch(() => null));
  }
  return robotsCache.get(origin);
}

const pages = [];
for (const competitor of config) {
  for (const url of competitor.urls.slice(0, 2)) {
    const target = new URL(url);
    const rules = await rulesFor(url);
    if (rules === null) {
      pages.push({ competitor: competitor.name, url, status: "skipped", reason: "robots.txt unavailable" });
      continue;
    }
    if (!isPathAllowed(target.pathname, rules)) {
      pages.push({ competitor: competitor.name, url, status: "skipped", reason: "robots.txt disallows path" });
      continue;
    }
    try {
      const html = await fetchText(url);
      pages.push({ competitor: competitor.name, status: "scanned", ...extractMarketingSignals(html, url) });
    } catch (error) {
      pages.push({ competitor: competitor.name, url, status: "failed", reason: error.message });
    }
    await wait(1000);
  }
}

const generatedAt = new Date().toISOString();
const report = { generatedAt, policy: "Public marketing pages only; robots-respecting; maximum two configured pages per competitor.", pages };
const scanned = pages.filter((page) => page.status === "scanned");
const signalLabels = { registrationFirst: "registration-first", freeHook: "free hook", instantPromise: "instant result", bundlePricing: "bundle pricing", socialProof: "social proof", riskFraming: "risk framing", accountFields: "account fields" };
const markdown = [
  "# Competitive marketing scan",
  "",
  `Generated: ${generatedAt}`,
  "",
  "> Public marketing pages only. This is directional conversion research, not a claim about product quality or data coverage.",
  "",
  "| Competitor | Page | Price cues | Conversion signals | Status |",
  "|---|---|---|---|---|",
  ...pages.map((page) => page.status === "scanned"
    ? `| ${page.competitor} | [${page.title || "Public page"}](${page.url}) | ${page.prices.join(", ") || "—"} | ${Object.entries(page.signals).filter(([, value]) => value).map(([key]) => signalLabels[key]).join(", ") || "—"} | scanned |`
    : `| ${page.competitor} | ${page.url} | — | — | ${page.status}: ${page.reason} |`),
  "",
  "## Repeated patterns",
  "",
  ...Object.entries(signalLabels).map(([key, label]) => `- **${label}:** ${scanned.filter((page) => page.signals[key]).length}/${scanned.length} scanned pages`),
  "",
  "## CTA language observed",
  "",
  ...scanned.map((page) => `- **${page.competitor}:** ${page.ctas.slice(0, 8).join(" · ") || "No durable CTA text extracted"}`),
  "",
];

await mkdir(outputDir, { recursive: true });
await Promise.all([
  writeFile(resolve(outputDir, "latest.json"), `${JSON.stringify(report, null, 2)}\n`),
  writeFile(resolve(outputDir, "latest.md"), markdown.join("\n")),
]);
console.log(`Scanned ${scanned.length}/${pages.length} public pages. Report: ${resolve(outputDir, "latest.md")}`);
