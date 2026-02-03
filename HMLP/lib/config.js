// lib/config.js

/**
 * Returns the public configuration object exposed via window.
 * @returns {Object|null} The config object or null if not found
 */
export function getConfig() {
  return window.PUBLICLOGIC_OS_CONFIG || null;
}

/**
 * Validates the configuration object and returns an array of error messages.
 * Returns empty array if config is valid.
 * @param {Object|null} cfg - The configuration object
 * @returns {string[]} Array of validation error messages
 */
export function validateConfig(cfg) {
  const errors = [];

  if (!cfg || typeof cfg !== 'object') {
    errors.push('Configuration is missing or invalid (window.PUBLICLOGIC_OS_CONFIG is not set or not an object)');
    return errors;
  }

  // MSAL / Authentication
  if (!cfg.msal) {
    errors.push('msal configuration object is missing');
  } else {
    if (!cfg.msal.clientId) errors.push('msal.clientId is required');
    if (!cfg.msal.tenantId) errors.push('msal.tenantId is required');
    if (!cfg.msal.redirectUri) errors.push('msal.redirectUri is required');
  }

  // Access control
  if (!Array.isArray(cfg.access?.allowedEmails) || cfg.access.allowedEmails.length === 0) {
    errors.push('access.allowedEmails must be a non-empty array of allowed email addresses');
  }

  // Microsoft Graph
  if (!Array.isArray(cfg.graph?.scopes) || cfg.graph.scopes.length === 0) {
    errors.push('graph.scopes must be a non-empty array of permission scopes');
  }

  // SharePoint core
  if (!cfg.sharepoint) {
    errors.push('sharepoint configuration object is missing');
  } else {
    if (!cfg.sharepoint.hostname) {
      errors.push('sharepoint.hostname is required (e.g. "contoso.sharepoint.com")');
    }
    if (!cfg.sharepoint.sitePath) {
      errors.push('sharepoint.sitePath is required (e.g. "/sites/PublicLogic")');
    }
  }

  // Archieve (required feature)
  if (!cfg.sharepoint?.archieve) {
    errors.push('sharepoint.archieve configuration is missing');
  } else {
    if (cfg.sharepoint.archieve.enabled !== true) {
      errors.push('sharepoint.archieve.enabled must be true (archiving is required)');
    }
    if (!cfg.sharepoint.archieve.listName) {
      errors.push('sharepoint.archieve.listName is required (name of the target archive list)');
    }
  }

  return errors;
}

/**
 * Check if the tasks list is configured
 * @param {Object} cfg - The configuration object
 * @returns {boolean}
 */
export function hasTasksList(cfg) {
  return Boolean(cfg?.sharepoint?.lists?.tasks);
}

/**
 * Check if the pipeline list is configured
 * @param {Object} cfg - The configuration object
 * @returns {boolean}
 */
export function hasPipelineList(cfg) {
  return Boolean(cfg?.sharepoint?.lists?.pipeline);
}

/**
 * Check if the projects list is configured
 * @param {Object} cfg - The configuration object
 * @returns {boolean}
 */
export function hasProjectsList(cfg) {
  return Boolean(cfg?.sharepoint?.lists?.projects);
}

/**
 * Convenience function: returns true if config is present and has no validation errors
 * @returns {boolean}
 */
export function isConfigValid() {
  const config = getConfig();
  return config !== null && validateConfig(config).length === 0;
}

/**
 * Get a formatted error message string (useful for alerts, console, UI)
 * @returns {string} Empty string if valid, otherwise joined error messages
 */
export function getConfigErrorMessage() {
  const config = getConfig();
  if (!config) {
    return 'Application configuration is missing. Please check that config.js is loaded correctly.';
  }

  const errors = validateConfig(config);
  if (errors.length === 0) {
    return '';
  }

  return [
    'Configuration validation failed:',
    ...errors.map((err, i) => `  ${i + 1}. ${err}`),
  ].join('\n');
}
