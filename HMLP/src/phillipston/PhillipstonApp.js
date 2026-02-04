import { el, clear } from "../../lib/dom.js";

/*
  PhillipstonShell

  Purpose:
  - Primary CaseSpace container for Phillipston
  - Allows staff to toggle between:
    - Staff CaseSpace view
    - Resident-facing PRR view (iframe)

  Notes:
  - Resident view is the real public experience
  - No permissions or access logic lives here
  - Toggle is local to this CaseSpace only
*/

export function PhillipstonShell({ cfg, auth, sp, viewer }) {
  const root = el("div", { class: "phillipston-shell" });
  let residentView = false;

  function toggleResidentView() {
    residentView = !residentView;
    render();
  }

  function ViewToggle() {
    return el("div", { class: "view-toggle" }, [
      el("div", { class: "view-toggle__status muted small" }, [
        residentView ? "Resident view" : "Staff view"
      ]),
      el(
        "button",
        {
          class: "btn btn-secondary",
          onclick: toggleResidentView
        },
        [residentView ? "Exit resident view" : "View as resident"]
      )
    ]);
  }

  function StaffCaseSpace() {
    return el("div", { class: "casespace staff-view" }, [
      el("h2", {}, ["Phillipston CaseSpace"]),
      el("p", { class: "muted" }, [
        "Internal workspace for Phillipston public records requests."
      ]),

      // Placeholder for your existing CaseSpace content
      el("div", { class: "card" }, [
        el("p", {}, [
          "Staff tools, internal notes, workflows, and records live here."
        ])
      ])
    ]);
  }

  function ResidentFrame() {
    return el("div", { class: "resident-frame" }, [
      el("div", { class: "resident-frame__notice muted small" }, [
        "You are viewing the resident-facing Public Records Request form. Submissions here are real."
      ]),
      el("iframe", {
        src: "https://phillipstonma.gov/public-records-request",
        title: "Phillipston Public Records Request",
        loading: "lazy",
        referrerpolicy: "no-referrer",
        sandbox: "allow-forms allow-scripts allow-same-origin"
      })
    ]);
  }

  function render() {
    clear(root);

    root.appendChild(ViewToggle());

    if (residentView) {
      root.appendChild(ResidentFrame());
    } else {
      root.appendChild(StaffCaseSpace());
    }
  }

  render();
  return root;
}
