import React from 'react';
import _ from 'lodash';
import connect from '../utils/reduxers';
import { setWindowSize } from '../actions/ui';
import MainLayout from '../containers/MainLayout';

/**
 * This is a top level container.
 *
 * It handles window resizing and presents the MainLayout.
 */
class Main extends React.PureComponent {
  componentDidMount() {
    this._debouncedHandleResize = _.debounce(() => this.handleResize(), 300);
    window.addEventListener('resize', this._debouncedHandleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._debouncedHandleResize);
  }

  handleResize() {
    this.props.setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  render() {
    return <MainLayout />;
  }
}

export default connect(null, {
  setWindowSize
})(Main);
