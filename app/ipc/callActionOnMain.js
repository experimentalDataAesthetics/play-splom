
const ipcRenderer = require('electron').ipcRenderer;

/**
 * This runs in the renderer process
 * To call actions on the main process
 * for large files, opening system dialogs etc.
 */
export default function callActionOnMain(action) {
  ipcRenderer.send('call-action-on-main', action);
}
