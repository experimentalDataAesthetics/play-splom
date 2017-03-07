
export function centeredSquareMargin(width, height) {
  const innerLength = Math.min(width, height);
  let widthMargin = width - innerLength;
  if (widthMargin > 0) {
    widthMargin /= 2;
  }

  let heightMargin = height - innerLength;
  if (heightMargin) {
    heightMargin /= 2;
  }

  return {
    margin: `0 ${widthMargin}px ${heightMargin}px`,
    width: `${innerLength}px`,
    height: `${innerLength}px`
  };
}

/**
 * Given total width and height, center a square in the upper middle
 * with a margin of at least 'margin'
 */
export function centeredSquareWithMargin(width, height, margin) {
  // only apply margin if there isn't one already
  const minDim = Math.min(width, height);
  // should remove margin if < 500
  const innerLength = minDim - margin - margin;

  let widthMargin = width - innerLength;
  if (widthMargin > 0) {
    widthMargin /= 2;
  }

  let heightMargin = height - innerLength;
  if (heightMargin) {
    heightMargin /= 2;
  }

  return {
    position: 'absolute',
    left: widthMargin,
    right: width - widthMargin,
    width: innerLength,
    height: innerLength,
    top: margin,
    bottom: innerLength
  };
}

export function centeredSquare(width, height) {
  const innerLength = Math.min(width, height);
  let widthMargin = width - innerLength;
  if (widthMargin > 0) {
    widthMargin /= 2;
  }

  let heightMargin = height - innerLength;
  if (heightMargin) {
    heightMargin /= 2;
  }

  return {
    position: 'absolute',
    left: widthMargin,
    right: width - widthMargin,
    width: innerLength,
    height: innerLength,
    top: 0,
    bottom: innerLength
  };
}
