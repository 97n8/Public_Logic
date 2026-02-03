window.PUBLICLOGIC_OS_CONFIG = {
  access: {
    allowedEmails: [
      "admin@publiclogic.org",
      "nate@publiclogic.org"
    ]
  },

  auth: {
    clientId: "LOCAL_ONLY",
    tenantId: "LOCAL_ONLY",
    redirectUri: window.location.origin + "/hmlp/"
  },

  sharepoint: {
    siteUrl: "LOCAL_ONLY",
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
