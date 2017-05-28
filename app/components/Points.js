import React from 'react';

function pointSize(sideLength) {
  if (sideLength < 100) {
    return 1;
  }

  if (sideLength < 150) {
    return 2;
  }

  return 3;
}

/**
 * Renders points as SVG circles in a g
 */
export default function Points({ sideLength, points, color }) {
  const radius = pointSize(sideLength);
  // should not have to flip here
  const flip = sideLength;
  return (
    <g>
      {points.map((xy, i) => (
        <circle
          cx={xy[0] || 0}
          cy={flip - xy[1] || 0}
          r={radius}
          key={String(i)}
          style={{
            fill: color
          }}
        />
      ))}
    </g>
  );
}
