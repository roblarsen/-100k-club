import * as d3 from "d3";
import moment from "moment";
import * as data from "../../data/data/records.json";

// ── Dimensions ────────────────────────────────────────────────────────────────
// Wider canvas + larger right margin to accommodate labels near the chart edge.
const margin = { top: 160, right: 650, bottom: 120, left: 180 };
const width  = 5600;
const height = 4200;
const innerW  = width  - margin.left - margin.right; // 4770
const innerH  = height - margin.top  - margin.bottom; // 3920

// ── Interfaces ────────────────────────────────────────────────────────────────

/**
 * Optional per-record label override.  Add this object to any sale entry in
 * records.json to pin its label at an explicit position:
 *
 *   "labelOverride": { "dx": -500, "dy": -60 }
 *
 * dx / dy are pixel offsets from the dot centre to the label box top-left.
 * "side" is auto-detected from the offset direction but can be supplied
 * explicitly ("left" | "right" | "above" | "below") to control which edge of
 * the dot the leader line attaches to.
 */
interface LabelOverride {
  dx: number;
  dy: number;
  side?: "above" | "below" | "left" | "right";
}

interface Sale {
  title: string;
  issue: string;
  grade: string;
  buyer: string;
  note: string;
  date: Date | null;
  seller: string;
  price: number;
  goodDate: boolean;
  labelOverride?: LabelOverride;
}

// ── Data ──────────────────────────────────────────────────────────────────────
const parseTime = d3.timeParse("%Y-%m-%d");

const sales: Sale[] = (data.sales as any[])
  .map((d) => ({
    ...d,
    date: parseTime(d.date),
    price: +d.price,
  }))
  .filter((d) => d.date !== null)
  .sort((a, b) => (a.date as Date).getTime() - (b.date as Date).getTime());

// ── Scales ────────────────────────────────────────────────────────────────────
const lastSaleDate = d3.max(sales, (d) => d.date as Date) as Date;
// Extend X domain 2 years past the last sale for breathing room at the right edge.
const domainEnd = moment(lastSaleDate).add(2, "years").startOf("year").toDate();

const x = d3
  .scaleTime()
  .domain([
    d3.min(sales, (d) => moment(d.date).startOf("year").toDate()) as Date,
    domainEnd,
  ])
  .rangeRound([0, innerW]);

const maxPrice = d3.max(sales, (d) => d.price) as number;

// Log scale handles the 4-order-of-magnitude range ($250 → $15M) gracefully.
const y = d3
  .scaleLog()
  .domain([100, maxPrice * 1.4])
  .rangeRound([innerH, 0])
  .clamp(true);

// ── SVG ───────────────────────────────────────────────────────────────────────
const svg = d3
  .select("#viz")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .style("background", "#fff");

const defs = svg.append("defs");

defs
  .append("filter")
  .attr("id", "sketchy")
  .attr("x", "-5%")
  .attr("y", "-5%")
  .attr("width", "110%")
  .attr("height", "110%")
  .html(`
    <feTurbulence type="fractalNoise" baseFrequency="0.025 0.030"
      numOctaves="4" seed="2" result="noise"/>
    <feDisplacementMap in="SourceGraphic" in2="noise"
      scale="7" xChannelSelector="R" yChannelSelector="G"/>
  `);

// Slightly stronger filter for the main price line.
defs
  .append("filter")
  .attr("id", "sketchy-line")
  .attr("x", "-5%")
  .attr("y", "-5%")
  .attr("width", "110%")
  .attr("height", "110%")
  .html(`
    <feTurbulence type="fractalNoise" baseFrequency="0.030 0.040"
      numOctaves="4" seed="7" result="noise"/>
    <feDisplacementMap in="SourceGraphic" in2="noise"
      scale="9" xChannelSelector="R" yChannelSelector="G"/>
  `);

const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

// ── Grid ──────────────────────────────────────────────────────────────────────
const logGridValues = [
  100, 500, 1000, 5000, 10000, 50000, 100000, 500000, 1000000, 5000000,
  10000000, 20000000,
];
const yGridTicks = logGridValues.filter((v) => v >= 100 && v <= maxPrice * 1.4);

g.append("g")
  .attr("class", "grid")
  .selectAll("line.grid-h")
  .data(yGridTicks)
  .enter()
  .append("line")
  .attr("x1", 0)
  .attr("x2", innerW)
  .attr("y1", (d) => y(d))
  .attr("y2", (d) => y(d))
  .attr("stroke", "#ccc")
  .attr("stroke-width", 1)
  .attr("stroke-dasharray", "8 5")
  .attr("filter", "url(#sketchy)");

const totalYears = moment(domainEnd).diff(moment(x.domain()[0]), "years");
const xTicks = x.ticks(totalYears);

g.append("g")
  .attr("class", "grid")
  .selectAll("line.grid-v")
  .data(xTicks)
  .enter()
  .append("line")
  .attr("x1", (d) => x(d))
  .attr("x2", (d) => x(d))
  .attr("y1", 0)
  .attr("y2", innerH)
  .attr("stroke", "#eee")
  .attr("stroke-width", 1)
  .attr("stroke-dasharray", "6 4")
  .attr("filter", "url(#sketchy)");

// ── Axes ──────────────────────────────────────────────────────────────────────
g.append("g")
  .attr("class", "axis")
  .call(
    d3
      .axisLeft(y)
      .tickValues([
        100, 500, 1000, 5000, 10000, 50000, 100000, 500000, 1000000, 5000000,
        10000000, 20000000,
      ])
      .tickSize(-innerW)
      .tickFormat((d) => {
        const v = +d;
        if (v >= 1_000_000) return "$" + v / 1_000_000 + "M";
        if (v >= 1_000) return "$" + v / 1_000 + "K";
        return "$" + v;
      })
  )
  .call((ax) => ax.select(".domain").attr("stroke-width", 3))
  .call((ax) => ax.selectAll(".tick line").attr("stroke", "none"))
  .call((ax) =>
    ax
      .selectAll(".tick text")
      .style("font-family", "'Bangers', cursive")
      .style("font-size", "24px")
      .style("fill", "#000")
  )
  .attr("filter", "url(#sketchy)");

g.append("g")
  .attr("class", "axis")
  .attr("transform", `translate(0,${innerH})`)
  .call(
    d3
      .axisBottom(x)
      .ticks(totalYears)
      .tickSize(10)
      .tickPadding(12)
      .tickFormat(d3.timeFormat("%Y") as any)
  )
  .call((ax) => ax.select(".domain").attr("stroke-width", 3))
  .call((ax) =>
    ax
      .selectAll(".tick text")
      .style("font-family", "'Bangers', cursive")
      .style("font-size", "22px")
      .style("fill", "#000")
  )
  .attr("filter", "url(#sketchy)");

// ── Axis & chart labels ───────────────────────────────────────────────────────
g.append("text")
  .attr("transform", "rotate(-90)")
  .attr("x", -innerH / 2)
  .attr("y", -130)
  .attr("text-anchor", "middle")
  .style("font-family", "'Bangers', cursive")
  .style("font-size", "32px")
  .style("letter-spacing", "3px")
  .style("fill", "#000")
  .text("SALE PRICE (USD)");

g.append("text")
  .attr("transform", "rotate(-90)")
  .attr("x", -innerH / 2)
  .attr("y", -95)
  .attr("text-anchor", "middle")
  .style("font-family", "'Bangers', cursive")
  .style("font-size", "20px")
  .style("letter-spacing", "1px")
  .style("fill", "#555")
  .text("(logarithmic scale)");

g.append("text")
  .attr("x", innerW / 2)
  .attr("y", innerH + 90)
  .attr("text-anchor", "middle")
  .style("font-family", "'Bangers', cursive")
  .style("font-size", "32px")
  .style("letter-spacing", "3px")
  .style("fill", "#000")
  .text("YEAR OF SALE");

svg
  .append("text")
  .attr("x", width / 2)
  .attr("y", 90)
  .attr("text-anchor", "middle")
  .style("font-family", "'Bangers', cursive")
  .style("font-size", "64px")
  .style("letter-spacing", "6px")
  .style("fill", "#000")
  .text("THE $100K CLUB — RECORD COMIC BOOK SALES");

// ── Price line ────────────────────────────────────────────────────────────────
const line = d3
  .line<Sale>()
  .x((d) => x(d.date as Date))
  .y((d) => y(d.price))
  .curve(d3.curveCatmullRom.alpha(0.5));

g.append("path")
  .datum(sales)
  .attr("fill", "none")
  .attr("stroke", "#000")
  .attr("stroke-width", 3.5)
  .attr("stroke-linecap", "round")
  .attr("stroke-linejoin", "round")
  .attr("d", line)
  .attr("filter", "url(#sketchy-line)");

// ── Label placement engine ────────────────────────────────────────────────────
const labelWidth  = 370;
const labelHeight = 108;
const labelPad    = 14;
const dotR        = 11;
// Minimum clearance (px) between a label box edge and the price line.
const LINE_MARGIN = 22;
// Extra padding (px) around each dot when testing whether a label covers it.
const DOT_CLEARANCE = dotR + 4;
// Inter-label padding (px) used in the placed-box overlap test.
const LABEL_SPACING = 18;
// Gap multipliers tried in order — each run of 12 candidates uses the same gap.
// Values chosen so the jumps cover ~doubling increments of separation distance.
const PLACEMENT_GAPS = [80, 130, 200, 290, 400, 540];
// Fallback horizontal offset when the algorithm cannot find any valid candidate.
const FALLBACK_GAP_LEFT  = 660; // offset from dot when label goes left
const FALLBACK_GAP_RIGHT =  80; // offset from dot when label goes right

// Precompute all dot positions (used for collision checks before circles are drawn).
const dotPositions = sales.map((d) => ({
  cx: x(d.date as Date),
  cy: y(d.price),
}));

// Sample the price line (straight-segment approximation of the Catmull-Rom
// curve) to power the line-passthrough collision check.
// At ~32 data points the total sample count stays well below 1 000, so a
// simple linear scan in linePassesThrough() is perfectly sufficient.
const lineSamples: Array<{ x: number; y: number }> = [];
for (let i = 0; i < sales.length - 1; i++) {
  const { cx: x0, cy: y0 } = dotPositions[i];
  const { cx: x1, cy: y1 } = dotPositions[i + 1];
  const steps = Math.max(6, Math.ceil(Math.hypot(x1 - x0, y1 - y0) / 15));
  for (let t = 0; t <= steps; t++) {
    lineSamples.push({ x: x0 + (x1 - x0) * (t / steps), y: y0 + (y1 - y0) * (t / steps) });
  }
}

// Registry of placed label bounding boxes (g-local coordinates).
const placed: Array<{ x: number; y: number; w: number; h: number }> = [];

function labelBoxOverlaps(r: { x: number; y: number; w: number; h: number }): boolean {
  // O(n) scan over placed boxes — perfectly fast at the dataset sizes used here.
  return placed.some(
    (p) =>
      r.x     < p.x + p.w + LABEL_SPACING &&
      r.x + r.w + LABEL_SPACING > p.x     &&
      r.y     < p.y + p.h + LABEL_SPACING &&
      r.y + r.h + LABEL_SPACING > p.y
  );
}

// Ensure no label rectangle covers any data-point dot.
function coversDot(r: { x: number; y: number; w: number; h: number }): boolean {
  return dotPositions.some(
    (p) =>
      p.cx >= r.x - DOT_CLEARANCE && p.cx <= r.x + r.w + DOT_CLEARANCE &&
      p.cy >= r.y - DOT_CLEARANCE && p.cy <= r.y + r.h + DOT_CLEARANCE
  );
}

// Ensure the price line does not visually pass through the label box.
function linePassesThrough(r: { x: number; y: number; w: number; h: number }): boolean {
  const x1 = r.x - LINE_MARGIN, x2 = r.x + r.w + LINE_MARGIN;
  const y1 = r.y - LINE_MARGIN, y2 = r.y + r.h + LINE_MARGIN;
  return lineSamples.some((pt) => pt.x >= x1 && pt.x <= x2 && pt.y >= y1 && pt.y <= y2);
}

function inBounds(lx: number, ly: number): boolean {
  return (
    lx >= -(margin.left - 10) &&
    lx + labelWidth  <= innerW + margin.right - 10 &&
    ly >= -(margin.top - 10) &&
    ly + labelHeight <= innerH + margin.bottom - 10
  );
}

function isValid(lx: number, ly: number): boolean {
  const r = { x: lx, y: ly, w: labelWidth, h: labelHeight };
  return inBounds(lx, ly) && !labelBoxOverlaps(r) && !coversDot(r) && !linePassesThrough(r);
}

type Side = "right" | "left" | "above" | "below";
interface Placement { lx: number; ly: number; side: Side; }

// Auto-detect which side of the dot the leader line should attach to.
function autoSide(cx: number, cy: number, lx: number, ly: number): Side {
  const lcx = lx + labelWidth  / 2;
  const lcy = ly + labelHeight / 2;
  const adx = Math.abs(lcx - cx);
  const ady = Math.abs(lcy - cy);
  if (adx >= ady) return lcx > cx ? "right" : "left";
  return lcy > cy ? "below" : "above";
}

function placeLabel(
  cx: number,
  cy: number,
  index: number,
  override?: LabelOverride
): Placement {
  // Manual override always wins — the author has hand-tuned this label.
  if (override) {
    const lx   = cx + override.dx;
    const ly   = cy + override.dy;
    const side = override.side ?? autoSide(cx, cy, lx, ly);
    placed.push({ x: lx, y: ly, w: labelWidth, h: labelHeight });
    return { lx, ly, side };
  }

  // Points in the rightmost 20 % of the chart prefer left-side labels to avoid
  // going off-canvas and to keep the crowded 2024-2026 labels legible.
  const nearRight = cx > innerW * 0.80;

  // Try increasingly larger gaps to find a clear spot.
  for (const gap of PLACEMENT_GAPS) {
    const h = labelHeight, w = labelWidth;
    const candidates: Array<{ lx: number; ly: number; side: Side }> = [
      // Right
      { lx: cx + dotR + gap,       ly: cy - h / 2,         side: "right" },
      { lx: cx + dotR + gap,       ly: cy - h - 10,        side: "right" },
      { lx: cx + dotR + gap,       ly: cy + 10,            side: "right" },
      // Left
      { lx: cx - dotR - gap - w,   ly: cy - h / 2,         side: "left"  },
      { lx: cx - dotR - gap - w,   ly: cy - h - 10,        side: "left"  },
      { lx: cx - dotR - gap - w,   ly: cy + 10,            side: "left"  },
      // Above
      { lx: cx - w / 2,            ly: cy - dotR - gap - h, side: "above" },
      { lx: cx + dotR,             ly: cy - dotR - gap - h, side: "above" },
      { lx: cx - w - dotR,         ly: cy - dotR - gap - h, side: "above" },
      // Below
      { lx: cx - w / 2,            ly: cy + dotR + gap,     side: "below" },
      { lx: cx + dotR,             ly: cy + dotR + gap,     side: "below" },
      { lx: cx - w - dotR,         ly: cy + dotR + gap,     side: "below" },
    ];

    // Near right edge → left first; even index → right first; odd → left first.
    const ordered = nearRight
      ? [
          candidates[3], candidates[4], candidates[5],
          candidates[6], candidates[7], candidates[8],
          candidates[9], candidates[10], candidates[11],
          candidates[0], candidates[1], candidates[2],
        ]
      : index % 2 === 0
      ? candidates
      : [
          candidates[3], candidates[4], candidates[5],
          candidates[0], candidates[1], candidates[2],
          candidates[6], candidates[7], candidates[8],
          candidates[9], candidates[10], candidates[11],
        ];

    for (const c of ordered) {
      if (isValid(c.lx, c.ly)) {
        placed.push({ x: c.lx, y: c.ly, w: labelWidth, h: labelHeight });
        return { lx: c.lx, ly: c.ly, side: c.side };
      }
    }
  }

  // Absolute fallback — ensures every label is visible even in extreme clusters.
  const fbLx = nearRight
    ? cx - dotR - FALLBACK_GAP_LEFT  - labelWidth
    : cx + dotR + FALLBACK_GAP_RIGHT;
  const fbLy = cy - labelHeight / 2 + ((index % 5) - 2) * 60;
  placed.push({ x: fbLx, y: fbLy, w: labelWidth, h: labelHeight });
  return { lx: fbLx, ly: fbLy, side: nearRight ? "left" : "right" };
}

// ── Leader line builder ───────────────────────────────────────────────────────
// Draws an L-shaped (elbow) connector: dot edge → bend → label edge midpoint.
// Straight when the label is perfectly aligned with the dot.
function buildLeader(cx: number, cy: number, lx: number, ly: number, side: Side): string {
  const lcx = lx + labelWidth  / 2;
  const lcy = ly + labelHeight / 2;
  const clampX = (v: number) => Math.max(lx + 8, Math.min(lx + labelWidth  - 8, v));
  const clampY = (v: number) => Math.max(ly + 8, Math.min(ly + labelHeight - 8, v));

  let dax: number, day: number; // dot attachment point
  let lax: number, lay: number; // label attachment point

  switch (side) {
    case "right":
      dax = cx + dotR + 3; day = cy;
      lax = lx;            lay = clampY(lcy);
      if (Math.abs(day - lay) < 8) return `M ${dax} ${day} L ${lax} ${lay}`;
      // Elbow: horizontal to label x-edge, then vertical to label midpoint y.
      return `M ${dax} ${day} L ${lax} ${day} L ${lax} ${lay}`;

    case "left":
      dax = cx - dotR - 3;    day = cy;
      lax = lx + labelWidth;  lay = clampY(lcy);
      if (Math.abs(day - lay) < 8) return `M ${dax} ${day} L ${lax} ${lay}`;
      return `M ${dax} ${day} L ${lax} ${day} L ${lax} ${lay}`;

    case "above":
      dax = cx; day = cy - dotR - 3;
      lax = clampX(lcx); lay = ly + labelHeight;
      if (Math.abs(dax - lax) < 8) return `M ${dax} ${day} L ${lax} ${lay}`;
      // Elbow: vertical to label y-edge, then horizontal to label midpoint x.
      return `M ${dax} ${day} L ${dax} ${lay} L ${lax} ${lay}`;

    case "below":
    default:
      dax = cx; day = cy + dotR + 3;
      lax = clampX(lcx); lay = ly;
      if (Math.abs(dax - lax) < 8) return `M ${dax} ${day} L ${lax} ${lay}`;
      return `M ${dax} ${day} L ${dax} ${lay} L ${lax} ${lay}`;
  }
}

// ── Text helpers ──────────────────────────────────────────────────────────────
function formatPrice(p: number): string {
  if (p >= 1_000_000) return "$" + (p / 1_000_000).toFixed(2) + "M";
  if (p >= 1_000)     return "$" + (p / 1_000).toFixed(0) + "K";
  return "$" + p.toLocaleString();
}

function labelText(d: Sale): { line1: string; line2: string; line3: string } {
  const priceStr   = formatPrice(d.price);
  const dateStr    = d.goodDate ? moment(d.date).format("MMM YYYY") : moment(d.date).format("YYYY");
  const issueNote  = d.note ? `#${d.issue} (${d.note})` : `#${d.issue}`;
  const gradePart  = d.grade ? `Grade: ${d.grade}` : "";
  const sellerPart = d.seller && d.seller !== "unknown" ? d.seller : "Unknown seller";
  const line2      = gradePart ? `${gradePart} — ${sellerPart}` : sellerPart;
  return {
    line1: `${d.title} ${issueNote}`,
    line2,
    line3: `${priceStr}  |  ${dateStr}`,
  };
}

// ── Compute all label placements before rendering ─────────────────────────────
// Placements are computed in a single pass so the collision registries are
// fully populated before any SVG elements are created.
const placements = sales.map((d, i) => {
  const { cx, cy } = dotPositions[i];
  const p = placeLabel(cx, cy, i, (d as any).labelOverride as LabelOverride | undefined);
  return { d, cx, cy, ...p };
});

// ── Render in layers — leaders → boxes → text → dots ─────────────────────────
// Keeping all dots in a separate top-layer group guarantees no label box can
// obscure a dot, regardless of data order.
const leadersLayer = g.append("g").attr("class", "leaders");
const boxesLayer   = g.append("g").attr("class", "label-boxes");
const textsLayer   = g.append("g").attr("class", "label-texts");
const dotsLayer    = g.append("g").attr("class", "dots");

placements.forEach(({ d, cx, cy, lx, ly, side }) => {
  const texts = labelText(d);

  // Leader line
  leadersLayer
    .append("path")
    .attr("d", buildLeader(cx, cy, lx, ly, side))
    .attr("fill", "none")
    .attr("stroke", "#000")
    .attr("stroke-width", 1.5)
    .attr("stroke-dasharray", "6 4")
    .attr("filter", "url(#sketchy)");

  // Label rectangle
  boxesLayer
    .append("rect")
    .attr("x", lx)
    .attr("y", ly)
    .attr("width", labelWidth)
    .attr("height", labelHeight)
    .attr("rx", 4)
    .attr("ry", 4)
    .attr("fill", "#fff")
    .attr("stroke", "#000")
    .attr("stroke-width", 2.5)
    .attr("filter", "url(#sketchy)");

  // Title: comic name + issue
  textsLayer
    .append("text")
    .attr("x", lx + labelPad)
    .attr("y", ly + labelPad + 18)
    .style("font-family", "'Bangers', cursive")
    .style("font-size", "19px")
    .style("fill", "#000")
    .style("letter-spacing", "0.5px")
    .text(texts.line1);

  // Grade + seller
  textsLayer
    .append("text")
    .attr("x", lx + labelPad)
    .attr("y", ly + labelPad + 42)
    .style("font-family", "'Bangers', cursive")
    .style("font-size", "15px")
    .style("fill", "#333")
    .text(texts.line2);

  // Price + date
  textsLayer
    .append("text")
    .attr("x", lx + labelPad)
    .attr("y", ly + labelPad + 65)
    .style("font-family", "'Bangers', cursive")
    .style("font-size", "18px")
    .style("fill", "#000")
    .text(texts.line3);

  // Dot — rendered in the top-most layer so it is never obscured by a label.
  dotsLayer
    .append("circle")
    .attr("cx", cx)
    .attr("cy", cy)
    .attr("r", dotR)
    .attr("fill", "#fff")
    .attr("stroke", "#000")
    .attr("stroke-width", 3)
    .attr("filter", "url(#sketchy)");
});
