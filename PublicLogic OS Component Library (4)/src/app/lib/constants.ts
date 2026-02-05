// Centralized status/stage definitions for Phillipston Governance OS

export const TASK_STATUS = ["Today", "This Week", "Backlog", "Blocked", "Done"] as const;
export const TASK_PRIORITY = ["P0", "P1", "P2"] as const;
export const TASK_AREA = ["Ops", "Sales", "Delivery", "Admin"] as const;

export const PIPELINE_STAGES = ["Lead", "Discovery", "Proposal", "Active", "Closed Won", "Closed Lost"] as const;

export const PROJECT_STATUS = ["Active", "Paused", "Complete"] as const;

export const PILL_VARIANTS: Record<string, string> = {
  // Tasks
  done: "mint",
  blocked: "rose",
  today: "gold",
  "this week": "blue",
  backlog: "slate",
  
  // Pipeline
  "closed won": "mint",
  "closed lost": "rose",
  proposal: "gold",
  discovery: "gold",
  active: "mint",
  lead: "slate",
  
  // Projects
  complete: "mint",
  paused: "gold"
};

export function getPillVariant(status: string) {
  const key = String(status || "").toLowerCase();
  return PILL_VARIANTS[key] || "slate";
}

export function compareByOrder(order: readonly string[]) {
  return (a: string, b: string) => {
    const ia = order.indexOf(a);
    const ib = order.indexOf(b);
    const ra = ia === -1 ? 999 : ia;
    const rb = ib === -1 ? 999 : ib;
    return ra - rb;
  };
}
