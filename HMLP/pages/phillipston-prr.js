// pages/phillipston-prr.js
import { el } from "../lib/dom.js";
import { savePrrSubmission } from "../lib/archieve.js";

export async function renderPhillipstonPrr(ctx) {
  const { sp, cfg, refresh } = ctx;

  let saved = false;
  let result = null;
  let error = null;

  const SHAREPOINT_PRR =
    "https://publiclogic978.sharepoint.com/sites/PL/Shared%20Documents/01_Towns/MA/Phillipston/PRR";

  const ARCHIEVE_LIST = cfg?.sharepoint?.archieve?.listUrl;

  /* =========================
     STAFF INTAKE HANDLER
     ========================= */
  async function handleSubmit(e) {
    e.preventDefault();
    error = null;

    const fd = new FormData(e.target);
    const data = {
      name: fd.get("requester"),
      email: fd.get("email") || "not provided",
      source: fd.get("source"),
      request: fd.get("request")
    };

    if (!data.name || !data.source || !data.request) {
      error = "Requester, source, and request description are required.";
      return refresh();
    }

    try {
      result = await savePrrSubmission(sp, cfg, data);
      saved = true;
    } catch {
      error = "Failed to save PRR to ARCHIEVE.";
    }

    refresh();
  }

  /* =========================
     LEFT — STAFF INTAKE
     ========================= */
  const intake = el("div", { class: "card stack gap-lg" }, [
    el("h2", {}, ["New PRR — Staff Intake"]),
    el("p", { class: "small muted" }, [
      "Use this form for email, phone, walk-in, or paper requests."
    ]),

    saved
      ? el("div", { class: "stack gap-md" }, [
          el("h3", {}, ["PRR Recorded"]),
          el("p", {}, [
            "Case ID: ",
            el("strong", {}, [result.caseId])
          ]),
          el("a", {
            href: result.fileUrl,
            target: "_blank",
            class: "btn btn--primary"
          }, ["Open Case File"]),
          el("button", {
            class: "btn",
            onclick: () => {
              saved = false;
              result = null;
              refresh();
            }
          }, ["Record Another PRR"])
        ])
      : el("form", { class: "stack gap-md", onsubmit: handleSubmit }, [
          field("Requester Name *", "requester"),
          field("Requester Email (if provided)", "email", "email"),
          select("Request Source *", "source", [
            "Email",
            "Phone",
            "Walk-in",
            "Mail",
            "Other"
          ]),
          textarea("Request Description *", "request"),
          error && el("div", { class: "error" }, [error]),
          el("button", { class: "btn btn--primary" }, ["Save PRR to ARCHIEVE"])
        ])
  ]);

  /* =========================
     RIGHT — PRR DASHBOARD
     ========================= */
  const dashboard = el("div", { class: "card card--calm stack gap-md" }, [
    el("h3", {}, ["Phillipston PRR Dashboard"]),
    el("p", { class: "small muted" }, [
      "Operational overview. System of record lives in SharePoint."
    ]),

    metric("Open Requests", "—"),
    metric("Next T10 Deadline", "—"),
    metric("Compliance Status", "On Track"),

    el("div", { class: "hr" }),

    link("📁 PRR Working Folder", SHAREPOINT_PRR),
    ARCHIEVE_LIST && link("🗄 ARCHIEVE List", ARCHIEVE_LIST),
    link("📘 PRR Procedures & Training", "https://www.publiclogic.org/demo"),

    el("p", { class: "small muted" }, [
      "All actions logged • Immutable record • Turnover-safe"
    ])
  ]);

  return {
    title: "Phillipston PRR",
    subtitle: "Staff Intake & Case Dashboard",
    content: el("div", { class: "grid" }, [
      el("div", { style: "grid-column: span 7;" }, [intake]),
      el("div", { style: "grid-column: span 5;" }, [dashboard])
    ])
  };
}

/* =========================
   HELPERS
   ========================= */
function field(label, name, type = "text") {
  return el("div", {}, [
    el("label", { class: "label" }, [label]),
    el("input", { name, type, class: "input" })
  ]);
}

function textarea(label, name) {
  return el("div", {}, [
    el("label", { class: "label" }, [label]),
    el("textarea", { name, rows: 6, class: "textarea" })
  ]);
}

function select(label, name, options) {
  return el("div", {}, [
    el("label", { class: "label" }, [label]),
    el("select", { name, class: "input" },
      options.map(o => el("option", { value: o }, [o]))
    )
  ]);
}

function metric(label, value) {
  return el("div", { class: "metric" }, [
    el("div", { class: "metric__label" }, [label]),
    el("div", { class: "metric__value" }, [value])
  ]);
}

function link(text, href) {
  return el("a", {
    href,
    target: "_blank",
    class: "navlink"
  }, [text]);
}
