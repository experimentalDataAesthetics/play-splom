import React from 'react';
import h from 'react-hyperscript';

/**
 * A radial gradient SVG filter for adding to the SVG component.
 *
 * For SVG you can declare filters (effects) at the top of the document
 * for use on individual nodes (Rect, Circle etc.)
 *
 * This was used for a circular Brush to show a ring with some transparency
 * effects, but is now unused since the adjustable d3 style rect
 * brush was added.
 */
export default class SVGFilter extends React.Component {
  render() {
    return h('defs', [
      h(
        'radialGradient',
        {
          id: 'brush-ring',
          cx: '50%',
          cy: '50%',
          r: '50%',
          fx: '50%',
          fy: '50%'
        },
        [
          h('stop', {
            offset: '0%',
            style: {
              stopColor: 'rgb(255, 255, 255); stop-opacity:0.1'
            }
          }),
          h('stop', {
            offset: '70%',
            style: {
              stopColor: 'rgb(255, 255, 255); stop-opacity:0.4'
            }
          }),
          h('stop', {
            offset: '100%',
            style: {
              stopColor: 'rgb(12, 250, 15); stop-opacity:0.9'
            }
          })
        ]
      )
    ]);
  }
}
