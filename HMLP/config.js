window.PUBLICLOGIC_OS_CONFIG = {
  msal: {
    clientId: "1b53d140-0779-4a64-943c-a11ba19ec0ce",
    tenantId: "12879da8-d927-419b-8a2e-fda32e1732be",
    redirectUri: "https://www.publiclogic.org/hmlp/",
    postLogoutRedirectUri: "https://www.publiclogic.org/hmlp/",
    cacheLocation: "sessionStorage"
  },

  graph: {
    scopes: ["User.Read", "Sites.ReadWrite.All"]
  },

  access: {
    allowedEmails: [
      "nate@publiclogic.org",
      "allie@publiclogic.org"
    ]
  },

  sharepoint: {
    hostname: "publiclogic978.sharepoint.com",
    sitePath: "/sites/PL",
    archieve: {
      enabled: true,
      listName: "ARCHIEVE",
      folderTemplate: "{FY}/{DEPT}/PRR",
      defaultDept: "PHILLIPSTON",
      defaultCategory: "PRR"
    }
  },

  environments: {
    phillipston: {
      name: "Phillipston MA",
      description: "Public Records Request Form – Phillipston, MA",
      path: "/phillipston-prr",
      sharepointOverrides: {
        folderPrefix: "PHILLIPSTON",
        retentionClass: "Permanent",
        tags: ["Phillipston", "PRR", "MGL c.66", "Public Records"]
      },
      legalNotice:
        "This request is submitted under M.G.L. c. 66 §10 and 950 CMR 32.00. The Town of Phillipston must respond within 10 business days unless a valid extension applies."
    }
  }
};
