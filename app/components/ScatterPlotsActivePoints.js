import React from 'react';
import h from 'react-hyperscript';
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
 * Renders just the points that are selected/within the brush
 * on top of the normal plot.
 */
class ScatterPlotsActivePoints extends React.Component {

  render() {
    const children = [];

    if (this.props.pointsUnderBrush.length) {
      const sideLength = this.props.layout.sideLength;
      const margin = this.props.layout.margin;
      const innerSide = sideLength - margin;

      this.props.layout.boxes.forEach((box) => {
        const points = [];
        this.props.pointsUnderBrush.forEach((i) => {
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
