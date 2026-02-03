// pages/environments.js
import { el } from "../lib/dom.js";

function environmentCard({ name, description, onClick, href, badge }) {
  const cardProps = href
    ? {
        href,
        target: "_blank",
        rel: "noreferrer"
      }
    : {
        role: "button",
        tabindex: "0",
        onclick: onClick
      };

  const Tag = href ? "a" : "div";

  return el(Tag, {
    class: "env-card",
    ...cardProps
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

export async function renderEnvironments(ctx) {
  const content = el("div", { class: "environments-container" }, [

    el("h2", { class: "section-title" }, ["Environments"]),

    el("div", { class: "env-grid" }, [

      // PHILLIPSTON — INTERNAL ENVIRONMENT
      environmentCard({
        name: "Phillipston, MA",
        badge: "Live",
        description:
          "Public Records Request intake and ARCHIEVE-backed statutory tracking for the Town of Phillipston.",
        onClick: () => {
          location.hash = "#/phillipston-prr";
        }
      }),

      // LOGICVILLE — EXTERNAL DEMO
      environmentCard({
        name: "Logicville",
        badge: "Demo",
        description:
          "A safe, fictional municipality used to demonstrate VAULT, ARCHIEVE, and law-embedded workflows.",
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
