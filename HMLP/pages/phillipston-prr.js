// pages/phillipston-prr.js
import { el } from "../lib/dom.js";
import { savePrrSubmission } from "../lib/archieve.js";

export async function renderPhillipstonPrr(ctx) {
  const { sp, cfg, refresh } = ctx;

  let submitted = false;
  let result = null;
  let error = null;
  let deadline = null;

  const PRR_FOLDER =
    "https://publiclogic978.sharepoint.com/sites/PL/Shared%20Documents/01_Towns/MA/Phillipston/PRR";

  const ARCHIEVE_LIST =
    `https://${cfg?.sharepoint?.hostname}${cfg?.sharepoint?.sitePath}/Lists/${cfg?.sharepoint?.archieve?.listName || "ARCHIEVE"}/AllItems.aspx`;

  /* =========================
     SUBMIT HANDLER
     ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    error = null;

    const fd = new FormData(e.target);
    const data = {
      name: fd.get("name")?.trim(),
      email: fd.get("email")?.trim(),
      phone: fd.get("phone")?.trim() || "",
      request: fd.get("request")?.trim(),
      agree: fd.get("agree"),
    };

    if (!data.name || !data.email || !data.request || !data.agree) {
      error = "All required fields must be completed.";
      refresh?.();
      return;
    }

    try {
      result = await savePrrSubmission(sp, cfg, data);

      let days = 10;
      let d = new Date();
      while (days > 0) {
        d.setDate(d.getDate() + 1);
        if (![0,6].includes(d.getDay())) days--;
      }

      deadline = d.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
      });

      submitted = true;
    } catch (err) {
      console.error(err);
      error = "Failed to save request.";
    }

    refresh?.();
  };

  /* =========================
     HEADER (APP IDENTITY)
     ========================= */
  const header = el("div", { class: "prr-app-header" }, [
    el("div", { class: "prr-app-header__left" }, [
      el("div", { class: "prr-badge" }, ["PRR"]),
      el("div", {}, [
        el("h1", { class: "prr-title" }, ["Phillipston Public Records"]),
        el("div", { class: "prr-sub" }, [
          "Staff Console • System of Record"
        ])
      ])
    ]),
    el("div", { class: "prr-app-header__right" }, [
      el("span", { class: "pill pill--mint" }, ["Live"]),
      el("span", { class: "small muted" }, ["ARCHIEVE-backed"])
    ])
  ]);

  /* =========================
     LEFT: STAFF INTAKE
     ========================= */
  const intake = el("div", { class: "card stack gap-lg" }, [

    el("h2", {}, ["Record Incoming PRR"]),
    el("p", { class: "small muted" }, [
      "Use this form to log any public records request received by email, phone, mail, or in person."
    ]),

    submitted
      ? el("div", { class: "stack gap-md" }, [
          el("h3", {}, ["Request Recorded"]),
          el("p", {}, ["Case ID: ", el("strong", {}, [result.caseId])]),
          el("p", {}, [
            "Initial response due by ",
            el("strong", {}, [deadline])
          ]),
          el("a", {
            href: result.fileUrl,
            target: "_blank",
            class: "btn btn--primary"
          }, ["Open Saved Record"]),
          el("button", {
            class: "btn",
            onclick: () => {
              submitted = false;
              result = null;
              error = null;
              refresh?.();
            }
          }, ["Record Another PRR"])
        ])
      : el("form", { class: "stack gap-lg", onsubmit: handleSubmit }, [

          el("div", { class: "split" }, [
            el("div", {}, [
              el("label", { class: "label" }, ["Requester Name *"]),
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
              "This request is subject to Massachusetts Public Records Law (M.G.L. c. 66 §10)."
            ])
          ]),

          error && el("div", { class: "error" }, [error]),

          el("div", { class: "hr" }),

          el("button", {
            class: "btn btn--primary"
          }, ["Save to ARCHIEVE"])
        ])
  ]);

  /* =========================
     RIGHT: COMMAND PANEL
     ========================= */
  const command = el("div", { class: "card card--calm stack gap-md" }, [

    el("h3", {}, ["Command Panel"]),

    el("a", {
      href: PRR_FOLDER,
      target: "_blank",
      class: "btn btn--primary"
    }, ["Open PRR Workspace"]),

    el("a", {
      href: ARCHIEVE_LIST,
      target: "_blank",
      class: "btn"
    }, ["View ARCHIEVE Records"]),

    el("div", { class: "hr" }),

    el("div", { class: "small muted" }, [
      "All actions are logged. Records are immutable. This system is designed to survive staff turnover and audit scrutiny."
    ])
  ]);

  /* =========================
     FINAL LAYOUT
     ========================= */
  const content = el("div", { class: "prr-app-frame" }, [
    header,
    el("div", { class: "grid" }, [
      el("div", { style: "grid-column: span 7;" }, [intake]),
      el("div", { style: "grid-column: span 5;" }, [command])
    ])
  ]);

  return {
    title: "Phillipston PRR",
    subtitle: "Staff Intake and Records Console",
    content
  };
}
