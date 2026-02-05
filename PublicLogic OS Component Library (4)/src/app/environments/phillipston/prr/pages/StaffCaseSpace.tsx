import { format } from "date-fns";
import { Link } from "react-router-dom";
import { Card } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { loadCases } from "../store";

export default function StaffCaseSpace() {
  const cases = loadCases();

  return (
    <div className="grid grid-cols-1 gap-6">
      <Card className="rounded-3xl border-slate-200 p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-xs font-black uppercase tracking-widest text-slate-500">
              Case Space
            </div>
            <div className="mt-2 text-sm font-semibold text-slate-600">
              Staff dashboard for intake, case management, and archiving to the
              Municipal Vault (SharePoint).
            </div>
          </div>
          <Button asChild className="rounded-full">
            <Link to="../intake">New intake</Link>
          </Button>
        </div>
      </Card>

      <Card className="rounded-3xl border-slate-200 p-0 shadow-sm overflow-hidden">
        <div className="bg-muted px-6 py-3 text-xs font-black uppercase tracking-widest text-muted-foreground grid grid-cols-12">
          <div className="col-span-4">Case</div>
          <div className="col-span-5">Requester</div>
          <div className="col-span-3">T10</div>
        </div>

        {cases.length ? (
          cases.map((c) => (
            <div
              key={c.caseId}
              className="grid grid-cols-12 border-t border-border px-6 py-4 text-sm font-semibold text-foreground"
            >
              <div className="col-span-4 font-mono">{c.caseId}</div>
              <div className="col-span-5 truncate">
                {c.requester.name}
                {c.requester.email ? (
                  <span className="text-muted-foreground"> • {c.requester.email}</span>
                ) : null}
              </div>
              <div className="col-span-3">
                {format(new Date(c.deadlines.t10), "MMM d, yyyy")}
              </div>
            </div>
          ))
        ) : (
          <div className="px-6 py-8 text-sm font-semibold text-slate-600">
            No local demo cases yet. Use Resident or Staff Intake to create one.
          </div>
        )}
      </Card>
    </div>
  );
}
