
/**
 * https://github.com/esbullington/react-d3
 */

import React from 'react';
import d3 from 'd3';
import AxisTicks from './AxisTicks';
import AxisLine from './AxisLine';
import Label from './Label';

export default React.createClass({

  displayName: 'XAxis',

  propTypes: {
    fill: React.PropTypes.string,
    height: React.PropTypes.number.isRequired,
    width: React.PropTypes.number.isRequired,
    horizontalChart: React.PropTypes.bool,
    stroke: React.PropTypes.string,
    strokeWidth: React.PropTypes.string,
    tickStroke: React.PropTypes.string,
    tickTextStroke: React.PropTypes.string,
    xAxisClassName: React.PropTypes.string,
    xAxisLabel: React.PropTypes.string,
    xAxisTickValues: React.PropTypes.array,
    xAxisOffset: React.PropTypes.number,
    xScale: React.PropTypes.func.isRequired,
    xOrient: React.PropTypes.oneOf(['top', 'bottom']),
    yOrient: React.PropTypes.oneOf(['left', 'right']),
    gridVertical: React.PropTypes.bool,
    gridVerticalStroke: React.PropTypes.string,
    gridVerticalStrokeWidth: React.PropTypes.number,
    gridVerticalStrokeDash: React.PropTypes.string
  },

  getDefaultProps: function getDefaultProps() {
    return {
      fill: 'none',
      stroke: 'none',
      strokeWidth: '1',
      tickStroke: '#000',
      xAxisClassName: 'rd3-x-axis',
      xAxisOffset: 0,
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

    return React.createElement(
      'g',
      {
        className: props.xAxisClassName,
        transform: `translate(0 ,${props.xAxisOffset + props.height})`
      },
      React.createElement(AxisTicks, {
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
        horizontalChart: props.horizontalChart,
        gridVertical: props.gridVertical,
        gridVerticalStroke: props.gridVerticalStroke,
        gridVerticalStrokeWidth: props.gridVerticalStrokeWidth,
        gridVerticalStrokeDash: props.gridVerticalStrokeDash
      }),
      React.createElement(AxisLine, Object.assign({
        scale: props.xScale,
        stroke: props.stroke,
        orient: props.xOrient,
        outerTickSize: props.tickSize
      }, props)),
      <Label
        horizontalChart={props.horizontalChart}
        label={props.xAxisLabel}
        textColor={props.tickTextStroke}
        offset={props.xAxisLabelOffset}
        orient={props.xOrient}
        margins={props.margins}
        height={props.height}
        width={props.width}
      />
    );
  }
});
