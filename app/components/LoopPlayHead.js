import React from 'react';
import PropTypes from 'prop-types';
import connect from '../utils/reduxers';
import { getLoop, getLoopBox, getLoopModePayload } from '../selectors';
import { setPointsUnderBrush } from '../actions/interaction';

import styles from './LoopPlayHead.css';

const sustain = 0.1;

function findActiveEvents(events, now, startAt) {
  const activeMin = now;
  const activeMax = now + sustain;
  const activeEvents = [];
  for (let i = startAt; i < events.length; i += 1) {
    const event = events[i];
    if (event.time >= activeMin && event.time <= activeMax) {
      activeEvents.push(i);
    }
  }
  return activeEvents;
}

/**
 * Animates a vertical line to show where the loop is playing.
 *
 * Sets pointsUnderBrush (redux action) so that ScatterPlotsActivePoints
 * highlights which points are sounding.
 *
 * There is one of these in the app, positioned over the currently playing loop box.
 */
class LoopPlayHead extends React.PureComponent {
  static propTypes = {
    loopBox: PropTypes.object,
    loopMode: PropTypes.object.isRequired
  };

  componentDidMount() {
    this.sched();
  }

  componentWillUnmount() {
    window.cancelAnimationFrame(this._interval);
  }

  sched() {
    this._interval = window.requestAnimationFrame(timestamp => this.tick(timestamp));
  }

  tick(timestamp) {
    // timestamp is performance.now() : milliseconds since the initial page load
    if (this.props.loopBox) {
      const delta = timestamp - this.props.loopMode.epoch;
      const inLoop = delta / 1000 % this.props.loopMode.loopTime;
      const pos = inLoop / this.props.loopMode.loopTime;
      this.setState({
        pos
      });

      const activeEvents = findActiveEvents(this.props.loop.events, inLoop, 0);

      this.props.setPointsUnderBrush(
        this.props.loopMode.box.m,
        this.props.loopMode.box.n,
        activeEvents
      );
    }
    this.sched();
  }

  render() {
    // If we are looping
    if (this.props.loopBox) {
      const x = ((this.state && this.state.pos) || 0) * this.props.loopBox.width;
      return (
        <g
          width={this.props.loopBox.width}
          height={this.props.loopBox.height}
          transform={`translate(${this.props.loopBox.x}, ${this.props.loopBox.y})`}
        >
          <rect
            x={0}
            y={0}
            width={this.props.loopBox.width}
            height={this.props.loopBox.height}
            className={styles.loopBox}
          />
          {this.props.loopMode.timeDimension === 'x'
            ? <rect
              x={0}
              y={0}
              transform={`translate(${x}, 0)`}
              width={4}
              height={this.props.loopBox.height}
              className={styles.playHead}
            />
            : null}

        </g>
      );
    }

    return null;
  }
}

const handlers = {
  setPointsUnderBrush
};

export default connect(
  {
    loopBox: getLoopBox,
    loopMode: getLoop,
    loop: getLoopModePayload
  },
  handlers
)(LoopPlayHead);
