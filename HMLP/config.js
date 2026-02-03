window.PUBLICLOGIC_OS_CONFIG = {
  msal: {
    clientId: "1b53d140-0779-4a64-943c-a11ba19ec0ce",
    tenantId: "12879da8-d927-419b-8a2e-fda32e1732be",
    redirectUri: "https://www.publiclogic.org/hmlp/",
    postLogoutRedirectUri: "https://www.publiclogic.org/hmlp/",
    cacheLocation: "sessionStorage"
  },

  graph: {
    scopes: [
      "User.Read",
      "Sites.ReadWrite.All"
    ]
  },

  access: {
    allowedEmails: [
      "nate@publiclogic.org"
    ]
  },

  sharepoint: {
    hostname: "publiclogicorg.sharepoint.com",
    sitePath: "/sites/PublicLogic",

    // Canonical system of record
    archieve: {
      enabled: true,
      listName: "ARCHIEVE"
    }
  }
};
