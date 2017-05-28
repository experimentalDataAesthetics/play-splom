import React from 'react';
import PropTypes from 'prop-types';
import LAxis from '../components/LAxis';
import Points from '../components/Points';
import Box from './Box';

/**
 * Renders a single scatter plot on a parent svg g
 */
export default class ScatterPlot extends React.Component {
  static propTypes = {
    xOffset: PropTypes.number.isRequired,
    yOffset: PropTypes.number.isRequired,
    sideLength: PropTypes.number.isRequired,
    points: PropTypes.array.isRequired,
    muiTheme: PropTypes.object.isRequired
  };

  render() {
    const { muiTheme, sideLength, className } = this.props;

    return (
      <Box x={this.props.xOffset} y={this.props.yOffset} sideLength={sideLength}>
        {this.props.hideAxis
          ? null
          : <LAxis sideLength={sideLength} color={muiTheme.tableRow.borderColor} />}
        <Points
          sideLength={sideLength}
          points={this.props.points}
          color={muiTheme.palette[className] || muiTheme.palette.point}
        />
      </Box>
    );
  }
}
