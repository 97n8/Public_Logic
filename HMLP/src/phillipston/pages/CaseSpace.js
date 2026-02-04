export function CaseSpace() {
  const root = document.createElement("div");
  root.className = "case-space";

  /* ===== Hero ===== */
  const hero = document.createElement("section");
  hero.className = "case-hero";

  const h2 = document.createElement("h2");
  h2.textContent = "PRR Case Space";

  const heroP = document.createElement("p");
  heroP.textContent =
    "System of record for Public Records Requests. All actions here are logged and defensible.";

  hero.appendChild(h2);
  hero.appendChild(heroP);

  /* ===== Stats ===== */
  const stats = document.createElement("section");
  stats.className = "case-stats";

  stats.appendChild(stat("⏱️", "Open Requests", "6"));
  stats.appendChild(stat("📄", "Active Responses", "3"));
  stats.appendChild(stat("🗄️", "Archived PRRs", "142"));
  stats.appendChild(stat("🛡️", "T10 Status", "Compliant"));

  /* ===== Actions ===== */
  const actions = document.createElement("section");
  actions.className = "case-actions";

  actions.appendChild(link(
    "📁 Open PRR Folder",
    "https://publiclogic978.sharepoint.com/sites/PL/Shared%20Documents/01_Towns/MA/Phillipston/PRR"
  ));

  actions.appendChild(link("🗄️ ARCHIEVE List", "#"));
  actions.appendChild(link("📘 Training & SOPs", "https://www.publiclogic.org/demo"));

  /* ===== Notes ===== */
  const notes = document.createElement("section");
  notes.className = "case-notes";

  const noteIcon = document.createElement("span");
  noteIcon.textContent = "⚠️";

  const noteText = document.createElement("span");
  noteText.textContent =
    "This workspace preserves institutional memory and protects the Town from turnover-related liability.";

  notes.appendChild(noteIcon);
  notes.appendChild(noteText);

  /* ===== Assemble ===== */
  root.appendChild(hero);
  root.appendChild(stats);
  root.appendChild(actions);
  root.appendChild(notes);

  return root;
}

/* ===== Helpers ===== */

function stat(icon, label, value) {
  const wrap = document.createElement("div");
  wrap.className = "stat";

  const iconEl = document.createElement("div");
  iconEl.className = "stat__icon";
  iconEl.textContent = icon;

  const textWrap = document.createElement("div");

  const val = document.createElement("div");
  val.className = "stat__value";
  val.textContent = value;

  const lab = document.createElement("div");
  lab.className = "stat__label";
  lab.textContent = label;

  textWrap.appendChild(val);
  textWrap.appendChild(lab);

  wrap.appendChild(iconEl);
  wrap.appendChild(textWrap);

  return wrap;
}

function link(label, href) {
  const a = document.createElement("a");
  a.href = href;
  a.target = "_blank";
  a.rel = "noopener";
  a.textContent = label;
  return a;
}
