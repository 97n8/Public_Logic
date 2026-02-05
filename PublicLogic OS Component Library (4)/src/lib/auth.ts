import { InteractionRequiredAuthError } from "@azure/msal-browser";
import { GRAPH_SCOPES, msalInstance } from "../auth/msalInstance";

export function getAuth() {
  return msalInstance;
}

export async function acquireToken() {
  const accounts = msalInstance.getAllAccounts();
  const account = accounts[0];

  if (!account) {
    await msalInstance.loginRedirect({ scopes: [...GRAPH_SCOPES] });
    throw new Error("Redirecting to login");
  }

  try {
    const result = await msalInstance.acquireTokenSilent({
      scopes: [...GRAPH_SCOPES],
      account,
    });
    return result;
  } catch (e) {
    if (e instanceof InteractionRequiredAuthError) {
      await msalInstance.acquireTokenRedirect({ scopes: [...GRAPH_SCOPES] });
    }
    throw e;
  }
}

