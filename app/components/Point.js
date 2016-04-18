import React from 'react';
import muiThemeable from 'material-ui/styles/muiThemeable';
import * as _ from 'lodash';

class Point extends React.Component {

  static propTypes = {
    x: React.PropTypes.number.isRequired,
    y: React.PropTypes.number.isRequired,
    radius: React.PropTypes.number.isRequired,
    muiTheme: React.PropTypes.object.isRequired
  };

  render() {
    const props = this.props;
    return React.createElement('circle', {
      cx: props.x,
      cy: props.y,
      r: props.radius,
      fill: props.muiTheme.palette.accent1Color,
      key: props.id,  // or key ?
      className: props.className
    });
  }
}

export default muiThemeable()(Point);
