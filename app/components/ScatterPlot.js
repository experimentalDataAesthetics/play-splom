import React from 'react';
import h from 'react-hyperscript';
import style from './ScatterPlot.css';

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
    points: React.PropTypes.array.isRequired,
    muiTheme: React.PropTypes.object.isRequired
  };

  render() {
    // draw a minimal L-shaped axis
    const axis = h('polyline', {
      points: `0,0 0,${this.props.sideLength} ${this.props.sideLength},${this.props.sideLength}`,
      strokeWidth: 1,
      stroke: this.props.muiTheme.tableRow.borderColor,
      fill: 'none'
    });

    const radius = this.props.sideLength < 100 ? 1 : 3;
    const flip = this.props.sideLength;
    const points = h('g', this.props.points.map((xy, i) => {
      return React.createElement('circle', {
        cx: xy[0],
        cy: flip - xy[1],
        r: radius,
        key: String(i),
        className: style.point
      });
    }));

    const children = [axis, points];

    return h('g', {
      transform: `translate(${this.props.xOffset}, ${this.props.yOffset})`,
      width: this.props.sideLength,
      height: this.props.sideLength
    }, children);
  }
}
