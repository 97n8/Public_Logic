// PhillipstonApp.js
// Public entrypoint / export for the entire Phillipston MA Public Records environment
// Import this file anywhere you want to mount the Phillipston CaseSpace + PRR form

export { PhillipstonShell } from "./PhillipstonShell.js";

// Optional: named export for the resident-facing PRR form (if someone wants to embed just the form)
export { renderPhillipstonPrr } from "./pages/phillipston-prr.js";

// Optional: convenience default export (most common usage)
export default function PhillipstonApp(ctx = {}) {
  return PhillipstonShell(ctx);
}
