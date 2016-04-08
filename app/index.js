import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';
import routes from './routes';
import configureStore from './store/configureStore';
// import './stylesheets/main.less';
import './app.global.css';
import { loadSounds } from './actions/sounds';
import config from '../config';

const store = configureStore();
const history = syncHistoryWithStore(hashHistory, store);

// connect two-way calling of actions
// the other half is in background.js
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

render(
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>,
  document.getElementById('root')
);

store.dispatch(loadSounds(config.synthDefsDir));
