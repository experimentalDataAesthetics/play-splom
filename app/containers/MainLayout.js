import React, { Component } from 'react';
import { connect } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { createSelector } from 'reselect';
import * as _ from 'lodash';

import Sidebar from './Sidebar';
import SVGFrame from './SVGFrame';
import {
  getWindowSize,
  getLayout,
  getMuiTheme
} from '../selectors/index';

const mapStateToProps = createSelector(
  [getWindowSize, getLayout, getMuiTheme],
  (windowSize, layout, muiTheme) => ({windowSize, layout, muiTheme}));

const mapDispatchToProps = null;

class MainLayout extends Component {

  static propTypes = {
    muiTheme: React.PropTypes.object.isRequired,
    layout: React.PropTypes.object.isRequired
  };

  render() {
    const layout = this.props.layout;

    const globalStyle = {
      color: this.props.muiTheme.palette.textColor,
      background: this.props.muiTheme.palette.canvasColor
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
      <MuiThemeProvider muiTheme={this.props.muiTheme}>
        <section className="MainLayout" style={globalStyle}>
          {svg}
          {sidebar}
        </section>
      </MuiThemeProvider>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainLayout);
