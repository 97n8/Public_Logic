import PageHeader from "../components/PageHeader";
import { Card } from "../components/ui/card";

export default function Pipeline() {
  return (
    <div>
      <PageHeader
        title="Pipeline"
        subtitle="Sales leads table (Lead → Qualified → Proposal → Closed Won/Lost) with lightweight notes."
      />

      <Card className="rounded-3xl border-slate-200 p-6 shadow-sm">
        <div className="text-sm font-semibold text-slate-600">
          Coming next: SharePoint list `Pipeline` + stage transitions + quick
          follow-up tasks.
        </div>
      </Card>
    </div>
  );
}

