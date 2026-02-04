import { el, clear } from "../../lib/dom.js";
import { getSignedInEmail } from "../../lib/auth.js";
import { setRoute } from "../../lib/router.js";
import { CaseSpace } from "./pages/CaseSpace.js";
import { StaffIntake } from "./pages/StaffIntake.js";

const ICONS = {
  back: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>`,
  home: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  inbox: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>`,
  folder: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`,
  settings: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`
};

export async function renderPhillipstonApp({ cfg, auth, sp, userEmail }) {
  const account = auth?.getAccount?.();
  const email = getSignedInEmail(account)?.toLowerCase();

  const allowedEmails = ["nate@publiclogic.org", "allie@publiclogic.org"];

  if (!allowedEmails.includes(email)) {
    return el("div", { class: "phillipston-denied" }, [
      el("div", { class: "phillipston-denied__content" }, [
        el("h1", {}, ["Access Denied"]),
        el("p", {}, [`Phillipston environment requires authorization. Signed in as: ${email || "(unknown)"}`]),
        el("button", { class: "btn btn--primary", onclick: () => setRoute("/environments") }, ["← Back to Environments"])
      ])
    ]);
  }

  let currentView = "dashboard";
  const contentArea = el("div", { class: "phillipston-content" });

  function renderView(view) {
    currentView = view;
    clear(contentArea);
    
    // Update nav active state
    nav.querySelectorAll("a").forEach(a => {
      a.dataset.view === view
        ? a.classList.add("active")
        : a.classList.remove("active");
    });

    if (view === "dashboard") {
      contentArea.appendChild(CaseSpace({ cfg, auth, sp }));
    } else if (view === "intake") {
      contentArea.appendChild(StaffIntake({ cfg, auth, sp }));
    }
  }

  const nav = el("nav", { class: "phillipston-nav" }, [
    el("a", { 
      href: "#", 
      class: "phillipston-nav__item active",
      html: `${ICONS.home}<span>Dashboard</span>`,
      onclick: (e) => { e.preventDefault(); renderView("dashboard"); }
    }),
    el("a", { 
      href: "#", 
      class: "phillipston-nav__item",
      html: `${ICONS.inbox}<span>Staff Intake</span>`,
      onclick: (e) => { e.preventDefault(); renderView("intake"); }
    }),
    el("a", { 
      href: "https://publiclogic978.sharepoint.com/sites/PL/Shared%20Documents/01_Towns/MA/Phillipston/PRR",
      target: "_blank",
      class: "phillipston-nav__item",
      html: `${ICONS.folder}<span>PRR Folder</span>`
    })
  ]);
  nav.querySelector("a").dataset.view = "dashboard";
  nav.querySelectorAll("a")[1].dataset.view = "intake";

  const header = el("header", { class: "phillipston-header" }, [
    el("div", { class: "phillipston-header__left" }, [
      el("button", { 
        class: "phillipston-header__back",
        onclick: () => setRoute("/environments"),
        html: ICONS.back
      }),
      el("div", { class: "phillipston-header__brand" }, [
        el("div", { class: "phillipston-header__logo" }, ["P"]),
        el("div", { class: "phillipston-header__title" }, [
          el("h1", {}, ["Phillipston"]),
          el("span", {}, ["Public Records Management"])
        ])
      ])
    ]),
    el("div", { class: "phillipston-header__right" }, [
      el("div", { class: "phillipston-header__status" }, [
        el("span", { class: "phillipston-header__status-dot" }),
        el("span", {}, ["System Active"])
      ]),
      el("div", { class: "phillipston-header__user" }, [email?.split("@")[0] || "User"])
    ])
  ]);

  const sidebar = el("aside", { class: "phillipston-sidebar" }, [
    nav,
    el("div", { class: "phillipston-sidebar__footer" }, [
      el("div", { class: "phillipston-sidebar__info" }, [
        el("span", {}, ["Phillipston, MA"]),
        el("span", {}, ["M.G.L. c.66 Compliant"])
      ])
    ])
  ]);

  const main = el("main", { class: "phillipston-main" }, [
    contentArea
  ]);

  const app = el("div", { class: "phillipston-app" }, [
    header,
    el("div", { class: "phillipston-body" }, [
      sidebar,
      main
    ])
  ]);

  renderView("dashboard");

  return app;
}
