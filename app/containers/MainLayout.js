import _ from 'lodash';
import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import connect from '../utils/reduxers';

import Sidebar from './Sidebar';
import SVGFrame from './SVGFrame';
import Notification from '../components/Notification';

import { getLayout, getMuiTheme } from '../selectors/index';

/**
 * This is the layout of the application itself.
 * An SVG plot area on the left and a Sidebar on the right.
 *
 * It wraps everything in a MuiThemeProvider which allows selectable
 * styling themes that child components can access via the context.
 *
 * The layout sizes are all calculated in getLayout which recalculates
 * when the window size changes, also on change of number of dataset features,
 * number of boxes etc.
 */
class MainLayout extends React.Component {
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
        <SVGFrame containerWidth={layout.svgStyle.width} containerHeight={layout.svgStyle.height} />
      </div>
    );

    const sidebar = layout.showSidebar
      ? (<div style={layout.sideBarStyle}>
        <Sidebar />
      </div>)
      : null;

    return (
      <MuiThemeProvider muiTheme={this.props.muiTheme}>
        <section className="MainLayout" style={globalStyle}>
          {svg}
          {sidebar}
          <Notification />
        </section>
      </MuiThemeProvider>
    );
  }
}

export default connect({
  layout: getLayout,
  muiTheme: getMuiTheme
})(MainLayout);
