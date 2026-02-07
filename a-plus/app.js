const STORAGE_KEY = "APLUS_STATE";
const FOLDER_ROOT = "/PublicLogic/A+";

const adapters = {
  graph: {
    async fetchCalendar() {
      return [];
    }
  },
  storage: {
    async createFolder(path) {
      return path;
    }
  }
};

function nowIso() {
  return new Date().toISOString();
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function buildFolderPath(item) {
  const created = new Date(item.createdAt || nowIso());
  const year = created.getFullYear();
  const month = String(created.getMonth() + 1).padStart(2, "0");
  const slug = slugify(item.title) || item.type;
  return `${FOLDER_ROOT}/${item.type}/${year}/${month}/${slug}-${item.id.slice(0, 6)}`;
}

function ensureFolder(item) {
  if (!item.folderPath) item.folderPath = buildFolderPath(item);
  adapters.storage.createFolder(item.folderPath);
  return item;
}

function defaultState() {
  const today = new Date();
  const later = new Date(today.getTime() + 60 * 60 * 1000);
  const laterTwo = new Date(today.getTime() + 2.5 * 60 * 60 * 1000);

  return {
    currentUser: "Nate",
    owned: [
      ensureFolder({
        id: crypto.randomUUID(),
        type: "task",
        title: "Finalize HMLP redirect cleanup",
        owner: "Nate",
        status: "Owned",
        createdAt: nowIso(),
        source: "manual"
      })
    ],
    shared: [
      ensureFolder({
        id: crypto.randomUUID(),
        type: "project",
        title: "HMLP onboarding checklist",
        owner: "Allie",
        status: "Shared",
        createdAt: nowIso(),
        source: "manual"
      })
    ],
    parked: [
      ensureFolder({
        id: crypto.randomUUID(),
        type: "lead",
        title: "RFP follow-up (waiting on scope)",
        owner: "Nate",
        status: "Parked",
        createdAt: nowIso(),
        source: "manual"
      })
    ],
    signals: {
      calendar: [
        {
          id: crypto.randomUUID(),
          title: "City kickoff call",
          start: today.toISOString(),
          end: later.toISOString()
        },
        {
          id: crypto.randomUUID(),
          title: "Partner sync",
          start: laterTwo.toISOString(),
          end: new Date(laterTwo.getTime() + 45 * 60 * 1000).toISOString()
        }
      ],
      prompts: [
        { id: crypto.randomUUID(), title: "Review invoice queue" },
        { id: crypto.randomUUID(), title: "Confirm meeting brief" }
      ]
    }
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    return null;
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

const state = loadState() || defaultState();

const ownedList = document.getElementById("owned-list");
const sharedList = document.getElementById("shared-list");
const parkedList = document.getElementById("parked-list");
const calendarList = document.getElementById("calendar-list");
const promptList = document.getElementById("prompt-list");

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatTimeRange(startIso, endIso) {
  const start = new Date(startIso);
  const end = new Date(endIso);
  const fmt = new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit"
  });
  return `${fmt.format(start)} - ${fmt.format(end)}`;
}

function renderItems(listEl, items, actions, metaFn) {
  listEl.innerHTML = items.map((item) => {
    const meta = metaFn ? metaFn(item) : `${item.owner} · ${item.type}`;
    const buttons = actions.map((action) => (
      `<button class="btn ${action.variant || ""}" data-action="${action.action}" data-id="${item.id}">${action.label}</button>`
    )).join("");

    return `
      <li class="item" data-id="${item.id}">
        <div>
          <div class="item__title">${escapeHtml(item.title)}</div>
          <div class="item__meta">${escapeHtml(meta)}</div>
        </div>
        <div class="item__actions">${buttons}</div>
      </li>
    `;
  }).join("");
}

function renderSignals(listEl, items, label) {
  listEl.innerHTML = items.map((item) => {
    const meta = item.start ? formatTimeRange(item.start, item.end) : label;
    return `
      <li class="item" data-id="${item.id}">
        <div>
          <div class="item__title">${escapeHtml(item.title)}</div>
          <div class="item__meta">${escapeHtml(meta)}</div>
        </div>
        <div class="item__actions">
          <button class="btn btn--accent" data-action="capture" data-id="${item.id}">Capture</button>
        </div>
      </li>
    `;
  }).join("");
}

function render() {
  renderItems(ownedList, state.owned, [
    { label: "Close", action: "close", variant: "btn--accent" },
    { label: "Share", action: "share", variant: "btn--warn" }
  ]);

  renderItems(sharedList, state.shared, [
    { label: "Nudge", action: "nudge", variant: "btn--warn" },
    { label: "Park", action: "park", variant: "" }
  ], (item) => `${item.owner} · shared`);

  renderItems(parkedList, state.parked, [
    { label: "Unpark", action: "unpark", variant: "btn--accent" }
  ], (item) => `${item.owner} · parked`);

  renderSignals(calendarList, state.signals.calendar, "calendar");
  renderSignals(promptList, state.signals.prompts, "prompt");
}

function findAndRemove(list, id) {
  const idx = list.findIndex((item) => item.id === id);
  if (idx === -1) return null;
  return list.splice(idx, 1)[0];
}

function createItem({ type, title, section, source }) {
  const item = ensureFolder({
    id: crypto.randomUUID(),
    type,
    title,
    owner: state.currentUser,
    status: section === "parked" ? "Parked" : "Owned",
    createdAt: nowIso(),
    source: source || "manual"
  });

  if (section === "parked") state.parked.unshift(item);
  else state.owned.unshift(item);
  saveState(state);
  render();
}

function handleAction(section, action, id) {
  if (section === "owned") {
    const item = findAndRemove(state.owned, id);
    if (!item) return;

    if (action === "close") {
      item.status = "Closed";
      item.closedAt = nowIso();
      state.parked.unshift(item);
    }

    if (action === "share") {
      item.status = "Shared";
      state.shared.unshift(item);
    }
  }

  if (section === "shared") {
    const item = findAndRemove(state.shared, id);
    if (!item) return;

    if (action === "nudge") {
      item.nudgedAt = nowIso();
      state.shared.unshift(item);
    }

    if (action === "park") {
      item.status = "Parked";
      state.parked.unshift(item);
    }
  }

  if (section === "parked") {
    const item = findAndRemove(state.parked, id);
    if (!item) return;

    if (action === "unpark") {
      item.status = "Owned";
      state.owned.unshift(item);
    }
  }

  saveState(state);
  render();
}

function handleSignal(section, action, id) {
  if (action !== "capture") return;

  if (section === "calendar") {
    const item = findAndRemove(state.signals.calendar, id);
    if (!item) return;
    createItem({
      type: "task",
      title: item.title,
      section: "owned",
      source: "calendar"
    });
  }

  if (section === "prompt") {
    const item = findAndRemove(state.signals.prompts, id);
    if (!item) return;
    createItem({
      type: "task",
      title: item.title,
      section: "parked",
      source: "prompt"
    });
  }

  saveState(state);
  render();
}

function bindList(listEl, section) {
  listEl.addEventListener("click", (event) => {
    const btn = event.target.closest("button[data-action]");
    if (!btn) return;
    handleAction(section, btn.dataset.action, btn.dataset.id);
  });
}

function bindSignals(listEl, section) {
  listEl.addEventListener("click", (event) => {
    const btn = event.target.closest("button[data-action]");
    if (!btn) return;
    handleSignal(section, btn.dataset.action, btn.dataset.id);
  });
}

bindList(ownedList, "owned");
bindList(sharedList, "shared");
bindList(parkedList, "parked");
bindSignals(calendarList, "calendar");
bindSignals(promptList, "prompt");

const actionBar = document.querySelector(".action-bar");
actionBar.addEventListener("click", (event) => {
  const btn = event.target.closest("button[data-create]");
  if (!btn) return;

  const type = btn.dataset.create;
  const titleMap = {
    task: "New task",
    lead: "New lead",
    project: "New project"
  };

  createItem({
    type,
    title: titleMap[type] || "New item",
    section: "owned",
    source: "manual"
  });
});

const userButtons = document.querySelectorAll(".user__btn");
userButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    state.currentUser = btn.dataset.user;
    userButtons.forEach((b) => b.setAttribute("aria-pressed", b === btn ? "true" : "false"));
    saveState(state);
  });
});

render();

adapters.graph.fetchCalendar();
