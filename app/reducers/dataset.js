export default function(state = null, action) {
  switch (action.type) {
    case 'selectDataset':
      return action.payload;
    default:
      return state;
  }
}
