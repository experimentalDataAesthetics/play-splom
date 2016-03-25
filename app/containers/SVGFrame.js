const React = require('react');
let h = require('react-hyperscript');
let connect = require('react-redux').connect;
let Dimensions = require('react-dimensions');

import ScatterPlots from './ScatterPlots';
import SVGFilters from '../components/SVGFilters';
import Brush from '../components/Brush';
import {mouseMove} from '../actions/ui';

const mapStateToProps = () => {
  // console.log('state to props');
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    onMouseMove: (e) => {
      dispatch(mouseMove(e));
    }
  };
};

class SVGFrame extends React.Component {

  render() {
    let children = [
      h(SVGFilters),
      h(ScatterPlots, {
        width: this.props.containerWidth,
        height: this.props.containerHeight
      }),
      h(Brush, {x: 0, y: 0, radius: 10})
    ];

    return h(
      'svg',
      {
        xmlns: 'http://www.w3.org/2000/svg',
        className: 'svg-frame',
        height: this.props.containerHeight,
        width: this.props.containerWidth,
        ref: (svg) => this._svg = svg,
        onMouseMove: (event) => {
          // getDOMNode
          let rect = this._svg.getBoundingClientRect();
          this.props.onMouseMove({
            x: event.pageX - rect.left,
            y: event.pageY - rect.top
          });
        }
      },
      children
    );
  }
}

// this injects containerHeight containerWidth into props
let Dimensioned =  Dimensions()(SVGFrame);

export default connect(mapStateToProps, mapDispatchToProps)(Dimensioned);
