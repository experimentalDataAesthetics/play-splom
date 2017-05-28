/**
 * https://github.com/esbullington/react-d3
 */

import React from 'react';
import PropTypes from 'prop-types';
import d3 from 'd3';
import AxisTicks from './AxisTicks';
import AxisLine from './AxisLine';
import Label from './Label';

/**
 * XAxis with lines, ticks and string label
 *
 * source:
 * https://github.com/esbullington/react-d3
 */
export default React.createClass({
  displayName: 'XAxis',

  propTypes: {
    fill: PropTypes.string,
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    stroke: PropTypes.string,
    strokeWidth: PropTypes.string,
    tickStroke: PropTypes.string,
    tickTextStroke: PropTypes.string,
    xAxisClassName: PropTypes.string,
    xAxisLabel: PropTypes.string,
    xAxisTickValues: PropTypes.array,
    xScale: PropTypes.func.isRequired,
    xOrient: PropTypes.oneOf(['top', 'bottom']),
    yOrient: PropTypes.oneOf(['left', 'right']),
    gridVertical: PropTypes.bool,
    gridVerticalStroke: PropTypes.string,
    gridVerticalStrokeWidth: PropTypes.number,
    gridVerticalStrokeDash: PropTypes.string
  },

  getDefaultProps: function getDefaultProps() {
    return {
      fill: 'none',
      stroke: 'none',
      strokeWidth: '1',
      tickStroke: '#000',
      xAxisClassName: 'rd3-x-axis',
      xOrient: 'bottom',
      yOrient: 'left'
    };
  },

  render: function render() {
    const props = this.props;

    let tickArguments;
    if (typeof props.xAxisTickCount !== 'undefined') {
      tickArguments = [props.xAxisTickCount];
    }

    if (typeof props.xAxisTickInterval !== 'undefined') {
      tickArguments = [d3.time[props.xAxisTickInterval.unit], props.xAxisTickInterval.interval];
    }

    let ticks;
    if (props.xAxisTickCount !== 0) {
      ticks = React.createElement(AxisTicks, {
        tickValues: props.xAxisTickValues,
        tickFormatting: props.tickFormatting,
        tickArguments,
        tickStroke: props.tickStroke,
        tickTextStroke: props.tickTextStroke,
        innerTickSize: props.tickSize,
        scale: props.xScale,
        orient: props.xOrient,
        orient2nd: props.yOrient,
        height: props.height,
        width: props.width,
        horizontal: props.horizontal,
        gridVertical: props.gridVertical,
        gridVerticalStroke: props.gridVerticalStroke,
        gridVerticalStrokeWidth: props.gridVerticalStrokeWidth,
        gridVerticalStrokeDash: props.gridVerticalStrokeDash
      });
    }

    return React.createElement(
      'g',
      {
        className: props.xAxisClassName,
        transform: `translate(0, ${props.height})`
      },
      ticks,
      React.createElement(
        AxisLine,
        Object.assign(
          {
            scale: props.xScale,
            stroke: props.stroke,
            orient: props.xOrient,
            outerTickSize: props.tickSize
          },
          props
        )
      ),
      <Label
        label={props.xAxisLabel}
        textColor={props.tickTextStroke}
        offset={props.xAxisLabelOffset}
        orient={props.xOrient}
        height={props.height}
        width={props.width}
      />
    );
  }
});
