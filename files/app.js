/* =========================================
   CONFIGURATION
   ========================================= */

const CONFIG = {
  // Power Automate HTTP trigger URL
  POWER_AUTOMATE_URL: 'PASTE_YOUR_POWER_AUTOMATE_HTTP_URL_HERE',
  
  // Active towns
  TOWNS: ['Sutton', 'Millbury', 'Hubbardston'],
  
  // Real URLs - replace placeholders with actual SharePoint/M365 URLs
  URLS: {
    // Core M365
    mail: 'https://outlook.office.com/mail/',
    calendar: 'https://outlook.office.com/calendar/',
    todo: 'https://to-do.office.com/',
    teams: 'https://teams.microsoft.com',
    onedrive: 'PASTE_REAL_ONEDRIVE_URL',
    sharepoint: 'PASTE_REAL_SHAREPOINT_HOME_URL',
    
    // Standards
    filingSOP: 'PASTE_REAL_FILING_SOP_URL',
    templates: 'PASTE_REAL_TEMPLATES_URL',
    naming: 'PASTE_REAL_NAMING_STANDARD_URL',
    training: 'PASTE_REAL_TRAINING_URL',
    filingLog: 'PASTE_REAL_FILING_LOG_URL',
    requests: 'PASTE_REAL_REQUESTS_URL',
    
    // Town roots
    towns: {
      Sutton: 'PASTE_SUTTON_ROOT_URL',
      Millbury: 'PASTE_MILLBURY_ROOT_URL',
      Hubbardston: 'PASTE_HUBBARDSTON_ROOT_URL',
      Internal: 'PASTE_INTERNAL_ROOT_URL'
    },
    
    // Shared folders
    boardPacks: 'PASTE_BOARD_PACKS_URL',
    deliverables: 'PASTE_DELIVERABLES_URL'
  }
};

// Link definitions
const LINKS = {
  core: [
    { name: 'Mail', desc: 'Outlook', url: CONFIG.URLS.mail },
    { name: 'Calendar', desc: 'Outlook', url: CONFIG.URLS.calendar },
    { name: 'Tasks', desc: 'To Do', url: CONFIG.URLS.todo },
    { name: 'Teams', desc: 'Chat', url: CONFIG.URLS.teams },
    { name: 'OneDrive', desc: 'Files', url: CONFIG.URLS.onedrive },
    { name: 'SharePoint', desc: 'Sites', url: CONFIG.URLS.sharepoint }
  ],
  build: [
    { name: 'Automate', desc: 'Power Automate', url: 'https://make.powerautomate.com' },
    { name: 'Lists', desc: 'Logs', url: 'https://www.office.com/launch/lists' },
    { name: 'Forms', desc: 'Intake', url: 'https://www.office.com/launch/forms' },
    { name: 'Copilot', desc: 'M365', url: 'https://copilot.microsoft.com' },
    { name: 'ChatGPT', desc: 'Reasoning', url: 'https://chat.openai.com' },
    { name: 'Claude', desc: 'Drafting', url: 'https://claude.ai' }
  ],
  towns: [
    { name: 'Sutton', desc: 'Root', url: CONFIG.URLS.towns.Sutton },
    { name: 'Millbury', desc: 'Root', url: CONFIG.URLS.towns.Millbury },
    { name: 'Hubbardston', desc: 'Root', url: CONFIG.URLS.towns.Hubbardston },
    { name: 'Internal', desc: 'Admin', url: CONFIG.URLS.towns.Internal },
    { name: 'Board Packs', desc: 'Ready', url: CONFIG.URLS.boardPacks },
    { name: 'Deliverables', desc: 'Outputs', url: CONFIG.URLS.deliverables }
  ],
  standards: [
    { name: 'Filing SOP', desc: 'Required', url: CONFIG.URLS.filingSOP },
    { name: 'Templates', desc: 'Reusable', url: CONFIG.URLS.templates },
    { name: 'Naming', desc: 'Standard', url: CONFIG.URLS.naming },
    { name: 'Training', desc: 'How to', url: CONFIG.URLS.training },
    { name: 'Filing Log', desc: 'List', url: CONFIG.URLS.filingLog },
    { name: 'Requests', desc: 'Queue', url: CONFIG.URLS.requests }
  ]
};

/* =========================================
   STATE
   ========================================= */

const state = {
  queue: [],
  isSending: false,
  lastFolderUrl: null
};

/* =========================================
   UTILITIES
   ========================================= */

const $ = (id) => document.getElementById(id);

const escapeHtml = (str) => {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
};

// Sanitize for filename safety (Windows + SharePoint compatible)
const sanitize = (str) => {
  return (str || '').toString().trim()
    .replace(/[\/\\:*?"<>|]+/g, '')  // illegal chars
    .replace(/\.+$/g, '')             // trailing dots
    .replace(/\s+/g, ' ')             // collapse whitespace
    .slice(0, 60);                    // tight cap for path length safety
};

// Enforce two-word max for short titles
const clampTwoWords = (str) => {
  const clean = sanitize(str);
  if (!clean) return '';
  const parts = clean.split(' ').filter(Boolean);
  return parts.slice(0, 2).join(' ');
};

const formatDate = (d) => {
  const yyyy = d.getFullYear().toString();
  const mm = (d.getMonth() + 1).toString().padStart(2, '0');
  const dd = d.getDate().toString().padStart(2, '0');
  return `${yyyy}${mm}${dd}`;
};

const formatVersion = (n) => 'v' + Math.max(1, Math.min(99, n)).toString().padStart(2, '0');

const parseVersion = (v) => {
  const n = parseInt((v || '').toString().replace('v', ''), 10);
  return Number.isFinite(n) ? Math.max(1, Math.min(99, n)) : 1;
};

const formatBytes = (bytes) => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

const formatTime = (date) => {
  const now = new Date();
  const diff = now - date;
  if (diff < 60000) return 'just now';
  if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago';
  if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago';
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

/* =========================================
   TOAST
   ========================================= */

let toastTimeout;

const toast = (message) => {
  const el = $('toast');
  el.innerHTML = message;
  el.classList.add('visible');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => el.classList.remove('visible'), 2000);
};

/* =========================================
   STATUS
   ========================================= */

const setStatus = (text, type = 'ready') => {
  const el = $('status');
  const span = el.querySelector('span');
  span.textContent = text;
  
  el.className = 'status-indicator';
  switch (type) {
    case 'ready':
      el.classList.add('status-ready');
      break;
    case 'success':
      el.classList.add('status-success');
      break;
    case 'busy':
      el.classList.add('status-busy');
      break;
    case 'warn':
      el.classList.add('status-warn');
      break;
    case 'error':
      el.classList.add('status-error');
      break;
    default:
      el.classList.add('status-ready');
  }
};

const setStatusLabel = (text) => {
  $('statusLabel').textContent = text;
};

/* =========================================
   LINKS RENDERING
   ========================================= */

const renderLinks = (containerId, links) => {
  const container = $(containerId);
  container.innerHTML = '';
  
  links.forEach(link => {
    const a = document.createElement('a');
    a.className = 'link-card tap';
    a.href = link.url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.dataset.search = `${link.name} ${link.desc}`.toLowerCase();
    a.innerHTML = `
      <span class="link-name">${escapeHtml(link.name)}</span>
      <span class="link-desc">${escapeHtml(link.desc)}</span>
    `;
    container.appendChild(a);
  });
};

const filterLinks = (term) => {
  const t = term.toLowerCase().trim();
  document.querySelectorAll('.link-card').forEach(link => {
    const match = !t || (link.dataset.search || '').includes(t);
    link.style.display = match ? '' : 'none';
  });
};

/* =========================================
   FORM STATE
   ========================================= */

const getEffectiveTown = () => {
  const mode = $('mode').value;
  if (mode !== 'Town') return '';
  return sanitize($('town').value);
};

// Fixed: includes operator, uses clampTwoWords for shortTitle
const getMeta = () => ({
  mode: sanitize($('mode').value),
  operator: sanitize($('operator').value),
  town: getEffectiveTown(),
  category: sanitize($('category').value),
  sensitivity: sanitize($('sensitivity').value),
  shortTitle: clampTwoWords($('shortTitle').value),
  version: sanitize($('version').value),
  initials: sanitize($('initials').value),
  notes: sanitize($('notes').value),
  capturedAt: new Date().toISOString()
});

/* =========================================
   PATH COMPUTATION - PUBLICLOGIC DOCTRINE
   ========================================= */

// Category options by mode
const CATEGORIES = {
  Town: [
    { value: 'Intake', label: 'Intake' },
    { value: 'Discovery', label: 'Discovery' },
    { value: 'Delivery', label: 'Delivery' },
    { value: 'Governance_Record', label: 'Governance Record' },
    { value: 'Communications', label: 'Communications' },
    { value: 'Artifacts', label: 'Artifacts' },
    { value: 'Closeout', label: 'Closeout' }
  ],
  Research: [
    { value: 'Research', label: 'Research' },
    { value: 'Drafts', label: 'Drafts' },
    { value: 'White_Papers', label: 'White Papers' },
    { value: 'Essays_&_Notes', label: 'Essays & Notes' },
    { value: 'Published', label: 'Published' }
  ],
  Admin: [
    { value: 'Operations', label: 'Operations' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Contracts', label: 'Contracts' },
    { value: 'HR', label: 'HR' }
  ]
};

const computePath = () => {
  const mode = $('mode').value;
  const town = getEffectiveTown();
  const category = sanitize($('category').value);
  const sensitivity = sanitize($('sensitivity').value);

  // Restricted always goes to 05_Restricted
  if (sensitivity === 'Restricted') {
    if (mode === 'Town' && town) {
      return `05_Restricted / Legal / ${town}`;
    }
    return '05_Restricted / Legal';
  }

  // Town mode
  if (mode === 'Town') {
    if (!town) return '03_Admin / INBOX';
    
    // Map category to folder number
    const townFolders = {
      'Intake': '01_Intake',
      'Discovery': '02_Discovery',
      'Delivery': '03_Delivery',
      'Governance_Record': '04_Governance_Record',
      'Communications': '05_Communications',
      'Artifacts': '06_Artifacts',
      'Closeout': '07_Closeout'
    };
    
    const folder = townFolders[category] || '02_Discovery';
    return `01_Towns / ${town} / ${folder}`;
  }

  // Research mode
  if (mode === 'Research') {
    const researchFolders = {
      'Research': '01_Research',
      'Drafts': '02_Drafts',
      'White_Papers': '03_White_Papers',
      'Essays_&_Notes': '04_Essays_&_Notes',
      'Published': '05_Published'
    };
    
    const folder = researchFolders[category] || '02_Drafts';
    return `02_Research_&_Writing / ${folder}`;
  }

  // Admin mode
  if (mode === 'Admin') {
    return `03_Admin / ${category}`;
  }

  return '03_Admin / INBOX';
};

const computeFilename = () => {
  const date = formatDate(new Date());
  const mode = $('mode').value;
  const town = getEffectiveTown();
  const category = sanitize($('category').value);
  const shortTitle = clampTwoWords($('shortTitle').value) || 'Work';
  const version = sanitize($('version').value) || 'v01';
  const initials = sanitize($('initials').value) || 'NB';
  
  // Format: YYYYMMDD [Town/PL] Category ShortTitle vXX Initials
  const prefix = mode === 'Town' && town ? town : 'PL';
  return `${date} ${prefix} ${category} ${shortTitle} ${version} ${initials}`;
};

const updatePreview = () => {
  $('pathPreview').textContent = computePath();
  $('namePreview').textContent = computeFilename();
};

/* =========================================
   VERSION MEMORY
   ========================================= */

const VERSION_KEY = 'pl_workstation_versions_v2';

const getVersionMap = () => {
  try {
    return JSON.parse(localStorage.getItem(VERSION_KEY) || '{}');
  } catch {
    return {};
  }
};

const saveVersionMap = (map) => {
  localStorage.setItem(VERSION_KEY, JSON.stringify(map));
};

const getVersionSignature = (meta) => {
  const mode = sanitize($('mode').value);
  const town = mode === 'Town' ? sanitize(meta.town) : 'PL';
  return [mode, town, meta.category, meta.shortTitle, meta.initials].join('|');
};

const suggestVersion = () => {
  const meta = getMeta();
  const sig = getVersionSignature(meta);
  const map = getVersionMap();
  const last = map[sig];
  return last ? formatVersion(parseVersion(last) + 1) : 'v01';
};

const rememberVersion = (meta) => {
  const sig = getVersionSignature(meta);
  const map = getVersionMap();
  map[sig] = meta.version;
  saveVersionMap(map);
  return sig;
};

const applySuggestedVersion = () => {
  const suggested = suggestVersion();
  const current = $('version').value || 'v01';
  
  // Only auto-apply if user hasn't manually changed it
  if (current === 'v01' || current === suggested) {
    $('version').value = suggested;
  }
  updatePreview();
};

/* =========================================
   QUEUE MANAGEMENT
   ========================================= */

const renderQueue = () => {
  const container = $('queue');
  container.innerHTML = '';

  if (state.queue.length === 0) {
    container.innerHTML = '<div class="queue-empty">No files queued</div>';
    setStatusLabel('Drop files to queue');
    return;
  }

  setStatusLabel(`${state.queue.length} file${state.queue.length !== 1 ? 's' : ''} queued`);

  state.queue.forEach((file, idx) => {
    const item = document.createElement('div');
    item.className = 'queue-item';
    item.innerHTML = `
      <div class="queue-item-info">
        <div class="queue-item-name">${escapeHtml(file.name)}</div>
        <div class="queue-item-size">${formatBytes(file.size)}</div>
      </div>
    `;
    
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'queue-item-remove tap';
    removeBtn.innerHTML = '✕';
    removeBtn.setAttribute('aria-label', `Remove ${file.name}`);
    removeBtn.addEventListener('click', () => {
      state.queue.splice(idx, 1);
      renderQueue();
      toast('<strong>Removed</strong> from queue');
    });
    
    item.appendChild(removeBtn);
    container.appendChild(item);
  });
};

const addFiles = (fileList) => {
  const files = Array.from(fileList);
  const seen = new Set(state.queue.map(f => `${f.name}|${f.size}`));
  
  files.forEach(file => {
    const key = `${file.name}|${file.size}`;
    if (!seen.has(key)) {
      state.queue.push(file);
      seen.add(key);
    }
  });
  
  renderQueue();
  toast(`<strong>${files.length} file${files.length !== 1 ? 's' : ''}</strong> queued`);
};

/* =========================================
   RECENT FILINGS HISTORY
   ========================================= */

const HISTORY_KEY = 'pl_workstation_history_v1';
const MAX_HISTORY = 5;

const getHistory = () => {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  } catch {
    return [];
  }
};

const addToHistory = (meta) => {
  const history = getHistory();
  history.unshift({
    filename: computeFilename(),
    timestamp: Date.now()
  });
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, MAX_HISTORY)));
  renderHistory();
};

const renderHistory = () => {
  const container = $('recentFilings');
  const history = getHistory();
  
  if (history.length === 0) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = `
    <div class="section-header">
      <span class="section-title">Recent</span>
    </div>
  `;
  
  history.forEach(item => {
    const div = document.createElement('div');
    div.className = 'recent-filing';
    div.innerHTML = `
      <span class="recent-filing-name">${escapeHtml(item.filename)}</span>
      <span class="recent-filing-time">${formatTime(new Date(item.timestamp))}</span>
    `;
    container.appendChild(div);
  });
};

/* =========================================
   DEFAULTS
   ========================================= */

const DEFAULTS_KEY = 'pl_workstation_defaults_v6';

const saveDefaults = () => {
  const data = {
    mode: $('mode').value,
    operator: $('operator').value,
    town: $('town').value,
    category: $('category').value,
    sensitivity: $('sensitivity').value,
    initials: $('initials').value
  };
  localStorage.setItem(DEFAULTS_KEY, JSON.stringify(data));
  setStatus('Saved', 'success');
  toast('<strong>Defaults saved</strong>');
  setTimeout(() => setStatus('Ready', 'ready'), 1500);
};

const loadDefaults = () => {
  try {
    const data = JSON.parse(localStorage.getItem(DEFAULTS_KEY) || '{}');
    if (data.mode) $('mode').value = data.mode;
    if (data.operator) $('operator').value = data.operator;
    if (data.town) $('town').value = data.town;
    // Category is set after applyMode, so we store but don't restore here
    if (data.sensitivity) $('sensitivity').value = data.sensitivity;
    if (data.initials) $('initials').value = data.initials;
  } catch {}
};

/* =========================================
   MODE HANDLING
   ========================================= */

const updateCategoryOptions = (mode) => {
  const categorySelect = $('category');
  const categories = CATEGORIES[mode] || CATEGORIES.Town;
  
  categorySelect.innerHTML = '';
  categories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat.value;
    opt.textContent = cat.label;
    categorySelect.appendChild(opt);
  });
};

const applyMode = () => {
  const mode = $('mode').value;
  const townRow = $('townRow');
  
  // Update category options for this mode
  updateCategoryOptions(mode);
  
  if (mode === 'Town') {
    // Show town selector
    townRow.classList.remove('hidden');
    if (!$('shortTitle').value) {
      $('shortTitle').value = '';
    }
  } else {
    // Hide town selector for Research and Admin
    townRow.classList.add('hidden');
    $('town').value = '';
    
    // Set default short titles
    if (!$('shortTitle').value) {
      if (mode === 'Research') {
        $('shortTitle').value = 'Draft';
      } else if (mode === 'Admin') {
        $('shortTitle').value = 'Internal';
      }
    }
  }
  
  applySuggestedVersion();
};

const applyOperator = () => {
  $('initials').value = $('operator').value;
  applySuggestedVersion();
};

/* =========================================
   PRESETS
   ========================================= */

const applyPreset = (preset) => {
  const presets = {
    discovery: {
      mode: 'Town',
      category: 'Discovery',
      sensitivity: 'Normal',
      shortTitle: 'Interview Notes'
    },
    governance: {
      mode: 'Town',
      category: 'Governance_Record',
      sensitivity: 'Normal',
      shortTitle: 'Decision Record'
    },
    delivery: {
      mode: 'Town',
      category: 'Closeout',
      sensitivity: 'Normal',
      shortTitle: 'Final Deliverable'
    }
  };

  const p = presets[preset];
  if (!p) return;

  $('mode').value = p.mode;
  applyMode(); // This updates category options
  $('category').value = p.category;
  $('sensitivity').value = p.sensitivity;
  $('shortTitle').value = p.shortTitle;
  
  applySuggestedVersion();
  toast(`<strong>${preset.charAt(0).toUpperCase() + preset.slice(1)}</strong> preset loaded`);
};
};

/* =========================================
   VALIDATION
   ========================================= */

const validate = () => {
  const meta = getMeta();
  
  if (meta.mode === 'Town' && !meta.town) {
    setStatus('Town required', 'warn');
    toast('<strong>Town required</strong> — Select a town');
    return false;
  }
  
  if (!meta.shortTitle) {
    setStatus('Title required', 'warn');
    toast('<strong>Short title required</strong> — Two words max');
    return false;
  }
  
  if (state.queue.length === 0) {
    setStatus('No files', 'warn');
    toast('<strong>No files</strong> — Drop or select files first');
    return false;
  }
  
  return true;
};

/* =========================================
   OPEN FOLDER BUTTON
   ========================================= */

const showOpenFolderButton = (url) => {
  const btn = $('openFolder');
  state.lastFolderUrl = url;
  btn.classList.remove('hidden');
  btn.onclick = () => window.open(url, '_blank', 'noopener');
};

const hideOpenFolderButton = () => {
  const btn = $('openFolder');
  btn.classList.add('hidden');
  state.lastFolderUrl = null;
};

/* =========================================
   SEND TO FILING
   ========================================= */

const sendToFiling = async () => {
  if (CONFIG.POWER_AUTOMATE_URL.includes('PASTE_YOUR')) {
    alert('Configure POWER_AUTOMATE_URL in app.js before using.');
    return;
  }

  if (!validate()) return;
  if (state.isSending) return;

  state.isSending = true;
  setStatus('Sending…', 'busy');
  setStatusLabel('Uploading to SharePoint…');
  hideOpenFolderButton();

  const meta = getMeta();
  meta.targetPath = computePath();
  meta.filename = computeFilename();

  const formData = new FormData();
  Object.entries(meta).forEach(([k, v]) => formData.append(k, v));
  state.queue.forEach((file, i) => formData.append(`file_${i + 1}`, file, file.name));

  try {
    const response = await fetch(CONFIG.POWER_AUTOMATE_URL, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    // Success - even if we can't parse JSON, response.ok means it worked
    let result = {};
    try { 
      const text = await response.text();
      result = JSON.parse(text); 
    } catch {}

    rememberVersion(meta);
    addToHistory(meta);
    
    setStatus('Filed', 'success');
    setStatusLabel('Filed successfully');
    toast('<strong>Filed</strong> — Clean path, clean name');
    
    state.queue = [];
    $('notes').value = '';
    renderQueue();
    applySuggestedVersion();

    // Open filed file if URL returned
    if (result.filedUrl) {
      window.open(result.filedUrl, '_blank', 'noopener');
    }

    // Show open folder button if URL returned
    if (result.folderUrl) {
      showOpenFolderButton(result.folderUrl);
    }

    // Reset status after delay
    setTimeout(() => {
      setStatus('Ready', 'ready');
    }, 3000);

  } catch (err) {
    console.error('Filing error:', err);
    setStatus('Failed', 'error');
    setStatusLabel('Filing failed, check Flow history');
    toast('<strong>Failed</strong> — Check Flow run history');
  } finally {
    state.isSending = false;
  }
};

/* =========================================
   CLIPBOARD
   ========================================= */

const copyToClipboard = async (text, label) => {
  try {
    await navigator.clipboard.writeText(text);
    setStatus('Copied', 'success');
    toast(`<strong>${label}</strong> copied`);
    setTimeout(() => setStatus('Ready', 'ready'), 1500);
  } catch {
    // Fallback
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    toast(`<strong>${label}</strong> copied`);
  }
};

/* =========================================
   EXPORT
   ========================================= */

const exportMeta = () => {
  const meta = getMeta();
  meta.targetPath = computePath();
  meta.filename = computeFilename();
  
  const blob = new Blob([JSON.stringify(meta, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${computeFilename()} meta.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  
  toast('<strong>Exported</strong> — JSON downloaded');
};

/* =========================================
   CLOCK
   ========================================= */

const updateClock = () => {
  const now = new Date();
  $('clock').textContent = now.toLocaleString([], {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/* =========================================
   INSTALL DETECTION
   ========================================= */

const isIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches || 
                             window.navigator.standalone === true;

/* =========================================
   SERVICE WORKER
   ========================================= */

const registerServiceWorker = async () => {
  if (!('serviceWorker' in navigator)) return;
  try {
    await navigator.serviceWorker.register('sw.js', { scope: './' });
  } catch (err) {
    console.warn('SW registration failed:', err);
  }
};

/* =========================================
   INITIALIZATION
   ========================================= */

const init = () => {
  // Year
  $('year').textContent = new Date().getFullYear();
  
  // Render links
  renderLinks('coreLinks', LINKS.core);
  renderLinks('buildLinks', LINKS.build);
  renderLinks('townLinks', LINKS.towns);
  renderLinks('standardLinks', LINKS.standards);
  
  // Town datalist
  const townList = $('townList');
  CONFIG.TOWNS.forEach(t => {
    const opt = document.createElement('option');
    opt.value = t;
    townList.appendChild(opt);
  });
  
  // Version options
  const versionSelect = $('version');
  for (let i = 1; i <= 20; i++) {
    const opt = document.createElement('option');
    opt.value = formatVersion(i);
    opt.textContent = formatVersion(i);
    versionSelect.appendChild(opt);
  }
  
  // Load defaults
  loadDefaults();
  
  // Set initial initials from operator
  if (!$('initials').value) {
    $('initials').value = $('operator').value || 'NB';
  }
  
  // Apply mode
  applyMode();
  
  // Render queue and history
  renderQueue();
  renderHistory();
  
  // Clock
  updateClock();
  setInterval(updateClock, 30000);
  
  // Event listeners
  $('mode').addEventListener('change', applyMode);
  $('operator').addEventListener('change', applyOperator);
  
  // Form field changes
  ['town', 'category', 'sensitivity', 'shortTitle', 'version', 'initials'].forEach(id => {
    $(id).addEventListener('input', applySuggestedVersion);
    $(id).addEventListener('change', applySuggestedVersion);
  });
  
  // Search
  $('search').addEventListener('input', (e) => filterLinks(e.target.value));
  
  // Presets
  document.querySelectorAll('[data-preset]').forEach(btn => {
    btn.addEventListener('click', () => applyPreset(btn.dataset.preset));
  });
  
  // Version controls
  $('bumpVersion').addEventListener('click', () => {
    $('version').value = formatVersion(parseVersion($('version').value) + 1);
    updatePreview();
    toast('<strong>Version</strong> bumped');
  });
  
  $('rememberCombo').addEventListener('click', () => {
    const meta = getMeta();
    if (!meta.shortTitle) {
      toast('<strong>Title required</strong> to remember combo');
      return;
    }
    rememberVersion(meta);
    toast('<strong>Remembered</strong> — auto-versioning active');
  });
  
  // Drop zone - guard against double-trigger from input overlay
  const dropZone = $('dropZone');
  const filePicker = $('filePicker');
  
  dropZone.addEventListener('click', (e) => {
    if (e.target === filePicker) return;
    filePicker.click();
  });
  
  dropZone.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      filePicker.click();
    }
  });
  
  dropZone.addEventListener('dragenter', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragging');
  });
  
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragging');
  });
  
  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragging');
  });
  
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragging');
    if (e.dataTransfer?.files?.length) {
      addFiles(e.dataTransfer.files);
    }
  });
  
  filePicker.addEventListener('change', () => {
    if (filePicker.files?.length) {
      addFiles(filePicker.files);
    }
    filePicker.value = '';
  });
  
  // Action buttons
  $('sendBtn').addEventListener('click', sendToFiling);
  
  $('clearBtn').addEventListener('click', () => {
    state.queue = [];
    renderQueue();
    hideOpenFolderButton();
    setStatus('Ready', 'ready');
    toast('<strong>Cleared</strong>');
  });
  
  // Copy buttons
  $('copyPath').addEventListener('click', () => copyToClipboard(computePath(), 'Path'));
  $('copyName').addEventListener('click', () => copyToClipboard(computeFilename(), 'Filename'));
  
  // Defaults and export
  $('saveDefaults').addEventListener('click', saveDefaults);
  $('exportMeta').addEventListener('click', exportMeta);
  
  // Keyboard shortcuts
  window.addEventListener('keydown', (e) => {
    // Search focus
    if (e.key === '/' && document.activeElement !== $('search')) {
      e.preventDefault();
      $('search').focus();
    }
    
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      $('search').focus();
    }
    
    // Send
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      sendToFiling();
    }
    
    // Escape to blur search
    if (e.key === 'Escape' && document.activeElement === $('search')) {
      $('search').blur();
    }
  });
  
  // iOS install hint
  if (isIOS() && !isStandalone()) {
    $('installHint').style.display = 'block';
  }
  
  // Online/offline
  const updateOnlineStatus = () => {
    if (navigator.onLine) {
      setStatus('Ready', 'ready');
    } else {
      setStatus('Offline', 'warn');
    }
  };
  
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  updateOnlineStatus();
  
  // Service worker
  registerServiceWorker();
  
  // Initial preview
  updatePreview();
};

// Run
init();
