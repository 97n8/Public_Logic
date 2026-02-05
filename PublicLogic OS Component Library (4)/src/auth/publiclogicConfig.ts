export type PublicLogicRuntimeConfig = {
  msal?: {
    clientId?: string;
    tenantId?: string;
    redirectUri?: string;
    postLogoutRedirectUri?: string;
  };
  sharepoint?: {
    hostname?: string;
    sitePath?: string;
    url?: string;
  };
  allowedEmails?: string[];
};

declare global {
  interface Window {
    PUBLICLOGIC_OS_CONFIG?: PublicLogicRuntimeConfig;
  }
}

export const DEFAULT_ALLOWED_EMAILS = [
  "nate@publiclogic.org",
  "allie@publiclogic.org",
];

export function getRuntimeConfig(): PublicLogicRuntimeConfig {
  return window.PUBLICLOGIC_OS_CONFIG ?? {};
}

export function getAllowedEmails(): string[] {
  const custom = getRuntimeConfig();
  const list = custom.allowedEmails?.filter(Boolean);
  return list?.length ? list : DEFAULT_ALLOWED_EMAILS;
}

export function getMsalRuntimeConfig() {
  const custom = getRuntimeConfig();
  const baseUrl = window.location.origin + import.meta.env.BASE_URL;

  const clientId =
    custom.msal?.clientId ?? "1b53d140-0779-4a64-943c-a11ba19ec0ce";
  const tenantId =
    custom.msal?.tenantId ?? "12879da8-d927-419b-8a2e-fda32e1732be";
  const redirectUri = custom.msal?.redirectUri ?? baseUrl;
  const postLogoutRedirectUri = custom.msal?.postLogoutRedirectUri ?? baseUrl;

  return { clientId, tenantId, redirectUri, postLogoutRedirectUri };
}

export function getSharePointRuntimeConfig() {
  const custom = getRuntimeConfig();
  return {
    hostname: custom.sharepoint?.hostname ?? "publiclogic978.sharepoint.com",
    sitePath: custom.sharepoint?.sitePath ?? "sites/PL",
    url: custom.sharepoint?.url ?? "https://publiclogic978.sharepoint.com/sites/PL",
  };
}

