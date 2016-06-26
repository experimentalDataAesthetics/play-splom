import React from 'react';
import connect from '../utils/reduxers';

/**
 */
class Notification extends React.Component {

  render() {
    const n = this.props.notification;
    if (n) {
      return (
        <div className={n.type}>
          {n.message}
        </div>
      );
    }

    return null;
  }
}

export default connect({
  notification: (state) => state.ui.notification
})(Notification);
