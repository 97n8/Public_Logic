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

function quickActionCard({ icon, title, description, onClick, href, variant = "" }) {
  const classes = ["card", "quick-action", variant ? `quick-action--${variant}` : ""]
    .filter(Boolean)
    .join(" ");

  const content = [
    el("div", { class: "quick-action__icon" }, [icon]),
    el("div", { class: "quick-action__content" }, [
      el("div", { class: "quick-action__title" }, [title]),
      el("div", { class: "quick-action__description" }, [description])
    ])
  ];

  if (href) {
    return el("a", { class: classes, href, target: "_blank", rel: "noreferrer" }, content);
  }

  const card = el("div", { class: classes }, content);
  if (onClick) {
    card.style.cursor = "pointer";
    card.addEventListener("click", onClick);
  }
  return card;
}

function documentCard({ title, url, description, icon = "📄" }) {
  return el("a", {
    class: "doc-card",
    href: url,
    target: "_blank",
    rel: "noreferrer"
  }, [
    el("div", { class: "doc-card__icon" }, [icon]),
    el("div", { class: "doc-card__content" }, [
      el("div", { class: "doc-card__title" }, [title]),
      description && el("div", { class: "doc-card__description" }, [description])
    ].filter(Boolean)),
    el("div", { class: "doc-card__arrow" }, ["→"])
  ]);
}

function statCard({ label, value, trend, variant = "" }) {
  const classes = ["stat-card", variant ? `stat-card--${variant}` : ""]
    .filter(Boolean)
    .join(" ");

  return el("div", { class: classes }, [
    el("div", { class: "stat-card__label" }, [label]),
    el("div", { class: "stat-card__value" }, [value]),
    trend && el("div", { class: "stat-card__trend" }, [trend])
  ].filter(Boolean));
}

export async function renderDashboard(ctx) {
  const cfg = getConfig() || {};
  const links = getLinks(cfg) || {};
  const { sp } = ctx;

  // Get live operational stats
  let taskCount = 0;
  let pipelineCount = 0;
  let projectCount = 0;

  try {
    if (cfg.sharepoint?.lists?.tasks) {
      const tasks = await sp.listItems(cfg.sharepoint.lists.tasks, { top: 100 });
      taskCount = tasks.filter(t => t.Status !== "Done").length;
    }
  } catch (e) {
    console.warn("Could not load tasks:", e);
  }

  try {
    if (cfg.sharepoint?.lists?.pipeline) {
      const pipeline = await sp.listItems(cfg.sharepoint.lists.pipeline, { top: 100 });
      pipelineCount = pipeline.filter(p => !["Closed Won", "Closed Lost"].includes(p.Stage)).length;
    }
  } catch (e) {
    console.warn("Could not load pipeline:", e);
  }

  try {
    if (cfg.sharepoint?.lists?.projects) {
      const projects = await sp.listItems(cfg.sharepoint.lists.projects, { top: 100 });
      projectCount = projects.filter(p => p.Status === "Active").length;
    }
  } catch (e) {
    console.warn("Could not load projects:", e);
  }

  // Hero section
  const hero = el("div", { class: "dashboard-hero" }, [
    el("div", { class: "dashboard-hero__content" }, [
      el("h1", { class: "dashboard-hero__title" }, ["PublicLogic Operations"]),
      el("p", { class: "dashboard-hero__subtitle" }, [
        "Municipal consulting powered by institutional memory. Record decisions, launch work, and keep Massachusetts towns running."
      ])
    ]),
    el("div", { class: "dashboard-hero__stats" }, [
      statCard({ label: "Active Commitments", value: String(taskCount), variant: "accent" }),
      statCard({ label: "Municipal Pipeline", value: String(pipelineCount), variant: "gold" }),
      statCard({ label: "Live Engagements", value: String(projectCount), variant: "mint" })
    ])
  ]);

  // Quick actions
  const quickActions = el("div", {}, [
    el("h2", { class: "section-title" }, ["Capture & Create"]),
    el("div", { class: "quick-actions-grid" }, [
      quickActionCard({
        icon: "📝",
        title: "Record Decision",
        description: "Capture meeting outcomes, commitments, or policy calls for ARCHIEVE",
        onClick: () => openRecordConsole(ctx),
        variant: "primary"
      }),
      quickActionCard({
        icon: "📄",
        title: "New Page",
        href: links.createPage || `https://publiclogic978.sharepoint.com/sites/PL/_layouts/15/CreatePage.aspx`,
        description: "Create formatted documentation in SharePoint"
      }),
      quickActionCard({
        icon: "📊",
        title: "SharePoint Site",
        href: links.site || `https://publiclogic978.sharepoint.com/sites/PL`,
        description: "Full access to lists, libraries, and site administration"
      }),
      links.archiveList && quickActionCard({
        icon: "🗄️",
        title: "ARCHIEVE",
        href: links.archiveList,
        description: "Authoritative record collection - institutional memory that survives turnover"
      })
    ].filter(Boolean))
  ]);

  // Documents & Resources
  const documents = el("div", {}, [
    el("h2", { class: "section-title" }, ["Municipal Workspaces"]),
    el("div", { class: "doc-grid" }, [
      documentCard({
        icon: "📁",
        title: "CASE Space 1",
        description: "Primary engagement documents and deliverables",
        url: `https://publiclogic978.sharepoint.com/sites/PL/Shared%20Documents/Forms/AllItems.aspx`
      }),
      documentCard({
        icon: "📋",
        title: "Playbooks & SOPs",
        description: "How PublicLogic runs - frameworks and operating procedures",
        url: `${links.site}/SitePages/Playbooks.aspx`
      }),
      documentCard({
        icon: "🏛️",
        title: "Town Files",
        description: "Client documentation organized by municipality",
        url: `https://publiclogic978.sharepoint.com/sites/PL/Shared%20Documents/Clients`
      }),
      documentCard({
        icon: "💰",
        title: "Grant Materials",
        description: "Community Compact IT, ARPA, and other funding applications",
        url: `https://publiclogic978.sharepoint.com/sites/PL/Shared%20Documents/Grants`
      }),
      documentCard({
        icon: "🎯",
        title: "Marketing & Sales",
        description: "Discovery one-pagers, proposals, and case studies",
        url: `https://publiclogic978.sharepoint.com/sites/PL/Shared%20Documents/Marketing`
      }),
      documentCard({
        icon: "⚙️",
        title: "Business Operations",
        description: "Contracts, policies, and administrative documentation",
        url: `https://publiclogic978.sharepoint.com/sites/PL/Shared%20Documents/Internal`
      })
    ])
  ]);

  // Microsoft 365 Quick Links
  const m365 = el("div", {}, [
    el("h2", { class: "section-title" }, ["Microsoft 365 Tools"]),
    el("div", { class: "m365-grid" }, [
      documentCard({
        icon: "📧",
        title: "Outlook Mail",
        url: "https://outlook.office.com/mail/"
      }),
      documentCard({
        icon: "📅",
        title: "Calendar",
        url: "https://outlook.office.com/calendar/"
      }),
      documentCard({
        icon: "💬",
        title: "Teams",
        url: "https://teams.microsoft.com/"
      }),
      documentCard({
        icon: "☁️",
        title: "OneDrive",
        url: "https://www.office.com/launch/onedrive"
      })
    ])
  ]);

  const content = el("div", { class: "dashboard-container" }, [
    hero,
    el("div", { class: "dashboard-content" }, [
      quickActions,
      documents,
      m365
    ])
  ]);

  return {
    title: "PublicLogic Operations",
    subtitle: formatDateHeading(),
    actions: [],
    content
  };
}
