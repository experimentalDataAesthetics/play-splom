import {FOCUS_SCATTERPLOT, SET_HOVERING, ZOOM_SCATTERPLOT} from '../actionTypes';
const u = require('updeep');

const initial = {
  playing: false,
  recording: false
};

export default function(state=initial, action) {
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

    default:
      return state;
  }
}
