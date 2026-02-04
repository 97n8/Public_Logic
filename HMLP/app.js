import { el, clear } from "./lib/dom.js";
import { getConfig, validateConfig } from "./lib/config.js";
import { createAuth, getSignedInEmail, isAllowedAccount } from "./lib/auth.js";
import { createSharePointClient } from "./lib/sharepoint.js";
import { ensureArchieveList } from "./lib/archieve.js";
import { getRoute, onRouteChange, setRoute } from "./lib/router.js";

// Pages
import { renderDashboard } from "./pages/dashboard.js";
import { renderToday } from "./pages/today.js";
import { renderTasks } from "./pages/tasks.js";
import { renderPipeline } from "./pages/pipeline.js";
import { renderProjects } from "./pages/projects.js";
import { renderEnvironments } from "./pages/environments.js";
import { renderPlaybooks } from "./pages/playbooks.js";
import { renderTools } from "./pages/tools.js";
import { renderSettings } from "./pages/settings.js";

// Phillipston standalone app
import { renderPhillipstonApp } from "./src/phillipston/app-standalone.js";

/* ================= ICONS ================= */
const ICONS = {
  dashboard: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>`,
  today: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  tasks: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
  pipeline: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>`,
  projects: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`,
  environments: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
  playbooks: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
  tools: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
  settings: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  logout: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`
};

/* ================= SHELL ================= */

function buildShell({ onLogout, who }) {
  const navItems = [
    ["/dashboard", "Command Center", "dashboard"],
    ["/today", "Today", "today"],
    ["/tasks", "Tasks", "tasks"],
    ["/pipeline", "Pipeline", "pipeline"],
    ["/projects", "Projects", "projects"],
    ["/environments", "Environments", "environments"],
    ["/playbooks", "Playbooks", "playbooks"],
    ["/tools", "Tools", "tools"],
    ["/settings", "Settings", "settings"]
  ];

  const nav = el("nav", { class: "nav" },
    navItems.map(([path, label, icon]) => {
      const a = el("a", { href: `#${path}`, html: `${ICONS[icon] || ""}<span>${label}</span>` });
      a.dataset.path = path;
      return a;
    })
  );

  const logo = el("div", { class: "sidebar__logo" }, [
    el("div", { class: "sidebar__logo-icon", html: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>` }),
    el("div", { class: "sidebar__logo-text" }, [
      el("span", { class: "sidebar__logo-name" }, ["PublicLogic"]),
      el("span", { class: "sidebar__logo-tag" }, ["OS"])
    ])
  ]);

  const userBlock = el("div", { class: "sidebar__user" }, [
    el("div", { class: "sidebar__user-info" }, [
      el("div", { class: "sidebar__user-name" }, [who.split("@")[0]]),
      el("div", { class: "sidebar__user-email" }, [who])
    ]),
    el("button", { class: "sidebar__logout", onclick: onLogout, title: "Sign out", html: ICONS.logout })
  ]);

  const sidebar = el("aside", { class: "sidebar" }, [
    logo,
    nav,
    userBlock
  ]);

  const titleEl = el("h1", { class: "main__title" });
  const subEl = el("p", { class: "main__sub" });
  const actionsEl = el("div", { class: "main__actions" });
  const contentEl = el("div", { class: "content" });

  const main = el("main", { class: "main" }, [
    el("div", { class: "main__top" }, [
      el("div", {}, [titleEl, subEl]),
      actionsEl
    ]),
    contentEl
  ]);

  return {
    shell: el("div", { class: "shell" }, [sidebar, main]),
    nav,
    titleEl,
    subEl,
    actionsEl,
    contentEl
  };
}

function setActiveNav(nav, path) {
  nav.querySelectorAll("a").forEach(a => {
    a.dataset.path === path
      ? a.setAttribute("aria-current", "page")
      : a.removeAttribute("aria-current");
  });
}

/* ================= ROUTES ================= */

const PAGES = {
  "/": renderDashboard,
  "/dashboard": renderDashboard,
  "/today": renderToday,
  "/tasks": renderTasks,
  "/pipeline": renderPipeline,
  "/projects": renderProjects,
  "/environments": renderEnvironments,
  "/playbooks": renderPlaybooks,
  "/tools": renderTools,
  "/settings": renderSettings
};

// Phillipston is a standalone app - bypasses shell
const STANDALONE_APPS = {
  "/phillipston": renderPhillipstonApp
};

/* ================= MAIN ================= */

async function main() {
  const app = document.getElementById("app");
  clear(app);

  const cfg = getConfig();
  const errors = validateConfig(cfg);

  if (errors.length) {
    app.appendChild(
      el("div", { class: "boot boot--error" }, [
        el("div", { class: "boot__icon", html: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>` }),
        el("h2", {}, ["Configuration Error"]),
        el("pre", {}, [errors.join("\n")])
      ])
    );
    return;
  }

  const auth = createAuth();
  await auth.init();

  const acct = auth.getAccount();
  if (!acct) {
    app.appendChild(
      el("div", { class: "boot" }, [
        el("div", { class: "boot__logo" }, [
          el("div", { class: "boot__logo-icon", html: `<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>` }),
          el("h1", {}, ["PublicLogic OS"])
        ]),
        el("p", {}, ["Municipal operations platform"]),
        el("button", { class: "btn btn--primary btn--lg", onclick: () => auth.login() }, ["Sign in with Microsoft"])
      ])
    );
    return;
  }

  if (!isAllowedAccount(acct, cfg.access.allowedEmails)) {
    app.appendChild(
      el("div", { class: "boot boot--error" }, [
        el("h2", {}, ["Access Denied"]),
        el("p", {}, [getSignedInEmail(acct)]),
        el("button", { class: "btn", onclick: () => auth.logout() }, ["Sign out"])
      ])
    );
    return;
  }

  const sp = createSharePointClient(auth);
  const userEmail = getSignedInEmail(acct);

  if (cfg.sharepoint?.archieve?.enabled) {
    try { await ensureArchieveList(sp, cfg); } catch {}
  }

  // Check for standalone app routes
  const { path } = getRoute();
  if (STANDALONE_APPS[path]) {
    const appContent = await STANDALONE_APPS[path]({ cfg, auth, sp, userEmail });
    clear(app);
    app.appendChild(appContent);
    
    onRouteChange(async () => {
      const { path: newPath } = getRoute();
      if (STANDALONE_APPS[newPath]) {
        const content = await STANDALONE_APPS[newPath]({ cfg, auth, sp, userEmail });
        clear(app);
        app.appendChild(content);
      } else {
        // Reload to get back to shell
        location.reload();
      }
    });
    return;
  }

  // Regular shell mode
  const shell = buildShell({
    who: userEmail,
    onLogout: () => auth.logout()
  });

  clear(app);
  app.appendChild(shell.shell);

  async function renderRoute() {
    const { path, query } = getRoute();
    
    // Check if navigating to standalone app
    if (STANDALONE_APPS[path]) {
      const content = await STANDALONE_APPS[path]({ cfg, auth, sp, userEmail });
      clear(app);
      app.appendChild(content);
      return;
    }

    const route = path && PAGES[path] ? path : "/dashboard";
    const ctx = { cfg, auth, sp, userEmail, route: { path, query }, refresh: renderRoute };
    const page = await PAGES[route](ctx);

    setActiveNav(shell.nav, route);
    shell.titleEl.textContent = page.title || "";
    shell.subEl.textContent = page.subtitle || "";

    clear(shell.actionsEl);
    if (page.actions?.length) {
      page.actions.forEach(a => {
        const btn = el("button", {
          class: `btn ${a.variant ? `btn--${a.variant}` : ""}`,
          onclick: a.onClick
        }, [a.label]);
        shell.actionsEl.appendChild(btn);
      });
    }

    clear(shell.contentEl);
    shell.contentEl.appendChild(page.content);
  }

  if (!location.hash) setRoute("/dashboard");

  onRouteChange(renderRoute);
  await renderRoute();
}

main();
