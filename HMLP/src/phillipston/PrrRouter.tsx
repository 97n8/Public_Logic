import { PrrRouter } from "./PrrRouter";

export function PhillipstonShell() {
  return (
    <div className="shell">
      <header className="shell__header">
        <div>
          <h1>Phillipston PRR</h1>
          <p>Staff Operations & Institutional Record</p>
        </div>
      </header>

      <main className="shell__main">
        <PrrRouter />
      </main>
    </div>
  );
}
