import { InteractionRequiredAuthError } from "@azure/msal-browser";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { GRAPH_SCOPES } from "./msalInstance";
import { IS_DEMO } from "../runtime";

export default function RequireAuth({ children }: { children: ReactNode }) {
  if (IS_DEMO) return children;

  const isAuthenticated = useIsAuthenticated();
  const { instance, inProgress, accounts } = useMsal();

  useEffect(() => {
    if (inProgress !== "none") return;
    if (isAuthenticated) return;

    // Prefer redirect for static app deep-links (works well with HashRouter).
    void instance.loginRedirect({ scopes: [...GRAPH_SCOPES] });
  }, [accounts.length, inProgress, instance, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-10">
        <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-10 shadow-xl">
          <div className="text-xs font-black uppercase tracking-[0.3em] text-emerald-600">
            PublicLogic OS
          </div>
          <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-900">
            Signing you in…
          </h1>
          <p className="mt-3 text-sm font-semibold text-slate-600">
            If nothing happens, refresh the page to retry.
          </p>
        </div>
      </div>
    );
  }

  return children;
}

export function requireInteraction(e: unknown) {
  return e instanceof InteractionRequiredAuthError;
}
