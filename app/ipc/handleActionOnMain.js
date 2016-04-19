'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = handleActionOnMain;

var _actionTypes = require('../actionTypes');

const dialog = require('electron').dialog;


/**
 * This runs on the main process and should be included in background.js
 * It handles actions sent from callActionOnMain.
 */
function handleActionOnMain(event, action, soundApp) {
  switch (action.type) {
    case _actionTypes.OPEN_DATASET_DIALOG:
      dialog.showOpenDialog(fileNames => {
        if (fileNames && fileNames.length) {
          reply(event, {
            type: _actionTypes.LOAD_DATASET,
            payload: {
              path: fileNames[0]
            }
          });
        }
      });

      break;
    case _actionTypes.SPAWN_SYNTH:
      soundApp.spawnSynth(action.payload);
      break;
    case _actionTypes.SPAWN_SYNTHS:
      soundApp.spawnSynths(action.payload);
      break;
    case _actionTypes.SET_MASTER_CONTROLS:
      soundApp.setMasterControls(action.payload);
      break;
    case _actionTypes.SET_LOOP:
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
module.exports = exports['default'];

