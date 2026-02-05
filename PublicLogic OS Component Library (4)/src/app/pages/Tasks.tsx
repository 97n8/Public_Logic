import PageHeader from "../components/PageHeader";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";

export default function Tasks() {
  return (
    <div>
      <PageHeader
        title="Tasks"
        subtitle="Tasks are handled via Lists (ARCHIEVE-backed)."
      />

      <Card className="rounded-3xl border-border bg-card p-6 shadow-sm">
        <div className="text-sm font-semibold text-muted-foreground">
          This deployment uses ARCHIEVE-backed lists instead of a separate tasks
          module.
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
