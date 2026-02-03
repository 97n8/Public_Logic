// PublicLogic OS config
// No secrets stored here. Safe for client-side use.

window.PUBLICLOGIC_OS_CONFIG = {
  envName: "prod",

  /**
   * ============================================================
   * MSAL / AUTH
   * ============================================================
   */
  msal: {
    clientId: "1b53d140-0779-4a64-943c-a11ba19ec0ce",
    tenantId: "12879dad-927b-419b-8a2e-fda32e1732be",
    redirectUri: "https://www.publiclogic.org/HMLP/",
    postLogoutRedirectUri: "https://www.publiclogic.org/HMLP/",
    cacheLocation: "sessionStorage"
  },

  /**
   * ============================================================
   * ACCESS CONTROL
   * ============================================================
   */
  access: {
    allowedEmails: [
      "nate@publiclogic.org",
      "allie@publiclogic.org"
    ]
  },

  /**
   * ============================================================
   * MICROSOFT GRAPH
   * ============================================================
   */
  graph: {
    scopes: [
      "User.Read",
      "Calendars.Read",
      "Calendars.Read.Shared",
      "Sites.ReadWrite.All"
    ]
  },

  /**
   * ============================================================
   * SHAREPOINT
   * ============================================================
   */
  sharepoint: {
    hostname: "publiclogic978.sharepoint.com",
    sitePath: "/sites/PL",

    lists: {
      tasks: "OS Tasks",
      pipeline: "OS Pipeline",
      projects: "OS Projects",
      scorecard: "OS Scorecard",
      decisions: "OS Decisions"
    }
  },

  /**
   * ============================================================
   * TEAM CONTEXT
   * ============================================================
   */
  team: {
    people: [
      { name: "Nate", email: "nate@publiclogic.org" },
      { name: "Allie", email: "allie@publiclogic.org" }
    ]
  },

  /**
   * ============================================================
   * TOOLS
   * ============================================================
   */
  tools: [
    { title: "Outlook Mail", url: "https://outlook.office.com/mail/" },
    { title: "Outlook Calendar", url: "https://outlook.office.com/calendar/" },
    { title: "Microsoft Teams", url: "https://teams.microsoft.com/" },
    { title: "SharePoint PL Site", url: "https://publiclogic978.sharepoint.com/sites/PL" }
  ]
};
