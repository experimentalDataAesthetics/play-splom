import React from 'react';
import h from 'react-hyperscript';
import * as _ from 'lodash';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
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
const getLoopMode = (state) => state.interaction.loopMode || unset;
const getHovering = (state) => state.ui.hovering || unset;

const mapStateToProps = createSelector(
  [getLoopMode, getMuiTheme, getFeatureSideLengthScale, getHovering],
  (loopMode, muiTheme, featureSideLengthScale, hovering) => {
    return {
      loopMode,
      muiTheme,
      featureSideLengthScale,
      hovering
    };
  });

const mapDispatchToProps = (dispatch) => {
  return {
    // showBrush: (show, clientX, clientY) => {
    //   dispatch(showBrush(show, clientX, clientY));
    // },

    setPointsUnderBrush: (m, n, indices) => {
      dispatch(setPointsUnderBrush(m, n, indices));
    },

    setHovering: (m, n) => {
      dispatch(setHovering(m, n));
    },

    toggleLoopMode: (m, n) => {
      dispatch(toggleLoopMode(m, n));
    }
  };
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
        sideLength: sideLength - this.props.layout.margin,
        muiTheme: this.props.muiTheme,
        // xScale: featx.feature.scale,
        xScale: featx.invertedScale,  // wtf ?
        yScale: featy.invertedScale,
        xLabel: featx.feature.name,
        yLabel: featy.feature.name
      }));
    }

    if (sideLength > 0) {
      for (let m = 0; m < this.props.numFeatures; m++) {
        const x = m * sideLength;
        for (let n = 0; n < this.props.numFeatures; n++) {
          if (m === n) {
            continue;
          }

          const y = n * sideLength;

          const loopMode = this.props.loopMode;
          const featx = this.props.features[m].values;
          const featy = this.props.features[n].values;
          const points = _.zip(featx, featy);

          const isLooping =
            (_.get(loopMode, 'nowPlaying.m') === m) &&
            (_.get(loopMode, 'nowPlaying.n') === n);

          const isPending =
            (_.get(loopMode, 'pending.m') === m) &&
            (_.get(loopMode, 'pending.n') === n);

          const sp = h(ScatterPlotClickSurface, {
            m,
            n,
            points,
            xOffset: x,
            yOffset: y,
            baseClientX: x + this.props.layout.svgStyle.left,
            baseClientY: y,
            sideLength: sideLength - this.props.layout.margin,
            setPointsUnderBrush: this.props.setPointsUnderBrush,
            setHovering: this.props.setHovering,
            toggleLoopMode: this.props.toggleLoopMode,
            muiTheme: this.props.muiTheme,
            isLooping,
            isPending
          });

          children.push(sp);
        }
      }
    }

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

export default connect(mapStateToProps, mapDispatchToProps)(ScatterPlotsInteractive);
