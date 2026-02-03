import { el } from "../lib/dom.js";

export async function renderDashboard(ctx) {
  const siteBase = `https://${ctx.cfg.sharepoint.hostname}${ctx.cfg.sharepoint.sitePath}`;

  return {
    title: "Command Center",
    subtitle: new Date().toLocaleDateString(undefined, {
      weekday: "long",
      month: "short",
      day: "numeric"
    }),

    actions: [
      {
        label: "New ARCHIEVE Record",
        variant: "primary",
        onClick: () => alert("ARCHIEVE create UI is next")
      },
      {
        label: "New SharePoint Page",
        onClick: () =>
          window.open(
            `${siteBase}/_layouts/15/CreatePage.aspx`,
            "_blank"
          )
      }
    ],

    content: el("div", { class: "grid" }, [

      card("Tasks", "0 commitments", "Live"),
      card("Pipeline", "0 active leads", "Live"),
      card("Projects", "0 active projects", "Live"),

      el("div", { class: "card card--wide" }, [
        el("h3", {}, ["Workspace"]),
        el("div", { class: "chiprow" }, [

          linkChip("Collaboration Home", `${siteBase}/SitePages/CollabHome.aspx`),

          linkChip("Site Pages", `${siteBase}/SitePages`),

          linkChip("Site Contents", `${siteBase}/_layouts/15/viewlsts.aspx`),

          linkChip("ARCHIEVE List", `${siteBase}/Lists/ARCHIEVE`),

          linkChip("Document Library", `${siteBase}/Shared%20Documents`)
        ])
      ])
    ])
  };
}

/* =========================
   helpers
   ========================= */

function card(title, metric, status) {
  return el("div", { class: "card" }, [
    el("h3", {}, [title]),
    el("div", { class: "metric" }, [metric]),
    el("span", { class: "pill pill--live" }, [status])
  ]);
}

function linkChip(label, href) {
  return el(
    "a",
    {
      class: "chip",
      href,
      target: "_blank",
      rel: "noreferrer"
    },
    [label]
  );
}
