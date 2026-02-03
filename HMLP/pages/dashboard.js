// pages/dashboard.js
import { el } from "../lib/dom.js";
import { openRecordConsole } from "../lib/record-console.js";
import { getConfig, getLinks } from "../lib/config.js";

function renderCard({ title, description, children, variant = "" }) {
  const classes = ["card"];
  if (variant) classes.push(`card--${variant}`);

  // Safeguard: make sure children is always an array
  const safeChildren = Array.isArray(children) ? children : children ? [children] : [];

  return el("div", { class: classes.join(" ") }, [
    title && el("div", { class: "card-title" }, [title]),
    description && el("div", { class: "card-subtitle" }, [description]),
    ...safeChildren,
  ]);
}

function formatNiceDate() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export async function renderDashboard(ctx) {
  const cfg = getConfig() || {};
  const links = getLinks(cfg) || {};

  // Recent files (your actual recent work — update these manually)
  const recentFiles = [
    { name: "CASE_Workspace.md", href: "https://github.com/97n8/pl-poli-case-workspace/blob/main/CASE_Workspace.md", time: "45 min ago" },
    { name: "AI-for-impact.html", href: "https://github.com/97n8/pl-poli-case-workspace/blob/main/AI-for-impact.html", time: "5 hr ago" },
    { name: "00_CLERK_Charter.md", href: "https://github.com/97n8/pl-poli-case-workspace/blob/main/00_CLERK_Charter.md", time: "yesterday" },
    { name: "Audience_and_Use.md", href: "https://github.com/97n8/pl-poli-case-workspace/blob/main/Audience_and_Use.md", time: "3 days ago" },
    { name: "planning-notes-2026.txt", href: "#", time: "4 days ago" },
  ];

  const content = el("div", { class: "workbench" }, [
    // Header
    el("header", { class: "header" }, [
      el("div", { class: "brand" }, [
        el("div", { class: "brand-mark" }, ["PL"]),
        el("div", {}, [
          el("div", { class: "brand-name" }, ["PublicLogic"]),
          el("div", { class: "date" }, [formatNiceDate()]),
        ]),
      ]),
    ]),

    // Main content — very simple stack
    el("main", { class: "main-content" }, [
      // Big primary action
      el("button", {
        class: "fab primary",
        onclick: () => openRecordConsole(ctx),
      }, [
        el("span", { class: "fab-icon" }, ["✎"]),
        el("span", { class: "fab-label" }, ["New Record"]),
      ]),

      // Recent work — most important section
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
            el("span", { class: "time" }, [file.time]),
          ])
        )),
      }),

      // Calm message
      renderCard({
        title: "Today",
        variant: "calm",
        description: "No meetings. No rush. Just deep work.",
      }),

      // Small secondary links at bottom
      el("div", { class: "secondary-links" }, [
        el("a", { href: links.site || "#", target: "_blank", class: "pill" }, ["SharePoint"]),
        links.archiveList && el("a", { href: links.archiveList, target: "_blank", class: "pill" }, ["Archive"]),
      ]),
    ]),
  ]);

  return {
    title: "PL Workbench",
    subtitle: formatNiceDate(),
    content,
  };
}
