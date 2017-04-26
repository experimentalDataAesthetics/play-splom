/* eslint import/no-extraneous-dependencies: 0 */
/* eslint import/no-unresolved: 0 */
/* eslint import/extensions: 0 */
import { dialog } from 'electron';

/**
 * This runs on the main process and should be included in background.js
 * It handles actions sent from the renderer process using `callActionOnMain`.
 */
export default function handleActionOnMain(event, action, soundApp) {
  switch (action.type) {
    case 'openDatasetDialog':
      dialog.showOpenDialog(fileNames => {
        if (fileNames && fileNames.length) {
          reply(event, {
            type: 'loadDataset',
            payload: {
              path: fileNames[0]
            }
          });
        }
      });

      break;
    case 'spawnSynth':
      soundApp.spawnSynth(action.payload);
      break;
    case 'spawnSynths':
      soundApp.spawnSynths(action.payload);
      break;
    case 'setMasterControls':
      soundApp.setMasterControls(action.payload);
      break;
    case 'setLoop':
      soundApp.setLoop(action.payload);
      break;
    // FREE_ALL
    // SET_SEQUENCE
    default:
      throw new Error('Unmatched action', action);
  }
}

/**
 * Send a reply to the renderer process
 * in the form of a FSA (flux standard action)
 */
function reply(event, action) {
  event.sender.send('dispatch-action', action);
}
