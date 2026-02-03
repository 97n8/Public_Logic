// PublicLogic OS config (no secrets). Safe to ship.
//
// This file contains your real Entra ID (Azure AD) application values.
// Keep it in the repository root — it has no secrets.
// Do NOT commit client secrets or passwords here.

window.PUBLICLOGIC_OS_CONFIG = {
  envName: "prod",

  msal: {
    clientId: "1b53d140-0779-4a64-943c-a11ba19ec0ce",
    tenantId: "12879dad-927b-419b-8a2e-fda32e1732be",
    redirectUri: "https://www.publiclogic.org/HMLP/",
    postLogoutRedirectUri: "https://www.publiclogic.org/HMLP/",
    cacheLocation: "sessionStorage"   // recommended for security on shared machines
  },

  access: {
    // Only these email addresses can sign in to the OS
    allowedEmails: [
      "nate@publiclogic.org",
      "allie@publiclogic.org"
      // ← add any additional team members here, e.g. "jane@publiclogic.org"
    ]
  },

  graph: {
    scopes: [
      "User.Read",
      "Calendars.Read",
      "Calendars.Read.Shared",
      "Sites.ReadWrite.All"
    ]
  },

  sharepoint: {
    hostname: "publiclogic978.sharepoint.com",
    sitePath: "/sites/PL",

    lists: {
      tasks:     "OS Tasks",
      pipeline:  "OS Pipeline",
      projects:  "OS Projects",
      scorecard: "OS Scorecard",     // optional – can be removed if not using
      decisions: "OS Decisions"      // optional – can be removed if not using
    }
  },

  team: {
    people: [
      { name: "Nate",  email: "nate@publiclogic.org" },
      { name: "Allie", email: "allie@publiclogic.org" }
      // ← add more team members here if needed
    ]
  },

  tools: [
    { title: "Outlook Mail",       url: "https://outlook.office.com/mail/" },
    { title: "Outlook Calendar",   url: "https://outlook.office.com/calendar/" },
    { title: "Microsoft Teams",    url: "https://teams.microsoft.com/" },
    { title: "SharePoint PL Site", url: "https://publiclogic978.sharepoint.com/sites/PL" }
    // ← feel free to add more useful links here
  ]
};
