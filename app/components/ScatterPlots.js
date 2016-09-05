import React from 'react';
import h from 'react-hyperscript';
import * as _ from 'lodash';

import muiThemeable from 'material-ui/styles/muiThemeable';
import ScatterPlot from '../components/ScatterPlot';
import style from './ScatterPlots.css';

/**
 * A single component that adds a ScatterPlot for each feature pair plot.
 *
 * Also paints the title in the background.
 */
class ScatterPlots extends React.Component {

  static propTypes = {
    height: React.PropTypes.number.isRequired,
    width: React.PropTypes.number.isRequired,
    dataset: React.PropTypes.object,
    features: React.PropTypes.array.isRequired,
    numFeatures: React.PropTypes.number.isRequired,
    layout: React.PropTypes.object.isRequired,
    muiTheme: React.PropTypes.object
  };

  render() {
    const children = [];

    if (this.props.dataset) {
      const title = h('text', {
        x: 50,
        y: this.props.layout.svgStyle.height - 150,
        className: style.title
      }, [this.props.dataset.name]);
      children.push(title);

      const sideLength = this.props.layout.sideLength;
      const margin = this.props.layout.margin;
      const columnNames = this.props.dataset.columnNames;

      this.props.layout.boxes.forEach((box) => {
        // features go across the x
        // and down the y
        // SVG coords also go down the y
        const xName = columnNames[box.m];
        const yName = columnNames[box.n];

        const points = _.zip(
          this.props.features[box.m].values,
          this.props.features[box.n].yValues);

        const sp = h(ScatterPlot, {
          points,
          m: box.m,
          n: box.n,
          xName,
          yName,
          xOffset: box.x,
          yOffset: box.y,
          sideLength: sideLength - margin,
          muiTheme: this.props.muiTheme,
          pointsUnderBrush: this.props.pointsUnderBrush
        });

        children.push(sp);
      });
    }

    return h(
      'g',
      {
        width: this.props.width,
        height: this.props.height,
        className: 'scatterplots'
      },
      children
    );
  }
}

export default muiThemeable()(ScatterPlots);
