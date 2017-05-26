import React from 'react';
import PropTypes from 'prop-types';

/**
 * A string label used by the XAxis and YAxis.
 *
 * source:
 * https://github.com/esbullington/react-d3
 */
module.exports = React.createClass({
  displayName: 'Label',

  propTypes: {
    label: PropTypes.string.isRequired,
    height: PropTypes.number,
    offset: PropTypes.number,
    horizontalChart: PropTypes.bool,
    horizontalTransform: PropTypes.string,
    textColor: PropTypes.string,
    width: PropTypes.number,
    strokeWidth: PropTypes.number,
    textAnchor: PropTypes.string,
    verticalTransform: PropTypes.string
  },

  getDefaultProps() {
    return {
      horizontalTransform: 'rotate(270)',
      strokeWidth: 0.01,
      offset: 0,
      textAnchor: 'middle',
      verticalTransform: 'rotate(0)',
      textColor: '#000000'
    };
  },

  render() {
    const props = this.props;

    if (!props.label) {
      return <text />;
    }

    let transform,
      x,
      y;
    if (props.orient === 'top' || props.orient === 'bottom') {
      transform = props.verticalTransform;
      x = props.width / 2;
      y = props.offset;

      if (props.horizontalChart) {
        transform = `rotate(180 ${x} ${y}) ${transform}`;
      }
    } else {
      // left, right
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
