import { el } from "./dom.js";

export function openRecordConsole(ctx) {
  const backdrop = el("div", { class: "modal__backdrop" });

  const textarea = el("textarea", {
    class: "textarea",
    placeholder: "Record what matters. Factual. Transferable. Defensible.",
  });

  const pushBtn = el(
    "button",
    {
      class: "btn btn--primary",
      type: "button",
      onclick: () => {
        console.log("RECORD", {
          user: ctx.userEmail,
          time: new Date().toISOString(),
          content: textarea.value,
        });
        backdrop.remove();
      },
    },
    ["Push"]
  );

  const closeBtn = el(
    "button",
    {
      class: "btn",
      type: "button",
      onclick: () => backdrop.remove(),
    },
    ["Close"]
  );

  const modal = el("div", { class: "modal" }, [
    el("div", { class: "modal__top" }, [
      el("div", { class: "modal__title" }, ["New Record"]),
      closeBtn,
    ]),
    el("div", { class: "modal__body" }, [
      el("div", { class: "label" }, ["Content"]),
      textarea,
      el("div", { class: "chiprow", style: "margin-top:12px;" }, [
        pushBtn,
        closeBtn,
      ]),
      el("div", { class: "small", style: "margin-top:10px;" }, [
        "Local-only for now. Next step is SharePoint wiring.",
      ]),
    ]),
  ]);

  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);
}
