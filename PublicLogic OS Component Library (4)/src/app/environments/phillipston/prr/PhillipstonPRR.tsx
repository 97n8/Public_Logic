import { Navigate, NavLink, Route, Routes, Link } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { LayoutDashboard } from "lucide-react";
import PageHeader from "../../../components/PageHeader";
import ResidentSubmission from "./pages/ResidentSubmission";
import StaffCaseSpace from "./pages/StaffCaseSpace";
import StaffIntake from "./pages/StaffIntake";

const LEGAL_NOTICE =
  "This request is submitted under M.G.L. c. 66 §10 and 950 CMR 32.00. The Town of Phillipston must respond within 10 business days unless a valid extension applies.";

export default function PhillipstonPRR() {
  return (
    <div>
      <PageHeader
        title="Phillipston PRR"
        subtitle="Public Records Requests (MA). Resident submissions + staff intake + case management + archiving with audit trails."
        actions={
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/phillipston">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              CaseSpace
            </Link>
          </Button>
        }
      />

      <div className="mb-6 rounded-3xl border border-primary/25 bg-accent p-6 text-sm font-semibold text-foreground">
        <div className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">
          Legal notice
        </div>
        <div className="mt-2 leading-relaxed">{LEGAL_NOTICE}</div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {[
          { to: "/phillipston/prr/resident", label: "Resident" },
          { to: "/phillipston/prr/staff", label: "Staff" },
          { to: "/phillipston/prr/intake", label: "Staff Intake" },
        ].map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            className={({ isActive }) =>
              [
                "rounded-full px-6 py-3 text-xs font-black uppercase tracking-widest transition",
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "border border-border bg-card text-foreground hover:bg-accent",
              ].join(" ")
            }
          >
            {t.label}
          </NavLink>
        ))}
      </div>

      <Routes>
        <Route path="/" element={<Navigate to="/phillipston/prr/staff" replace />} />
        <Route path="resident" element={<ResidentSubmission />} />
        <Route path="staff" element={<StaffCaseSpace />} />
        <Route path="intake" element={<StaffIntake />} />
      </Routes>
    </div>
  );
}
