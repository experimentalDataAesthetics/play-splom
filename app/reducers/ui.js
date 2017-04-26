import u from 'updeep';
import defaultTheme from '../theme';

const initial = {
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
export default function ui(state = initial, action) {
  switch (action.type) {
    case 'focusScatterplot':
      return u(
        {
          focused: action.payload
        },
        state
      );

    case 'setHovering':
      return u(
        {
          hovering: action.payload
        },
        state
      );

    case 'zoomScatterplot':
      return u(
        {
          zoomed: action.payload
        },
        state
      );
    // in svg frame
    case 'mouseMove':
      return u(
        {
          mouse: action.payload
        },
        state
      );

    case 'showBrush':
      return u(
        {
          brush: action.payload
        },
        state
      );

    case 'setWindowSize':
      return u(
        {
          windowSize: action.payload
        },
        state
      );

    case 'setNotification':
      return u(
        {
          notification: action.payload
        },
        state
      );

    default:
      return state;
  }
}
