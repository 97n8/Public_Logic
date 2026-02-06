import PageHeader from "../components/PageHeader";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";

export default function Today() {
  return (
    <div>
      <PageHeader
        title="Today"
        subtitle="Use the Dashboard for intake, calendars, and review."
      />

      <Card className="rounded-3xl border-border bg-card p-6 shadow-sm">
        <div className="text-sm font-semibold text-muted-foreground">
          This app keeps daily work consolidated into the main dashboard.
        </div>
        <div className="mt-4">
          <Button asChild className="rounded-full">
            <Link to="/dashboard">Open Dashboard</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
