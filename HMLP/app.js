// main.js — FINAL, SAFE, ROUTE-LOCKED

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
import { renderPhillipstonPrr } from "./pages/phillipston-prr.js";
import { renderPlaybooks } from "./pages/playbooks.js";
import { renderTools } from "./pages/tools.js";
import { renderSettings } from "./pages/settings.js";

/* ================= SHELL ================= */

function buildShell({ onLogout, who }) {
  const navItems = [
    ["/dashboard", "Command Center"],
    ["/today", "Today"],
    ["/tasks", "Tasks"],
    ["/pipeline", "Pipeline"],
    ["/projects", "Projects"],
    ["/environments", "Environments"],
    ["/playbooks", "Playbooks"],
    ["/tools", "Tools"],
    ["/settings", "Settings"]
  ];

  const nav = el("nav", { class: "nav" },
    navItems.map(([path, label]) => {
      const a = el("a", { href: `#${path}` }, [label]);
      a.dataset.path = path;
      return a;
    })
  );

  const sidebar = el("aside", { class: "sidebar" }, [
    el("div", { class: "sidebar__who" }, [
      el("b", {}, ["Signed in"]),
      el("span", {}, [who])
    ]),
    el("button", { class: "btn", onclick: onLogout }, ["Sign Out"]),
    nav
  ]);

  const titleEl = el("h1", { class: "h1" });
  const subEl = el("p", { class: "sub" });
  const contentEl = el("div", { class: "content" });

  const main = el("main", { class: "main" }, [
    el("div", { class: "main__top" }, [titleEl, subEl]),
    contentEl
  ]);

  return {
    shell: el("div", { class: "shell" }, [sidebar, main]),
    nav,
    titleEl,
    subEl,
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
  "/phillipston-prr": renderPhillipstonPrr,
  "/playbooks": renderPlaybooks,
  "/tools": renderTools,
  "/settings": renderSettings
};

/* ================= MAIN ================= */

async function main() {
  const app = document.getElementById("app");
  clear(app);

  const cfg = getConfig();
  const errors = validateConfig(cfg);

  if (errors.length) {
    app.appendChild(
      el("div", { class: "boot error" }, [
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
        el("h2", {}, ["Sign in required"]),
        el("button", {
          class: "btn btn--primary",
          onclick: () => auth.login()
        }, ["Sign In"])
      ])
    );
    return;
  }

  if (!isAllowedAccount(acct, cfg.access.allowedEmails)) {
    app.appendChild(
      el("div", { class: "boot error" }, [
        el("h2", {}, ["Access denied"]),
        el("p", {}, [getSignedInEmail(acct)])
      ])
    );
    return;
  }

  const sp = createSharePointClient(auth);

  if (cfg.sharepoint?.archieve?.enabled) {
    try {
      await ensureArchieveList(sp, cfg);
    } catch {}
  }

  const shell = buildShell({
    who: getSignedInEmail(acct),
    onLogout: () => auth.logout()
  });

  clear(app);
  app.appendChild(shell.shell);

  async function renderRoute() {
    const { path } = getRoute();
    const route = path && PAGES[path] ? path : "/dashboard";

    const page = await PAGES[route]({ cfg, auth, sp });

    setActiveNav(shell.nav, route);
    shell.titleEl.textContent = page.title || "";
    shell.subEl.textContent = page.subtitle || "";

    clear(shell.contentEl);
    shell.contentEl.appendChild(page.content);
  }

  if (!location.hash) setRoute("/dashboard");

  onRouteChange(renderRoute);
  await renderRoute();
}

main();
