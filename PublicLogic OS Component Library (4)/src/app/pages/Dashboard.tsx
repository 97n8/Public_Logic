import { ExternalLink } from "lucide-react";
import PageHeader from "../components/PageHeader";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";

export default function Dashboard() {
  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Private operations portal for PublicLogic. Quick stats, checks, and actions live here."
        actions={
          <Button asChild className="rounded-full">
            <a
              href="https://publiclogic978.sharepoint.com/sites/PL"
              target="_blank"
              rel="noreferrer"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Open SharePoint
            </a>
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="rounded-3xl border-slate-200 p-6 shadow-sm">
          <div className="text-xs font-black uppercase tracking-widest text-slate-500">
            Status
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">
            Connected (demo)
          </div>
          <div className="mt-2 text-sm font-semibold text-slate-600">
            Wire Graph + SharePoint checks in Settings.
          </div>
        </Card>
        <Card className="rounded-3xl border-slate-200 p-6 shadow-sm">
          <div className="text-xs font-black uppercase tracking-widest text-slate-500">
            Today
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">Rituals</div>
          <div className="mt-2 text-sm font-semibold text-slate-600">
            Calendar view + daily checklist.
          </div>
        </Card>
        <Card className="rounded-3xl border-slate-200 p-6 shadow-sm">
          <div className="text-xs font-black uppercase tracking-widest text-slate-500">
            Environments
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">
            Phillipston PRR
          </div>
          <div className="mt-2 text-sm font-semibold text-slate-600">
            Resident submissions, staff intake, case management, archiving.
          </div>
        </Card>
      </div>
    </div>
  );
}

