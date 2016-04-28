import React from 'react';
import h from 'react-hyperscript';

export default class SVG extends React.Component {

  render() {
    return h('defs', [
      h('radialGradient', {
        id: 'brush-ring',
        cx: '50%',
        cy: '50%',
        r: '50%',
        fx: '50%',
        fy: '50%'
      }, [
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
      ])
    ]);
  }
}
