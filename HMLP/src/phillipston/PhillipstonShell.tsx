import { useState } from "react";
import { PrrRouter } from "./prr";

export function PhillipstonShell() {
  const [view, setView] = useState<"space" | "intake">("space");

  return (
    <div className="shell">
      <header className="shell__header">
        <div>
          <h1>Phillipston PRR</h1>
          <p>Staff Operations & Institutional Record</p>
        </div>
        <nav>
          <button onClick={() => setView("space")} aria-current={view === "space"}>
            Case Space
          </button>
          <button onClick={() => setView("intake")} aria-current={view === "intake"}>
            Staff Intake
          </button>
        </nav>
      </header>

      <main className="shell__main">
        <PrrRouter view={view} />
      </main>
    </div>
  );
}
