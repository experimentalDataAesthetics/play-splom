const React = require('react');
const h = require('react-hyperscript');
const connect = require('react-redux').connect;

const mapStateToProps = (state) => {
  if (state.ui.mouse) {
    return state.ui.mouse;
  }

  return {};
};

const mapDispatchToProps = () => {
  return {};
};

/**
 * Renders the brush with adjustable radius
 * mouse tracked from SVGFrame
 */
class Brush extends React.Component {

  render() {
    var props = this.props;
    if (props.x) {
      return h('circle', {
        cx: props.x,
        cy: props.y,
        r: props.radius,
        fill: 'url(#brush-ring)',
        className: 'brush'
      });
    }

    return false;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Brush);
