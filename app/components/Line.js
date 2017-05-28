import React from 'react';

/**
 * Renders an SVG line
 */
export default function Line({ points, stroke, opacity }) {
  return (
    <line
      x1={points[0][0]}
      y1={points[0][1]}
      x2={points[1][0]}
      y2={points[1][1]}
      stroke={stroke}
      opacity={opacity}
    />
  );
}
