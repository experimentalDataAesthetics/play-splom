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
    let children;
    const { muiTheme, sideLength } = this.props;
    const points = Points({
      sideLength,
      points: this.props.points,
      // active or fill
      color: muiTheme.palette[this.props.className] || muiTheme.palette.point
    });

    // draw a minimal L-shaped axis
    if (!this.props.hideAxis) {
      const axis = LAxis({
        sideLength,
        color: muiTheme.tableRow.borderColor
      });
      children = [axis].concat(points);
    } else {
      children = points;
    }

    return (
      <Box x={this.props.xOffset} y={this.props.yOffset} sideLength={sideLength}>
        {children}
      </Box>
    );
  }
}
