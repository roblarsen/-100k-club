import { rawData } from "./data";
import { CHART_CONFIG } from "./config";
import { processTimelineData } from "./layout";
import { renderTimeline } from "./render";

const { processedData, totalHeight } = processTimelineData(rawData, CHART_CONFIG);

renderTimeline({
  containerSelector: "#chart-container",
  processedData,
  totalHeight,
  config: CHART_CONFIG
});