const dialog = require('electron').dialog;
import {OPEN_DATASET_DIALOG, LOAD_DATASET} from '../actionTypes';

/**
 * This runs on the main process and should be included in background.js
 * It handles actions sent from callActionOnMain.
 */
export default function(event, action) {

  switch (action.type) {
    case OPEN_DATASET_DIALOG:
      dialog.showOpenDialog(function(fileNames) {
        if (fileNames && fileNames.length) {
          reply(event, {
             type: LOAD_DATASET,
             payload: {
               path: fileNames[0]
             }
           });
        }
      });

      break;
    default:
      throw new Exception('Unmatched action', action);
  }
}

/**
 * Send a reply to the renderer process
 * in the form of a FSA (flux standard action)
 */
function reply(event, action) {
  event.sender.send('dispatch-action', action);
}
