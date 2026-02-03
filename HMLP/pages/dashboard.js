// pages/dashboard.js
import { el } from "../lib/dom.js";
import { openRecordConsole } from "../lib/record-console.js";
import { getConfig, getLinks } from "../lib/config.js";

function renderCard({ title, description, children, variant = "" }) {
  const classes = ["card"];
  if (variant) classes.push(`card--${variant}`);

  return el("div", { class: classes.join(" ") }, [
    title && el("div", { class: "card-title" }, [title]),
    description && el("div", { class: "card-subtitle" }, [description]),
    ...(children || []),
  ]);
}

function formatNiceDate() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function formatRelativeTime(ts) {
  const diff = Date.now() - ts;
  if (diff < 90_000) return "just now";
  if (diff < 3_600_000) return Math.round(diff / 60_000) + " min ago";
  if (diff < 86_400_000) return Math.round(diff / 3_600_000) + " hr ago";
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export async function renderDashboard(ctx) {
  const cfg = getConfig();
  const links = getLinks(cfg);

  // Recent files — your real work, most important daily view
  const recentFiles = [
    { name: "CASE_Workspace.md", href: "https://github.com/97n8/pl-poli-case-workspace/blob/main/CASE_Workspace.md", ts: Date.now() - 1000*60*45 },
    { name: "AI-for-impact.html", href: "https://github.com/97n8/pl-poli-case-workspace/blob/main/AI-for-impact.html", ts: Date.now() - 1000*60*60*5 },
    { name: "00_CLERK_Charter.md", href: "https://github.com/97n8/pl-poli-case-workspace/blob/main/00_CLERK_Charter.md", ts: Date.now() - 1000*60*60*26 },
    { name: "Audience_and_Use.md", href: "https://github.com/97n8/pl-poli-case-workspace/blob/main/Audience_and_Use.md", ts: Date.now() - 1000*60*60*24*3 },
    { name: "planning-notes-2026.txt", href: "#", ts: Date.now() - 1000*60*60*24*4 },
  ];

  const content = el("div", { class: "workbench" }, [
    // Minimal header
    el("header", { class: "header" }, [
      el("div", { class: "brand" }, [
        el("div", { class: "brand-mark" }, ["PL"]),
        el("div", {}, [
          el("div", { class: "brand-name" }, ["PublicLogic"]),
          el("div", { class: "date" }, [formatNiceDate()]),
        ]),
      ]),
    ]),

    // Main content — very spacious
    el("main", { class: "main-content" }, [
      renderCard({
        title: "Today",
        variant: "calm",
        description: "No meetings. No rush. Just deep work.",
      }),

      renderCard({
        title: "Recent Work",
        children: el("ul", { class: "recent-list" }, recentFiles.map(f =>
          el("li", { class: "recent-item" }, [
            el("a", { href: f.href, target: "_blank", rel: "noopener noreferrer" }, [f.name]),
            el("span", { class: "time" }, [formatRelativeTime(f.ts)]),
          ])
        )),
      }),

      // Very small secondary links
      el("div", { class: "secondary-links" }, [
        el("a", { href: links.site, target: "_blank", class: "pill" }, ["SharePoint"]),
        links.archiveList && el("a", { href: links.archiveList, target: "_blank", class: "pill" }, ["Archive"]),
      ]),
    ]),

    // Floating action button — the real star
    el("button", {
      class: "fab",
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
