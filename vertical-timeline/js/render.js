function createPathData({ isLeft, x, y, centerX, boxW, boxH, yearMargin, tailGap }) {
  if (!isLeft) {
    return `
      M ${x},${y}
      H ${x + boxW}
      V ${y + boxH}
      H ${x}
      V ${tailGap}
      L ${centerX + yearMargin},0
      L ${x},${-tailGap}
      Z`;
  }

  return `
    M ${x},${y}
    H ${x + boxW}
    V ${-tailGap}
    L ${centerX - yearMargin},0
    L ${x + boxW},${tailGap}
    V ${y + boxH}
    H ${x}
    Z`;
}

function setupSvg(containerSelector, width, totalHeight) {
  const svg = d3
    .select(containerSelector)
    .append("svg")
    .attr("width", width)
    .attr("height", totalHeight)
    .attr("viewBox", `0 0 ${width} ${totalHeight}`);

  const defs = svg.append("defs");

  defs
    .append("pattern")
    .attr("id", "blueGrid")
    .attr("width", 50)
    .attr("height", 50)
    .attr("patternUnits", "userSpaceOnUse")
    .append("path")
    .attr("d", "M 50 0 L 0 0 0 50")
    .attr("fill", "none")
    .attr("stroke", "#b3e5fc")
    .attr("stroke-width", "1.5");

  const inkFilter = defs
    .append("filter")
    .attr("id", "rough-ink")
    .attr("x", "-20%")
    .attr("y", "-20%")
    .attr("width", "140%")
    .attr("height", "140%");

  inkFilter
    .append("feTurbulence")
    .attr("type", "fractalNoise")
    .attr("baseFrequency", "0.04")
    .attr("numOctaves", "3")
    .attr("result", "noise");

  inkFilter
    .append("feDisplacementMap")
    .attr("in", "SourceGraphic")
    .attr("in2", "noise")
    .attr("scale", "5");

  svg.append("rect").attr("width", "100%").attr("height", "100%").attr("fill", "url(#blueGrid)");

  svg
    .append("line")
    .attr("x1", width / 2)
    .attr("x2", width / 2)
    .attr("y1", 0)
    .attr("y2", totalHeight)
    .attr("stroke", "#000")
    .attr("stroke-width", 12)
    .attr("filter", "url(#rough-ink)");

  return svg;
}

function renderEntries(svg, processedData, config) {
  const formatPrice = d3.format("$,.0f");

  const entries = svg
    .selectAll(".entry")
    .data(processedData)
    .enter()
    .append("g")
    .attr("transform", (entry) => `translate(0, ${entry.y})`);

  entries.each(function(entry) {
    const g = d3.select(this);
    const isLeft = entry.side === "left";
    const centerX = config.width / 2;
    const x = isLeft ? centerX - config.gutterWidth - config.boxW : centerX + config.gutterWidth;
    const y = -config.boxH / 2;

    const pathData = createPathData({
      isLeft,
      x,
      y,
      centerX,
      boxW: config.boxW,
      boxH: config.boxH,
      yearMargin: config.yearMargin,
      tailGap: config.tailGap
    });

    g
      .append("path")
      .attr("d", pathData.replace(/\s+/g, " ").trim())
      .attr("fill", "#fff")
      .attr("stroke", "#000")
      .attr("stroke-width", 6)
      .attr("filter", "url(#rough-ink)");

    g
      .append("text")
      .attr("class", "year-label")
      .attr("text-anchor", "middle")
      .attr("x", centerX)
      .attr("y", 18)
      .text(entry.date.substring(0, 4));

    const textGroup = g
      .append("g")
      .attr("transform", `translate(${x + config.textPaddingX}, ${y + config.textPaddingY})`);

    textGroup.append("text").attr("class", "comic-title").text(`${entry.title} #${entry.issue}`);
    textGroup.append("text").attr("class", "price-tag").attr("y", 55).text(formatPrice(entry.price));

    const details = entry.grade ? `Grade: ${entry.grade}` : "";
    textGroup.append("text").attr("class", "comic-details").attr("y", 95).text(details);

    if (entry.note) {
      textGroup.append("text").attr("class", "note-text").attr("y", 130).text(`"${entry.note}"`);
    }
  });
}

export function renderTimeline({ containerSelector, processedData, totalHeight, config }) {
  const svg = setupSvg(containerSelector, config.width, totalHeight);
  renderEntries(svg, processedData, config);
}