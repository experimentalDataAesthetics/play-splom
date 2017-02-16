import React from 'react';
import h from 'react-hyperscript';
import * as _ from 'lodash';
import connect from '../utils/reduxers';

import {
  setPointsUnderBrush,
  setLoopBox
} from '../actions/interaction';

import {
  setHovering
} from '../actions/ui';

import HoveringAxis from './HoveringAxis';
import SelectArea from './SelectArea';
import style from './ScatterPlots.css';

const unset = {};

const selectors = {
  loopMode: (state) => state.interaction.loopMode || unset,
  hovering: (state) => state.ui.hovering
};

const handlers = {
  setPointsUnderBrush,
  setHovering,
  setLoopBox
};


/**
 * A single component that goes on top of the plots and handles
 * mouse events and interactive UI.
 *
 * This holds all the things that change and respond, thus allowing
 * the plots and background to remain fixed without having to re-render
 * or recalculate due to UI events.
 *
 * This adds a SelectArea on top of each ScatterPlot
 */
class ScatterPlotsInteractive extends React.Component {

  static propTypes = {
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    loopMode: React.PropTypes.object.isRequired,
    layout: React.PropTypes.object.isRequired,
    features: React.PropTypes.array.isRequired,
    setPointsUnderBrush: React.PropTypes.func.isRequired,
    setHovering: React.PropTypes.func.isRequired,
    setLoopBox: React.PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  onMouseDown(event) {
    let box = this._boxForEvent(event);

    if (event.buttons && event.metaKey) {
      if (this.props.setLoopBox) {
        this.props.setLoopBox(box.m, box.n);
      }
      return;
    }

    // click and loop mode is on
    if (event.buttons) {
      if (this.props.loopMode.box) {
        this.props.setLoopBox(box.m, box.n);
      }
    }

    if (!this._shouldHandleEvent(event)) {
      return;
    }

    // if different then switch
    if (!_.isEqual(box, this.state.selectedBox)) {
      this.setState({
        selectedBox: box,
        mouseDownPointEvent: {
          clientX: event.clientX,
          clientY: event.clientY
        }
      });
    }
  }

  onMouseMove(event) {
    const box = this._boxForEvent(event);
    const changed = !_.isEqual(box, this.state.selectedBox);
    if (event.buttons) {
      // moving internally
      if (changed) {
        // dragged outside of the current box
        // so the SelectArea will not get any mouse events
        // as they are outside of it's DOM element.
        // Call moved directly using the ref
        this.selectArea.moved(event);
      }
    } else if (changed) {
      this.setHoveringBox(box);
    }
  }

  onMouseUp(event) {
    // moused up in a different box then you mouse down in
    // so fire the selectArea mouseUp since it will not otherwise
    // capture that event as it is outside of it's DOM element.
    if (!event.buttons) {
      const box = this._boxForEvent(event);
      const changed = !_.isEqual(box, this.state.selectedBox);
      if (changed) {
        this.selectArea.ended(event);
        this.setHoveringBox(box);
      }
    }
  }

  _boxForEvent(event) {
    let layout = this.props.layout;
    let x = event.clientX;
    let y = event.clientY;
    let rx = x - layout.svgStyle.left - layout.scatterPlotsMargin;
    let ry = y - layout.svgStyle.top - layout.scatterPlotsMargin;
    let m = Math.floor(rx / layout.sideLength);
    let n = this.props['data-num-features'] - Math.floor(ry / layout.sideLength) - 1;
    return {m, n};
  }

  _shouldHandleEvent(event) {
    if (event.touches) {
      if (event.changedTouches.length < event.touches.length) {
        return false;
      }
    } else if (this.touchending) {
      return false;
    }
    // right click
    if (event.button) {
      return false;
    }

    return true;
  }

  setPointsIn(area, box, points) {
    // area is inverted y
    // points are normal y
    const sideLength = this.props.layout.sideLength - this.props.layout.margin;
    const minx = area.x;
    const maxx = minx + area.width;
    const miny = sideLength - (area.y + area.height);
    const maxy = sideLength - area.y;

    // console.log({minx, maxx, miny, maxy});
    const pointsIn = [];
    points.forEach((xy, i) => {
      if ((xy[0] >= minx)
          && (xy[0] <= maxx)
          && (xy[1] >= miny)
          && (xy[1] <= maxy)) {
        pointsIn.push(i);
      }
    });

    // Keeping some micro-state values in this.
    // its not ui state, does not require a re-render
    // and it is not application state.
    // Its just cacheing for performance.
    const next = {
      m: box.m,
      n: box.n,
      pointsIn
    };

    const last = this.last || {};
    if (last.m !== next.m || last.n !== next.n) {
      this.setState({
        last: {
          m: next.m,
          n: next.n
        }
      });
    }

    if (!_.isEqual(this.last, next)) {
      this.last = next;
      this.props.setPointsUnderBrush(box.m, box.n, pointsIn);
    }
  }

  setHoveringBox(box) {
    this.props.setHovering(box.m, box.n);
  }

  render() {
    const sideLength = this.props.layout.sideLength;
    const layout = this.props.layout;
    const innerSideLength = sideLength - layout.margin;
    const children = [
      <HoveringAxis />
    ];

    // To handle catch mouse actions
    // that don't hit the SelectArea
    children.push(
      <rect
        x={0}
        y={0}
        width={this.props.width}
        height={this.props.height}
        style={{
          opacity: 0
        }}
      />
    );

    const s = {
      box: {
        m: _.get(this.props.loopMode, 'box.m'),
        n: _.get(this.props.loopMode, 'box.n')
      },
      last: {
        m: _.get(this.state, 'last.m'),
        n: _.get(this.state, 'last.n')
      }
    };

    // pending should be erased once it becomes active
    const getClassName = (box) => {
      if ((s.box.m === box.m) && (s.box.n === box.n)) {
        return style.looping;
      }

      if ((s.last.m === box.m) && (s.last.n === box.n)) {
        return style.focused;
      }

      return 'none';
    };

    // show one box at this.state.selectedBox
    if (this.state.selectedBox) {
      // find box by {m: n: }
      const box = _.find(layout.boxes, this.state.selectedBox);
      const featx = this.props.features[box.m].values;
      const featy = this.props.features[box.n].values;
      const points = _.zip(featx, featy);

      const selectedArea = h(SelectArea, {
        // Store a reference to this child element
        // so we can call initimate methods on it directly.
        ref: sa => {
          this.selectArea = sa;
        },
        selected: {
          x: 0,
          y: 0,
          width: 0,
          height: 0
        },
        domain: {
          x: box.x,
          y: box.y,
          width: innerSideLength,
          height: innerSideLength
        },
        base: [box.baseClientX, box.baseClientY],
        onChange: (area) => {
          this._selectedArea = area;
          this.setPointsIn(area, box, points);
        },
        onMouseEnter: () => this.setHoveringBox(box),
        onMetaClick: () => {
          if (this.props.setLoopBox) {
            this.props.setLoopBox(box.m, box.n);
          }
        },
        onClick: () => {
          if (this.props.loopMode.box) {
            this.props.setLoopBox(box.m, box.n);
          }
        },
        handleMouseEvents: true,
        show: true,
        overlayClassName: getClassName(box),
        // The first click that selects a new box was at this point.
        // Transfer it to the SelectArea so it can start with that as point0
        // and not have to wait for a post-focus click.
        mouseDownPointEvent: this.state.mouseDownPointEvent
      });

      children.push(selectedArea);
    }

    return h(
      'g',
      {
        width: this.props.width,
        height: this.props.height,
        className: 'ScatterPlotsInteractive',
        onMouseLeave: (event) => {
          // this.setHoveringBox({});
        },
        onMouseDown: this.onMouseDown.bind(this),
        onTouchStart: this.onMouseDown.bind(this),
        onMouseMove: this.onMouseMove.bind(this),
        onTouchMove: this.onMouseMove.bind(this),
        onMouseUp: this.onMouseUp.bind(this),
        onTouchEnd: this.onMouseUp.bind(this)
      },
      children
    );
  }
}

export default connect(selectors, handlers)(ScatterPlotsInteractive);
