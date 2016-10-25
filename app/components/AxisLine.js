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

  _d3_scaleExtent: function _d3_scaleExtent(domain) {
    var start = domain[0],
        stop = domain[domain.length - 1];
    return start < stop ? [start, stop] : [stop, start];
  },

  _d3_scaleRange: function _d3_scaleRange(scale) {
    return scale.rangeExtent ? scale.rangeExtent() : this._d3_scaleExtent(scale.range());
  },

  render: function render() {

    var props = this.props;
    var sign = props.orient === 'top' || props.orient === 'left' ? -1 : 1;

    var range = this._d3_scaleRange(this.props.scale);

    var d;

    if (props.orient === 'bottom' || props.orient === 'top') {
      d = 'M' + range[0] + ',' + sign * props.outerTickSize + 'V0H' + range[1] + 'V' + sign * props.outerTickSize;
    } else {
      d = 'M' + sign * props.outerTickSize + ',' + range[0] + 'H0V' + range[1] + 'H' + sign * props.outerTickSize;
    }

    return React.createElement('path', {
      className: 'domain',
      d: d,
      style: {
        shapeRendering: 'crispEdges'
      },
      fill: props.fill,
      stroke: props.stroke,
      strokeWidth: props.strokeWidth
    });
  }
});
