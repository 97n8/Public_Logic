import { el } from "./dom.js";
import { mountRecordConsole } from "./record-console-mount.js";

export function openRecordConsole(ctx) {
  const overlay = el("div", {
    style: `
      position: fixed;
      inset: 0;
      background: rgba(2,6,23,0.9);
      z-index: 9999;
      overflow: auto;
    `
  });

  document.body.appendChild(overlay);

  mountRecordConsole(overlay, {
    ctx,
    onClose: () => overlay.remove()
  });
}
