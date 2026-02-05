import { format } from "date-fns";
import { Link, useSearchParams } from "react-router-dom";
import { Card } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { loadCases } from "../store";
import { encodeResidentSubmissionMarkdown } from "../vaultprr";

export default function StaffCaseSpace() {
  const cases = loadCases();
  const [searchParams, setSearchParams] = useSearchParams();
  const createdId = searchParams.get("created");
  const createdCase = createdId ? cases.find((c) => c.caseId === createdId) : null;

  function downloadPacket(packet: string, caseId: string) {
    const blob = new Blob([packet], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${caseId}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {createdCase ? (
        <Card className="rounded-3xl border border-primary/25 bg-accent p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                Intake saved
              </div>
              <div className="mt-2 font-mono text-sm font-black text-foreground">
                {createdCase.caseId}
              </div>
              <div className="mt-2 text-sm font-semibold text-muted-foreground">
                T10 due:{" "}
                {(() => {
                  const d = new Date(createdCase.deadlines.t10);
                  return Number.isNaN(d.getTime()) ? "—" : format(d, "MMM d, yyyy");
                })()}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                className="rounded-full"
                onClick={() => {
                  const packet = encodeResidentSubmissionMarkdown(createdCase);
                  void navigator.clipboard?.writeText(packet).catch(() => {});
                }}
              >
                Copy packet
              </Button>
              <Button
                type="button"
                variant="outline"
                className="rounded-full"
                onClick={() => {
                  const packet = encodeResidentSubmissionMarkdown(createdCase);
                  downloadPacket(packet, createdCase.caseId);
                }}
              >
                Download .md
              </Button>
              <Button
                type="button"
                className="rounded-full"
                onClick={() => {
                  const next = new URLSearchParams(searchParams);
                  next.delete("created");
                  setSearchParams(next, { replace: true });
                }}
              >
                Dismiss
              </Button>
            </div>
          </div>
        </Card>
      ) : null}

      <Card className="rounded-3xl border-border bg-card p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-xs font-black uppercase tracking-widest text-muted-foreground">
              Records Office Dashboard
            </div>
            <div className="mt-2 text-sm font-semibold text-muted-foreground">
              Draft intake, track deadlines, and package responses for public
              records requests.
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" className="rounded-full">
              <Link to="../resident">Resident Form</Link>
            </Button>
            <Button asChild className="rounded-full">
              <Link to="../intake">New intake</Link>
            </Button>
          </div>
        </div>
      </Card>

      <Card className="rounded-3xl border-border bg-card p-0 shadow-sm overflow-hidden">
        <div className="bg-muted px-6 py-3 text-xs font-black uppercase tracking-widest text-muted-foreground grid grid-cols-12">
          <div className="col-span-4">Case</div>
          <div className="col-span-5">Requester</div>
          <div className="col-span-3">T10</div>
        </div>

        {cases.length ? (
          cases.map((c) => (
            <div
              key={c.caseId || c.CaseId}
              className={[
                "grid grid-cols-12 border-t border-border px-6 py-4 text-sm font-semibold text-foreground",
                createdId && c.caseId === createdId ? "bg-accent" : "",
              ].join(" ")}
            >
              <div className="col-span-4 font-mono">{c.caseId || c.CaseId}</div>
              <div className="col-span-5 truncate">
                {c.requester?.name || c.RequesterName || "(unknown)"}
                {(c.requester?.email || c.RequesterEmail) ? (
                  <span className="text-muted-foreground">
                    {" "}
                    • {c.requester?.email || c.RequesterEmail}
                  </span>
                ) : null}
              </div>
              <div className="col-span-3">
                {(() => {
                  const raw = c.deadlines?.t10 || c.T10 || c.t10 || c["T10"];
                  if (!raw) return "—";
                  const d = new Date(raw);
                  if (Number.isNaN(d.getTime())) return "—";
                  return format(d, "MMM d, yyyy");
                })()}
              </div>
            </div>
          ))
        ) : (
          <div className="px-6 py-8 text-sm font-semibold text-muted-foreground">
            No requests yet. Use Resident or Staff Intake to draft a request.
          </div>
        )}
      </Card>
    </div>
  );
}
