import u from 'updeep';
import defaultTheme from '../theme';

export default {
  focused: null,
  hovering: null,
  zoomed: null,
  mouse: null,
  brush: null,
  notification: null,
  windowSize: {
    width: window.innerWidth,
    height: window.innerHeight
  },
  muiTheme: defaultTheme()
};

/**
 * To unfocus, set focused to null. same with hovering and zoomed
 */
export function focusScatterplot(state, action) {
  return u(
    {
      focused: action.payload
    },
    state
  );
}

export function setHovering(state, action) {
  return u(
    {
      hovering: action.payload
    },
    state
  );
}

export function toggleZoomScatterplot(state, action) {
  const current = state.zoomed || {};
  const alreadySet = current.m === action.payload.m && current.n === action.payload.n;
  return u(
    {
      zoomed: alreadySet ? null : action.payload
    },
    state
  );
}

// in svg frame
export function mouseMove(state, action) {
  return u(
    {
      mouse: action.payload
    },
    state
  );
}

export function showBrush(state, action) {
  return u(
    {
      brush: action.payload
    },
    state
  );
}

export function setWindowSize(state, action) {
  return u(
    {
      windowSize: action.payload
    },
    state
  );
}

export function setNotification(state, action) {
  return u(
    {
      notification: action.payload
    },
    state
  );
}
