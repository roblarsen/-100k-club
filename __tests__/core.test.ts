/**
 * Unit tests for the shared core utilities used across all applications.
 */

import { formatCurrency } from "../core/formatCurrency";
import { getVenueName } from "../core/getVenueName";
import { dateFormatter } from "../core/dateFormatter";
import { venues } from "../core/venues";

// ---------------------------------------------------------------------------
// formatCurrency
// ---------------------------------------------------------------------------
describe("formatCurrency", () => {
  it("formats a whole number as USD by default", () => {
    expect(formatCurrency(100000)).toBe("$100,000.00");
  });

  it("formats cents correctly", () => {
    expect(formatCurrency(1234.56)).toBe("$1,234.56");
  });

  it("formats zero", () => {
    expect(formatCurrency(0)).toBe("$0.00");
  });

  it("respects a custom locale", () => {
    // Just verify it doesn't throw and returns a string
    const result = formatCurrency(1000, "de-DE", "EUR");
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// getVenueName
// ---------------------------------------------------------------------------
describe("getVenueName", () => {
  it("returns the human-readable name for a known venue", () => {
    expect(getVenueName("heritage")).toBe("Heritage");
  });

  it("returns the human-readable name for comicconnect", () => {
    expect(getVenueName("comicconnect")).toBe("ComicConnect");
  });

  it("returns the human-readable name for ebay", () => {
    expect(getVenueName("ebay")).toBe("eBay");
  });

  it("returns 'Unknown Venue' for an unrecognised venue key", () => {
    expect(getVenueName("nope")).toBe("Unknown Venue");
  });

  it("returns 'Unknown Venue' for an empty string", () => {
    expect(getVenueName("")).toBe("Unknown Venue");
  });
});

// ---------------------------------------------------------------------------
// dateFormatter
// ---------------------------------------------------------------------------
describe("dateFormatter", () => {
  it("formats a valid UTC date in US English", () => {
    const d = new Date("2022-03-15");
    const result = dateFormatter(d);
    expect(result).toContain("2022");
    expect(result).toContain("Mar");
  });

  it("returns 'Unknown Date' for the string 'Invalid Date'", () => {
    expect(dateFormatter("Invalid Date" as any)).toBe("Unknown Date");
  });

  it("returns a non-empty string for a valid date", () => {
    const result = dateFormatter(new Date("2010-01-01"));
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// venues
// ---------------------------------------------------------------------------
describe("venues", () => {
  const expectedKeys = [
    "heritage",
    "privatesale",
    "comicconnect",
    "ebay",
    "comiclink",
    "goldinauctions",
    "unknown",
    "metropolis",
    "hakes",
    "pedigreecomics",
  ];

  it.each(expectedKeys)("has a non-empty entry for '%s'", (key) => {
    expect(typeof venues[key]).toBe("string");
    expect(venues[key].length).toBeGreaterThan(0);
  });

  it("has no empty string values", () => {
    Object.values(venues).forEach((v) => {
      expect(v.length).toBeGreaterThan(0);
    });
  });
});
