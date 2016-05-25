import { isEqual } from 'lodash';
import {
  MOUSE_MOVE,
  FOCUS_SCATTERPLOT,
  SET_HOVERING,
  ZOOM_SCATTERPLOT,
  SET_WINDOW_SIZE,
  SET_NOTIFICATION
} from '../actionTypes';

/**
 */
export function focusScatterplot(id) {
  return {
    type: FOCUS_SCATTERPLOT,
    payload: {
      id
    }
  };
}

export function setHovering(m, n) {
  const newState = {m, n};
  return (dispatch, getState) => {
    const same = isEqual(newState, getState().ui.hovering);
    if (!same) {
      dispatch({
        type: SET_HOVERING,
        payload: newState
      });
    }
  };
}

export function zoomScatterplot(id) {
  return {
    type: ZOOM_SCATTERPLOT,
    payload: {
      id
    }
  };
}

export function mouseMove(event) {
  // only need x / y and
  return {
    type: MOUSE_MOVE,
    payload: event
  };
}

export function setWindowSize(size) {
  return {
    type: SET_WINDOW_SIZE,
    payload: size
  };
}

export function notify(type, message) {
  return {
    type: SET_NOTIFICATION,
    payload: {
      type,
      message
    }
  };
}
