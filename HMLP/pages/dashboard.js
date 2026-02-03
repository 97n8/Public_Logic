// pages/dashboard.js
import { el } from "../lib/dom.js";
import { openRecordConsole } from "../lib/record-console.js";
import { getConfig, getLinks } from "../lib/config.js";

function formatDateHeading(date = new Date()) {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function renderCard({ label, title, description, children, variant = "" }) {
  const classes = ["card"];
  if (variant) classes.push(`card--${variant}`);

  const safeChildren = Array.isArray(children)
    ? children
    : children
    ? [children]
    : [];

  return el("section", { class: classes.join(" ") }, [
    label && el("div", { class: "card__label" }, [label]),
    title && el("h2", { class: "card__title" }, [title]),
    description &&
      el("p", { class: "card__description" }, [description]),
    ...safeChildren,
  ]);
}

export async function renderDashboard(ctx) {
  const cfg = getConfig() || {};
  const links = getLinks(cfg) || {};

  const actions = [
    {
      label: "New Record",
      variant: "primary",
      action: () => openRecordConsole(ctx),
    },
    links.site && { label: "SharePoint", href: links.site },
    links.archiveList && { label: "Archive", href: links.archiveList },
  ].filter(Boolean);

  const capabilities = [
    { label: "Record", description: "Create defensible records" },
    { label: "Create", description: "Pages, lists, documents" },
    { label: "Navigate", description: "Direct SharePoint access" },
  ];

  const quickLinks = [
    { label: "Tasks", href: links.tasksList },
    { label: "Projects", href: links.projectsList },
    { label: "Pipeline", href: links.pipelineList },
    { label: "Meetings", href: links.meetings },
    { label: "Documents", href: links.documents },
    { label: "Budget", href: links.budget },
  ].filter(l => l.href);

  const content = el("div", { class: "dashboard" }, [
    renderCard({
      title: "Command Center",
      description: "Create records, move work, stay oriented.",
      variant: "hero",
    }),

    el(
      "div",
      { class: "grid grid--3" },
      capabilities.map(c =>
        renderCard({
          label: c.label,
          description: c.description,
        })
      )
    ),

    el("div", { class: "grid grid--2" }, [
      renderCard({
        title: "Today",
        description: "No required actions. No backlog pressure.",
        variant: "calm",
      }),

      renderCard({
        title: "Quick Links",
        children:
          quickLinks.length > 0
            ? quickLinks.map(l =>
                el(
                  "a",
                  { href: l.href, class: "quick-link" },
                  [l.label]
                )
              )
            : el("div", { class: "muted" }, ["No links configured"]),
      }),
    ]),
  ]);

  return {
    title: "Command Center",
    subtitle: formatDateHeading(),
    actions,
    content,
  };
}
