import React from 'react';
import h from 'react-hyperscript';
import * as _ from 'lodash';

import ScatterPlot from '../components/ScatterPlot';
import muiThemeable from 'material-ui/styles/muiThemeable';
import style from './ScatterPlots.css';

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
        y: 50,
        className: style.title,
        style: {
          fill: this.props.muiTheme.palette.textColor
        }
      }, [this.props.dataset.name]);
      children.push(title);

      const sideLength = this.props.layout.sideLength;
      const margin = this.props.layout.margin;
      const columnNames = this.props.dataset.columnNames;

      if (sideLength > 0) {
        for (let m = 0; m < this.props.numFeatures; m++) {
          const x = m * sideLength;
          for (let n = 0; n < this.props.numFeatures; n++) {
            if (m === n) {
              continue;
            }

            // features go across the x
            // and down the y
            // SVG coords also go down the y
            const y = n * sideLength;
            const xName = columnNames[m];
            const yName = columnNames[n];

            const points = _.zip(
              this.props.features[m].values,
              this.props.features[n].yValues);

            const sp = h(ScatterPlot, {
              points,
              m,
              n,
              xName,
              yName,
              xOffset: x,
              yOffset: y,
              sideLength: sideLength - margin,
              muiTheme: this.props.muiTheme
            });

            children.push(sp);
          }
        }
      }
    }

    return h(
      'g',
      {
        height: this.props.height,
        width: this.props.width,
        className: 'scatterplots'
      },
      children
    );
  }
}

export default muiThemeable()(ScatterPlots);
