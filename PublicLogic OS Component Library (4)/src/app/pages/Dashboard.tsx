import { useMsal } from "@azure/msal-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  CalendarClock,
  ExternalLink,
  FileText,
  Inbox,
  Link2,
  NotebookPen,
  Landmark,
  ShieldCheck,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import PageHeader from "../components/PageHeader";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { GRAPH_SCOPES } from "../../auth/msalInstance";
import { requireInteraction } from "../../auth/RequireAuth";
import { getUserCalendarView } from "../lib/graph-api";
import useSharePointClient from "../hooks/useSharePointClient";
import {
  ARCHIEVE_LIST_NAME,
  createArchieveRecord,
  getArchieveListUrl,
  listArchieveRecords,
} from "../lib/archieve";
import { getSharePointRuntimeConfig } from "../../auth/publiclogicConfig";
import { getVaultMode } from "../environments/phillipston/prr/vaultMode";

function getFiscalYearFolder(d: Date) {
  // Massachusetts FY starts July 1
  const year = d.getFullYear();
  const month = d.getMonth(); // 0-based
  const startYear = month >= 6 ? year : year - 1;
  return `FY${startYear}-${startYear + 1}`;
}

export default function Dashboard() {
  const { instance, accounts } = useMsal();
  const account = accounts[0];
  const actor = account?.username || "unknown";
  const qc = useQueryClient();

  const dayKey = useMemo(() => format(new Date(), "yyyy-MM-dd"), []);
  const sharepoint = getSharePointRuntimeConfig();
  const vaultMode = getVaultMode();
  const { client: sp, isLoading: isConnecting, error: connectError } =
    useSharePointClient();
  const [captureText, setCaptureText] = useState("");

  async function connectGraphIfNeeded() {
    if (!account) return;
    try {
      await instance.acquireTokenSilent({
        account,
        scopes: [...GRAPH_SCOPES],
      });
      toast.success("Microsoft 365 connected");
    } catch (e) {
      if (requireInteraction(e)) {
        void instance.acquireTokenRedirect({
          account,
          scopes: [...GRAPH_SCOPES],
        });
        return;
      }
      toast.error("Microsoft 365 connection failed", {
        description: e instanceof Error ? e.message : String(e),
      });
    }
  }

  const archieveUrlQuery = useQuery({
    queryKey: ["archieve", "url", !!sp],
    enabled: !!sp,
    staleTime: 60 * 1000,
    queryFn: async () => {
      if (!sp) return null;
      return (await getArchieveListUrl(sp as any)) ?? null;
    },
  });

  const inboxQuery = useQuery({
    queryKey: ["archieve", "inbox", dayKey, !!sp],
    enabled: !!sp,
    staleTime: 5 * 1000,
    queryFn: async () => {
      if (!sp) return [];
      const items = await listArchieveRecords(sp as any, {
        status: "INBOX",
        top: 12,
        forceRefresh: true,
      });
      items.sort((a: any, b: any) => {
        const ad = new Date(a.CreatedAt || a.Created || 0).getTime();
        const bd = new Date(b.CreatedAt || b.Created || 0).getTime();
        return bd - ad;
      });
      return items;
    },
  });

  const calendarsQuery = useQuery({
    queryKey: ["graph", "calendars", account?.homeAccountId, dayKey],
    enabled: !!account,
    staleTime: 60 * 1000,
    queryFn: async () => {
      if (!account) return [];
      const res = await instance.acquireTokenSilent({
        account,
        scopes: [...GRAPH_SCOPES],
      });

      const start = new Date();
      const end = new Date();
      end.setHours(23, 59, 59, 999);

      const people = [
        { key: "allie", label: "Allie", email: "allie@publiclogic.org" },
        { key: "nate", label: "Nate", email: "nate@publiclogic.org" },
      ] as const;

      const settled = await Promise.allSettled(
        people.map((p) =>
          getUserCalendarView(res.accessToken, {
            userEmail: p.email,
            start,
            end,
            top: 6,
          }),
        ),
      );

      return people.map((p, idx) => {
        const r = settled[idx];
        if (r.status === "fulfilled") return { ...p, events: r.value, error: null };
        const message = r.reason instanceof Error ? r.reason.message : String(r.reason);
        return { ...p, events: [], error: message };
      });
    },
  });

  async function saveCapture() {
    const trimmed = captureText.trim();
    if (!trimmed) return;

    const title = trimmed.split("\n")[0].trim().slice(0, 120);
    const body = trimmed;

    if (!sp) {
      try {
        await navigator.clipboard.writeText(body);
        toast.message("Copied to clipboard", {
          description: "Connect Microsoft 365 to save to ARCHIEVE.",
        });
      } catch {
        toast.error("Connect Microsoft 365 to save to ARCHIEVE.");
      }
      return;
    }

    const tid = toast.loading("Saving to ARCHIEVE…");
    try {
      const res = await createArchieveRecord(sp as any, {
        title: title || "Capture",
        body,
        recordType: "CAPTURE",
        status: "INBOX",
        actor,
        environment: "PUBLICLOGIC",
        module: "DASHBOARD",
        sourceUrl: window.location.href,
      });
      setCaptureText("");
      toast.success("Saved", { id: tid, description: res.recordId });
      await qc.invalidateQueries({ queryKey: ["archieve"] });
      if (res.webUrl) window.open(res.webUrl, "_blank", "noreferrer");
    } catch (e) {
      toast.error("Could not save", {
        id: tid,
        description: e instanceof Error ? e.message : String(e),
      });
    }
  }

  async function openPhillipstonDocs() {
    if (!sp) {
      window.open(sharepoint.url, "_blank", "noreferrer");
      return;
    }
    const fy = getFiscalYearFolder(new Date());
    const segments = [
      sharepoint.vault.libraryRoot,
      ...(vaultMode === "test" ? ["TEST"] : []),
      fy,
      "PHILLIPSTON",
    ];
    const tid = toast.loading("Opening town documents…");
    try {
      const res = await (sp as any).ensureDriveFolder(segments);
      const url = res?.item?.webUrl;
      if (!url) throw new Error("Folder webUrl not available");
      window.open(url, "_blank", "noreferrer");
      toast.success("Opened", { id: tid });
    } catch (e) {
      toast.error("Could not open folder", {
        id: tid,
        description: e instanceof Error ? e.message : String(e),
      });
    }
  }

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Cognitive unload. Capture → ARCHIEVE. Everything stays attached to Microsoft 365."
        actions={
          <>
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={() => void connectGraphIfNeeded()}
            >
              <ShieldCheck className="mr-2 h-4 w-4" />
              Connect Microsoft 365
            </Button>
            <Button asChild className="rounded-full">
              <a
                href="https://publiclogic978.sharepoint.com/sites/PL"
                target="_blank"
                rel="noreferrer"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Open SharePoint
              </a>
            </Button>
            {archieveUrlQuery.data ? (
              <Button asChild variant="outline" className="rounded-full">
                <a
                  href={archieveUrlQuery.data}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Inbox className="mr-2 h-4 w-4" />
                  Open ARCHIEVE
                </a>
              </Button>
            ) : null}
          </>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-7 rounded-3xl border-border bg-card p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="text-xs font-black uppercase tracking-[0.32em] text-muted-foreground">
                Capture → {ARCHIEVE_LIST_NAME}
              </div>
              <div className="mt-2 text-sm font-semibold text-muted-foreground">
                Dump anything here. It becomes an ARCHIEVE record (and can be turned into a list item later).
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
                <span className="rounded-full border border-border bg-muted px-3 py-1">
                  Vault: {vaultMode === "test" ? "TEST" : "PROD"}
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
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                className="rounded-full"
                onClick={() => void saveCapture()}
                disabled={!captureText.trim()}
              >
                <NotebookPen className="mr-2 h-4 w-4" />
                Save
              </Button>
              <Button asChild variant="outline" className="rounded-full">
                <Link to="/lists">
                  <Inbox className="mr-2 h-4 w-4" />
                  Lists
                </Link>
              </Button>
            </div>
          </div>

          <Textarea
            className="mt-4 min-h-[180px]"
            placeholder="Type anything… decisions, links, call notes, next steps. Save pushes it to ARCHIEVE."
            value={captureText}
            onChange={(e) => setCaptureText(e.target.value)}
          />

          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(captureText);
                  toast.success("Copied");
                } catch {
                  toast.error("Could not copy");
                }
              }}
              disabled={!captureText.trim()}
            >
              Copy
            </Button>
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={() => void qc.invalidateQueries({ queryKey: ["archieve"] })}
              disabled={!sp}
            >
              Refresh inbox
            </Button>
          </div>

          <div className="mt-6 rounded-2xl border border-border bg-muted p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-[11px] font-black uppercase tracking-[0.28em] text-muted-foreground">
                  Inbox preview
                </div>
                <div className="mt-2 text-sm font-semibold text-muted-foreground">
                  Latest {ARCHIEVE_LIST_NAME} records (INBOX)
                </div>
              </div>
              {archieveUrlQuery.data ? (
                <Button asChild size="sm" variant="outline" className="rounded-full">
                  <a href={archieveUrlQuery.data} target="_blank" rel="noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Open
                  </a>
                </Button>
              ) : null}
            </div>

            {!sp ? (
              <div className="mt-4 text-sm font-semibold text-muted-foreground">
                Connect Microsoft 365 to load ARCHIEVE inbox.
              </div>
            ) : inboxQuery.isLoading ? (
              <div className="mt-4 text-sm font-semibold text-muted-foreground">
                Loading…
              </div>
            ) : inboxQuery.isError ? (
              <div className="mt-4 text-sm font-semibold text-red-700">
                {inboxQuery.error instanceof Error
                  ? inboxQuery.error.message
                  : String(inboxQuery.error)}
              </div>
            ) : inboxQuery.data?.length ? (
              <div className="mt-4 space-y-2">
                {inboxQuery.data.slice(0, 8).map((it: any) => (
                  <div
                    key={it.itemId || it.RecordId || it.Title}
                    className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-border bg-card p-3"
                  >
                    <div className="min-w-0">
                      <div className="truncate text-sm font-black text-foreground">
                        {it.Title || "(untitled)"}
                      </div>
                      <div className="mt-1 text-xs font-semibold text-muted-foreground">
                        {(it.RecordId as string) || ""}
                        {it.CreatedAt ? (
                          <>
                            {" · "}
                            {format(new Date(it.CreatedAt), "MMM d, h:mm a")}
                          </>
                        ) : null}
                      </div>
                    </div>
                    {it.webUrl ? (
                      <Button asChild size="sm" variant="outline" className="rounded-full">
                        <a href={it.webUrl} target="_blank" rel="noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 text-sm font-semibold text-muted-foreground">
                No inbox items yet.
              </div>
            )}
          </div>
        </Card>

        <div className="lg:col-span-5 grid grid-cols-1 gap-6">
          <Card className="rounded-3xl border-border bg-card p-6 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.32em] text-muted-foreground">
                  Calendars
                </div>
                <div className="mt-2 text-sm font-semibold text-muted-foreground">
                  Today (Allie + Nate).
                </div>
              </div>
              <div className="rounded-full border border-border bg-muted px-3 py-1 text-xs font-black uppercase tracking-widest text-muted-foreground">
                {dayKey}
              </div>
            </div>

            {calendarsQuery.isLoading ? (
              <div className="mt-4 text-sm font-semibold text-muted-foreground">
                Loading…
              </div>
            ) : calendarsQuery.isError ? (
              <div className="mt-4 text-sm font-semibold text-red-700">
                Calendar unavailable. Click “Connect Microsoft 365”.
              </div>
            ) : calendarsQuery.data?.length ? (
              <div className="mt-4 space-y-4">
                {calendarsQuery.data.map((p: any) => (
                  <div key={p.key} className="rounded-2xl border border-border bg-muted p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="text-sm font-black text-foreground">
                        {p.label}
                      </div>
                      <Button asChild size="sm" variant="outline" className="rounded-full">
                        <a
                          href="https://outlook.office.com/calendar/"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                    {p.error ? (
                      <div className="mt-2 text-xs font-semibold text-red-700">
                        {p.error}
                      </div>
                    ) : p.events?.length ? (
                      <div className="mt-3 space-y-2">
                        {p.events.slice(0, 4).map((evt: any) => (
                          <div key={evt.id || evt.webLink} className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="truncate text-sm font-bold text-foreground">
                                {evt.subject || "(no subject)"}
                              </div>
                              <div className="text-xs font-semibold text-muted-foreground">
                                {evt.start?.dateTime
                                  ? format(new Date(evt.start.dateTime), "h:mm a")
                                  : "—"}
                                {" · "}
                                {evt.end?.dateTime
                                  ? format(new Date(evt.end.dateTime), "h:mm a")
                                  : "—"}
                              </div>
                            </div>
                            {evt.webLink ? (
                              <Button asChild size="sm" variant="outline" className="rounded-full">
                                <a href={evt.webLink} target="_blank" rel="noreferrer">
                                  <Link2 className="h-4 w-4" />
                                </a>
                              </Button>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-2 text-sm font-semibold text-muted-foreground">
                        No events.
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 text-sm font-semibold text-muted-foreground">
                No calendars available.
              </div>
            )}
          </Card>

          <Card className="rounded-3xl border-border bg-card p-6 shadow-sm">
            <div className="text-xs font-black uppercase tracking-[0.32em] text-muted-foreground">
              Workspaces
            </div>
            <div className="mt-2 text-sm font-semibold text-muted-foreground">
              The stuff you actually use.
            </div>

            <div className="mt-4 grid grid-cols-1 gap-2">
              <Button asChild className="rounded-full justify-start">
                <Link to="/phillipston">
                  <Landmark className="mr-2 h-4 w-4" />
                  Phillipston CaseSpace
                </Link>
              </Button>
              <Button
                type="button"
                variant="outline"
                className="rounded-full justify-start"
                onClick={() => void openPhillipstonDocs()}
              >
                <FileText className="mr-2 h-4 w-4" />
                Phillipston documents folder
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full justify-start"
              >
                <a href="https://chatgpt.com/" target="_blank" rel="noreferrer">
                  <Link2 className="mr-2 h-4 w-4" />
                  ChatGPT
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full justify-start"
              >
                <a
                  href="https://www.icloud.com/notes/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <NotebookPen className="mr-2 h-4 w-4" />
                  Apple Notes
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full justify-start"
              >
                <a
                  href="https://www.icloud.com/reminders/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <CalendarClock className="mr-2 h-4 w-4" />
                  Apple Reminders
                </a>
              </Button>
            </div>

            <div className="mt-4 text-xs font-semibold text-muted-foreground">
              SharePoint:{" "}
              <span className="font-mono">
                {sharepoint.hostname}/{sharepoint.sitePath}
              </span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
