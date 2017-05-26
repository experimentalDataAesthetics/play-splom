import React from 'react';
import PropTypes from 'prop-types';
import h from 'react-hyperscript';

import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import muiThemeable from 'material-ui/styles/muiThemeable';

/**
 * A toggle button using two icons
 *
 * requires the material-ui fonts in vendor
 * http://www.material-ui.com/#/components/font-icon
 * Choose your icons here
 * https://design.google.com/icons/
 */
class ToggleButton extends React.Component {
  static propTypes = {
    action: PropTypes.func.isRequired,
    isActive: PropTypes.bool.isRequired,
    muiTheme: PropTypes.object.isRequired,
    iconActive: PropTypes.string.isRequired,
    iconInactive: PropTypes.string.isRequired
  };

  render() {
    const palette = this.props.muiTheme.palette;
    return h(IconButton, { onClick: this.props.action }, [
      h(
        FontIcon,
        {
          className: 'material-icons',
          color: this.props.isActive ? palette.primary1Color : palette.disabledColor
        },
        this.props.isActive ? this.props.iconActive : this.props.iconInactive
      )
    ]);
  }
}

export default muiThemeable()(ToggleButton);
