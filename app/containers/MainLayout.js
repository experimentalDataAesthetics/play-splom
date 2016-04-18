import React, { Component } from 'react';
import { connect } from 'react-redux';

// import { grey800 } from 'material-ui/styles/colors';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

// import { setWindowSize } from '../actions/ui';
// import { debounce } from 'lodash';

import Sidebar from './Sidebar';
import SVGFrame from './SVGFrame';
import {
  getWindowSize,
  getLayout
} from '../selectors/index';

const muiTheme = getMuiTheme(darkBaseTheme);
//   palette: {
//     textColor: grey800
//   }

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

    const svg = (
      <div style={layout.svgStyle}>
        <SVGFrame
          containerWidth={layout.svgStyle.width}
          containerHeight={layout.svgStyle.height}
        />
      </div>
    );

    const sidebar = layout.showSidebar ? (
      <div style={layout.sideBarStyle}>
        <Sidebar />
      </div>
    ) : <div />;

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <section>
          {svg}
          {sidebar}
        </section>
      </MuiThemeProvider>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainLayout);