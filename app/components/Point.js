import React from 'react';

export default class Point extends React.Component {

  render() {
    const props = this.props;
    return React.createElement('circle', {
      cx: props.x,
      cy: props.y,
      r: props.radius,
      fill: props.color,
      id: props.id,
      className: props.className
    });
  }
}
