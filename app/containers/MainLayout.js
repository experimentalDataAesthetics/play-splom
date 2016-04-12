import React, { Component } from 'react';
import { connect } from 'react-redux';

// import { setWindowSize } from '../actions/ui';
// import { debounce } from 'lodash';

import Sidebar from './Sidebar';
import SVGFrame from './SVGFrame';
import {
  getWindowSize,
  getLayout
} from '../selectors/index';

const mapStateToProps = (state) => ({
  windowSize: getWindowSize(state),
  layout: getLayout(state)
});

const mapDispatchToProps = null;

class MainLayout extends Component {

  // static propTypes = {
  //   children: PropTypes.element.isRequired
  // };

  render() {
    const layout = this.props.layout;
    if (!layout.showSidebar) {
      return (
        <section>
          <div style={layout.svgStyle}>
            <SVGFrame
              containerWidth={layout.svgStyle.width}
              containerHeight={layout.svgStyle.height}
            />
          </div>
        </section>
      );
    }

    return (
      <section>
        <div style={layout.svgStyle}>
          <SVGFrame
            containerWidth={layout.svgStyle.width}
            containerHeight={layout.svgStyle.height}
          />
        </div>
        <div style={layout.sideBarStyle}>
          <Sidebar />
        </div>
      </section>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainLayout);
