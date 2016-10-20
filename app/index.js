/* eslint global-require: 0 */
/* eslint import/no-unresolved: 0 */
/* eslint import/extensions: 0 */
/* eslint import/no-extraneous-dependencies: 0 */

/**
 * The frontend application.
 */
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { join } from 'path';
import { ipcRenderer } from 'electron';
import routes from './routes';
import configureStore from './store/configureStore';
import { readDefaultDatasets } from './actions/datasets';
import { selectSound } from './actions/sounds';
import { mapXYtoParam } from './actions/mapping';
import handleActionOnRenderer from './ipc/handleActionOnRenderer';
import connectSoundApp from './sound/connectSoundApp';
import callActionOnMain from './ipc/callActionOnMain';
import './app.global.css';

const store = configureStore();
const history = syncHistoryWithStore(hashHistory, store);

// Connect two-way calling of actions between renderer and main.
// Tthe other half is in main.development.js
ipcRenderer.on('dispatch-action', (sender, action) => {
  handleActionOnRenderer(store.dispatch, sender, action);
});

// Listen to redux store changes and call actions on main thread to create sounds
connectSoundApp(store, callActionOnMain);

// Needed for onTouchTap and material-ui
// Can go away when react 1.0 is released
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

// Add right click inspect element context menu
if (process.env.NODE_ENV !== 'production') {
  require('debug-menu').install();
}

render(
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>,
  document.getElementById('root')
);

// Read vendor/datasets and populate the menu then load IRIS
const appRoot = process.env.NODE_ENV === 'production' ? __dirname : join(__dirname, '../app');
const datasetsDir = join(appRoot, 'vendor/datasets');
store.dispatch(readDefaultDatasets(datasetsDir, join(datasetsDir, 'iris.csv')));

store.dispatch(selectSound('grainFM'));
store.dispatch(mapXYtoParam('x', 'modfreq'));
store.dispatch(mapXYtoParam('y', 'carfreq'));
