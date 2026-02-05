import PageHeader from "../components/PageHeader";
import { Card } from "../components/ui/card";

export default function Today() {
  return (
    <div>
      <PageHeader
        title="Today"
        subtitle="Shared calendars, rituals checklist, and a status template copier (Graph-backed)."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="rounded-3xl border-slate-200 p-6 shadow-sm">
          <div className="text-xs font-black uppercase tracking-widest text-slate-500">
            Calendar
          </div>
          <div className="mt-2 text-sm font-semibold text-slate-600">
            Coming next: Graph `calendarView` with shared calendars and caching.
          </div>
        </Card>
        <Card className="rounded-3xl border-slate-200 p-6 shadow-sm">
          <div className="text-xs font-black uppercase tracking-widest text-slate-500">
            Rituals
          </div>
          <div className="mt-2 text-sm font-semibold text-slate-600">
            Coming next: configurable checklist stored in SharePoint list.
          </div>
        </Card>
      </div>
    </div>
  );
}

