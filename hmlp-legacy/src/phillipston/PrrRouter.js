// PrrRouter.js
import { el, clear } from "../../lib/dom.js"; // adjust path if needed
import { CaseSpace } from "./pages/CaseSpace.js";
import { StaffIntake } from "./pages/StaffIntake.js";
import { ResidentPrr } from "./pages/ResidentPrr.js"; // your real resident form

export function PrrRouter({ cfg, auth, sp, mode = "staff" }) {
  const root = el("div", { class: "prr-router" });

  // Lock to resident view if forced
  let currentView = mode === "resident" ? "resident" : "space";

  // ====================
  //  NAV BAR (only shown in staff mode)
  // ====================
  const nav = el("nav", { class: "prr-nav" }, [
    el("button", {
      class: `prr-nav-btn ${currentView === "space" ? "active" : ""}`,
      onclick: () => { if (mode !== "resident") setView("space"); },
    }, ["Case Space"]),
    el("button", {
      class: `prr-nav-btn ${currentView === "intake" ? "active" : ""}`,
      onclick: () => { if (mode !== "resident") setView("intake"); },
    }, ["Staff Intake"])
  ]);

  // ====================
  //  MAIN CONTENT AREA
  // ====================
  const body = el("div", { class: "prr-body" });

  function setView(view) {
    currentView = view;
    render();
  }

  async function render() {
    clear(body);

    if (currentView === "resident") {
      // Show loading while resident form renders
      body.appendChild(el("div", { class: "card loading-placeholder" }, [
        el("div", { class: "spinner" }),
        el("p", { class: "muted" }, ["Loading resident-facing form…"])
      ]));

      // Render real resident PRR form
      const residentPage = await ResidentPrr({
        cfg,
        auth,
        sp,
        viewerMode: "resident",
        refresh: render
      });

      clear(body);

      // Add resident notice banner
      body.appendChild(el("div", { class: "resident-notice muted small" }, [
        "You are viewing the resident-facing Public Records Request form. ",
        "Submissions here are saved directly to ARCHIEVE."
      ]));

      // Mount resident content
      if (residentPage?.content) {
        body.appendChild(residentPage.content);
      } else if (residentPage instanceof Node) {
        body.appendChild(residentPage);
      } else {
        body.appendChild(el("div", { class: "error" }, [
          "Resident view renderer did not return valid content."
        ]));
      }

      return;
    }

    // Staff mode views
    if (currentView === "intake") {
      body.appendChild(StaffIntake({ cfg, auth, sp }));
    } else {
      body.appendChild(CaseSpace({ cfg, auth, sp }));
    }
  }

  // Mount structure
  if (mode !== "resident") {
    root.appendChild(nav);
  }
  root.appendChild(body);

  // Initial render
  render();

  return root;
}
