/**
 * Unit tests for record-sales/scripts/saleList.ts
 *
 * saleList() flattens a list of Comics into a sorted array of RecordSale
 * objects, keeping only individual sales with price >= $100,000.
 */

import { saleList } from "../record-sales/scripts/saleList";
import { RecordSale } from "../core/RecordSale";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function makeBook(overrides: Record<string, unknown> = {}) {
  return {
    title: "Action Comics",
    issue: "1",
    pedigree: "Church",
    gradeSrc: "CGC",
    grade: "9.0",
    sales: [],
    ...overrides,
  };
}

function makeSale(price: number, overrides: Record<string, unknown> = {}) {
  return { price, salesDate: "2020-01-01", venue: "heritage", ...overrides };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe("saleList", () => {
  it("returns an empty array when no books have sales", () => {
    const result = saleList([makeBook()]);
    expect(result).toEqual([]);
  });

  it("excludes sales below $100,000", () => {
    const book = makeBook({ sales: [makeSale(99999)] });
    expect(saleList([book])).toHaveLength(0);
  });

  it("excludes sales equal to exactly $99,999", () => {
    const book = makeBook({ sales: [makeSale(99999)] });
    expect(saleList([book])).toHaveLength(0);
  });

  it("includes sales of exactly $100,000", () => {
    const book = makeBook({ sales: [makeSale(100000)] });
    expect(saleList([book])).toHaveLength(1);
  });

  it("includes sales above $100,000", () => {
    const book = makeBook({ sales: [makeSale(500000)] });
    expect(saleList([book])).toHaveLength(1);
  });

  it("returns RecordSale instances", () => {
    const book = makeBook({ sales: [makeSale(150000)] });
    const [sale] = saleList([book]);
    expect(sale).toBeInstanceOf(RecordSale);
  });

  it("maps book fields onto the RecordSale correctly", () => {
    const book = makeBook({
      title: "Detective Comics",
      issue: "27",
      pedigree: "Edgar Church",
      gradeSrc: "cgc",
      grade: "9.4",
      sales: [makeSale(200000, { salesDate: "2021-05-10", venue: "heritage" })],
    });
    const [sale] = saleList([book]);
    expect(sale.title).toBe("Detective Comics");
    expect(sale.issue).toBe("27");
    expect(sale.pedigree).toBe("Edgar Church");
    expect(sale.gradeSrc).toBe("CGC"); // uppercased
    expect(sale.grade).toBe("9.4");
    expect(sale.price).toBe(200000);
    expect(sale.salesDate).toBe("2021-05-10");
    expect(sale.venue).toBe("heritage");
  });

  it("treats undefined pedigree as empty string", () => {
    const book = makeBook({ pedigree: undefined, sales: [makeSale(100000)] });
    const [sale] = saleList([book]);
    expect(sale.pedigree).toBe("");
  });

  it("treats undefined gradeSrc as empty string", () => {
    const book = makeBook({ gradeSrc: undefined, sales: [makeSale(100000)] });
    const [sale] = saleList([book]);
    expect(sale.gradeSrc).toBe("");
  });

  it("treats undefined grade as empty string", () => {
    const book = makeBook({ grade: undefined, sales: [makeSale(100000)] });
    const [sale] = saleList([book]);
    expect(sale.grade).toBe("");
  });

  it("sorts results by price descending", () => {
    const book = makeBook({
      sales: [makeSale(100000), makeSale(500000), makeSale(200000)],
    });
    const prices = saleList([book]).map((s) => s.price);
    expect(prices).toEqual([500000, 200000, 100000]);
  });

  it("aggregates sales across multiple books", () => {
    const books = [
      makeBook({ title: "A", sales: [makeSale(100000)] }),
      makeBook({ title: "B", sales: [makeSale(200000)] }),
    ];
    expect(saleList(books)).toHaveLength(2);
  });

  it("skips books with no sales array entries", () => {
    const book = makeBook({ sales: [] });
    expect(saleList([book])).toHaveLength(0);
  });
});
