import React from 'react';
import PropTypes from 'prop-types';
import h from 'react-hyperscript';
import XAxis from './XAxis';
import YAxis from './YAxis';
import Box from './Box';

/**
 * Standard pair of X and Y axis with ticks and labelling.
 *
 * This combines the X and Y into one component.
 */
export default class Axis extends React.Component {
  static propTypes = {
    xOffset: PropTypes.number.isRequired,
    yOffset: PropTypes.number.isRequired,
    sideLength: PropTypes.number.isRequired,
    muiTheme: PropTypes.object.isRequired,
    xScale: PropTypes.func.isRequired,
    yScale: PropTypes.func.isRequired,
    xLabel: PropTypes.string,
    yLabel: PropTypes.string
  };

  render() {
    const sideLength = this.props.sideLength;
    const textColor = this.props.muiTheme.palette.textColor;
    const numTicks = Math.floor(Math.max(sideLength / 75));

    const children = [
      h(XAxis, {
        key: 'x',
        xAxisLabel: this.props.xLabel,
        xScale: this.props.xScale,
        height: sideLength,
        width: sideLength,
        stroke: textColor,
        tickStroke: textColor,
        tickTextStroke: textColor,
        xAxisTickCount: numTicks,
        xAxisLabelOffset: 40
      }),
      h(YAxis, {
        key: 'y',
        yAxisLabel: this.props.yLabel,
        yScale: this.props.yScale,
        height: sideLength,
        width: sideLength,
        stroke: textColor,
        tickStroke: textColor,
        tickTextStroke: textColor,
        yAxisTickCount: numTicks,
        yAxisLabelOffset: 40
      })
    ];

    return (
      <Box x={this.props.xOffset} y={this.props.yOffset} sideLength={sideLength}>
        {children}
      </Box>
    );
  }
}
