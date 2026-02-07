// pages/tasks.js
import { el } from "../lib/dom.js";
import { showModal, button } from "../lib/ui.js";
import { openCreateTaskModal } from "../lib/forms.js";
import { statusPill, renderTable, actionButtons } from "../lib/tables.js";
import { TASK_STATUS, compareByOrder } from "../lib/constants.js";
import { hasTasksList } from "../lib/config.js";

const compareStatus = compareByOrder(TASK_STATUS);

function normalizeStatus(s) {
  const x = String(s || "").trim();
  return x || "Backlog";
}

function quickSetButtons({ sp, listName, itemId, onUpdated }) {
  const set = async (Status) => {
    await sp.updateItemFields(listName, itemId, { Status });
    onUpdated();
  };

  return el("div", { class: "chiprow" }, [
    button("Today", { onClick: () => set("Today") }),
    button("This Week", { onClick: () => set("This Week") }),
    button("Blocked", { onClick: () => set("Blocked"), variant: "danger" }),
    button("Done", { onClick: () => set("Done"), variant: "primary" })
  ]);
}

function openEditTaskModal({ cfg, sp, task, onUpdated }) {
  const title = el("input", { class: "input", value: task.Title || "" });
  const owner = el("input", { class: "input", value: task.Owner || "" });
  const status = el("input", { class: "input", value: task.Status || "" });
  const due = el("input", { class: "input", type: "date", value: (task.DueDate || "").slice(0, 10) });
  const priority = el("input", { class: "input", value: task.Priority || "" });
  const area = el("input", { class: "input", value: task.Area || "" });
  const notes = el("textarea", { class: "textarea" }, [task.Notes || ""]);

  const body = el("div", { class: "form" }, [
    el("div", {}, [el("div", { class: "label" }, ["Task"]), title]),
    el("div", { class: "split" }, [
      el("div", {}, [el("div", { class: "label" }, ["Owner"]), owner]),
      el("div", {}, [el("div", { class: "label" }, ["Status"]), status])
    ]),
    el("div", { class: "split" }, [
      el("div", {}, [el("div", { class: "label" }, ["Due"]), due]),
      el("div", {}, [el("div", { class: "label" }, ["Priority"]), priority])
    ]),
    el("div", {}, [el("div", { class: "label" }, ["Area"]), area]),
    el("div", {}, [el("div", { class: "label" }, ["Notes"]), notes]),
    el("div", { class: "hr" }),
    el("div", { class: "small" }, ["Quick set:"]),
    quickSetButtons({ sp, listName: cfg.sharepoint.lists.tasks, itemId: task.itemId, onUpdated })
  ]);

  const modal = showModal({
    title: "Edit Task",
    body,
    actions: [{
      label: "Save",
      variant: "primary",
      onClick: async () => {
        await sp.updateItemFields(cfg.sharepoint.lists.tasks, task.itemId, {
          Title: title.value.trim(),
          Owner: owner.value.trim(),
          Status: status.value.trim(),
          DueDate: due.value || null,
          Priority: priority.value.trim(),
          Area: area.value.trim(),
          Notes: notes.value
        });
        modal.close();
        onUpdated();
      }
    }]
  });
}

function filterTasks(tasks, { ownerEmail, status } = {}) {
  const wantOwner = ownerEmail && ownerEmail !== "all" ? ownerEmail.toLowerCase() : null;
  const wantStatus = status && status !== "all" ? status.toLowerCase() : null;

  return tasks.filter((t) => {
    if (wantOwner && String(t.Owner || "").toLowerCase() !== wantOwner) return false;
    if (wantStatus && String(t.Status || "").toLowerCase() !== wantStatus) return false;
    return true;
  });
}

export async function renderTasks(ctx) {
  const { cfg, sp } = ctx;

  if (!hasTasksList(cfg)) {
    return {
      title: "Tasks",
      subtitle: "Not configured",
      actions: [],
      content: el("div", { class: "notice" }, ["Tasks list not configured. Add sharepoint.lists.tasks to config.js"])
    };
  }

  let tasks = [];
  let error = null;

  try {
    tasks = await sp.listItems(cfg.sharepoint.lists.tasks);
  } catch (e) {
    error = e;
  }

  const ownerOptions = [
    { label: "All", value: "all" },
    ...(cfg.team?.people || []).map((p) => ({ label: p.name, value: p.email }))
  ];

  const statusOptions = [
    { label: "All", value: "all" },
    ...TASK_STATUS.map((s) => ({ label: s, value: s }))
  ];

  const state = { owner: "all", status: "all" };

  const ownerSelect = el("select", { class: "select" }, ownerOptions.map((o) => el("option", { value: o.value }, [o.label])));
  const statusSelect = el("select", { class: "select" }, statusOptions.map((o) => el("option", { value: o.value }, [o.label])));

  const tableWrap = el("div", {});

  function rerenderTable() {
    tableWrap.innerHTML = "";

    if (error) {
      tableWrap.appendChild(el("div", { class: "error" }, [error.message]));
      return;
    }

    const filtered = filterTasks(tasks, { ownerEmail: state.owner, status: state.status })
      .sort((a, b) => {
        const cs = compareStatus(normalizeStatus(a.Status), normalizeStatus(b.Status));
        if (cs !== 0) return cs;
        return String(a.DueDate || "").localeCompare(String(b.DueDate || ""));
      });

    const table = renderTable({
      emptyMessage: "No tasks match your filters.",
      columns: [
        { label: "Task", key: "Title", render: (t) => t.Title || "(no title)" },
        { label: "Owner", key: "Owner", muted: true },
        { label: "Status", render: (t) => statusPill(t.Status, "Backlog") },
        { label: "Due", render: (t) => String(t.DueDate || "").slice(0, 10), muted: true },
        { label: "Priority", key: "Priority", muted: true },
        { label: "Area", key: "Area", muted: true },
        {
          label: "Actions",
          render: (t) => actionButtons([
            { label: "Edit", onClick: () => openEditTaskModal({ cfg, sp, task: t, onUpdated: ctx.refresh }) },
            t.webUrl && { label: "Open", href: t.webUrl },
            { label: "Done", variant: "primary", onClick: async () => {
              await sp.updateItemFields(cfg.sharepoint.lists.tasks, t.itemId, { Status: "Done" });
              ctx.refresh();
            }}
          ])
        }
      ],
      rows: filtered
    });

    tableWrap.appendChild(table);
  }

  ownerSelect.addEventListener("change", () => { state.owner = ownerSelect.value; rerenderTable(); });
  statusSelect.addEventListener("change", () => { state.status = statusSelect.value; rerenderTable(); });

  rerenderTable();

  const content = el("div", {}, [
    el("div", { class: "card" }, [
      el("h3", {}, ["Filters"]),
      el("div", { class: "split" }, [
        el("div", {}, [el("div", { class: "label" }, ["Owner"]), ownerSelect]),
        el("div", {}, [el("div", { class: "label" }, ["Status"]), statusSelect])
      ])
    ]),
    el("div", { style: "height: 12px;" }),
    el("div", { class: "card" }, [
      el("h3", {}, ["Task List"]),
      tableWrap
    ])
  ]);

  return {
    title: "Tasks",
    subtitle: "Shared commitments (stored in Microsoft Lists)",
    actions: [{
      label: "New Task",
      variant: "primary",
      onClick: () => openCreateTaskModal({ cfg, sp, defaultOwnerEmail: ctx.userEmail, onCreated: ctx.refresh })
    }],
    content
  };
}
