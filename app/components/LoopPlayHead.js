import React, { Component } from 'react';
import connect from '../utils/reduxers';
import { getLoop, getLoopBox } from '../selectors';
import { now } from 'lodash';

import styles from './LoopPlayHead.css';

// animation frame rate is 16
const SPEED = 20;

/**
 * Animates a vertical line to show where the loop is playing.
 *
 * There is one of these in the app, positioned over the currently playing loop box.
 */
class LoopPlayHead extends React.Component {

  static propTypes = {
    loopBox: React.PropTypes.object,
    loopMode: React.PropTypes.object.isRequired
  };

  componentDidMount() {
    this._interval = window.setInterval(() => this.tick(), SPEED);
  }

  componentWillUnmount() {
    window.clearInterval(this._interval);
  }

  tick() {
    if (this.props.loopBox) {
      const delta = now() - this.props.loopMode.epoch;
      const inLoop = (delta / 1000) % this.props.loopMode.loopTime;
      const pos = inLoop / this.props.loopMode.loopTime;
      this.setState({
        pos
      });
    }
  }

  render() {
    if (this.props.loopBox) {
      const x = (this.state && this.state.pos || 0) * this.props.loopBox.width + this.props.loopBox.x;
      const y = this.props.loopBox.y;
      return (
        <g
          transform={`translate(${x}, ${y})`}
          width={this.props.loopBox.width}
          height={this.props.loopBox.height}>
            <rect
              x={0}
              y={0}
              width={4}
              height={this.props.loopBox.height}
              className={styles.playHead}
            />
        </g>
      );
    }

    return null;
  }
}


export default connect({
  loopBox: getLoopBox,
  loopMode: getLoop
})(LoopPlayHead);
