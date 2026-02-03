// pages/phillipston-prr.js
import { el } from "../lib/dom.js";
import { savePrrSubmission } from "../lib/archieve.js";

const SHAREPOINT_PRR_FOLDER =
  "https://publiclogic978.sharepoint.com/sites/PL/Shared%20Documents/01_Towns/MA/Phillipston/PRR";

export function renderPhillipstonPrr(ctx) {
  const { sp, cfg, refresh } = ctx;

  // ── State ────────────────────────────────────────────────────────────────
  let formState = {
    isSubmitting: false,
    saveResult: null,
    error: null,
    fieldErrors: {},
  };

  const ARCHIEVE_LIST_URL = cfg?.sharepoint?.archieve?.listUrl || null;

  // ── Handlers ─────────────────────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();
    formState.error = null;
    formState.fieldErrors = {};

    const formData = new FormData(e.target);
    const values = {
      requester: (formData.get("requester") || "").trim(),
      email: (formData.get("email") || "").trim() || null,
      source: formData.get("source") || "",
      request: (formData.get("request") || "").trim(),
    };

    // Client-side validation
    const errors = {};
    if (!values.requester) errors.requester = "Requester name is required";
    if (!values.source) errors.source = "Please select a source";
    if (!values.request) errors.request = "Request description is required";
    if (values.request.length > 4000) {
      errors.request = "Description is too long (max 4000 characters)";
    }

    if (Object.keys(errors).length > 0) {
      formState.fieldErrors = errors;
      refresh();
      return;
    }

    formState.isSubmitting = true;
    formState.error = null;
    refresh();

    try {
      const result = await savePrrSubmission(sp, cfg, {
        name: values.requester,
        email: values.email,
        source: values.source,
        request: values.request,
      });

      formState.saveResult = result;
      formState.isSubmitting = false;
      // Optional: auto-reset after success (uncomment if desired)
      // setTimeout(() => { resetForm(); refresh(); }, 12000);
    } catch (err) {
      console.error("PRR submission failed", err);
      formState.error =
        err.message?.includes("network") || err.message?.includes("timeout")
          ? "Network error — please check your connection and try again."
          : "Failed to save PRR. Please try again or contact support.";
      formState.isSubmitting = false;
    }

    refresh();
  }

  function resetForm() {
    formState = {
      isSubmitting: false,
      saveResult: null,
      error: null,
      fieldErrors: {},
    };
    refresh();
  }

  // ── Form Fields ──────────────────────────────────────────────────────────
  function Field({ label, name, type = "text", required, autoComplete, error }) {
    const hasError = !!error || !!formState.fieldErrors[name];
    const errorMessage = error || formState.fieldErrors[name];

    return el("div", { class: "field" }, [
      el(
        "label",
        { class: "label", for: name },
        required ? `${label} *` : label
      ),
      el("input", {
        id: name,
        name,
        type,
        class: `input ${hasError ? "input--error" : ""}`,
        required,
        autocomplete: autoComplete || "off",
        "aria-invalid": hasError ? "true" : "false",
        "aria-describedby": hasError ? `${name}-error` : undefined,
      }),
      hasError &&
        el(
          "div",
          { id: `${name}-error`, class: "field-error", role: "alert" },
          errorMessage
        ),
    ]);
  }

  function TextArea({ label, name, required }) {
    const error = formState.fieldErrors[name];
    return el("div", { class: "field" }, [
      el("label", { class: "label", for: name }, required ? `${label} *` : label),
      el("textarea", {
        id: name,
        name,
        class: `textarea ${error ? "input--error" : ""}`,
        rows: 7,
        required,
        "aria-invalid": error ? "true" : "false",
        "aria-describedby": error ? `${name}-error` : undefined,
      }),
      error &&
        el(
          "div",
          { id: `${name}-error`, class: "field-error", role: "alert" },
          error
        ),
    ]);
  }

  function Select({ label, name, options, required }) {
    const error = formState.fieldErrors[name];
    return el("div", { class: "field" }, [
      el("label", { class: "label", for: name }, required ? `${label} *` : label),
      el(
        "select",
        {
          id: name,
          name,
          class: `input ${error ? "input--error" : ""}`,
          required,
          "aria-invalid": error ? "true" : "false",
          "aria-describedby": error ? `${name}-error` : undefined,
        },
        [
          el("option", { value: "", disabled: true, selected: true }, "— Select —"),
          ...options.map((opt) => el("option", { value: opt }, opt)),
        ]
      ),
      error &&
        el(
          "div",
          { id: `${name}-error`, class: "field-error", role: "alert" },
          error
        ),
    ]);
  }

  // ── UI Fragments ─────────────────────────────────────────────────────────
  const successView = formState.saveResult
    ? el("div", { class: "stack gap-xl text-center py-lg" }, [
        el("div", { class: "success-icon" }, "✓"),
        el("h3", { class: "success-title" }, "PRR Recorded"),
        el("div", { class: "metric-block" }, [
          el("div", { class: "metric-label" }, "Case ID"),
          el("div", { class: "metric-value" }, formState.saveResult.caseId),
        ]),
        el(
          "a",
          {
            href: formState.saveResult.fileUrl,
            target: "_blank",
            rel: "noopener noreferrer",
            class: "btn btn--primary btn--large",
          },
          "Open Case File"
        ),
        el(
          "button",
          {
            class: "btn btn--outline mt-lg",
            onclick: resetForm,
            type: "button",
          },
          "Record Another PRR"
        ),
      ])
    : null;

  const formView = el("form", { class: "stack gap-lg", onsubmit: handleSubmit }, [
    Field({
      label: "Requester Name",
      name: "requester",
      required: true,
      autoComplete: "name",
    }),
    Field({
      label: "Requester Email",
      name: "email",
      type: "email",
      autoComplete: "email",
    }),
    Select({
      label: "Request Source",
      name: "source",
      options: ["Email", "Phone", "Walk-in", "Mail", "Other"],
      required: true,
    }),
    TextArea({
      label: "Request Description",
      name: "request",
      required: true,
    }),

    formState.error &&
      el("div", { class: "error-banner", role: "alert" }, formState.error),

    el("div", { class: "flex gap-md justify-end mt-md" }, [
      el(
        "button",
        {
          type: "submit",
          class: "btn btn--primary",
          disabled: formState.isSubmitting,
        },
        formState.isSubmitting ? "Saving..." : "Save PRR"
      ),
      el(
        "button",
        {
          type: "button",
          class: "btn btn--outline",
          onclick: resetForm,
          disabled: formState.isSubmitting,
        },
        "Cancel"
      ),
    ]),
  ]);

  const intake = el("div", { class: "card stack gap-xl" }, [
    el("div", { class: "header-block" }, [
      el("h2", {}, "New Public Records Request"),
      el("p", { class: "subtitle" }, "Staff intake — email, phone, walk-in, mail, etc."),
    ]),
    successView || formView,
  ]);

  // ── Dashboard (future: fetch real data) ──────────────────────────────────
  const dashboard = el("div", { class: "card card--calm stack gap-lg" }, [
    el("h3", {}, "Phillipston PRR Overview"),
    el("p", { class: "muted small" }, "Live system of record: SharePoint"),

    el("div", { class: "metrics-grid" }, [
      el("div", { class: "metric" }, [
        el("div", { class: "metric-label" }, "Open Requests"),
        el("div", { class: "metric-value" }, "8"),
        el("div", { class: "metric-trend positive" }, "↑ 2 this week"),
      ]),
      el("div", { class: "metric" }, [
        el("div", { class: "metric-label" }, "Next 10-Day Deadline"),
        el("div", { class: "metric-value urgent" }, "Feb 11, 2026"),
      ]),
      el("div", { class: "metric" }, [
        el("div", { class: "metric-label" }, "Compliance"),
        el("div", { class: "metric-value success" }, "On Track"),
      ]),
    ]),

    el("div", { class: "divider my-lg" }),

    el("div", { class: "stack gap-md" }, [
      el("a", { href: SHAREPOINT_PRR_FOLDER, target: "_blank", class: "link-block" }, [
        el("span", {}, "📁 PRR Working Folder"),
        el("span", { class: "muted small" }, "SharePoint"),
      ]),
      ARCHIEVE_LIST_URL &&
        el("a", { href: ARCHIEVE_LIST_URL, target: "_blank", class: "link-block" }, [
          el("span", {}, "🗄 ARCHIEVE List"),
          el("span", { class: "muted small" }, "All submissions"),
        ]),
      el("a", { href: "https://www.publiclogic.org/demo", target: "_blank", class: "link-block" }, [
        el("span", {}, "📘 PRR Procedures & Training"),
      ]),
    ]),

    el("p", { class: "muted small mt-auto pt-lg border-top" }, 
      "All actions logged • Immutable • Turnover-safe"
    ),
  ]);

  // ── Root layout ──────────────────────────────────────────────────────────
  return {
    title: "Phillipston PRR",
    subtitle: "Intake & Case Overview",
    content: el("div", { class: "grid-responsive gap-xl" }, [
      el("div", { class: "col-main" }, [intake]),
      el("div", { class: "col-sidebar" }, [dashboard]),
    ]),
  };
}
