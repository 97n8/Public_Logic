// main.js — PublicLogic OS (Production Entry Point)

/* =========================
   IMPORTS
   ========================= */
import { el, clear } from "./lib/dom.js";
import { getConfig, validateConfig } from "./lib/config.js";
import { createAuth, getSignedInEmail, isAllowedAccount } from "./lib/auth.js";
import { createSharePointClient } from "./lib/sharepoint.js";
import { ensureArchieveList } from "./lib/archieve.js";
import { getRoute, onRouteChange, setRoute } from "./lib/router.js";

import { renderDashboard } from "./pages/dashboard.js";
import { renderToday } from "./pages/today.js";
import { renderTasks } from "./pages/tasks.js";
import { renderPipeline } from "./pages/pipeline.js";
import { renderProjects } from "./pages/projects.js";
import { renderEnvironments } from "./pages/environments.js";
import { renderPlaybooks } from "./pages/playbooks.js";
import { renderTools } from "./pages/tools.js";
import { renderSettings } from "./pages/settings.js";

// Environment pages
import { renderPhillipstonPrr } from "./pages/phillipston-prr.js";

/* =========================
   ROUTE CLASSIFICATION
   ========================= */
const ENVIRONMENT_ROUTES = new Set([
  "/phillipston-prr"
]);

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

  const openNav = () => {
    toggle.classList.add("active");
    sidebar.classList.add("active");
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  const closeNav = () => {
    toggle.classList.remove("active");
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
    document.body.style.overflow = "";
  };

  toggle.addEventListener("click", () => {
    sidebar.classList.contains("active") ? closeNav() : openNav();
  });

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
        ? el("div", { class: "error", style: "margin-top:12px; white-space:pre-wrap;" }, [
            errors.join("\n")
          ])
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
      el("button", { class: "btn btn--primary", onclick: onLogin }, ["Sign In"])
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
      el("button", { class: "btn btn--danger", onclick: onLogout }, ["Sign Out"])
    ])
  );
}

/* =========================
   SHELL
   ========================= */
function buildShell({ onLogout, whoText }) {
  const navItems = [
    { path: "/dashboard", label: "Command Center" },
    { path: "/today", label: "Today" },
    { path: "/tasks", label: "Tasks" },
    { path: "/pipeline", label: "Pipeline" },
    { path: "/projects", label: "Projects" },
    { path: "/environments", label: "Environments" },
    { path: "/playbooks", label: "Playbooks" },
    { path: "/tools", label: "Tools" },
    { path: "/settings", label: "Settings" }
  ];

  const nav = el("nav", { class: "nav" }, navItems.map(n => {
    const a = el("a", { href: `#${n.path}` }, [n.label]);
    a.dataset.path = n.path;
    return a;
  }));

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

  const mobileNav = createMobileNav(sidebar);
  const shell = el("div", { class: "shell" }, [sidebar, main]);

  shell.appendChild(mobileNav.toggle);
  shell.appendChild(mobileNav.overlay);

  return {
    shell,
    nav,
    titleEl,
    subEl,
    actionsEl,
    contentEl,
    closeMobileNav: mobileNav.closeNav
  };
}

function setActiveNav(navEl, path) {
  navEl.querySelectorAll("a").forEach(a => {
    a.dataset.path === path
      ? a.setAttribute("aria-current", "page")
      : a.removeAttribute("aria-current");
  });
}

/* =========================
   ROUTES
   ========================= */
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
  "/settings": renderSettings,
  "/phillipston-prr": renderPhillipstonPrr
};

/* =========================
   MAIN
   ========================= */
async function main() {
  const appEl = document.getElementById("app");
  if (!appEl) return;

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

  const sp = createSharePointClient(auth);

  if (cfg.sharepoint?.archieve?.enabled) {
    try {
      await ensureArchieveList(sp, cfg);
    } catch (err) {
      console.warn("Archieve list setup failed:", err);
    }
  }

  const shell = buildShell({
    onLogout: () => auth.logout(),
    whoText: getSignedInEmail(account)
  });

  clear(appEl);
  appEl.appendChild(shell.shell);

  async function renderRoute() {
    const path = getRoute().path || "/dashboard";
    const pageFn = PAGES[path] || renderDashboard;
    const isEnvironment = ENVIRONMENT_ROUTES.has(path);

    shell.shell.dataset.environment = isEnvironment ? "1" : "0";

    const page = await pageFn({ cfg, auth, sp });

    setActiveNav(shell.nav, path);

    shell.titleEl.textContent = page.title || "";
    shell.subEl.textContent = page.subtitle || "";

    clear(shell.actionsEl);
    (page.actions || []).forEach(a => shell.actionsEl.appendChild(actionNode(a)));

    clear(shell.contentEl);
    shell.contentEl.appendChild(page.content);

    if (!isEnvironment) shell.closeMobileNav();
  }

  if (!location.hash) setRoute("/dashboard");
  onRouteChange(renderRoute);
  await renderRoute();
}

main().catch(err => {
  console.error(err);
});
