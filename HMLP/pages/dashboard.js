// pages/dashboard.js — FINAL (Shell-compliant)

import { el } from "../lib/dom.js";
import { openRecordConsole } from "../lib/record-console.js";
import { getConfig, getLinks } from "../lib/config.js";

function statCard(label,value){
  return el("div",{class:"stat-card"},[
    el("div",{class:"stat-card__label"},[label]),
    el("div",{class:"stat-card__value"},[value])
  ]);
}

export async function renderDashboard(ctx){
  const cfg = getConfig();
  const links = getLinks(cfg);

  const hero = el("div",{class:"dashboard-hero"},[
    el("p",{class:"dashboard-hero__lede"},[
      "Municipal consulting powered by institutional memory. Record decisions, launch work, and keep Massachusetts towns running."
    ]),
    el("div",{class:"dashboard-hero__stats"},[
      statCard("Active Commitments","0"),
      statCard("Municipal Pipeline","0"),
      statCard("Live Engagements","0")
    ])
  ]);

  const content = el("div",{class:"dashboard-container"},[
    hero,
    el("div",{},[
      el("h2",{class:"section-title"},["Capture & Create"]),
      el("div",{class:"card",onclick:()=>openRecordConsole(ctx)},[
        "Record Decision"
      ])
    ])
  ]);

  return {
    title: "PublicLogic Operations",
    subtitle: new Date().toLocaleDateString("en-US",{weekday:"long",month:"short",day:"numeric",year:"numeric"}),
    content
  };
}
