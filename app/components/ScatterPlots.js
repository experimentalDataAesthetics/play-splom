import React from 'react';
import h from 'react-hyperscript';
import * as _ from 'lodash';

import ScatterPlot from '../components/ScatterPlot';

export default class ScatterPlots extends React.Component {

  static propTypes = {
    height: React.PropTypes.number.isRequired,
    width: React.PropTypes.number.isRequired,
    dataset: React.PropTypes.object,
    features: React.PropTypes.array.isRequired,
    layout: React.PropTypes.object.isRequired,
    numFeatures: React.PropTypes.number.isRequired
  };

  render() {
    const children = [];

    if (this.props.dataset) {
      const title = h('text', {
        x: 50,
        y: 50,
        className: 'dataset-title'
        // transform: 'rotate(90)'
      }, [this.props.dataset.name]);
      children.push(title);

      const sideLength = this.props.layout.sideLength;
      const margin = this.props.layout.margin;
      const columnNames = this.props.dataset.columnNames;

      if (sideLength > 0) {
        for (let m = 0; m < this.props.numFeatures; m++) {
          const x = m * sideLength;
          for (let n = 0; n < this.props.numFeatures; n++) {
            if (m >= n) {
              continue;
            }

            const y = n * sideLength;
            const xName = columnNames[m];
            const yName = columnNames[n];

            const featx = this.props.features[m].values;
            const featy = this.props.features[n].values;
            const points = _.zip(featx, featy);

            const sp = h(ScatterPlot, {
              points,
              m,
              n,
              xName,
              yName,
              margin,
              xOffset: x + margin,
              yOffset: y + margin,
              sideLength: sideLength - margin
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
