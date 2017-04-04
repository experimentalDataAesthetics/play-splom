/* eslint import/no-extraneous-dependencies: 0 */
/* eslint import/no-unresolved: 0 */
/* eslint import/extensions: 0 */
import { dialog } from 'electron';
import {
  OPEN_DATASET_DIALOG,
  LOAD_DATASET,
  SET_MASTER_CONTROLS,
  SPAWN_SYNTH,
  SPAWN_SYNTHS,
  SET_LOOP
} from '../actionTypes';

/**
 * This runs on the main process and should be included in background.js
 * It handles actions sent from the renderer process using `callActionOnMain`.
 */
export default function handleActionOnMain(event, action, soundApp) {
  switch (action.type) {
    case OPEN_DATASET_DIALOG:
      dialog.showOpenDialog(fileNames => {
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
    case SPAWN_SYNTH:
      soundApp.spawnSynth(action.payload);
      break;
    case SPAWN_SYNTHS:
      soundApp.spawnSynths(action.payload);
      break;
    case SET_MASTER_CONTROLS:
      soundApp.setMasterControls(action.payload);
      break;
    case SET_LOOP:
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
