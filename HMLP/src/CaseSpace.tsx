import { Archive, Clock, ShieldCheck, FileText, AlertCircle } from "lucide-react";

export function CaseSpace() {
  return (
    <div className="case-space">
      <section className="case-hero">
        <h2>PRR Case Space</h2>
        <p>
          System of record for Public Records Requests.
          All actions here are logged and defensible.
        </p>
      </section>

      <section className="case-stats">
        <Stat icon={<Clock />} label="Open Requests" value="6" />
        <Stat icon={<FileText />} label="Active Responses" value="3" />
        <Stat icon={<Archive />} label="Archived PRRs" value="142" />
        <Stat icon={<ShieldCheck />} label="T10 Status" value="Compliant" />
      </section>

      <section className="case-actions">
        <a href="https://publiclogic978.sharepoint.com/sites/PL/Shared%20Documents/01_Towns/MA/Phillipston/PRR" target="_blank">
          📁 Open PRR Folder
        </a>
        <a href="#" target="_blank">🗄️ ARCHIEVE List</a>
        <a href="https://www.publiclogic.org/demo" target="_blank">📘 Training & SOPs</a>
      </section>

      <section className="case-notes">
        <AlertCircle />
        <span>
          This workspace preserves institutional memory and protects the Town
          from turnover-related liability.
        </span>
      </section>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="stat">
      <div className="stat__icon">{icon}</div>
      <div>
        <div className="stat__value">{value}</div>
        <div className="stat__label">{label}</div>
      </div>
    </div>
  );
}
