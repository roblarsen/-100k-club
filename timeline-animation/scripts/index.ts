import * as d3 from "d3";
import moment from "moment";
import * as data from "../../data/data/records.json";

// ── Dimensions ──────────────────────────────────────────────────────────────
const margin = { top: 160, right: 420, bottom: 120, left: 180 };
const width  = 5000;
const height = 4000;
const innerW  = width  - margin.left - margin.right;
const innerH  = height - margin.top  - margin.bottom;

// ── Data ─────────────────────────────────────────────────────────────────────
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
}

const parseTime = d3.timeParse('%Y-%m-%d');

const sales: Sale[] = (data.sales as any[])
  .map((d) => ({
    ...d,
    date: parseTime(d.date),
    price: +d.price,
  }))
  .filter((d) => d.date !== null)
  .sort((a, b) => (a.date as Date).getTime() - (b.date as Date).getTime());

// ── Scales ────────────────────────────────────────────────────────────────────
const x = d3.scaleTime()
  .domain([
    d3.min(sales, (d) => moment(d.date).startOf('year').toDate()) as Date,
    moment().toDate(),
  ])
  .rangeRound([0, innerW]);

const maxPrice = d3.max(sales, (d) => d.price) as number;

// Log scale handles the 4-order-of-magnitude range ($250 → $15M) far better
// than a linear scale.  We clamp the low end to 100 so log(0) is avoided.
const y = d3.scaleLog()
  .domain([100, maxPrice * 1.4])
  .rangeRound([innerH, 0])
  .clamp(true);

// ── SVG ───────────────────────────────────────────────────────────────────────
const svg = d3.select('#viz')
  .append('svg')
  .attr('width',  width)
  .attr('height', height)
  .style('background', '#fff');

// ── Defs: sketchy filter ──────────────────────────────────────────────────────
// Applies a subtle turbulence displacement so lines look hand-drawn.
const defs = svg.append('defs');

defs.append('filter')
  .attr('id', 'sketchy')
  .attr('x', '-5%').attr('y', '-5%')
  .attr('width', '110%').attr('height', '110%')
  .html(`
    <feTurbulence type="fractalNoise" baseFrequency="0.025 0.030"
      numOctaves="4" seed="2" result="noise"/>
    <feDisplacementMap in="SourceGraphic" in2="noise"
      scale="7" xChannelSelector="R" yChannelSelector="G"/>
  `);

// Slightly stronger filter for the main price line
defs.append('filter')
  .attr('id', 'sketchy-line')
  .attr('x', '-5%').attr('y', '-5%')
  .attr('width', '110%').attr('height', '110%')
  .html(`
    <feTurbulence type="fractalNoise" baseFrequency="0.030 0.040"
      numOctaves="4" seed="7" result="noise"/>
    <feDisplacementMap in="SourceGraphic" in2="noise"
      scale="9" xChannelSelector="R" yChannelSelector="G"/>
  `);

const g = svg.append('g')
  .attr('transform', `translate(${margin.left},${margin.top})`);

// ── Grid lines ────────────────────────────────────────────────────────────────
// For a log scale use explicit powers-of-10 ticks for the horizontal grid
const logGridValues = [100, 500, 1000, 5000, 10000, 50000, 100000, 500000,
                       1000000, 5000000, 10000000, 20000000];
const yTicks = logGridValues.filter((v) => v >= 100 && v <= maxPrice * 1.4);
g.append('g')
  .attr('class', 'grid')
  .selectAll('line.grid-h')
  .data(yTicks)
  .enter()
  .append('line')
  .attr('class', 'grid-h')
  .attr('x1', 0)
  .attr('x2', innerW)
  .attr('y1', (d) => y(d))
  .attr('y2', (d) => y(d))
  .attr('stroke', '#ccc')
  .attr('stroke-width', 1)
  .attr('stroke-dasharray', '8 5')
  .attr('filter', 'url(#sketchy)');

const years = parseInt(moment().format('YYYY')) - parseInt(moment(x.domain()[0]).format('YYYY'));
const xTicks = x.ticks(years);
g.append('g')
  .attr('class', 'grid')
  .selectAll('line.grid-v')
  .data(xTicks)
  .enter()
  .append('line')
  .attr('class', 'grid-v')
  .attr('x1', (d) => x(d))
  .attr('x2', (d) => x(d))
  .attr('y1', 0)
  .attr('y2', innerH)
  .attr('stroke', '#eee')
  .attr('stroke-width', 1)
  .attr('stroke-dasharray', '6 4')
  .attr('filter', 'url(#sketchy)');

// ── Axes ──────────────────────────────────────────────────────────────────────
// Y axis
g.append('g')
  .attr('class', 'axis')
  .call(
    d3.axisLeft(y)
      .tickValues([100, 500, 1000, 5000, 10000, 50000, 100000, 500000,
                   1000000, 5000000, 10000000, 20000000])
      .tickSize(-innerW)
      .tickFormat((d) => {
        const v = +d;
        if (v >= 1_000_000) return '$' + (v / 1_000_000) + 'M';
        if (v >= 1_000)     return '$' + (v / 1_000) + 'K';
        return '$' + v;
      })
  )
  .call((ax) => ax.select('.domain').attr('stroke-width', 3))
  .call((ax) => ax.selectAll('.tick line').attr('stroke', 'none'))
  .call((ax) =>
    ax.selectAll('.tick text')
      .style('font-family', "'Bangers', cursive")
      .style('font-size', '24px')
      .style('fill', '#000')
  )
  .attr('filter', 'url(#sketchy)');

// X axis
g.append('g')
  .attr('class', 'axis')
  .attr('transform', `translate(0,${innerH})`)
  .call(
    d3.axisBottom(x)
      .ticks(years)
      .tickSize(10)
      .tickPadding(12)
      .tickFormat(d3.timeFormat('%Y') as any)
  )
  .call((ax) => ax.select('.domain').attr('stroke-width', 3))
  .call((ax) =>
    ax.selectAll('.tick text')
      .style('font-family', "'Bangers', cursive")
      .style('font-size', '22px')
      .style('fill', '#000')
  )
  .attr('filter', 'url(#sketchy)');

// ── Axis labels ───────────────────────────────────────────────────────────────
g.append('text')
  .attr('class', 'axis-label')
  .attr('transform', 'rotate(-90)')
  .attr('x', -innerH / 2)
  .attr('y', -130)
  .attr('text-anchor', 'middle')
  .style('font-family', "'Bangers', cursive")
  .style('font-size', '32px')
  .style('letter-spacing', '3px')
  .style('fill', '#000')
  .text('SALE PRICE (USD)');

g.append('text')
  .attr('class', 'axis-label-note')
  .attr('transform', 'rotate(-90)')
  .attr('x', -innerH / 2)
  .attr('y', -95)
  .attr('text-anchor', 'middle')
  .style('font-family', "'Bangers', cursive")
  .style('font-size', '20px')
  .style('letter-spacing', '1px')
  .style('fill', '#555')
  .text('(logarithmic scale)');

g.append('text')
  .attr('class', 'axis-label')
  .attr('x', innerW / 2)
  .attr('y', innerH + 90)
  .attr('text-anchor', 'middle')
  .style('font-family', "'Bangers', cursive")
  .style('font-size', '32px')
  .style('letter-spacing', '3px')
  .style('fill', '#000')
  .text('YEAR OF SALE');

// ── Chart title ───────────────────────────────────────────────────────────────
svg.append('text')
  .attr('class', 'chart-title')
  .attr('x', width / 2)
  .attr('y', 90)
  .attr('text-anchor', 'middle')
  .style('font-family', "'Bangers', cursive")
  .style('font-size', '64px')
  .style('letter-spacing', '6px')
  .style('fill', '#000')
  .text('THE $100K CLUB — RECORD COMIC BOOK SALES');

// ── Price line ────────────────────────────────────────────────────────────────
const line = d3.line<Sale>()
  .x((d) => x(d.date as Date))
  .y((d) => y(d.price))
  .curve(d3.curveCatmullRom.alpha(0.5));

g.append('path')
  .datum(sales)
  .attr('class', 'chart-line')
  .attr('d', line)
  .attr('fill', 'none')
  .attr('stroke', '#000')
  .attr('stroke-width', 3.5)
  .attr('stroke-linecap', 'round')
  .attr('stroke-linejoin', 'round')
  .attr('filter', 'url(#sketchy-line)');

// ── Data points & always-visible labels ──────────────────────────────────────
const dotsGroup = g.append('g').attr('class', 'dots');

// Label layout: decide whether each label goes above or below the dot.
// We use a simple alternating strategy, biased by proximity to top/bottom edge.
const labelWidth  = 340;
const labelHeight = 100;
const labelPad    = 14;
const dotR        = 10;
const leaderLen   = 60;

interface LabelPlacement {
  lx: number;
  ly: number;
  anchor: string;
  side: 'above' | 'below' | 'right' | 'left';
}

function formatPrice(p: number): string {
  if (p >= 1_000_000) {
    return '$' + (p / 1_000_000).toFixed(2) + 'M';
  }
  if (p >= 1_000) {
    return '$' + (p / 1_000).toFixed(0) + 'K';
  }
  return '$' + p.toLocaleString();
}

function labelText(d: Sale): { line1: string; line2: string; line3: string } {
  const priceStr = formatPrice(d.price);
  const dateStr  = d.goodDate
    ? moment(d.date).format('MMM YYYY')
    : moment(d.date).format('YYYY');
  const issueNote = d.note ? `#${d.issue} (${d.note})` : `#${d.issue}`;
  const gradePart = d.grade ? `Grade: ${d.grade}` : '';
  const sellerPart = d.seller && d.seller !== 'unknown' ? d.seller : 'Unknown seller';
  const gradeAndSeller = gradePart ? `${gradePart} — ${sellerPart}` : sellerPart;
  return {
    line1: `${d.title} ${issueNote}`,
    line2: gradeAndSeller,
    line3: `${priceStr}  |  ${dateStr}`,
  };
}

// Simple label placement: try right first, then left, then above/below based
// on vertical position.  We don't do full collision detection — the large
// canvas (5000×4000) and the limited number of points (32) make simple
// alternation sufficient.
const placed: Array<{ x: number; y: number; w: number; h: number }> = [];

function overlaps(r: { x: number; y: number; w: number; h: number }): boolean {
  return placed.some(
    (p) =>
      r.x < p.x + p.w + 10 &&
      r.x + r.w + 10 > p.x &&
      r.y < p.y + p.h + 10 &&
      r.y + r.h + 10 > p.y
  );
}

function placeholderFor(
  cx: number, cy: number, index: number
): LabelPlacement {
  const candidates: Array<{
    lx: number; ly: number; anchor: string; side: 'above'|'below'|'right'|'left';
  }> = [
    // right
    {
      lx: cx + dotR + leaderLen,
      ly: cy - labelHeight / 2,
      anchor: 'start',
      side: 'right',
    },
    // left
    {
      lx: cx - dotR - leaderLen - labelWidth,
      ly: cy - labelHeight / 2,
      anchor: 'start',
      side: 'left',
    },
    // above
    {
      lx: cx - labelWidth / 2,
      ly: cy - dotR - leaderLen - labelHeight,
      anchor: 'start',
      side: 'above',
    },
    // below
    {
      lx: cx - labelWidth / 2,
      ly: cy + dotR + leaderLen,
      anchor: 'start',
      side: 'below',
    },
  ];

  // bias: even-indexed points prefer right/above, odd prefer left/below
  const reordered =
    index % 2 === 0
      ? candidates
      : [candidates[1], candidates[0], candidates[3], candidates[2]];

  for (const c of reordered) {
    const rect = { x: c.lx, y: c.ly, w: labelWidth, h: labelHeight };
    // Keep within chart bounds
    if (
      c.lx >= -margin.left + 10 &&
      c.lx + labelWidth <= innerW + margin.right - 10 &&
      c.ly >= -margin.top + 10 &&
      c.ly + labelHeight <= innerH + margin.bottom - 10 &&
      !overlaps(rect)
    ) {
      placed.push(rect);
      return c;
    }
  }

  // Fallback: stagger vertically
  const fallback = {
    lx: cx + dotR + leaderLen,
    ly: cy - labelHeight / 2 + (index % 4) * 30 - 45,
    anchor: 'start',
    side: 'right' as const,
  };
  placed.push({ x: fallback.lx, y: fallback.ly, w: labelWidth, h: labelHeight });
  return fallback;
}

sales.forEach((d, i) => {
  const cx = x(d.date as Date);
  const cy = y(d.price);
  const placement = placeholderFor(cx, cy, i);
  const { lx, ly, side } = placement;

  const texts = labelText(d);

  const dotGroup = dotsGroup.append('g').attr('class', 'dot-group');

  // Connector / leader line
  let leaderPath: string;
  if (side === 'right') {
    leaderPath = `M ${cx + dotR} ${cy} L ${lx} ${cy}`;
  } else if (side === 'left') {
    leaderPath = `M ${cx - dotR} ${cy} L ${lx + labelWidth} ${cy}`;
  } else if (side === 'above') {
    leaderPath = `M ${cx} ${cy - dotR} L ${cx} ${ly + labelHeight}`;
  } else {
    leaderPath = `M ${cx} ${cy + dotR} L ${cx} ${ly}`;
  }

  dotGroup.append('path')
    .attr('class', 'connector-line')
    .attr('d', leaderPath)
    .attr('fill', 'none')
    .attr('stroke', '#000')
    .attr('stroke-width', 1.5)
    .attr('stroke-dasharray', '6 4')
    .attr('filter', 'url(#sketchy)');

  // Label box (hand-drawn rectangle)
  dotGroup.append('rect')
    .attr('class', 'label-box')
    .attr('x', lx)
    .attr('y', ly)
    .attr('width', labelWidth)
    .attr('height', labelHeight)
    .attr('rx', 4)
    .attr('ry', 4)
    .attr('fill', '#fff')
    .attr('stroke', '#000')
    .attr('stroke-width', 2.5)
    .attr('filter', 'url(#sketchy)');

  // Label text — line 1: title + issue
  dotGroup.append('text')
    .attr('class', 'label-title')
    .attr('x', lx + labelPad)
    .attr('y', ly + labelPad + 18)
    .style('font-family', "'Bangers', cursive")
    .style('font-size', '19px')
    .style('fill', '#000')
    .style('letter-spacing', '0.5px')
    .text(texts.line1);

  // Label text — line 2: grade + seller
  dotGroup.append('text')
    .attr('class', 'label-issue')
    .attr('x', lx + labelPad)
    .attr('y', ly + labelPad + 42)
    .style('font-family', "'Bangers', cursive")
    .style('font-size', '15px')
    .style('fill', '#333')
    .text(texts.line2);

  // Label text — line 3: price + date
  dotGroup.append('text')
    .attr('class', 'label-price')
    .attr('x', lx + labelPad)
    .attr('y', ly + labelPad + 65)
    .style('font-family', "'Bangers', cursive")
    .style('font-size', '18px')
    .style('fill', '#000')
    .text(texts.line3);

  // Dot (drawn last so it appears on top)
  dotGroup.append('circle')
    .attr('class', 'dot')
    .attr('cx', cx)
    .attr('cy', cy)
    .attr('r', dotR)
    .attr('fill', '#fff')
    .attr('stroke', '#000')
    .attr('stroke-width', 3)
    .attr('filter', 'url(#sketchy)');
});
