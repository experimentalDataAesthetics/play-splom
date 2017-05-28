import React from 'react';

/**
 * Draw a very minimal L-shaped axis along the bottom left of a plot.
 *
 * Each plot has one of these.
 */
export default function LAxis({ sideLength, color }) {
  return (
    <polyline
      points={`0,0 0,${sideLength} ${sideLength},${sideLength}`}
      strokeWidth={1}
      stroke={color}
      fill="none"
    />
  );
}
