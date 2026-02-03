// pages/environments.js
import { el } from "../lib/dom.js";

function environmentCard({ name, description, href, badge, internal = false }) {
  return el(internal ? "a" : "a", {
    class: "env-card",
    href,
    ...(internal ? {} : { target: "_blank", rel: "noreferrer" })
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

      // PHILLIPSTON — LIVE ENVIRONMENT (INTERNAL)
      environmentCard({
        name: "Phillipston, MA",
        badge: "Live",
        description:
          "Public Records Requests (PRR). Intake, CASE Space, and official records for the Town of Phillipston.",
        href: "#/phillipston-prr",
        internal: true
      }),

      // LOGICVILLE — DEMO (EXTERNAL)
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
