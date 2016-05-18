
import React from 'react';
import h from 'react-hyperscript';
import XAxis from './XAxis';
import YAxis from './YAxis';

export default class Axis extends React.Component {

  static propTypes = {
    xOffset: React.PropTypes.number.isRequired,
    yOffset: React.PropTypes.number.isRequired,
    sideLength: React.PropTypes.number.isRequired,
    muiTheme: React.PropTypes.object.isRequired,
    xScale: React.PropTypes.func.isRequired,
    yScale: React.PropTypes.func.isRequired,
    xLabel: React.PropTypes.string,
    yLabel: React.PropTypes.string
  };

  render() {
    const sideLength = this.props.sideLength;
    const textColor = this.props.muiTheme.palette.textColor;

    const children = [
      h(XAxis, {
        xAxisLabel: this.props.xLabel,
        xScale: this.props.xScale,
        height: sideLength,
        width: sideLength,
        stroke: textColor,
        tickStroke: textColor,
        tickTextStroke: textColor,
        xAxisTickCount: 4,
        xAxisLabelOffset: 40
      }),
      h(YAxis, {
        yAxisLabel: this.props.yLabel,
        yScale: this.props.yScale,
        height: sideLength,
        width: sideLength,
        stroke: textColor,
        tickStroke: textColor,
        tickTextStroke: textColor,
        yAxisTickCount: 4,
        yAxisLabelOffset: 40
      })
    ];

    return h('g', {
      transform: `translate(${this.props.xOffset}, ${this.props.yOffset})`,
      width: sideLength,
      height: sideLength
    }, children);
  }
}
