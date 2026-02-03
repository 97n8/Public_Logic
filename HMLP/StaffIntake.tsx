export function StaffIntake() {
  return (
    <div className="staff-intake">
      <h2>Staff PRR Intake</h2>
      <p>
        Use this form when requests arrive by email, phone, or walk-in.
      </p>

      <form className="intake-form">
        <label>
          Requester Name
          <input required />
        </label>

        <label>
          Request Summary
          <textarea rows={6} required />
        </label>

        <button type="submit">Create Case</button>
      </form>
    </div>
  );
}
