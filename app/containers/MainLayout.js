import React, { Component } from 'react';
import { connect } from 'react-redux';

// import { grey800 } from 'material-ui/styles/colors';
// import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { createSelector } from 'reselect';
import * as _ from 'lodash';

// import { setWindowSize } from '../actions/ui';
// import { debounce } from 'lodash';

import Sidebar from './Sidebar';
import SVGFrame from './SVGFrame';
import {
  getWindowSize,
  getLayout
} from '../selectors/index';

const muiTheme = getMuiTheme(); // darkBaseTheme
//   palette: {
//     textColor: grey800
//   }

const mapStateToProps = createSelector(
  [getWindowSize, getLayout],
  (windowSize, layout) => ({windowSize, layout}));

const mapDispatchToProps = null;

class MainLayout extends Component {

  render() {
    const layout = this.props.layout;

    const globalStyle = {
      color: muiTheme.palette.textColor,
      background: muiTheme.palette.canvasColor
    };
    // update svgStyle with that ?
    const svgStyle = _.assign({}, layout.svgStyle, globalStyle);

    const svg = (
      <div style={svgStyle}>
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
        <section className="MainLayout" style={globalStyle}>
          {svg}
          {sidebar}
        </section>
      </MuiThemeProvider>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainLayout);
