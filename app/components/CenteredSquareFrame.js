const React = require('react');
let h = require('react-hyperscript');
let Dimensions = require('react-dimensions');

/**
 * Allocates the largest possible square area and places its child top and centered.
 *
 * There should only be one child
 */
class CenteredSquareFrame extends React.Component {

  render() {
    let cw = this.props.containerWidth || 10;
    let ch = this.props.containerHeight || 10;
    let innerLength = Math.min(cw, ch);
    var widthMargin = cw - innerLength;
    if (widthMargin) {
      widthMargin = widthMargin / 2;
    }

    var heightMargin = ch - innerLength;
    if (heightMargin) {
      heightMargin = heightMargin / 2;
    }

    let style = {
      margin: `0 ${widthMargin}px ${heightMargin}px`,
      width: `${innerLength}px`,
      height: `${innerLength}px`,
      border: '1px solid green'
    };

    return h('div.centered-square-frame', {style}, this.props.children);
  }
}

// enhances, adding this.props.containerWidth/Height
export default Dimensions()(CenteredSquareFrame);
