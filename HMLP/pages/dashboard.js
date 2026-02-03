import { el } from "../lib/dom.js";
import { openRecordConsole } from "../lib/record-console.js";

export async function renderDashboard(ctx) {
  const actions = [
    {
      label: "New Record",
      variant: "primary",
      onClick: () => openRecordConsole(ctx)
    },
    {
      label: "New SharePoint Page",
      onClick: () => {
        window.open(
          "https://publiclogic978.sharepoint.com/sites/PL/_layouts/15/CreatePage.aspx",
          "_blank"
        );
      }
    },
    {
      label: "Open SharePoint",
      onClick: () => {
        window.open(
          "https://publiclogic978.sharepoint.com/sites/PL",
          "_blank"
        );
      }
    }
  ];

  const content = el("div", { class: "stack gap-lg" }, [

    el("div", { class: "card" }, [
      el("div", { class: "card__title" }, ["Work Command Center"]),
      el("div", { class: "small" }, [
        "This space is for creating, recording, and pushing work into SharePoint. ",
        "Nothing here depends on existing lists."
      ])
    ]),

    el("div", { class: "grid grid--3" }, [

      el("div", { class: "card" }, [
        el("div", { class: "card__label" }, ["Record"]),
        el("div", {}, [
          "Capture factual, defensible records. ",
          "These will route into ARCHIEVE."
        ])
      ]),

      el("div", { class: "card" }, [
        el("div", { class: "card__label" }, ["Create"]),
        el("div", {}, [
          "Create SharePoint pages, lists, and artifacts ",
          "without context switching."
        ])
      ]),

      el("div", { class: "card" }, [
        el("div", { class: "card__label" }, ["Navigate"]),
        el("div", {}, [
          "Jump directly into the real operating system ",
          "when you need full power."
        ])
      ])

    ]),

    el("div", { class: "card" }, [
      el("div", { class: "card__title" }, ["Today"]),
      el("div", { class: "small" }, [
        "No required tasks. No guilt. Just context."
      ])
    ])

  ]);

  return {
    title: "Command Center",
    subtitle: new Date().toLocaleDateString(undefined, {
      weekday: "long",
      month: "short",
      day: "numeric"
    }),
    actions,
    content
  };
}
