// main.js (or app.js / index.js — your main entry point)
import { el, clear } from "./lib/dom.js";
import { getConfig, validateConfig } from "./lib/config.js";
import { createAuth, getSignedInEmail, isAllowedAccount } from "./lib/auth.js";
import { createSharePointClient } from "./lib/sharepoint.js";
import { ensureArchieveList } from "./lib/archieve.js";
import { getRoute, onRouteChange, setRoute } from "./lib/router.js";

// Pages
import { renderDashboard } from "./pages/dashboard.js";
import { renderToday } from "./pages/today.js";
import { renderAgenda } from "./pages/agenda.js";
import { renderTasks } from "./pages/tasks.js";
import { renderPipeline } from "./pages/pipeline.js";
import { renderProjects } from "./pages/projects.js";
import { renderEnvironments } from "./pages/environments.js";
import { renderPlaybooks } from "./pages/playbooks.js";
import { renderTools } from "./pages/tools.js";
import { renderSettings } from "./pages/settings.js";

// PHILLIPSTON REMOVED - Uncomment these when you upload the src/phillipston/ folder:
// import { renderPhillipstonPrr } from "./pages/phillipston-prr.js";
// import { PhillipstonShell } from "./src/phillipston/PhillipstonApp.js";

/* =========================
   ICONS
   ========================= */
const ICONS = {
  dashboard: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>`,
  today: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  tasks: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
  pipeline: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>`,
  projects: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`,
  environments: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
  playbooks: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
  tools: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
  settings: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  logout: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`
};

/* =========================
   UI HELPERS
   ========================= */
function actionNode(a) {
  if (a.href) {
    return el(
      "a",
      {
        class: ["btn", a.variant ? `btn--${a.variant}` : ""].filter(Boolean).join(" "),
        href: a.href,
        target: "_blank",
        rel: "noreferrer"
      },
      [a.label]
    );
  }
  return el(
    "button",
    {
      class: ["btn", a.variant ? `btn--${a.variant}` : ""].filter(Boolean).join(" "),
      type: "button",
      onclick: a.onClick
    },
    [a.label]
  );
}

/* =========================
   MOBILE NAVIGATION
   ========================= */
function createMobileNav(sidebar) {
  const toggle = el("button", { class: "mobile-nav-toggle", "aria-label": "Toggle navigation" }, [
    el("span"),
    el("span"),
    el("span")
  ]);

  const overlay = el("div", { class: "sidebar-overlay" });

  const toggleNav = () => {
    toggle.classList.toggle("active");
    sidebar.classList.toggle("active");
    overlay.classList.toggle("active");
    document.body.style.overflow = sidebar.classList.contains("active") ? "hidden" : "";
  };

  const closeNav = () => {
    toggle.classList.remove("active");
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
    document.body.style.overflow = "";
  };

  toggle.addEventListener("click", toggleNav);
  overlay.addEventListener("click", closeNav);

  sidebar.querySelectorAll(".nav a").forEach(link => {
    link.addEventListener("click", closeNav);
  });

  return { toggle, overlay, closeNav };
}

/* =========================
   BOOT SCREENS
   ========================= */
function renderSetup(appEl, { errors = [] } = {}) {
  clear(appEl);
  appEl.appendChild(
    el("div", { class: "boot" }, [
      el("div", { class: "brand" }, [
        el("div", { class: "brand__mark" }, ["PL"]),
        el("div", {}, [
          el("div", { class: "brand__name" }, ["PublicLogic OS"]),
          el("div", { class: "brand__tag" }, ["Private operations portal"])
        ])
      ]),
      el("div", { class: "hr" }),
      el("div", { class: "notice" }, [
        "This OS is not configured yet.",
        el("div", { class: "small", style: "margin-top:8px;" }, [
          "Check config.js for required Microsoft 365 and SharePoint settings."
        ])
      ]),
      errors.length
        ? el(
            "div",
            { class: "error", style: "margin-top:12px; white-space:pre-wrap;" },
            [errors.join("\n")]
          )
        : null
    ])
  );
}

function renderSignedOut(appEl, { onLogin }) {
  clear(appEl);
  appEl.appendChild(
    el("div", { class: "boot" }, [
      el("div", { class: "brand" }, [
        el("div", { class: "brand__mark" }, ["PL"]),
        el("div", {}, [
          el("div", { class: "brand__name" }, ["PublicLogic OS"]),
          el("div", { class: "brand__tag" }, ["Sign in with Microsoft 365"])
        ])
      ]),
      el("div", { class: "hr" }),
      el(
        "button",
        { class: "btn btn--primary", onclick: onLogin },
        ["Sign In"]
      )
    ])
  );
}

function renderNotAllowed(appEl, { email, allowedEmails, onLogout }) {
  clear(appEl);
  appEl.appendChild(
    el("div", { class: "boot" }, [
      el("div", { class: "brand" }, [
        el("div", { class: "brand__mark" }, ["PL"]),
        el("div", {}, [
          el("div", { class: "brand__name" }, ["Access denied"]),
          el("div", { class: "brand__tag" }, ["This portal is private"])
        ])
      ]),
      el("div", { class: "hr" }),
      el("div", { class: "error" }, [
        `Signed in as ${email}`,
        el("div", { class: "small", style: "margin-top:8px;" }, [
          `Allowed: ${(allowedEmails || []).join(", ")}`
        ])
      ]),
      el(
        "button",
        { class: "btn btn--danger", onclick: onLogout },
        ["Sign Out"]
      )
    ])
  );
}

/* =========================
   SHELL (desktop + mobile nav)
   ========================= */
function buildShell({ onLogout, whoText }) {
  const navItems = [
    { path: "/dashboard", label: "Command Center" },
    { path: "/today", label: "Today" },
    { path: "/agenda", label: "Agenda" },
    { path: "/tasks", label: "Tasks" },
    { path: "/pipeline", label: "Pipeline" },
    { path: "/projects", label: "Projects" },
    { path: "/environments", label: "Environments" },
    { path: "/playbooks", label: "Playbooks" },
    { path: "/tools", label: "Tools" },
    { path: "/settings", label: "Settings" }
  ];

  const nav = el(
    "nav",
    { class: "nav" },
    navItems.map(n => {
      const a = el("a", { href: `#${n.path}` }, [n.label]);
      a.dataset.path = n.path;
      return a;
    })
  );

  const sidebar = el("aside", { class: "sidebar" }, [
    el("div", { class: "sidebar__top" }, [
      el("div", { class: "sidebar__who" }, [
        el("b", {}, ["Signed in"]),
        el("span", {}, [whoText])
      ]),
      el("button", { class: "btn", onclick: onLogout }, ["Sign Out"])
    ]),
    nav
  ]);

  const titleEl = el("h1", { class: "h1" });
  const subEl = el("p", { class: "sub" });
  const actionsEl = el("div", { class: "main__actions" });
  const contentEl = el("div", { class: "content" });

  const main = el("main", { class: "main" }, [
    el("div", { class: "main__top" }, [
      el("div", {}, [titleEl, subEl]),
      actionsEl
    ]),
    contentEl
  ]);

  // Mobile nav controls
  const mobileNav = createMobileNav(sidebar);

  const shell = el("div", { class: "shell" }, [sidebar, main]);

  return {
    shell,
    sidebar,
    nav,
    titleEl,
    subEl,
    actionsEl,
    contentEl,
    mobileToggle: mobileNav.toggle,
    mobileOverlay: mobileNav.overlay,
    closeMobileNav: mobileNav.closeNav
  };
}

function setActiveNav(navEl, path) {
  for (const a of navEl.querySelectorAll("a")) {
    a.dataset.path === path
      ? a.setAttribute("aria-current", "page")
      : a.removeAttribute("aria-current");
  }
}

/* =========================
   ROUTING & PAGE MAP
   ========================= */
const PAGES = {
  "/": renderDashboard,
  "/dashboard": renderDashboard,
  "/today": renderToday,
  "/agenda": renderAgenda,
  "/tasks": renderTasks,
  "/pipeline": renderPipeline,
  "/projects": renderProjects,
  "/environments": renderEnvironments,
  "/playbooks": renderPlaybooks,
  "/tools": renderTools,
  "/settings": renderSettings
  // PHILLIPSTON REMOVED - Uncomment when you upload src/phillipston/ folder:
  // "/phillipston-prr": renderPhillipstonPrr
};

// PHILLIPSTON REMOVED - Uncomment when you upload src/phillipston/ folder:
// const STANDALONE_APPS = {
//   "/phillipston": (ctx) => PhillipstonShell(ctx)
// };

/* =========================
   MAIN APP ENTRY
   ========================= */
async function main() {
  const appEl = document.getElementById("app");
  if (!appEl) {
    console.error("No #app element found");
    return;
  }

  const cfg = getConfig();
  const errors = validateConfig(cfg);

  if (errors.length) {
    renderSetup(appEl, { errors });
    return;
  }

  const auth = createAuth();
  await auth.init();

  const account = auth.getAccount();

  if (!account) {
    renderSignedOut(appEl, { onLogin: () => auth.login() });
    return;
  }

  if (!isAllowedAccount(account, cfg.access.allowedEmails)) {
    renderNotAllowed(appEl, {
      email: getSignedInEmail(account),
      allowedEmails: cfg.access.allowedEmails,
      onLogout: () => auth.logout()
    });
    return;
  }

  const userEmail = getSignedInEmail(account);
  const sp = createSharePointClient(auth);

  // One-time ARCHIEVE list setup
  if (cfg.sharepoint?.archieve?.enabled) {
    try {
      await ensureArchieveList(sp, cfg);
    } catch (err) {
      console.warn("Archieve list setup failed:", err);
    }
  }

  // Build shell UI
  const shell = buildShell({
    onLogout: () => auth.logout(),
    whoText: userEmail
  });

  clear(appEl);
  appEl.appendChild(shell.shell);

  // Add mobile nav controls
  document.body.appendChild(shell.mobileToggle);
  document.body.appendChild(shell.mobileOverlay);

  const ctx = {
    cfg,
    auth,
    sp,
    userEmail,
    route: getRoute(),
    refresh: async () => renderRoute(),
    closeMobileNav: shell.closeMobileNav
  };

  async function renderRoute() {
    const path = getRoute().path || "/dashboard";

    // PHILLIPSTON REMOVED - Uncomment when you upload src/phillipston/ folder:
    // Check for standalone app
    // if (STANDALONE_APPS && STANDALONE_APPS[path]) {
    //   clear(shell.contentEl);
    //   shell.titleEl.textContent = "";
    //   shell.subEl.textContent = "";
    //   clear(shell.actionsEl);
    //   const standaloneContent = STANDALONE_APPS[path](ctx);
    //   shell.contentEl.appendChild(standaloneContent);
    //   shell.closeMobileNav();
    //   return;
    // }

    // Regular page
    const pageFn = PAGES[path] || renderDashboard;
    const page = await pageFn(ctx);

    setActiveNav(shell.nav, path);

    shell.titleEl.textContent = page.title || "";
    shell.subEl.textContent = page.subtitle || "";

    clear(shell.actionsEl);
    (page.actions || []).forEach(a => {
      shell.actionsEl.appendChild(actionNode(a));
    });

    clear(shell.contentEl);
    shell.contentEl.appendChild(page.content);

    shell.closeMobileNav();
  }

  if (!location.hash) setRoute("/dashboard");

  onRouteChange(renderRoute);
  await renderRoute();
}

main().catch(err => {
  console.error("App startup failed:", err);
  const appEl = document.getElementById("app");
  if (appEl) {
    renderSetup(appEl, { errors: [String(err.message || err)] });
  }
});
