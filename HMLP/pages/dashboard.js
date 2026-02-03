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

function safeCountLabel(n, singular, plural) {
  return n === 1 ? `${n} ${singular}` : `${n} ${plural}`;
}

function kpiCard({ title, value, label, kind = "mint" }) {
  return el("div", { class: "card", style: "grid-column: span 4;" }, [
    el("h3", {}, [title]),
    el("div", { class: "kpi" }, [
      el("div", { class: "kpi__value" }, [String(value)]),
      el("div", { class: "kpi__label" }, [label])
    ]),
    el("div", { style: "margin-top:10px;" }, [pill("Live", kind)])
  ]);
}

function listLine(left, right) {
  return el("div", {
    style: `
      display:flex;
      justify-content:space-between;
      padding:10px 0;
      border-bottom:1px solid var(--line);
    `
  }, [
    el("div", { style: "font-weight:700;" }, [left]),
    el("div", { style: "font-size:12px; color:var(--muted);" }, [right])
  ]);
}

export async function renderDashboard(ctx) {
  const { cfg, auth, sp } = ctx;

  const todayStart = startOfToday();
  const todayEnd = endOfToday();

  let events = [];
  let tasks = [];
  let pipeline = [];
  let projects = [];
  const errors = [];

  try {
    events = await getMyCalendarView(auth, { start: todayStart, end: todayEnd, top: 8 });
  } catch (e) {
    errors.push(`Calendar: ${e.message}`);
  }

  try {
    tasks = await sp.listItems(cfg.sharepoint.lists.tasks);
    pipeline = await sp.listItems(cfg.sharepoint.lists.pipeline);
    projects = await sp.listItems(cfg.sharepoint.lists.projects);
  } catch (e) {
    errors.push(`Lists: ${e.message}`);
  }

  const openTasks = tasks.filter(t => String(t.Status).toLowerCase() !== "done");
  const followups = pipeline.filter(l => !String(l.Stage).toLowerCase().includes("closed"));
  const activeProjects = projects.filter(p => String(p.Status).toLowerCase() === "active");

  const grid = el("div", { class: "grid" });

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

  grid.append(
    el("div", { class: "card", style: "grid-column: span 12;" }, [
      el("h3", {}, ["Pipeline Next Steps"]),
      ...followups.slice(0, 8).map(l =>
        listLine(l.Title || "(no org)", [l.Stage, l.Owner].filter(Boolean).join(" | "))
      )
    ])
  );

  const actions = [
    {
      label: "New Record",
      variant: "primary",
      onClick: () => openRecordConsole(ctx)
    },
    {
      label: "New Task",
      onClick: () => openCreateTaskModal({ cfg, sp, onCreated: ctx.refresh })
    },
    {
      label: "New Lead",
      onClick: () => openCreateLeadModal({ cfg, sp, onCreated: ctx.refresh })
    },
    {
      label: "New Project",
      onClick: () => openCreateProjectModal({ cfg, sp, onCreated: ctx.refresh })
    }
  ];

  return {
    title: "Command Center",
    subtitle: new Date().toLocaleDateString(),
    actions,
    content: grid
  };
}
