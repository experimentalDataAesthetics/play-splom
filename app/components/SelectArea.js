import React from 'react';
import style from './SelectArea.css';

const handleSize = 6;

const MODE_DRAG = 'drag';
const MODE_SPACE = 'space';
const MODE_HANDLE = 'handle';
const MODE_CENTER = 'center';

const X = {
  name: 'x',
  handles: ['e', 'w'].map(makeHandle),
  input: (x, e) => x && [[x[0], e[0][1]], [x[1], e[1][1]]],
  output: (xy) => xy && [xy[0][0], xy[1][0]]
};

const Y = {
  name: 'y',
  handles: ['n', 's'].map(makeHandle),
  input: (y, e) => y && [[e[0][0], y[0]], [e[1][0], y[1]]],
  output: (xy) => xy && [xy[0][1], xy[1][1]]
};

const XY = {
  name: 'xy',
  handles: ['n', 'e', 's', 'w', 'nw', 'ne', 'se', 'sw'].map(makeHandle),
  input: (xy) => xy,
  output: (xy) => xy
};

const cursors = {
  overlay: 'crosshair',
  selection: 'move',
  n: 'ns-resize',
  e: 'ew-resize',
  s: 'ns-resize',
  w: 'ew-resize',
  nw: 'nwse-resize',
  ne: 'nesw-resize',
  se: 'nwse-resize',
  sw: 'nesw-resize'
};

const flipX = {
  e: 'w',
  w: 'e',
  nw: 'ne',
  ne: 'nw',
  se: 'sw',
  sw: 'se'
};

const flipY = {
  n: 's',
  s: 'n',
  nw: 'sw',
  ne: 'se',
  se: 'ne',
  sw: 'nw'
};

const signsX = {
  overlay: +1,
  selection: +1,
  n: null,
  e: +1,
  s: null,
  w: -1,
  nw: -1,
  ne: +1,
  se: +1,
  sw: -1
};

const signsY = {
  overlay: +1,
  selection: +1,
  n: -1,
  e: null,
  s: +1,
  w: null,
  nw: -1,
  ne: -1,
  se: +1,
  sw: +1
};

function makeHandle(t) {

  return {
    type: t,
    x: (selection) => {
      return t[t.length - 1] === 'e' ?
        selection[1][0] - handleSize / 2
        : selection[0][0] - handleSize / 2;
    },
    y: (selection) => {
      return t[0] === 's' ?
        selection[1][1] - handleSize / 2
        : selection[0][1] - handleSize / 2;
    },
    width: (selection) => {
      return t === 'n' || t === 's' ?
        selection[1][0] - selection[0][0] + handleSize
        : handleSize;
    },
    height: (selection) => {
      return t === 'e' || t === 'w' ?
        selection[1][1] - selection[0][1] + handleSize
        : handleSize;
    }
  };
}

// Ignore right-click, since that should open the context menu.
function defaultFilter(event) {
  return !event.button;
}

function box(list) {
  return {
    x: list[0][0],
    y: list[0][1],
    width: list[1][0] - list[0][0],
    height: list[1][1] - list[0][1]
  };
}

function clip(v, min, max) {
  if (v <= min) {
    return min;
  }

  if (v >= max) {
    return max;
  }

  return v;
}

/**
 * D3 Brush - select a rectangular area
 *
 * Adapted from https://github.com/d3/d3-brush
 */
export default class SelectArea extends React.Component {

  static propTypes = {
    domain: React.PropTypes.object.isRequired,
    base: React.PropTypes.array.isRequired,
    selected: React.PropTypes.object,
    onChange: React.PropTypes.func,
    onMouseEnter: React.PropTypes.func,
    onMetaClick: React.PropTypes.func,
    show: React.PropTypes.bool
  };

  constructor(props, context) {
    super(props, context);

    this.dim = XY;
    // ignore events matching this
    this.eventFilter = defaultFilter;

    // internal state, not for display
    // current mouseMode
    this.mouseMode = null;
    // start positions of mouse move
    this.w0 = null;
    this.n0 = null;
    this.e0 = null;
    this.s0 = null;
    // a timer is used to cleanly detach
    // this stores the timer and marks it as in progress
    this.touchending = null;

    // selected is supplied as an area within and relative to the domain
    const selected = this.props.selected;
    if (selected) {
      const x = selected.x + this.props.domain.x;
      const y = selected.y + this.props.domain.y;
      this.state = {
        selected: [
          [x, y],
          [x + selected.width, y + selected.height]
        ]
      };
    } else {
      this.state = {
        selected: [
          [this.props.domain.x, this.props.domain.y],
          [this.props.domain.x, this.props.domain.y]
        ]
      };
    }
  }

  _shouldHandleEvent(event) {
    if (event.touches) {
      if (event.changedTouches.length < event.touches.length) {
        return false;
      }
    } else if (this.touchending) {
      return false;
    }

    if (!this.eventFilter(event)) {
      return false;
    }

    return true;
  }

  _started(event, handle) {
    if (event.buttons && event.metaKey) {
      if (this.props.onMetaClick) {
        this.props.onMetaClick(event);
      }
      return;
    }

    if (!this._shouldHandleEvent(event)) {
      return;
    }

    if (event.metaKey) {
      this.mouseMoveType = 'overlay';
    } else {
      this.mouseMoveType = handle ? handle.type : 'overlay';
    }

    if (this.mouseMoveType === 'selection') {
      this.mouseMode = MODE_DRAG;
    } else {
      this.mouseMode = (event.altKey ? MODE_CENTER : MODE_HANDLE);
    }

    // mouse position within the g or svg I am on
    // but the rest of the calculations are in absolute
    this.point0 = this._eventPoint(event);
    this.pointLatest = this.point0;

    if (this.mouseMoveType === 'overlay') {
      const W = this.props.domain.x;
      const N = this.props.domain.y;
      const E = W + this.props.domain.width;
      const S = N + this.props.domain.height;

      this.w0 = this.dim === Y ? W : this.point0[0];
      this.n0 = this.dim === X ? N : this.point0[1];
      this.e0 = this.dim === Y ? E : this.w0;
      this.s0 = this.dim === X ? S : this.n0;
      this._setSelected([[this.w0, this.n0], [this.e0, this.s0]]);
    } else {
      this.w0 = this.state.selected[0][0];
      this.n0 = this.state.selected[0][1];
      this.e0 = this.state.selected[1][0];
      this.s0 = this.state.selected[1][1];
    }
  }

  _moved(event) {
    if (!this.mouseMode) {
      return;
    }

    if (!this._shouldHandleEvent(event)) {
      return;
    }

    event.stopPropagation();

    if (event.metaKey) {
      this.mouseMoveType = 'overlay';
    } else {
      // cannot really switch back unless you store the original type
      // this.mouseMoveType = handle ? handle.type : 'overlay';
    }

    let signX = this.dim === Y ? null : signsX[this.mouseMoveType];
    let signY = this.dim === X ? null : signsY[this.mouseMoveType];

    const shifting = signX && signY && event.shiftKey;
    const point1 = this._eventPoint(event);

    if (shifting && !this.lockX && !this.lockY) {
      if (Math.abs(point1[0] - this.pointLatest[0]) > Math.abs(point1[1] - this.pointLatest[1])) {
        this.lockY = true;
      } else {
        this.lockX = true;
      }
    }
    this.pointLatest = point1;

    let dx = this.pointLatest[0] - this.point0[0];
    let dy = this.pointLatest[1] - this.point0[1];

    const W = this.props.domain.x;
    const N = this.props.domain.y;
    const E = W + this.props.domain.width;
    const S = N + this.props.domain.height;

    let w1 = this.w0;
    let n1 = this.n0;
    let e1 = this.e0;
    let s1 = this.s0;

    switch (this.mouseMode) {
      case MODE_SPACE:
      case MODE_DRAG: {
        if (signX) {
          dx = Math.max(W - this.w0, Math.min(E - this.e0, dx));
          w1 = this.w0 + dx;
          e1 = this.e0 + dx;
        }

        if (signY) {
          dy = Math.max(N - this.n0, Math.min(S - this.s0, dy));
          n1 = this.n0 + dy;
          s1 = this.s0 + dy;
        }

        break;
      }
      case MODE_HANDLE: {
        if (signX < 0) {
          w1 = clip(this.w0 + dx, W, E);
        } else if (signX > 0) {
          e1 = clip(this.e0 + dx, W, E);
        }

        if (signY < 0) {
          n1 = clip(this.n0 + dy, N, S);
        } else if (signY > 0) {
          s1 = clip(this.s0 + dy, N, S);
        }

        break;
      }
      case MODE_CENTER: {
        if (signX) {
          w1 = Math.max(W, Math.min(E, this.w0 - dx * signX));
          e1 = Math.max(W, Math.min(E, this.e0 + dx * signX));
        }

        if (signY) {
          n1 = Math.max(N, Math.min(S, this.n0 - dy * signY));
          s1 = Math.max(N, Math.min(S, this.s0 + dy * signY));
        }

        break;
      }
      default:
        throw new Error(`Unmatched case ${JSON.stringify(this.mouseMode)}`);
    }

    if (e1 < w1) {
      signX *= -1;
      [this.w0, this.e0] = [this.e0, this.w0];
      [w1, e1] = [e1, w1];

      // TODO flip cursor
      // if (type in flipX) {
      //   console.log('flip cursor');
      //   // overlay.attr("cursor", cursors[type = flipX[type]]);
      // }
    }

    if (s1 < n1) {
      signY *= -1;
      [this.n0, this.s0] = [this.s0, this.n0];
      [n1, s1] = [s1, n1];
      // TODO flip the cursor
      // if (type in flipY) {
      //   overlay.attr("cursor", cursors[type = flipY[type]]);
      // }
    }

    if (this.lockX) {
      w1 = this.state.selected[0][0];
      e1 = this.state.selected[1][0];
    }

    if (this.lockY) {
      n1 = this.state.selected[0][1];
      s1 = this.state.selected[1][1];
    }

    if (this.state.selected[0][0] !== w1
        || this.state.selected[0][1] !== n1
        || this.state.selected[1][0] !== e1
        || this.state.selected[1][1] !== s1) {
      this._setSelected([[w1, n1], [e1, s1]]);
    }
  }

  _ended(event) {
    event.stopPropagation();
    if (event.touches) {
      if (event.touches.length) {
        return;
      }
      if (this.touchending) {
        clearTimeout(this.touchending);
      }

      // Ghost clicks are delayed!
      this.touchending = setTimeout(() => {
        this.touchending = null;
        this.mouseMode = null;
      }, 500);
    } else {
      this.mouseMode = null;
    }

    //   dragEnable(event.view, moving);
    //   view.on("keydown.brush keyup.brush mousemove.brush mouseup.brush", null);
    // }

    // group.attr("pointer-events", "all");
    // overlay.attr("cursor", cursors.overlay);
    // if (empty(selection)) state.selection = null, redraw.call(that);
  }

  _mouseEnter(e) {
    if (this.props.onMouseEnter) {
      this.props.onMouseEnter(e);
    }
    // reset drag mode in case you were still dragging from a previous
    // interaction inside this box
    this.mouseMode = null;
  }

  _setSelected(selected) {
    this.setState({selected});
    if (this.props.onChange) {
      // w n e s
      this.props.onChange({
        x: selected[0][0] - this.props.domain.x,
        y: selected[0][1] - this.props.domain.y,
        width: selected[1][0] - selected[0][0],
        height: selected[1][1] - selected[0][1]
      });
    }
  }

  /**
   * Point in plotting terms relative to the parent element
   * on which this SelectArea is plotted.
   */
  _eventPoint(event) {
    return [
      event.clientX - this.props.base[0] + this.props.domain.x,
      event.clientY - this.props.base[1] + this.props.domain.y
    ];
  }

  // TODO willsetProps copy extent

  render() {
    const domain = this.props.domain;
    const selected = this.state.selected;

    let overlayTapHandler = (event) => this._started(event, {type: 'overlay'});
    let overlay = (
      <rect
        className={this.props.overlayClassName || style.overlay}
        key="overlay"
        pointerEvents="all"
        cursor={cursors.overlay}
        style={{ visibility: 'visible', cursor: cursors.overlay }}
        onMouseDown={overlayTapHandler}
        onTouchStart={overlayTapHandler}
        {...domain}
      />
    );

    let selectionTapHandler = (event) => this._started(event, {type: 'selection'});
    let selection = (
      <rect
        className={this.props.selectionClassName || style.selection}
        key="selection"
        cursor={cursors.selection}
        shapeRendering="crispEdges"
        onMouseDown={selectionTapHandler}
        onTouchStart={selectionTapHandler}
        {...box(selected)}
      />
    );

    let handles = this.dim.handles.map((h) => {
      let tapHandler = (event) => this._started(event, h);
      return (
        <rect
          key={h.type}
          className={`handle handle--${h.type}`}
          cursor={cursors[h.type]}
          x={h.x(selected)}
          y={h.y(selected)}
          width={h.width(selected)}
          height={h.height(selected)}
          onMouseDown={tapHandler}
          onTouchStart={tapHandler}
        />
      );
    });

    return (
      <g
        fill="none"
        pointerEvents="all"
        style={{
          pointerEvents: 'all',
          WebkitTapHighlightColor: 'rbga(0,0,0,0)',
          visibility: this.props.show ? 'visible' : 'hidden'
        }}
        onMouseMove={this._moved.bind(this)}
        onMouseUp={this._ended.bind(this)}
        onTouchMove={this._moved.bind(this)}
        onTouchEnd={this._ended.bind(this)}
        onMouseEnter={this._mouseEnter.bind(this)}
        {...domain}
      >
        {overlay}{selection}{handles}
      </g>
    );
  }
}
