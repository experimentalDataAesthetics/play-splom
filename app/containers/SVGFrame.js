import PropTypes from 'prop-types';
import React from 'react';
import { Motion, spring } from 'react-motion';

import ScatterPlotsContainer from './ScatterPlotsContainer';

/**
 * Renders the SVG element in which the scatterplots are placed.
 */
export default class SVGFrame extends React.Component {
  static childContextTypes = {
    transformPoint: PropTypes.func
  };

  static propTypes = {
    containerHeight: PropTypes.number.isRequired,
    containerWidth: PropTypes.number.isRequired,
    zoom: PropTypes.object.isRequired
  };

  getChildContext() {
    return {
      transformPoint: this.transformPoint
    };
  }

  setRef = ref => {
    this.ref = ref;
  };

  ref = null;

  transformPoint = (clientX, clientY, childElement) => {
    const svgPoint = this.ref.createSVGPoint();
    svgPoint.x = clientX;
    svgPoint.y = clientY;
    const ctm = childElement.getScreenCTM();
    return svgPoint.matrixTransform(ctm.inverse());
  };

  render() {
    const { containerWidth, containerHeight, zoom } = this.props;

    return (
      <Motion
        defaultStyle={{ x: 0, y: 0, width: containerWidth, height: containerHeight }}
        style={{
          x: spring(zoom.x),
          y: spring(zoom.y),
          width: spring(zoom.width),
          height: spring(zoom.height)
        }}
      >
        {zooming => (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="svg-frame"
            height={containerHeight}
            width={containerWidth}
            viewBox={`${zooming.x} ${zooming.y} ${zooming.width} ${zooming.height}`}
            ref={this.setRef}
          >
            <ScatterPlotsContainer width={containerWidth} height={containerHeight} />
          </svg>
        )}
      </Motion>
    );
  }
}
