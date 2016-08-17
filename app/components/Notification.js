import React from 'react';
import connect from '../utils/reduxers';

/**
 * Displays a text notification for events like
 * errors and 'loading...'
 *
 * This connects to state.ui.notification and displays that message.
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
