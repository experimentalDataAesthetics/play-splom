import { Component } from 'react';
import h from 'react-hyperscript';

import ScatterPlots from './ScatterPlots';
import SVGFilters from '../components/SVGFilters';
// import Brush from '../components/Brush';

export default class SVGFrame extends Component {

  render() {
    const children = [
      h(SVGFilters),
      h(ScatterPlots, {
        width: this.props.containerWidth,
        height: this.props.containerHeight
      })
      // h(Brush, {
      //   show: false,
      //   x: 0,
      //   y: 0,
      //   radius: 10
      // })
    ];

    return h(
      'svg',
      {
        xmlns: 'http://www.w3.org/2000/svg',
        className: 'svg-frame',
        height: this.props.containerHeight,
        width: this.props.containerWidth
        // ref: (svg) => this._svg = svg
      },
      children
    );
  }
}
