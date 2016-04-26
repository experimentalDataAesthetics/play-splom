import React from 'react';
import h from 'react-hyperscript';
import { isEqual } from 'lodash';

import styles from './ScatterPlotClickSurface.css';
const RADIUS = 10;  // for now

/**
 * Renders a single scatter plot on a parent svg g
 */
export default class ScatterPlotClickSurface extends React.Component {

  static propTypes = {
    m: React.PropTypes.number.isRequired,
    n: React.PropTypes.number.isRequired,
    points: React.PropTypes.array.isRequired,
    sideLength: React.PropTypes.number.isRequired,
    xOffset: React.PropTypes.number.isRequired,
    yOffset: React.PropTypes.number.isRequired,
    baseClientX: React.PropTypes.number.isRequired,
    baseClientY: React.PropTypes.number.isRequired,
    setPointsUnderBrush: React.PropTypes.func.isRequired,
    muiTheme: React.PropTypes.object.isRequired,
    toggleLoopMode: React.PropTypes.func.isRequired,
    isLooping: React.PropTypes.bool.isRequired,
    isPending: React.PropTypes.bool.isRequired
  };

  /**
   * get points that are under brush
   * by filtering through this.state.points
   */
  _brush(clientX, clientY) {
    // brush is too slow for now
    // this.props.showBrush(true, clientX, clientY);

    const x = clientX - this.props.baseClientX;
    const y = clientY - this.props.baseClientY;
    const flipy = this.props.sideLength - y;

    const minx = x - RADIUS;
    const maxx = x + RADIUS;
    const miny = flipy - RADIUS;
    const maxy = flipy + RADIUS;

    const pointsIn = [];
    this.props.points.forEach((xy, i) => {
      if ((xy[0] >= minx)
          && (xy[0] <= maxx)
          && (xy[1] >= miny)
          && (xy[1] <= maxy)) {
        pointsIn.push(i);
      }
    });
    this._setPointsIn(pointsIn);
  }

  _hover() {
    this._setPointsIn([]);
  }

  _setPointsIn(pointsIn) {
    // keeping some micro-state values in this.
    // its not ui state, does not require a re-render
    // and it is not application state.
    // its just cacheing for performance
    const next = {
      m: this.props.m,
      n: this.props.n,
      pointsIn
    };
    if (!isEqual(this.last, next)) {
      this.props.setPointsUnderBrush(this.props.m, this.props.n, pointsIn);
      this.last = next;
      // console.log(pointsIn);
    }
  }

  render() {
    const bgStyle = {
      fillOpacity: 0.1
    };

    if (this.props.isLooping) {
      bgStyle.fill = this.props.muiTheme.palette.accent2Color;
    }

    if (this.props.isPending) {
      bgStyle.fill = this.props.muiTheme.palette.accent3Color;
    }

    const bg = h('rect', {
      width: this.props.sideLength,
      height: this.props.sideLength,
      x: 0,
      y: 0,
      className: styles.bg,
      style: bgStyle,

      onMouseDown: (e) => {
        if (e.buttons) {
          if (e.metaKey) {
            // toggle loop mode
            this.props.toggleLoopMode(this.props.m, this.props.n);
          } else {
            this._brush(e.clientX, e.clientY);
          }
        }
      },

      onMouseMove: (e) => {
        if (!e.metaKey) {
          if (e.buttons) {
            this._brush(e.clientX, e.clientY);
          } else {
            // only needs to send it once to clear it
            this._hover(e.clientX, e.clientY);
          }
        }
      },

      onMouseUp: (e) => {
        if (!e.metaKey) {
          this._hover(e.clientX, e.clientY);
        }
      }
    });

    const children = [bg];

    return h('g', {
      transform: `translate(${this.props.xOffset}, ${this.props.yOffset})`,
      width: this.props.sideLength,
      height: this.props.sideLength,
      className: styles.surface
    }, children);
  }
}
