/**
 * Integration tests for crud-webapp/server.js
 *
 * Uses supertest to exercise each Express route.  The fs.promises module is
 * mocked so no real files are read or written during the test run.
 */

import request from "supertest";
import path from "path";

// ---------------------------------------------------------------------------
// Sample fixture data
// ---------------------------------------------------------------------------
const sampleBooks = {
  books: [
    {
      id: "0001",
      title: "Action Comics",
      issue: "1",
      sales: [{ price: 1500000, salesDate: "2010-03-29", venue: "heritage" }],
    },
    {
      id: "0002",
      title: "Detective Comics",
      issue: "27",
      sales: [],
    },
  ],
};

const sampleRecords = {
  sales: [
    {
      title: "Action Comics",
      issue: "1",
      grade: "9.0",
      price: 15000000,
      date: "2026-01-09",
      seller: "ComicConnect",
    },
  ],
};

const sampleSaPedigrees = {
  books: [
    { title: "Amazing Fantasy", issue: "15", ba: "9.4" },
    { title: "Fantastic Four", issue: "1", pc: "8.5" },
  ],
};

// ---------------------------------------------------------------------------
// Mock fs.promises before requiring the server
// ---------------------------------------------------------------------------

// We keep a mutable reference so individual tests can override it.
let mockBooksData = JSON.parse(JSON.stringify(sampleBooks));
let mockRecordsData = JSON.parse(JSON.stringify(sampleRecords));
let mockSaPedigreesData = JSON.parse(JSON.stringify(sampleSaPedigrees));

jest.mock("fs", () => {
  const actual = jest.requireActual("fs");
  return {
    ...actual,
    promises: {
      readFile: jest.fn(async (filePath: string) => {
        const base = path.basename(filePath as string);
        if (base === "books.dev.json") {
          return JSON.stringify(mockBooksData);
        }
        if (base === "records.json") {
          return JSON.stringify(mockRecordsData);
        }
        if (base === "sa-pedigrees.dev.json") {
          return JSON.stringify(mockSaPedigreesData);
        }
        throw new Error(`Unexpected readFile path: ${filePath}`);
      }),
      writeFile: jest.fn(async () => undefined),
    },
  };
});

// Require after mock is established
// eslint-disable-next-line @typescript-eslint/no-var-requires
const app = require("../crud-webapp/server");

// ---------------------------------------------------------------------------
// Reset data & mocks before each test
// ---------------------------------------------------------------------------
beforeEach(() => {
  mockBooksData = JSON.parse(JSON.stringify(sampleBooks));
  mockRecordsData = JSON.parse(JSON.stringify(sampleRecords));
  mockSaPedigreesData = JSON.parse(JSON.stringify(sampleSaPedigrees));
  jest.clearAllMocks();
});

// ---------------------------------------------------------------------------
// Books – basic CRUD
// ---------------------------------------------------------------------------
describe("GET /api/books", () => {
  it("returns 200 with the books payload", async () => {
    const res = await request(app).get("/api/books");
    expect(res.status).toBe(200);
    expect(res.body.books).toHaveLength(2);
  });
});

describe("GET /api/books/:id", () => {
  it("returns 200 with the matching book", async () => {
    const res = await request(app).get("/api/books/0001");
    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Action Comics");
  });

  it("returns 404 when the book does not exist", async () => {
    const res = await request(app).get("/api/books/9999");
    expect(res.status).toBe(404);
    expect(res.body.error).toBeDefined();
  });
});

describe("POST /api/books", () => {
  it("creates a new book and returns 201", async () => {
    const newBook = { title: "Superman", issue: "1" };
    const res = await request(app).post("/api/books").send(newBook);
    expect(res.status).toBe(201);
    expect(res.body.title).toBe("Superman");
    expect(res.body.id).toBeDefined();
  });

  it("auto-generates an id that is one greater than the current max", async () => {
    const res = await request(app)
      .post("/api/books")
      .send({ title: "New Book", issue: "5" });
    // sampleBooks has ids 0001 and 0002, so the next should be 0003
    expect(res.body.id).toBe("0003");
  });
});

describe("PUT /api/books/:id", () => {
  it("updates an existing book and returns 200", async () => {
    const res = await request(app)
      .put("/api/books/0001")
      .send({ grade: "9.8" });
    expect(res.status).toBe(200);
    expect(res.body.grade).toBe("9.8");
    expect(res.body.title).toBe("Action Comics"); // unchanged field preserved
  });

  it("returns 404 for a non-existent book", async () => {
    const res = await request(app).put("/api/books/9999").send({ grade: "9.8" });
    expect(res.status).toBe(404);
  });
});

describe("DELETE /api/books/:id", () => {
  it("deletes a book and returns 204", async () => {
    const res = await request(app).delete("/api/books/0001");
    expect(res.status).toBe(204);
  });

  it("returns 404 when deleting a non-existent book", async () => {
    const res = await request(app).delete("/api/books/9999");
    expect(res.status).toBe(404);
  });
});

// ---------------------------------------------------------------------------
// Book sales
// ---------------------------------------------------------------------------
describe("GET /api/books/:id/sales", () => {
  it("returns the sales array for a book", async () => {
    const res = await request(app).get("/api/books/0001/sales");
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });

  it("returns an empty array when the book has no sales", async () => {
    const res = await request(app).get("/api/books/0002/sales");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("returns 404 when the book does not exist", async () => {
    const res = await request(app).get("/api/books/9999/sales");
    expect(res.status).toBe(404);
  });
});

describe("POST /api/books/:id/sales", () => {
  it("adds a sale to a book and returns 201", async () => {
    const sale = { price: 200000, salesDate: "2023-06-01", venue: "ebay" };
    const res = await request(app).post("/api/books/0002/sales").send(sale);
    expect(res.status).toBe(201);
    expect(res.body.price).toBe(200000);
  });
});

describe("PUT /api/books/:id/sales/:saleIndex", () => {
  it("updates an existing sale", async () => {
    const res = await request(app)
      .put("/api/books/0001/sales/0")
      .send({ price: 2000000 });
    expect(res.status).toBe(200);
    expect(res.body.price).toBe(2000000);
  });

  it("returns 404 for an out-of-range saleIndex", async () => {
    const res = await request(app)
      .put("/api/books/0001/sales/99")
      .send({ price: 1 });
    expect(res.status).toBe(404);
  });
});

describe("DELETE /api/books/:id/sales/:saleIndex", () => {
  it("deletes a sale and returns 204", async () => {
    const res = await request(app).delete("/api/books/0001/sales/0");
    expect(res.status).toBe(204);
  });

  it("returns 404 for an out-of-range saleIndex", async () => {
    const res = await request(app).delete("/api/books/0001/sales/99");
    expect(res.status).toBe(404);
  });
});

// ---------------------------------------------------------------------------
// Records
// ---------------------------------------------------------------------------
describe("GET /api/records", () => {
  it("returns 200 with the records payload", async () => {
    const res = await request(app).get("/api/records");
    expect(res.status).toBe(200);
    expect(res.body.sales).toHaveLength(1);
  });
});

describe("POST /api/records", () => {
  it("adds a record and returns 201", async () => {
    const rec = { title: "Superman", issue: "1", price: 5000000 };
    const res = await request(app).post("/api/records").send(rec);
    expect(res.status).toBe(201);
    expect(res.body.title).toBe("Superman");
  });
});

describe("PUT /api/records/:index", () => {
  it("updates a record and returns 200", async () => {
    const res = await request(app).put("/api/records/0").send({ price: 9999 });
    expect(res.status).toBe(200);
    expect(res.body.price).toBe(9999);
  });

  it("returns 404 for an out-of-range index", async () => {
    const res = await request(app).put("/api/records/99").send({ price: 1 });
    expect(res.status).toBe(404);
  });
});

describe("DELETE /api/records/:index", () => {
  it("deletes a record and returns 204", async () => {
    const res = await request(app).delete("/api/records/0");
    expect(res.status).toBe(204);
  });

  it("returns 404 for an out-of-range index", async () => {
    const res = await request(app).delete("/api/records/99");
    expect(res.status).toBe(404);
  });
});

// ---------------------------------------------------------------------------
// SA Pedigrees
// ---------------------------------------------------------------------------
describe("GET /api/sa-pedigrees", () => {
  it("returns 200 with the SA pedigrees payload", async () => {
    const res = await request(app).get("/api/sa-pedigrees");
    expect(res.status).toBe(200);
    expect(res.body.books).toHaveLength(2);
  });
});

describe("POST /api/sa-pedigrees/books", () => {
  it("adds a pedigree book and returns 201", async () => {
    const book = { title: "X-Men", issue: "1", nor: "9.6" };
    const res = await request(app).post("/api/sa-pedigrees/books").send(book);
    expect(res.status).toBe(201);
    expect(res.body.title).toBe("X-Men");
  });
});

describe("PUT /api/sa-pedigrees/books/:index", () => {
  it("updates a pedigree book and returns 200", async () => {
    const res = await request(app)
      .put("/api/sa-pedigrees/books/0")
      .send({ ba: "9.8" });
    expect(res.status).toBe(200);
    expect(res.body.ba).toBe("9.8");
  });

  it("returns 404 for out-of-range index", async () => {
    const res = await request(app)
      .put("/api/sa-pedigrees/books/99")
      .send({ ba: "9.8" });
    expect(res.status).toBe(404);
  });
});

describe("DELETE /api/sa-pedigrees/books/:index", () => {
  it("deletes a pedigree book and returns 204", async () => {
    const res = await request(app).delete("/api/sa-pedigrees/books/0");
    expect(res.status).toBe(204);
  });

  it("returns 404 for out-of-range index", async () => {
    const res = await request(app).delete("/api/sa-pedigrees/books/99");
    expect(res.status).toBe(404);
  });
});
