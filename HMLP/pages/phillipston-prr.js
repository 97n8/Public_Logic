// pages/phillipston-prr.js
import { el } from "../lib/dom.js";
import { savePrrSubmission } from "../lib/archieve.js";

export async function renderPhillipstonPrr(ctx) {
  const { sp, cfg, refresh } = ctx;

  let submitted = false;
  let result = null;
  let error = null;
  let deadline = null;

  const SHAREPOINT_PRR_URL =
    "https://publiclogic978.sharepoint.com/sites/PL/Shared%20Documents/Forms/AllItems.aspx" +
    "?id=%2Fsites%2FPL%2FShared%20Documents%2FPL%5FSharePoint%5FLibrary%2F01%5FTowns%2FMA%2FPhillipston%2FPRR" +
    "&viewid=8f70cafa%2D6e8f%2D47de%2Db9ef%2D674717c6a3db";

  const ARCHIEVE_LIST_URL =
    cfg?.sharepoint?.archieve?.listUrl || "#";

  const TRAINING_URL =
    "https://www.publiclogic.org/demo"; // replace later with Phillipston-specific SOP if needed

  const handleSubmit = async (e) => {
    e.preventDefault();
    error = null;

    const formData = new FormData(e.target);
    const data = {
      name: formData.get("name")?.trim(),
      email: formData.get("email")?.trim(),
      phone: formData.get("phone")?.trim() || "",
      request: formData.get("request")?.trim(),
      agree: formData.get("agree"),
    };

    if (!data.name || !data.email || !data.request || !data.agree) {
      error = "Please complete all required fields and check the agreement box.";
      refresh?.();
      return;
    }

    try {
      result = await savePrrSubmission(sp, cfg, data);

      // T10 deadline (10 business days)
      let days = 10;
      let d = new Date();
      while (days > 0) {
        d.setDate(d.getDate() + 1);
        if (![0, 6].includes(d.getDay())) days--;
      }

      deadline = d.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

      submitted = true;
    } catch (err) {
      console.error(err);
      error = "Failed to save request. Please try again.";
    }

    refresh?.();
  };

  /* =========================
     LEFT: PUBLIC PRR INTAKE
     ========================= */
  const intakePanel = el("div", { class: "card card--hero stack gap-lg" }, [
    el("h2", {}, ["Phillipston Public Records Request"]),
    el("p", { class: "muted" }, [
      "Submit a request under Massachusetts Public Records Law ",
      "(M.G.L. c. 66 §10 and 950 CMR 32.00)."
    ]),

    submitted
      ? el("div", { class: "stack gap-md" }, [
          el("h3", {}, ["Request Received"]),
          el("p", {}, [
            "Case ID: ",
            el("strong", {}, [result.caseId])
          ]),
          el("p", {}, [
            "The Town must respond by ",
            el("strong", {}, [deadline]),
            "."
          ]),
          el("a", {
            href: result.fileUrl,
            target: "_blank",
            class: "btn btn--primary"
          }, ["View Saved Record"]),
          el("button", {
            class: "btn",
            onclick: () => {
              submitted = false;
              result = null;
              error = null;
              refresh?.();
            }
          }, ["Submit Another Request"])
        ])
      : el("form", { class: "stack gap-lg", onsubmit: handleSubmit }, [
          el("div", { class: "split" }, [
            el("div", {}, [
              el("label", { class: "label" }, ["Full Name *"]),
              el("input", { name: "name", class: "input", required: true })
            ]),
            el("div", {}, [
              el("label", { class: "label" }, ["Email *"]),
              el("input", { type: "email", name: "email", class: "input", required: true })
            ])
          ]),
          el("div", {}, [
            el("label", { class: "label" }, ["Phone (optional)"]),
            el("input", { name: "phone", class: "input" })
          ]),
          el("div", {}, [
            el("label", { class: "label" }, ["Records Requested *"]),
            el("textarea", {
              name: "request",
              class: "textarea",
              rows: 6,
              required: true
            })
          ]),
          el("label", { class: "stack gap-sm" }, [
            el("input", { type: "checkbox", name: "agree", required: true }),
            el("span", { class: "small" }, [
              "I understand this is a public records request and the Town will respond within statutory timeframes."
            ])
          ]),
          error && el("div", { class: "error" }, [error]),
          el("button", { class: "btn btn--primary" }, ["Submit Request"])
        ])
  ]);

  /* =========================
     RIGHT: CASE SPACE
     ========================= */
  const casePanel = el("div", { class: "card card--calm stack gap-md" }, [
    el("h3", {}, ["Phillipston PRR Case Space"]),
    el("p", { class: "small muted" }, [
      "Operator access to records, tracking, and training. This is the system of record."
    ]),

    el("a", {
      href: SHAREPOINT_PRR_URL,
      target: "_blank",
      class: "navlink"
    }, ["📁 PRR Document Folder"]),

    el("a", {
      href: ARCHIEVE_LIST_URL,
      target: "_blank",
      class: "navlink"
    }, ["🗄️ ARCHIEVE Records List"]),

    el("a", {
      href: TRAINING_URL,
      target: "_blank",
      class: "navlink"
    }, ["📘 Training & SOPs"]),

    el("div", { class: "hr" }),

    el("p", { class: "small muted" }, [
      "All actions are logged. Records are immutable. Turnover-safe by design."
    ])
  ]);

  /* =========================
     PAGE LAYOUT
     ========================= */
  const content = el("div", { class: "grid" }, [
    el("div", { style: "grid-column: span 7;" }, [intakePanel]),
    el("div", { style: "grid-column: span 5;" }, [casePanel])
  ]);

  return {
    title: "Phillipston PRR",
    subtitle: "Public Records Request and Case Space",
    content
  };
}
