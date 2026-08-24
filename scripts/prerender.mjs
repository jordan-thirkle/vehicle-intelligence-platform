import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { acquisitionPages, marketingMarkup } from "../src/ui/renderMarketing.js";

const outputRoot = resolve("dist");
const shell = await readFile(resolve(outputRoot, "index.html"), "utf8");
const productionOrigin = (process.env.SITE_ORIGIN || "https://vehicleintelligence.example").replace(/\/$/, "");

function structuredData(page) {
  const graph = [
    { "@type": "WebSite", "@id": `${productionOrigin}/#website`, url: `${productionOrigin}/`, name: "Vehicle Intelligence", inLanguage: "en-GB" },
    { "@type": "WebPage", "@id": `${productionOrigin}${page.path}#webpage`, url: `${productionOrigin}${page.path}`, name: page.title, description: page.description, isPartOf: { "@id": `${productionOrigin}/#website` }, inLanguage: "en-GB" },
  ];
  if (page.path === "/free-car-check") graph.push({ "@type": "WebApplication", name: "Vehicle Intelligence", applicationCategory: "UtilitiesApplication", operatingSystem: "Web", url: `${productionOrigin}${page.path}`, offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" } });
  if (page.path.startsWith("/compare/")) graph.push({ "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Free vehicle check", item: `${productionOrigin}/free-car-check` }, { "@type": "ListItem", position: 2, name: "Compare vehicle history checks", item: `${productionOrigin}${page.path}` }] });
  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replaceAll("<", "\\u003c");
}

function replaceHead(html, page, { index = true } = {}) {
  return html
    .replace(/<title>.*?<\/title>/, `<title>${page.title}</title>`)
    .replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${page.description}" />`)
    .replace(/<link rel="canonical" href=".*?" \/>/, `<link rel="canonical" href="${productionOrigin}${page.path}" />`)
    .replace(/<meta name="robots" content=".*?" \/>/, `<meta name="robots" content="${index ? "index,follow,max-image-preview:large" : "noindex,follow"}" />`)
    .replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${page.title}" />`)
    .replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${page.description}" />`)
    .replace(/<meta property="og:url" content=".*?" \/>/, `<meta property="og:url" content="${productionOrigin}${page.path}" />`)
    .replace(/<meta name="twitter:title" content=".*?" \/>/, `<meta name="twitter:title" content="${page.title}" />`)
    .replace(/<meta name="twitter:description" content=".*?" \/>/, `<meta name="twitter:description" content="${page.description}" />`)
    .replace(/<script id="page-structured-data" type="application\/ld\+json">[\s\S]*?<\/script>/, `<script id="page-structured-data" type="application/ld+json">${structuredData(page)}</script>`);
}

async function writePage(page, markup, options) {
  const directory = resolve(outputRoot, page.path.slice(1));
  await mkdir(directory, { recursive: true });
  const html = replaceHead(shell, page, options).replace('<div id="app"></div>', `<div id="app">${markup}</div>`);
  await writeFile(resolve(directory, "index.html"), html);
}

for (const page of Object.values(acquisitionPages)) {
  await writePage(page, marketingMarkup(page));
}

const rootPage = acquisitionPages["/free-car-check"];
await writeFile(resolve(outputRoot, "index.html"), replaceHead(shell, rootPage).replace('<div id="app"></div>', `<div id="app">${marketingMarkup(rootPage)}</div>`));

const passportPage = {
  path: "/passport",
  title: "Vehicle Passport — FG11 YKC | Vehicle Intelligence",
  description: "Evidence-backed Vehicle Passport, Mechanical DNA, ownership timeline and diagnostic workspace for Reference Vehicle #000001.",
};
await writePage(passportPage, '<main><p>Loading the evidence-backed Vehicle Passport…</p></main>', { index: false });

const indexedPages = Object.values(acquisitionPages);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${indexedPages.map((page) => `  <url><loc>${productionOrigin}${page.path}</loc><lastmod>2026-08-24</lastmod></url>`).join("\n")}\n</urlset>\n`;
await writeFile(resolve(outputRoot, "sitemap.xml"), sitemap);
await writeFile(resolve(outputRoot, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${productionOrigin}/sitemap.xml\n`);
