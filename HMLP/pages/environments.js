// pages/environments.js
import { el } from "../lib/dom.js";
import { setRoute } from "../lib/router.js";

/**
 * Environment card
 * - Internal environments use setRoute()
 * - External environments open in a new tab
 */
function environmentCard({ name, description, badge, route, href }) {
  const isInternal = Boolean(route);

  return el(
    isInternal ? "div" : "a",
    {
      class: "env-card",
      ...(isInternal
        ? {
            role: "button",
            tabIndex: 0,
            onclick: () => setRoute(route),
            onkeydown: (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setRoute(route);
              }
            }
          }
        : {
            href,
            target: "_blank",
            rel: "noreferrer"
          })
    },
    [
      el("div", { class: "env-card__header" }, [
        el("div", { class: "env-card__name" }, [name]),
        badge && el("div", { class: "pill pill--mint" }, [badge])
      ]),
      el("div", { class: "env-card__description" }, [description]),
      el("div", { class: "env-card__footer" }, [
        el("div", { class: "env-card__arrow" }, ["→"])
      ])
    ]
  );
}

export async function renderEnvironments() {
  const content = el("div", { class: "environments-container" }, [

    el("h2", { class: "section-title" }, ["Environments"]),

    el("div", { class: "env-grid" }, [

      // ============================
      // PHILLIPSTON — LIVE ENVIRONMENT
      // ============================
      environmentCard({
        name: "Phillipston, MA",
        badge: "Live",
        description:
          "Public Records Requests (PRR). Public intake, CASE Space, and official records for the Town of Phillipston.",
        route: "/phillipston-prr"
      }),

      // ============================
      // LOGICVILLE — DEMO ENVIRONMENT
      // ============================
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
