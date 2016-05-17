import React from 'react';
import h from 'react-hyperscript';
import Line from './Line';

export default class Axis extends React.Component {

  static propTypes = {
    xOffset: React.PropTypes.number.isRequired,
    yOffset: React.PropTypes.number.isRequired,
    sideLength: React.PropTypes.number.isRequired,
    muiTheme: React.PropTypes.object.isRequired
  };

  render() {
    const sideLength = this.props.sideLength;

    // draw ticks alongside
    // probably outset it
    const children = [
      h(Line, {
        points: [
          [0, sideLength],
          [sideLength, sideLength]
        ],
        stroke: this.props.muiTheme.palette.textColor,
        opacity: 1
      }),

      h(Line, {
        points: [
          [0, 0],
          [0, sideLength]
        ],
        stroke: this.props.muiTheme.palette.textColor,
        opacity: 1
      })
    ];

    return h('g', {
      transform: `translate(${this.props.xOffset}, ${this.props.yOffset})`,
      width: sideLength,
      height: sideLength
    }, children);
  }
}
