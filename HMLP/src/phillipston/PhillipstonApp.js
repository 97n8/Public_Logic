import { getSignedInEmail } from "../../lib/auth.js";
import { PhillipstonShell } from "./PhillipstonShell.js";

export function PhillipstonApp({ cfg, auth, sp }) {
  const account = auth?.getAccount?.();
  const email = getSignedInEmail(account)?.toLowerCase();

  const allowedEmails = [
    "nate@publiclogic.org",
    "allie@publiclogic.org"
  ];

  const hasAccess = allowedEmails.includes(email);

  if (!hasAccess) {
    const denied = document.createElement("div");
    denied.className = "card";
    denied.style.padding = "2rem";

    const h2 = document.createElement("h2");
    h2.textContent = "Access Denied";

    const p = document.createElement("p");
    p.textContent = `Phillipston internal access only. Signed in as: ${email || "(unknown)"}`;

    denied.appendChild(h2);
    denied.appendChild(p);
    return denied;
  }

  return PhillipstonShell({ cfg, auth, sp });
}
