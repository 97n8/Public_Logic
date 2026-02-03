// pages/dashboard.js
import { el } from "../lib/dom.js";
import { openRecordConsole } from "../lib/record-console.js";
import { getConfig, getLinks } from "../lib/config.js";

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
  const cfg = getConfig();
  const links = getLinks(cfg);

  // Actions / quick access buttons
  const actions = [
    {
      label: "New Record",
      variant: "primary",
      action: () => openRecordConsole(ctx),
    },
    {
      label: "New Page",
      href: links.createPage,
    },
    {
      label: "SharePoint",
      href: links.site,
    },
  ];

  // Add Archive link only if configured
  if (links.archiveList) {
    actions.push({
      label: "Archive",
      href: links.archiveList,
    });
  }

  const capabilities = [
    {
      label: "Record",
      description: "Capture factual, defensible records → ARCHIEVE",
    },
    {
      label: "Create",
      description: "Pages, lists, documents — no context switching",
    },
    {
      label: "Navigate",
      description: "Full access to SharePoint when needed",
    },
  ];

  // Quick municipal / internal links (only show ones that exist)
  const quickLinks = [
    { label: "Tasks", href: links.tasksList, icon: "✓" },
    { label: "Projects", href: links.projectsList, icon: "📋" },
    { label: "Pipeline", href: links.pipelineList, icon: "→" },
    { label: "Departments", href: links.departments },
    { label: "Meetings", href: links.meetings },
    { label: "Permits", href: links.permits },
    { label: "Documents", href: links.documents },
    { label: "Ordinances", href: links.ordinances },
    { label: "Budget", href: links.budget },
    { label: "Town Website", href: links.townWebsite, external: true },
    { label: "Public Records", href: links.publicRecords, external: true },
  ].filter(item => item.href); // only keep links that actually exist

  const content = el("div", { class: "stack gap-xl" }, [
    // Hero / welcome
    renderCard({
      title: "Work Command Center",
      description:
        "Create, record, and move work into SharePoint — clean, no dependencies on existing lists.",
      variant: "hero",
    }),

    // Capabilities
    el("div", { class: "grid grid--3 gap-md" }, capabilities.map(renderCard)),

    // Today + quick status
    el("div", { class: "grid grid--1-2 gap-lg" }, [
      renderCard({
        title: "Today",
        description: "No required tasks. No guilt. Just context.",
        variant: "calm",
      }),

      renderCard({
        title: "Quick Links",
        children: quickLinks.length > 0
          ? quickLinks.map(link =>
              el(
                link.external ? "a" : "a",
                {
                  href: link.href,
                  target: link.external ? "_blank" : undefined,
                  rel: link.external ? "noopener noreferrer" : undefined,
                  class: "quick-link",
                },
                [link.icon ? `${link.icon} ${link.label}` : link.label]
              )
            )
          : [el("p", { class: "muted" }, ["(configured links will appear here)"])],
      }),
    ]),
  ]);

  return {
    title: "Command Center",
    subtitle: formatDateHeading(new Date()),
    actions: actions.map(a => ({
      label: a.label,
      variant: a.variant,
      href: a.href,
      action: a.action,
    })),
    content,
  };
}
