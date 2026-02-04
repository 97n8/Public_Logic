import { el } from "../lib/dom.js";
import { setRoute } from "../lib/router.js";

function environmentCard({ name, description, badge, onOpen }) {
  return el("div", {
    class: "env-card",
    role: "button",
    tabindex: 0,
    onclick: onOpen,
    onkeydown: (e) => e.key === "Enter" && onOpen()
  }, [
    el("div", { class: "env-card__header" }, [
      el("div", { class: "env-card__name" }, [name]),
      badge && el("div", { class: "pill pill--mint" }, [badge])
    ]),
    el("div", { class: "env-card__description" }, [description]),
    el("div", { class: "env-card__footer" }, ["→"])
  ]);
}

export async function renderEnvironments() {
  const content = el("div", { class: "environments-container" }, [

    el("h2", { class: "section-title" }, ["Environments"]),

    el("div", { class: "env-grid" }, [

      // PHILLIPSTON — INTERNAL APP
      environmentCard({
        name: "Phillipston, MA",
        badge: "Live",
        description:
          "Staff PRR intake and case command center. ARCHIEVE-backed. SharePoint-authoritative.",
        onOpen: () => setRoute("/phillipston")
      }),

      // DEMO — external
      environmentCard({
        name: "Logicville",
        badge: "Demo",
        description:
          "Demonstration municipality for VAULT, ARCHIEVE, and law-embedded workflows.",
        onOpen: () =>
          window.open("https://www.publiclogic.org/demo", "_blank")
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
