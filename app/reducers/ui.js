import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';

import {
  FOCUS_SCATTERPLOT,
  SET_HOVERING,
  ZOOM_SCATTERPLOT,
  MOUSE_MOVE,
  SHOW_BRUSH,
  SET_WINDOW_SIZE
} from '../actionTypes';
import u from 'updeep';

const initial = {
  focused: null,
  hovering: null,
  zoomed: null,
  mouse: null,
  brush: null,
  windowSize: {
    width: window.innerWidth,
    height: window.innerHeight
  },
  muiTheme: getMuiTheme(darkBaseTheme)
};

/**
 * To unfocus, set focused to null. same with hovering and zoomed
 */
export default function ui(state = initial, action) {
  switch (action.type) {

    case FOCUS_SCATTERPLOT:
      return u({
        focused: action.payload
      }, state);

    case SET_HOVERING:
      return u({
        hovering: action.payload
      }, state);

    case ZOOM_SCATTERPLOT:
      return u({
        zoomed: action.payload
      }, state);

    // in svg frame
    case MOUSE_MOVE:
      return u({
        mouse: action.payload
      }, state);

    case SHOW_BRUSH:
      return u({
        brush: action.payload
      }, state);

    case SET_WINDOW_SIZE:
      return u({
        windowSize: action.payload
      }, state);

    default:
      return state;
  }
}
