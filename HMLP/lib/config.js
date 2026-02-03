// lib/constants.js
// Centralized status/stage definitions

export const TASK_STATUS = ["Today", "This Week", "Backlog", "Blocked", "Done"];
export const TASK_PRIORITY = ["P0", "P1", "P2"];
export const TASK_AREA = ["Ops", "Sales", "Delivery", "Admin"];

export const PIPELINE_STAGES = ["Lead", "Discovery", "Proposal", "Active", "Closed Won", "Closed Lost"];

export const PROJECT_STATUS = ["Active", "Paused", "Complete"];

export const PILL_VARIANTS = {
  // Tasks
  done: "mint",
  blocked: "rose",
  today: "gold",
  "this week": "",
  backlog: "",
  
  // Pipeline
  "closed won": "mint",
  "closed lost": "rose",
  proposal: "gold",
  discovery: "gold",
  active: "mint",
  lead: "",
  
  // Projects
  complete: "mint",
  paused: "gold"
};

export function getPillVariant(status) {
  const key = String(status || "").toLowerCase();
  return PILL_VARIANTS[key] || "";
}

export function compareByOrder(order) {
  return (a, b) => {
    const ia = order.indexOf(a);
    const ib = order.indexOf(b);
    const ra = ia === -1 ? 999 : ia;
    const rb = ib === -1 ? 999 : ib;
    return ra - rb;
  };
}
