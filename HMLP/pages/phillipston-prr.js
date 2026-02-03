// pages/phillipston-prr.js
import { el } from "../lib/dom.js";

export async function renderPhillipstonPrr(ctx) {
  const ARCHIVE_URL = ctx.cfg.sharepoint.archieve.listUrl;
  const FOLDER_URL =
    "https://publiclogic978.sharepoint.com/sites/PL/Shared%20Documents/01_Towns/MA/Phillipston/PRR";

  const content = el("div", { class: "grid" }, [

    el("div", { style: "grid-column: span 8" }, [
      el("h2", {}, ["Phillipston PRR — Case Space"]),
      el("p", { class: "muted" }, [
        "Authoritative records workspace. Intake occurs via public portal."
      ]),
      el("a", { href: ARCHIVE_URL, class: "btn btn--primary", target: "_blank" },
        ["Open ARCHIEVE List"]
      )
    ]),

    el("div", { style: "grid-column: span 4" }, [
      el("a", { href: FOLDER_URL, class: "navlink", target: "_blank" },
        ["📁 PRR Document Library"]
      ),
      el("a", { href: "https://www.publiclogic.org/demo", class: "navlink", target: "_blank" },
        ["📘 Training & SOPs"]
      )
    ])

  ]);

  return {
    title: "Phillipston PRR",
    subtitle: "Staff case management",
    content
  };
}
