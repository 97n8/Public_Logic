import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Card } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { loadCases } from "../store";
import useSharePointClient from "../../../../hooks/useSharePointClient";
import { ensurePrrSharePointSchema, ensurePrrVaultRoot, getPrrSetup } from "../sharepoint";
import { getVaultMode, setVaultMode } from "../vaultMode";

export default function StaffCaseSpace() {
  const sp = useSharePointClient();
  const localCases = loadCases();
  const setup = getPrrSetup();
  const vaultMode = getVaultMode();

  const casesQuery = useQuery({
    enabled: Boolean(sp.client),
    queryKey: ["phillipston", "prr", "cases", setup.casesListName],
    queryFn: async () => {
      const items = await (sp.client as any).listItems(setup.casesListName, {
        top: 200,
        forceRefresh: true,
      });
      return items as any[];
    },
  });

  const cases = sp.client ? casesQuery.data || [] : localCases;

  return (
    <div className="grid grid-cols-1 gap-6">
      <Card className="rounded-3xl border-slate-200 p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-xs font-black uppercase tracking-widest text-slate-500">
              Case Space
            </div>
            <div className="mt-2 text-sm font-semibold text-slate-600">
              Staff dashboard for intake, case management, and archiving to the
              Municipal Vault (SharePoint).
            </div>
            <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-black uppercase tracking-widest text-foreground">
              Vault mode:{" "}
              <span className={vaultMode === "test" ? "text-yellow-700" : "text-emerald-700"}>
                {vaultMode.toUpperCase()}
              </span>
              <span className="text-muted-foreground font-semibold normal-case tracking-normal">
                (cases list: {setup.casesListName})
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={() => {
                setVaultMode(vaultMode === "test" ? "prod" : "test");
                window.location.reload();
              }}
            >
              Switch to {vaultMode === "test" ? "PROD" : "TEST"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={async () => {
                if (!sp.client) return;
                try {
                  await ensurePrrSharePointSchema(sp.client as any);
                  const root = await ensurePrrVaultRoot(sp.client as any);
                  toast.success("SharePoint vault ready", {
                    description: root?.item?.webUrl ? "Root folder created." : undefined,
                  });
                } catch (e: any) {
                  toast.error("SharePoint setup failed", {
                    description: String(e?.message || e),
                  });
                }
              }}
              disabled={!sp.client}
            >
              Initialize SharePoint
            </Button>
            <Button asChild className="rounded-full">
              <Link to="../intake">New intake</Link>
            </Button>
          </div>
        </div>
      </Card>

      <Card className="rounded-3xl border-slate-200 p-0 shadow-sm overflow-hidden">
        <div className="bg-muted px-6 py-3 text-xs font-black uppercase tracking-widest text-muted-foreground grid grid-cols-12">
          <div className="col-span-4">Case</div>
          <div className="col-span-5">Requester</div>
          <div className="col-span-3">T10</div>
        </div>

        {cases.length ? (
          cases.map((c) => (
            <div
              key={c.caseId || c.CaseId}
              className="grid grid-cols-12 border-t border-border px-6 py-4 text-sm font-semibold text-foreground"
            >
              <div className="col-span-4 font-mono">{c.caseId || c.CaseId}</div>
              <div className="col-span-5 truncate">
                {c.requester?.name || c.RequesterName || "(unknown)"}
                {(c.requester?.email || c.RequesterEmail) ? (
                  <span className="text-muted-foreground">
                    {" "}
                    • {c.requester?.email || c.RequesterEmail}
                  </span>
                ) : null}
              </div>
              <div className="col-span-3">
                {(() => {
                  const raw = c.deadlines?.t10 || c.T10 || c.t10 || c["T10"];
                  if (!raw) return "—";
                  const d = new Date(raw);
                  if (Number.isNaN(d.getTime())) return "—";
                  return format(d, "MMM d, yyyy");
                })()}
              </div>
            </div>
          ))
        ) : (
          <div className="px-6 py-8 text-sm font-semibold text-slate-600">
            {sp.client
              ? casesQuery.isLoading
                ? "Loading cases from SharePoint…"
                : "No SharePoint cases yet. Use Resident or Staff Intake to create one."
              : "No local demo cases yet. Use Resident or Staff Intake to create one."}
          </div>
        )}
      </Card>
    </div>
  );
}
