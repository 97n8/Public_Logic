export async function ensureArchieveList(sp) {
  const LIST_NAME = "ARCHIEVE";

  // 1. Check existence
  const existing = await sp.findListByName(LIST_NAME);
  if (existing) {
    console.log("ARCHIEVE already exists");
    return existing;
  }

  console.log("Creating ARCHIEVE list…");

  // 2. Create list
  const list = await sp.createList({
    displayName: LIST_NAME,
    description: "Canonical system-of-record for PublicLogic OS"
  });

  // 3. Create schema columns
  for (const col of ARCHIEVE_COLUMNS()) {
    await sp.createColumn(list.id, col);
  }

  console.log("ARCHIEVE list created");
  return list;
}

/* ================== SCHEMA ================== */

function ARCHIEVE_COLUMNS() {
  return [
    choice("RecordType", [
      "task","project","pipeline","decision","page","file",
      "note","workflow","intake","system"
    ]),
    text("RecordSubType"),

    text("AuthorityOwner"),
    text("ResponsibleParty"),
    text("OriginatingSystem"),

    choice("Status", [
      "draft","active","waiting","approved",
      "completed","archived","void"
    ]),
    choice("LifecycleStage", [
      "intake","review","execution","record","closed"
    ]),

    boolean("IsAuthoritative"),
    text("SupersedesRecordID"),

    choice("Disposition", ["retain","archive","destroy"]),
    datetime("DispositionDate"),

    text("CreatedByEmail"),
    datetime("CreatedAt"),
    text("LastModifiedByEmail"),
    datetime("LastModifiedAt"),

    text("SourceRoute"),
    text("SourceAction"),
    multiline("ChangeReason"),

    multiline("LegalContext"),
    choice("ComplianceCategory", [
      "none","finance","HR","records","procurement","safety"
    ]),
    choice("RiskLevel", ["low","moderate","high","critical"]),
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

    choice("ReplicationStatus", ["local","replicated","conflict"]),
    text("ReplicationTarget"),
