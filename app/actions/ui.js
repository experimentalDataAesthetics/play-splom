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

/**
 * Zoom to this box. If already zoomed to this box then zoom back out to full.
 *
 * @param {m, n} box
 */
export function toggleZoomScatterplot(box) {
  return {
    type: 'toggleZoomScatterplot',
    payload: box
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
