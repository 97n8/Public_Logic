import { el } from "../lib/dom.js";
import { openRecordConsole } from "../lib/record-console.js";

const SHAREPOINT_BASE = "https://publiclogic978.sharepoint.com/sites/PL";

const actions = [
  {
    label: "New Record",
    variant: "primary",
    onClick: (ctx) => openRecordConsole(ctx)
  },
  {
    label: "New SharePoint Page",
    href: `${SHAREPOINT_BASE}/_layouts/15/CreatePage.aspx`
  },
  {
    label: "Open SharePoint",
    href: SHAREPOINT_BASE
  }
];

const capabilities = [
  {
    label: "Record",
    description: "Capture factual, defensible records. These will route into ARCHIVE."
  },
  {
    label: "Create",
    description:
      "Create SharePoint pages, lists, and artifacts without context switching."
  },
  {
    label: "Navigate",
    description: "Jump directly into the real operating system when you need full power."
  }
];

function resolveAction(action, ctx) {
  if (action.href) {
    return () => window.open(action.href, "_blank");
  }
  return () => action.onClick(ctx);
}

function renderCard({ label, title, description, children }) {
  return el("div", { class: "card" }, [
    label && el("div", { class: "card__label" }, [label]),
    title && el("div", { class: "card__title" }, [title]),
    description && el("div", { class: "small" }, [description]),
    ...(children || [])
  ].filter(Boolean));
}

function renderCapabilityGrid(items) {
  return el(
    "div",
    { class: "grid grid--3" },
    items.map(({ label, description }) => renderCard({ label, description }))
  );
}

function formatDateHeading(date) {
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric"
  });
}

export async function renderDashboard(ctx) {
  const resolvedActions = actions.map((action) => ({
    label: action.label,
    variant: action.variant,
    onClick: resolveAction(action, ctx)
  }));

  const content = el("div", { class: "stack gap-lg" }, [
    renderCard({
      title: "Work Command Center",
      description:
        "This space is for creating, recording, and pushing work into SharePoint. Nothing here depends on existing lists."
    }),
    renderCapabilityGrid(capabilities),
    renderCard({
      title: "Today",
      description: "No required tasks. No guilt. Just context."
    })
  ]);

  return {
    title: "Command Center",
    subtitle: formatDateHeading(new Date()),
    actions: resolvedActions,
    content
  };
}
