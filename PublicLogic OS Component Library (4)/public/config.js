// Runtime configuration (safe to be public).
// Override values here without rebuilding the app.

window.PUBLICLOGIC_OS_CONFIG = {
  msal: {
    clientId: "1b53d140-0779-4a64-943c-a11ba19ec0ce",
    tenantId: "12879da8-d927-419b-8a2e-fda32e1732be",
    redirectUri: "https://www.publiclogic.org/hmlp/",
    postLogoutRedirectUri: "https://www.publiclogic.org/hmlp/",
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
