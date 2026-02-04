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
  launch: "↗"
};

/* ================= SAFE HELPERS ================= */

function cfgValue(fn, fallback = "0") {
  try {
    const v = fn();
    return v === undefined || v === null ? fallback : String(v);
  } catch {
    return fallback;
  }
}

/* ================= UI PRIMITIVES ================= */

function statCard({ label, value, suffix, icon }) {
  return el("div", { class: "stat-card" }, [
    el("div", { class: "stat-card__icon" }, [icon]),
    el("div", { class: "stat-card__content" }, [
      el("div", { class: "stat-card__value" }, [
        value,
        suffix &&
          el("span", { class: "stat-card__suffix" }, [` ${suffix}`])
      ]),
      el("div", { class: "stat-card__label" }, [label.toUpperCase()])
    ])
  ]);
}

function quickAction({ label, description, icon, href, onClick }) {
  const tag = href ? "a" : "div";
  const attrs = href
    ? {
        class: "quick-action",
        href,
        target: "_blank",
        rel: "noopener"
      }
    : {
        class: "quick-action",
        role: "button",
        tabindex: 0,
        onclick: onClick,
        onkeydown: e => {
          if (e.key === "Enter" || e.key === " ") onClick?.();
        }
      };

  return el(tag, attrs, [
    el("div", { class: "quick-action__icon" }, [icon]),
    el("div", { class: "quick-action__text" }, [
      el("div", { class: "quick-action__label" }, [label]),
      el("div", { class: "quick-action__desc" }, [description])
    ]),
    el("div", { class: "quick-action__arrow" }, [ICONS.launch])
  ]);
}

function integrationCard({ name, description, icon, connected, href }) {
  return el(
    "a",
    {
      class: `integration-card ${connected ? "connected" : "not-connected"}`,
      href,
      target: "_blank",
      rel: "noopener"
    },
    [
      el("div", { class: "integration-card__header" }, [
        el(
          "div",
          {
            class: `integration-card__icon ${
              connected ? "" : "muted"
            }`
          },
          [icon]
        ),
        el(
          "span",
          {
            class: `status-pill ${connected ? "ok" : "off"}`
          },
          [connected ? "Connected" : "Not connected"]
        )
      ]),
      el("div", { class: "integration-card__name" }, [name]),
      el("div", { class: "integration-card__desc" }, [description])
    ]
  );
}

/* ================= DASHBOARD ================= */

export async function renderDashboard(ctx) {
  const cfg = getConfig();
  const now = new Date();

  const greeting =
    now.getHours() < 12
      ? "Good morning"
      : now.getHours() < 17
      ? "Good afternoon"
      : "Good evening";

  const timeHint =
    now.getHours() < 12
      ? "Start your day"
      : now.getHours() < 17
      ? "Midday check-in"
      : "Wrap up";

  const userName = ctx.userEmail
    ? ctx.userEmail.split("@")[0]
    : "there";

  const integrationsConfig = {
    claude: false,
    appleNotes: false,
    m365: Boolean(cfg?.msal)
  };

  /* ===== HERO ===== */

  const hero = el("div", { class: "dashboard-hero" }, [
    el("div", { class: "dashboard-hero__greeting" }, [
      el("h2", {}, [`${greeting}, ${userName}`]),
      el("p", { class: "muted small" }, [timeHint]),
      el(
        "p",
        { class: "muted" },
        [
          now.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric"
          })
        ]
      )
    ]),
    el("div", { class: "dashboard-hero__stats scroll-x" }, [
      statCard({
        label: "Active Tasks",
        value: cfgValue(() => cfg.stats?.tasks),
        suffix: "active",
        icon: ICONS.task
      }),
      statCard({
        label: "Pipeline",
        value: cfgValue(() => cfg.stats?.pipeline),
        suffix: "open",
        icon: ICONS.pipeline
      }),
      statCard({
        label: "Projects",
        value: cfgValue(() => cfg.stats?.projects),
        suffix: "live",
        icon: ICONS.projects
      }),
      statCard({
        label: "Records",
        value: cfgValue(() => cfg.stats?.records),
        suffix: "this week",
        icon: ICONS.record
      })
    ])
  ]);

  /* ===== ACTIONS ===== */

  const actions = el("div", { class: "dashboard-section" }, [
    el("div", { class: "dashboard-section__header" }, [
      el("h3", {}, ["Actions"]),
      el("span", { class: "dashboard-section__hint" }, [
        "Fast access"
      ])
    ]),
    el("div", { class: "quick-actions-grid" }, [
      quickAction({
        label: "Ask Claude",
        description: "Opens in new tab",
        icon: ICONS.ai,
        href: "https://claude.ai"
      }),
      quickAction({
        label: "Apple Notes",
        description: "External notes",
        icon: ICONS.notes,
        href: "https://www.icloud.com/notes"
      }),
      quickAction({
        label: "Calendar",
        description: "Outlook",
        icon: ICONS.calendar,
        href: "https://outlook.office.com/calendar/"
      }),
      quickAction({
        label: "Tasks",
        description: "View task list",
        icon: ICONS.task,
        onClick: () => (window.location.hash = "#/tasks")
      })
    ])
  ]);

  /* ===== SYSTEM CONNECTIONS ===== */

  const integrations = el("div", { class: "dashboard-section" }, [
    el("div", { class: "dashboard-section__header" }, [
      el("h3", {}, ["System Connections"]),
      el("span", { class: "dashboard-section__hint" }, [
        "Verified only"
      ])
    ]),
    el("div", { class: "integrations-grid" }, [
      integrationCard({
        name: "Claude AI",
        description: "External AI service",
        icon: ICONS.ai,
        connected: integrationsConfig.claude,
        href: "https://claude.ai"
      }),
      integrationCard({
        name: "Apple Notes",
        description: "External notes service",
        icon: ICONS.notes,
        connected: integrationsConfig.appleNotes,
        href: "https://www.icloud.com/notes"
      }),
      integrationCard({
        name: "Microsoft 365",
        description: "Identity and documents",
        icon: ICONS.projects,
        connected: integrationsConfig.m365,
        href: "https://www.office.com"
      })
    ])
  ]);

  /* ===== ACTIVITY ===== */

  const activity = el("div", { class: "dashboard-section" }, [
    el("div", { class: "dashboard-section__header" }, [
      el("h3", {}, ["System Activity"]),
      el("span", { class: "dashboard-section__hint" }, [
        "Nothing yet"
      ])
    ]),
    el("div", { class: "activity-empty" }, [
      "Nothing yet. Activity will appear here once sources are connected."
    ])
  ]);

  /* ===== LAYOUT ===== */

  const content = el("div", { class: "dashboard" }, [
    hero,
    el("div", { class: "dashboard-grid" }, [
      el("div", { class: "dashboard-grid__main" }, [
        actions,
        integrations
      ]),
      el("div", { class: "dashboard-grid__side" }, [activity])
    ])
  ]);

  return {
    title: "Dashboard",
    subtitle: cfg
      ? "System overview"
      : "System overview (no live data yet)",
    content
  };
}
