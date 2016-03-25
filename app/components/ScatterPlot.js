const React = require('react');
const h = require('react-hyperscript');
const d3 = require('d3');

import Point from './Point';

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
    let innerHeight = this.props.sideLength;
    let innerWidth = innerHeight;

    // this would refetch even if the window size changed
    let ds = this.props.dataset;
    let xCol = ds.column(this.props.xName);
    let yCol = ds.column(this.props.yName);
    let xValues = xCol.data;
    let yValues = yCol.data;

    const xdomain = d3.extent(xValues);
    let xScale = d3.scale.linear()
      .range([0, innerWidth])
      .domain(xdomain)
      .nice();

    const ydomain = d3.extent(yValues);
    let yScale = d3.scale.linear()
      .range([0, innerHeight])
      .domain(ydomain)
      .nice();

    // draw a minimal L axis
    const axis = h('polyline', {
      points: `0,0 0,${innerHeight} ${innerWidth},${innerHeight}`,
      strokeWidth: 1,
      stroke: '#dddddd',  // need access to theme here
      className: 'minimal-axis',
      fill: 'none'
    });

    const points = [];
    let radius = innerHeight < 100 ? 1 : 3;
    xValues.forEach((v, i) => {
      let x = xScale(v);
      let y = yScale(yValues[i]);
      if (x && y) {
        let p = h(Point, {
          x: xScale(v),
          y: yScale(yValues[i]),
          radius: radius,
          color: '#0000ff',  // get from theme
          id: '' + i,
          className: 'point'
        });
        points.push(p);
      }
    });

    return h('g', {
      transform: `translate(${this.props.xOffset}, ${this.props.yOffset})`,
      width: this.props.sideLength,
      height: this.props.sideLength
    }, [
      axis
    ].concat(points));
  }
}
