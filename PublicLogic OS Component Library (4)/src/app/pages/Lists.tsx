import { zodResolver } from "@hookform/resolvers/zod";
import { useMsal } from "@azure/msal-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { ExternalLink, Inbox, ListChecks, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import PageHeader from "../components/PageHeader";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import useSharePointClient from "../hooks/useSharePointClient";
import {
  createArchieveRecord,
  getArchieveListUrl,
  listArchieveRecords,
  type ArchieveStatus,
  updateArchieveStatus,
} from "../lib/archieve";
import {
  loadLocalArchieveQueue,
  LOCAL_ARCHIEVE_QUEUE_EVENT,
  removeLocalArchieveItem,
  saveLocalArchieveQueue,
  enqueueLocalArchieveItem,
} from "../lib/local-archieve-queue";

const Schema = z.object({
  title: z.string().trim().min(2, "Title is required"),
  body: z.string().trim().optional(),
});

type FormValues = z.infer<typeof Schema>;

const STATUS_TABS: { id: ArchieveStatus; label: string; icon: any }[] = [
  { id: "INBOX", label: "Inbox", icon: Inbox },
  { id: "ACTIVE", label: "Active", icon: ListChecks },
  { id: "DONE", label: "Done", icon: ListChecks },
];

export default function Lists() {
  const { accounts } = useMsal();
  const actor = accounts[0]?.username || "unknown";
  const qc = useQueryClient();
  const { client: sp, isLoading: isConnecting, error: connectError } =
    useSharePointClient();

  const [status, setStatus] = useState<ArchieveStatus>("INBOX");
  const [localQueue, setLocalQueue] = useState(() => loadLocalArchieveQueue());
  const localQueueCount = localQueue.length;
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const refresh = () => setLocalQueue(loadLocalArchieveQueue());
    refresh();
    window.addEventListener(LOCAL_ARCHIEVE_QUEUE_EVENT, refresh);
    return () => window.removeEventListener(LOCAL_ARCHIEVE_QUEUE_EVENT, refresh);
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(Schema),
    mode: "onChange",
    defaultValues: { title: "", body: "" },
  });

  const itemsQuery = useQuery({
    queryKey: ["archieve", status, !!sp],
    enabled: !!sp,
    staleTime: 5 * 1000,
    queryFn: async () => {
      if (!sp) return [];
      const items = await listArchieveRecords(sp as any, {
        status,
        top: 50,
        forceRefresh: true,
      });
      // newest first
      items.sort((a: any, b: any) => {
        const ad = new Date(a.CreatedAt || a.Created || 0).getTime();
        const bd = new Date(b.CreatedAt || b.Created || 0).getTime();
        return bd - ad;
      });
      return items;
    },
  });

  const listUrlQuery = useQuery({
    queryKey: ["archieve", "listUrl", !!sp],
    enabled: !!sp,
    staleTime: 60 * 1000,
    queryFn: async () => {
      if (!sp) return null;
      return (await getArchieveListUrl(sp as any)) ?? null;
    },
  });

  const statusPill = useMemo(() => {
    const color =
      status === "INBOX"
        ? "bg-accent text-foreground"
        : status === "ACTIVE"
          ? "bg-primary text-primary-foreground"
          : "bg-muted text-muted-foreground";
    return (
      <span
        className={[
          "rounded-full px-3 py-1 text-xs font-black uppercase tracking-widest",
          color,
        ].join(" ")}
      >
        {status}
      </span>
    );
  }, [status]);

  async function setItemStatus(itemId: string | undefined, next: ArchieveStatus) {
    if (!sp || !itemId) return;
    const tid = toast.loading("Updating…");
    setStatusUpdatingId(itemId);
    try {
      await updateArchieveStatus(sp as any, itemId, next);
      toast.success("Updated", { id: tid });
      await qc.invalidateQueries({ queryKey: ["archieve"] });
    } catch (e) {
      toast.error("Could not update", {
        id: tid,
        description: e instanceof Error ? e.message : String(e),
      });
    } finally {
      setStatusUpdatingId(null);
    }
  }

  async function syncLocalQueueToArchieve() {
    if (!sp) {
      toast.error("Connect Microsoft 365 to sync local items.");
      return;
    }

    const queued = loadLocalArchieveQueue();
    if (!queued.length) {
      toast.message("No local items to sync.");
      return;
    }

    const tid = toast.loading(`Syncing ${queued.length} item(s)…`);
    let synced = 0;
    const remaining: typeof queued = [];

    for (const q of [...queued].reverse()) {
      const { localId: _localId, createdAt: _createdAt, ...input } = q;
      try {
        await createArchieveRecord(sp as any, input);
        synced += 1;
      } catch {
        remaining.unshift(q);
      }
    }

    saveLocalArchieveQueue(remaining);
    await qc.invalidateQueries({ queryKey: ["archieve"] });

    if (remaining.length) {
      toast.error("Partial sync", {
        id: tid,
        description: `${synced} saved. ${remaining.length} remaining locally.`,
      });
      return;
    }

    toast.success("Synced", { id: tid, description: `${synced} saved to ARCHIEVE.` });
  }

  async function onSubmit(values: FormValues) {
    const input = {
      title: values.title,
      body: values.body || "",
      recordType: "LIST" as const,
      status,
      actor,
      environment: "PUBLICLOGIC",
      module: "LISTS",
      sourceUrl: window.location.href,
    };

    if (!sp) {
      enqueueLocalArchieveItem(input);
      toast.success("Saved locally", {
        description: "Connect Microsoft 365 to sync to ARCHIEVE.",
      });
      form.reset({ title: "", body: "" });
      return;
    }

    const tid = toast.loading("Saving to ARCHIEVE…");
    try {
      const res = await createArchieveRecord(sp as any, input);
      toast.success("Saved", {
        id: tid,
        description: res.recordId,
      });
      form.reset({ title: "", body: "" });
      await qc.invalidateQueries({ queryKey: ["archieve"] });
    } catch (e) {
      enqueueLocalArchieveItem(input);
      toast.message("Saved locally", {
        id: tid,
        description: "Connect Microsoft 365 to sync to ARCHIEVE.",
      });
      form.reset({ title: "", body: "" });
    }
  }

  return (
    <div>
      <PageHeader
        title="Inbox"
        subtitle="Review captured items and move them through Inbox → Active → Done. Everything is recorded in ARCHIEVE."
        actions={
          <>
            {localQueueCount ? (
              <Button
                type="button"
                variant="outline"
                className="rounded-full"
                onClick={() => void syncLocalQueueToArchieve()}
                disabled={!sp}
                title={
                  sp
                    ? "Sync local items to ARCHIEVE"
                    : "Connect Microsoft 365 to sync local items"
                }
              >
                <Plus className="mr-2 h-4 w-4" />
                Sync local ({localQueueCount})
              </Button>
            ) : null}

            {listUrlQuery.data ? (
              <Button asChild variant="outline" className="rounded-full">
                <a href={listUrlQuery.data} target="_blank" rel="noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open ARCHIEVE
                </a>
              </Button>
            ) : null}
          </>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-5 rounded-3xl border-border bg-card p-6 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xs font-black uppercase tracking-[0.32em] text-muted-foreground">
                New intake
              </div>
              <div className="mt-2 text-sm font-semibold text-muted-foreground">
                Everything captured here is recorded in ARCHIEVE.
              </div>
            </div>
            {statusPill}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {STATUS_TABS.map((t) => (
              <Button
                key={t.id}
                type="button"
                variant={status === t.id ? "default" : "outline"}
                className="rounded-full"
                onClick={() => setStatus(t.id)}
              >
                <t.icon className="mr-2 h-4 w-4" />
                {t.label}
              </Button>
            ))}
          </div>

          <form className="mt-6 space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <div>
              <div className="mb-1 text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                Title
              </div>
              <Input
                placeholder="Issue, decision, or follow-up"
                {...form.register("title")}
              />
              {form.formState.errors.title ? (
                <div className="mt-1 text-xs font-semibold text-red-600">
                  {form.formState.errors.title.message}
                </div>
              ) : null}
            </div>

            <div>
              <div className="mb-1 text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                Notes (optional)
              </div>
              <Textarea
                className="min-h-[160px]"
                placeholder="Context, links, or next steps…"
                {...form.register("body")}
              />
            </div>

            <Button
              type="submit"
              className="rounded-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Save to ARCHIEVE
            </Button>

            {!sp ? (
              <div className="text-sm font-semibold text-muted-foreground">
                Not connected. Captures save locally; connect Microsoft 365 to sync
                to ARCHIEVE.
              </div>
            ) : connectError ? (
              <div className="text-sm font-semibold text-red-700">
                {connectError instanceof Error ? connectError.message : String(connectError)}
              </div>
            ) : null}
          </form>
        </Card>

	        <Card className="lg:col-span-7 rounded-3xl border-border bg-card p-6 shadow-sm">
	          <div className="flex flex-wrap items-start justify-between gap-3">
	            <div>
	              <div className="text-xs font-black uppercase tracking-[0.32em] text-muted-foreground">
	                {status.toLowerCase()}
	              </div>
	              <div className="mt-2 text-sm font-semibold text-muted-foreground">
	                {itemsQuery.data?.length ?? 0} items
	              </div>
	            </div>
	            <Button
	              type="button"
	              variant="outline"
	              className="rounded-full"
	              disabled={!sp || itemsQuery.isFetching}
	              onClick={() => void qc.invalidateQueries({ queryKey: ["archieve"] })}
	            >
	              Refresh
	            </Button>
	          </div>

	          {localQueueCount ? (
	            <div className="mt-4 rounded-2xl border border-border bg-muted p-4">
	              <div className="flex flex-wrap items-start justify-between gap-3">
	                <div>
	                  <div className="text-[11px] font-black uppercase tracking-[0.28em] text-muted-foreground">
	                    Local queue
	                  </div>
	                  <div className="mt-2 text-sm font-semibold text-muted-foreground">
	                    {localQueueCount} item{localQueueCount === 1 ? "" : "s"} saved locally.
	                  </div>
	                </div>
	                <Button
	                  type="button"
	                  size="sm"
	                  variant="outline"
	                  className="rounded-full"
	                  onClick={() => void syncLocalQueueToArchieve()}
	                  disabled={!sp}
	                >
	                  Sync
	                </Button>
	              </div>

	              <div className="mt-3 space-y-2">
	                {localQueue.slice(0, 5).map((q) => (
	                  <div
	                    key={q.localId}
	                    className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-border bg-card p-3"
	                  >
	                    <div className="min-w-0">
	                      <div className="truncate text-sm font-black text-foreground">
	                        {q.title}
	                      </div>
	                      <div className="mt-1 text-xs font-semibold text-muted-foreground">
	                        {format(new Date(q.createdAt), "MMM d, h:mm a")}
	                      </div>
	                    </div>
	                    <div className="flex flex-wrap items-center gap-2">
	                      <Button
	                        type="button"
	                        size="sm"
	                        variant="outline"
	                        className="rounded-full"
	                        onClick={async () => {
	                          try {
	                            await navigator.clipboard.writeText(q.body);
	                            toast.success("Copied");
	                          } catch {
	                            toast.error("Could not copy");
	                          }
	                        }}
	                      >
	                        Copy
	                      </Button>
	                      <Button
	                        type="button"
	                        size="sm"
	                        variant="outline"
	                        className="rounded-full"
	                        onClick={() => removeLocalArchieveItem(q.localId)}
	                      >
	                        Remove
	                      </Button>
	                    </div>
	                  </div>
	                ))}
	                {localQueueCount > 5 ? (
	                  <div className="text-xs font-semibold text-muted-foreground">
	                    +{localQueueCount - 5} more
	                  </div>
	                ) : null}
	              </div>
	            </div>
	          ) : null}

	          {!sp ? (
	            <div className="mt-6 text-sm font-semibold text-muted-foreground">
	              Connect Microsoft 365 to load ARCHIEVE items.
	            </div>
	          ) : itemsQuery.isLoading ? (
	            <div className="mt-6 text-sm font-semibold text-muted-foreground">
	              Loading…
	            </div>
	          ) : itemsQuery.isError ? (
            <div className="mt-6 text-sm font-semibold text-red-700">
              {itemsQuery.error instanceof Error
                ? itemsQuery.error.message
                : String(itemsQuery.error)}
            </div>
	          ) : itemsQuery.data?.length ? (
	            <div className="mt-6 space-y-3">
	              {itemsQuery.data.slice(0, 30).map((it: any) => (
	                <div
	                  key={it.itemId || it.RecordId || it.Title}
	                  className="rounded-2xl border border-border bg-muted p-4"
	                >
	                  <div className="flex flex-wrap items-start justify-between gap-2">
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
	                    <div className="flex flex-wrap items-center gap-2">
	                      {status === "INBOX" ? (
	                        <>
	                          <Button
	                            type="button"
	                            size="sm"
	                            variant="outline"
	                            className="rounded-full"
	                            disabled={
	                              !sp || statusUpdatingId === String(it.itemId || "")
	                            }
	                            onClick={() => void setItemStatus(String(it.itemId || ""), "ACTIVE")}
	                          >
	                            Activate
	                          </Button>
	                          <Button
	                            type="button"
	                            size="sm"
	                            variant="outline"
	                            className="rounded-full"
	                            disabled={
	                              !sp || statusUpdatingId === String(it.itemId || "")
	                            }
	                            onClick={() => void setItemStatus(String(it.itemId || ""), "DONE")}
	                          >
	                            Done
	                          </Button>
	                        </>
	                      ) : status === "ACTIVE" ? (
	                        <>
	                          <Button
	                            type="button"
	                            size="sm"
	                            variant="outline"
	                            className="rounded-full"
	                            disabled={
	                              !sp || statusUpdatingId === String(it.itemId || "")
	                            }
	                            onClick={() => void setItemStatus(String(it.itemId || ""), "INBOX")}
	                          >
	                            Inbox
	                          </Button>
	                          <Button
	                            type="button"
	                            size="sm"
	                            variant="outline"
	                            className="rounded-full"
	                            disabled={
	                              !sp || statusUpdatingId === String(it.itemId || "")
	                            }
	                            onClick={() => void setItemStatus(String(it.itemId || ""), "DONE")}
	                          >
	                            Done
	                          </Button>
	                        </>
	                      ) : (
	                        <Button
	                          type="button"
	                          size="sm"
	                          variant="outline"
	                          className="rounded-full"
	                          disabled={
	                            !sp || statusUpdatingId === String(it.itemId || "")
	                          }
	                          onClick={() => void setItemStatus(String(it.itemId || ""), "ACTIVE")}
	                        >
	                          Reopen
	                        </Button>
	                      )}

	                      {it.webUrl ? (
	                        <Button asChild size="sm" variant="outline" className="rounded-full">
	                          <a href={it.webUrl} target="_blank" rel="noreferrer">
	                            <ExternalLink className="h-4 w-4" />
	                          </a>
	                        </Button>
	                      ) : null}
	                    </div>
	                  </div>

	                  {it.Body ? (
	                    <div className="mt-3 whitespace-pre-wrap text-sm font-semibold text-muted-foreground">
                      {String(it.Body).slice(0, 600)}
                      {String(it.Body).length > 600 ? "…" : ""}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
	          ) : sp ? (
	            <div className="mt-6 rounded-2xl border border-border bg-muted p-6">
	              <div className="flex items-start gap-4">
	                <img
	                  src={`${import.meta.env.BASE_URL}brand/publiclogic-duck-mark.png`}
	                  alt=""
	                  aria-hidden
	                  className="h-10 w-10 opacity-80"
	                />
	                <div className="min-w-0">
	                  <div className="text-sm font-black text-foreground">
	                    Inbox is clear.
	                  </div>
	                  <div className="mt-1 text-sm font-semibold text-muted-foreground">
	                    Capture new items as they arrive, or return to the dashboard
	                    for intake.
	                  </div>
	                </div>
	              </div>
	            </div>
	          ) : null}
	        </Card>
	      </div>
	    </div>
  );
}
