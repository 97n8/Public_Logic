// pages/dashboard.js
import { el } from "../lib/dom.js";
import { openRecordConsole } from "../lib/record-console.js";
import { getConfig, getLinks } from "../lib/config.js";

/**
 * Card component — simple UI container
 */
function renderCard({ title, description, children, variant = "", className = "" }) {
  const classes = ["card"];
  if (variant) classes.push(`card--${variant}`);
  if (className) classes.push(className);

  return el("div", { class: classes.join(" ") }, [
    title && el("div", { class: "card-title" }, [title]),
    description && el("div", { class: "card-subtitle" }, [description]),
    ...(children || []),
  ]);
}

/**
 * Human-readable date
 */
function formatNiceDate() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

/**
 * Short relative time (safe, no chaining)
 */
function formatRelativeTime(timestamp) {
  if (!timestamp) return "—";
  const diff = Date.now() - timestamp;
  if (diff < 90000) return "just now";
  if (diff < 3600000) return Math.round(diff / 60000) + " min ago";
  if (diff < 86400000) return Math.round(diff / 3600000) + " hr ago";
  return new Date(timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export async function renderDashboard(ctx) {
  const cfg = getConfig() || {};
  const links = getLinks(cfg) || {};

  // Personal quick actions (always visible)
  const personalActions = [
    {
      label: "New Record",
      icon: "✎",
      variant: "primary",
      action: () => openRecordConsole(ctx),
    },
    {
      label: "New Page",
      icon: "📄",
      href: links.createPage || "#",
    },
  ];

  // Institutional/external links (only show if they exist)
  const institutionalActions = [];
  if (links.site) {
    institutionalActions.push({
      label: "SharePoint",
      icon: "🌐",
      href: links.site,
    });
  }
  if (links.archiveList) {
    institutionalActions.push({
      label: "Archive",
      icon: "📦",
      href: links.archiveList,
    });
  }

  // Recent files — your daily context (update these manually for now)
  const recentFiles = [
    {
      name: "CASE_Workspace.md",
      href: "https://github.com/97n8/pl-poli-case-workspace/blob/main/CASE_Workspace.md",
      lastModified: Date.now() - 1000 * 60 * 45, // example: 45 min ago
    },
    {
      name: "AI-for-impact.html",
      href: "https://github.com/97n8/pl-poli-case-workspace/blob/main/AI-for-impact.html",
      lastModified: Date.now() - 1000 * 60 * 60 * 5, // example: 5 hours ago
    },
    {
      name: "00_CLERK_Charter.md",
      href: "https://github.com/97n8/pl-poli-case-workspace/blob/main/00_CLERK_Charter.md",
      lastModified: Date.now() - 1000 * 60 * 60 * 26, // example: yesterday
    },
    {
      name: "Audience_and_Use.md",
      href: "https://github.com/97n8/pl-poli-case-workspace/blob/main/Audience_and_Use.md",
      lastModified: Date.now() - 1000 * 60 * 60 * 24 * 3, // example: 3 days ago
    },
    {
      name: "planning-notes-2026.txt",
      href: "#", // replace with real link when ready
      lastModified: Date.now() - 1000 * 60 * 60 * 24 * 4,
    },
  ];

  const content = el("div", { class: "workbench" }, [
    // Header — always present, calm
    el("header", { class: "header" }, [
      el("div", { class: "brand" }, [
        el("div", { class: "brand-mark" }, ["PL"]),
        el("div", {}, [
          el("div", { class: "brand-name" }, ["PublicLogic"]),
          el("div", { class: "date" }, [formatNiceDate()]),
        ]),
      ]),
    ]),

    // Main content area
    el("main", { class: "main-content" }, [
      // Recent work — most important daily glance
      renderCard({
        title: "Recent Work",
        children: el("ul", { class: "recent-list" }, recentFiles.map(file =>
          el("li", { class: "recent-item" }, [
            el("a", {
              href: file.href,
              target: "_blank",
              rel: "noopener noreferrer",
              class: "file-link",
            }, [file.name]),
            el("span", { class: "time" }, [formatRelativeTime(file.lastModified)]),
          ])
        )),
      }),

      // Calm daily message
      renderCard({
        title: "Today",
        variant: "calm",
        description: "No meetings. No rush. Just deep work.",
      }),

      // Small secondary links — not fighting for attention
      el("div", { class: "secondary-row" }, [
        el("a", { href: links.site || "#", target: "_blank", class: "pill" }, ["SharePoint"]),
        links.archiveList && el("a", { href: links.archiveList, target: "_blank", class: "pill" }, ["Archive"]),
      ]),
    ]),

    // Floating action button — always visible, easy to reach
    el("button", {
      class: "fab primary",
      onclick: () => openRecordConsole(ctx),
    }, [
      el("span", { class: "fab-icon" }, ["✎"]),
      el("span", { class: "fab-label" }, ["New Record"]),
    ]),
  ]);

  return {
    title: "PL Workbench",
    subtitle: formatNiceDate(),
    content,
  };
}
