import React from 'react';
import PropTypes from 'prop-types';
import d3 from 'd3';
import AxisTicks from './AxisTicks';
import AxisLine from './AxisLine';
import Label from './Label';

/**
 * X or Y Axis with lines, ticks and string label
 */
export default function XYAxis({
  width,
  height,
  tickTextStroke,
  label,
  tickCount,
  tickInterval,
  tickValues,
  tickSize,
  horizontal,
  labelOffset,
  scale,

  fill = 'none',
  stroke = 'none',
  strokeWidth = '1',
  tickStroke = '#000',
  orient = 'bottom'
}) {
  let tickArguments;
  if (typeof tickCount !== 'undefined') {
    tickArguments = [tickCount];
  }

  if (typeof tickInterval !== 'undefined') {
    tickArguments = [d3.time[tickInterval.unit], tickInterval.interval];
  }
  let ticks;
  if (tickCount !== 0) {
    ticks = React.createElement(AxisTicks, {
      tickValues,
      tickArguments,
      tickStroke,
      tickTextStroke,
      innerTickSize: tickSize,
      scale,
      orient,
      height,
      width,
      horizontal
    });
  }

  let transform;
  switch (orient) {
    case 'right':
      transform = `translate(${width}, 0)`;
      break;
    case 'left':
      break;
    case 'bottom':
    case 'top':
    default:
      transform = `translate(0, ${height})`;
  }

  return (
    <g transform={transform}>
      {ticks}
      <AxisLine
        fill={fill}
        orient={orient}
        scale={scale}
        stroke={stroke}
        outerTickSize={tickSize}
        strokeWidth={strokeWidth}
      />
      {label
        ? <Label
          label={label}
          textColor={tickTextStroke}
          offset={labelOffset}
          orient={orient}
          height={height}
          width={width}
        />
        : null}
    </g>
  );
}

XYAxis.propTypes = {
  fill: PropTypes.string,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  stroke: PropTypes.string,
  strokeWidth: PropTypes.string,
  tickStroke: PropTypes.string,
  tickTextStroke: PropTypes.string,
  tickCount: PropTypes.number,
  tickInterval: PropTypes.number,
  tickSize: PropTypes.number,
  horizontal: PropTypes.bool,
  labelOffset: PropTypes.number,

  label: PropTypes.string,
  tickValues: PropTypes.array,
  scale: PropTypes.func.isRequired,
  orient: PropTypes.oneOf(['top', 'bottom', 'left', 'right'])
};
