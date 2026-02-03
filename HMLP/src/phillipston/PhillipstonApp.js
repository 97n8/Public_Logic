import { PhillipstonShell } from "./PhillipstonShell.js";

export function PhillipstonApp({ cfg, auth, sp }) {
  // Hard internal gate (defense in depth)
  if (!auth?.hasRole?.("phillipston_internal")) {
    const denied = document.createElement("div");
    denied.style.padding = "2rem";

    const h2 = document.createElement("h2");
    h2.textContent = "Access denied";

    const p = document.createElement("p");
    p.textContent = "Phillipston internal access only.";

    denied.appendChild(h2);
    denied.appendChild(p);
    return denied;
  }

  return PhillipstonShell({ cfg, auth, sp });
}
