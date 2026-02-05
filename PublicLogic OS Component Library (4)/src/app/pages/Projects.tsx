import PageHeader from "../components/PageHeader";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";

export default function Projects() {
  return (
    <div>
      <PageHeader
        title="Projects"
        subtitle="Track work in Lists and ARCHIEVE; launch town environments from Environments."
      />

      <Card className="rounded-3xl border-border bg-card p-6 shadow-sm">
        <div className="text-sm font-semibold text-muted-foreground">
          This deployment keeps project tracking simple: capture items in ARCHIEVE
          and work out of governed environments.
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button asChild className="rounded-full">
            <Link to="/lists">Open Lists</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/environments">Open Environments</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
