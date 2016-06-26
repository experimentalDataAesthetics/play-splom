import React from 'react';
import h from 'react-hyperscript';
import style from './ScatterPlot.css';
import LAxis from '../components/LAxis';
import Points from '../components/Points';

/**
 * Renders a single scatter plot on a parent svg g
 */
export default class ScatterPlot extends React.Component {

  static propTypes = {
    xOffset: React.PropTypes.number.isRequired,
    yOffset: React.PropTypes.number.isRequired,
    sideLength: React.PropTypes.number.isRequired,
    points: React.PropTypes.array.isRequired,
    muiTheme: React.PropTypes.object.isRequired
  };

  render() {
    let children;
    const points = Points({
      sideLength: this.props.sideLength,
      points: this.props.points,
      className: style[this.props.className] || style.point
    });

    // draw a minimal L-shaped axis
    if (!this.props.hideAxis) {
      const axis = LAxis({
        sideLength: this.props.sideLength,
        color: this.props.muiTheme.tableRow.borderColor
      });
      children = [axis].concat(points);
    } else {
      children = points;
    }

    return h('g', {
      transform: `translate(${this.props.xOffset}, ${this.props.yOffset})`,
      width: this.props.sideLength,
      height: this.props.sideLength
    }, children);
  }
}
