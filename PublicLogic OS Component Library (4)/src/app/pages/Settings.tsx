import { useMsal } from "@azure/msal-react";
import PageHeader from "../components/PageHeader";
import { Card } from "../components/ui/card";
import { getAllowedEmails, getSharePointRuntimeConfig } from "../../auth/publiclogicConfig";

export default function Settings() {
  const { accounts } = useMsal();
  const sharepoint = getSharePointRuntimeConfig();

  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="Access controls and connection details."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="rounded-3xl border-slate-200 p-6 shadow-sm">
          <div className="text-xs font-black uppercase tracking-widest text-slate-500">
            Access
          </div>
          <div className="mt-3 text-sm font-semibold text-slate-700">
            Allowed emails:
          </div>
          <ul className="mt-2 list-disc pl-5 text-sm font-semibold text-slate-600">
            {getAllowedEmails().map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
          <div className="mt-4 text-sm font-semibold text-slate-700">
            Signed-in account:
          </div>
          <div className="mt-2 rounded-xl bg-slate-50 p-3 font-mono text-xs text-slate-800">
            {accounts[0]?.username ?? "(unknown)"}
          </div>
        </Card>

        <Card className="rounded-3xl border-slate-200 p-6 shadow-sm">
          <div className="text-xs font-black uppercase tracking-widest text-slate-500">
            SharePoint
          </div>
          <div className="mt-3 text-sm font-semibold text-slate-600">
            Host: <span className="font-mono">{sharepoint.hostname}</span>
          </div>
          <div className="mt-2 text-sm font-semibold text-slate-600">
            Site path: <span className="font-mono">{sharepoint.sitePath}</span>
          </div>
          <div className="mt-4 text-xs font-semibold text-slate-500">
            Runtime config is loaded from{" "}
            <span className="font-mono">public/config.js</span>.
          </div>
        </Card>
      </div>
    </div>
  );
}
