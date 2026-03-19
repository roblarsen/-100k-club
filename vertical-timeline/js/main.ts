import { rawData } from "./data.js";
import { CHART_CONFIG } from "./config.js";
import { processTimelineData } from "./layout.js";
import { renderTimeline } from "./render.js";

const { processedData, totalHeight } = processTimelineData(rawData, CHART_CONFIG);

renderTimeline({
  containerSelector: "#chart-container",
  processedData,
  totalHeight,
  config: CHART_CONFIG,
});