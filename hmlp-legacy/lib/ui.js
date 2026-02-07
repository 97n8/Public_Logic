// lib/ui.js
import { el } from "./dom.js";

export function pill(text, kind = "") {
  const cls = ["pill", kind ? `pill--${kind}` : ""].filter(Boolean).join(" ");
  return el("span", { class: cls }, [text]);
}

export function button(label, { variant = "", onClick = null, title = null, type = "button", disabled = false } = {}) {
  const cls = ["btn", variant ? `btn--${variant}` : ""].filter(Boolean).join(" ");
  return el("button", {
    class: cls,
    type,
    ...(title ? { title } : {}),
    ...(disabled ? { disabled: "disabled" } : {}),
    ...(onClick ? { onclick: onClick } : {})
  }, [label]);
}

export function spinner() {
  return el("span", { 
    class: "spinner",
    style: "display: inline-block; width: 14px; height: 14px; border: 2px solid var(--faint); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.6s linear infinite;"
  });
}

export function showModal({ title, body, actions = [] }) {
  const backdrop = el("div", {
    class: "modal__backdrop",
    onclick: (e) => {
      if (e.target === backdrop) close();
    }
  });

  const modal = el("div", { class: "modal" });
  const closeBtn = button("Close", { onClick: () => close() });
  
  const top = el("div", { class: "modal__top" }, [
    el("div", { class: "modal__title" }, [title || ""]),
    closeBtn
  ]);

  const bodyWrap = el("div", { class: "modal__body" }, [body]);

  modal.appendChild(top);
  modal.appendChild(bodyWrap);

  if (actions.length > 0) {
    const footer = el("div", { class: "modal__body" }, [
      el("div", { class: "split" }, actions.map((a) => {
        const btn = button(a.label, {
          variant: a.variant || "",
          onClick: async () => {
            if (!a.onClick) return;
            
            // Disable all buttons during action
            const allBtns = modal.querySelectorAll("button");
            allBtns.forEach(b => b.disabled = true);
            
            try {
              await a.onClick();
            } catch (e) {
              console.error("Modal action error:", e);
              allBtns.forEach(b => b.disabled = false);
              throw e;
            }
          }
        });
        return btn;
      }))
    ]);
    modal.appendChild(footer);
  }

  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);

  // Keyboard trap
  function handleKeydown(e) {
    if (e.key === "Escape") {
      close();
      e.preventDefault();
    }
    
    if (e.key === "Tab") {
      const focusable = modal.querySelectorAll('button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      
      if (e.shiftKey && document.activeElement === first) {
        last.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === last) {
        first.focus();
        e.preventDefault();
      }
    }
  }

  document.addEventListener("keydown", handleKeydown);

  function close() {
    document.removeEventListener("keydown", handleKeydown);
    backdrop.remove();
  }

  // Focus first input
  setTimeout(() => {
    const firstInput = modal.querySelector('input, textarea, select');
    if (firstInput) firstInput.focus();
  }, 100);

  return { close };
}
