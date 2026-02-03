// pages/dashboard.js
import { el } from "../lib/dom.js";
import { openRecordConsole } from "../lib/record-console.js";

const SHAREPOINT_BASE = "https://publiclogic978.sharepoint.com/sites/PL";

function renderCard({ label, title, description }) {
  return el("div", { class: "card" }, [
    label && el("div", { class: "card__label" }, [label]),
    title && el("div", { class: "card__title" }, [title]),
    description && el("div", { class: "small" }, [description])
  ].filter(Boolean));
}

function formatDateHeading(date) {
  return date.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" });
}

export async function renderDashboard(ctx) {
  const actions = [
    { label: "New Record", variant: "primary", onClick: () => openRecordConsole(ctx) },
    { label: "New SharePoint Page", href: `${SHAREPOINT_BASE}/_layouts/15/CreatePage.aspx` },
    { label: "Open SharePoint", href: SHAREPOINT_BASE }
  ];

  const capabilities = [
    { label: "Record", description: "Capture factual, defensible records. These will route into ARCHIEVE." },
    { label: "Create", description: "Create SharePoint pages, lists, and artifacts without context switching." },
    { label: "Navigate", description: "Jump directly into the real operating system when you need full power." }
  ];

  const content = el("div", { class: "stack gap-lg" }, [
    renderCard({
      title: "Work Command Center",
      description: "This space is for creating, recording, and pushing work into SharePoint. Nothing here depends on existing lists."
    }),
    el("div", { class: "grid grid--3" }, capabilities.map(renderCard)),
    renderCard({
      title: "Today",
      description: "No required tasks. No guilt. Just context."
    })
  ]);

  return {
    title: "Command Center",
    subtitle: formatDateHeading(new Date()),
    actions: actions.map((a) => ({
      label: a.label,
      variant: a.variant,
      href: a.href,
      onClick: a.onClick
    })),
    content
  };
}
