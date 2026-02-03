// pages/environments.js
import { el } from "../lib/dom.js";

function environmentCard({ name, description, url, status = "active", type = "demo" }) {
  const statusColors = {
    active: "mint",
    development: "gold",
    maintenance: "rose",
    staging: "gold"
  };

  const statusVariant = statusColors[status.toLowerCase()] || "";

  return el("a", {
    class: "env-card",
    href: url,
    target: "_blank",
    rel: "noreferrer"
  }, [
    el("div", { class: "env-card__header" }, [
      el("div", { class: "env-card__name" }, [name]),
      el("div", { 
        class: `pill pill--${statusVariant}` 
      }, [status])
    ]),
    description && el("div", { class: "env-card__description" }, [description]),
    el("div", { class: "env-card__footer" }, [
      el("div", { class: "env-card__url" }, [
        new URL(url).hostname
      ]),
      el("div", { class: "env-card__arrow" }, ["→"])
    ])
  ]);
}

export async function renderEnvironments(ctx) {
  // Demo Environments
  const demoSection = el("div", { class: "env-section" }, [
    el("div", { class: "env-section__header" }, [
      el("h2", { class: "env-section__title" }, ["Demo Environments"]),
      el("p", { class: "env-section__description" }, [
        "Show towns what we built without breaking anything. Full access, zero consequences."
      ])
    ]),
    el("div", { class: "env-grid" }, [
      // Add your demo environments here
      environmentCard({
        name: "Westminster IT Demo",
        description: "Run through asset inventory and service desk without touching their real data",
        url: "https://demo-westminster.publiclogic.org",
        status: "Active",
        type: "demo"
      }),
      environmentCard({
        name: "Sutton IT Demo",
        description: "Walk them through the whole modernization play before they commit",
        url: "https://demo-sutton.publiclogic.org",
        status: "Active",
        type: "demo"
      }),
      environmentCard({
        name: "VAULT Framework Demo",
        description: "Show Select Boards how governance automation actually works",
        url: "https://vault-demo.publiclogic.org",
        status: "Development",
        type: "demo"
      }),
      environmentCard({
        name: "ARCHIEVE Demo",
        description: "Prove institutional memory survives turnover - they can click around and see it",
        url: "https://archieve-demo.publiclogic.org",
        status: "Staging",
        type: "demo"
      })
    ])
  ]);

  // Live Environments
  const liveSection = el("div", { class: "env-section" }, [
    el("div", { class: "env-section__header" }, [
      el("h2", { class: "env-section__title" }, ["Live Systems"]),
      el("p", { class: "env-section__description" }, [
        "Real towns, real operations. These keep Massachusetts municipalities running. Don't break them."
      ])
    ]),
    el("div", { class: "env-grid" }, [
      // Add your live environments here
      environmentCard({
        name: "HubbCONNECT",
        description: "Hubbardston's operations hub - what we built before PublicLogic was PublicLogic",
        url: "https://hub.hubbardston-ma.gov",
        status: "Active",
        type: "live"
      }),
      environmentCard({
        name: "Westminster Asset Portal",
        description: "Live inventory system tracking every laptop, switch, and printer they own",
        url: "https://assets.westminster-ma.gov",
        status: "Active",
        type: "live"
      }),
      environmentCard({
        name: "Sutton Service Desk",
        description: "Where Sutton staff actually submit tickets and track IT work",
        url: "https://helpdesk.sutton-ma.gov",
        status: "Development",
        type: "live"
      })
    ])
  ]);

  // Quick Add Instructions
  const instructions = el("div", { class: "card card--calm", style: "margin-top: 24px;" }, [
    el("h3", {}, ["Adding New Environments"]),
    el("div", { class: "small", style: "margin-top: 8px;" }, [
      "Just copy/paste a card in environments.js, change the name and URL, deploy. Takes 2 minutes."
    ]),
    el("div", { class: "hr" }),
    el("pre", { 
      style: "font-size: 12px; white-space: pre-wrap; margin: 12px 0 0; color: rgba(247,245,239,0.85);" 
    }, [
`environmentCard({
  name: "Gardner Asset System",
  description: "Whatever you built for them",
  url: "https://assets.gardner-ma.gov",
  status: "Active", // Active, Development, Staging, or Maintenance
  type: "live" // demo or live
})`
    ])
  ]);

  const content = el("div", { class: "environments-container" }, [
    demoSection,
    liveSection,
    instructions
  ]);

  return {
    title: "Client Systems",
    subtitle: "Quick launch demos and live town operations",
    actions: [],
    content
  };
}
