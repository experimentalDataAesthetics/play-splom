const React = require('react');
let h = require('react-hyperscript');
let connect = require('react-redux').connect;
let Dimensions = require('react-dimensions');

import ScatterPlots from './ScatterPlots';
import SVGFilters from '../components/SVGFilters';
import Brush from '../components/Brush';

const mapStateToProps = () => {
  // console.log('state to props');
  return {};
};

const mapDispatchToProps = () => {
  // dispatch
  return {
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
      h(Brush, {show: false, x: 0, y: 0, radius: 10})
    ];

    return h(
      'svg',
      {
        xmlns: 'http://www.w3.org/2000/svg',
        className: 'svg-frame',
        height: this.props.containerHeight,
        width: this.props.containerWidth,
        ref: (svg) => this._svg = svg
      },
      children
    );
  }
}

// this injects containerHeight containerWidth into props
let Dimensioned =  Dimensions()(SVGFrame);

export default connect(mapStateToProps, mapDispatchToProps)(Dimensioned);
