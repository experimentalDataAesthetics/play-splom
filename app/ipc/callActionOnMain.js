/* eslint import/no-extraneous-dependencies: 0 */
/* eslint import/no-unresolved: 0 */
/* eslint import/extensions: 0 */
import {ipcRenderer} from 'electron';

/**
 * This runs in the renderer process
 * To call actions on the main process
 * for large files, opening system dialogs etc.
 */
export default function callActionOnMain(action) {
  ipcRenderer.send('call-action-on-main', action);
}
