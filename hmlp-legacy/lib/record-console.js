// lib/record-console.js
import { el } from "./dom.js";
import { button } from "./ui.js";

export function openRecordConsole(ctx) {
  const { sp, cfg, userEmail } = ctx;

  const backdrop = el("div", {
    class: "modal__backdrop",
    onclick: (e) => {
      if (e.target === backdrop) close();
    }
  });

  const textarea = el("textarea", {
    class: "textarea",
    placeholder: "Record what matters. Factual. Transferable. Defensible.",
    style: "min-height: 200px;"
  });

  const recordType = el("select", { class: "select" }, [
    "note", "task", "decision", "workflow", "intake", "system"
  ].map(t => el("option", { value: t }, [t])));

  const status = el("select", { class: "select" }, [
    "draft", "active", "completed", "archived"
  ].map(s => el("option", { value: s }, [s])));

  let pushing = false;
  const statusEl = el("div", { class: "small", style: "margin-top: 8px; color: var(--muted);" });

  const pushBtn = button("Push to ARCHIEVE", {
    variant: "primary",
    onClick: async () => {
      const content = textarea.value.trim();
      if (!content) {
        textarea.focus();
        return;
      }

      if (pushing) return;
      pushing = true;

      try {
        statusEl.textContent = "Pushing to ARCHIEVE...";
        pushBtn.disabled = true;

        const now = new Date().toISOString();
        
        await sp.createItem(cfg.sharepoint.archieve.listName, {
          Title: content.slice(0, 100) + (content.length > 100 ? "..." : ""),
          RecordType: recordType.value,
          Status: status.value,
          Summary: content,
          CreatedByEmail: userEmail,
          CreatedAt: now,
          LastModifiedByEmail: userEmail,
          LastModifiedAt: now,
          OriginatingSystem: "PublicLogic OS",
          SourceRoute: "/dashboard",
          SourceAction: "record_console",
          IsAuthoritative: true,
          LifecycleStage: "record",
          ComplianceCategory: "none",
          RiskLevel: "low"
        });

        statusEl.textContent = "✓ Record saved to ARCHIEVE";
        statusEl.style.color = "var(--accent)";

        setTimeout(() => {
          close();
        }, 800);

      } catch (e) {
        statusEl.textContent = `Error: ${e.message}`;
        statusEl.style.color = "var(--danger)";
        pushBtn.disabled = false;
        pushing = false;
      }
    }
  });

  const closeBtn = button("Cancel", {
    onClick: () => close()
  });

  const modal = el("div", { class: "modal" }, [
    el("div", { class: "modal__top" }, [
      el("div", { class: "modal__title" }, ["New Record"]),
      closeBtn
    ]),
    el("div", { class: "modal__body" }, [
      el("div", { class: "label" }, ["Content"]),
      textarea,
      el("div", { class: "hr" }),
      el("div", { class: "split" }, [
        el("div", {}, [
          el("div", { class: "label" }, ["Type"]),
          recordType
        ]),
        el("div", {}, [
          el("div", { class: "label" }, ["Status"]),
          status
        ])
      ]),
      el("div", { class: "chiprow", style: "margin-top: 12px;" }, [
        pushBtn,
        closeBtn
      ]),
      statusEl
    ])
  ]);

  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);

  // Focus textarea on open
  setTimeout(() => textarea.focus(), 100);

  // ESC to close
  function handleKeydown(e) {
    if (e.key === "Escape" && !pushing) close();
  }
  document.addEventListener("keydown", handleKeydown);

  function close() {
    document.removeEventListener("keydown", handleKeydown);
    backdrop.remove();
  }

  return { close };
}
