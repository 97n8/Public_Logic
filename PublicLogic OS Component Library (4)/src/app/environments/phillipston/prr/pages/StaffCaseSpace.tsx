import { format } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Card } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { loadCases } from "../store";
import { encodeResidentSubmissionMarkdown } from "../vaultprr";
import useSharePointClient from "../../../../hooks/useSharePointClient";
import { toast } from "sonner";
import { ensurePrrSharePointSchema, ensurePrrVaultRoot, getPrrSetup } from "../sharepoint";
import { getVaultMode, setVaultMode, type VaultMode } from "../vaultMode";

export default function StaffCaseSpace() {
  const [vaultMode, setVaultModeState] = useState<VaultMode>(() => getVaultMode());
  const setup = useMemo(() => getPrrSetup(), [vaultMode]);
  const { client: sp, isLoading: isConnecting, error: connectError } = useSharePointClient();

  const [cases, setCases] = useState<any[]>(() => loadCases());
  const [casesSource, setCasesSource] = useState<"sharepoint" | "local">("local");
  const [isLoadingCases, setIsLoadingCases] = useState(false);
  const [casesError, setCasesError] = useState<string | null>(null);
  const [vaultReady, setVaultReady] = useState<boolean | null>(null);
  const [vaultRootUrl, setVaultRootUrl] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const createdId = searchParams.get("created");
  const createdCase = useMemo(() => {
    if (!createdId) return null;
    return (
      cases.find((c) => (c.caseId || c.CaseId) === createdId) ??
      loadCases().find((c) => c.caseId === createdId) ??
      null
    );
  }, [cases, createdId]);

  function downloadPacket(packet: string, caseId: string) {
    const blob = new Blob([packet], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${caseId}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function refreshCases({ forceRefresh = false } = {}) {
    if (!sp) {
      setCases(loadCases());
      setCasesSource("local");
      return;
    }

    setIsLoadingCases(true);
    setCasesError(null);

    try {
      const list = await sp.findListByName(setup.casesListName);
      if (!list) {
        setVaultReady(false);
        setCases([]);
        setCasesSource("sharepoint");
        return;
      }

      setVaultReady(true);
      const items = await sp.listItems(setup.casesListName, {
        top: 75,
        forceRefresh,
      });
      items.sort((a: any, b: any) => {
        const ad = new Date(a.ReceivedAt || a.Created || 0).getTime();
        const bd = new Date(b.ReceivedAt || b.Created || 0).getTime();
        return bd - ad;
      });
      setCases(items);
      setCasesSource("sharepoint");
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      setCasesError(message);
      setCasesSource("sharepoint");
    } finally {
      setIsLoadingCases(false);
    }
  }

  useEffect(() => {
    void refreshCases({ forceRefresh: true });
  }, [sp, setup.casesListName, vaultMode]);

  async function handleInitialize() {
    if (!sp) return;
    setIsInitializing(true);
    const tid = toast.loading("Initializing Phillipston vault…");
    try {
      await ensurePrrSharePointSchema(sp);
      const root = await ensurePrrVaultRoot(sp);
      setVaultRootUrl(root.item?.webUrl || null);
      setVaultReady(true);
      toast.success("Vault ready", {
        id: tid,
        description: setup.vaultMode === "test" ? "TEST vault initialized." : "Production vault initialized.",
      });
      await refreshCases({ forceRefresh: true });
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      toast.error("Initialization failed", { id: tid, description: message });
    } finally {
      setIsInitializing(false);
    }
  }

  async function openFolderByPath(folderPath: string) {
    if (!sp) return;
    const segments = folderPath.split("/").filter(Boolean);
    const tid = toast.loading("Opening folder…");
    try {
      const res = await sp.ensureDriveFolder(segments);
      const url = res?.item?.webUrl;
      if (!url) throw new Error("Folder webUrl not available");
      window.open(url, "_blank", "noreferrer");
      toast.success("Opened", { id: tid });
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      toast.error("Could not open folder", { id: tid, description: message });
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {createdCase ? (
        <Card className="rounded-3xl border border-primary/25 bg-accent p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                Case saved
              </div>
              <div className="mt-2 font-mono text-sm font-black text-foreground">
                {createdCase.caseId || createdCase.CaseId}
              </div>
              <div className="mt-2 text-sm font-semibold text-muted-foreground">
                T10 due:{" "}
                {(() => {
                  const raw =
                    createdCase.deadlines?.t10 ||
                    createdCase.T10 ||
                    createdCase.t10 ||
                    createdCase["T10"];
                  if (!raw) return "—";
                  const d = new Date(raw);
                  return Number.isNaN(d.getTime()) ? "—" : format(d, "MMM d, yyyy");
                })()}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {createdCase.caseId ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full"
                    onClick={() => {
                      const packet = encodeResidentSubmissionMarkdown(createdCase);
                      void navigator.clipboard?.writeText(packet).catch(() => {});
                    }}
                  >
                    Copy packet
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full"
                    onClick={() => {
                      const packet = encodeResidentSubmissionMarkdown(createdCase);
                      downloadPacket(packet, createdCase.caseId);
                    }}
                  >
                    Download .md
                  </Button>
                </>
              ) : null}

              {createdCase.MarkdownWebUrl ? (
                <Button asChild variant="outline" className="rounded-full">
                  <a
                    href={createdCase.MarkdownWebUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open in SharePoint
                  </a>
                </Button>
              ) : null}

              <Button
                type="button"
                className="rounded-full"
                onClick={() => {
                  const next = new URLSearchParams(searchParams);
                  next.delete("created");
                  setSearchParams(next, { replace: true });
                }}
              >
                Dismiss
              </Button>
            </div>
          </div>
        </Card>
      ) : null}

      <Card className="rounded-3xl border-border bg-card p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-xs font-black uppercase tracking-widest text-muted-foreground">
              Records Office Dashboard
            </div>
            <div className="mt-2 text-sm font-semibold text-muted-foreground">
              Draft intake, track deadlines, and package responses for public
              records requests.
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
              <span className="rounded-full border border-border bg-muted px-3 py-1">
                Vault: {setup.vaultMode === "test" ? "TEST" : "PROD"}
              </span>
              <span className="rounded-full border border-border bg-muted px-3 py-1">
                {isConnecting
                  ? "Connecting…"
                  : connectError
                    ? "Connection error"
                    : sp
                      ? "Microsoft 365 connected"
                      : "Not connected"}
              </span>
              {casesSource === "sharepoint" ? (
                <span className="rounded-full border border-border bg-muted px-3 py-1">
                  Source: SharePoint
                </span>
              ) : (
                <span className="rounded-full border border-border bg-muted px-3 py-1">
                  Source: Local
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" className="rounded-full">
              <Link to="../resident">Resident Form</Link>
            </Button>
            <Button asChild className="rounded-full">
              <Link to="../intake">New intake</Link>
            </Button>
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              disabled={!sp || isLoadingCases}
              onClick={() => void refreshCases({ forceRefresh: true })}
            >
              Refresh
            </Button>
          </div>
        </div>
      </Card>

      {sp && vaultReady === false ? (
        <Card className="rounded-3xl border border-primary/25 bg-accent p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                Vault not initialized
              </div>
              <div className="mt-2 text-sm font-semibold text-muted-foreground">
                This will create the SharePoint lists and the Town Vault folder
                structure for Phillipston ({setup.vaultMode === "test" ? "TEST" : "PROD"}).
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                className="rounded-full"
                disabled={isInitializing}
                onClick={() => void handleInitialize()}
              >
                {isInitializing ? "Initializing…" : "Initialize vault"}
              </Button>
            </div>
          </div>
        </Card>
      ) : null}

      {sp && vaultRootUrl ? (
        <Card className="rounded-3xl border-border bg-card p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                Town Vault
              </div>
              <div className="mt-2 text-sm font-semibold text-muted-foreground">
                SharePoint folder structure is ready.
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline" className="rounded-full">
                <a href={vaultRootUrl} target="_blank" rel="noreferrer">
                  Open vault folder
                </a>
              </Button>
            </div>
          </div>
        </Card>
      ) : null}

      <Card className="rounded-3xl border-border bg-card p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs font-black uppercase tracking-widest text-muted-foreground">
            Vault mode
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant={vaultMode === "test" ? "default" : "outline"}
              className="rounded-full"
              onClick={() => {
                setVaultMode("test");
                setVaultModeState("test");
                setVaultRootUrl(null);
              }}
            >
              Test
            </Button>
            <Button
              type="button"
              variant={vaultMode === "prod" ? "default" : "outline"}
              className="rounded-full"
              onClick={() => {
                setVaultMode("prod");
                setVaultModeState("prod");
                setVaultRootUrl(null);
              }}
            >
              Prod
            </Button>
          </div>
        </div>
        <div className="mt-2 text-sm font-semibold text-muted-foreground">
          Test mode writes to a segregated folder and lists with a <span className="font-mono">_TEST</span>{" "}
          suffix.
        </div>
      </Card>

      <Card className="rounded-3xl border-border bg-card p-0 shadow-sm overflow-hidden">
        <div className="bg-muted px-6 py-3 text-xs font-black uppercase tracking-widest text-muted-foreground grid grid-cols-12">
          <div className="col-span-4">Case</div>
          <div className="col-span-5">Requester</div>
          <div className="col-span-3">T10</div>
        </div>

        {casesError ? (
          <div className="px-6 py-6 text-sm font-semibold text-red-700">
            {casesError}
          </div>
        ) : cases.length ? (
          cases.map((c) => (
            <div
              key={c.caseId || c.CaseId}
              className={[
                "grid grid-cols-12 border-t border-border px-6 py-4 text-sm font-semibold text-foreground",
                createdId && (c.caseId || c.CaseId) === createdId ? "bg-accent" : "",
              ].join(" ")}
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
                {c.MarkdownWebUrl ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    <a
                      href={c.MarkdownWebUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary underline underline-offset-4 text-xs font-black uppercase tracking-widest"
                    >
                      Packet
                    </a>
                    {c.FolderPath && sp ? (
                      <button
                        type="button"
                        className="text-primary underline underline-offset-4 text-xs font-black uppercase tracking-widest"
                        onClick={() => void openFolderByPath(String(c.FolderPath))}
                      >
                        Folder
                      </button>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </div>
          ))
        ) : (
          <div className="px-6 py-8 text-sm font-semibold text-muted-foreground">
            No requests yet. Use Resident or Staff Intake to draft a request.
          </div>
        )}
      </Card>
    </div>
  );
}
