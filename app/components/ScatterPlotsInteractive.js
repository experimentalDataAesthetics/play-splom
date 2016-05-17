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
  getMuiTheme
} from '../selectors/index';

import ScatterPlotClickSurface from '../components/ScatterPlotClickSurface';

const unset = {};
const getLoopMode = (state) => state.interaction.loopMode || unset;

const mapStateToProps = createSelector(
  [getLoopMode, getMuiTheme],
  (loopMode, muiTheme) => ({loopMode, muiTheme}));

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
    muiTheme: React.PropTypes.object.isRequired,
    features: React.PropTypes.array.isRequired,
    setPointsUnderBrush: React.PropTypes.func.isRequired,
    setHovering: React.PropTypes.func.isRequired,
    toggleLoopMode: React.PropTypes.func.isRequired
  };

  render() {
    // console.log('scatterplots interactive render');
    const children = [];

    const sideLength = this.props.layout.sideLength;

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
