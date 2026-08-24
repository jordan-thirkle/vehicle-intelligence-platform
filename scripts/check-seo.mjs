import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const publicPaths = ["free-car-check", "mot-history-check", "vehicle-passport", "compare/vehicle-history-checks"];
const fail = (message) => { throw new Error(`SEO check failed: ${message}`); };
const canonicals = new Set();

for (const pagePath of publicPaths) {
  const html = await readFile(resolve("dist", pagePath, "index.html"), "utf8");
  const title = html.match(/<title>(.*?)<\/title>/)?.[1];
  const description = html.match(/<meta name="description" content="(.*?)" \/>/)?.[1];
  const canonical = html.match(/<link rel="canonical" href="(.*?)" \/>/)?.[1];
  const robots = html.match(/<meta name="robots" content="(.*?)" \/>/)?.[1];
  const structured = html.match(/<script id="page-structured-data" type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  if (!title || title.length > 70) fail(`${pagePath} has a missing or overlong title`);
  if (!description || description.length > 170) fail(`${pagePath} has a missing or overlong description`);
  if (!canonical || canonicals.has(canonical)) fail(`${pagePath} has a missing or duplicate canonical`);
  if (!robots?.startsWith("index,follow")) fail(`${pagePath} is not indexable`);
  if (!structured) fail(`${pagePath} has no structured data`);
  JSON.parse(structured);
  canonicals.add(canonical);
}

const passport = await readFile(resolve("dist/passport/index.html"), "utf8");
if (!passport.includes('name="robots" content="noindex,follow"')) fail("Passport workspace must be noindex");
const sitemap = await readFile(resolve("dist/sitemap.xml"), "utf8");
if (sitemap.includes("/passport</loc>")) fail("Passport workspace must not appear in the sitemap");
for (const pagePath of publicPaths) if (!sitemap.includes(`/${pagePath}</loc>`)) fail(`${pagePath} missing from sitemap`);

console.log(`SEO checks passed for ${publicPaths.length} public pages; Passport workspace remains noindex.`);
