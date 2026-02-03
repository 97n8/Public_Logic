// pages/pipeline.js
import { el } from "../lib/dom.js";
import { showModal, button } from "../lib/ui.js";
import { openCreateLeadModal } from "../lib/forms.js";
import { statusPill, renderTable, actionButtons } from "../lib/tables.js";
import { PIPELINE_STAGES, compareByOrder } from "../lib/constants.js";
import { hasPipelineList } from "../lib/config.js";

const compareStage = compareByOrder(PIPELINE_STAGES);

function openEditLeadModal({ cfg, sp, lead, onUpdated }) {
  const org = el("input", { class: "input", value: lead.Title || "" });
  const contactName = el("input", { class: "input", value: lead.ContactName || "" });
  const contactEmail = el("input", { class: "input", value: lead.ContactEmail || "" });
  const stage = el("select", { class: "select" }, PIPELINE_STAGES.map((s) => 
    el("option", { value: s, ...(String(lead.Stage || "Lead") === s ? { selected: "selected" } : {}) }, [s])
  ));
  const owner = el("input", { class: "input", value: lead.Owner || "" });
  const nextStep = el("input", { class: "input", value: lead.NextStep || "" });
  const nextDate = el("input", { class: "input", type: "date", value: (lead.NextDate || "").slice(0, 10) });
  const notes = el("textarea", { class: "textarea" }, [lead.Notes || ""]);

  const body = el("div", { class: "form" }, [
    el("div", {}, [el("div", { class: "label" }, ["Organization"]), org]),
    el("div", { class: "split" }, [
      el("div", {}, [el("div", { class: "label" }, ["Contact"]), contactName]),
      el("div", {}, [el("div", { class: "label" }, ["Email"]), contactEmail])
    ]),
    el("div", { class: "split" }, [
      el("div", {}, [el("div", { class: "label" }, ["Stage"]), stage]),
      el("div", {}, [el("div", { class: "label" }, ["Owner"]), owner])
    ]),
    el("div", { class: "split" }, [
      el("div", {}, [el("div", { class: "label" }, ["Next Step"]), nextStep]),
      el("div", {}, [el("div", { class: "label" }, ["Next Date"]), nextDate])
    ]),
    el("div", {}, [el("div", { class: "label" }, ["Notes"]), notes]),
    el("div", { class: "hr" }),
    el("div", { class: "small" }, ["Quick close:"]),
    el("div", { class: "chiprow" }, [
      button("Closed Won", { variant: "primary", onClick: async () => {
        await sp.updateItemFields(cfg.sharepoint.lists.pipeline, lead.itemId, { Stage: "Closed Won" });
        onUpdated();
      }}),
      button("Closed Lost", { variant: "danger", onClick: async () => {
        await sp.updateItemFields(cfg.sharepoint.lists.pipeline, lead.itemId, { Stage: "Closed Lost" });
        onUpdated();
      }})
    ])
  ]);

  const modal = showModal({
    title: "Edit Lead",
    body,
    actions: [{
      label: "Save",
      variant: "primary",
      onClick: async () => {
        await sp.updateItemFields(cfg.sharepoint.lists.pipeline, lead.itemId, {
          Title: org.value.trim(),
          ContactName: contactName.value.trim(),
          ContactEmail: contactEmail.value.trim(),
          Stage: stage.value,
          Owner: owner.value.trim(),
          NextStep: nextStep.value.trim(),
          NextDate: nextDate.value || null,
          Notes: notes.value
        });
        modal.close();
        onUpdated();
      }
    }]
  });
}

export async function renderPipeline(ctx) {
  const { cfg, sp } = ctx;

  if (!hasPipelineList(cfg)) {
    return {
      title: "Pipeline",
      subtitle: "Not configured",
      actions: [],
      content: el("div", { class: "notice" }, ["Pipeline list not configured. Add sharepoint.lists.pipeline to config.js"])
    };
  }

  let leads = [];
  let error = null;

  try {
    leads = await sp.listItems(cfg.sharepoint.lists.pipeline);
  } catch (e) {
    error = e;
  }

  const sorted = leads.sort((a, b) => {
    const cs = compareStage(a.Stage || "Lead", b.Stage || "Lead");
    if (cs !== 0) return cs;
    return String(a.NextDate || "").localeCompare(String(b.NextDate || ""));
  });

  const content = el("div", {}, [
    error
      ? el("div", { class: "error" }, [error.message])
      : el("div", { class: "card" }, [
          el("h3", {}, ["Leads"]),
          renderTable({
            emptyMessage: "No leads yet. Add one and this becomes your pipeline.",
            columns: [
              {
                label: "Organization",
                render: (l) => {
                  const wrap = el("div", {}, [el("div", { style: "font-weight: 800;" }, [l.Title || "(no org)"])]);
                  const contact = [l.ContactName, l.ContactEmail].filter(Boolean).join(" | ");
                  if (contact) wrap.appendChild(el("div", { class: "small" }, [contact]));
                  return wrap;
                }
              },
              { label: "Stage", render: (l) => statusPill(l.Stage, "Lead") },
              { label: "Owner", key: "Owner", muted: true },
              { label: "Next", render: (l) => [l.NextStep, String(l.NextDate || "").slice(0, 10)].filter(Boolean).join(" | "), muted: true },
              {
                label: "Actions",
                render: (l) => actionButtons([
                  { label: "Edit", onClick: () => openEditLeadModal({ cfg, sp, lead: l, onUpdated: ctx.refresh }) },
                  l.webUrl && { label: "Open", href: l.webUrl }
                ])
              }
            ],
            rows: sorted
          })
        ])
  ]);

  return {
    title: "Pipeline",
    subtitle: "Sales follow-ups and municipal opportunities",
    actions: [{
      label: "New Lead",
      variant: "primary",
      onClick: () => openCreateLeadModal({ cfg, sp, defaultOwnerEmail: ctx.userEmail, onCreated: ctx.refresh })
    }],
    content
  };
}
