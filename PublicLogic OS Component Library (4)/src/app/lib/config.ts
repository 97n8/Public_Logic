/**
 * Phillipston Global Configuration
 */

export interface AppConfig {
  msal: {
    clientId: string;
    tenantId: string;
    redirectUri: string;
  };
  sharepoint: {
    hostname: string;
    sitePath: string;
    url: string;
  };
}

export function getConfig(): AppConfig {
  const custom = (window as any).PUBLICLOGIC_OS_CONFIG;
  
  return {
    msal: {
      clientId: custom?.msal?.clientId || "1b53d140-0779-4a64-943c-a11ba19ec0ce",
      tenantId: custom?.msal?.tenantId || "publiclogic978.onmicrosoft.com",
      redirectUri: custom?.msal?.redirectUri || "https://www.publiclogic.org/HMLP/",
    },
    sharepoint: {
      hostname: custom?.sharepoint?.hostname || "publiclogic978.sharepoint.com",
      sitePath: custom?.sharepoint?.sitePath || "sites/PL",
      url: custom?.sharepoint?.url || "https://publiclogic978.sharepoint.com/sites/PL",
    }
  };
}
