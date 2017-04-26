import u from 'updeep';

const initial = {
  playing: false,
  recording: false
};

export default function(state = initial, action) {
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

    default:
      return state;
  }
}
