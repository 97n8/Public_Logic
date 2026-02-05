import PageHeader from "../components/PageHeader";
import { Card } from "../components/ui/card";

export default function Projects() {
  return (
    <div>
      <PageHeader
        title="Projects"
        subtitle="Projects table with status/dates, linked case folders, and environment launches."
      />

      <Card className="rounded-3xl border-slate-200 p-6 shadow-sm">
        <div className="text-sm font-semibold text-slate-600">
          Coming next: Projects list + links to Case Space folders in SharePoint.
        </div>
      </Card>
    </div>
  );
}

