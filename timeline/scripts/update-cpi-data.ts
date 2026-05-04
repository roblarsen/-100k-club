import fs from "node:fs";
import path from "node:path";
import { getAllCPIs } from "cpi-us";

type AllCpisShape = {
  firstYear: number;
  // rows: one per year, 12 entries per row (Jan..Dec), values are strings like "226.665"
  cpi: string[][];
};

type CpiJson = {
  _meta: { source: string; updatedAt: string };
  series: Record<string, number>;
};

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function mean(vals: number[]) {
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

function main() {
  const raw = getAllCPIs() as unknown as AllCpisShape;

  if (
    !raw ||
    typeof raw.firstYear !== "number" ||
    !Array.isArray(raw.cpi) ||
    raw.cpi.length === 0
  ) {
    throw new Error(
      "Unexpected shape from cpi-us getAllCPIs(); expected { firstYear: number, cpi: string[][] }"
    );
  }

  const series: Record<string, number> = {};

  raw.cpi.forEach((row, rowIndex) => {
    const year = raw.firstYear + rowIndex;

    if (!Array.isArray(row) || row.length === 0) {
      return; // skip completely empty rows
    }

    const months: number[] = [];

    for (let m = 1; m <= row.length; m++) {
      const v = Number(row[m - 1]);
      if (!Number.isFinite(v)) continue;

      series[`${year}-${pad2(m)}`] = v;
      months.push(v);
    }

    // Annual average: write whenever we have at least one month of data.
    // For complete years (12 months) this is the true annual average; for partial
    // years (e.g. the current calendar year where only a few months have been
    // published) it is the average of the available months, which is the best
    // approximation we can provide and prevents a "Missing CPI value" error at
    // runtime.
    if (months.length >= 1) {
      // Round to 1 decimal to align with typical CPI annual-average presentation,
      // without losing too much precision.
      const avg = Math.round(mean(months) * 10) / 10;
      series[`${year}-00`] = avg;
    }
  });

  // stable ordering
  const orderedKeys = Object.keys(series).sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  const ordered: Record<string, number> = {};
  for (const k of orderedKeys) ordered[k] = series[k];

  const out: CpiJson = {
    _meta: {
      source: "cpi-us (npm package)",
      updatedAt: new Date().toISOString(),
    },
    series: ordered,
  };

  const filePath = path.resolve(__dirname, "../data/cpi-us.json");
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(out, null, 2) + "\n", "utf8");

  const lastKey = orderedKeys.at(-1);
  console.log(`Wrote ${orderedKeys.length} CPI entries to ${filePath}`);
  if (lastKey) console.log(`Last entry: ${lastKey} = ${ordered[lastKey]}`);
}

main()