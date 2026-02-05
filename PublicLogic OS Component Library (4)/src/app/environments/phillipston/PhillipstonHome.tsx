import { Landmark, MailOpen, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";

export default function PhillipstonHome() {
  return (
    <div className="grid grid-cols-1 gap-6">
      <Card className="rounded-3xl border-border bg-card p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-xs font-black uppercase tracking-[0.32em] text-muted-foreground">
              Town of Phillipston
            </div>
            <h1 className="mt-2 text-2xl font-black tracking-tight text-foreground">
              CaseSpace
            </h1>
            <p className="mt-2 max-w-3xl text-sm font-semibold text-muted-foreground">
              A dedicated workspace for public records requests—intake, deadlines,
              case tracking, and response packaging.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/phillipston/prr/resident">
                <MailOpen className="mr-2 h-4 w-4" />
                Submit a Request
              </Link>
            </Button>
            <Button asChild className="rounded-full">
              <Link to="/phillipston/prr/staff">
                <ShieldCheck className="mr-2 h-4 w-4" />
                Staff Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="rounded-3xl border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <Landmark className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-black text-foreground">
                Public Records Requests
              </div>
              <div className="text-xs font-semibold text-muted-foreground">
                M.G.L. c. 66 §10 • 10 business days (T10)
              </div>
            </div>
          </div>

          <div className="mt-4 text-sm font-semibold text-muted-foreground">
            Resident intake, staff workflow, and deadline tracking in one place.
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Button asChild className="rounded-full">
              <Link to="/phillipston/prr/staff">Staff</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/phillipston/prr/intake">Intake</Link>
            </Button>
          </div>
        </Card>

        <Card className="rounded-3xl border-border bg-card p-6 shadow-sm">
          <div className="text-xs font-black uppercase tracking-[0.32em] text-muted-foreground">
            Resident Portal
          </div>
          <div className="mt-2 text-lg font-black text-foreground">
            Simple, clear submission
          </div>
          <div className="mt-2 text-sm font-semibold text-muted-foreground">
            A guided request form for residents, with a generated case packet for
            staff review.
          </div>
        </Card>

        <Card className="rounded-3xl border-border bg-card p-6 shadow-sm">
          <div className="text-xs font-black uppercase tracking-[0.32em] text-muted-foreground">
            Staff Workflow
          </div>
          <div className="mt-2 text-lg font-black text-foreground">
            Intake → assess → respond
          </div>
          <div className="mt-2 text-sm font-semibold text-muted-foreground">
            Drafts cases, tracks deadlines, and supports packaging records for
            delivery.
          </div>
        </Card>
      </div>
    </div>
  );
}
