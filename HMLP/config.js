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
    allowedEmails: ["nate@publiclogic.org"]
  },
  sharepoint: {
    hostname: "publiclogic978.sharepoint.com",
    sitePath: "/sites/PL",
    archieve: {
      enabled: true,
      listName: "ARCHIEVE"
    }
  }
};
```

### 2. `/lib/config.js` (LIBRARY - YOU ALREADY HAVE THIS)
This reads from the global variable. Keep as-is.

---

## **Your file structure should be:**
```
publiclogic-os-ui/
├── index.html
├── config.js          ← CREATE THIS (sets window.PUBLICLOGIC_OS_CONFIG)
├── styles.css
├── app.js
└── lib/
    ├── config.js      ← YOU HAVE THIS (reads window.PUBLICLOGIC_OS_CONFIG)
    ├── auth.js
    ├── sharepoint.js
    └── ...
