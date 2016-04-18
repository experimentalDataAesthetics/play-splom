import React from 'react';
import h from 'react-hyperscript';

import Point from './Point';
import styles from './ScatterPlot.css';

/**
 * Renders a single scatter plot on a parent svg g
 */
export default class ScatterPlot extends React.Component {

  static propTypes = {
    xOffset: React.PropTypes.number.isRequired,
    yOffset: React.PropTypes.number.isRequired,
    m: React.PropTypes.number.isRequired,
    n: React.PropTypes.number.isRequired,
    sideLength: React.PropTypes.number.isRequired,
    margin: React.PropTypes.number.isRequired,
    points: React.PropTypes.array.isRequired
  };

  render() {
    // draw a minimal L-shaped axis
    const axis = h('polyline', {
      points: `0,0 0,${this.props.sideLength} ${this.props.sideLength},${this.props.sideLength}`,
      strokeWidth: 1,
      stroke: '#AAAAAA',  // need access to theme here
      // className: 'axis',
      fill: 'none'
    });

    const radius = this.props.sideLength < 100 ? 1 : 3;
    const flip = this.props.sideLength - this.props.margin;
    // const featx = this.props.features[this.props.m];
    // const featy = this.props.features[this.props.n];
    const points = h('g', this.props.points.map((xy, i) => {
      const flipy = flip - xy[1];
      return h(Point, {
        x: xy[0],
        y: flipy,
        radius,
        id: String(i),
        className: 'point'
      });
    }));

    const children = [axis, points];

    return h('g', {
      transform: `translate(${this.props.xOffset}, ${this.props.yOffset})`,
      width: this.props.sideLength,
      height: this.props.sideLength,
      className: styles.scatterplot
    }, children);
  }
}
