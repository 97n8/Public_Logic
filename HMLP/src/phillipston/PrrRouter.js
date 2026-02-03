import { CaseSpace } from "./pages/CaseSpace.js";
import { StaffIntake } from "./pages/StaffIntake.js";

export function PrrRouter({ cfg, auth, sp }) {
  let view = "space";

  const container = document.createElement("div");

  const nav = document.createElement("nav");
  nav.className = "prr-nav";

  const btnSpace = document.createElement("button");
  btnSpace.textContent = "Case Space";

  const btnIntake = document.createElement("button");
  btnIntake.textContent = "Staff Intake";

  nav.appendChild(btnSpace);
  nav.appendChild(btnIntake);

  const body = document.createElement("div");

  function render(nextView) {
    view = nextView;

    btnSpace.setAttribute(
      "aria-current",
      view === "space" ? "true" : "false"
    );
    btnIntake.setAttribute(
      "aria-current",
      view === "intake" ? "true" : "false"
    );

    body.innerHTML = "";
    body.appendChild(
      view === "intake"
        ? StaffIntake({ cfg, auth, sp })
        : CaseSpace({ cfg, auth, sp })
    );
  }

  btnSpace.onclick = () => render("space");
  btnIntake.onclick = () => render("intake");

  container.appendChild(nav);
  container.appendChild(body);

  render(view);
  return container;
}
