/**
 * Time and Date Utilities for Graph API
 */

export function toGraphDateTime(date: Date | string | number): string {
  const d = new Date(date);
  return d.toISOString();
}

export function fromGraphDateTime(iso: string): Date {
  return new Date(iso);
}

export function formatFriendlyDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString(undefined, { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
}
