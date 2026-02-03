import { el } from "../lib/dom.js";
import { pill } from "../lib/ui.js";
import { formatLocalDateTime, formatLocalTime, startOfToday, endOfToday } from "../lib/time.js";
import { getMyCalendarView } from "../lib/m365.js";
import { openCreateTaskModal, openCreateLeadModal, openCreateProjectModal } from "../lib/forms.js";
import { openRecordConsole } from "../lib/record-console.js";

function safeCountLabel(n, singular, plural) {
  return n === 1 ? `${n} ${singular}` : `${n} ${plural}`;
}

function kpiCard({ title, value, label, kind = "mint" }) {
  return el("div", { class: "card", style: "grid-column: span 4;" }, [
    el("h3", {}, [title]),
    el("div", { class: "kpi" }, [
      el("div", { class: "kpi__value" }, [String(value)]),
      el("div", { class: "kpi__label" }, [label]),
    ]),
    el("div", { style: "margin-top:10px;" }, [pill("Live", kind)]),
  ]);
}

function listLine(left, right) {
  return el("div", {
    style:
      "display:flex; align-items:baseline; justify-content:space-between; gap:12px; padding:10px 0; border-bottom:1px solid var(--line);",
  }, [
    el("div", { style: "font-weight:700;" }, [left]),
    el("div", { style: "color:var(--muted); font-size:12px; font-weight:700;" }, [right]),
  ]);
}

export async function renderDashboard(ctx) {
  const todayStart = startOfToday();
  const todayEnd = endOfToday();

  let events = [];
  let tasks = [];
  let pipeline = [];
  let projects = [];
  const errors = [];

  try {
    events = await getMyCalendarView(ctx.auth, { start: todayStart, end: todayEnd, top: 6 });
  } catch (e) {
    errors.push(`Calendar: ${e.message}`);
  }

  try {
    tasks = await ctx.sp.listItems(ctx.cfg.sharepoint.lists.tasks, { selectFields: ["Title", "Status"] });
  } catch (e) {
    errors.push(`Tasks: ${e.message}`);
  }

  try {
    pipeline = await ctx.sp.listItems(ctx.cfg.sharepoint.lists.pipeline, { selectFields: ["Title", "Stage"] });
  } catch (e) {
    errors.push(`Pipeline: ${e.message}`);
  }

  try {
    projects = await ctx.sp.listItems(ctx.cfg.sharepoint.lists.projects, { selectFields: ["Title", "Status"] });
  } catch (e) {
    errors.push(`Projects: ${e.message}`);
  }

  const openTasks = tasks.filter(t => (t.Status || "").toLowerCase() !== "done");
  const openPipeline = pipeline.filter(p => !String(p.Stage || "").toLowerCase().includes("closed"));
  const activeProjects = projects.filter(p => String(p.Status || "").toLowerCase() === "active");

  const grid = el("div", { class: "grid" }, [
    kpiCard({
      title: "Open Tasks",
      value: openTasks.length,
      label: safeCountLabel(openTasks.length, "commitment", "commitments"),
    }),
    kpiCard({
      title: "Pipeline",
      value: openPipeline.length,
      label: safeCountLabel(openPipeline.length, "active lead", "active leads"),
      kind: "gold",
    }),
    kpiCard({
      title: "Projects",
      value: activeProjects.length,
      label: safeCountLabel(activeProjects.length, "active project", "active projects"),
    }),
    el("div", { class: "card", style: "grid-column: span 12;" }, [
      el("h3", {}, ["Today"]),
      ...(events.length
        ? events.map(e =>
            listLine(
              e.subject || "(no subject)",
              e.start?.dateTime
                ? `${formatLocalTime(e.start.dateTime)}–${formatLocalTime(e.end.dateTime)}`
                : formatLocalDateTime(e.start)
            )
          )
        : [el("div", { class: "small" }, ["No events today."])])
    ]),
  ]);

  if (errors.length) {
    grid.prepend(
      el("div", { class: "error", style: "grid-column:span 12;" }, [
        el("div", {}, ["Some data could not load:"]),
        el("div", { class: "small", style: "margin-top:6px; white-space:pre-wrap;" }, [errors.join("\n")]),
      ])
    );
  }

  return {
    title: "Command Center",
    subtitle: new Date().toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" }),
    actions: [
      {
        label: "New Record",
        variant: "primary",
        onClick: () => openRecordConsole(ctx),
      },
      {
        label: "New Task",
        onClick: () => openCreateTaskModal({ cfg: ctx.cfg, sp: ctx.sp, defaultOwnerEmail: ctx.userEmail, onCreated: ctx.refresh }),
      },
    ],
    content: grid,
  };
}
