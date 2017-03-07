import React from 'react';

/**
 * Renders an SVG line
 */
export default class Line extends React.Component {

  render() {

    return (
      <line
        x1={this.props.points[0][0]}
        y1={this.props.points[0][1]}
        x2={this.props.points[1][0]}
        y2={this.props.points[1][1]}
        stroke={this.props.stroke}
        opacity={this.props.opacity}
      />
    );
  }

}
