import { CaseSchema, type VaultPrrCase } from "./vaultprr";

const KEY = "publiclogic:phillipston:prr:cases";

export function loadCases(): VaultPrrCase[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((c) => {
        const result = CaseSchema.safeParse(c);
        return result.success ? result.data : null;
      })
      .filter(Boolean) as VaultPrrCase[];
  } catch {
    return [];
  }
}

export function saveCase(nextCase: VaultPrrCase) {
  const cases = loadCases();
  const updated = [nextCase, ...cases.filter((c) => c.caseId !== nextCase.caseId)];
  localStorage.setItem(KEY, JSON.stringify(updated));
}

