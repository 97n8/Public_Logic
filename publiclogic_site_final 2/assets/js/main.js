document.addEventListener("DOMContentLoaded", function () {
  const view = document.body.getAttribute("data-pl-view");
  if (view === "module") {
    initModuleView();
  }
});

function initModuleView() {
  const params = new URLSearchParams(window.location.search);
  const moduleShort = (params.get("module") || "clerk").toLowerCase();
  const townSlug = (params.get("town") || "sutton").toLowerCase();
  const townName = params.get("town_name") || "Sample town";
  const moduleCode = "VAULT" + moduleShort.toUpperCase();

  const dataPath = `/data/vault${moduleShort}-${townSlug}.json`;

  const brandTagline = document.getElementById("brandTagline");
  const pageTitle = document.getElementById("pageTitle");
  const pageLead = document.getElementById("pageLead");
  const metaPath = document.getElementById("metaPath");
  const metaInfo = document.getElementById("metaInfo");
  const statusEl = document.getElementById("status");
  const filterEl = document.getElementById("categoryFilter");
  const bodyEl = document.getElementById("metricsBody");

  if (brandTagline) {
    brandTagline.textContent = moduleCode + " | " + townName;
  }
  if (pageTitle) {
    pageTitle.textContent = moduleCode + " structure view for " + townName;
  }
  if (pageLead) {
    pageLead.textContent =
      "This view is generated from a JSON file that is meant to be updated through a neutral, structured intake. " +
      "The goal is to give boards and staff a single place to see status and structure without opening up the internals.";
  }
  if (metaPath) {
    metaPath.innerHTML = 'Data source: <code>' + dataPath + "</code>";
  }

  function setStatus(text, state) {
    if (!statusEl) return;
    statusEl.textContent = text;
    statusEl.classList.remove("status-ok", "status-error");
    if (state === "ok") statusEl.classList.add("status-ok");
    if (state === "error") statusEl.classList.add("status-error");
  }

  async function loadData() {
    try {
      const res = await fetch(dataPath, { cache: "no-store" });
      if (!res.ok) {
        throw new Error("HTTP " + res.status);
      }
      const data = await res.json();
      const metrics = Array.isArray(data.metrics) ? data.metrics : [];

      if (metaInfo) {
        const stamp = data.last_published || "not yet published";
        metaInfo.textContent =
          (data.town || townName) +
          " | " +
          (data.module || moduleCode) +
          " | Last published: " +
          stamp;
      }

      const categories = [...new Set(metrics.map(m => m.category).filter(Boolean))].sort();
      categories.forEach(cat => {
        const opt = document.createElement("option");
        opt.value = cat;
        opt.textContent = cat;
        filterEl.appendChild(opt);
      });

      function renderRows(filter) {
        const useFilter = filter || "all";
        bodyEl.innerHTML = "";
        const filtered = metrics
          .slice()
          .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
          .filter(m => (useFilter === "all" ? true : m.category === useFilter));

        if (!filtered.length) {
          const tr = document.createElement("tr");
          const td = document.createElement("td");
          td.colSpan = 4;
          td.textContent = "No metrics available yet for this view.";
          td.classList.add("muted");
          tr.appendChild(td);
          bodyEl.appendChild(tr);
          return;
        }

        filtered.forEach(m => {
          const tr = document.createElement("tr");

          const nameTd = document.createElement("td");
          nameTd.textContent = m.label || m.key || "";
          tr.appendChild(nameTd);

          const catTd = document.createElement("td");
          catTd.textContent = m.category || "";
          tr.appendChild(catTd);

          const valueTd = document.createElement("td");
          if (m.value_number !== null && m.value_number !== undefined && m.value_number !== "") {
            valueTd.textContent = m.value_number;
          } else if (m.value_text) {
            valueTd.textContent = m.value_text;
          } else {
            valueTd.textContent = "";
          }
          tr.appendChild(valueTd);

          const notesTd = document.createElement("td");
          notesTd.textContent = m.notes || "";
          tr.appendChild(notesTd);

          bodyEl.appendChild(tr);
        });
      }

      filterEl.addEventListener("change", function () {
        renderRows(filterEl.value);
      });

      renderRows("all");
      setStatus("Metrics loaded from latest snapshot.", "ok");
    } catch (err) {
      console.error(err);
      setStatus("Could not load metrics. This is expected until the JSON file is published.", "error");
      bodyEl.innerHTML = "";
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.colSpan = 4;
      td.textContent = "The JSON file for this module is not available yet.";
      td.classList.add("muted");
      tr.appendChild(td);
      bodyEl.appendChild(tr);
    }
  }

  loadData();
}
