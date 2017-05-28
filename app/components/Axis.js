import React from 'react';
import PropTypes from 'prop-types';
import XAxis from './XAxis';
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

    return (
      <Box x={this.props.xOffset} y={this.props.yOffset} sideLength={sideLength}>
        <XAxis
          key="x"
          orient="bottom"
          label={this.props.xLabel}
          scale={this.props.xScale}
          width={sideLength}
          height={sideLength}
          stroke={textColor}
          tickStroke={textColor}
          tickTextStroke={textColor}
          tickCount={numTicks}
          labelOffset={40}
        />
        <XAxis
          key="y"
          orient="left"
          label={this.props.yLabel}
          scale={this.props.yScale}
          width={sideLength}
          height={sideLength}
          stroke={textColor}
          tickStroke={textColor}
          tickTextStroke={textColor}
          tickCount={numTicks}
          labelOffset={40}
        />
      </Box>
    );
  }
}
