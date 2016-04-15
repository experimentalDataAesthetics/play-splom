import React from 'react';
import h from 'react-hyperscript';
import { isEqual } from 'lodash';

import Point from './Point';
import styles from './ScatterPlot.css';

const RADIUS = 10;  // for now

/**
 * Renders a single scatter plot on a parent svg g
 * props:
 *   dataset: miso dataset
 *   m:
 *   n:
 *   xName
 *   yName
 *   plotKey
 *   sideLength
 */
export default class ScatterPlot extends React.Component {

  render() {
    // draw a minimal L-shaped axis
    const axis = h('polyline', {
      points: `0,0 0,${this.props.sideLength} ${this.props.sideLength},${this.props.sideLength}`,
      strokeWidth: 1,
      stroke: '#888888',  // need access to theme here
      // className: 'axis',
      fill: 'none'
    });

    const className = this.props.isPending ? styles.pendingBg :
      (this.props.isLooping ? styles.loopingBg : styles.bg);

    const bg = h('rect', {
      height: this.props.sideLength,
      width: this.props.sideLength,
      x: 0,
      y: 0,
      className: className,

      // onClick: (e) => {
      //   if (e.buttons) {
      //     if (e.metaKey) {
      //       // toggle loop mode
      //       this.props.toggleLoopMode(this.props.m, this.props.n);
      //     } else {
      //       this._brush(e.clientX, e.clientY);
      //     }
      //   }
      // },

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

    const radius = this.props.sideLength < 100 ? 1 : 3;
    // const featx = this.props.features[this.props.m];
    // const featy = this.props.features[this.props.n];
    const points = h('g', this.props.points.map((xy, i) => {
      return h(Point, {
        x: xy[0],
        y: xy[1],
        radius,
        color: '#0000ff',  // get from theme
        id: String(i),
        className: 'point'
      });
    }));

    const children = [bg, axis, points];

    return h('g', {
      transform: `translate(${this.props.xOffset}, ${this.props.yOffset})`,
      width: this.props.sideLength,
      height: this.props.sideLength,
      className: styles.scatterplot
    }, children);
  }

  /**
   * get points that are under brush
   * by filtering through this.state.points
   */
  _brush(clientX, clientY) {
    // brush is too slow for now
    // this.props.showBrush(true, clientX, clientY);
    // diff from points that were under brush
    // this is screen
    // and state is relative to this plot
    // when did that change ?
    // points have negative values ?
    const x = clientX - this.props.xOffset;
    const y = clientY - this.props.yOffset;
    const minx = x - RADIUS;
    const maxx = x + RADIUS;
    const miny = y - RADIUS;
    const maxy = y + RADIUS;

    const pointsIn = [];
    this.props.points.forEach((xy, i) => {
      if (
        (xy[0] >= minx) &&
        (xy[0] <= maxx) &&
        (xy[1] >= miny) &&
        (xy[1] <= maxy)) {
        pointsIn.push(i);
      }
    });
    this._setPointsIn(pointsIn);
  }

  _hover() {
    this._setPointsIn([]);
    // console.log('hover');
    // this.props.showBrush(false);
    // console.log('hover', clientX, clientY, this.props.xName, this.props.yName);
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
    }
  }
}
