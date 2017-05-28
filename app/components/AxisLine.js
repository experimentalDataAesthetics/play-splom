import React from 'react';
import PropTypes from 'prop-types';

/**
 * Draws a line along an axis - used by XAxis and YAxis
 *
 * https://github.com/esbullington/react-d3
 */
export default React.createClass({
  displayName: 'AxisLine',

  propTypes: {
    fill: PropTypes.string,
    orient: PropTypes.string,
    outerTickSize: PropTypes.number,
    scale: PropTypes.func.isRequired,
    stroke: PropTypes.string,
    strokeWidth: PropTypes.string
  },

  getDefaultProps: function getDefaultProps() {
    return {
      innerTickSize: 6,
      outerTickSize: 6,
      tickPadding: 3,
      fill: 'none',
      tickArguments: [10],
      tickValues: null,
      tickFormat: null
    };
  },

  _d3ScaleExtent: function d3ScaleExtent(domain) {
    const start = domain[0];
    const stop = domain[domain.length - 1];
    return start < stop ? [start, stop] : [stop, start];
  },

  _d3ScaleRange: function d3ScaleRange(scale) {
    return scale.rangeExtent ? scale.rangeExtent() : this._d3ScaleExtent(scale.range());
  },

  render: function render() {
    const { orient, scale, fill, stroke, strokeWidth } = this.props;
    const sign = orient === 'top' || orient === 'left' ? -1 : 1;

    const range = this._d3ScaleRange(scale);

    let d;

    const outerTickSize = sign * this.props.outerTickSize;

    if (orient === 'bottom' || orient === 'top') {
      d = `M${range[0]},${outerTickSize}V0H${range[1]}V${outerTickSize}`;
    } else {
      d = `M${outerTickSize},${range[0]}H0V${range[1]}H${outerTickSize}`;
    }

    return React.createElement('path', {
      className: 'domain',
      d,
      style: {
        shapeRendering: 'crispEdges'
      },
      fill,
      stroke,
      strokeWidth
    });
  }
});
