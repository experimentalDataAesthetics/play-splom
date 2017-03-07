
import React from 'react';
import d3 from 'd3';
import AxisTicks from './AxisTicks';
import AxisLine from './AxisLine';
import Label from './Label';


/**
 * YAxis with lines, ticks and string label
 *
 * source:
 * https://github.com/esbullington/react-d3
 */
export default React.createClass({

  displayName: 'YAxis',

  propTypes: {
    fill: React.PropTypes.string,
    stroke: React.PropTypes.string,
    strokeWidth: React.PropTypes.string,
    tickStroke: React.PropTypes.string,
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    horizontalChart: React.PropTypes.bool,
    yAxisClassName: React.PropTypes.string,
    yAxisLabel: React.PropTypes.string,
    yAxisOffset: React.PropTypes.number,
    yAxisTickValues: React.PropTypes.array,
    xOrient: React.PropTypes.oneOf(['top', 'bottom']),
    yOrient: React.PropTypes.oneOf(['left', 'right']),
    yScale: React.PropTypes.func.isRequired,
    gridVertical: React.PropTypes.bool,
    gridVerticalStroke: React.PropTypes.string,
    gridVerticalStrokeWidth: React.PropTypes.number,
    gridVerticalStrokeDash: React.PropTypes.string
  },

  getDefaultProps: function getDefaultProps() {
    return {
      fill: 'none',
      stroke: '#000',
      strokeWidth: '1',
      tickStroke: '#000',
      yAxisClassName: 'rd3-y-axis',
      yAxisLabel: '',
      yAxisOffset: 0,
      xOrient: 'bottom',
      yOrient: 'left'
    };
  },

  render: function render() {

    var props = this.props;

    var t;
    if (props.yOrient === 'right') {
      t = 'translate(' + (props.yAxisOffset + props.width) + ', 0)';
    } else {
      t = 'translate(' + props.yAxisOffset + ', 0)';
    }

    var tickArguments;
    if (props.yAxisTickCount) {
      tickArguments = [props.yAxisTickCount];
    }

    if (props.yAxisTickInterval) {
      tickArguments = [d3.time[props.yAxisTickInterval.unit], props.yAxisTickInterval.interval];
    }

    let ticks;
    if (props.yAxisTickCount !== 0) {
      ticks = React.createElement(AxisTicks, {
        innerTickSize: props.tickSize,
        orient: props.yOrient,
        orient2nd: props.xOrient,
        tickArguments: tickArguments,
        tickFormatting: props.tickFormatting,
        tickStroke: props.tickStroke,
        tickTextStroke: props.tickTextStroke,
        tickValues: props.yAxisTickValues,
        scale: props.yScale,
        height: props.height,
        width: props.width,
        horizontalChart: props.horizontalChart,
        gridHorizontal: props.gridHorizontal,
        gridHorizontalStroke: props.gridHorizontalStroke,
        gridHorizontalStrokeWidth: props.gridHorizontalStrokeWidth,
        gridHorizontalStrokeDash: props.gridHorizontalStrokeDash
      });
    }

    return React.createElement(
      'g',
      {
        className: props.yAxisClassName,
        transform: t
      },
      ticks,
      React.createElement(AxisLine, Object.assign({
        orient: props.yOrient,
        outerTickSize: props.tickSize,
        scale: props.yScale,
        stroke: props.stroke
      }, props)),
      <Label
        horizontalChart={props.horizontalChart}
        label={props.yAxisLabel}
        textColor={props.tickTextStroke}
        offset={props.yAxisLabelOffset}
        orient={props.yOrient}
        margins={props.margins}
        width={props.width}
        height={props.height}
      />
    );
  }
});
