import React from 'react';
import h from 'react-hyperscript';


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
export default (props) => {
  const radius = pointSize(props.sideLength);
  // should not have to flip here
  const flip = props.sideLength;
  return h('g', props.points.map((xy, i) => {
    return React.createElement('circle', {
      cx: xy[0] || 0,
      cy: (flip - xy[1]) || 0,
      r: radius,
      key: String(i),
      className: props.className
    });
  }));
};
