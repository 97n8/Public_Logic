// src/lib/auth.ts
import { PublicClientApplication } from '@azure/msal-browser';
import { IS_DEMO } from '../runtime';
import { config } from './config';

let msalInstance: PublicClientApplication | null = null;

if (!IS_DEMO) {
  msalInstance = new PublicClientApplication({
    auth: {
      clientId: config.msal.clientId,
      authority: `https://login.microsoftonline.com/${config.msal.tenantId}`,
      redirectUri: config.msal.redirectUri,
      postLogoutRedirectUri: config.msal.postLogoutRedirectUri,
    },
    cache: {
      cacheLocation: config.msal.cacheLocation,
      storeAuthStateInCookie: false,
    },
  });
} else {
  console.warn('DEMO MODE: MSAL disabled');
}

export function getAuth() {
  return msalInstance;
}

export async function acquireToken() {
  if (IS_DEMO) {
    return { accessToken: 'demo-token' };
  }

  if (!msalInstance) {
    throw new Error('MSAL not initialized');
  }

  const accounts = msalInstance.getAllAccounts();
  if (!accounts.length) {
    await msalInstance.loginPopup({
      scopes: config.graph.scopes,
    });
  }

  const result = await msalInstance.acquireTokenSilent({
    scopes: config.graph.scopes,
    account: msalInstance.getAllAccounts()[0],
  });

  return result;
}
