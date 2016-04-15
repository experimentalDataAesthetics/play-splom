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

// need from dataset: name columnNames
const mapStateToProps = createSelector(
  [
    getDatasetMetadata,
    getPointsForPlot,
    getLayout,
    getNumFeatures
  ],
  (dataset, features, layout, numFeatures) => {
    console.log('selector reruns');
    // dataset changes ?
    return ({
      dataset, features, layout, numFeatures
    });
  });

class ScatterPlotsContainer extends Component {

  static propTypes = {
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    dataset: React.PropTypes.object,
    features: React.PropTypes.array.isRequired,
    layout: React.PropTypes.object.isRequired,
    numFeatures: React.PropTypes.number.isRequired
  };

  shouldComponentUpdate(nextProps, nextState) {

    console.log('spc props', this.props === nextProps, this.props, nextProps);

    // why is this changing ?
    // is equal but not same object
    console.log('dataset', this.props.dataset === nextProps.dataset);
    console.log(_.isEqual(this.props.dataset, nextProps.dataset), 'isEqual');

    console.log('features', this.props.features === nextProps.features);
    console.log('layout', this.props.layout === nextProps.layout);
    // both 14 ?
    console.log('numFeatures', this.props.numFeatures === nextProps.numFeatures);

    return true;
  }

  render() {
    // what changed ?
    console.log('spc renders');

    // new object each time
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
