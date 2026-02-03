// lib/config.js

export function getConfig() {
  return window.PUBLICLOGIC_OS_CONFIG || null;
}

export function validateConfig(cfg) {
  const errors = [];

  if (!cfg) {
    errors.push("Missing config (window.PUBLICLOGIC_OS_CONFIG is null or undefined).");
    return errors;
  }

  if (!cfg.msal?.clientId) errors.push("msal.clientId is missing");
  if (!cfg.msal?.tenantId) errors.push("msal.tenantId is missing");
  if (!cfg.msal?.redirectUri) errors.push("msal.redirectUri is missing");

  if (!Array.isArray(cfg.access?.allowedEmails) || cfg.access.allowedEmails.length === 0) {
    errors.push("access.allowedEmails must be a non-empty array of allowed emails");
  }

  if (!Array.isArray(cfg.graph?.scopes) || cfg.graph.scopes.length === 0) {
    errors.push("graph.scopes must be a non-empty array");
  }

  if (!cfg.sharepoint?.hostname) errors.push("sharepoint.hostname is missing");
  if (!cfg.sharepoint?.sitePath) errors.push("sharepoint.sitePath is missing");

  if (!cfg.sharepoint?.archieve) {
    errors.push("sharepoint.archieve configuration object is missing");
  } else {
    if (cfg.sharepoint.archieve.enabled !== true) {
      errors.push("sharepoint.archieve.enabled must be true");
    }
    if (!cfg.sharepoint.archieve.listName) {
      errors.push("sharepoint.archieve.listName is missing");
    }
  }

  return errors;
}

export function hasTasksList(cfg) {
  return Boolean(cfg?.sharepoint?.lists?.tasks);
}

export function hasPipelineList(cfg) {
  return Boolean(cfg?.sharepoint?.lists?.pipeline);
}

export function hasProjectsList(cfg) {
  return Boolean(cfg?.sharepoint?.lists?.projects);
}

export function hasArchiveList(cfg) {
  return Boolean(
    cfg?.sharepoint?.archieve?.enabled === true &&
    cfg?.sharepoint?.archieve?.listName
  );
}

/**
 * Returns normalized, ready-to-use links based on the config.
 * All paths are constructed safely with fallbacks.
 */
export function getLinks(cfg) {
  if (!cfg?.sharepoint) return {};

  const hostname = cfg.sharepoint.hostname;
  const sitePath = cfg.sharepoint.sitePath;

  const base = `https://${hostname}`;
  const site = `${base}${sitePath}`;

  return {
    // Core SharePoint
    root: base,
    site: site,
    siteContents: `${site}/_layouts/15/viewlsts.aspx`,
    createPage: `${site}/_layouts/15/CreatePage.aspx`,
    permissions: `${site}/_layouts/15/user.aspx`,

    // Archive / Records
    archiveList: cfg.sharepoint.archieve?.listName
      ? `${site}/Lists/${cfg.sharepoint.archieve.listName}/AllItems.aspx`
      : null,

    // Configured lists
    tasksList: cfg.sharepoint.lists?.tasks
      ? `${site}/Lists/${cfg.sharepoint.lists.tasks}/AllItems.aspx`
      : null,
    pipelineList: cfg.sharepoint.lists?.pipeline
      ? `${site}/Lists/${cfg.sharepoint.lists.pipeline}/AllItems.aspx`
      : null,
    projectsList: cfg.sharepoint.lists?.projects
      ? `${site}/Lists/${cfg.sharepoint.lists.projects}/AllItems.aspx`
      : null,

    // Optional municipal / departmental areas
    departments: cfg.links?.departments ? `${site}${cfg.links.departments}` : null,
    meetings: cfg.links?.meetings ? `${site}${cfg.links.meetings}` : null,
    permits: cfg.links?.permits ? `${site}${cfg.links.permits}` : null,
    documents: cfg.links?.documents ? `${site}${cfg.links.documents}` : null,
    ordinances: cfg.links?.ordinances ? `${site}${cfg.links.ordinances}` : null,
    budget: cfg.links?.budget ? `${site}${cfg.links.budget}` : null,

    // External public links
    townWebsite: cfg.links?.townWebsite || null,
    publicRecords: cfg.links?.publicRecords || null,
    calendar: cfg.links?.calendar || null,
    gis: cfg.links?.gis || null,
  };
}
