import { el } from "../lib/dom.js";
import { pill } from "../lib/ui.js";
import { openRecordConsole } from "../lib/record-console.js";

function safeCountLabel(n, singular, plural) {
  return n === 1 ? `${n} ${singular}` : `${n} ${plural}`;
}

function kpiCard({ title, value, label, kind = "mint" }) {
  return el("div", { class: "card", style: "grid-column: span 4;" }, [
    el("h3", {}, [title]),
    el("div", { style: "font-size: 32px; font-weight: 700;" }, [String(value)]),
    el("div", { style: "opacity: .6;" }, [label]),
    el("div", { style: "margin-top: 8px;" }, [pill("Live", kind)])
  ]);
}

export async function renderDashboard(ctx) {
  const openTasks = [];
  const followups = [];
  const activeProjects = [];

  const grid = el("div", { class: "grid" }, [
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
  ]);

  return {
    title: "Command Center",
    subtitle: ctx.userEmail,
    actions: [
      {
        label: "New Record",
        variant: "primary",
        onClick: () => openRecordConsole(ctx)
      }
    ],
    content: grid
  };
}
