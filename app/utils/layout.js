
export function centeredSquareMargin(width, height) {
  const innerLength = Math.min(width, height);
  let widthMargin = width - innerLength;
  if (widthMargin > 0) {
    widthMargin = widthMargin / 2;
  }

  let heightMargin = height - innerLength;
  if (heightMargin) {
    heightMargin = heightMargin / 2;
  }

  return {
    margin: `0 ${widthMargin}px ${heightMargin}px`,
    width: `${innerLength}px`,
    height: `${innerLength}px`
  };
}

export function centeredSquare(width, height) {
  const innerLength = Math.min(width, height);
  let widthMargin = width - innerLength;
  if (widthMargin > 0) {
    widthMargin = widthMargin / 2;
  }

  let heightMargin = height - innerLength;
  if (heightMargin) {
    heightMargin = heightMargin / 2;
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
