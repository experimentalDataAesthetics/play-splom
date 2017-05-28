import React from 'react';
import PropTypes from 'prop-types';
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
    fill: PropTypes.string,
    stroke: PropTypes.string,
    strokeWidth: PropTypes.string,
    tickStroke: PropTypes.string,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    yAxisClassName: PropTypes.string,
    yAxisLabel: PropTypes.string,
    yAxisTickValues: PropTypes.array,
    xOrient: PropTypes.oneOf(['top', 'bottom']),
    yOrient: PropTypes.oneOf(['left', 'right']),
    yScale: PropTypes.func.isRequired,
    gridVertical: PropTypes.bool,
    gridVerticalStroke: PropTypes.string,
    gridVerticalStrokeWidth: PropTypes.number,
    gridVerticalStrokeDash: PropTypes.string
  },

  getDefaultProps: function getDefaultProps() {
    return {
      fill: 'none',
      stroke: '#000',
      strokeWidth: '1',
      tickStroke: '#000',
      yAxisClassName: 'rd3-y-axis',
      yAxisLabel: '',
      xOrient: 'bottom',
      yOrient: 'left'
    };
  },

  render: function render() {
    const props = this.props;

    const t = props.yOrient === 'right' ? `translate(${props.width}, 0)` : null;

    let tickArguments;
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
        tickArguments,
        tickFormatting: props.tickFormatting,
        tickStroke: props.tickStroke,
        tickTextStroke: props.tickTextStroke,
        tickValues: props.yAxisTickValues,
        scale: props.yScale,
        height: props.height,
        width: props.width,
        horizontal: props.horizontal,
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
      React.createElement(
        AxisLine,
        Object.assign(
          {
            orient: props.yOrient,
            outerTickSize: props.tickSize,
            scale: props.yScale,
            stroke: props.stroke
          },
          props
        )
      ),
      <Label
        label={props.yAxisLabel}
        textColor={props.tickTextStroke}
        offset={props.yAxisLabelOffset}
        orient={props.yOrient}
        width={props.width}
        height={props.height}
      />
    );
  }
});
