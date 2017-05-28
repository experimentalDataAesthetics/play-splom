import React from 'react';

/**
 * Place children within SVG group (g) at x, y
 */
export default function Box({ x, y, sideLength, children }) {
  return (
    <g transform={`translate(${x}, ${y})`} width={sideLength} height={sideLength}>
      {children}
    </g>
  );
}
