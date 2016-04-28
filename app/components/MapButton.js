
import React from 'react';
import h from 'react-hyperscript';

// requires the material-ui fonts in vendor
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import muiThemeable from 'material-ui/styles/muiThemeable';

class MapButton extends React.Component {

  static propTypes = {
    action: React.PropTypes.func.isRequired,
    isActive: React.PropTypes.bool.isRequired,
    muiTheme: React.PropTypes.object.isRequired
  };

  render() {
    const palette = this.props.muiTheme.palette;
    return h(IconButton, {onClick: this.props.action}, [
      h(FontIcon, {
        className: 'material-icons',
        color: this.props.isActive ? palette.primary1Color : palette.disabledColor
      }, this.props.isActive ? 'radio_button_checked' : 'radio_button_unchecked')
    ]);
  }
}

export default muiThemeable()(MapButton);
