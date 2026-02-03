export function getConfig() {
  // eslint-disable-next-line no-undef
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

  // ✅ ARCHIEVE is now the only required list
  if (!cfg.sharepoint?.archieve?.enabled) {
    errors.push("sharepoint.archieve.enabled must be true");
  }

  if (!cfg.sharepoint?.archieve?.listName) {
    errors.push("sharepoint.archieve.listName is missing");
  }

  return errors;
}
