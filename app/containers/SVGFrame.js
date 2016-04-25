import { Component } from 'react';
import h from 'react-hyperscript';

import ScatterPlotsContainer from './ScatterPlotsContainer';
import SVGFilters from '../components/SVGFilters';

export default class SVGFrame extends Component {

  render() {
    const children = [
      h(SVGFilters),
      h(ScatterPlotsContainer, {
        width: this.props.containerWidth,
        height: this.props.containerHeight
      })
    ];

    return h(
      'svg',
      {
        xmlns: 'http://www.w3.org/2000/svg',
        className: 'svg-frame',
        height: this.props.containerHeight,
        width: this.props.containerWidth
      },
      children
    );
  }
}
