export default function(state = null, action) {
  switch (action.type) {
    case 'selectSound':
      return action.payload;
    default:
      return state;
  }
}
