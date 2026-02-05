import { describe, expect, it } from "vitest";
import { addBusinessDays, computeT10, isBusinessDay } from "./deadlines";

describe("deadlines", () => {
  it("treats weekends as non-business days", () => {
    expect(isBusinessDay(new Date("2026-02-07T12:00:00Z"))).toBe(false); // Sat
    expect(isBusinessDay(new Date("2026-02-08T12:00:00Z"))).toBe(false); // Sun
    expect(isBusinessDay(new Date("2026-02-09T12:00:00Z"))).toBe(true); // Mon
  });

  it("adds business days skipping weekends", () => {
    // Fri + 1 business day => Mon
    const result = addBusinessDays(new Date("2026-02-06T12:00:00Z"), 1);
    expect(result.toISOString().slice(0, 10)).toBe("2026-02-09");
  });

  it("computes T10 as 10 business days after receipt", () => {
    const t10 = computeT10(new Date("2026-02-02T12:00:00Z")); // Mon
    // 10 business days later => Mon 2026-02-16
    expect(t10.toISOString().slice(0, 10)).toBe("2026-02-16");
  });
});
