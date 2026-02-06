import PageHeader from "../components/PageHeader";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";

export default function Pipeline() {
  return (
    <div>
      <PageHeader
        title="Pipeline"
        subtitle="Capture and track opportunities in ARCHIEVE."
      />

      <Card className="rounded-3xl border-border bg-card p-6 shadow-sm">
        <div className="text-sm font-semibold text-muted-foreground">
          Use ARCHIEVE as a lightweight pipeline: capture in Inbox, move to Active
          while in motion, and close items when resolved.
        </div>
        <div className="mt-4">
          <Button asChild className="rounded-full">
            <Link to="/lists">Open Inbox</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
