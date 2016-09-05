import React, { Component } from 'react';
import h from 'react-hyperscript';
import connect from '../utils/reduxers';
import ScatterPlots from '../components/ScatterPlots';
import ScatterPlotsActivePoints from '../components/ScatterPlotsActivePoints';
import ScatterPlotsInteractive from '../components/ScatterPlotsInteractive';
import LoopPlayHead from '../components/LoopPlayHead';
import * as _ from 'lodash';

import {
  getPointsForPlot,
  getLayout,
  getNumFeatures,
  getDatasetMetadata
} from '../selectors/index';


/**
 * This holds all of the plotting and interactive components for the Scatter Plots.
 *
 * Goes inside the SVG, adds a g which layers each of these on top of each other:
 * - ScatterPlots
 * - ScatterPlotsActivePoints
 * - LoopPlayHead
 * - ScatterPlotsInteractive
 *
 */
class ScatterPlotsContainer extends Component {

  static propTypes = {
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    dataset: React.PropTypes.object,
    features: React.PropTypes.array.isRequired,
    layout: React.PropTypes.object.isRequired,
    numFeatures: React.PropTypes.number.isRequired
  };

  render() {
    const padding = this.props.layout.scatterPlotsMargin;
    const props = _.pick(this.props, [
      'dataset',
      'features',
      'layout',
      'numFeatures'
    ]);

    props.height = this.props.height - (padding * 2);
    props.width = this.props.width - (padding * 2);

    const plots = h(ScatterPlots, props);
    const activePoints = h(ScatterPlotsActivePoints);
    const loopPlayHead = h(LoopPlayHead);
    const surface = h(ScatterPlotsInteractive, props);

    return h(
      'g',
      {
        height: props.height,
        width: props.width,
        transform: `translate(${padding}, ${padding})`
      },
      [
        plots,
        activePoints,
        loopPlayHead,
        surface
      ]
    );

  }
}

export default connect({
  dataset: getDatasetMetadata,
  features: getPointsForPlot,
  layout: getLayout,
  numFeatures: getNumFeatures
})(ScatterPlotsContainer);
