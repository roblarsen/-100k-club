import cpiData from "../data/cpi-us.json";

type InflationInput = {
  amount: number;
  year: number;
  month?: number; // 1-12, optional (if omitted, uses annual average)
};

type CpiJson = {
  _meta?: {
    source?: string;
    updatedAt?: string;
  };
  series: Record<string, number>;
};

const typedCpiData = cpiData as unknown as CpiJson;

/**
 * Last full year (e.g. on 2026-03-20 -> 2025)
 */
const lastFullYear = new Date().getFullYear() - 1;

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function getCpi(year: number, month?: number) {
  const key = month ? `${year}-${pad2(month)}` : `${year}-00`;
  const v = typedCpiData.series[key];
  if (typeof v !== "number") {
    throw new Error(`Missing CPI value for ${key}`);
  }
  return v;
}

export function inflation(initialFrom: InflationInput, initialTo?: Partial<InflationInput>) {
  const from = initialFrom || ({} as InflationInput);
  const to = (initialTo || { year: lastFullYear }) as Partial<InflationInput>;

  if (!from.year) throw new Error("from.year must be provided");
  if (!from.amount) throw new Error("from.amount must be provided");
  if (typeof from.year !== "number") throw new Error("from.year must be a number, like 1922");
  if (from.year < 1913) throw new Error("from.year must be 1913 or later");

  // match your existing behavior: if from is after lastFullYear, don't adjust
  if (from.year > lastFullYear) return from.amount;

  const fromCpi = getCpi(from.year, from.month);
  const toYear = typeof to.year === "number" ? to.year : lastFullYear;
  const toCpi = getCpi(toYear, to.month);

  const inflationFactor = (toCpi - fromCpi) / fromCpi;
  const inflationValue = inflationFactor * from.amount;
  const currentValue: number = inflationValue + from.amount;

  return +currentValue;
}