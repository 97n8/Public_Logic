import { savePrrSubmission } from "../../../lib/archieve.js";

export function StaffIntake({ cfg, auth, sp }) {
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
  nameInput.name = "name";
  nameInput.required = true;

  nameLabel.appendChild(nameInput);

  /* ===== Requester Email ===== */
  const emailLabel = document.createElement("label");
  emailLabel.textContent = "Requester Email";

  const emailInput = document.createElement("input");
  emailInput.name = "email";
  emailInput.type = "email";
  emailInput.required = true;

  emailLabel.appendChild(emailInput);

  /* ===== Phone (optional) ===== */
  const phoneLabel = document.createElement("label");
  phoneLabel.textContent = "Phone (optional)";

  const phoneInput = document.createElement("input");
  phoneInput.name = "phone";
  phoneInput.type = "tel";

  phoneLabel.appendChild(phoneInput);

  /* ===== Request Summary ===== */
  const summaryLabel = document.createElement("label");
  summaryLabel.textContent = "Records Requested";

  const summaryInput = document.createElement("textarea");
  summaryInput.name = "request";
  summaryInput.rows = 6;
  summaryInput.required = true;

  summaryLabel.appendChild(summaryInput);

  /* ===== Status message ===== */
  const statusEl = document.createElement("div");
  statusEl.style.marginTop = "12px";
  statusEl.style.fontWeight = "600";

  /* ===== Submit ===== */
  const submit = document.createElement("button");
  submit.type = "submit";
  submit.textContent = "Create Case";

  /* ===== Form handler ===== */
  form.onsubmit = async (e) => {
    e.preventDefault();
    submit.disabled = true;
    submit.textContent = "Saving...";
    statusEl.textContent = "";

    const formData = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      phone: phoneInput.value.trim(),
      request: summaryInput.value.trim()
    };

    try {
      const result = await savePrrSubmission(sp, cfg, formData);

      statusEl.style.color = "#10b981";
      statusEl.textContent = `✓ Case created: ${result.caseId}`;

      // Reset form
      form.reset();
      submit.disabled = false;
      submit.textContent = "Create Case";

    } catch (err) {
      console.error(err);
      statusEl.style.color = "#ef4444";
      statusEl.textContent = `Error: ${err.message}`;
      submit.disabled = false;
      submit.textContent = "Create Case";
    }
  };

  /* ===== Assemble ===== */
  form.appendChild(nameLabel);
  form.appendChild(emailLabel);
  form.appendChild(phoneLabel);
  form.appendChild(summaryLabel);
  form.appendChild(submit);
  form.appendChild(statusEl);

  root.appendChild(h2);
  root.appendChild(p);
  root.appendChild(form);

  return root;
}
