import React from 'react';
import connect from '../utils/reduxers';
import { notify } from '../actions/ui';

/**
 * Displays a text notification for events like
 * errors and 'loading...'
 *
 * This connects to state.ui.notification and displays that message.
 */
class Notification extends React.PureComponent {
  render() {
    const n = this.props.notification;
    let dismiss;
    if (n && n.type) {
      if (n.type === 'error') {
        dismiss = (
          <div className="notification--close">
            <button onClick={this.props.close}><i className="fa fa-window-close" /> dismiss</button>
          </div>
        );
      }
      return (
        <div className="notification--outer">
          <div className="notification--inner">
            <div className={n.type}>
              {dismiss}
              {n.message}
            </div>
          </div>
        </div>
      );
    }

    return null;
  }
}

export default connect(
  {
    notification: state => state.ui.notification
  },
  {
    close: () => {
      return notify();
    }
  }
)(Notification);
