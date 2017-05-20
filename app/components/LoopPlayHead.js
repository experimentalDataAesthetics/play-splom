import React from 'react';
import { now } from 'lodash';
import connect from '../utils/reduxers';
import { getLoop, getLoopBox } from '../selectors';

import styles from './LoopPlayHead.css';

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
    this.sched();
  }

  sched() {
    this._interval = window.requestAnimationFrame(timestamp => this.tick(timestamp));
  }

  componentWillUnmount() {
    window.cancelAnimationFrame(this._interval);
  }

  tick(timestamp) {
    if (this.props.loopBox) {
      // console.log(timestamp, now());
      const delta = now() - this.props.loopMode.epoch;
      const inLoop = delta / 1000 % this.props.loopMode.loopTime;
      const pos = inLoop / this.props.loopMode.loopTime;
      this.setState({
        pos
      });
    }
    this.sched();
  }

  render() {
    if (this.props.loopBox) {
      const x =
        ((this.state && this.state.pos) || 0) * this.props.loopBox.width + this.props.loopBox.x;
      const y = this.props.loopBox.y;
      return (
        <g
          transform={`translate(${x}, ${y})`}
          width={this.props.loopBox.width}
          height={this.props.loopBox.height}
        >
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
