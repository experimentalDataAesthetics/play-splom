import React from 'react';

/**
 * Draws a line along an axis - used by XAxis and YAxis
 *
 * https://github.com/esbullington/react-d3
 */
export default React.createClass({
  displayName: 'AxisLine',

  propTypes: {
    scale: React.PropTypes.func.isRequired,
    innerTickSize: React.PropTypes.number,
    outerTickSize: React.PropTypes.number,
    tickPadding: React.PropTypes.number,
    tickArguments: React.PropTypes.array,
    fill: React.PropTypes.string,
    stroke: React.PropTypes.string
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
    var props = this.props;
    var sign = props.orient === 'top' || props.orient === 'left' ? -1 : 1;

    var range = this._d3ScaleRange(this.props.scale);

    var d;

    const outerTickSize = sign * props.outerTickSize;

    if (props.orient === 'bottom' || props.orient === 'top') {
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
      fill: props.fill,
      stroke: props.stroke,
      strokeWidth: props.strokeWidth
    });
  }
});
