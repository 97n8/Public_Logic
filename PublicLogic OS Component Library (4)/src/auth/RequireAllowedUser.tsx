import { useMsal } from "@azure/msal-react";
import type { ReactNode } from "react";
import { getAllowedEmails } from "./publiclogicConfig";
import { IS_DEMO } from "../runtime";

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export default function RequireAllowedUser({
  children,
}: {
  children: ReactNode;
}) {
  if (IS_DEMO) return children;

  const { accounts } = useMsal();
  const allowed = getAllowedEmails().map(normalizeEmail);
  const email = normalizeEmail(accounts[0]?.username ?? "");

  if (!email || !allowed.includes(email)) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-10">
        <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-10 shadow-xl">
          <div className="text-xs font-black uppercase tracking-[0.3em] text-red-600">
            Access denied
          </div>
          <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-900">
            This portal is private.
          </h1>
          <p className="mt-3 text-sm font-semibold text-slate-600">
            Signed in as{" "}
            <span className="rounded bg-slate-100 px-2 py-1 font-mono">
              {email || "(unknown)"}
            </span>
            .
          </p>
          <p className="mt-4 text-sm font-semibold text-slate-600">
            Contact PublicLogic to request access.
          </p>
        </div>
      </div>
    );
  }

  return children;
}
