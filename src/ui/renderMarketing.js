import { freeLookup, prototypeOrder } from "../domain/funnel.js";
import { funnelEvents, intentForRoute } from "../domain/analytics.js";
import { icon } from "./icons.js";
import { trackFunnelEvent } from "./analytics.js";

const officialLinks = [
  ["Check MOT history on GOV.UK", "https://www.gov.uk/check-mot-history"],
  ["Get DVLA vehicle information", "https://www.gov.uk/get-vehicle-information-from-dvla"],
  ["Check vehicle recalls", "https://www.gov.uk/check-vehicle-recall"],
];

export const acquisitionPages = Object.freeze({
  "/free-car-check": {
    path: "/free-car-check",
    title: "Free UK Vehicle Check by Registration | Vehicle Intelligence",
    description: "Check a UK vehicle by registration for free, follow official GOV.UK links, and build a permanent evidence-backed Vehicle Passport.",
    heading: "Check a UK vehicle.<br />Keep the evidence for life.",
    lead: "Run a free registration lookup and follow official GOV.UK services at no cost. Create a permanent Vehicle Passport to maintain, diagnose and prove your vehicle’s story over time.",
  },
  "/mot-history-check": {
    path: "/mot-history-check",
    title: "Free MOT History Check and Vehicle Passport | Vehicle Intelligence",
    description: "Start a free UK MOT history check through official GOV.UK services, then preserve advisories, maintenance and repair evidence in a Vehicle Passport.",
    heading: "Check MOT history.<br />Keep track of what happens next.",
    lead: "Use the official GOV.UK MOT history service for the authoritative record. Vehicle Intelligence adds a permanent place to understand advisories, record repairs and prove outcomes over time.",
  },
  "/vehicle-passport": {
    path: "/vehicle-passport",
    title: "Permanent Digital Vehicle Passport | Vehicle Intelligence",
    description: "Build a permanent evidence-backed record of your vehicle’s identity, maintenance, installed components, diagnostics, repairs and outcomes.",
    heading: "Your vehicle’s history should continue with you.",
    lead: "Create a permanent evidence-backed Vehicle Passport for maintenance, installed components, diagnostic sessions, repairs and verified outcomes—not another report that ends after purchase.",
  },
  "/compare/vehicle-history-checks": {
    path: "/compare/vehicle-history-checks",
    title: "UK Vehicle History Checks Compared | Vehicle Intelligence",
    description: "Compare prominent UK vehicle history checks, public prices, guarantees and uses—and learn where a permanent Vehicle Passport differs.",
    heading: "Which vehicle history check<br />fits your decision?",
    lead: "Compare what prominent providers publicly advertise, what their guarantees actually require, and where a one-off history report ends. Facts checked 24 August 2026.",
    comparison: true,
  },
});

function comparisonMarkup() {
  return `<section class="market-section market-width comparison-guide" id="comparison">
    <header><span class="section-label">Independent decision guide</span><h2>Different products solve different parts of the problem</h2><p>Vehicle Intelligence is not affiliated with any provider below. Names belong to their respective owners. Prices and marketed features can change; follow the cited provider page before purchasing.</p></header>
    <div class="comparison-table" role="region" aria-label="Vehicle history product comparison" tabindex="0"><table>
      <thead><tr><th>Product</th><th>Public proposition</th><th>Published price cue</th><th>Best suited to</th><th>Source</th></tr></thead>
      <tbody>
        <tr><th>HPI Check</th><td>Full history report with 80+ advertised data points and a conditional guarantee up to £30,000.</td><td>Full check from £19.99; three-check package £29.99.</td><td>A recognised UK pre-purchase history report.</td><td><a href="https://www.home.hpicheck.com/car-history-check/" rel="nofollow">Verify with HPI ↗</a></td></tr>
        <tr><th>Total Car Check</th><td>Gold report advertising finance, valuation, salvage, write-off and 50+ further checks, with a conditional £30,000 guarantee.</td><td>£9.99 once; advertised multi-buy prices reduce to £3.99 each.</td><td>Price-conscious buyers comparing several UK cars.</td><td><a href="https://totalcarcheck.co.uk/Prices" rel="nofollow">Verify with Total Car Check ↗</a></td></tr>
        <tr><th>MotorCheck</th><td>History report advertising identity, finance, write-off, mileage, keeper, taxi, valuation, recall and MOT information.</td><td>Check current checkout price with the provider.</td><td>UK buyers wanting a broad pre-purchase checklist.</td><td><a href="https://www.motorcheck.co.uk/" rel="nofollow">Verify with MotorCheck ↗</a></td></tr>
        <tr><th>carVertical</th><td>International report advertising 1,000+ sources across 45+ countries, recorded images when available, damage, mileage and ownership information.</td><td>Pricing may depend on the current offer and report quantity.</td><td>Imported vehicles or buyers seeking international coverage.</td><td><a href="https://www.carvertical.com/gb" rel="nofollow">Verify with carVertical ↗</a></td></tr>
        <tr class="comparison-own"><th>Vehicle Intelligence</th><td>Free official-service routing plus a permanent evidence, maintenance and diagnostic Passport. Licensed finance, theft, salvage and write-off data is not available in this prototype.</td><td>Free prototype; Passport Plus pricing is under validation.</td><td>Owners who want the record to continue after the purchase decision.</td><td><a href="/vehicle-passport">Explore the Passport →</a></td></tr>
      </tbody>
    </table></div>
    <div class="comparison-decisions"><article><h3>Buying right now?</h3><p>Use official MOT and recall services, inspect the physical car and consider a licensed history report. Read guarantee conditions before relying on the headline amount.</p></article><article><h3>Already own the car?</h3><p>A static report cannot capture your later servicing, installed parts, symptoms, tests, repairs and outcomes. That continuity is the Passport’s job.</p></article><article><h3>Comparing providers?</h3><p>Compare coverage, data geography, guarantee scope, report availability and total multi-check cost—not only the number of advertised checks.</p></article></div>
    <aside class="comparison-method"><strong>Method and corrections</strong><p>We compare claims visible on providers’ public pages, reviewed 24 August 2026. We do not buy reports or test underlying data coverage in this comparison. If a cited fact changes, the provider page takes precedence.</p></aside>
  </section>`;
}

function intentContentMarkup(page) {
  const content = {
    "/free-car-check": {
      eyebrow: "Free UK vehicle-check guide",
      title: "What you can check free—and what still needs licensed data",
      cards: [
        ["Start with authoritative records", "The official MOT, DVLA vehicle-information and recall services provide valuable public information without a history-report fee. We keep those routes visible instead of disguising government access as a premium feature."],
        ["Do not mistake missing data for a clean car", "A free lookup cannot establish that a vehicle has no finance, theft, salvage or write-off record. Those checks require appropriately licensed data. UNKNOWN therefore remains UNKNOWN until the necessary source has actually been queried."],
        ["Preserve what you learn", "A buying check is only the beginning. Save inspections, seller documents, photographs, later servicing and repair outcomes in a Vehicle Passport so the evidence remains useful after the purchase decision."],
      ],
    },
    "/mot-history-check": {
      eyebrow: "MOT history explained",
      title: "Turn an MOT timeline into an ownership plan",
      cards: [
        ["Use the official record", "Check the MOT history through GOV.UK for the authoritative public result. Review failures, advisories, dates and recorded mileage rather than relying on a copied summary that may become stale."],
        ["Look for patterns, not one isolated advisory", "Repeated tyre, brake, suspension, corrosion or visibility observations can reveal maintenance patterns. An advisory is evidence to investigate—not proof that a component is currently unsafe or already repaired."],
        ["Close the evidence loop", "Record the inspection, repair receipt, replaced part and later MOT outcome together. That converts a warning in an old test into a traceable maintenance story without rewriting the official record."],
      ],
    },
    "/vehicle-passport": {
      eyebrow: "Permanent ownership record",
      title: "A Vehicle Passport records the car you actually own",
      cards: [
        ["Identity and provenance", "Keep registration, VIN, authoritative links and the source behind each material claim. Inference, owner observation, document evidence and professional verification remain visibly different."],
        ["Factory specification versus installed hardware", "A parts catalogue may describe what was fitted originally. Mechanical DNA records labels, markings and part numbers physically observed on the current vehicle, including replacements and modifications."],
        ["Symptoms through verified outcome", "Capture what happened, rank plausible fault paths, record the cheapest useful tests and link the eventual repair to its result. The goal is reduced uncertainty—not an AI-generated verdict."],
      ],
    },
  }[page.path];
  if (!content) return "";
  return `<section class="market-section market-width intent-content"><header><span class="section-label">${content.eyebrow}</span><h2>${content.title}</h2></header><div>${content.cards.map(([title, body]) => `<article><h3>${title}</h3><p>${body}</p></article>`).join("")}</div></section>`;
}

export function pageForPath(pathname) {
  return acquisitionPages[pathname] || acquisitionPages["/free-car-check"];
}

export function marketingMarkup(page = acquisitionPages["/free-car-check"]) {
  return `
    <header class="market-header market-width">
      <a class="market-brand" href="/free-car-check"><span>VI</span>Vehicle Intelligence</a>
      <nav aria-label="Main navigation"><a href="#free-check">Free vehicle check</a><a href="/compare/vehicle-history-checks">Compare checks</a><a href="#how-it-works">How it works</a><a href="#pricing">Pricing</a></nav>
      <a class="market-button market-button--navy" href="/passport">Open my Passport</a>
    </header>

    <main class="marketing">
      <section class="market-hero market-width" id="free-check">
        <div class="hero-copy">
          <h1>${page.heading}</h1>
          <p>${page.lead}</p>
          <form class="hero-lookup" id="market-lookup" novalidate>
            <span class="plate-prefix">UK</span><label class="sr-only" for="market-vrm">UK registration</label><input id="market-vrm" name="identifier" value="FG11 YKC" autocomplete="off" spellcheck="false" aria-describedby="lookup-assurance" />
            <button class="market-button" type="submit">Check this vehicle free</button>
          </form>
          <div class="hero-message" id="hero-message" role="status" aria-live="polite"></div>
          <p class="assurance" id="lookup-assurance"><span>✓ No account needed for the free check</span><span>✓ No keeper data</span><span>✓ Official links stay free</span></p>
          <nav class="intent-links" aria-label="Choose what you need"><a href="/free-car-check">Buying a car</a><a href="/vehicle-passport">Owning a car</a><a href="/passport#investigation">Diagnosing a problem</a></nav>
        </div>
        <article class="passport-preview" id="passport-preview" aria-label="Vehicle Passport preview">
          <div class="passport-bar"><span>Vehicle Passport preview</span><small>Evidence, not a verdict</small></div>
          <div class="passport-identity"><div><small>Reference Vehicle #000001</small><h2>2011 Vauxhall Astra J 1.7 CDTi</h2><strong>FG11 YKC</strong></div><span class="preview-car">${icon("car")}</span></div>
          <dl><div><dt>MOT history</dt><dd><span class="market-status">UNKNOWN</span><a href="https://www.gov.uk/check-mot-history">View on GOV.UK ↗</a></dd></div><div><dt>Engine candidate</dt><dd><span class="market-status">INFERRED</span><span>A17DTJ</span></dd></div><div><dt>Current turbo</dt><dd><span class="market-status">UNKNOWN</span><span>Physical label needed</span></dd></div><div><dt>Diagnostic session</dt><dd><span class="market-status market-status--active">ACTIVE</span><span>Poor acceleration + whoosh</span></dd></div></dl>
        </article>
      </section>

      ${page.comparison ? comparisonMarkup() : ""}
      ${intentContentMarkup(page)}

      <section class="continuity">
        <div class="market-width">
          <div class="continuity-copy"><h2>A history report ends.<br />Your vehicle’s story doesn’t.</h2><p>A one-off report stops at purchase. A Vehicle Passport grows with every mile, repair and piece of evidence.</p></div>
          <div class="lifecycle"><span>Before you</span><span>Own</span><span>Maintain</span><span>Diagnose</span><span>Repair</span><span>Verify</span><strong>Continues for life →</strong></div>
          <div class="proof-levels"><span><b>1</b><strong>Owner entered</strong><small>Information you provide</small></span><span><b>2</b><strong>Document evidenced</strong><small>Receipts, photos, PDFs</small></span><span><b>3</b><strong>Garage verified</strong><small>Professional checks</small></span><span><b>4</b><strong>Authoritative record</strong><small>Official systems</small></span></div>
        </div>
      </section>

      <section class="market-section market-width product-boundary">
        <h2>Start free. Pay only for evidence and workflow we add.</h2>
        <div class="offer-columns">
          <article><h3>Free vehicle check</h3><ul><li>UK registration validation</li><li>Vehicle identity preview</li><li>Official GOV.UK links</li><li>No account required</li></ul><div class="mini-passport"><strong>FG11 YKC</strong><span>Vauxhall Astra J · Diesel · Manual</span>${officialLinks.map(([label, url]) => `<a href="${url}">${label} ↗</a>`).join("")}</div></article>
          <article><h3>Passport Plus</h3><ul><li>Permanent ownership timeline</li><li>Receipt and photo evidence</li><li>Maintenance reminders</li><li>Mechanical DNA</li><li>Diagnostic sessions</li></ul><div class="mini-timeline"><span>Identity captured</span><span>Maintenance recorded</span><span>Diagnosis updated</span><span>Repair verified</span></div></article>
          <article><h3>Licensed history check</h3><p class="unavailable">Not available in this prototype</p><p>Finance, write-off, theft, salvage and valuation checks require a licensed provider. No live data is shown here.</p><div class="locked-provider">${icon("evidence")}<strong>Future licensed integration</strong><span>Provider and price to be confirmed.</span></div></article>
        </div>
      </section>

      <section class="market-section market-width steps" id="how-it-works">
        <h2>From registration to a vehicle you understand</h2>
        <ol><li><b>1</b><span><strong>Check free</strong><small>No account. Get identity and official links.</small></span></li><li><b>2</b><span><strong>Save your Passport</strong><small>Create an account to keep the record.</small></span></li><li><b>3</b><span><strong>Add deeper evidence</strong><small>Build history, verify parts and diagnose.</small></span></li></ol>
      </section>

      <section class="market-section market-width decision-proof">
        <div><span class="section-label">Why owners continue</span><h2>One check answers “what was recorded?”<br />Your Passport keeps asking “what changed?”</h2></div>
        <ul><li><strong>Before purchase</strong><span>Start with official records and add a licensed history check when available.</span></li><li><strong>During ownership</strong><span>Keep receipts, component labels and maintenance together instead of rebuilding the story later.</span></li><li><strong>When something goes wrong</strong><span>Turn symptoms and test results into ranked next checks—without inventing certainty.</span></li></ul>
      </section>

      <section class="market-section pricing market-width" id="pricing">
        <div class="pricing-heading"><div><h2>Simple, honest prototype pricing</h2><p>Pricing is being tested. No payment will be taken in this prototype.</p></div></div>
        <div class="price-columns">
          <article><h3>Free</h3><p class="price"><strong>£0</strong> forever</p><ul><li>Registration validation</li><li>Vehicle identity</li><li>Official GOV.UK links</li><li>Passport preview</li></ul><button class="market-button market-button--outline" data-scroll-check>Check a vehicle</button></article>
          <article class="price-featured"><span class="recommended">Pricing under validation</span><h3>Passport Plus</h3><p class="price"><strong>£4.99</strong> /month<br /><b>or £39/year</b></p><ul><li>Everything free</li><li>Ownership timeline</li><li>Evidence storage</li><li>Mechanical DNA</li><li>Diagnostic sessions</li></ul><button class="market-button" data-plan="PLUS_ANNUAL">Explore the Passport demo</button></article>
          <article><h3>Licensed history check</h3><p class="price price--later"><strong>Coming later</strong><br />Provider price</p><ul><li>Finance when available</li><li>Write-off when available</li><li>Theft when available</li><li>Salvage and valuation when available</li></ul><button class="market-button market-button--outline" id="availability-button">Join availability list</button></article>
        </div>
      </section>

      <section class="conversion market-width" id="account" hidden>
        <article class="prototype-gate"><h2 id="conversion-title">Passport Plus is currently a working demo</h2><p id="conversion-copy">Explore the evidence, Mechanical DNA, diagnostic and ownership flows using Reference Vehicle #000001. No account or payment details are requested.</p><a class="market-button" href="/passport">Open the Passport demo</a></article>
        <aside class="order-review"><h2>Commercial boundary</h2><div><strong>Indicative annual price</strong><span>£39/year</span></div><div><strong>Due today</strong><span>£0</span></div><p><strong>Subscriptions are not on sale yet.</strong> Authentication, consent records and secure checkout must be connected before payment is accepted.</p></aside>
      </section>

      <section class="market-section faq market-width"><h2>Common questions about UK vehicle checks</h2>
        <details><summary>What does a free UK vehicle check include?</summary><p>This prototype validates a UK registration, shows the reference vehicle identity where fixture data exists, and keeps direct links to official MOT history, DVLA vehicle information and recall services. It does not claim licensed finance, write-off, theft or salvage results.</p></details>
        <details><summary>Is Vehicle Intelligence an official DVLA or DVSA service?</summary><p>No. Vehicle Intelligence is independent and is not affiliated with DVLA, DVSA or another government body. Official checks open on GOV.UK.</p></details>
        <details><summary>Do I need an account?</summary><p>No account is needed for the free check. An account will eventually preserve a permanent Vehicle Passport across devices; prototype account creation is not connected to a backend.</p></details>
        <details><summary>What is the difference between a vehicle history report and a Vehicle Passport?</summary><p>A history report is a snapshot of records available at check time. A Vehicle Passport is intended to continue through ownership with maintenance, installed-component evidence, diagnostic sessions, repairs and outcomes.</p></details>
      </section>
    </main>

    <footer class="market-footer"><div class="market-width"><a class="market-brand" href="/free-car-check"><span>VI</span>Vehicle Intelligence</a><p>Independent prototype. Not affiliated with DVLA, DVSA or another government body.</p><nav><a href="/free-car-check">Free vehicle check</a><a href="/mot-history-check">MOT history check</a><a href="/vehicle-passport">Vehicle Passport</a><a href="/compare/vehicle-history-checks">Compare history checks</a>${officialLinks.map(([label, url]) => `<a href="${url}">${label}</a>`).join("")}</nav><nav><a href="https://github.com/jordan-thirkle/vehicle-intelligence-platform">Project source</a><a href="https://github.com/jordan-thirkle/vehicle-intelligence-platform/issues">Report an issue</a><a href="/compare/vehicle-history-checks#comparison">Sources and comparisons</a></nav></div></footer>`;
}

export function renderMarketing(root) {
  const page = pageForPath(window.location.pathname);
  document.title = page.title;
  document.querySelector('meta[name="description"]')?.setAttribute("content", page.description);
  root.innerHTML = marketingMarkup(page);

  bindMarketing(root);
  trackFunnelEvent(funnelEvents.PAGE_VIEWED, { route: page.path, intent: intentForRoute(page.path) });
}

function bindMarketing(root) {
  const lookup = root.querySelector("#market-lookup");
  const message = root.querySelector("#hero-message");
  const preview = root.querySelector("#passport-preview");
  const fixturePreview = preview.innerHTML;
  lookup.addEventListener("submit", (event) => {
    event.preventDefault();
    const result = freeLookup(new FormData(lookup).get("identifier"));
    if (!result.valid) {
      trackFunnelEvent(funnelEvents.LOOKUP_COMPLETED, { route: window.location.pathname, identifierType: "invalid", outcome: "invalid" });
      message.textContent = result.message;
      message.className = "hero-message hero-message--error";
      return;
    }
    trackFunnelEvent(funnelEvents.LOOKUP_COMPLETED, { route: window.location.pathname, identifierType: result.type, outcome: result.status });
    if (result.isFixture) {
      preview.innerHTML = fixturePreview;
      message.innerHTML = `<strong>Reference vehicle found.</strong> View the free Passport preview or <a href="/passport">open FG11 YKC’s Passport →</a>`;
      message.className = "hero-message hero-message--success";
    } else {
      preview.innerHTML = `<div class="passport-bar"><span>Lookup boundary</span><small>No vehicle result shown</small></div><div class="lookup-unavailable"><div>${icon("evidence")}</div><small>Valid ${result.type}</small><h2>Live vehicle lookup is not connected</h2><p>We have not retrieved an identity or history for this registration. Continue with the authoritative public services instead.</p>${officialLinks.map(([label, url]) => `<a href="${url}">${label} ↗</a>`).join("")}</div>`;
      message.innerHTML = `<strong>Valid ${result.type}, but no vehicle data was retrieved.</strong> Use the official services shown alongside.`;
      message.className = "hero-message hero-message--info";
    }
  });

  root.querySelectorAll("[data-scroll-check]").forEach((button) => button.addEventListener("click", () => root.querySelector("#free-check").scrollIntoView({ behavior: "smooth" })));
  root.querySelectorAll("[data-plan]").forEach((button) => button.addEventListener("click", () => {
    prototypeOrder(button.dataset.plan);
    trackFunnelEvent(funnelEvents.PLAN_SELECTED, { route: window.location.pathname, planId: button.dataset.plan });
    const conversion = root.querySelector("#account");
    conversion.hidden = false;
    conversion.scrollIntoView({ behavior: "smooth", block: "center" });
  }));
  root.querySelector("#availability-button").addEventListener("click", () => {
    trackFunnelEvent(funnelEvents.AVAILABILITY_SELECTED, { route: window.location.pathname });
    const conversion = root.querySelector("#account");
    conversion.hidden = false;
    conversion.querySelector("#conversion-title").textContent = "Licensed history checks are not available yet";
    conversion.querySelector("#conversion-copy").textContent = "Finance, theft, write-off, salvage and valuation data requires a licensed provider. We will not accept payment or imply coverage before that integration exists.";
    conversion.scrollIntoView({ behavior: "smooth", block: "center" });
  });
}
