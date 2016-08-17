import React from 'react';
import h from 'react-hyperscript';


/**
 * Renders points as SVG circles in a g
 */
export default (props) => {
  // move to layout
  const radius = props.sideLength < 100 ? 1 : 3;
  // should not have to flip here
  const flip = props.sideLength;
  return h('g', props.points.map((xy, i) => {
    return React.createElement('circle', {
      cx: xy[0],
      cy: flip - xy[1],
      r: radius,
      key: String(i),
      className: props.className
    });
  }));
};
