// pages/environments.js
import { el } from "../lib/dom.js";

export async function renderEnvironments() {
  const content = el("div", { class: "env-grid" }, [

    el("a", {
      class: "env-card",
      href: "#/phillipston-prr"
    }, [
      el("h3", {}, ["Phillipston, MA"]),
      el("p", {}, ["Live PRR case space, ARCHIEVE-backed"]),
      el("span", { class: "pill pill--mint" }, ["LIVE"])
    ]),

    el("a", {
      class: "env-card",
      href: "https://www.publiclogic.org/demo",
      target: "_blank"
    }, [
      el("h3", {}, ["Logicville"]),
      el("p", {}, ["Demo municipality (safe)"]),
      el("span", { class: "pill pill--gold" }, ["DEMO"])
    ])

  ]);

  return {
    title: "Environments",
    subtitle: "Operational systems",
    content
  };
}
