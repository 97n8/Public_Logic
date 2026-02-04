import { el } from "../lib/dom.js";
import { setRoute } from "../lib/router.js";

const ICONS = {
  arrow: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,
  building: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/><path d="M9 9v.01"/><path d="M9 12v.01"/><path d="M9 15v.01"/><path d="M9 18v.01"/></svg>`,
  demo: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`
};

function environmentCard({ name, description, badge, badgeVariant, icon, features, onOpen }) {
  return el("div", {
    class: "env-card-large",
    role: "button",
    tabindex: 0,
    onclick: onOpen,
    onkeydown: (e) => e.key === "Enter" && onOpen()
  }, [
    el("div", { class: "env-card-large__header" }, [
      el("div", { class: "env-card-large__icon", html: icon }),
      badge && el("div", { class: `env-card-large__badge env-card-large__badge--${badgeVariant || "default"}` }, [badge])
    ]),
    el("div", { class: "env-card-large__body" }, [
      el("h3", { class: "env-card-large__name" }, [name]),
      el("p", { class: "env-card-large__desc" }, [description]),
      features && el("ul", { class: "env-card-large__features" }, 
        features.map(f => el("li", {}, [f]))
      )
    ]),
    el("div", { class: "env-card-large__footer" }, [
      el("span", {}, ["Launch Environment"]),
      el("span", { class: "env-card-large__arrow", html: ICONS.arrow })
    ])
  ]);
}

export async function renderEnvironments() {
  const content = el("div", { class: "environments" }, [
    el("div", { class: "environments__intro" }, [
      el("p", {}, ["Select an environment to launch. Each environment is a self-contained application with its own workflows and data."]),
    ]),

    el("div", { class: "environments__grid" }, [
      environmentCard({
        name: "Phillipston, MA",
        description: "Full public records management system for the Town of Phillipston. ARCHIEVE-backed with M.G.L. c.66 compliance.",
        badge: "Production",
        badgeVariant: "live",
        icon: ICONS.building,
        features: [
          "PRR intake and case management",
          "10-day deadline tracking",
          "SharePoint document storage",
          "Audit trail and compliance logging"
        ],
        onOpen: () => setRoute("/phillipston")
      }),

      environmentCard({
        name: "Logicville Demo",
        description: "Demonstration environment showcasing VAULT, ARCHIEVE, and law-embedded workflows.",
        badge: "Demo",
        badgeVariant: "demo",
        icon: ICONS.demo,
        features: [
          "Sample municipal data",
          "All modules enabled",
          "Safe to experiment"
        ],
        onOpen: () => window.open("https://www.publiclogic.org/demo", "_blank")
      })
    ])
  ]);

  return {
    title: "Environments",
    subtitle: "Launch a municipal operating environment",
    content
  };
}
