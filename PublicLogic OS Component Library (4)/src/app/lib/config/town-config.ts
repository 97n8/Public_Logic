/**
 * Phillipston Governance OS - System Configuration
 * Canonical settings for town-specific deployment.
 */
export const TOWN_CONFIG = {
  tenantId: "publiclogic978.onmicrosoft.com",
  townName: "Phillipston",
  state: "MA",
  fiscalYearStart: "07-01", // July 1st
  
  // SharePoint Infrastructure
  sharepoint: {
    hostname: "publiclogic978.sharepoint.com",
    sitePath: "sites/PL",
    vaultListName: "ARCHIEVE", // System expects this spelling for historical consistency
    libraryName: "Documents"
  },

  // Compliance Policy
  compliance: {
    mgl_citation: "M.G.L. c. 66",
    defaultRetentionYears: 7,
    permanentRecords: ["Meeting Minutes", "Contracts", "Deeds", "Bylaws"],
    prrDeadlineDays: 10, // MA standard business days
  },

  // Access Control
  auth: {
    clientId: "1b53d140-0779-4a64-943c-a11ba19ec0ce",
    allowedDomains: ["@phillipston-ma.gov", "@publiclogic.org"],
  }
};
