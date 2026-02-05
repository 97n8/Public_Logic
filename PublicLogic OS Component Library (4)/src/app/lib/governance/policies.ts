/**
 * Governance Policy Engine
 * Encapsulates M.G.L. c. 66 compliance logic and access rules.
 */
import { TOWN_CONFIG } from "../config/town-config";

export interface Actor {
  email: string;
  role?: string;
  authority?: "SelectBoard" | "TownClerk" | "TownAdmin" | "Staff";
}

export interface RecordState {
  id: string;
  type: string;
  lifecycleStage: string;
  isLocked: boolean;
  authority: string;
}

export function canCreateRecord(actor: Actor, recordType: string) {
  const isAuthorized = TOWN_CONFIG.auth.allowedDomains.some(d => actor.email.endsWith(d));
  
  if (!isAuthorized) {
    return { allowed: false, reason: "Actor outside authorized municipal domains." };
  }

  return { allowed: true, reason: "Authorized municipal staff." };
}

export function canModifyRecord(actor: Actor, record: RecordState) {
  if (record.isLocked) {
    return { allowed: false, reason: "Record is locked for compliance. Supersession required." };
  }

  // Town Clerk can modify most things for corrections
  if (actor.authority === "TownClerk") return { allowed: true };

  // Check lifecycle
  if (["Archived", "Superseded", "Approved"].includes(record.lifecycleStage)) {
    return { allowed: false, reason: `Modification barred in ${record.lifecycleStage} stage.` };
  }

  return { allowed: true };
}

/**
 * Calculates Public Records Request Deadline
 * Based on 10 business days (MA standard)
 */
export function calculatePRRDeadline(startDate: Date): Date {
  let count = 0;
  let current = new Date(startDate);
  
  while (count < TOWN_CONFIG.compliance.prrDeadlineDays) {
    current.setDate(current.getDate() + 1);
    const day = current.getDay();
    // Skip weekends
    if (day !== 0 && day !== 6) {
      count++;
    }
  }
  return current;
}
