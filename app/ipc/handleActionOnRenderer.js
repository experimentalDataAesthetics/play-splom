import log from 'electron-log';
import { LOAD_DATASET, ERROR_ON_MAIN } from '../actionTypes';
import { loadDataset } from '../actions/datasets';
import { notify } from '../actions/ui';

/**
 * This runs on the main process and should be included in background.js
 * It handles actions sent from callActionOnMain.
 */
export default function(dispatch, sender, action) {
  switch (action.type) {
    // Special cases: if async is needed then use an action creator
    // which does the async and then dispatches an action.
    // there is middleware added to dispatch that recognizes thunks (functions)
    case LOAD_DATASET:
      dispatch(loadDataset(action.payload.path));
      break;
    case ERROR_ON_MAIN: {
      const msg = [
        `ERROR on main: ${action.payload.message}`,
        action.payload.data,
        action.payload.stack
      ];
      log.error(...msg);
      console.error(...msg);
      dispatch(notify('error', action.payload.message));
      break;
    }
    default:
      // dispatch the action directly
      dispatch(action);
  }
}

/**
 * Send a reply to the main process
 * in the form of a FSA (flux standard action)
 */
// function reply(sender, action) {
//   console.log('call-action-on-main', sender, action);
//   sender.send('call-action-on-main', action);
// }
