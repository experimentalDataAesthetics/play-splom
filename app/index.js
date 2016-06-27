/* eslint global-require: 0 */
/**
 * The frontend application.
 */
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';
import routes from './routes';
import configureStore from './store/configureStore';
import { loadInternalDataset } from './actions/datasets';
import { selectSound } from './actions/sounds';
import { mapXYtoParam } from './actions/mapping';

import './app.global.css';
import { join } from 'path';

// how ironic, the path to config is different
// const config = require(production ? './config/index' : '../config/index');
// console.log('dirname', __dirname);

const store = configureStore();
const history = syncHistoryWithStore(hashHistory, store);

// connect two-way calling of actions
// the other half is in main.js
const ipcRenderer = require('electron').ipcRenderer;
import handleActionOnRenderer from './ipc/handleActionOnRenderer';
ipcRenderer.on('dispatch-action', (sender, action) => {
  handleActionOnRenderer(store.dispatch, sender, action);
});

// listen to redux store changes and call actions on main thread
// to create sounds
import connectSoundApp from './sound/connectSoundApp';
import callActionOnMain from './ipc/callActionOnMain';
connectSoundApp(store, callActionOnMain);

// Needed for onTouchTap and material-ui
// Can go away when react 1.0 release
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

// add right click inspect element context menu
if (process.env.NODE_ENV !== 'production') {
  require('debug-menu').install();
}

render(
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>,
  document.getElementById('root')
);

// load an initial dataset and sound
const appRoot = process.env.NODE_ENV === 'production' ? __dirname : join(__dirname, '../app');
const iris = join(appRoot, 'vendor/datasets', 'iris.csv');
store.dispatch(loadInternalDataset(iris));

store.dispatch(selectSound('grainFM'));
store.dispatch(mapXYtoParam('x', 'modfreq'));
store.dispatch(mapXYtoParam('y', 'carfreq'));
