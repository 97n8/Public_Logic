import { PublicClientApplication } from "@azure/msal-browser";
import { getMsalRuntimeConfig } from "./publiclogicConfig";

export const GRAPH_SCOPES = [
  "User.Read",
  "Calendars.Read.Shared",
  "Sites.ReadWrite.All",
] as const;

export const msalInstance = new PublicClientApplication({
  auth: (() => {
    const { clientId, tenantId, redirectUri, postLogoutRedirectUri } =
      getMsalRuntimeConfig();
    return {
      clientId,
      authority: `https://login.microsoftonline.com/${tenantId}`,
      redirectUri,
      postLogoutRedirectUri,
    };
  })(),
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
});

