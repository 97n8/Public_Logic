import { useState, useEffect } from "react";

const ENTRY_MODEL = {
  session: {
    prefix: "SESSION",
    folder: (base) => `${base}/SessionLogs/${new Date().getFullYear()}`
  },
  decision: {
    prefix: "DEC",
    folder: (base) => `${base}/Decisions`
  },
  containment: {
    prefix: "CONTAIN",
    folder: (base) => `${base}/ContainmentLog`
  },
  artifact: {
    prefix: (a) => a?.toUpperCase() || "DOC",
    folder: (base, a) => `${base}/Deliverables/${a || "General"}`
  },
  pipeline: {
    prefix: "PIPE",
    folder: () => `/sites/PublicLogic/Pipeline`
  },
  note: {
    prefix: "NOTE",
    folder: (base) => `${base}/Notes`
  }
};

const ENTRY_TYPES = Object.keys(ENTRY_MODEL);

const normalizeClient = (client, name) =>
  client === "template"
    ? name.trim().toLowerCase().replace(/\s+/g, "-")
    : client;

export default function RecordConsole({ ctx, onClose }) {
  const [recordId] = useState(crypto.randomUUID());
  const [entryType, setEntryType] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [client, setClient] = useState("internal");
  const [newClientName, setNewClientName] = useState("");

  const clientKey = normalizeClient(client, newClientName);
  const clientSite =
    client === "internal" ? "/sites/PublicLogic" : `/sites/${clientKey}`;

  const model = entryType ? ENTRY_MODEL[entryType] : null;

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") submit();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const filename = () => {
    if (!model || !title) return "";
    const date = new Date().toISOString().split("T")[0];
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40);
    const prefix =
      typeof model.prefix === "function"
        ? model.prefix()
        : model.prefix;
    return `${prefix}_${date}_${slug}_${recordId.slice(0, 8)}.md`;
  };

  const folderPath = () => model?.folder(clientSite);

  const markdown = () => `
# ${title}

**Record ID:** ${recordId.slice(0,8)}
**Type:** ${entryType}
**Client:** ${clientKey}

---

## Record

${content}

---

## Metadata (System)
- recordId: ${recordId}
- createdAt: ${new Date().toISOString()}
- path: ${folderPath()}
`;

  async function submit() {
    if (!title || !entryType) return;
    console.log("WRITE →", folderPath(), filename());
    console.log(markdown());
    onClose();
  }

  return (
    <div style={{ maxWidth: 720, margin: "48px auto", color: "#e5e7eb" }}>
      {!entryType && (
        <>
          <h2>New Record</h2>
          {ENTRY_TYPES.map(t => (
            <button key={t} onClick={() => setEntryType(t)}>{t}</button>
          ))}
        </>
      )}

      {entryType && (
        <>
          <input
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Record…"
            value={content}
            onChange={e => setContent(e.target.value)}
          />
          <div>{folderPath()} / {filename()}</div>
          <button onClick={submit}>Push Record</button>
          <button onClick={onClose}>Cancel</button>
        </>
      )}
    </div>
  );
}
