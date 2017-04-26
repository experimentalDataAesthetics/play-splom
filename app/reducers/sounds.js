export default function sounds(state = [], action) {
  switch (action.type) {
    case 'setSounds':
      return action.payload;
    default:
      return state;
  }
}
