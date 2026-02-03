// lib/archieve.js
// ARCHIEVE = Authoritative Record Collection for History, Integrity, Evidence, Validation, and Enforcement

export async function ensureArchieveList(sp, cfg) {
  const listName = cfg.sharepoint.archieve?.listName || "ARCHIEVE";

  const existing = await sp.findListByName(listName);
  if (existing) {
    console.log(`ARCHIEVE list exists: ${listName}`);
    return existing;
  }

  console.log(`Creating ARCHIEVE list: ${listName}`);

  const list = await sp.createList({
    displayName: listName,
    description: "Canonical system-of-record for PublicLogic OS"
  });

  for (const col of ARCHIEVE_COLUMNS) {
    try {
      await sp.createColumn(list.id, col);
    } catch (e) {
      console.warn(`Column ${col.name} may already exist:`, e.message);
    }
  }

  console.log("ARCHIEVE list created");
  return list;
}

const text = (name) => ({ name, text: {} });
const multiline = (name) => ({ name, text: { allowMultipleLines: true } });
const boolean = (name) => ({ name, boolean: {} });
const datetime = (name) => ({ name, dateTime: {} });
const choice = (name, choices) => ({ name, choice: { choices, displayAs: "dropDownMenu" } });

const ARCHIEVE_COLUMNS = [
  choice("RecordType", ["task", "project", "pipeline", "decision", "page", "file", "note", "workflow", "intake", "system"]),
  text("RecordSubType"),

  text("AuthorityOwner"),
  text("ResponsibleParty"),
  text("OriginatingSystem"),

  choice("Status", ["draft", "active", "waiting", "approved", "completed", "archived", "void"]),
  choice("LifecycleStage", ["intake", "review", "execution", "record", "closed"]),

  boolean("IsAuthoritative"),
  text("SupersedesRecordID"),

  choice("Disposition", ["retain", "archive", "destroy"]),
  datetime("DispositionDate"),

  text("CreatedByEmail"),
  datetime("CreatedAt"),
  text("LastModifiedByEmail"),
  datetime("LastModifiedAt"),

  text("SourceRoute"),
  text("SourceAction"),
  multiline("ChangeReason"),

  multiline("LegalContext"),
  choice("ComplianceCategory", ["none", "finance", "HR", "records", "procurement", "safety"]),
  choice("RiskLevel", ["low", "moderate", "high", "critical"]),
  boolean("RequiresReview"),
  text("ReviewedBy"),
  datetime("ReviewedAt"),

  text("ParentRecordID"),
  multiline("RelatedRecordIDs"),
  text("ProjectCode"),
  text("ExternalReference"),
  boolean("TransferReady"),

  multiline("Summary"),
  multiline("StructuredPayload"),
  multiline("RenderedContent"),
  multiline("AttachmentLinks"),

  text("Checksum"),
  text("SystemVersion"),
  text("SchemaVersion"),

  choice("ReplicationStatus", ["local", "replicated", "conflict"]),
  text("ReplicationTarget"),

  boolean("Locked"),
  text("LockedReason")
];
