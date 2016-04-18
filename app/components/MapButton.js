
import { Component } from 'react';
import h from 'react-hyperscript';

// requires the material-ui fonts in vendor
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
// import { Colors } from 'material-ui/styles';

export default class MapButton extends Component {

  render() {
    return h(IconButton, {onClick: this.props.action}, [
      h(FontIcon, {
        className: 'material-icons'
        // color: this.props.isActive ? Colors.amber500 : Colors.lightWhite
      }, this.props.isActive ? 'radio_button_checked' : 'radio_button_unchecked')
    ]);
  }
}
