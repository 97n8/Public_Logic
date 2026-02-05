import PageHeader from "../components/PageHeader";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";

export default function Pipeline() {
  return (
    <div>
      <PageHeader
        title="Pipeline"
        subtitle="Use Lists to track leads in ARCHIEVE."
      />

      <Card className="rounded-3xl border-border bg-card p-6 shadow-sm">
        <div className="text-sm font-semibold text-muted-foreground">
          Pipeline is intentionally lightweight here. Capture leads as list items
          in ARCHIEVE, then promote them into a dedicated pipeline module later.
        </div>
        <div className="mt-4">
          <Button asChild className="rounded-full">
            <Link to="/lists">Open Lists</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
