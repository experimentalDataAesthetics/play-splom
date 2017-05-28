import React from 'react';
import h from 'react-hyperscript';
// import _ from 'lodash';

import connect from '../utils/reduxers';
import ScatterPlot from '../components/ScatterPlot';

import {
  getPointsForPlot,
  getLayout,
  getNumFeatures,
  getPointsUnderBrush,
  getMuiTheme
} from '../selectors/index';

/**
 * Renders just the points that are selected/within the brush.
 *
 * This adds a `ScatterPlot` for each box but gives each one
 * a different style and adds only the points that are currently active.
 *
 * It is on top of the `ScatterPlot`s that display all of the points,
 * and simply paints identical points (but just for the selected
 * points) above them. This means only updating a smaller number of points
 * (eg. 30) and not all points for the dataset (eg. 500) -- multiplied
 * by the number of boxes (eg. 25)
 */
class ScatterPlotsActivePoints extends React.PureComponent {
  render() {
    const children = [];

    if (this.props.pointsUnderBrush.length) {
      const sideLength = this.props.layout.sideLength;
      const margin = this.props.layout.margin;
      const innerSide = sideLength - margin;

      this.props.layout.boxes.forEach(box => {
        const points = [];

        if (this.props.pointsUnderBrush.length <= 200) {
          this.props.pointsUnderBrush.forEach(i => {
            points.push([
              this.props.features[box.m].values[i],
              this.props.features[box.n].yValues[i]
            ]);
          });

          const sp = h(ScatterPlot, {
            xOffset: box.x,
            yOffset: box.y,
            points,
            hideAxis: true,
            sideLength: innerSide,
            muiTheme: this.props.muiTheme,
            className: 'active'
          });

          children.push(sp);
        }
      });
    }

    return h(
      'g',
      {
        width: this.props.width,
        height: this.props.height,
        className: 'scatterplots-active-points'
      },
      children
    );
  }
}

export default connect({
  features: getPointsForPlot,
  muiTheme: getMuiTheme,
  layout: getLayout,
  numFeatures: getNumFeatures,
  pointsUnderBrush: getPointsUnderBrush
})(ScatterPlotsActivePoints);
