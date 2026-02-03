// pages/dashboard.js
import { el } from "../lib/dom.js";
import { openRecordConsole } from "../lib/record-console.js";
import { getConfig, getLinks } from "../lib/config.js";

const SHAREPOINT_BASE = "https://publiclogic978.sharepoint.com/sites/PL";

/**
 * Original card renderer — restored exactly + safe children
 */
function renderCard({ label, title, description, children, variant = "" }) {
  const classes = ["card"];
  if (variant) classes.push(`card--${variant}`);

  // Safeguard: make sure children is always an array
  const safeChildren = Array.isArray(children) ? children : children ? [children] : [];

  return el(
    "div",
    { class: classes.join(" ") },
    [
      label && el("div", { class: "card__label" }, [label]),
      title && el("div", { class: "card__title" }, [title]),
      description && el("div", { class: "small" }, [description]),
      ...safeChildren,
    ].filter(Boolean)
  );
}

function formatDateHeading(date = new Date()) {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export async function renderDashboard(ctx) {
  const cfg = getConfig() || {};
  const links = getLinks(cfg) || {};

  // Top actions — restored from your original version
  const actions = [
    {
      label: "New Record",
      variant: "primary",
      onClick: () => openRecordConsole(ctx),
    },
    {
      label: "New SharePoint Page",
      href: links.createPage || `${SHAREPOINT_BASE}/_layouts/15/CreatePage.aspx`,
    },
    {
      label: "Open SharePoint",
      href: links.site || SHAREPOINT_BASE,
    },
  ];

  // Add Archive only if configured
  if (links.archiveList) {
    actions.push({
      label: "Archive",
      href: links.archiveList,
    });
  }

  // Capabilities — restored exactly as in original
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

  // Main content — restored original structure
  const content = el("div", { class: "stack gap-lg" }, [
    // Hero card
    renderCard({
      title: "Work Command Center",
      description:
        "This space is for creating, recording, and pushing work into SharePoint. Nothing here depends on existing lists.",
    }),

    // Capabilities grid
    el("div", { class: "grid grid--3" }, capabilities.map(renderCard)),

    // Today card
    renderCard({
      title: "Today",
      description: "No required tasks. No guilt. Just context.",
    }),
  ]);

  return {
    title: "Command Center",
    subtitle: formatDateHeading(),
    actions: actions.map(a => ({
      label: a.label,
      variant: a.variant,
      href: a.href,
      onClick: a.onClick,
    })),
    content,
  };
}
