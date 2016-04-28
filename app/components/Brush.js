import React from 'react';
import h from 'react-hyperscript';
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
  if (state.ui.brush) {
    return state.ui.brush;
  }

  return {};
};

const mapDispatchToProps = () => {
  return {};
};

/**
 * Renders the brush with adjustable radius
 * mouse tracked from SVGFrame
 *
 * Styling comes from #brush-ring in SVGFilters
 *
 * This is too slow to use; it lags the mouse.
 * Will switch to a cursor image
 */
class Brush extends React.Component {

  render() {
    var props = this.props;
    if (props.show) {
      return h('circle', {
        cx: props.x,
        cy: props.y,
        r: props.radius || 10,
        fill: 'url(#brush-ring)',
        className: 'brush'
      });
    }

    return false;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Brush);
