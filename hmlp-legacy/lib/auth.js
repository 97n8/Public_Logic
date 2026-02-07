import { getConfig } from "./config.js";

function ensureMsalLoaded() {
  if (!window.msal || !window.msal.PublicClientApplication) {
    throw new Error("MSAL not loaded");
  }
}

export function getSignedInEmail(account) {
  return (
    account?.username ||
    account?.idTokenClaims?.preferred_username ||
    account?.idTokenClaims?.email ||
    null
  );
}

export function isAllowedAccount(account, allowedEmails) {
  const email = (getSignedInEmail(account) || "").toLowerCase();
  return (allowedEmails || []).map(e => e.toLowerCase()).includes(email);
}

export function createAuth() {
  ensureMsalLoaded();
  const cfg = getConfig();

  const instance = new window.msal.PublicClientApplication({
    auth: {
      clientId: cfg.msal.clientId,
      authority: `https://login.microsoftonline.com/${cfg.msal.tenantId}`,
      redirectUri: cfg.msal.redirectUri,
      postLogoutRedirectUri: cfg.msal.postLogoutRedirectUri,
      navigateToLoginRequestUrl: false
    },
    cache: {
      cacheLocation: cfg.msal.cacheLocation || "sessionStorage",
      storeAuthStateInCookie: false
    }
  });

  async function init() {
    const result = await instance.handleRedirectPromise();
    if (result?.account) {
      instance.setActiveAccount(result.account);
    } else {
      const accounts = instance.getAllAccounts();
      if (accounts.length) instance.setActiveAccount(accounts[0]);
    }
    return result;
  }

  function getAccount() {
    return instance.getActiveAccount();
  }

  async function login() {
    await instance.loginRedirect({
      scopes: ["openid", "profile", "email", ...cfg.graph.scopes],
      prompt: "select_account"
    });
  }

  async function logout() {
    await instance.logoutRedirect();
  }

  async function acquireToken(scopes = cfg.graph.scopes) {
    const account = getAccount();
    if (!account) throw new Error("Not signed in");

    try {
      return await instance.acquireTokenSilent({ scopes, account });
    } catch {
      await instance.acquireTokenRedirect({ scopes, account });
      return null;
    }
  }

  return {
    instance,
    init,
    login,
    logout,
    getAccount,
    acquireToken
  };
}
