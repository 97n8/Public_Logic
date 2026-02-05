import PageHeader from "../components/PageHeader";
import { Card } from "../components/ui/card";

export default function Tasks() {
  return (
    <div>
      <PageHeader
        title="Tasks"
        subtitle="Filterable task table with status pills and create/edit modals (SharePoint list-backed)."
      />

      <Card className="rounded-3xl border-slate-200 p-6 shadow-sm">
        <div className="text-sm font-semibold text-slate-600">
          Coming next: TanStack Query + SharePoint list `Tasks` with statuses:
          Today, This Week, Backlog, Blocked, Done.
        </div>
      </Card>
    </div>
  );
}

