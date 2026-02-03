import { CaseSpace } from "./CaseSpace";
import { StaffIntake } from "./StaffIntake";

export function PrrRouter({ view }: { view: "space" | "intake" }) {
  if (view === "intake") return <StaffIntake />;
  return <CaseSpace />;
}
