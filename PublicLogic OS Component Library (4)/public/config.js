// Runtime configuration (safe to be public).
// Override values here without rebuilding the app.

const __BASE_URL__ = (() => {
  const pathname = window.location.pathname || "/";
  const dir = pathname.endsWith("/") ? pathname : pathname.replace(/[^/]*$/, "");
  return window.location.origin + dir;
})();

window.PUBLICLOGIC_OS_CONFIG = {
  msal: {
    clientId: "1b53d140-0779-4a64-943c-a11ba19ec0ce",
    tenantId: "12879da8-d927-419b-8a2e-fda32e1732be",
    // Use the current host + base path so Vercel/Netlify/custom domains don't “kick over”.
    // Ensure your Entra app has this URL registered as a redirect URI.
    redirectUri: __BASE_URL__,
    postLogoutRedirectUri: __BASE_URL__,
  },
  sharepoint: {
    hostname: "publiclogic978.sharepoint.com",
    sitePath: "sites/PL",
    url: "https://publiclogic978.sharepoint.com/sites/PL",
    vault: {
      // Stored in the site's default document library under this folder.
      libraryRoot: "MunicipalVault",
      // SharePoint Lists used for case index + immutable audit log (append-only).
      casesListName: "PL_PRR_Cases",
      auditListName: "PL_PRR_Audit",
    },
  },
  allowedEmails: ["nate@publiclogic.org", "allie@publiclogic.org"],
};
