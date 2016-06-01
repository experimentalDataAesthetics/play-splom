import React from 'react';
import h from 'react-hyperscript';
import * as _ from 'lodash';
import connect from '../utils/reduxers';

import {
  // showBrush,
  setPointsUnderBrush,
  toggleLoopMode
} from '../actions/interaction';
import {
  setHovering
} from '../actions/ui';
import {
  getMuiTheme,
  getFeatureSideLengthScale
} from '../selectors/index';

import ScatterPlotClickSurface from '../components/ScatterPlotClickSurface';
import Axis from '../components/Axis';

const unset = {};

const selectors = {
  loopMode: (state) => state.interaction.loopMode || unset,
  muiTheme: getMuiTheme,
  featureSideLengthScale: getFeatureSideLengthScale,
  hovering: (state) => state.ui.hovering || unset
};

const handlers = {
  setPointsUnderBrush,
  setHovering,
  toggleLoopMode
};

class ScatterPlotsInteractive extends React.Component {

  static propTypes = {
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    numFeatures: React.PropTypes.number.isRequired,
    loopMode: React.PropTypes.object.isRequired,
    layout: React.PropTypes.object.isRequired,
    hovering: React.PropTypes.object.isRequired,
    muiTheme: React.PropTypes.object.isRequired,
    featureSideLengthScale: React.PropTypes.array.isRequired,
    features: React.PropTypes.array.isRequired,
    setPointsUnderBrush: React.PropTypes.func.isRequired,
    setHovering: React.PropTypes.func.isRequired,
    toggleLoopMode: React.PropTypes.func.isRequired
  };

  render() {
    const sideLength = this.props.layout.sideLength;
    const children = [];
    const layout = this.props.layout;

    if (this.props.featureSideLengthScale.length > 0) {
      const hovx = (this.props.hovering.m || 0);
      const hovy = (this.props.hovering.n || 0);
      const featx = this.props.featureSideLengthScale[hovx];
      const featy = this.props.featureSideLengthScale[hovy];
      const axisX = hovx * sideLength;
      const axisY = hovy * sideLength;

      children.push(h(Axis, {
        xOffset: axisX,
        yOffset: axisY,
        sideLength: sideLength - layout.margin,
        muiTheme: this.props.muiTheme,
        xScale: featx.mappedScale,
        yScale: featy.invertedMappedScale,
        xLabel: featx.feature.name,
        yLabel: featy.feature.name
      }));
    }

    layout.boxes.forEach((box) => {
      const loopMode = this.props.loopMode;
      const featx = this.props.features[box.m].values;
      const featy = this.props.features[box.n].values;
      const points = _.zip(featx, featy);

      const isLooping =
        (_.get(loopMode, 'nowPlaying.m') === box.m) &&
        (_.get(loopMode, 'nowPlaying.n') === box.n);

      const isPending =
        (_.get(loopMode, 'pending.m') === box.m) &&
        (_.get(loopMode, 'pending.n') === box.n);

      const sp = h(ScatterPlotClickSurface, {
        m: box.m,
        n: box.n,
        points,
        xOffset: box.x,
        yOffset: box.y,
        // for calculating mouse down by clientX/Y
        baseClientX: box.baseClientX,
        baseClientY: box.baseClientY,
        sideLength: sideLength - layout.margin,
        setPointsUnderBrush: this.props.setPointsUnderBrush,
        setHovering: this.props.setHovering,
        toggleLoopMode: this.props.toggleLoopMode,
        muiTheme: this.props.muiTheme,
        isLooping,
        isPending
      });

      children.push(sp);
    });

    return h(
      'g',
      {
        width: this.props.width,
        height: this.props.height,
        className: 'ScatterPlotsInteractive'
      },
      children
    );
  }
}

export default connect(selectors, handlers)(ScatterPlotsInteractive);
