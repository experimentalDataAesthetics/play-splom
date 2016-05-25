import React from 'react';
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
  return state.ui.notification || {};
};

// const mapStateToProps = (state) => state.ui.notification || {};

/**
 */
class Notification extends React.Component {

  render() {
    console.log(this.props);
    if (this.props) {
      return (
        <div className={this.props.type}>
          {this.props.message}
        </div>
      );
    }

    return null;
  }
}

export default connect(mapStateToProps)(Notification);
