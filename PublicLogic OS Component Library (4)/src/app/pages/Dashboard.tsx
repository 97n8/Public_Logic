import { useMsal } from "@azure/msal-react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  CalendarClock,
  ClipboardCopy,
  ExternalLink,
  Landmark,
  Mail,
  MessagesSquare,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import PageHeader from "../components/PageHeader";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";
import { Textarea } from "../components/ui/textarea";
import { GRAPH_SCOPES } from "../../auth/msalInstance";
import { requireInteraction } from "../../auth/RequireAuth";
import { getMe, getMyCalendarView } from "../lib/graph-api";

type Ritual = { id: string; label: string };

const DEFAULT_RITUALS: Ritual[] = [
  { id: "inbox", label: "Inbox triage (15 min)" },
  { id: "calendar", label: "Check today’s calendar" },
  { id: "prr", label: "PRR check (Phillipston)" },
  { id: "status", label: "Send status update" },
];

export default function Dashboard() {
  const { instance, accounts } = useMsal();
  const account = accounts[0];

  const dayKey = useMemo(() => format(new Date(), "yyyy-MM-dd"), []);
  const ritualStorageKey = `plos:rituals:${dayKey}`;
  const statusStorageKey = `plos:status:${dayKey}`;

  const [rituals, setRituals] = useState<Record<string, boolean>>(() => {
    if (typeof window === "undefined") return {};
    try {
      const raw = window.localStorage.getItem(ritualStorageKey);
      return raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
    } catch {
      return {};
    }
  });

  const meQuery = useQuery({
    queryKey: ["graph", "me", account?.homeAccountId],
    enabled: !!account,
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      if (!account) return null;
      const res = await instance.acquireTokenSilent({
        account,
        scopes: [...GRAPH_SCOPES],
      });
      return await getMe(res.accessToken);
    },
  });

  const eventsQuery = useQuery({
    queryKey: ["graph", "calendarView", account?.homeAccountId, dayKey],
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
      return await getMyCalendarView(res.accessToken, { start, end, top: 8 });
    },
  });

  const displayName =
    (meQuery.data as any)?.displayName ||
    (meQuery.data as any)?.mail ||
    (meQuery.data as any)?.userPrincipalName ||
    account?.username ||
    "—";

  const defaultStatus = useMemo(() => {
    const label = format(new Date(), "EEE MMM d");
    return [
      `Status — ${label}`,
      "",
      "Today:",
      "- ",
      "",
      "PRR (Phillipston):",
      "- ",
      "",
      "Blockers:",
      "- ",
      "",
      "Notes:",
      "- ",
      "",
      `— ${displayName}`,
    ].join("\n");
  }, [displayName]);

  const [statusText, setStatusText] = useState(() => {
    if (typeof window === "undefined") return defaultStatus;
    const saved = window.localStorage.getItem(statusStorageKey);
    return saved ?? defaultStatus;
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(ritualStorageKey, JSON.stringify(rituals));
    } catch {
      // ignore
    }
  }, [ritualStorageKey, rituals]);

  useEffect(() => {
    try {
      window.localStorage.setItem(statusStorageKey, statusText);
    } catch {
      // ignore
    }
  }, [statusStorageKey, statusText]);

  function toggleRitual(id: string, checked: boolean) {
    setRituals((prev) => ({ ...prev, [id]: checked }));
  }

  async function copyStatus() {
    try {
      await navigator.clipboard.writeText(statusText);
      toast.success("Status copied");
    } catch {
      toast.error("Could not copy to clipboard");
    }
  }

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

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Command center for Allie + Nate. Quick actions, today’s rituals, and governed environments."
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
          </>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-4 rounded-3xl border-border bg-card p-6 shadow-sm">
          <div className="text-xs font-black uppercase tracking-[0.32em] text-muted-foreground">
            Quick actions
          </div>

          <div className="mt-4 grid grid-cols-1 gap-2">
            <Button asChild className="rounded-full justify-start">
              <Link to="/tasks">
                <MessagesSquare className="mr-2 h-4 w-4" />
                Tasks
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full justify-start">
              <Link to="/today">
                <CalendarClock className="mr-2 h-4 w-4" />
                Today (calendar + rituals)
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full justify-start">
              <Link to="/environments">
                <Landmark className="mr-2 h-4 w-4" />
                Environments
              </Link>
            </Button>

            <div className="mt-3 rounded-2xl border border-border bg-muted p-4">
              <div className="text-[11px] font-black uppercase tracking-[0.28em] text-muted-foreground">
                Shortcuts
              </div>
              <div className="mt-3 grid grid-cols-1 gap-2">
                <Button
                  asChild
                  variant="outline"
                  className="rounded-full justify-start"
                >
                  <a
                    href="https://outlook.office.com/mail/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Outlook
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-full justify-start"
                >
                  <a
                    href="https://teams.microsoft.com/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <MessagesSquare className="mr-2 h-4 w-4" />
                    Teams
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <Card className="lg:col-span-4 rounded-3xl border-border bg-card p-6 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xs font-black uppercase tracking-[0.32em] text-muted-foreground">
                Today
              </div>
              <div className="mt-2 text-sm font-semibold text-muted-foreground">
                Rituals + upcoming meetings.
              </div>
            </div>
            <div className="rounded-full border border-border bg-muted px-3 py-1 text-xs font-black uppercase tracking-widest text-muted-foreground">
              {dayKey}
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {DEFAULT_RITUALS.map((r) => (
              <label key={r.id} className="flex items-center gap-3 text-sm font-semibold text-foreground">
                <Checkbox
                  checked={rituals[r.id] === true}
                  onCheckedChange={(v) => toggleRitual(r.id, v === true)}
                />
                <span className={rituals[r.id] ? "line-through opacity-70" : ""}>
                  {r.label}
                </span>
              </label>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-border bg-muted p-4">
            <div className="text-[11px] font-black uppercase tracking-[0.28em] text-muted-foreground">
              Next up
            </div>
            {eventsQuery.isLoading ? (
              <div className="mt-3 text-sm font-semibold text-muted-foreground">
                Loading calendar…
              </div>
            ) : eventsQuery.isError ? (
              <div className="mt-3 text-sm font-semibold text-red-700">
                Calendar unavailable. Click “Connect Microsoft 365”.
              </div>
            ) : eventsQuery.data?.length ? (
              <div className="mt-3 space-y-2">
                {eventsQuery.data.slice(0, 4).map((evt: any) => (
                  <div key={evt.id || evt.webLink} className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-bold text-foreground">
                        {evt.subject || "(no subject)"}
                      </div>
                      <div className="text-xs font-semibold text-muted-foreground">
                        {evt.start?.dateTime ? format(new Date(evt.start.dateTime), "h:mm a") : "—"}
                        {" · "}
                        {evt.end?.dateTime ? format(new Date(evt.end.dateTime), "h:mm a") : "—"}
                      </div>
                    </div>
                    {evt.webLink ? (
                      <Button asChild size="sm" variant="outline" className="rounded-full">
                        <a href={evt.webLink} target="_blank" rel="noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-3 text-sm font-semibold text-muted-foreground">
                No events found for the rest of today.
              </div>
            )}
          </div>
        </Card>

        <Card className="lg:col-span-4 rounded-3xl border-border bg-card p-6 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xs font-black uppercase tracking-[0.32em] text-muted-foreground">
                Status template
              </div>
              <div className="mt-2 text-sm font-semibold text-muted-foreground">
                Copy/paste your daily update fast.
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={() => void copyStatus()}
            >
              <ClipboardCopy className="mr-2 h-4 w-4" />
              Copy
            </Button>
          </div>

          <Textarea
            className="mt-4 min-h-[260px]"
            value={statusText}
            onChange={(e) => setStatusText(e.target.value)}
          />

          <div className="mt-6 rounded-2xl border border-border bg-muted p-4">
            <div className="text-[11px] font-black uppercase tracking-[0.28em] text-muted-foreground">
              Phillipston governed space
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button asChild className="rounded-full">
                <Link to="/phillipston">
                  <Landmark className="mr-2 h-4 w-4" />
                  CaseSpace
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full">
                <Link to="/phillipston/prr/staff">
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  PRR Staff
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full">
                <Link to="/phillipston/prr/intake">
                  <ClipboardCopy className="mr-2 h-4 w-4" />
                  New intake
                </Link>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
