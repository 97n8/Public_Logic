window.PUBLICLOGIC_OS_CONFIG = {
  access: {
    allowedEmails: [
      "allie@publiclogic.org",
      "nate@publiclogic.org"
    ]
  },

  auth: {
    clientId: "DEMO_MODE",
    tenantId: "DEMO_MODE",
    redirectUri: window.location.origin + "/hmlp/"
  },

  sharepoint: {
    siteUrl: "DEMO_MODE",
    lists: {
      tasks: "Tasks",
      pipeline: "Pipeline",
      projects: "Projects"
    }
  },

  flags: {
    demoMode: true
  }
};
