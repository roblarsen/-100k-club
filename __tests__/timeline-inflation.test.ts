/**
 * Unit tests for timeline/scripts/inflation.ts
 *
 * The inflation() function converts a dollar amount from a source year to a
 * target year using CPI data.
 */

import { inflation } from "../timeline/scripts/inflation";

// The "last full year" sentinel – inflation() returns the raw amount when the
// source year is after this value.
const CURRENT_LAST_FULL_YEAR = new Date().getFullYear() - 1;

describe("inflation", () => {
  // -------------------------------------------------------------------------
  // Happy-path calculations
  // -------------------------------------------------------------------------
  it("returns a number", () => {
    const result = inflation({ amount: 1000, year: 1960 });
    expect(typeof result).toBe("number");
  });

  it("adjusts 1960 dollars to be worth more in today's terms", () => {
    const result = inflation({ amount: 1000, year: 1960 });
    expect(result).toBeGreaterThan(1000);
  });

  it("is consistent: same from/to year returns the original amount", () => {
    // When from and to are the same year the CPI ratio is 1, so the
    // inflationFactor is 0 and the result equals the original amount.
    const result = inflation(
      { amount: 5000, year: 1980 },
      { year: 1980 }
    );
    expect(result).toBeCloseTo(5000, 0);
  });

  it("increases the value when adjusting forward in time", () => {
    const early = inflation({ amount: 1000, year: 1950 }, { year: 1980 });
    const late = inflation({ amount: 1000, year: 1950 }, { year: 2000 });
    expect(late).toBeGreaterThan(early);
  });

  it("returns a positive number for a valid input", () => {
    expect(inflation({ amount: 100000, year: 1938 })).toBeGreaterThan(0);
  });

  // -------------------------------------------------------------------------
  // Edge-case: source year is after lastFullYear
  // -------------------------------------------------------------------------
  it("returns the original amount unchanged when from.year > lastFullYear", () => {
    const futureYear = CURRENT_LAST_FULL_YEAR + 2;
    const result = inflation({ amount: 9999, year: futureYear });
    expect(result).toBe(9999);
  });

  // -------------------------------------------------------------------------
  // Optional month parameter
  // -------------------------------------------------------------------------
  it("accepts an optional month and returns a number", () => {
    const result = inflation({ amount: 1000, year: 1970, month: 6 });
    expect(typeof result).toBe("number");
    expect(result).toBeGreaterThan(0);
  });

  // -------------------------------------------------------------------------
  // Error cases
  // -------------------------------------------------------------------------
  it("throws when from.year is missing", () => {
    expect(() => inflation({ amount: 1000 } as any)).toThrow(
      "from.year must be provided"
    );
  });

  it("throws when from.amount is missing", () => {
    expect(() => inflation({ year: 1960 } as any)).toThrow(
      "from.amount must be provided"
    );
  });

  it("throws when from.year is not a number", () => {
    expect(() => inflation({ amount: 1000, year: "1960" } as any)).toThrow(
      "from.year must be a number"
    );
  });

  it("throws when from.year is before 1913", () => {
    expect(() => inflation({ amount: 1000, year: 1912 })).toThrow(
      "from.year must be 1913 or later"
    );
  });
});
