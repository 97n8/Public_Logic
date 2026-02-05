import { zodResolver } from "@hookform/resolvers/zod";
import { useMsal } from "@azure/msal-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { ExternalLink, Inbox, ListChecks, Plus } from "lucide-react";
import { useMemo, useState } from "react";
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
  ARCHIEVE_LIST_NAME,
  createArchieveRecord,
  getArchieveListUrl,
  listArchieveRecords,
  type ArchieveStatus,
} from "../lib/archieve";

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

  async function onSubmit(values: FormValues) {
    if (!sp) {
      toast.error("Microsoft 365 not connected");
      return;
    }
    const tid = toast.loading("Saving to ARCHIEVE…");
    try {
      const res = await createArchieveRecord(sp as any, {
        title: values.title,
        body: values.body || "",
        recordType: "LIST",
        status,
        actor,
        environment: "PUBLICLOGIC",
        module: "LISTS",
        sourceUrl: window.location.href,
      });
      toast.success("Saved", {
        id: tid,
        description: res.recordId,
      });
      form.reset({ title: "", body: "" });
      await qc.invalidateQueries({ queryKey: ["archieve"] });
    } catch (e) {
      toast.error("Could not save", {
        id: tid,
        description: e instanceof Error ? e.message : String(e),
      });
    }
  }

  return (
    <div>
      <PageHeader
        title="Lists"
        subtitle="Fast working lists backed by ARCHIEVE (SharePoint)."
        actions={
          listUrlQuery.data ? (
            <Button asChild variant="outline" className="rounded-full">
              <a href={listUrlQuery.data} target="_blank" rel="noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Open ARCHIEVE
              </a>
            </Button>
          ) : null
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-5 rounded-3xl border-border bg-card p-6 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xs font-black uppercase tracking-[0.32em] text-muted-foreground">
                New item
              </div>
              <div className="mt-2 text-sm font-semibold text-muted-foreground">
                Everything you write here becomes a record in {ARCHIEVE_LIST_NAME}.
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
              <Input placeholder="What needs doing?" {...form.register("title")} />
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
              disabled={!sp || isConnecting || !!connectError}
            >
              <Plus className="mr-2 h-4 w-4" />
              Save to ARCHIEVE
            </Button>

            {!sp ? (
              <div className="text-sm font-semibold text-muted-foreground">
                Connect Microsoft 365 to load and save list items.
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

          {itemsQuery.isLoading ? (
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
                    {it.webUrl ? (
                      <Button asChild size="sm" variant="outline" className="rounded-full">
                        <a href={it.webUrl} target="_blank" rel="noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    ) : null}
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
          ) : (
            <div className="mt-6 text-sm font-semibold text-muted-foreground">
              No items yet.
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

