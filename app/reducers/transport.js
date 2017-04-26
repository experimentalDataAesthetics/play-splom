import u from 'updeep';

export default {
  playing: false,
  recording: false
};

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

export function zoomScatterplot(state, action) {
  return u(
    {
      zoomed: action.payload
    },
    state
  );
}
