export async function ensureArchieveList(sp, cfg) {
  const listName = "ARCHIEVE";

  // 1. Check if list already exists
  const existing = await sp.findListByName(listName);
  if (existing) {
    console.log("ARCHIEVE already exists");
    return existing;
  }

  console.log("Creating ARCHIEVE list...");

  // 2. Create the list
  const list = await sp.createList({
    displayName: listName,
    description: "Canonical system-of-record for PublicLogic OS",
    template: "genericList"
  });

  const listId = list.id;

  // 3. Create columns
  const columns = ARCHIEVE_COLUMNS();
  for (const col of columns) {
    await sp.createColumn(listId, col);
  }

  console.log("ARCHIEVE list created");
  return list;
}

function ARCHIEVE_COLUMNS() {
  return [
    text("RecordID"),
    choice("RecordType", ["task","project","pipeline","decision","page","file","note","workflow","intake","system"]),
    text("RecordSubType"),
    text("AuthorityOwner"),
    text("ResponsibleParty"),
    text("OriginatingSystem"),

    choice("Status", ["draft","active","waiting","approved","completed","archived","void"]),
    choice("LifecycleStage", ["intake","review","execution","record","closed"]),
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
    choice("ComplianceCategory", ["none","finance","HR","records","procurement","safety"]),
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
    boolean("Locked"),
    text("LockedReason")
  ];
}

/* column helpers */
const text = (name) => ({
  name,
  text: { allowMultipleLines: false }
});

const multiline = (name) => ({
  name,
  text: { allowMultipleLines: true }
});

const boolean = (name) => ({
  name,
  boolean: {}
});

const datetime = (name) => ({
  name,
  dateTime: {}
});

const choice = (name, choices) => ({
  name,
  choice: {
    choices,
    displayAs: "dropDownMenu"
  }
});
