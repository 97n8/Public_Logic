// phillipston-standalone.js (or hmlp/app-standalone.js)
// Standalone browser entrypoint for the Phillipston app
// Can be loaded directly or via router

import { PhillipstonShell } from "./PhillipstonApp.js";  // adjust path if needed

/**
 * Main standalone render function.
 * Accepts the same context shape as router pages.
 * Returns the root DOM node of the Phillipston app.
 */
export default function renderStandalonePhillipston(ctx = {}) {
  // Provide safe fallback context if called without arguments
  const safeCtx = {
    cfg: ctx.cfg || window.PUBLICLOGIC_OS_CONFIG || {},
    auth: ctx.auth || null,
    sp: ctx.sp || null,
    userEmail: ctx.userEmail || null,
    refresh: ctx.refresh || (() => {}),
    closeMobileNav: ctx.closeMobileNav || (() => {}),
    // Add any other ctx properties you commonly use
    ...ctx
  };

  try {
    const root = PhillipstonShell(safeCtx);

    // Optional: auto-mount to document.body if called standalone
    if (!ctx.contentEl && !ctx.mountPoint) {
      const mountPoint = document.getElementById("app") || document.body;
      clear(mountPoint);
      mountPoint.appendChild(root);
    }

    return root;
  } catch (err) {
    console.error("Phillipston standalone render failed:", err);

    // Fallback error UI
    const errorRoot = el("div", { class: "boot error" }, [
      el("h2", {}, ["Phillipston App Error"]),
      el("p", {}, ["Could not load the Phillipston environment."]),
      el("pre", { style: "font-size:13px; white-space:pre-wrap; color:#fb7185;" }, [
        err.message || String(err)
      ])
    ]);

    return errorRoot;
  }
}

// Optional: auto-run when loaded as standalone script
if (typeof window !== "undefined" && !window.__PHILLIPSTON_MOUNTED) {
  window.__PHILLIPSTON_MOUNTED = true;
  renderStandalonePhillipston();
}
