import { PhillipstonShell } from "./PhillipstonShell";

type PhillipstonAppProps = {
  cfg: any;
  auth: any;
  sp: any;
};

export function PhillipstonApp({ cfg, auth, sp }: PhillipstonAppProps) {
  // Hard internal gate (defense in depth)
  if (!auth?.hasRole?.("phillipston_internal")) {
    return (
      <div style={{ padding: "2rem" }}>
        <h2>Access denied</h2>
        <p>Phillipston internal access only.</p>
      </div>
    );
  }

  return <PhillipstonShell cfg={cfg} auth={auth} sp={sp} />;
}
