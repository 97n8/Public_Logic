// PhillipstonShell.js
// Primary CaseSpace container for Phillipston MA
// Allows staff to toggle between internal view and real resident-facing PRR form

import { el, clear } from "../../lib/dom.js";
import { renderPhillipstonPrr } from "../../pages/phillipston-prr.js";

export function PhillipstonShell(ctx) {
  const root = el("div", { class: "phillipston-shell" });

  let residentView = false;

  function toggleResidentView() {
    residentView = !residentView;
    render();
  }

  function ViewToggle() {
    return el("div", { class: "view-toggle stack gap-sm" }, [
      el("div", { class: "view-toggle__status muted small" }, [
        residentView ? "Resident view (real submissions)" : "Staff/internal view"
      ]),
      el(
        "button",
        {
          class: "btn btn--primary",
          onclick: toggleResidentView
        },
        [residentView ? "Exit resident view" : "View as resident"]
      )
    ]);
  }

  function StaffCaseSpace() {
    return el("div", { class: "card staff-view" }, [
      el("h2", {}, ["Phillipston CaseSpace"]),
      el("p", { class: "muted" }, [
        "Internal workspace for Phillipston public records requests."
      ]),
      el("div", { class: "notice" }, [
        "Staff tools, internal notes, workflows, and records live here."
      ])
    ]);
  }

  async function ResidentExperience() {
    // Show loading immediately
    const loading = el("div", { class: "card loading-placeholder" }, [
      el("div", { class: "spinner" }),
      el("p", { class: "muted" }, ["Loading resident-facing form…"])
    ]);

    // Temporarily append loading to root
    clear(root);
    root.appendChild(ViewToggle());
    root.appendChild(loading);

    try {
      const page = await renderPhillipstonPrr({
        ...ctx,
        viewerMode: "resident",   // Force public/resident mode
        refresh: render
      });

      // Build final resident content
      const notice = el("div", { class: "resident-frame__notice muted small" }, [
        "You are viewing the resident-facing Public Records Request form. ",
        "Submissions here are saved directly to ARCHIEVE."
      ]);

      const wrap = el("div", { class: "resident-experience stack gap-md" }, [
        notice,
        el("div", { class: "stack gap-sm" }, [
          el("h2", {}, [page?.title || "Public Records Request"]),
          page?.subtitle && el("p", { class: "muted" }, [page.subtitle])
        ]),
        page?.content || el("div", { class: "card error" }, [
          "Resident form did not return content."
        ])
      ]);

      // Replace loading with real content
      clear(root);
      root.appendChild(ViewToggle());
      root.appendChild(wrap);
    } catch (err) {
      console.error("Failed to render resident PRR:", err);

      // Show error
      clear(root);
      root.appendChild(ViewToggle());
      root.appendChild(el("div", { class: "card error" }, [
        el("h3", {}, ["Failed to load resident form"]),
        el("p", { class: "muted" }, [err.message || String(err)])
      ]));
    }
  }

  async function render() {
    clear(root);
    root.appendChild(ViewToggle());

    if (residentView) {
      await ResidentExperience();
    } else {
      root.appendChild(StaffCaseSpace());
    }
  }

  // Initial render
  render();

  return root;
}
