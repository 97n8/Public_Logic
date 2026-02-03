// pages/environments.js
import { el } from "../lib/dom.js";

function environmentCard({ name, description, href, badge }) {
  return el("a", {
    class: "env-card",
    href,
    target: "_blank",
    rel: "noreferrer"
  }, [
    el("div", { class: "env-card__header" }, [
      el("div", { class: "env-card__name" }, [name]),
      badge && el("div", { class: "pill pill--mint" }, [badge])
    ]),
    el("div", { class: "env-card__description" }, [description]),
    el("div", { class: "env-card__footer" }, [
      el("div", { class: "env-card__arrow" }, ["→"])
    ])
  ]);
}

export async function renderEnvironments() {
  const content = el("div", { class: "environments-container" }, [

    el("h2", { class: "section-title" }, ["Environments"]),

    el("div", { class: "env-grid" }, [

      // PHILLIPSTON — LIVE PRR FILE SYSTEM
      environmentCard({
        name: "Phillipston, MA",
        badge: "Live",
        description:
          "Public Records Requests (PRR). Official working folder for intake, response artifacts, and ARCHIEVE-backed records.",
        href:
          "https://publiclogic978.sharepoint.com/sites/PL/Shared%20Documents/01_Towns/MA/Phillipston/PRR"
      }),

      // LOGICVILLE — SAFE DEMO
      environmentCard({
        name: "Logicville",
        badge: "Demo",
        description:
          "Fictional municipality used to demonstrate VAULT, ARCHIEVE, and law-embedded workflows.",
        href: "https://www.publiclogic.org/demo"
      })

    ])
  ]);

  return {
    title: "Environments",
    subtitle: "Select an operating environment",
    actions: [],
    content
  };
}
