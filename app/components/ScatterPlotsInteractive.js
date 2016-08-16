import React from 'react';
import h from 'react-hyperscript';
import * as _ from 'lodash';
import connect from '../utils/reduxers';

import {
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

// import ScatterPlotClickSurface from './ScatterPlotClickSurface';
import Axis from './Axis';
import SelectArea from './SelectArea';
import style from './ScatterPlots.css';

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

  setPointsIn(area, box, points) {
    // area is inverted y
    // points are normal y
    const sideLength = this.props.layout.sideLength;
    const minx = area.x;
    const maxx = minx + area.width;
    const miny = sideLength - area.y - area.height;
    const maxy = sideLength - area.y;
    const pointsIn = [];
    points.forEach((xy, i) => {
      if ((xy[0] >= minx)
          && (xy[0] <= maxx)
          && (xy[1] >= miny)
          && (xy[1] <= maxy)) {
        pointsIn.push(i);
      }
    });

    // keeping some micro-state values in this.
    // its not ui state, does not require a re-render
    // and it is not application state.
    // its just cacheing for performance
    const next = {
      m: box.m,
      n: box.n,
      pointsIn
    };

    const last = this.last || {};
    if (last.m !== next.m || last.n !== next.n) {
      this.setState({
        last: {
          m: next.m,
          n: next.n
        }
      });
    }

    if (!_.isEqual(this.last, next)) {
      this.last = next;
      this.props.setPointsUnderBrush(box.m, box.n, pointsIn);
    }
  }

  setHoveringBox(box) {
    // this causes a full update
    // could wrap Axis in something that connects to hovering featureSideLengthScale
    // muiTheme
    this.props.setHovering(box.m, box.n);
  }

  render() {
    const sideLength = this.props.layout.sideLength;
    const layout = this.props.layout;
    const innerSideLength = sideLength - layout.margin;
    const children = [];

    const getBox = (m, n) => this.props.layout.boxes[m * this.props.numFeatures + n];

    if (this.props.featureSideLengthScale.length > 0) {
      if (_.isNumber(this.props.hovering.m)) {
        const hovx = (this.props.hovering.m || 0);
        const hovy = (this.props.hovering.n || 0);
        const featx = this.props.featureSideLengthScale[hovx];
        const featy = this.props.featureSideLengthScale[hovy];
        const box = getBox(hovx, hovy);
        if (box) {
          children.push(h(Axis, {
            xOffset: box.x,
            yOffset: box.y,
            sideLength: innerSideLength,
            muiTheme: this.props.muiTheme,
            xScale: featx.mappedScale,
            yScale: featy.mappedScale,
            xLabel: featx.feature.name,
            yLabel: featy.feature.name
          }));
        }
      }
    }

    const s = {
      box: {
        m: _.get(this.props.loopMode, 'box.m'),
        n: _.get(this.props.loopMode, 'box.n')
      },
      last: {
        m: _.get(this.state, 'last.m'),
        n: _.get(this.state, 'last.n')
      }
    };

    // pending should be erased once it becomes active
    const getClassName = (box) => {
      if ((s.box.m === box.m) && (s.box.n === box.n)) {
        return style.looping;
      }

      if ((s.last.m === box.m) && (s.last.n === box.n)) {
        return style.focused;
      }

      return 'none';
    };

    layout.boxes.forEach((box) => {
      // TODO: move to a selector
      const featx = this.props.features[box.m].values;
      const featy = this.props.features[box.n].values;
      const points = _.zip(featx, featy);

      const isLastFocused =
        (_.get(this.state, 'last.m') === box.m) &&
        (_.get(this.state, 'last.n') === box.n);

      // Each of these handle all mouse events
      const selectedArea = h(SelectArea, {
        selected: {
          x: 0,
          y: 0,
          width: 0,
          height: 0
        },
        domain: {
          x: box.x,
          y: box.y,
          width: innerSideLength,
          height: innerSideLength
        },
        base: [box.baseClientX, box.baseClientY],
        onChange: (area) => this.setPointsIn(area, box, points),
        onMouseEnter: () => this.setHoveringBox(box),
        onMetaClick: () => {
          if (this.props.toggleLoopMode) {
            this.props.toggleLoopMode(box.m, box.n);
          }
        },
        show: isLastFocused,
        overlayClassName: getClassName(box)
      });

      children.push(selectedArea);

      // const sp = h(ScatterPlotClickSurface, {
      //   m: box.m,
      //   n: box.n,
      //   points,
      //   xOffset: box.x,
      //   yOffset: box.y,
      //   // for calculating mouse down by clientX/Y
      //   baseClientX: box.baseClientX,
      //   baseClientY: box.baseClientY,
      //   sideLength: innerSideLength,
      //   setPointsUnderBrush: this.props.setPointsUnderBrush,
      //   setHovering: this.props.setHovering,
      //   toggleLoopMode: this.props.toggleLoopMode,
      //   muiTheme: this.props.muiTheme,
      //   isLooping,
      //   isPending
      // });
      // children.push(sp);
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
