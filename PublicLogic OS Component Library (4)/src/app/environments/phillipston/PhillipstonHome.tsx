import { Landmark, MailOpen, ShieldCheck, FolderOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import useSharePointClient from "../../hooks/useSharePointClient";
import { ensurePrrVaultRoot, getPrrSetup } from "./prr/sharepoint";

export default function PhillipstonHome() {
  const sp = useSharePointClient();
  const setup = getPrrSetup();

  return (
    <div className="grid grid-cols-1 gap-6">
      <Card className="rounded-3xl border-border bg-card p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-xs font-black uppercase tracking-[0.32em] text-muted-foreground">
              Phillipston CaseSpace
            </div>
            <h1 className="mt-2 text-2xl font-black tracking-tight text-foreground">
              Governed Case Space
            </h1>
            <p className="mt-2 max-w-3xl text-sm font-semibold text-muted-foreground">
              This town environment is sold as a governed space: separate chrome,
              separate vault, separate audit trails.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button asChild className="rounded-full">
              <Link to="/phillipston/prr/staff">
                <ShieldCheck className="mr-2 h-4 w-4" />
                Open PRR Staff
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/phillipston/prr/resident">
                <MailOpen className="mr-2 h-4 w-4" />
                Open Resident Form
              </Link>
            </Button>
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              disabled={!sp.client}
              onClick={async () => {
                if (!sp.client) return;
                const root = await ensurePrrVaultRoot(sp.client as any);
                const url = root?.item?.webUrl as string | undefined;
                if (url) window.open(url, "_blank", "noopener,noreferrer");
              }}
            >
              <FolderOpen className="mr-2 h-4 w-4" />
              Open Vault Folder
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
              <div className="text-sm font-black text-foreground">PRR Module</div>
              <div className="text-xs font-semibold text-muted-foreground">
                M.G.L. c. 66 §10 + audit trail
              </div>
            </div>
          </div>

          <div className="mt-4 text-sm font-semibold text-muted-foreground">
            Case index list: <span className="font-mono">{setup.casesListName}</span>
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
            Coming next
          </div>
          <div className="mt-2 text-lg font-black text-foreground">Clerk / Fiscal</div>
          <div className="mt-2 text-sm font-semibold text-muted-foreground">
            Additional governed modules live inside this environment without
            mixing with other towns.
          </div>
        </Card>

        <Card className="rounded-3xl border-border bg-card p-6 shadow-sm">
          <div className="text-xs font-black uppercase tracking-[0.32em] text-muted-foreground">
            Integrations
          </div>
          <div className="mt-2 text-lg font-black text-foreground">Microsoft 365</div>
          <div className="mt-2 text-sm font-semibold text-muted-foreground">
            Uses Entra ID sign-in + Microsoft Graph + SharePoint vault folders.
          </div>
        </Card>
      </div>
    </div>
  );
}

