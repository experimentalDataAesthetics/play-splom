

import React from 'react';

module.exports = React.createClass({

  displayName: 'Label',

  propTypes: {
    label:               React.PropTypes.string.isRequired,
    height:              React.PropTypes.number,
    offset:              React.PropTypes.number,
    horizontalChart:     React.PropTypes.bool,
    horizontalTransform: React.PropTypes.string,
    textColor: React.PropTypes.string,
    width:               React.PropTypes.number,
    strokeWidth:         React.PropTypes.number,
    textAnchor:          React.PropTypes.string,
    verticalTransform:   React.PropTypes.string
  },

  getDefaultProps() {
    return {
      horizontalTransform: 'rotate(270)',
      strokeWidth:         0.01,
      offset: 0,
      textAnchor:          'middle',
      verticalTransform:   'rotate(0)',
      textColor: '#000000'
    };
  },

  render() {

    var props = this.props;

    if (!props.label) {
      return <text/>;
    }

    var transform, x, y;
    if (props.orient === 'top' || props.orient === 'bottom') {
      transform = props.verticalTransform;
      x = props.width / 2;
      y = props.offset;

      if (props.horizontalChart) {
        transform = `rotate(180 ${x} ${y}) ${transform}`;
      }
    } else {  // left, right
      transform = props.horizontalTransform;
      x = -props.height / 2;
      if (props.orient === 'left') {
        y = -props.offset;
      } else {
        y = props.offset;
      }
    }

    const style = {
      stroke: props.textColor,
      fill: props.textColor,
      fontSize: 10
    };

    return (
      <text
        strokeWidth={props.strokeWidth.toString()}
        textAnchor={props.textAnchor}
        transform={transform}
        style={style}
        y={y}
        x={x}
      >
        {props.label}
      </text>
    );
  }

});
