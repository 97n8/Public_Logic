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

function formatDateHeading(date = new Date()) {
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

  // ─────────────────────────────────────────────
  // Primary Actions – most important things first
  // ─────────────────────────────────────────────
  const primaryActions = [
    {
      label: "New Record",
      icon: "✎",
      variant: "primary",
      action: () => openRecordConsole(ctx),
    },
    {
      label: "New Page",
      icon: "📄",
      href: links.createPage,
    },
    {
      label: "SharePoint",
      icon: "🌐",
      href: links.site,
    },
  ];

  if (links.archiveList) {
    primaryActions.push({
      label: "Archive",
      icon: "📦",
      href: links.archiveList,
    });
  }

  // ─────────────────────────────────────────────
  // Quick municipal / internal links
  // ─────────────────────────────────────────────
  const quickLinks = [
    { label: "Tasks", href: links.tasksList, icon: "✓" },
    { label: "Projects", href: links.projectsList, icon: "📋" },
    { label: "Pipeline", href: links.pipelineList, icon: "→" },
    { label: "Departments", href: links.departments, icon: "🏢" },
    { label: "Meetings", href: links.meetings, icon: "🗓" },
    { label: "Permits", href: links.permits, icon: "📝" },
    { label: "Documents", href: links.documents, icon: "📁" },
    { label: "Ordinances", href: links.ordinances, icon: "⚖" },
    { label: "Budget", href: links.budget, icon: "💰" },
    { label: "Town Website", href: links.townWebsite, icon: "🌍", external: true },
    { label: "Public Records", href: links.publicRecords, icon: "🔍", external: true },
  ].filter((item) => item.href);

  // ─────────────────────────────────────────────
  // Capabilities (small overview cards)
  // ─────────────────────────────────────────────
  const capabilities = [
    {
      label: "Record",
      description: "Capture factual, defensible records → ARCHIEVE",
    },
    {
      label: "Create",
      description: "Pages, lists, documents — stay in flow",
    },
    {
      label: "Navigate",
      description: "Full SharePoint access when needed",
    },
  ];

  // ─────────────────────────────────────────────
  // Main content structure
  // ─────────────────────────────────────────────
  const content = el("div", { class: "stack gap-xl" }, [
    // Hero / welcome area
    renderCard({
      title: "Work Command Center",
      description:
        "Create. Record. Push work into SharePoint. Clean, no dependencies.",
      variant: "hero",
    }),

    // Primary actions block
    renderCard({
      title: "Start Here",
      children: [
        el(
          "div",
          { class: "grid grid--2 gap-md" },
          primaryActions.map((a) =>
            el(
              a.action ? "button" : "a",
              {
                class: ["btn", a.variant && `btn--${a.variant}`].filter(Boolean).join(" "),
                href: a.href,
                target: a.href ? "_blank" : undefined,
                rel: a.href ? "noopener noreferrer" : undefined,
                onclick: a.action ? () => a.action() : undefined,
              },
              [a.icon && el("span", { class: "icon" }, [a.icon]), a.label]
            )
          )
        ),
      ],
    }),

    // Capabilities + Today + Quick Links
    el("div", { class: "grid grid--2 gap-lg" }, [
      // Left column: capabilities + today
      el("div", { class: "stack gap-lg" }, [
        el("div", { class: "grid grid--3 gap-md" }, capabilities.map(renderCard)),
        renderCard({
          title: "Today",
          description: "No required tasks. No guilt. Just context.",
          variant: "calm",
        }),
      ]),

      // Right column: Quick Links
      renderCard({
        title: "Quick Links",
        children:
          quickLinks.length > 0
            ? [
                el(
                  "div",
                  { class: "stack gap-xs" },
                  quickLinks.map((link) =>
                    el(
                      "a",
                      {
                        href: link.href,
                        target: link.external ? "_blank" : undefined,
                        rel: link.external ? "noopener noreferrer" : undefined,
                        class: "quick-link",
                      },
                      [
                        link.icon && el("span", { class: "icon" }, [link.icon]),
                        link.label,
                        link.external && el("span", { class: "external" }, ["↗"]),
                      ]
                    )
                  )
                ),
              ]
            : [el("p", { class: "muted small" }, ["More links will appear here when configured"])],
      }),
    ]),
  ]);

  return {
    title: "Command Center",
    subtitle: formatDateHeading(),
    actions: primaryActions.map((a) => ({
      label: a.label,
      variant: a.variant,
      href: a.href,
      action: a.action,
      icon: a.icon,
    })),
    content,
  };
}
