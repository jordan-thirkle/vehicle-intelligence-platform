export function icon(name) {
  const paths = {
    car: '<path d="M3 11l2-5h14l2 5v7h-3v-2H6v2H3v-7Z"/><path d="M5 11h14M7 14h.01M17 14h.01"/>',
    engine: '<path d="M4 8h3l2-2h7l2 2h2v8h-3l-2 2H8l-2-2H4V8Z"/><path d="M9 6V3m4 3V3m-2 7v4"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7.1l2.2-2.2a4 4 0 0 0-5.7-5.6L11 7.5"/><path d="M14 10a4 4 0 0 0-5.7-.1l-2.2 2.2a4 4 0 0 0 5.7 5.6l1.2-1.2"/>',
    evidence: '<path d="M6 3h9l3 3v15H6V3Z"/><path d="M14 3v4h4M9 12h6m-6 4h6"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/>',
    pulse: '<path d="M3 12h4l2-5 4 10 2-5h6"/>',
    chevron: '<path d="m9 18 6-6-6-6"/>',
  };
  return `<svg aria-hidden="true" viewBox="0 0 24 24">${paths[name] ?? paths.evidence}</svg>`;
}
