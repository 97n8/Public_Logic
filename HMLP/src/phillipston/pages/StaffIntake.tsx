export function StaffIntake() {
  const root = document.createElement("div");
  root.className = "staff-intake";

  const h2 = document.createElement("h2");
  h2.textContent = "Staff PRR Intake";

  const p = document.createElement("p");
  p.textContent =
    "Use this form when requests arrive by email, phone, or walk-in.";

  const form = document.createElement("form");
  form.className = "intake-form";

  /* ===== Requester Name ===== */
  const nameLabel = document.createElement("label");
  nameLabel.textContent = "Requester Name";

  const nameInput = document.createElement("input");
  nameInput.required = true;

  nameLabel.appendChild(nameInput);

  /* ===== Request Summary ===== */
  const summaryLabel = document.createElement("label");
  summaryLabel.textContent = "Request Summary";

  const summaryInput = document.createElement("textarea");
  summaryInput.rows = 6;
  summaryInput.required = true;

  summaryLabel.appendChild(summaryInput);

  /* ===== Submit ===== */
  const submit = document.createElement("button");
  submit.type = "submit";
  submit.textContent = "Create Case";

  /* ===== Assemble ===== */
  form.appendChild(nameLabel);
  form.appendChild(summaryLabel);
  form.appendChild(submit);

  root.appendChild(h2);
  root.appendChild(p);
  root.appendChild(form);

  return root;
}
