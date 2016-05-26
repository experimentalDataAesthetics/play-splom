import React, { Component } from 'react';
import connect from '../utils/reduxers';
import { setWindowSize } from '../actions/ui';
import MainLayout from '../containers/MainLayout';
import { debounce } from 'lodash';

class Main extends Component {

  componentDidMount() {
    this._debouncedHandleResize = debounce(() => this.handleResize(), 300);
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
    return (
      <MainLayout />
    );
  }
}

export default connect(null, {
  setWindowSize
})(Main);
