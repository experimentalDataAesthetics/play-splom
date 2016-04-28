import React, { Component } from 'react';
import h from 'react-hyperscript';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import ScatterPlots from '../components/ScatterPlots';
import ScatterPlotsInteractive from '../components/ScatterPlotsInteractive';
import * as _ from 'lodash';

import {
  getPointsForPlot,
  getLayout,
  getNumFeatures,
  getDatasetMetadata
} from '../selectors/index';

const mapStateToProps = createSelector(
  [
    getDatasetMetadata,
    getPointsForPlot,
    getLayout,
    getNumFeatures
  ],
  (dataset, features, layout, numFeatures) => ({ dataset, features, layout, numFeatures }));

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
    const plots = h(ScatterPlots,
      _.pick(this.props, [
        'height',
        'width',
        'dataset',
        'features',
        'layout',
        'numFeatures'
      ])
    );

    const surface = h(ScatterPlotsInteractive,
      _.pick(this.props, [
        'width',
        'height',
        'numFeatures',
        'features',
        'layout'
      ])
    );

    return h(
      'g',
      {
        height: this.props.height,
        width: this.props.width
      },
      [
        plots,
        surface
      ]
    );

  }
}

export default connect(mapStateToProps)(ScatterPlotsContainer);
