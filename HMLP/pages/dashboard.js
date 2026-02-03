// pages/dashboard.js
import { el } from "../lib/dom.js";
import { openRecordConsole } from "../lib/record-console.js";
import { getConfig, getLinks } from "../lib/config.js";

/**
 * Minimal card component — clean container only
 */
function renderCard({ title, description, children, variant = "", className = "" }) {
  const classes = ["card", variant && `card--${variant}`, className]
    .filter(Boolean)
    .join(" ");

  return el("div", { class: classes }, [
    title && el("div", { class: "card-title" }, [title]),
    description && el("div", { class: "card-subtitle" }, [description]),
    ...(children || []),
  ]);
}

/**
 * Human-friendly date
 */
function formatNiceDate(date = new Date()) {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

/**
 * Relative time — short and natural
 */
function formatRelativeTime(timestamp) {
  const diff = Date.now() - timestamp;
  if (diff < 90_000) return "just now";
  if (diff < 3_600_000) return Math.round(diff / 60_000) + " min ago";
  if (diff < 86_400_000) return Math.round(diff / 3_600_000) + " hr ago";
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export async function renderDashboard(ctx) {
  const cfg = getConfig();
  const links = getLinks(cfg);

  // ── Personal quick actions ──────────────────────────────
  const personalActions = [
    { label: "New Record", icon: "✎", variant: "primary", action: () => openRecordConsole(ctx) },
    { label: "New Page", icon: "📄", href: links.createPage },
  ];

  // ── Institutional / external systems ─────────────────────
  const institutionalActions = [
    { label: "SharePoint", icon: "🌐", href: links.site },
    ...(links.archiveList ? [{ label: "Archive", icon: "📦", href: links.archiveList }] : []),
  ];

  // ── Recent files — update manually or later automate ────
  const recentFiles = [
    {
      name: "CASE_Workspace.md",
      href: "https://github.com/97n8/pl-poli-case-workspace/blob/main/CASE_Workspace.md",
      lastModified: Date.now() - 1000 * 60 * 45, // 45 min ago example
    },
    {
      name: "AI-for-impact.html",
      href: "https://github.com/97n8/pl-poli-case-workspace/blob/main/AI-for-impact.html",
      lastModified: Date.now() - 1000 * 60 * 60 * 5, // 5 hrs ago
    },
    {
      name: "00_CLERK_Charter.md",
      href: "https://github.com/97n8/pl-poli-case-workspace/blob/main/00_CLERK_Charter.md",
      lastModified: Date.now() - 1000 * 60 * 60 * 26, // yesterday
    },
    {
      name: "Audience_and_Use.md",
      href: "https://github.com/97n8/pl-poli-case-workspace/blob/main/Audience_and_Use.md",
      lastModified: Date.now() - 1000 * 60 * 60 * 24 * 3, // 3 days ago
    },
    {
      name: "planning-notes-2026.txt",
      href: "#", // replace when you have real link
      lastModified: Date.now() - 1000 * 60 * 60 * 24 * 4,
    },
  ];

  // ── Layout ───────────────────────────────────────────────
  const content = el("div", { class: "workbench" }, [
    // Header — always visible
    el("header", { class: "header" }, [
      el("div", { class: "brand" }, [
        el("div", { class: "brand-mark" }, ["PL"]),
        el("div", { class: "brand-text" }, [
          el("div", { class: "brand-name" }, ["PublicLogic"]),
          el("div", { class: "brand-date" }, [formatNiceDate()]),
        ]),
      ]),
    ]),

    // Floating action button — always reachable
    el("button", {
      class: "fab primary",
      onclick: () => openRecordConsole(ctx),
    }, [
      el("span", { class: "fab-icon" }, ["✎"]),
      el("span", { class: "fab-label" }, ["New Record"]),
    ]),

    // Main content cards
    el("main", { class: "main-content stack gap-xl" }, [
      // Quick personal actions
      renderCard({
        title: "Start Here",
        children: personalActions.map(a =>
          el(a.action ? "button" : "a", {
            class: ["action-btn", a.variant && `action-btn--${a.variant}`].filter(Boolean).join(" "),
            href: a.href,
            target: a.href ? "_blank" : undefined,
            rel: a.href ? "noopener noreferrer" : undefined,
            onclick: a.action ? () => a.action() : undefined,
          }, [
            a.icon && el("span", { class: "action-icon" }, [a.icon]),
            a.label,
          ])
        ),
      }),

      // Institutional links (secondary)
      institutionalActions.length > 0 &&
        renderCard({
          title: "Systems",
          children: institutionalActions.map(a =>
            el("a", {
              class: "action-btn",
              href: a.href,
              target: "_blank",
              rel: "noopener noreferrer",
            }, [
              a.icon && el("span", { class: "action-icon" }, [a.icon]),
              a.label,
            ])
          ),
        }),

      // Recent work — your actual files
      renderCard({
        title: "Recent Work",
        description: "Last touched files — not authoritative",
        children: [
          el(
            "ul",
            { class: "recent-list" },
            recentFiles.map(file =>
              el("li", { class: "recent-item" }, [
                el("a", {
                  href: file.href,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  class: "file-link",
                }, [file.name]),
                el("span", { class: "file-time" }, [
                  formatRelativeTime(file.lastModified),
                ]),
              ])
            )
          ),
        ],
      }),

      // Calm today message
      renderCard({
        title: "Today",
        variant: "calm",
        description: "No meetings. No deadlines. Just deep work.",
      }),
    ]),
  ]);

  return {
    title: "PL Workbench",
    subtitle: formatNiceDate(),
    content,
  };
}
