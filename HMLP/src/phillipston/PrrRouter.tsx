import { useState } from "react";
import { CaseSpace } from "./CaseSpace";
import { StaffIntake } from "./StaffIntake";

type View = "space" | "intake";

export function PrrRouter() {
  const [view, setView] = useState<View>("space");

  return (
    <>
      <nav className="prr-nav">
        <button
          onClick={() => setView("space")}
          aria-current={view === "space"}
        >
          Case Space
        </button>

        <button
          onClick={() => setView("intake")}
          aria-current={view === "intake"}
        >
          Staff Intake
        </button>
      </nav>

      {view === "intake" ? <StaffIntake /> : <CaseSpace />}
    </>
  );
}
