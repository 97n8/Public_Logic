import type { ArchieveCreateInput } from "./archieve";

export const LOCAL_ARCHIEVE_QUEUE_KEY = "publiclogic:archieve:local-queue";
export const LOCAL_ARCHIEVE_QUEUE_EVENT = "publiclogic:archieve:local-queue:changed";

export type LocalArchieveQueuedItem = ArchieveCreateInput & {
  localId: string;
  createdAt: string; // ISO string
};

function safeParse(raw: string | null): LocalArchieveQueuedItem[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((it: any) => {
        const localId = String(it?.localId || "").trim();
        const createdAt = String(it?.createdAt || "").trim();
        const title = String(it?.title || "").trim();
        const body = String(it?.body || "");
        const actor = String(it?.actor || "").trim();
        if (!localId || !createdAt || !title || !actor) return null;

        return {
          localId,
          createdAt,
          title,
          body,
          actor,
          recordType: it?.recordType,
          status: it?.status,
          environment: it?.environment,
          module: it?.module,
          sourceUrl: it?.sourceUrl,
        } satisfies LocalArchieveQueuedItem;
      })
      .filter(Boolean) as LocalArchieveQueuedItem[];
  } catch {
    return [];
  }
}

function emitChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(LOCAL_ARCHIEVE_QUEUE_EVENT));
}

export function loadLocalArchieveQueue(): LocalArchieveQueuedItem[] {
  if (typeof window === "undefined") return [];
  return safeParse(window.localStorage.getItem(LOCAL_ARCHIEVE_QUEUE_KEY));
}

export function saveLocalArchieveQueue(items: LocalArchieveQueuedItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LOCAL_ARCHIEVE_QUEUE_KEY, JSON.stringify(items));
  emitChanged();
}

export function enqueueLocalArchieveItem(
  input: ArchieveCreateInput,
): LocalArchieveQueuedItem {
  const next: LocalArchieveQueuedItem = {
    ...input,
    localId: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `local-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  const current = loadLocalArchieveQueue();
  saveLocalArchieveQueue([next, ...current].slice(0, 200));
  return next;
}

export function removeLocalArchieveItem(localId: string) {
  const current = loadLocalArchieveQueue();
  const next = current.filter((it) => it.localId !== localId);
  saveLocalArchieveQueue(next);
}

export function clearLocalArchieveQueue() {
  saveLocalArchieveQueue([]);
}

