// pages/projects.js
import { el } from "../lib/dom.js";
import { showModal, button } from "../lib/ui.js";
import { openCreateProjectModal } from "../lib/forms.js";
import { statusPill, renderTable, actionButtons } from "../lib/tables.js";
import { hasProjectsList } from "../lib/config.js";

function openEditProjectModal({ cfg, sp, project, onUpdated }) {
  const name = el("input", { class: "input", value: project.Title || "" });
  const client = el("input", { class: "input", value: project.Client || "" });
  const status = el("input", { class: "input", value: project.Status || "" });
  const owner = el("input", { class: "input", value: project.Owner || "" });
  const start = el("input", { class: "input", type: "date", value: (project.StartDate || "").slice(0, 10) });
  const target = el("input", { class: "input", type: "date", value: (project.TargetDate || "").slice(0, 10) });
  const notes = el("textarea", { class: "textarea" }, [project.Notes || ""]);

  const body = el("div", { class: "form" }, [
    el("div", {}, [el("div", { class: "label" }, ["Project"]), name]),
    el("div", { class: "split" }, [
      el("div", {}, [el("div", { class: "label" }, ["Client"]), client]),
      el("div", {}, [el("div", { class: "label" }, ["Status"]), status])
    ]),
    el("div", { class: "split" }, [
      el("div", {}, [el("div", { class: "label" }, ["Owner"]), owner]),
      el("div", {}, [el("div", { class: "label" }, ["Start"]), start])
    ]),
    el("div", {}, [el("div", { class: "label" }, ["Target"]), target]),
    el("div", {}, [el("div", { class: "label" }, ["Notes"]), notes])
  ]);

  const modal = showModal({
    title: "Edit Project",
    body,
    actions: [{
      label: "Save",
      variant: "primary",
      onClick: async () => {
        await sp.updateItemFields(cfg.sharepoint.lists.projects, project.itemId, {
          Title: name.value.trim(),
          Client: client.value.trim(),
          Status: status.value.trim(),
          Owner: owner.value.trim(),
          StartDate: start.value || null,
          TargetDate: target.value || null,
          Notes: notes.value
        });
        modal.close();
        onUpdated();
      }
    }]
  });
}

export async function renderProjects(ctx) {
  const { cfg, sp } = ctx;

  if (!hasProjectsList(cfg)) {
    return {
      title: "Projects",
      subtitle: "Not configured",
      actions: [],
      content: el("div", { class: "notice" }, ["Projects list not configured. Add sharepoint.lists.projects to config.js"])
    };
  }

  let projects = [];
  let error = null;

  try {
    projects = await sp.listItems(cfg.sharepoint.lists.projects);
  } catch (e) {
    error = e;
  }

  const sorted = projects.sort((a, b) => {
    const sa = String(a.Status || "").toLowerCase();
    const sb = String(b.Status || "").toLowerCase();
    if (sa !== sb) return sa.localeCompare(sb);
    return String(a.TargetDate || "").localeCompare(String(b.TargetDate || ""));
  });

  const content = el("div", {}, [
    error
      ? el("div", { class: "error" }, [error.message])
      : el("div", { class: "card" }, [
          el("h3", {}, ["Projects"]),
          renderTable({
            emptyMessage: "No projects yet. Add one and track delivery here.",
            columns: [
              { label: "Project", render: (p) => p.Title || "(no title)" },
              { label: "Client", key: "Client", muted: true },
              { label: "Status", render: (p) => statusPill(p.Status, "Active") },
              { label: "Owner", key: "Owner", muted: true },
              { label: "Target", render: (p) => String(p.TargetDate || "").slice(0, 10), muted: true },
              {
                label: "Actions",
                render: (p) => actionButtons([
                  { label: "Edit", onClick: () => openEditProjectModal({ cfg, sp, project: p, onUpdated: ctx.refresh }) },
                  p.webUrl && { label: "Open", href: p.webUrl }
                ])
              }
            ],
            rows: sorted
          })
        ])
  ]);

  return {
    title: "Projects",
    subtitle: "Delivery work in motion (towns, pilots, packages)",
    actions: [{
      label: "New Project",
      variant: "primary",
      onClick: () => openCreateProjectModal({ cfg, sp, defaultOwnerEmail: ctx.userEmail, onCreated: ctx.refresh })
    }],
    content
  };
}
