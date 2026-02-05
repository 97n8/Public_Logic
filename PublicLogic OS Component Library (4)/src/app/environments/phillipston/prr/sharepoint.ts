import { formatISO } from "date-fns";
import type { VaultPrrCase } from "./vaultprr";
import { encodeResidentSubmissionMarkdown } from "./vaultprr";
import { getSharePointRuntimeConfig } from "../../../../auth/publiclogicConfig";

export type SharePointPrrSetup = {
  casesListName: string;
  auditListName: string;
  libraryRoot: string;
};

export function getPrrSetup(): SharePointPrrSetup {
  const cfg = getSharePointRuntimeConfig();
  return {
    casesListName: cfg.vault.casesListName,
    auditListName: cfg.vault.auditListName,
    libraryRoot: cfg.vault.libraryRoot,
  };
}

export function getFiscalYearFolder(d: Date) {
  // Massachusetts FY starts July 1
  const year = d.getFullYear();
  const month = d.getMonth(); // 0-based
  const startYear = month >= 6 ? year : year - 1;
  return `FY${startYear}-${startYear + 1}`;
}

export function caseFolderSegments(caseData: VaultPrrCase) {
  const received = new Date(caseData.intake.receivedAt);
  const { libraryRoot } = getPrrSetup();
  return [
    libraryRoot,
    getFiscalYearFolder(received),
    "PHILLIPSTON",
    "PRR",
    caseData.caseId,
  ];
}

export function caseMarkdownFileName(caseData: VaultPrrCase) {
  return `${caseData.caseId}.md`;
}

export async function ensurePrrSharePointSchema(sp: {
  ensureListWithColumns: (args: {
    displayName: string;
    description: string;
    columns: any[];
  }) => Promise<any>;
}) {
  const { casesListName, auditListName } = getPrrSetup();

  await sp.ensureListWithColumns({
    displayName: casesListName,
    description: "PublicLogic PRR Cases (index)",
    columns: [
      { name: "CaseId", text: {} },
      { name: "Environment", text: {} },
      { name: "Module", text: {} },
      { name: "Status", text: {} },
      { name: "RequesterName", text: {} },
      { name: "RequesterEmail", text: {} },
      { name: "RequesterPhone", text: {} },
      { name: "ReceivedAt", dateTime: { displayAs: "default" } },
      { name: "T10", dateTime: { displayAs: "default" } },
      { name: "RequestText", text: { allowMultipleLines: true } },
      { name: "FolderPath", text: {} },
      { name: "MarkdownWebUrl", text: {} },
    ],
  });

  await sp.ensureListWithColumns({
    displayName: auditListName,
    description: "PublicLogic PRR Audit Log (append-only)",
    columns: [
      { name: "CaseId", text: {} },
      { name: "At", dateTime: { displayAs: "default" } },
      { name: "Actor", text: {} },
      { name: "Action", text: {} },
      { name: "Detail", text: { allowMultipleLines: true } },
    ],
  });
}

export async function archivePrrCaseToSharePoint(
  sp: {
    ensureDriveFolder: (segments: string[]) => Promise<{ path: string; item: any }>;
    uploadTextFile: (args: {
      pathSegments: string[];
      fileName: string;
      content: string;
      contentType?: string;
    }) => Promise<any>;
    uploadFile: (args: { pathSegments: string[]; fileName: string; file: File }) => Promise<any>;
    createItem: (listName: string, fields: any) => Promise<any>;
    updateItemFields: (listName: string, itemId: string, fields: any) => Promise<any>;
    queryItemsByField: (args: {
      displayName: string;
      fieldName: string;
      equals: string;
      top?: number;
    }) => Promise<any[]>;
  },
  caseData: VaultPrrCase,
  {
    actor,
    attachments = [],
  }: {
    actor: string;
    attachments?: File[];
  },
) {
  const { casesListName, auditListName } = getPrrSetup();

  await ensurePrrSharePointSchema(sp as any);

  // Ensure folder structure exists.
  const folderSegments = caseFolderSegments(caseData);
  const folder = await sp.ensureDriveFolder(folderSegments);

  // Upload markdown case file.
  const md = encodeResidentSubmissionMarkdown(caseData);
  const mdDriveItem = await sp.uploadTextFile({
    pathSegments: folderSegments,
    fileName: caseMarkdownFileName(caseData),
    content: md,
  });

  // Upload attachments (if any) into a subfolder.
  const uploaded: any[] = [];
  if (attachments.length) {
    const attSegments = [...folderSegments, "attachments"];
    await sp.ensureDriveFolder(attSegments);
    for (const f of attachments) {
      const driveItem = await sp.uploadFile({
        pathSegments: attSegments,
        fileName: f.name,
        file: f,
      });
      uploaded.push(driveItem);
    }
  }

  // Create/append audit (append-only list).
  for (const entry of caseData.auditLog) {
    await sp.createItem(auditListName, {
      Title: `${caseData.caseId} — ${entry.action}`,
      CaseId: caseData.caseId,
      At: entry.at,
      Actor: entry.actor,
      Action: entry.action,
      Detail: entry.detail || "",
    });
  }

  const existing = await sp.queryItemsByField({
    displayName: casesListName,
    fieldName: "CaseId",
    equals: caseData.caseId,
    top: 1,
  });

  const caseFields = {
    Title: `${caseData.caseId} — ${caseData.requester.name}`,
    CaseId: caseData.caseId,
    Environment: caseData.environment,
    Module: caseData.module,
    Status: caseData.status,
    RequesterName: caseData.requester.name,
    RequesterEmail: caseData.requester.email || "",
    RequesterPhone: caseData.requester.phone || "",
    ReceivedAt: caseData.intake.receivedAt,
    T10: caseData.deadlines.t10,
    RequestText: caseData.intake.requestText,
    FolderPath: folder.path,
    MarkdownWebUrl: mdDriveItem?.webUrl || "",
  };

  if (existing[0]?.itemId) {
    await sp.updateItemFields(casesListName, String(existing[0].itemId), caseFields);
  } else {
    await sp.createItem(casesListName, caseFields);
  }

  // Append a "sharepoint archived" entry (in-memory only for now).
  await sp.createItem(auditListName, {
    Title: `${caseData.caseId} — archived`,
    CaseId: caseData.caseId,
    At: formatISO(new Date()),
    Actor: actor,
    Action: "archived_to_sharepoint",
    Detail: `folder=${folder.path}; markdown=${mdDriveItem?.webUrl || ""}; attachments=${uploaded.length}`,
  });

  return {
    folderPath: folder.path,
    markdownWebUrl: mdDriveItem?.webUrl as string | undefined,
    attachments: uploaded.map((u) => ({ name: u?.name, webUrl: u?.webUrl })),
  };
}
