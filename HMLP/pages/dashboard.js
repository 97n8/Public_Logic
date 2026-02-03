// pages/dashboard.js
import { el } from "../lib/dom.js";
import { openRecordConsole } from "../lib/record-console.js";

const SHAREPOINT_BASE = "https://publiclogic978.sharepoint.com/sites/PL";

function renderCard({ label, title, description, children, variant = "" }) {
  const classes = ["card"];
  if (variant) classes.push(`card--${variant}`);

  return el(
    "div",
    { class: classes.join(" ") },
    [
      label && el("div", { class: "card__label" }, [label]),
      title && el("div", { class: "card__title" }, [title]),
      description && el("div", { class: "card__description small" }, [description]),
      ...(children || []),
    ].filter(Boolean)
  );
}

function formatDateHeading(date) {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export async function renderDashboard(ctx) {
  const actions = [
    {
      label: "New Record",
      variant: "primary",
      action: () => openRecordConsole(ctx),
    },
    {
      label: "New SharePoint Page",
      href: `${SHAREPOINT_BASE}/_layouts/15/CreatePage.aspx`,
    },
    {
      label: "Open SharePoint",
      href: SHAREPOINT_BASE,
    },
  ];

  const capabilities = [
    {
      label: "Record",
      description: "Capture factual, defensible records. These will route into ARCHIEVE.",
    },
    {
      label: "Create",
      description: "Create SharePoint pages, lists, and artifacts without context switching.",
    },
    {
      label: "Navigate",
      description: "Jump directly into the real operating system when you need full power.",
    },
  ];

  const content = el("div", { class: "stack gap-xl" }, [
    renderCard({
      title: "Work Command Center",
      description:
        "This space is for creating, recording, and pushing work into SharePoint. Nothing here depends on existing lists.",
      variant: "hero",
    }),

    el("div", { class: "grid grid--3 gap-md" }, capabilities.map(renderCard)),

    el("div", { class: "grid grid--1-2 gap-lg" }, [
      renderCard({
        title: "Today",
        description: "No required tasks. No guilt. Just context.",
        variant: "calm",
      }),
      // Future extension point
      renderCard({
        title: "Recent Activity",
        description: "(coming soon)",
      }),
    ]),
  ]);

  return {
    title: "Command Center",
    subtitle: formatDateHeading(new Date()),
    actions: actions.map((a) => ({
      label: a.label,
      variant: a.variant,
      href: a.href,
      action: a.action, // normalized field name
    })),
    content,
  };
}
