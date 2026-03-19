import type { ComicRecord } from "./data.js";

export interface ChartConfig {
  width: number;
  boxW: number;
  boxH: number;
  gutterWidth: number;
  yearMargin: number;
  pixelsPerYear: number;
  startYear: number;
  initialOffsetY: number;
  minStartY: number;
  collisionSpacing: number;
  bottomPadding: number;
  textPaddingX: number;
  textPaddingY: number;
  tailGap: number;
}

export function processTimelineData(
  rawData: ComicRecord[],
  config: ChartConfig
): { processedData: ComicRecord[]; totalHeight: number } {
  let globalLastY = config.minStartY;

  const processedData = rawData.map((entry: ComicRecord, index: number) => {
    const isLeft = index % 2 === 0;
    const date = new Date(entry.date);
    let targetY =
      (date.getFullYear() - config.startYear + date.getMonth() / 12) *
        config.pixelsPerYear +
      config.initialOffsetY;

    if (targetY < globalLastY + config.collisionSpacing) {
      targetY = globalLastY + config.collisionSpacing + config.boxH / 2;
    }

    globalLastY = targetY + config.boxH / 2;

    return {
      ...entry,
      y: targetY,
      side: isLeft ? "left" : "right",
    } as ComicRecord;
  });

  return {
    processedData,
    totalHeight: globalLastY + config.bottomPadding,
  };
}