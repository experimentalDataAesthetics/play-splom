import { isEqual } from 'lodash';

/**
 */
export function focusScatterplot(id) {
  return {
    type: 'focusScatterplot',
    payload: {
      id
    }
  };
}

export function setHovering(m, n) {
  const newState = { m, n };
  return (dispatch, getState) => {
    const same = isEqual(newState, getState().ui.hovering);
    if (!same) {
      dispatch({
        type: 'setHovering',
        payload: newState
      });
    }
  };
}

export function zoomScatterplot(id) {
  return {
    type: 'zoomScatterplot',
    payload: {
      id
    }
  };
}

export function mouseMove(event) {
  // only need x / y and
  return {
    type: 'mouseMove',
    payload: event
  };
}

export function setWindowSize(size) {
  return {
    type: 'setWindowSize',
    payload: size
  };
}

export function notify(type, message) {
  return {
    type: 'setNotification',
    payload: {
      type,
      message
    }
  };
}
