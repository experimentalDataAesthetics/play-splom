import React from 'react';
import h from 'react-hyperscript';
import _ from 'lodash';

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
    layout: React.PropTypes.object.isRequired,
    muiTheme: React.PropTypes.object
  };

  render() {
    const { muiTheme, layout, dataset } = this.props;
    const children = [];

    if (dataset) {
      const title = h('text', {
        x: 50,
        y: layout.svgStyle.height - 150,
        className: style.title,
        style: {
          stroke: muiTheme.palette.title
        }
      }, [dataset.name]);
      children.push(title);

      const sideLength = layout.sideLength;
      const margin = layout.margin;
      const columnNames = dataset.columnNames;

      layout.boxes.forEach((box) => {
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
          muiTheme
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
