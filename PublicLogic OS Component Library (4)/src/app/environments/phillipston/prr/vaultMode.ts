export type VaultMode = "test" | "prod";

const KEY = "publiclogic:vaultMode";

export function getVaultMode(): VaultMode {
  if (typeof window === "undefined") return "test";
  const raw = window.localStorage.getItem(KEY);
  if (raw === "prod" || raw === "test") return raw;
  // Default to TEST for safety until explicitly switched.
  return "test";
}

export function setVaultMode(mode: VaultMode) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, mode);
}

