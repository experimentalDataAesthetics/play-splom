
// Modules authored in this project are intended to be
// imported through new ES6 import syntax
// Node.js modules and those from npm
// are required using require()

const React = require('react');
const ReactDOM = require('react-dom');
const Provider = require('react-redux').Provider;
const ReactRouter = require('react-router');
// where does history come from ?
const createHashHistory = require('history').createHashHistory;
let injectTapEventPlugin = require('react-tap-event-plugin');
let h = require('react-hyperscript');

import configureStore from './store/configureStore';
import routes from './routes';

let qk = {queryKey: false};
const history = ReactRouter.useRouterHistory(createHashHistory)(qk);
const store = configureStore();

// connect two-way calling of actions
// the other half is in background.js
const ipcRenderer = require('electron').ipcRenderer;
import handleActionOnRenderer from './ipc/handleActionOnRenderer';
ipcRenderer.on('dispatch-action', (sender, action) => {
  handleActionOnRenderer(store.dispatch, sender, action);
});

// window.env contains data from config/env_XXX.json file.
// var envName = window.env.name;

// Needed for onTouchTap
// Can go away when react 1.0 release
// material-ui requires this for click events
// as well as touch
injectTapEventPlugin();

document.addEventListener('DOMContentLoaded', () => {

  ReactDOM.render(
    h(Provider, {store}, [
      h(ReactRouter.Router, {history, routes})
    ]),
    document.getElementById('content')
  );

});
