export function processTimelineData(rawData, config) {
  let globalLastY = config.minStartY;

  const processedData = rawData.map((entry, index) => {
    const isLeft = index % 2 === 0;
    const date = new Date(entry.date);
    let targetY = (date.getFullYear() - config.startYear + (date.getMonth() / 12)) * config.pixelsPerYear + config.initialOffsetY;

    if (targetY < globalLastY + config.collisionSpacing) {
      targetY = globalLastY + config.collisionSpacing + config.boxH / 2;
    }

    globalLastY = targetY + config.boxH / 2;

    return {
      ...entry,
      y: targetY,
      side: isLeft ? "left" : "right"
    };
  });

  return {
    processedData,
    totalHeight: globalLastY + config.bottomPadding
  };
}