import { el, clear } from "./lib/dom.js";
import { getConfig, validateConfig } from "./lib/config.js";
import { createAuth, getSignedInEmail, isAllowedAccount } from "./lib/auth.js";
import { createSharePointClient } from "./lib/sharepoint.js";
import { getRoute, onRouteChange, setRoute } from "./lib/router.js";
import { ensureArchieveList } from "./lib/archieve.js";

import { renderDashboard } from "./pages/dashboard.js";
import { renderToday } from "./pages/today.js";
import { renderTasks } from "./pages/tasks.js";
import { renderPipeline } from "./pages/pipeline.js";
import { renderProjects } from "./pages/projects.js";
import { renderPlaybooks } from "./pages/playbooks.js";
import { renderTools } from "./pages/tools.js";
import { renderSettings } from "./pages/settings.js";

/* ---------- helpers ---------- */

function actionNode(a) {
  if (a.href) {
    return el(
      "a",
      {
        class: ["btn", a.variant ? `btn--${a.variant}` : ""]
          .filter(Boolean)
          .join(" "),
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
      class: ["btn", a.variant ? `btn--${a.variant}` : ""]
        .filter(Boolean)
        .join(" "),
      type: "button",
      onclick: a.onClick
    },
    [a.label]
  );
}

/* ---------- setup / error ---------- */

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
      el("div", { class: "error" }, errors)
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
      el("div", { class: "error" }, [
        `Signed in as ${email}, but this account is not allowed.`,
        el("div", { class: "small" }, [
          `Allowed: ${allowedEmails.join(", ")}`
        ])
      ]),
      el("button", { class: "btn btn--danger", onclick: onLogout }, ["Sign Out"])
    ])
  );
}

/* ---------- shell ---------- */

function buildShell({ onLogout, whoText }) {
  const navItems = [
    { path: "/dashboard", label: "Command Center" },
    { path: "/today", label: "Today" },
    { path: "/tasks", label: "Tasks" },
    { path: "/pipeline", label: "Pipeline" },
    { path: "/projects", label: "Projects" },
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

  return {
    shell: el("div", { class: "shell" }, [sidebar, main]),
    nav,
    titleEl,
    subEl,
    actionsEl,
    contentEl
  };
}

function setActiveNav(navEl, path) {
  for (const a of navEl.querySelectorAll("a")) {
    if (a.dataset.path === path) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  }
}

/* ---------- routing ---------- */

const PAGES = {
  "/": renderDashboard,
  "/dashboard": renderDashboard,
  "/today": renderToday,
  "/tasks": renderTasks,
  "/pipeline": renderPipeline,
  "/projects": renderProjects,
  "/playbooks": renderPlaybooks,
  "/tools": renderTools,
  "/settings": renderSettings
};

/* ---------- main ---------- */

async function main() {
  const appEl = document.getElementById("app");

  const cfg = getConfig();
  const configErrors = validateConfig(cfg);

  // allow boot even if lists are missing
  const fatalErrors = configErrors.filter(
    e => !e.startsWith("sharepoint.lists")
  );

  if (fatalErrors.length > 0) {
    renderSetup(appEl, { errors: fatalErrors });
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

  // 🔑 AUTO-PROVISION ARCHIEVE
  try {
    await ensureArchieveList(sp);
  } catch (e) {
    renderSetup(appEl, {
      errors: ["ARCHIEVE initialization failed", String(e)]
    });
    return;
  }

  const shell = buildShell({
    onLogout: () => auth.logout(),
    whoText: userEmail
  });

  clear(appEl);
  appEl.appendChild(shell.shell);

  const ctx = {
    cfg,
    auth,
    sp,
    userEmail,
    route: getRoute(),
    refresh: async () => renderRoute()
  };

  async function renderRoute() {
    ctx.route = getRoute();
    const path = ctx.route.path || "/";
    const renderer = PAGES[path] || renderDashboard;

    setActiveNav(shell.nav, path === "/" ? "/dashboard" : path);

    const page = await renderer(ctx);

    shell.titleEl.textContent = page.title || "";
    shell.subEl.textContent = page.subtitle || "";

    shell.actionsEl.innerHTML = "";
    for (const a of page.actions || []) {
      shell.actionsEl.appendChild(actionNode(a));
    }

    clear(shell.contentEl);
    shell.contentEl.appendChild(page.content);
  }

  if (!window.location.hash) setRoute("/dashboard");
  onRouteChange(ctx.refresh);
  await renderRoute();
}

main().catch(err => {
  const appEl = document.getElementById("app");
  renderSetup(appEl, { errors: [String(err)] });
});
