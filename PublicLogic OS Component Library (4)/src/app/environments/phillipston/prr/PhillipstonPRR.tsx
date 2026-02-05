import { Navigate, NavLink, Route, Routes } from "react-router-dom";
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
      />

      <div className="mb-6 rounded-3xl border border-emerald-200 bg-emerald-50 p-6 text-sm font-semibold text-emerald-900">
        <div className="text-xs font-black uppercase tracking-[0.3em] text-emerald-700">
          Legal notice
        </div>
        <div className="mt-2 leading-relaxed">{LEGAL_NOTICE}</div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {[
          { to: "resident", label: "Resident" },
          { to: "staff", label: "Staff" },
          { to: "intake", label: "Staff Intake" },
        ].map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            className={({ isActive }) =>
              [
                "rounded-full px-6 py-3 text-xs font-black uppercase tracking-widest transition",
                isActive
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                  : "border border-slate-300 bg-white text-slate-800 hover:bg-slate-50",
              ].join(" ")
            }
          >
            {t.label}
          </NavLink>
        ))}
      </div>

      <Routes>
        <Route path="/" element={<Navigate to="staff" replace />} />
        <Route path="resident" element={<ResidentSubmission />} />
        <Route path="staff" element={<StaffCaseSpace />} />
        <Route path="intake" element={<StaffIntake />} />
      </Routes>
    </div>
  );
}

