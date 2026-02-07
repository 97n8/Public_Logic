import { el } from "../lib/dom.js";
import { getConfig } from "../lib/config.js";

/* ================= ICONS ================= */
const ICONS = {
  task: "✓",
  pipeline: "▮▮▮",
  projects: "▢",
  record: "●",
  ai: "✦",
  notes: "📝",
  calendar: "📅",
  launch: "↗",
  microsoft: "☁", // better symbol for M365
  disconnected: "–"
};

/* ================= SAFE HELPERS ================= */
function cfgValue(getter, fallback = "–") {
  try {
    const value = getter();
    return value == null || Number.isNaN(value) ? fallback : String(value);
  } catch {
    return fallback;
  }
}

function formatDate(date) {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });
}

/* ================= UI PRIMITIVES ================= */
function statCard({ label, value, suffix = "", icon }) {
  return el("div", { class: "stat-card" }, [
    el("div", { class: "stat-card__icon" }, icon),
    el("div", { class: "stat-card__content" }, [
      el("div", { class: "stat-card__value" }, [
        el("strong", {}, value),
        suffix && el("span", { class: "stat-card__suffix" }, ` ${suffix}`)
      ]),
      el("div", { class: "stat-card__label" }, label.toUpperCase())
    ])
  ]);
}

function quickAction({ label, description, icon, href, onClick }) {
  const isLink = !!href;
  const tag = isLink ? "a" : "button";
  const attrs = isLink
    ? {
        class: "quick-action",
        href,
        target: "_blank",
        rel: "noopener noreferrer"
      }
    : {
        class: "quick-action",
        type: "button",
        onclick: onClick,
        onkeydown: e => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick?.();
          }
        }
      };

  return el(tag, attrs, [
    el("div", { class: "quick-action__icon" }, icon),
    el("div", { class: "quick-action__text" }, [
      el("div", { class: "quick-action__label" }, label),
      el("div", { class: "quick-action__desc" }, description)
    ]),
    el("div", { class: "quick-action__arrow" }, ICONS.launch)
  ]);
}

function integrationCard({ name, description, icon, connected, href }) {
  return el(
    "a",
    {
      class: `integration-card ${connected ? "connected" : "not-connected"}`,
      href: href || "#",
      target: "_blank",
      rel: "noopener noreferrer"
    },
    [
      el("div", { class: "integration-card__header" }, [
        el("div", { class: `integration-card__icon ${connected ? "" : "muted"}` }, icon),
        el(
          "span",
          { class: `status-pill ${connected ? "ok" : "off"}` },
          connected ? "Connected" : "Not connected"
        )
      ]),
      el("div", { class: "integration-card__name" }, name),
      el("div", { class: "integration-card__desc" }, description || "–")
    ]
  );
}

/* ================= DASHBOARD ================= */
export async function renderDashboard(ctx = {}) {
  const cfg = getConfig() || {};
  const now = new Date();
  const hour = now.getHours();

  const greeting =
    hour < 12 ? "Good morning" :
    hour < 17 ? "Good afternoon" :
    "Good evening";

  const timeHint =
    hour < 12 ? "Let's start strong" :
    hour < 17 ? "Stay focused" :
    "Time to wrap up";

  const userName = ctx.userDisplayName ||
    (ctx.userEmail
      ? ctx.userEmail.split("@")[0]
          .split(/[._-]/)
          .map(part => part.charAt(0).toUpperCase() + part.slice(1))
          .join(" ")
      : "friend");

  const integrations = {
    claude: false,
    appleNotes: false,
    m365: Boolean(cfg.msal?.clientId),
    // add more when implemented: openai, notion, linear, github, etc.
  };

  // ─── Hero ────────────────────────────────────────────────
  const hero = el("div", { class: "dashboard-hero" }, [
    el("div", { class: "dashboard-hero__greeting" }, [
      el("h2", {}, `${greeting}, ${userName}`),
      el("p", { class: "muted small" }, timeHint),
      el("p", { class: "muted date" }, formatDate(now))
    ]),
    el("div", { class: "dashboard-hero__stats scroll-x" }, [
      statCard({ label: "Active Tasks",   value: cfgValue(() => cfg.stats?.tasks),    suffix: "", icon: ICONS.task }),
      statCard({ label: "Pipeline Items", value: cfgValue(() => cfg.stats?.pipeline), suffix: "", icon: ICONS.pipeline }),
      statCard({ label: "Live Projects",  value: cfgValue(() => cfg.stats?.projects), suffix: "", icon: ICONS.projects }),
      statCard({ label: "New Records",    value: cfgValue(() => cfg.stats?.records),  suffix: "week", icon: ICONS.record })
    ])
  ]);

  // ─── Quick Actions ───────────────────────────────────────
  const actions = el("div", { class: "dashboard-section" }, [
    el("div", { class: "dashboard-section__header" }, [
      el("h3", {}, "Quick Actions"),
      el("span", { class: "dashboard-section__hint" }, "Daily tools")
    ]),
    el("div", { class: "quick-actions-grid" }, [
      quickAction({
        label: "Ask Claude",
        description: "Think, summarize, write",
        icon: ICONS.ai,
        href: "https://claude.ai/new"
      }),
      quickAction({
        label: "Notes",
        description: "Capture & organize thoughts",
        icon: ICONS.notes,
        href: "https://www.icloud.com/notes"
      }),
      quickAction({
        label: "Calendar",
        description: "Check schedule & meetings",
        icon: ICONS.calendar,
        href: "https://outlook.office.com/calendar/view/week"
      }),
      quickAction({
        label: "Tasks",
        description: "Review & prioritize",
        icon: ICONS.task,
        onClick: () => (window.location.hash = "#/tasks")
      })
    ])
  ]);

  // ─── Integrations ────────────────────────────────────────
  const connections = el("div", { class: "dashboard-section" }, [
    el("div", { class: "dashboard-section__header" }, [
      el("h3", {}, "Connections"),
      el("span", { class: "dashboard-section__hint" }, "Active services")
    ]),
    el("div", { class: "integrations-grid" }, [
      integrationCard({
        name: "Claude AI",
        description: "Advanced reasoning & writing",
        icon: ICONS.ai,
        connected: integrations.claude,
        href: "https://claude.ai"
      }),
      integrationCard({
        name: "Apple Notes",
        description: "Personal knowledge base",
        icon: ICONS.notes,
        connected: integrations.appleNotes,
        href: "https://www.icloud.com/notes"
      }),
      integrationCard({
        name: "Microsoft 365",
        description: "Email, calendar, files",
        icon: ICONS.microsoft,
        connected: integrations.m365,
        href: "https://www.office.com"
      })
    ])
  ]);

  // ─── Activity ────────────────────────────────────────────
  const activity = el("div", { class: "dashboard-section" }, [
    el("div", { class: "dashboard-section__header" }, [
      el("h3", {}, "Recent Activity"),
      el("span", { class: "dashboard-section__hint" }, "Latest updates")
    ]),
    el("div", { class: "activity-empty" }, [
      el("p", {}, "No recent activity."),
      el("p", { class: "muted small" }, "Connect more tools to see updates here.")
    ])
  ]);

  // ─── Main Layout ─────────────────────────────────────────
  const content = el("div", { class: "dashboard-container" }, [
    hero,
    el("div", { class: "dashboard-grid" }, [
      el("div", { class: "dashboard-grid__main" }, [
        actions,
        connections
      ]),
      el("div", { class: "dashboard-grid__sidebar" }, [
        activity
      ])
    ])
  ]);

  return {
    title: "Dashboard",
    subtitle: cfg ? "System overview" : "Loading configuration...",
    content
  };
}
