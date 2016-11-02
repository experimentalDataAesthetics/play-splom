import React from 'react';
import h from 'react-hyperscript';
import * as _ from 'lodash';
import connect from '../utils/reduxers';

import {
  getMuiTheme,
  getFeatureSideLengthScale,
  getLayout,
  getNumFeatures
} from '../selectors/index';

import Axis from './Axis';


/**
 * Shows the Axis on top of the plot that you are hovering over
 */
class HoveringAxis extends React.Component {

  static propTypes = {
    muiTheme: React.PropTypes.object.isRequired,
    layout: React.PropTypes.object.isRequired,
    numFeatures: React.PropTypes.number.isRequired,
    featureSideLengthScale: React.PropTypes.array.isRequired,
    hovering: React.PropTypes.object.isRequired
  };

  render() {
    const sideLength = this.props.layout.sideLength;
    const layout = this.props.layout;
    const innerSideLength = sideLength - layout.margin;
    const getBox = (m, n) => this.props.layout.boxes[(m * this.props.numFeatures) + n];

    if (this.props.featureSideLengthScale.length > 0) {
      if (_.isNumber(this.props.hovering.m)) {
        const hovx = (this.props.hovering.m || 0);
        const hovy = (this.props.hovering.n || 0);
        const featx = this.props.featureSideLengthScale[hovx];
        const featy = this.props.featureSideLengthScale[hovy];
        // if loading a new dataset it is possible for the current hover to be invalidated.
        if (featx && featy) {
          const box = getBox(hovx, hovy);
          if (box) {
            return h(Axis, {
              xOffset: box.x,
              yOffset: box.y,
              sideLength: innerSideLength,
              muiTheme: this.props.muiTheme,
              xScale: featx.mappedScale,
              yScale: featy.mappedScale,
              xLabel: featx.feature.name,
              yLabel: featy.feature.name
            });
          }
        }
      }
    }
    return null;
  }
}

const unset = {};

export default connect({
  muiTheme: getMuiTheme,
  layout: getLayout,
  featureSideLengthScale: getFeatureSideLengthScale,
  hovering: (state) => state.ui.hovering || unset,
  numFeatures: getNumFeatures
})(HoveringAxis);
