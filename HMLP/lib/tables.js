// lib/config.js
export function getConfig() {
  return window.PUBLICLOGIC_OS_CONFIG || null;
}

export function validateConfig(cfg) {
  const errors = [];

  if (!cfg) {
    errors.push("Missing config.js (window.PUBLICLOGIC_OS_CONFIG is null).");
    return errors;
  }

  if (!cfg.msal?.clientId) errors.push("msal.clientId is missing");
  if (!cfg.msal?.tenantId) errors.push("msal.tenantId is missing");
  if (!cfg.msal?.redirectUri) errors.push("msal.redirectUri is missing");

  if (!Array.isArray(cfg.access?.allowedEmails) || cfg.access.allowedEmails.length === 0) {
    errors.push("access.allowedEmails must include at least one allowed user");
  }

  if (!Array.isArray(cfg.graph?.scopes) || cfg.graph.scopes.length === 0) {
    errors.push("graph.scopes is missing");
  }

  if (!cfg.sharepoint?.hostname) errors.push("sharepoint.hostname is missing");
  if (!cfg.sharepoint?.sitePath) errors.push("sharepoint.sitePath is missing");

  // ARCHIEVE is required
  if (cfg.sharepoint?.archieve?.enabled && !cfg.sharepoint?.archieve?.listName) {
    errors.push("sharepoint.archieve.listName is missing");
  }

  return errors;
}

export function hasTasksList(cfg) {
  return Boolean(cfg.sharepoint?.lists?.tasks);
}

export function hasPipelineList(cfg) {
  return Boolean(cfg.sharepoint?.lists?.pipeline);
}

export function hasProjectsList(cfg) {
  return Boolean(cfg.sharepoint?.lists?.projects);
}
