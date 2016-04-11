import React, { Component } from 'react';
// import { debounce } from 'lodash';

import Sidebar from './Sidebar';
import SVGFrame from './SVGFrame';
import { centeredSquare } from '../utils/layout';
import styles from './Main.css';

const SIDEBAR_WIDTH = 300;

export default class Main extends Component {
  componentDidMount() {
    // this._debouncedHandleResize = debounce(() => this.handleResize(), 50);
    this._debouncedHandleResize = () => this.handleResize();
    window.addEventListener('resize', this._debouncedHandleResize);
    this.handleResize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._debouncedHandleResize);
  }

  handleResize() {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  render() {
    const svgWidth = this.state.width - SIDEBAR_WIDTH;
    const sideBarStyle = {
      position: 'absolute',
      left: svgWidth,
      right: this.state.width,
      width: SIDEBAR_WIDTH,
      top: 0,
      bottom: this.state.height
    };
    let svgStyle;

    if (svgWidth < 600) {
      svgStyle = centeredSquare(this.state.width, this.state.height);
      return (
        <section className={styles.main}>
          <div style={svgStyle}>
            <SVGFrame containerWidth={svgStyle.width} containerHeight={svgStyle.height} />
          </div>
        </section>
      );
    }

    svgStyle = centeredSquare(svgWidth, this.state.height);

    return (
      <section className={styles.main}>
        <div style={svgStyle}>
          <SVGFrame containerWidth={svgStyle.width} containerHeight={svgStyle.height} />
        </div>
        <div style={sideBarStyle}>
          <Sidebar />
        </div>
      </section>
    );
  }
}
