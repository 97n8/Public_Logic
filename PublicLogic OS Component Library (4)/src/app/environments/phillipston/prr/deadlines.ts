import { addDays, isSaturday, isSunday } from "date-fns";

export function isBusinessDay(d: Date) {
  return !isSaturday(d) && !isSunday(d);
}

export function addBusinessDays(start: Date, businessDays: number) {
  if (businessDays < 0) throw new Error("businessDays must be >= 0");
  let current = new Date(start);
  let added = 0;
  while (added < businessDays) {
    current = addDays(current, 1);
    if (isBusinessDay(current)) added += 1;
  }
  return current;
}

/**
 * T10 deadline: 10 business days after receipt date.
 * NOTE: This ignores MA state holidays; add holiday calendar support in-house.
 */
export function computeT10(receiptDate: Date) {
  return addBusinessDays(receiptDate, 10);
}

