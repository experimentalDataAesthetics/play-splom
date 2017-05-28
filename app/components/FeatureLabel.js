import React from 'react';
import Label from './Label';
import Box from './Box';

/**
 * Label for a feature "sepal width" displayed either
 * to the left or at the bottom of a single plot
 */
export default function FeatureLabel({ x, y, height, width, label, orient, textColor, offset }) {
  let transform;
  switch (orient) {
    case 'bottom':
      transform = `translate(0, ${height})`;
      break;
    case 'left':
      // transform = `translate(${offset}, 0)`;
      break;
    default:
      break;
  }
  return (
    <Box x={x} y={y} sideLength={width}>
      <g transform={transform}>
        <Label
          label={label}
          orient={orient}
          textColor={textColor}
          offset={offset}
          height={height}
          width={width}
        />
      </g>
    </Box>
  );
}
