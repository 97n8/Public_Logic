// lib/tables.js
import { el } from "./dom.js";
import { getPillVariant } from "./constants.js";

export function statusPill(status, fallback = "") {
  const text = status || fallback;
  const variant = getPillVariant(text);
  const cls = ["pill", variant ? `pill--${variant}` : ""].filter(Boolean).join(" ");
  return el("span", { class: cls }, [text]);
}

export function renderTable({ columns, rows, emptyMessage = "No data." }) {
  if (!rows || rows.length === 0) {
    return el("div", { class: "small" }, [emptyMessage]);
  }

  const thead = el("thead", {}, [
    el("tr", {}, columns.map((c) => el("th", {}, [c.label])))
  ]);

  const tbody = el("tbody", {}, rows.map((row) =>
    el("tr", {}, columns.map((c) => {
      const content = c.render ? c.render(row) : (row[c.key] || "");
      return el("td", { class: c.muted ? "row-muted" : "" }, [content]);
    }))
  ));

  return el("table", { class: "table" }, [thead, tbody]);
}

export function actionButtons(actions) {
  const valid = (actions || []).filter(Boolean);
  return el("div", { class: "chiprow" }, valid.map((a) =>
    a.href
      ? el("a", { class: "btn", href: a.href, target: "_blank", rel: "noreferrer" }, [a.label])
      : el("button", { class: ["btn", a.variant ? `btn--${a.variant}` : ""].filter(Boolean).join(" "), type: "button", onclick: a.onClick }, [a.label])
  ));
}
