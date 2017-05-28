import React from 'react';
import PropTypes from 'prop-types';

/**
 * A string label used by the XAxis and YAxis.
 */

export default function Label({
  label,
  orient, // top bottom left right
  height,
  width,
  offset = 0,
  textColor = '#000000',
  strokeWidth = 0.01
}) {
  if (!label) {
    return <text />;
  }

  let transform;
  let x;
  let y;
  switch (orient) {
    case 'top':
    case 'bottom':
      transform = 'rotate(0)';
      x = width / 2;
      y = offset;
      break;
    case 'left':
    case 'right':
    default:
      transform = 'rotate(270)';
      x = -height / 2;
      y = orient === 'left' ? -offset : offset;
  }

  return (
    <text
      strokeWidth={strokeWidth.toString()}
      textAnchor="middle"
      transform={transform}
      style={{
        stroke: textColor,
        fill: textColor,
        fontSize: 10
      }}
      x={x}
      y={y}
    >
      {label}
    </text>
  );
}

Label.propTypes = {
  label: PropTypes.string.isRequired,
  orient: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  height: PropTypes.number,
  width: PropTypes.number,
  offset: PropTypes.number,
  textColor: PropTypes.string,
  strokeWidth: PropTypes.number
};
