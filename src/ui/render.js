import { diagnosticFixture, evidenceById, referenceTimeline, referenceVehicle, sources } from "../data/referenceVehicle.js";
import { createDiagnosticObservation, diagnosticResults, rankHypotheses, recommendedTests } from "../domain/diagnosis.js";
import { evidenceSummary } from "../domain/evidence.js";
import { classifyIdentifier } from "../domain/lookup.js";
import { loadSession, saveSession } from "../domain/session.js";
import { createTimelineEvent, eventTypes, sortTimeline } from "../domain/timeline.js";
import { applyComponentVerifications, createComponentVerification } from "../domain/componentVerification.js";
import { createPassportExport } from "../domain/passportExport.js";
import { escapeHtml } from "../domain/text.js";
import { icon } from "./icons.js";

const verificationLabel = (verification) => `<span class="status ${verification === "OWNER OBSERVED" ? "status--observed" : "status--inferred"}"><span></span>${verification}</span>`;

export function renderApp(root) {
  const session = loadSession(window.localStorage);
  const observations = [...diagnosticFixture.observations, ...session.observations];
  const ranked = rankHypotheses(diagnosticFixture.hypotheses, observations);
  const tests = recommendedTests(ranked);
  const timeline = sortTimeline([...referenceTimeline, ...session.events]);
  const assertions = applyComponentVerifications(referenceVehicle.assertions, session.componentVerifications);
  const verifiedCount = assertions.filter((item) => item.verification === "OWNER OBSERVED").length;

  root.innerHTML = `
    <header class="topbar">
      <a class="brand" href="/free-car-check" aria-label="Vehicle Intelligence home"><span class="brand__mark">VI</span>Vehicle Intelligence</a>
      <form class="lookup" id="lookup-form" novalidate>
        <label class="sr-only" for="vehicle-id">Registration or VIN</label>
        <input id="vehicle-id" name="vehicle-id" value="FG11 YKC" autocomplete="off" spellcheck="false" />
        <button type="submit">${icon("search")} Look up</button>
      </form>
      <span class="fixture-label">Fixture-backed demo</span>
    </header>
    <div class="lookup-message" id="lookup-message" role="status" aria-live="polite"></div>
    <main id="main">
      <section class="vehicle-summary page-width" aria-labelledby="vehicle-title">
        <div class="vehicle-glyph">${icon("car")}</div>
        <div class="vehicle-heading">
          <p class="reference">Reference Vehicle #000001</p>
          <h1 id="vehicle-title">${referenceVehicle.title}</h1>
          <div class="identifiers"><span><small>Registration</small>${referenceVehicle.registration}</span><span><small>VIN</small>${referenceVehicle.vin}</span></div>
        </div>
        <dl class="vehicle-facts">${referenceVehicle.facts.map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join("")}</dl>
        <div class="official-links"><h2>Official checks</h2>${referenceVehicle.officialLinks.map(([label, url]) => `<a href="${url}" target="_blank" rel="noreferrer">${label}<span aria-hidden="true">↗</span></a>`).join("")}</div>
      </section>

      <div class="workspace page-width">
        <nav class="side-nav" aria-label="Vehicle passport sections">
          <a class="active" href="#passport">${icon("car")} Passport</a>
          <a href="#mechanical-dna">${icon("engine")} Mechanical DNA</a>
          <a href="#investigation">${icon("pulse")} Investigation</a>
          <a href="#timeline">${icon("evidence")} Ownership timeline</a>
          <a href="#evidence-log">${icon("evidence")} Evidence log</a>
          <button class="side-export" id="export-passport">${icon("evidence")} Export Passport</button>
          <div class="side-note"><strong>Evidence freshness</strong><span>Fixture checked</span><time datetime="2026-08-23">23 Aug 2026</time></div>
        </nav>

        <div class="content">
          <section class="panel mechanical" id="mechanical-dna" aria-labelledby="dna-title">
            <div class="section-heading"><div><p>Factory configuration ≠ current vehicle</p><h2 id="dna-title">Mechanical DNA</h2></div><span class="unknown-summary">${assertions.length - verifiedCount} inferred · ${verifiedCount} owner observed</span></div>
            <p class="section-intro">Candidate mappings remain separate from installed hardware until a label, marking or authoritative record verifies them.</p>
            <div class="assertion-list">${assertions.map((assertion) => `
              <button class="assertion-row" data-assertion="${assertion.id}">
                <span class="assertion-icon">${icon("engine")}</span>
                <span class="assertion-copy"><small>${assertion.label} · ${assertion.qualifier}</small><strong>${escapeHtml(assertion.value)}</strong></span>
                ${verificationLabel(assertion.verification)}
                <span class="view-evidence">View evidence ${icon("chevron")}</span>
              </button>`).join("")}</div>
            <button class="secondary add-evidence" id="open-component-dialog">Record a physical component identifier</button>
          </section>

          <aside class="panel provenance" id="evidence-panel" aria-live="polite">
            <div class="section-heading"><div><p>Provenance</p><h2>Why we believe this</h2></div></div>
            <div id="evidence-detail"><div class="empty-state">Select a Mechanical DNA assertion to inspect its evidence and verification state.</div></div>
          </aside>

          <section class="panel investigation" id="investigation" aria-labelledby="investigation-title">
            <div class="section-heading"><div><p>Active investigation</p><h2 id="investigation-title">${diagnosticFixture.title}</h2></div><span class="status status--unknown">UNKNOWN</span></div>
            <p class="section-intro">These are competing candidates, not confirmed faults. Ranking changes only when new evidence supports or contradicts them.</p>
            <ol class="hypotheses" id="hypothesis-list">${hypothesisRows(ranked)}</ol>
            <div class="diagnostic-rule">${icon("evidence")} The available evidence does not establish turbo failure.</div>
          </section>

          <section class="panel next-tests" aria-labelledby="tests-title">
            <div class="section-heading"><div><p>Reduce uncertainty</p><h2 id="tests-title">Next recommended evidence</h2></div></div>
            <div class="test-list">${tests.map((test, index) => `
              <article class="test"><span class="test-number">${index + 1}</span><div><h3>${test.title}</h3><p>${test.why}</p><span>${test.value} · ${test.effort}</span></div><button class="secondary" data-test="${test.id}">Record result</button></article>`).join("")}</div>
          </section>

          <section class="panel evidence-log" id="evidence-log" aria-labelledby="evidence-log-title">
            <div class="section-heading"><div><p>Diagnostic session</p><h2 id="evidence-log-title">Evidence log</h2></div><div class="log-actions"><span id="evidence-count">${observations.length} observations</span>${session.observations.length ? '<button class="text-button" id="clear-session">Clear session</button>' : ""}</div></div>
            <ul id="observation-list">${observations.map(observationRow).join("")}</ul>
          </section>

          <section class="panel timeline" id="timeline" aria-labelledby="timeline-title">
            <div class="section-heading"><div><p>Permanent vehicle record</p><h2 id="timeline-title">Ownership timeline</h2></div><div class="timeline-actions"><span>${timeline.length} events</span>${session.events.length ? '<button class="text-button" id="clear-owner-events">Clear owner entries</button>' : ""}<button class="primary" id="open-event-dialog">Record work or event</button></div></div>
            <p class="section-intro">Keep repairs, maintenance and inspections with the vehicle. Every entry states who supplied it and how strongly it has been verified.</p>
            <ol class="timeline-list">${timeline.map(timelineRow).join("")}</ol>
            <div class="timeline-boundary"><strong>Evidence boundary</strong><span>Owner-entered work is useful history, but it is not invoice-backed or garage-verified until supporting evidence is attached and checked.</span></div>
          </section>
        </div>
      </div>
    </main>

    <dialog id="evidence-dialog">
      <form method="dialog" id="evidence-form">
        <div class="dialog-heading"><div><p>Diagnostic session</p><h2>Record a result</h2></div><button class="icon-button" value="cancel" formnovalidate aria-label="Close">×</button></div>
        <label>Result<select name="result">${Object.entries(diagnosticResults).map(([id, result]) => `<option value="${id}">${result.label}</option>`).join("")}</select></label>
        <label>Optional note<textarea name="observation" placeholder="Add the DTC, location, measurement or inspection detail…"></textarea></label>
        <p class="privacy-note">Results stay on this device and update the ranking transparently. “No DTCs” reduces some paths slightly; it never resolves them as CLEAR.</p>
        <div class="dialog-actions"><button class="secondary" value="cancel" formnovalidate>Cancel</button><button class="primary" value="default">Add evidence</button></div>
      </form>
    </dialog>

    <dialog id="event-dialog">
      <form method="dialog" id="event-form">
        <div class="dialog-heading"><div><p>Permanent vehicle record</p><h2>Record work or event</h2></div><button class="icon-button" value="cancel" formnovalidate aria-label="Close">×</button></div>
        <div class="form-grid">
          <label>Type<select name="type">${Object.entries(eventTypes).map(([id, label]) => `<option value="${id}">${label}</option>`).join("")}</select></label>
          <label>Date<input name="occurredOn" type="date" /></label>
          <label>Mileage<input name="mileage" type="number" min="0" step="1" inputmode="numeric" placeholder="Optional" /></label>
        </div>
        <label>What was done?<input name="description" required maxlength="140" placeholder="For example: battery replaced" /></label>
        <label>Notes<textarea name="note" placeholder="Part, garage, reason, outcome or anything useful later…"></textarea></label>
        <p class="privacy-note">This entry will be labelled OWNER ENTERED and UNVERIFIED. Receipt upload and garage verification are not connected yet.</p>
        <div class="dialog-actions"><button class="secondary" value="cancel" formnovalidate>Cancel</button><button class="primary" value="default">Add to timeline</button></div>
      </form>
    </dialog>

    <dialog id="component-dialog">
      <form method="dialog" id="component-form">
        <div class="dialog-heading"><div><p>Mechanical DNA</p><h2>Record installed component</h2></div><button class="icon-button" value="cancel" formnovalidate aria-label="Close">×</button></div>
        <label>Component<select name="assertionId">${referenceVehicle.assertions.map((item) => `<option value="${item.id}">${item.label}</option>`).join("")}</select></label>
        <label>Installed component or family<input name="installedValue" required maxlength="100" placeholder="Read from the physical component" /></label>
        <label>Physical identifier<input name="physicalIdentifier" required maxlength="100" placeholder="Label, casting, serial or part number" /></label>
        <label>Optional note<textarea name="note" maxlength="500" placeholder="Where the identifier was found or how it was read…"></textarea></label>
        <p class="privacy-note">This supersedes the candidate value as OWNER OBSERVED, not garage or manufacturer verified. Do not enter an identifier you have not physically checked.</p>
        <div class="dialog-actions"><button class="secondary" value="cancel" formnovalidate>Cancel</button><button class="primary" value="default">Save component evidence</button></div>
      </form>
    </dialog>

    <dialog id="export-dialog">
      <form method="dialog">
        <div class="dialog-heading"><div><p>Portable record</p><h2>Export Vehicle Passport</h2></div><button class="icon-button" value="cancel" aria-label="Close">×</button></div>
        <p>Your JSON export contains the vehicle identity, Mechanical DNA, diagnostic observations, timeline and evidence boundaries currently stored on this device.</p>
        <p class="privacy-note">The file includes the registration and VIN shown in this Passport. Store and share it deliberately.</p>
        <div class="dialog-actions"><button class="secondary" value="cancel">Cancel</button><a class="primary export-link" id="export-download" download="FG11-YKC-vehicle-passport.json">Download Passport JSON</a></div>
      </form>
    </dialog>`;

  bindInteractions(root, session);
}

function bindInteractions(root, session) {
  const form = root.querySelector("#lookup-form");
  const message = root.querySelector("#lookup-message");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const result = classifyIdentifier(new FormData(form).get("vehicle-id"));
    if (!result.valid) {
      message.textContent = result.message;
      message.className = "lookup-message lookup-message--error";
      return;
    }
    const matches = [referenceVehicle.registration, referenceVehicle.vin].some((value) => value.replace(/\s/g, "") === result.normalized);
    message.textContent = matches ? `${result.type} matched Reference Vehicle #000001.` : `No fixture is available for this valid ${result.type}. Live provider lookup is not connected yet.`;
    message.className = `lookup-message ${matches ? "lookup-message--success" : "lookup-message--info"}`;
  });

  root.querySelectorAll("[data-assertion]").forEach((button) => button.addEventListener("click", () => showEvidence(root, button.dataset.assertion)));
  const componentDialog = root.querySelector("#component-dialog");
  root.querySelector("#open-component-dialog").addEventListener("click", () => componentDialog.showModal());
  root.querySelector("#component-form").addEventListener("submit", (event) => {
    if (event.submitter?.value === "cancel") return;
    event.preventDefault();
    session.componentVerifications.push(createComponentVerification(Object.fromEntries(new FormData(event.currentTarget).entries())));
    saveSession(window.localStorage, session);
    componentDialog.close();
    renderApp(root);
    root.querySelector("#mechanical-dna").scrollIntoView({ behavior: "smooth", block: "start" });
  });
  const exportDialog = root.querySelector("#export-dialog");
  const exportDownload = root.querySelector("#export-download");
  let exportUrl;
  root.querySelector("#export-passport").addEventListener("click", () => {
    const assertions = applyComponentVerifications(referenceVehicle.assertions, session.componentVerifications);
    const passport = createPassportExport({ vehicle: referenceVehicle, assertions, observations: [...diagnosticFixture.observations, ...session.observations], events: sortTimeline([...referenceTimeline, ...session.events]), componentVerifications: session.componentVerifications });
    if (exportUrl) URL.revokeObjectURL(exportUrl);
    exportUrl = URL.createObjectURL(new Blob([`${JSON.stringify(passport, null, 2)}\n`], { type: "application/json" }));
    exportDownload.href = exportUrl;
    exportDialog.showModal();
  });
  exportDialog.addEventListener("close", () => {
    if (exportUrl) URL.revokeObjectURL(exportUrl);
    exportUrl = undefined;
    exportDownload.removeAttribute("href");
  });
  const dialog = root.querySelector("#evidence-dialog");
  root.querySelectorAll("[data-test]").forEach((button) => button.addEventListener("click", () => dialog.showModal()));
  root.querySelector("#evidence-form").addEventListener("submit", (event) => {
    const submitter = event.submitter;
    if (submitter?.value === "cancel") return;
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const observation = createDiagnosticObservation(data.get("result"), data.get("observation"));
    session.observations.push(observation);
    saveSession(window.localStorage, session);
    event.currentTarget.reset();
    dialog.close();
    renderApp(root);
  });
  root.querySelector("#clear-session")?.addEventListener("click", () => {
    if (!window.confirm("Remove all diagnostic results recorded in this session?")) return;
    session.observations = [];
    saveSession(window.localStorage, session);
    renderApp(root);
  });

  const eventDialog = root.querySelector("#event-dialog");
  root.querySelector("#open-event-dialog").addEventListener("click", () => eventDialog.showModal());
  root.querySelector("#clear-owner-events")?.addEventListener("click", () => {
    if (!window.confirm("Remove all owner-entered timeline events from this device?")) return;
    session.events = [];
    saveSession(window.localStorage, session);
    renderApp(root);
  });
  root.querySelector("#event-form").addEventListener("submit", (event) => {
    if (event.submitter?.value === "cancel") return;
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const timelineEvent = createTimelineEvent(Object.fromEntries(data.entries()));
    session.events.push(timelineEvent);
    saveSession(window.localStorage, session);
    event.currentTarget.reset();
    eventDialog.close();
    renderApp(root);
    root.querySelector("#timeline").scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function hypothesisRows(ranked) {
  return ranked.map((hypothesis, index) => {
    const movement = hypothesis.score - hypothesis.baseScore;
    const movementText = movement > 0 ? `+${movement}` : `${movement}`;
    return `<li><span class="rank">${index + 1}</span><span class="hypothesis-copy"><strong>${hypothesis.label}</strong><small>${hypothesis.detail}</small></span><span class="likelihood"><i style="--score:${Math.max(0.5, Math.min(hypothesis.score, 10))}"></i>${hypothesis.score >= 5 ? "High" : hypothesis.score >= 3 ? "Medium" : "Lower / unknown"}${movement ? `<b class="movement ${movement > 0 ? "movement--up" : "movement--down"}">${movementText} from evidence</b>` : ""}</span></li>`;
  }).join("");
}

function observationRow(item) {
  const detail = item.explanation || "User-supplied fixture observation";
  return `<li>${icon("evidence")}<span><strong>${item.label}</strong>${item.note ? `<em>${escapeHtml(item.note)}</em>` : ""}<small>${detail}</small></span></li>`;
}

function timelineRow(event) {
  const date = event.occurredOn
    ? new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${event.occurredOn}T12:00:00`))
    : "Date not supplied";
  const levelClass = event.verification === "CORROBORATED" ? "timeline-level--strong" : event.verification === "INFERRED" ? "timeline-level--inferred" : "";
  return `<li class="timeline-item">
    <span class="timeline-marker"></span>
    <div class="timeline-date"><time${event.occurredOn ? ` datetime="${event.occurredOn}"` : ""}>${date}</time>${event.mileage != null ? `<small>${event.mileage.toLocaleString("en-GB")} miles</small>` : ""}</div>
    <div class="timeline-copy"><small>${event.label}</small><strong>${escapeHtml(event.description)}</strong>${event.note ? `<p>${escapeHtml(event.note)}</p>` : ""}</div>
    <div class="timeline-proof"><span class="timeline-level ${levelClass}">${event.evidenceLevel.replaceAll("_", " ")}</span><small>${event.verification.replaceAll("_", " ")}</small></div>
  </li>`;
}

function showEvidence(root, assertionId) {
  const session = loadSession(window.localStorage);
  const assertion = applyComponentVerifications(referenceVehicle.assertions, session.componentVerifications).find((item) => item.id === assertionId);
  const evidence = evidenceSummary(assertion, evidenceById);
  const detail = root.querySelector("#evidence-detail");
  detail.innerHTML = `
    <div class="selected-assertion"><small>${assertion.label} · ${assertion.qualifier}</small><h3>${escapeHtml(assertion.value)}</h3>${verificationLabel(assertion.verification)}</div>
    <div class="warning"><strong>${assertion.verification === "OWNER OBSERVED" ? "Owner-observed physical identifier" : "Inference only"}</strong><span>${assertion.physicalIdentifier ? `Identifier: ${escapeHtml(assertion.physicalIdentifier)}. This is not yet garage or manufacturer verified.` : "Confirm using a physical identifier or an appropriate authoritative record."}</span></div>
    ${evidence.map((item) => {
      const source = Object.values(sources).find((candidate) => candidate.id === item.sourceId);
      return `<dl class="evidence-record"><div><dt>Source</dt><dd>${source.name}</dd></div><div><dt>Licence</dt><dd>${source.licenceClass}</dd></div><div><dt>Observation</dt><dd>${item.predicate}: ${item.value}</dd></div><div><dt>Verification</dt><dd>${item.verification}</dd></div></dl><p class="source-note">${source.note}</p>`;
    }).join("")}`;
  root.querySelector("#evidence-panel").scrollIntoView({ behavior: "smooth", block: "nearest" });
}
