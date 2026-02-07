import { formatISO } from "date-fns";

export const ARCHIEVE_LIST_NAME = "ARCHIEVE";

export type ArchieveStatus = "INBOX" | "ACTIVE" | "DONE";
export type ArchieveRecordType = "CAPTURE" | "STATUS" | "LINK" | "LIST";

export type ArchieveCreateInput = {
  title: string;
  body: string;
  recordType?: ArchieveRecordType;
  status?: ArchieveStatus;
  environment?: string;
  module?: string;
  actor: string;
  sourceUrl?: string;
};

function randomSuffix(len = 4) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(len);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}

export function createArchieveId(prefix = "ARC") {
  const d = new Date();
  const y = String(d.getFullYear());
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `${prefix}-${y}${m}${day}-${hh}${mm}${ss}-${randomSuffix(4)}`;
}

type SharePointClient = {
  ensureListWithColumns: (args: {
    displayName: string;
    description: string;
    columns: any[];
  }) => Promise<any>;
  createItem: (listName: string, fields: any) => Promise<any>;
  updateItemFields: (listName: string, itemId: string, fields: any) => Promise<any>;
  deleteItem: (listName: string, itemId: string) => Promise<any>;
  listItems: (
    listName: string,
    args?: { selectFields?: string[]; top?: number; forceRefresh?: boolean },
  ) => Promise<any[]>;
  findListByName: (displayName: string) => Promise<any | null>;
};

export async function ensureArchieveSchema(sp: SharePointClient) {
  return await sp.ensureListWithColumns({
    displayName: ARCHIEVE_LIST_NAME,
    description: "ARCHIEVE — immutable record index (PublicLogic OS)",
    columns: [
      { name: "RecordId", text: {} },
      { name: "RecordType", text: {} },
      { name: "Environment", text: {} },
      { name: "Module", text: {} },
      { name: "Status", text: {} },
      { name: "Body", text: { allowMultipleLines: true } },
      { name: "CreatedByActor", text: {} },
      { name: "CreatedAt", dateTime: { displayAs: "default" } },
      { name: "SourceUrl", text: {} },
      { name: "SystemVersion", text: {} },
    ],
  });
}

export async function createArchieveRecord(
  sp: SharePointClient,
  input: ArchieveCreateInput,
) {
  await ensureArchieveSchema(sp);
  const recordId = createArchieveId();
  const nowIso = formatISO(new Date());

  const baseUrl =
    typeof window === "undefined"
      ? ""
      : `${window.location.origin}${import.meta.env.BASE_URL}`;

  const result = await sp.createItem(ARCHIEVE_LIST_NAME, {
    Title: input.title?.trim() || recordId,
    RecordId: recordId,
    RecordType: input.recordType ?? "CAPTURE",
    Environment: input.environment ?? "PUBLICLOGIC",
    Module: input.module ?? "OPS",
    Status: input.status ?? "INBOX",
    Body: input.body ?? "",
    CreatedByActor: input.actor,
    CreatedAt: nowIso,
    SourceUrl: input.sourceUrl ?? "",
    SystemVersion: baseUrl,
  });

  return {
    recordId,
    itemId: String(result?.id || result?.itemId || ""),
    webUrl: (result?.webUrl as string | undefined) ?? undefined,
  };
}

export async function listArchieveRecords(
  sp: SharePointClient,
  {
    status,
    top = 25,
    forceRefresh = false,
  }: { status?: ArchieveStatus; top?: number; forceRefresh?: boolean } = {},
) {
  await ensureArchieveSchema(sp);
  const items = await sp.listItems(ARCHIEVE_LIST_NAME, { top, forceRefresh });
  const filtered = status ? items.filter((i) => i.Status === status) : items;
  return filtered;
}

export async function getArchieveListUrl(sp: SharePointClient) {
  const list = await sp.findListByName(ARCHIEVE_LIST_NAME);
  return (list?.webUrl as string | undefined) ?? undefined;
}

export async function updateArchieveStatus(
  sp: SharePointClient,
  itemId: string,
  status: ArchieveStatus,
) {
  await ensureArchieveSchema(sp);
  await sp.updateItemFields(ARCHIEVE_LIST_NAME, itemId, { Status: status });
}

export async function deleteArchieveItem(sp: SharePointClient, itemId: string) {
  await ensureArchieveSchema(sp);
  await sp.deleteItem(ARCHIEVE_LIST_NAME, itemId);
}
