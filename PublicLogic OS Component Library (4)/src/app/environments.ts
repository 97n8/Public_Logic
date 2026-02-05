export type EnvironmentId = "publiclogic" | "princeton" | "phillipston";

export type Environment = {
  id: EnvironmentId;
  name: string;
  description: string;
};

export const ENVIRONMENTS: Environment[] = [
  {
    id: "publiclogic",
    name: "PublicLogic",
    description: "Front door and shared modules (M365-connected).",
  },
  {
    id: "princeton",
    name: "Princeton",
    description: "Case Space + PRR module (in-house, M365-connected).",
  },
  {
    id: "phillipston",
    name: "Phillipston",
    description: "Legacy demo screens (kept for reference).",
  },
];

export function getEnvironment(id: string | undefined) {
  return ENVIRONMENTS.find((e) => e.id === id) ?? null;
}
