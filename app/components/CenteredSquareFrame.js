import { Component } from 'react';
import h from 'react-hyperscript';
import Dimensions from 'react-dimensions';
import { centeredSquareMargin } from '../utils/layout';

/**
 * Allocates the largest possible square area and places its child top and centered.
 *
 * There should only be one child
 */
class CenteredSquareFrame extends Component {

  render() {
    let cw = this.props.containerWidth || 10;
    let ch = this.props.containerHeight || 10;

    let style = centeredSquareMargin(cw, ch);

    return h('div.centered-square-frame', {style}, this.props.children);
  }
}

// enhances, adding this.props.containerWidth/Height
export default Dimensions()(CenteredSquareFrame);
