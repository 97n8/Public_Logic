import { el } from "../lib/dom.js";
import { pill } from "../lib/ui.js";
import {
  formatLocalDateTime,
  formatLocalTime,
  startOfToday,
  endOfToday
} from "../lib/time.js";
import { getMyCalendarView } from "../lib/m365.js";
import {
  openCreateTaskModal,
  openCreateLeadModal,
  openCreateProjectModal
} from "../lib/forms.js";
import { openRecordConsole } from "../lib/record-console.js";

/* ---------------------------
   Small helpers
---------------------------- */

function safeCountLabel(n, singular, plural) {
  return n === 1 ? `${n} ${singular}` : `${n} ${plural}`;
}

function kpiCard({ title, value, label, kind = "mint" }) {
  return el("div", { class: "card" }, [
    el("h3", {}, [title]),
    el("div", { class: "kpi" }, [
      el("div", { class: "kpi__value" }, [String(value)]),
      el("div", { class: "kpi__label" }, [label])
    ]),
    el("div", { style: "margin-top:10px;" }, [
      pill("Live", kind)
    ])
  ]);
}

function listLine(left, right) {
  return el("div", {
    style: `
      display:flex;
      justify-content:space-between;
      gap:12px;
      padding:10px 0;
      border-bottom:1px solid var(--line);
    `
  }, [
    el("div", { style: "font-weight:700;" }, [left]),
    el("div", { style: "font-size:12px; color:var(--muted);" }, [right])
  ]);
}

/* ---------------------------
   MAIN RENDER
---------------------------- */

async function renderDashboard() {
  const app = document.getElementById("app");
  app.innerHTML = "";

  const header = el("div", { class: "page-header" }, [
    el("h1", {}, ["PublicLogic OS"]),
    el("div", { class: "small" }, ["HMLP • Human–Machine Learning Pipeline"])
  ]);

  const grid = el("div", { class: "grid" });

  /* Mock-safe defaults (so page always renders) */
  let events = [];
  let tasks = [];
  let pipeline = [];
  let projects = [];

  try {
    // Comment these back in when auth context is present
    // events = await getMyCalendarView(auth, { start: startOfToday(), end: endOfToday(), top: 6 });
  } catch {}

  const openTasks = tasks.filter(t => String(t.Status || "").toLowerCase() !== "done");
  const followups = pipeline.filter(l => !String(l.Stage || "").toLowerCase().includes("closed"));
  const activeProjects = projects.filter(p => String(p.Status || "").toLowerCase() === "active");

  grid.append(
    kpiCard({
      title: "Open Tasks",
      value: openTasks.length,
      label: safeCountLabel(openTasks.length, "commitment", "commitments")
    }),
    kpiCard({
      title: "Pipeline",
      value: followups.length,
      label: safeCountLabel(followups.length, "active lead", "active leads"),
      kind: "gold"
    }),
    kpiCard({
      title: "Projects",
      value: activeProjects.length,
      label: safeCountLabel(activeProjects.length, "active project", "active projects")
    })
  );

  const actions = el("div", { class: "actions" }, [
    el("button", {
      class: "primary",
      onclick: () => openRecordConsole({})
    }, ["New Record"]),
    el("button", {
      onclick: () => openCreateTaskModal({})
    }, ["New Task"]),
    el("button", {
      onclick: () => openCreateLeadModal({})
    }, ["New Lead"]),
    el("button", {
      onclick: () => openCreateProjectModal({})
    }, ["New Project"])
  ]);

  app.append(header, actions, grid);
}

/* ---------------------------
   BOOT
---------------------------- */

renderDashboard();
