import { el } from "../lib/dom.js";
import { getConfig } from "../lib/config.js";

const ICONS = {
  ai: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2M7.5 13A1.5 1.5 0 0 0 6 14.5 1.5 1.5 0 0 0 7.5 16 1.5 1.5 0 0 0 9 14.5 1.5 1.5 0 0 0 7.5 13m9 0a1.5 1.5 0 0 0-1.5 1.5 1.5 1.5 0 0 0 1.5 1.5 1.5 1.5 0 0 0 1.5-1.5 1.5 1.5 0 0 0-1.5-1.5"/></svg>`,
  notes: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>`,
  calendar: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  task: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
  record: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>`,
  launch: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`,
  sparkle: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v18M3 12h18M5.636 5.636l12.728 12.728M18.364 5.636L5.636 18.364"/></svg>`
};

function statCard({ label, value, trend, icon }) {
  return el("div", { class: "stat-card" }, [
    el("div", { class: "stat-card__icon", html: icon }),
    el("div", { class: "stat-card__content" }, [
      el("div", { class: "stat-card__value" }, [value]),
      el("div", { class: "stat-card__label" }, [label]),
      trend && el("div", { class: `stat-card__trend stat-card__trend--${trend > 0 ? "up" : "down"}` }, [
        trend > 0 ? `↑ ${trend}%` : `↓ ${Math.abs(trend)}%`
      ])
    ])
  ]);
}

function quickAction({ label, description, icon, onClick, href, variant }) {
  const tag = href ? "a" : "div";
  const attrs = href 
    ? { class: `quick-action ${variant ? `quick-action--${variant}` : ""}`, href, target: "_blank", rel: "noopener" }
    : { class: `quick-action ${variant ? `quick-action--${variant}` : ""}`, onclick: onClick, role: "button", tabindex: 0 };
  
  return el(tag, attrs, [
    el("div", { class: "quick-action__icon", html: icon }),
    el("div", { class: "quick-action__text" }, [
      el("div", { class: "quick-action__label" }, [label]),
      el("div", { class: "quick-action__desc" }, [description])
    ]),
    el("div", { class: "quick-action__arrow", html: ICONS.launch })
  ]);
}

function integrationCard({ name, description, icon, status, href }) {
  return el("a", { 
    class: "integration-card", 
    href, 
    target: "_blank", 
    rel: "noopener" 
  }, [
    el("div", { class: "integration-card__header" }, [
      el("div", { class: "integration-card__icon", html: icon }),
      el("div", { class: `integration-card__status integration-card__status--${status}` }, [
        status === "connected" ? "Connected" : "Connect"
      ])
    ]),
    el("div", { class: "integration-card__name" }, [name]),
    el("div", { class: "integration-card__desc" }, [description])
  ]);
}

export async function renderDashboard(ctx) {
  const cfg = getConfig();
  const now = new Date();
  const greeting = now.getHours() < 12 ? "Good morning" : now.getHours() < 17 ? "Good afternoon" : "Good evening";
  const userName = ctx.userEmail?.split("@")[0] || "there";

  const hero = el("div", { class: "dashboard-hero" }, [
    el("div", { class: "dashboard-hero__greeting" }, [
      el("h2", {}, [`${greeting}, ${userName}`]),
      el("p", {}, [now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })])
    ]),
    el("div", { class: "dashboard-hero__stats" }, [
      statCard({ label: "Active Tasks", value: "12", trend: 8, icon: ICONS.task }),
      statCard({ label: "Pipeline Deals", value: "5", trend: -2, icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>` }),
      statCard({ label: "Live Projects", value: "3", icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>` }),
      statCard({ label: "Records This Week", value: "28", trend: 15, icon: ICONS.record })
    ])
  ]);

  const quickActions = el("div", { class: "dashboard-section" }, [
    el("div", { class: "dashboard-section__header" }, [
      el("h3", {}, ["Quick Actions"]),
      el("span", { class: "dashboard-section__hint" }, ["Jump into your most common workflows"])
    ]),
    el("div", { class: "quick-actions-grid" }, [
      quickAction({
        label: "Ask Claude",
        description: "AI-powered assistance for any task",
        icon: ICONS.ai,
        href: "https://claude.ai",
        variant: "ai"
      }),
      quickAction({
        label: "Apple Notes",
        description: "Quick capture on the go",
        icon: ICONS.notes,
        href: "https://www.icloud.com/notes",
        variant: "notes"
      }),
      quickAction({
        label: "Today's Schedule",
        description: "View calendar and meetings",
        icon: ICONS.calendar,
        href: "https://outlook.office.com/calendar/"
      }),
      quickAction({
        label: "New Task",
        description: "Create a commitment",
        icon: ICONS.task,
        onClick: () => window.location.hash = "#/tasks"
      })
    ])
  ]);

  const integrations = el("div", { class: "dashboard-section" }, [
    el("div", { class: "dashboard-section__header" }, [
      el("h3", {}, ["Connected Services"]),
      el("span", { class: "dashboard-section__hint" }, ["Your AI and productivity stack"])
    ]),
    el("div", { class: "integrations-grid" }, [
      integrationCard({
        name: "Claude AI",
        description: "Anthropic's AI assistant for complex reasoning",
        icon: ICONS.ai,
        status: "connected",
        href: "https://claude.ai"
      }),
      integrationCard({
        name: "Apple Notes",
        description: "Sync notes from iPhone and Mac",
        icon: ICONS.notes,
        status: "connected",
        href: "https://www.icloud.com/notes"
      }),
      integrationCard({
        name: "Microsoft 365",
        description: "Calendar, email, and SharePoint",
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
        status: "connected",
        href: "https://www.office.com"
      }),
      integrationCard({
        name: "ChatGPT",
        description: "OpenAI's conversational AI",
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
        status: "available",
        href: "https://chat.openai.com"
      })
    ])
  ]);

  const recentActivity = el("div", { class: "dashboard-section" }, [
    el("div", { class: "dashboard-section__header" }, [
      el("h3", {}, ["Recent Activity"]),
      el("a", { href: "#/tasks", class: "dashboard-section__link" }, ["View all →"])
    ]),
    el("div", { class: "activity-list" }, [
      activityItem({ action: "Created task", detail: "Follow up with Phillipston clerk", time: "2 hours ago", icon: ICONS.task }),
      activityItem({ action: "Updated pipeline", detail: "Moved Ashby to Proposal stage", time: "Yesterday", icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>` }),
      activityItem({ action: "Recorded decision", detail: "VAULT pricing structure finalized", time: "2 days ago", icon: ICONS.record })
    ])
  ]);

  function activityItem({ action, detail, time, icon }) {
    return el("div", { class: "activity-item" }, [
      el("div", { class: "activity-item__icon", html: icon }),
      el("div", { class: "activity-item__content" }, [
        el("div", { class: "activity-item__action" }, [action]),
        el("div", { class: "activity-item__detail" }, [detail])
      ]),
      el("div", { class: "activity-item__time" }, [time])
    ]);
  }

  const content = el("div", { class: "dashboard" }, [
    hero,
    el("div", { class: "dashboard-grid" }, [
      el("div", { class: "dashboard-grid__main" }, [
        quickActions,
        integrations
      ]),
      el("div", { class: "dashboard-grid__side" }, [
        recentActivity
      ])
    ])
  ]);

  return {
    title: "Command Center",
    subtitle: "Your operational dashboard",
    content
  };
}
